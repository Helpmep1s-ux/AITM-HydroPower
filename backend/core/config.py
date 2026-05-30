from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    GEMINI_API_KEY: str

    class Config:
        env_file = Path(__file__).resolve().parents[2] / ".env"

settings = Settings()