export type ProjectDraft = {
  name: string;
  capacity: number;
  financier: string;
  basin: string;
};

export type UploadedDoc = {
  name: string;
  size: number;
  kind: "pdf" | "doc";
  verifiedBy?: string;
  uploadedAt?: string;
};

const KEY = "bridgehydro:active-project";
const DOCS_KEY = "bridgehydro:active-docs";

export const defaultProject: ProjectDraft = {
  name: "Upper Tamakoshi Extension",
  capacity: 456,
  financier: "World Bank / IFC",
  basin: "Koshi",
};

export function saveProject(p: ProjectDraft) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function loadProject(): ProjectDraft {
  if (typeof window === "undefined") return defaultProject;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProject;
    return { ...defaultProject, ...JSON.parse(raw) };
  } catch {
    return defaultProject;
  }
}

export function saveDocs(docs: UploadedDoc[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
}

export function loadDocs(): UploadedDoc[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DOCS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
