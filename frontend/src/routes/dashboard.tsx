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
  Download,
  Upload as UploadIcon,
  Zap,
  AlertTriangle,
  FileText as FileTextIcon,
  Sprout,
  Radio,
  Smile,
  Frown,
  CalendarClock,
} from "lucide-react";
import { loadProject, type ProjectDraft } from "@/lib/project-cache";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Compliance Dashboard — BridgeHydro" }] }),
  component: DashboardPage,
});

type PS = {
  code: string;
  title: string;
  status: "COMPLIANT" | "WARNING" | "E-FLOW GAP" | "MAJOR BREACH" | "PENDING";
};

const standards: PS[] = [
  { code: "PS1", title: "Assessment & Mgmt", status: "COMPLIANT" },
  { code: "PS2", title: "Labor Conditions", status: "COMPLIANT" },
  { code: "PS3", title: "Resource Efficiency", status: "WARNING" },
  { code: "PS4", title: "Community Health", status: "E-FLOW GAP" },
  { code: "PS5", title: "Land Resettlement", status: "MAJOR BREACH" },
  { code: "PS6", title: "Biodiversity", status: "PENDING" },
  { code: "PS7", title: "Indigenous Peoples", status: "COMPLIANT" },
  { code: "PS8", title: "Cultural Heritage", status: "COMPLIANT" },
];

function statusStyles(s: PS["status"]) {
  switch (s) {
    case "COMPLIANT":
      return { card: "bg-mint-soft/40 border-mint/30", text: "text-mint", dot: "bg-mint" };
    case "WARNING":
      return {
        card: "bg-amber-50 border-amber-200",
        text: "text-amber-600",
        dot: "bg-amber-500",
      };
    case "E-FLOW GAP":
      return { card: "bg-rose-50 border-rose-200", text: "text-rose-600", dot: "bg-rose-500" };
    case "MAJOR BREACH":
      return {
        card: "bg-rose-50 border-rose-300 ring-1 ring-rose-300",
        text: "text-rose-600",
        dot: "bg-rose-500",
      };
    case "PENDING":
      return {
        card: "bg-amber-50 border-amber-200",
        text: "text-amber-600",
        dot: "bg-amber-500",
      };
  }
}

