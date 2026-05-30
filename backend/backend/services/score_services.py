from core.database import supabase
from datetime import datetime

def store_score(project_id: str, score_data: dict):
    """Store PS compliance score in Supabase."""
    supabase.table("scores").insert({
        "project_id": project_id,
        "ps_number": score_data["ps_number"],
        "ps_name": score_data["ps_name"],
        "score": score_data["score"],
        "status": score_data["status"],
        "reasoning": score_data["reasoning"]
    }).execute()

def store_flags(project_id: str, ps_number: int, red_flags: list):
    """Store red flags in Supabase."""
    for flag in red_flags:
        supabase.table("flags").insert({
            "project_id": project_id,
            "ps_number": ps_number,
            "flag_text": flag["flag_text"],
            "severity": flag["severity"]
        }).execute()

def get_audit_results(project_id: str) -> dict:
    """Assemble master JSON from scores and flags tables."""
    
    # Fetch project details
    project = supabase.table("projects")\
        .select("*")\
        .eq("id", project_id)\
        .single()\
        .execute()
    
    if not project.data:
        raise ValueError(f"Project {project_id} not found")
    
    # Fetch all scores for this project
    scores = supabase.table("scores")\
        .select("*")\
        .eq("project_id", project_id)\
        .order("ps_number")\
        .execute()
    
    # Fetch all flags for this project
    flags = supabase.table("flags")\
        .select("*")\
        .eq("project_id", project_id)\
        .execute()
    
    # Group flags by ps_number
    flags_by_ps = {}
    for flag in flags.data:
        ps_num = flag["ps_number"]
        if ps_num not in flags_by_ps:
            flags_by_ps[ps_num] = []
        flags_by_ps[ps_num].append({
            "flag_text": flag["flag_text"],
            "severity": flag["severity"]
        })
    
    # Build ps_scores list
    ps_scores = []
    total_score = 0
    for score in scores.data:
        ps_num = score["ps_number"]
        ps_scores.append({
            "ps_number": ps_num,
            "ps_name": score["ps_name"],
            "score": score["score"],
            "status": score["status"],
            "reasoning": score["reasoning"],
            "red_flags": flags_by_ps.get(ps_num, [])
        })
        total_score += score["score"]
    
    # Calculate overall score
    overall_score = round(total_score / len(ps_scores)) if ps_scores else 0
    
    # Calculate compliance summary
    if overall_score >= 80:
        compliance_summary = "compliant"
    elif overall_score >= 50:
        compliance_summary = "partial"
    else:
        compliance_summary = "non_compliant"
    
    # Count flags by severity
    all_flags = flags.data
    high_severity = len([f for f in all_flags if f["severity"] == "high"])
    medium_severity = len([f for f in all_flags if f["severity"] == "medium"])
    low_severity = len([f for f in all_flags if f["severity"] == "low"])
    
    return {
        "project_id": project_id,
        "project_name": project.data["name"],
        "developer": project.data["developer"],
        "location": project.data["location"],
        "phase": project.data["phase"],
        "overall_score": overall_score,
        "compliance_summary": compliance_summary,
        "ps_scores": ps_scores,
        "total_flags": len(all_flags),
        "high_severity_flags": high_severity,
        "medium_severity_flags": medium_severity,
        "low_severity_flags": low_severity,
        "generated_at": datetime.utcnow().isoformat()
    }