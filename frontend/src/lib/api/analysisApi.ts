import { apiFetch } from "./client";

export type PSScore = {
  ps_number: number;
  ps_name: string;
  score: number;
  status: string;
  reasoning: string;
  red_flags: { flag_text: string; severity: string }[];
};

export type AuditResults = {
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

export async function getAuditResults(projectId: string): Promise<AuditResults> {
  return apiFetch<AuditResults>(`/api/projects/${projectId}/results`);
}

export async function triggerAnalysis(projectId: string): Promise<{ message: string; ps_scored: number }> {
  return apiFetch(`/api/projects/${projectId}/analyze`, { method: "POST" });
}