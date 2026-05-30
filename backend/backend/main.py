from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import projects, documents, analysis

app = FastAPI(title="EIA Compliance Checker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(analysis.router, prefix="/api")