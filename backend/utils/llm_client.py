from google import genai
from core.config import settings
import json
import re

client = genai.Client(
    api_key=settings.GEMINI_API_KEY,
    http_options={'api_version': 'v1'}
)

def score_eia_against_ps(ps_number: int, ps_name: str, ps_content: str, eia_chunks: list[str]) -> dict:
    """Send EIA chunks + IFC PS to Gemini and get compliance score."""
    
    eia_text = "\n\n---\n\n".join(eia_chunks)
    
    prompt = f"""You are a strict IFC Performance Standards compliance auditor for hydropower projects.

IFC Performance Standard {ps_number}: {ps_name}

REQUIREMENTS:
{ps_content}

RELEVANT SECTIONS FROM THE EIA DOCUMENT:
{eia_text}

Analyze how well the EIA addresses the requirements of PS{ps_number}.

Return ONLY a JSON object in this exact format, nothing else:
{{
  "ps_number": {ps_number},
  "ps_name": "{ps_name}",
  "score": <integer 0-100>,
  "status": "<one of: compliant, partial, non_compliant>",
  "reasoning": "<2-3 sentences explaining the score>",
  "red_flags": [
    {{
      "flag_text": "<specific gap or missing requirement>",
      "severity": "<one of: high, medium, low>"
    }}
  ]
}}

Scoring guide:
- 80-100: compliant — requirements clearly addressed
- 50-79: partial — some requirements addressed but gaps exist
- 0-49: non_compliant — requirements largely missing or inadequate
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    
    raw = response.text.strip()
    raw = re.sub(r"```json|```", "", raw).strip()
    
    return json.loads(raw)