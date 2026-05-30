const BASE_URL = "http://localhost:8000/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Project = {
  id: string;
  name: string;
  developer: string;
  location: string;
  phase: "scoping" | "construction" | "operation";
  created_at: string;
};

export type UploadResult = {
  status: "success" | "error";
  chunks_stored: number;
  pages_extracted: number;
  pages_failed: number[];
  metadata: {
    title?: string;
    author?: string;
    total_pages?: number;
  };
};

export type Flag = {
  flag_text: string;
  severity: "high" | "medium" | "low";
};

export type PSScore = {
  ps_number: number;
  ps_name: string;
  score: number;
  status: "compliant" | "partial" | "non_compliant";
  reasoning: string;
  red_flags: Flag[];
};

export type AnalysisResults = {
  project_id: string;
  project_name: string;
  developer: string;
  location: string;
  phase: string;
  overall_score: number;
  compliance_summary: "compliant" | "partial" | "non_compliant";
  ps_scores: PSScore[];
  total_flags: number;
  high_severity_flags: number;
  medium_severity_flags: number;
  low_severity_flags: number;
  generated_at: string;
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function createProject(
  name: string,
  developer: string,
  location: string,
  phase: "scoping" | "construction" | "operation" = "scoping"
): Promise<{ project_id: string }> {
  const params = new URLSearchParams({ name, developer, location, phase });
  const res = await fetch(`${BASE_URL}/projects?${params}`, { method: "POST" });
  if (!res.ok) throw new Error(`Failed to create project: ${res.statusText}`);
  return res.json();
}

export async function getProjects(): Promise<{ projects: Project[] }> {
  const res = await fetch(`${BASE_URL}/projects`);
  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.statusText}`);
  return res.json();
}

export async function getProject(projectId: string): Promise<Project> {
  const res = await fetch(`${BASE_URL}/projects/${projectId}`);
  if (!res.ok) throw new Error(`Failed to fetch project: ${res.statusText}`);
  return res.json();
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function uploadDocument(
  projectId: string,
  documentPhase: string,
  file: File
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const params = new URLSearchParams({ document_phase: documentPhase });
  const res = await fetch(
    `${BASE_URL}/projects/${projectId}/upload?${params}`,
    { method: "POST", body: formData }
  );
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
  return res.json();
}

// ─── Analysis ─────────────────────────────────────────────────────────────────

export async function analyzeProject(
  projectId: string
): Promise<{ message: string; ps_scored: number }> {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/analyze`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Analysis failed: ${res.statusText}`);
  return res.json();
}

export async function getResults(projectId: string): Promise<AnalysisResults> {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/results`);
  if (!res.ok) throw new Error(`Failed to fetch results: ${res.statusText}`);
  return res.json();
}