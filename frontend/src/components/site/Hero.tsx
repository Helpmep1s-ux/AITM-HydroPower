import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import heroImg from "@/assets/hero-hydro.jpg";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { saveProject, loadProject } from "@/lib/project-cache";

const badges = ["IFC Standards", "ADB Compliance", "Nepal EIA Framework"];

export function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-surface-soft">
      <div className="relative mx-auto max-w-7xl">
        <div className="relative overflow-hidden">
          <img
            src={heroImg}
            alt="Hydropower dam in misty mountains"
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/30 to-surface-soft" />

          <div className="relative px-6 pt-20 pb-12 text-center">
            <h1 className="mx-auto max-w-3xl text-5xl md:text-6xl font-display font-medium text-white leading-[1.05]">
              Streamline Your Hydropower
              <br />
              <span className="text-mint italic font-normal">ESG Compliance</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-white/85">
              Bridge the gap between local EIA standards and international financier
              requirements with AI-powered auditing.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-mint" />
                  <span className="font-mono-label text-white">{b}</span>
                </span>
              ))}
            </div>

            <div className="mt-12 mx-auto max-w-md">
              <AssessmentCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AssessmentCard() {
  const navigate = useNavigate();
  const initial =
    typeof window !== "undefined"
      ? loadProject()
      : { name: "", capacity: 456, financier: "World Bank / IFC", basin: "Koshi" };
  const [name, setName] = useState(initial.name === "Upper Tamakoshi Extension" ? "" : initial.name);
  const [capacity, setCapacity] = useState<number>(initial.capacity);
  const [financier, setFinancier] = useState(initial.financier);
  const [basin, setBasin] = useState(initial.basin || "Koshi");

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    saveProject({
      name: name.trim() || "Upper Tamakoshi Extension",
      capacity: Math.max(0, Number(capacity) || 0),
      financier,
      basin,
    });
    navigate({ to: "/upload" });
  };

  return (
    <form
      onSubmit={handleStart}
      className="rounded-2xl bg-white/95 shadow-2xl shadow-ink/30 backdrop-blur overflow-hidden text-left"
    >
      <div className="flex items-center gap-2 bg-ink px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-display font-medium text-ink">New Assessment</h3>

        <div className="mt-5 space-y-4">
          <Field label="Project Name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Upper Tamakoshi Extension"
              className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-mint"
            />
          </Field>
          <Field label="River Basin">
            <select
              value={basin}
              onChange={(e) => setBasin(e.target.value)}
              className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint"
            >
              <option>Koshi</option>
              <option>Gandaki</option>
              <option>Karnali</option>
              <option>Mahakali</option>
              <option>Southern (minor)</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Target Capacity (MW)">
              <input
                type="number"
                min={0}
                value={capacity}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setCapacity(Number.isFinite(v) && v >= 0 ? v : 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint"
              />
            </Field>
            <Field label="Target Financier">
              <select
                value={financier}
                onChange={(e) => setFinancier(e.target.value)}
                className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint"
              >
                <option>World Bank / IFC</option>
                <option>Asian Development Bank</option>
                <option>JICA</option>
              </select>
            </Field>
          </div>
          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-ink py-3 text-sm font-medium text-white hover:bg-ink/90 transition"
          >
            Start New Audit <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono-label text-muted-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
