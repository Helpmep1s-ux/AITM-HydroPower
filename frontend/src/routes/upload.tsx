import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Settings,
  HelpCircle,
  LayoutGrid,
  FolderCog,
  FileText,
  ScrollText,
  BarChart2,
  Shield,
  LifeBuoy,
  Zap,
  Landmark,
  FileUp,
  X,
} from "lucide-react";
import { loadProject, saveDocs, type ProjectDraft } from "@/lib/project-cache";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [{ title: "Upload Compliance Documents — BridgeHydro" }],
  }),
  component: UploadPage,
});

type FileItem = {
  id: string;
  name: string;
  size: number;
  progress: number;
  kind: "pdf" | "doc";
};

function UploadPage() {
  const [project, setProject] = useState<ProjectDraft | null>(null);
  const [files, setFiles] = useState<FileItem[]>([
    { id: "seed-1", name: "EIA_Draft_v1_Final_Review.pdf", size: 12_400_000, progress: 100, kind: "pdf" },
    { id: "seed-2", name: "Site_Survey_Topography_2024.pdf", size: 6_000_000, progress: 45, kind: "pdf" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = () => {
    saveDocs(
      files.map((f) => ({
        name: f.name,
        size: f.size,
        kind: f.kind,
        verifiedBy: f.progress >= 100 ? "John Doe" : "System",
        uploadedAt: new Date().toISOString(),
      })),
    );
    navigate({ to: "/dashboard" });
  };

  useEffect(() => {
    setProject(loadProject());
  }, []);

  // simulate progress for any file < 100
  useEffect(() => {
    const t = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.progress < 100 ? { ...f, progress: Math.min(100, f.progress + Math.random() * 8) } : f,
        ),
      );
    }, 700);
    return () => clearInterval(t);
  }, []);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next: FileItem[] = Array.from(incoming)
      .filter((f) => f.name.toLowerCase().endsWith(".pdf") || f.type === "application/pdf")
      .map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        size: f.size,
        progress: 0,
        kind: "pdf" as const,
      }));
    setFiles((prev) => [...prev, ...next]);
  };

  const totalMb = (files.reduce((s, f) => s + f.size, 0) / 1_000_000).toFixed(1);

  return (
    <div className="min-h-screen bg-surface-soft flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-white border-r border-border px-6 py-6">
        <Link to="/" className="flex items-center gap-1.5 text-xl font-display font-medium">
          <span className="text-ink">BridgeHydro</span>
          <span className="text-mint">ESG</span>
        </Link>

        <div className="mt-10">
          <p className="font-mono-label text-muted-foreground">Active Project</p>
          <h2 className="mt-2 text-3xl font-display font-medium text-ink leading-[1.05]">
            {project?.name ?? "—"}
          </h2>

          <div className="mt-5 space-y-2">
            <Chip icon={<Zap className="h-4 w-4" />} label={`${project?.capacity ?? 0} MW Capacity`} />
            <Chip icon={<Landmark className="h-4 w-4" />} label={project?.financier ?? "—"} />
          </div>
        </div>

        <nav className="mt-10 space-y-1 text-sm">
          <Link
            to="/dashboard"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-surface-soft hover:text-ink transition"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <NavItem icon={<FolderCog className="h-4 w-4" />} label="Projects" />
          <NavItem icon={<FileText className="h-4 w-4" />} label="Compliance Docs" active />
          <NavItem icon={<ScrollText className="h-4 w-4" />} label="Audit Logs" />
          <NavItem icon={<BarChart2 className="h-4 w-4" />} label="Reports" />
        </nav>

        <div className="mt-auto pt-6 border-t border-border space-y-1 text-sm">
          <NavItem icon={<Shield className="h-4 w-4" />} label="Security" />
          <NavItem icon={<LifeBuoy className="h-4 w-4" />} label="Support" />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 lg:px-10 py-5">
          <Link to="/" className="lg:hidden text-lg font-display font-medium">
            <span className="text-ink">BridgeHydro</span> <span className="text-mint">ESG</span>
          </Link>
          <div className="ml-auto flex items-center gap-5 text-muted-foreground">
            <Bell className="h-5 w-5" />
            <Settings className="h-5 w-5" />
            <HelpCircle className="h-5 w-5" />
            <div className="h-9 w-9 rounded-full bg-ink ring-2 ring-mint/40" />
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-10 pb-10">
          <div className="rounded-2xl bg-white shadow-xl shadow-ink/5 border border-border overflow-hidden">
            {/* Mac window bar */}
            <div className="flex items-center gap-2 bg-white border-b border-border px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-4 font-mono-label text-muted-foreground">DOC_UPLOAD_MODULE_V4</span>
            </div>

            <div className="p-6 lg:p-10">
              <h1 className="text-3xl lg:text-4xl font-display font-medium text-ink">
                Upload Compliance Documents
              </h1>
              <p className="mt-3 max-w-3xl text-muted-foreground">
                Attach environmental assessments, resettlement plans, and biodiversity records. Our AI
                engine will cross-reference these files against World Bank and IFC Performance Standards.
              </p>

              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => inputRef.current?.click()}
                className={`mt-8 cursor-pointer rounded-2xl border-2 border-dashed transition-all p-12 flex flex-col items-center justify-center text-center ${
                  dragOver
                    ? "border-mint bg-mint-soft/60"
                    : "border-mint/40 bg-mint-soft/30 hover:bg-mint-soft/50"
                }`}
              >
                <div className="h-20 w-20 rounded-full bg-mint flex items-center justify-center shadow-lg shadow-mint/30">
                  <FileUp className="h-9 w-9 text-ink" />
                </div>
                <p className="mt-6 text-xl font-display text-ink">
                  Drag &amp; drop files here or{" "}
                  <span className="text-mint underline underline-offset-4">click to browse</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Supports PDF only (Up to 100MB per file)
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept="application/pdf,.pdf"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {/* Files list */}
              <div className="mt-10">
                <div className="flex items-end justify-between">
                  <p className="font-mono-label text-mint">Processing Files ({files.length})</p>
                  <p className="font-mono-label text-muted-foreground">Queue: {totalMb} MB</p>
                </div>

                <ul className="mt-4 space-y-3">
                  {files.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center gap-4 rounded-xl border border-border bg-white px-4 py-3"
                    >
                      <div className="h-11 w-11 rounded-md bg-mint-soft flex items-center justify-center shrink-0">
                        <span className="font-mono-label text-mint text-[10px]">
                          {f.kind === "pdf" ? "PDF" : "DOC"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-ink truncate">{f.name}</p>
                          <span className="font-mono-label text-muted-foreground shrink-0">
                            {f.progress >= 100
                              ? "100% Complete"
                              : `${Math.round(f.progress)}% Processing…`}
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-mint-soft overflow-hidden">
                          <div
                            className="h-full bg-mint transition-all"
                            style={{ width: `${f.progress}%` }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
                        className="text-muted-foreground hover:text-ink transition"
                        aria-label="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer area */}
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full bg-mint animate-pulse" />
                  Cloud server: hydro-node-nepal-01{" "}
                  <span className="font-mono-label text-mint">(Active)</span>
                </div>
                <button
                  onClick={handleAnalyze}
                  className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-medium text-white hover:bg-ink/90 transition shadow-lg shadow-ink/20"
                >
                  Analyze Compliance <Zap className="h-4 w-4 text-mint" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 px-2 text-xs">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md border border-border bg-white px-3 py-1.5 font-mono-label text-muted-foreground">
                Version 2.8.4-Beta
              </span>
              <span className="rounded-md border border-border bg-white px-3 py-1.5 font-mono-label text-muted-foreground">
                Encryption: AES-256
              </span>
            </div>
            <span className="font-mono-label text-muted-foreground">
              BridgeHydro ESG Compliance Engine © 2026
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-mint/40 bg-mint-soft/50 px-3 py-2 text-sm text-ink">
      <span className="text-mint">{icon}</span>
      <span className="font-mono-label text-ink">{label}</span>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition ${
        active
          ? "bg-mint text-ink font-medium shadow-sm"
          : "text-muted-foreground hover:bg-surface-soft hover:text-ink"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
