from fastapi import APIRouter, HTTPException
from worker.scoring_worker import run_scoring_worker
from services.score_services import get_audit_results

router = APIRouter()

@router.post("/projects/{project_id}/analyze")
async def analyze_project(project_id: str):
    result = run_scoring_worker(project_id)
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return {"message": "Analysis complete", "ps_scored": len(result["results"])}

@router.get("/projects/{project_id}/results")
async def get_results(project_id: str):
    try:
        result = get_audit_results(project_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))