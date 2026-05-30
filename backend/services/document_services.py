from utils.pdf_pipeline import process_pdf, PDFExtractionError
from services.storage_services import get_embedding
from core.database import supabase
import io

def process_and_store_eia(
    file_bytes: bytes,
    file_name: str,
    project_id: str,
    document_phase: str
):
    """Full pipeline: PDF bytes → chunks → embeddings → Supabase."""
    
    # Step 1: Parse PDF into chunks
    result = process_pdf(
        file_obj=io.BytesIO(file_bytes),
        file_name=file_name
    )
    
    if not result.chunks:
        raise ValueError("No text could be extracted from the PDF.")
    
    print(f"Extracted {len(result.chunks)} chunks from {file_name}")
    
    # Step 2: Embed and store each chunk
    for chunk in result.chunks:
        if not chunk.text or not chunk.text.strip():
            continue  # skip empty chunks
        
    embedding = get_embedding(chunk.text)
    
    supabase.table("eia_chunks").insert({
        "project_id": project_id,
        "document_phase": document_phase,
        "chunk_index": chunk.chunk_index,
        "content": chunk.text,
        "embedding": embedding
    }).execute()
    
    print(f"Stored {len(result.chunks)} chunks for project {project_id}")
    return {
        "chunks_stored": len(result.chunks),
        "pages_extracted": result.pages_extracted,
        "pages_failed": result.pages_failed,
        "metadata": result.metadata
    }