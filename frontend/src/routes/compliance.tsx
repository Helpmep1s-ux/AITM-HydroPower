import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Settings,
  Search,
  LayoutGrid,
  FolderCog,
  FileText,
  ScrollText,
  BarChart2,
  Shield,
  LifeBuoy,
  CheckCircle2,
  Download,
  Upload as UploadIcon,
  FileType2,
  Filter,
} from "lucide-react";
import { loadDocs, loadProject, type ProjectDraft, type UploadedDoc } from "@/lib/project-cache";

export const Route = createFileRoute("/compliance")({
  head: () => ({ meta: [{ title: "Compliance Docs — BridgeHydro" }] }),
  component: CompliancePage,
});

function formatSize(bytes: number) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function CompliancePage() {
  const [project, setProject] = useState<ProjectDraft | null>(null);
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setProject(loadProject());
    setDocs(loadDocs());
  }, []);

  const filtered = docs.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-surface-soft flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-white border-r border-border px-6 py-6">
        <Link to="/" className="flex items-center gap-1.5 text-xl font-display font-medium">
          <span className="text-ink">BridgeHydro</span>
          <span className="text-mint">ESG</span>
        </Link>

        <div className="mt-8 flex items-center gap-3 rounded-xl border border-border p-3">
          <div className="h-10 w-10 rounded-md bg-ink text-white flex items-center justify-center font-display font-medium">
            BH
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-ink">Project Alpha</p>
            <p className="text-xs text-muted-foreground">Upper Dam Facility</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1 text-sm">
          <NavLinkItem to="/project" icon={<LayoutGrid className="h-4 w-4" />} label="Dashboard" />
          <NavLinkItem to="/project" icon={<FolderCog className="h-4 w-4" />} label="Projects" />
          <NavLinkItem
            to="/compliance"
            icon={<FileText className="h-4 w-4" />}
            label="Compliance Docs"
            active
          />
          <NavLinkItem to="/project" icon={<ScrollText className="h-4 w-4" />} label="Audit Logs" />
          <NavLinkItem to="/project" icon={<BarChart2 className="h-4 w-4" />} label="Reports" />
        </nav>

        <div className="mt-8">
          <Link
            to="/upload"
            className="flex items-center justify-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-medium text-ink shadow-md shadow-mint/30 hover:bg-mint/90 transition"
          >
            <UploadIcon className="h-4 w-4" /> Upload Document
          </Link>
        </div>

        <div className="mt-auto pt-6 border-t border-border space-y-1 text-sm">
          <NavLinkItem to="/project" icon={<Shield className="h-4 w-4" />} label="Security" />
          <NavLinkItem to="/project" icon={<LifeBuoy className="h-4 w-4" />} label="Support" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center gap-4 px-6 lg:px-10 py-5">
          <Link to="/" className="lg:hidden text-lg font-display font-medium">
            <span className="text-ink">BridgeHydro</span> <span className="text-mint">ESG</span>
          </Link>
          <div className="hidden md:flex flex-1 max-w-md items-center gap-2 rounded-full bg-white border border-border px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents…"
              className="bg-transparent outline-none text-sm flex-1 text-ink placeholder:text-muted-foreground"
            />
          </div>
          <div className="ml-auto flex items-center gap-5 text-muted-foreground">
            <Bell className="h-5 w-5" />
            <Settings className="h-5 w-5" />
            <div className="h-9 w-9 rounded-full bg-ink ring-2 ring-mint/40" />
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-10 pb-10">
          <div className="mb-6">
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <h1 className="text-4xl lg:text-5xl font-display font-medium text-ink leading-tight">
                  Compliance Documents
                </h1>
                <p className="mt-3 text-muted-foreground">
                  All verified ESG submissions for{" "}
                  <span className="text-ink font-medium">{project?.name ?? "—"}</span>. Click any
                  document to inspect verification details.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl bg-white border border-border px-5 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition">
                  <Filter className="h-4 w-4" /> Filter
                </button>
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-ink/90 transition shadow-lg shadow-ink/20"
                >
                  <UploadIcon className="h-4 w-4 text-mint" /> Upload
                </Link>
              </div>
            </div>
          </div>

          {/* Dark vault card */}
          <div className="relative rounded-3xl bg-ink text-white overflow-hidden shadow-2xl shadow-ink/20">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-auto font-mono-label text-white/50">
                {filtered.length} OF {docs.length} DOCUMENTS
              </span>
            </div>

            <div className="p-6 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl lg:text-4xl font-display font-medium">Verified Vault</h2>
                <span className="rounded-md bg-mint px-2.5 py-1 font-mono-label text-ink">
                  {docs.length} Total
                </span>
              </div>

              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
                  <FileType2 className="h-10 w-10 text-white/30 mx-auto mb-4" />
                  <p className="text-white/70">
                    {docs.length === 0
                      ? "No documents uploaded yet."
                      : "No documents match your search."}
                  </p>
                  {docs.length === 0 && (
                    <Link
                      to="/upload"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-mint px-4 py-2.5 text-sm font-medium text-ink hover:bg-mint/90 transition"
                    >
                      <UploadIcon className="h-4 w-4" /> Upload your first document
                    </Link>
                  )}
                </div>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((d, i) => (
                    <li
                      key={i}
                      className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-mint/30 transition p-5 cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-11 w-11 rounded-lg bg-mint/15 border border-mint/30 flex items-center justify-center shrink-0">
                          <FileType2 className="h-5 w-5 text-mint" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{d.name}</p>
                            <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
                          </div>
                          <p className="text-xs text-white/50 mt-1 font-mono-label uppercase">
                            {d.kind} • {formatSize(d.size)}
                          </p>
                          <p className="text-xs text-white/60 mt-3">
                            Verified by{" "}
                            <span className="text-mint">{d.verifiedBy ?? "System"}</span>
                          </p>
                        </div>
                        <button className="text-white/40 group-hover:text-mint transition shrink-0">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavLinkItem({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition ${
        active
          ? "bg-mint text-ink font-medium shadow-sm"
          : "text-muted-foreground hover:bg-surface-soft hover:text-ink"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
