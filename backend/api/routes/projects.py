from fastapi import APIRouter, HTTPException
from core.database import supabase
import uuid

router = APIRouter()

@router.post("/projects")
async def create_project(name: str, developer: str, location: str, phase: str = "scoping"):
    project_id = str(uuid.uuid4())
    supabase.table("projects").insert({
        "id": project_id,
        "name": name,
        "developer": developer,
        "location": location,
        "phase": phase
    }).execute()
    return {"project_id": project_id, "message": "Project created successfully"}

@router.get("/projects")
async def get_projects():
    result = supabase.table("projects").select("*").order("created_at", desc=True).execute()
    return {"projects": result.data}

@router.get("/projects/{project_id}")
async def get_project(project_id: str):
    result = supabase.table("projects").select("*").eq("id", project_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return result.data