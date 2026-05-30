from services.document_services import process_and_store_eia

def run_pdf_worker(
    file_bytes: bytes,
    file_name: str,
    project_id: str,
    document_phase: str
):
    """Entry point called by the FastAPI route."""
    try:
        result = process_and_store_eia(
            file_bytes=file_bytes,
            file_name=file_name,
            project_id=project_id,
            document_phase=document_phase
        )
        return {"status": "success", **result}
    except Exception as e:
        return {"status": "error", "message": str(e)}