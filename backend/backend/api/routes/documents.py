from fastapi import APIRouter, UploadFile, File, HTTPException
from worker.pdf_processing_worker import run_pdf_worker

router = APIRouter()

@router.post("/projects/{project_id}/upload")
async def upload_document(
    project_id: str,
    document_phase: str,
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Only PDF files accepted")
    
    file_bytes = await file.read()
    
    result = run_pdf_worker(
        file_bytes=file_bytes,
        file_name=file.filename,
        project_id=project_id,
        document_phase=document_phase
    )
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result