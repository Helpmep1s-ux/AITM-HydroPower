import { apiFetch } from "./client";

export type Project = {
  id: string;
  name: string;
  developer: string | null;
  location: string | null;
  phase: string | null;
  created_at: string | null;
};

export type ProjectsResponse = {
  projects: Project[];
};

export async function getProjects(): Promise<Project[]> {
  const data = await apiFetch<ProjectsResponse>("/api/projects");
  return data.projects;
}

export async function getProject(id: string): Promise<Project> {
  return apiFetch<Project>(`/api/projects/${id}`);
}

export async function createProject(payload: {
  name: string;
  developer: string;
  location: string;
  phase?: string;
}): Promise<{ project_id: string; message: string }> {
  const params = new URLSearchParams({
    name: payload.name,
    developer: payload.developer,
    location: payload.location,
    phase: payload.phase ?? "scoping",
  });
  return apiFetch(`/api/projects?${params.toString()}`, { method: "POST" });
}

export async function uploadDocument(
  projectId: string,
  file: File,
  documentPhase: string,
): Promise<{ status: string; chunks_stored?: number; pages_extracted?: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const params = new URLSearchParams({ document_phase: documentPhase });

  const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
  const res = await fetch(
    `${BASE_URL}/api/projects/${projectId}/upload?${params.toString()}`,
    { method: "POST", body: formData },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text);
  }

  return res.json();
}

export function saveActiveProjectId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bridgehydro:project-id", id);
}

export function getActiveProjectId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("bridgehydro:project-id") ?? "";
}