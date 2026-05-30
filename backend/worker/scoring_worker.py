from core.database import supabase
from utils.llm_client import score_eia_against_ps
from services.score_services import store_score, store_flags

def run_scoring_worker(project_id: str):
    """Score EIA against all IFC Performance Standards."""
    
    # Clear previous results before re-scoring
    supabase.table("scores").delete().eq("project_id", project_id).execute()
    supabase.table("flags").delete().eq("project_id", project_id).execute()
    
    # Get all IFC standards
    ifc_result = supabase.table("ifc_standards").select("*").execute()
    ifc_standards = ifc_result.data
    
    if not ifc_standards:
        return {"status": "error", "message": "No IFC standards found in database"}
    
    results = []
    
    # Group by PS number
    ps_groups = {}
    for standard in ifc_standards:
        ps_num = standard["ps_number"]
        if ps_num not in ps_groups:
            ps_groups[ps_num] = {
                "ps_name": standard["ps_name"],
                "content_chunks": []
            }
        ps_groups[ps_num]["content_chunks"].append(standard["content"])
    
    # Score each PS
    for ps_number, ps_data in ps_groups.items():
        print(f"Scoring PS{ps_number}: {ps_data['ps_name']}...")
        
        # Find relevant EIA chunks using vector similarity
        ps_content = " ".join(ps_data["content_chunks"])
        
        # Get embedding of PS content to find relevant EIA chunks
        from backend.services.storage_services import get_embedding
        ps_embedding = get_embedding(ps_content)
        
        # Query most relevant EIA chunks
        relevant_chunks = supabase.rpc("match_eia_chunks", {
            "query_embedding": ps_embedding,
            "project_filter": project_id,
            "match_count": 5
        }).execute()
        
        if not relevant_chunks.data:
            print(f"  No relevant EIA chunks found for PS{ps_number}, skipping.")
            continue
        
        eia_texts = [chunk["content"] for chunk in relevant_chunks.data]
        
        # Score with LLM
        score_data = score_eia_against_ps(
            ps_number=ps_number,
            ps_name=ps_data["ps_name"],
            ps_content=ps_content,
            eia_chunks=eia_texts
        )
        
        # Store results
        store_score(project_id, score_data)
        store_flags(project_id, ps_number, score_data.get("red_flags", []))
        
        print(f"  ✓ PS{ps_number} score: {score_data['score']} — {score_data['status']}")
        results.append(score_data)
    
    return {"status": "success", "results": results}