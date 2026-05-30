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
  Star,
  MoreHorizontal,
  CheckCircle2,
  Download,
  Upload as UploadIcon,
  Rocket,
  Activity,
  Map,
} from "lucide-react";
import {
  loadDocs,
  loadProject,
  type ProjectDraft,
  type UploadedDoc,
} from "@/lib/project-cache";

export const Route = createFileRoute("/project")({
  head: () => ({
    meta: [{ title: "Project Overview — BridgeHydro" }],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const [project, setProject] = useState<ProjectDraft | null>(null);
  const [docs, setDocs] = useState<UploadedDoc[]>([]);

  useEffect(() => {
    setProject(loadProject());
    setDocs(loadDocs());
  }, []);

  const verifiedCount = docs.length;
  const totalSlots = Math.max(5, verifiedCount);

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
          <Link
            to="/dashboard"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-surface-soft hover:text-ink transition"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <NavItem icon={<FolderCog className="h-4 w-4" />} label="Projects" active />
          <Link
            to="/compliance"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-surface-soft hover:text-ink transition"
          >
            <FileText className="h-4 w-4" />
            <span>Compliance Docs</span>
          </Link>
          <NavItem icon={<ScrollText className="h-4 w-4" />} label="Audit Logs" />
          <NavItem icon={<BarChart2 className="h-4 w-4" />} label="Reports" />
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
          <NavItem icon={<Shield className="h-4 w-4" />} label="Security" />
          <NavItem icon={<LifeBuoy className="h-4 w-4" />} label="Support" />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center gap-4 px-6 lg:px-10 py-5">
          <Link to="/" className="lg:hidden text-lg font-display font-medium">
            <span className="text-ink">BridgeHydro</span> <span className="text-mint">ESG</span>
          </Link>
          <div className="hidden md:flex flex-1 max-w-md items-center gap-2 rounded-full bg-white border border-border px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search facilities…"
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
          {/* Header section */}
          <div className="mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <h1 className="text-4xl lg:text-5xl font-display font-medium text-ink leading-tight">
                  Project Overview
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Detailed environmental, social, and governance tracking for our flagship
                  infrastructure assets.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl bg-white border border-border px-5 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition">
                  <Download className="h-4 w-4" /> Export Data
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-ink/90 transition shadow-lg shadow-ink/20"
                >
                  <span className="text-mint text-lg leading-none">+</span> New Project
                </Link>
              </div>
            </div>
          </div>

          {/* Dark project card */}
          <div className="relative rounded-3xl bg-ink text-white overflow-hidden shadow-2xl shadow-ink/20">
            {/* mac bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-auto text-xs text-white/55 tracking-normal normal-case">
                ID: UT-EXT-2024-09 · Live status
              </span>
            </div>

            <div className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left + center */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-4xl lg:text-6xl font-display font-medium leading-[1.02]">
                    {project?.name ?? "—"}
                  </h2>
                  <div className="flex gap-2 shrink-0">
                    <IconBtn>
                      <Star className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn>
                      <MoreHorizontal className="h-4 w-4" />
                    </IconBtn>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono-label text-mint">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-60 animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
                  </span>
                  Live Verification Active
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Power Capacity" value={`${project?.capacity ?? 0} MW`} />
                  <Stat label="River Basin" value="Tamakoshi" />
                  <Stat label="Lead Financier" value={project?.financier ?? "—"} />
                  <Stat label="Registry Date" value="Oct 24, 2024" />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-display font-medium">Compliance Documentation</h3>
                    <span className="rounded-md bg-mint px-2.5 py-1 font-mono-label text-ink">
                      {verifiedCount} / {totalSlots} Verified
                    </span>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {docs.length === 0 && (
                      <li className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-center text-white/50 text-sm">
                        No documents uploaded yet.
                      </li>
                    )}
                    {docs.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <CheckCircle2 className="h-5 w-5 text-mint shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{d.name}</p>
                          <p className="text-xs text-white/50 mt-0.5">
                            Verified by {d.verifiedBy ?? "System"} • just now
                          </p>
                        </div>
                        <button className="text-white/40 hover:text-mint transition">
                          <Download className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/upload"
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-3.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition"
                  >
                    <UploadIcon className="h-4 w-4" /> Upload Pending Documents
                  </Link>
                </div>
              </div>

              {/* Right glass panel */}
              <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-display font-medium leading-tight">
                    Global <br /> Health{" "}
                    <span className="text-mint">
                      40<span className="text-base align-top">%</span>
                    </span>
                  </h3>
                  <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-2/5 bg-mint rounded-full" />
                  </div>
                </div>

                <MiniRow
                  icon={<Activity className="h-4 w-4 text-amber-400" />}
                  label="ESG Analysis"
                  status="In Progress"
                  statusClass="text-amber-400"
                />
                <MiniRow
                  icon={<BarChart2 className="h-4 w-4 text-white/50" />}
                  label="Impact Score"
                  status="Awaiting Data"
                  statusClass="text-white/50"
                />

                <button className="mt-auto flex items-center gap-3 rounded-xl bg-mint/15 border border-mint/30 px-4 py-4 text-left hover:bg-mint/20 transition">
                  <Rocket className="h-5 w-5 text-mint" />
                  <span className="font-display text-xl text-white">Manage Facility</span>
                </button>
                <button className="font-mono-label text-white/60 hover:text-white transition text-left">
                  View Audit History →
                </button>
              </div>
            </div>

            {/* Floating bottom toggle */}
            <div className="px-6 lg:px-10 pb-8 -mt-2 flex justify-center">
              <div className="flex items-center gap-1 rounded-2xl bg-white p-1.5 shadow-2xl shadow-ink/40">
                <button className="flex items-center gap-2 rounded-xl bg-mint px-5 py-3 font-mono-label text-ink">
                  <LayoutGrid className="h-4 w-4" /> Project View
                </button>
                <button className="flex items-center gap-2 rounded-xl px-5 py-3 font-mono-label text-muted-foreground hover:text-ink transition">
                  <Map className="h-4 w-4" /> Geospatial
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
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

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition">
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur">
      <p className="font-mono-label text-white/50">{label}</p>
      <p className="mt-3 text-2xl font-display font-medium text-white leading-tight">{value}</p>
    </div>
  );
}

function MiniRow({
  icon,
  label,
  status,
  statusClass,
}: {
  icon: React.ReactNode;
  label: string;
  status: string;
  statusClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
      <div className="h-8 w-8 rounded-md bg-white/5 flex items-center justify-center">{icon}</div>
      <p className="flex-1 text-sm text-white/80">{label}</p>
      <span className={`font-mono-label ${statusClass}`}>{status}</span>
    </div>
  );
}
