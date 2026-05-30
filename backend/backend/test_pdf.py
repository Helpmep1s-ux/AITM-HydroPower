from worker.pdf_processing_worker import run_pdf_worker

with open(r"..\..\docs\UTdoc2.pdf", "rb") as f:
    file_bytes = f.read()

result = run_pdf_worker(
    file_bytes=file_bytes,
    file_name="UTdoc2.pdf",
    project_id="00000000-0000-0000-0000-000000000001",
    document_phase="full_eia"
)

print(result)