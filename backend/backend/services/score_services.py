from core.database import supabase

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