function DashboardPage() {
  const [project, setProject] = useState<ProjectDraft | null>(null);
  useEffect(() => setProject(loadProject()), []);

  const compliance = 42;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (compliance / 100) * circumference;

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
          <NavLinkItem to="/dashboard" icon={<LayoutGrid className="h-4 w-4" />} label="Dashboard" active />
          <NavLinkItem to="/project" icon={<FolderCog className="h-4 w-4" />} label="Projects" />
          <NavLinkItem to="/compliance" icon={<FileText className="h-4 w-4" />} label="Compliance Docs" />
          <NavLinkItem to="/dashboard" icon={<ScrollText className="h-4 w-4" />} label="Audit Logs" />
          <NavLinkItem to="/dashboard" icon={<BarChart2 className="h-4 w-4" />} label="Reports" />
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
          <NavLinkItem to="/dashboard" icon={<Shield className="h-4 w-4" />} label="Security" />
          <NavLinkItem to="/dashboard" icon={<LifeBuoy className="h-4 w-4" />} label="Support" />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center gap-6 px-6 lg:px-10 py-5">
          <Link to="/" className="lg:hidden text-lg font-display font-medium">
            <span className="text-ink">BridgeHydro</span> <span className="text-mint">ESG</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <span className="relative text-ink font-medium">
              Audit Overview
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-mint rounded-full" />
            </span>
            <a className="text-muted-foreground hover:text-ink transition cursor-pointer">Benchmark</a>
            <a className="text-muted-foreground hover:text-ink transition cursor-pointer">History</a>
          </nav>
          <div className="ml-auto hidden md:flex items-center gap-2 rounded-full bg-white border border-border px-4 py-2.5 w-80">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search audit logs…"
              className="bg-transparent outline-none text-sm flex-1 text-ink placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-5 text-muted-foreground">
            <Bell className="h-5 w-5" />
            <Settings className="h-5 w-5 text-mint" />
            <div className="h-9 w-9 rounded-full bg-ink ring-2 ring-mint/40" />
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-10 pb-10 space-y-8">
          {/* Title row */}
          <div>
            <span className="inline-block rounded-md bg-mint-soft px-3 py-1.5 font-mono-label text-mint">
              AUDIT_PROTOCOL_V4.2
            </span>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-4xl lg:text-5xl font-display font-medium text-ink leading-tight max-w-3xl">
                Compliance Intelligence Dashboard
              </h1>
              <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl bg-white border border-border px-5 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition">
                  <Download className="h-4 w-4" /> Export PDF
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-ink/90 transition shadow-lg shadow-ink/20">
                  Initiate Deep Scan <Zap className="h-4 w-4 text-mint" />
                </button>
              </div>
            </div>
          </div>

          {/* Top grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Compliance gauge */}
            <div className="rounded-3xl bg-white border border-border p-8 shadow-sm flex flex-col items-center text-center">
              <div className="self-start flex gap-1.5">
                {["#ef4444", "#f59e0b", "#facc15", "#10b981", "#10b981"].map((c, i) => (
                  <span key={i} className="h-2 w-2 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="relative mt-4">
                <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">
                  <circle cx="110" cy="110" r={radius} stroke="hsl(var(--border))" strokeWidth="14" fill="none" />
                  <circle
                    cx="110"
                    cy="110"
                    r={radius}
                    stroke="var(--mint, #10b981)"
                    strokeWidth="14"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="text-mint"
                    style={{ stroke: "currentColor" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-5xl font-display font-medium text-mint">{compliance}%</p>
                  <p className="font-mono-label text-muted-foreground mt-1">COMPLIANCE</p>
                </div>
              </div>
              <h3 className="mt-6 text-2xl font-display font-medium text-ink">Ready for IFC Funding</h3>
              <p className="mt-3 text-sm text-muted-foreground max-w-xs">
                Critical gaps detected in PS4 &amp; PS5 standards prevent funding eligibility.
              </p>
            </div>

            {/* IFC Performance Standards */}
            <div className="lg:col-span-2 rounded-3xl bg-white border border-border p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink">
                  <span className="h-7 w-7 rounded-md bg-mint-soft text-mint flex items-center justify-center">
                    <Sprout className="h-4 w-4" />
                  </span>
                  <h2 className="text-xl font-display font-medium">IFC Performance Standards</h2>
                </div>
                <span className="rounded-md bg-surface-soft px-2.5 py-1 font-mono-label text-muted-foreground">
                  8 CATEGORIES
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {standards.map((s) => {
                  const st = statusStyles(s.status);
                  return (
                    <div key={s.code} className={`rounded-2xl border p-4 ${st.card}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-mono-label text-ink">{s.code}</span>
                        <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                      </div>
                      <p className="mt-3 font-mono-label text-muted-foreground leading-tight">
                        {s.title.toUpperCase()}
                      </p>
                      <p className={`mt-3 font-mono-label ${st.text}`}>{s.status}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Deep Dive */}
          <div className="rounded-3xl bg-white border border-border p-6 lg:p-10 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-display font-medium text-ink">
                    Deep Dive Gap Analysis: Land Acquisition
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Forensic audit between local EIA and IFC Performance Standard 5
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-md bg-rose-500 text-white px-2.5 py-1 font-mono-label">
                  PRIORITY
                </span>
                <span className="rounded-md bg-ink text-white px-2.5 py-1 font-mono-label">
                  AUDIT_REF: PS5-NEP-001
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-surface-soft border border-border p-6">
                <div className="flex items-center gap-2 font-mono-label text-muted-foreground">
                  <FileTextIcon className="h-4 w-4" /> SOURCE DOCUMENT
                </div>
                <p className="mt-5 text-ink leading-relaxed italic border-l-2 border-border pl-4">
                  "Nepal EIA Section 4.2: Land will be compensated at government district rates,
                  calculated based on the three-year average of local transactions as registered at
                  the Land Revenue Office."
                </p>
                <p className="mt-6 font-mono-label text-muted-foreground flex items-center gap-2">
                  <CalendarClock className="h-3.5 w-3.5" /> Published Oct 2023
                </p>
              </div>
              <div className="rounded-2xl bg-mint-soft/40 border border-mint/30 p-6">
                <div className="flex items-center gap-2 font-mono-label text-mint">
                  <Sprout className="h-4 w-4" /> IFC MANDATE (PS5)
                </div>
                <p className="mt-5 text-ink leading-relaxed">
                  "IFC mandates full Replacement Cost, which includes market value plus transaction
                  costs. Furthermore, for those with land-based livelihoods, a formal Livelihood
                  Restoration Plan (LRP) is required to ensure pre-project levels are maintained or
                  improved."
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-rose-50/60 border border-rose-200 p-6 lg:p-8 flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="inline-block rounded-md bg-rose-100 text-rose-600 px-2.5 py-1 font-mono-label">
                  CRITICAL GAP VERDICT
                </span>
                <p className="mt-4 text-2xl font-display font-medium text-ink leading-snug">
                  District rates do not meet IFC Replacement Cost standards. Livelihood restoration
                  plan is absent, creating a significant non-compliance risk for Phase 1 funding.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-medium text-white hover:bg-rose-600 transition shadow-lg shadow-rose-500/30">
                  Flag for Rectification →
                </button>
                <button className="inline-flex items-center justify-center rounded-xl bg-white border border-border px-5 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition">
                  Assign to Legal Team
                </button>
              </div>
            </div>
          </div>

          {/* Bottom mini grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-white border border-border p-6 shadow-sm">
              <p className="font-mono-label text-muted-foreground">MONITORING STATIONS</p>
              <div className="mt-4 flex items-baseline gap-3">
                <p className="text-5xl font-display font-medium text-ink">12/18</p>
                <span className="font-mono-label text-rose-500">OFFLINE (6)</span>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <Radio className="h-4 w-4 text-mint" /> Real-time telemetry
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-border p-6 shadow-sm">
              <p className="font-mono-label text-muted-foreground">STAKEHOLDER SENTIMENT</p>
              <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-9 w-9 rounded-full bg-mint-soft text-mint flex items-center justify-center">
                    <Smile className="h-5 w-5" />
                  </span>
                  <p className="text-2xl font-display font-medium text-ink">72%</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-9 w-9 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                    <Frown className="h-5 w-5" />
                  </span>
                  <p className="text-2xl font-display font-medium text-ink">28%</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Based on local community feedback &amp; press monitoring.
              </p>
            </div>

            <div className="rounded-3xl bg-ink text-white p-6 shadow-2xl shadow-ink/20">
              <p className="font-mono-label text-white/50">NEXT AUDIT MILESTONE</p>
              <h3 className="mt-3 text-2xl font-display font-medium leading-tight">
                Quarterly Environmental Flow
              </h3>
              <p className="mt-3 text-sm text-white/60">
                Scheduled review for {project?.name ?? "this project"} — biodiversity team
                onboarding.
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-mono-label text-mint">IN 12 DAYS</span>
                <button className="rounded-lg bg-mint text-ink px-3 py-1.5 font-mono-label hover:bg-mint/90 transition">
                  View →
                </button>
              </div>
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
