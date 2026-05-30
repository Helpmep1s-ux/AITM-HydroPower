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