from google import genai
from google.genai import types
from core.config import settings
from core.database import supabase

client = genai.Client(api_key=settings.GEMINI_API_KEY, http_options={'api_version': 'v1'})

def get_embedding(text: str) -> list[float]:
    result = client.models.embed_content(
        model="gemini-embedding-2",
        contents=text
    )
    embedding = result.embeddings[0].values
    # Truncate to 768 to match DB column
    return embedding[:768]

def store_ifc_chunk(ps_number: int, ps_name: str, section: str, content: str):
    """Embed and store one IFC standard chunk."""
    embedding = get_embedding(content)
    supabase.table("ifc_standards").insert({
        "ps_number": ps_number,
        "ps_name": ps_name,
        "section": section,
        "content": content,
        "embedding": embedding
    }).execute()

def query_ifc_standards(query_text: str, ps_number: int = None, top_k: int = 5):
    """Find most relevant IFC chunks for a given EIA text."""
    embedding = get_embedding(query_text)
    
    # Supabase RPC for vector similarity search
    params = {
        "query_embedding": embedding,
        "match_count": top_k
    }
    if ps_number:
        params["filter_ps"] = ps_number

    result = supabase.rpc("match_ifc_standards", params).execute()
    return result.data