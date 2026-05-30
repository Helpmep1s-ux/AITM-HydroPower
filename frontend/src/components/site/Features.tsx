import { FilePlus2, FileUp, BarChart3, CheckCircle2 } from "lucide-react";

const steps = [
  { n: "01", icon: FilePlus2, title: "Create Project", desc: "Define your hydropower project name, capacity, and target financier standards." },
  { n: "02", icon: FileUp, title: "Upload Documents", desc: "Drop in EIA, IEE, and supporting compliance documents for AI processing." },
  { n: "03", icon: BarChart3, title: "Analyze Compliance", desc: "AI cross-checks against IFC, ADB, and World Bank performance standards." },
  { n: "04", icon: CheckCircle2, title: "Generate Remedies", desc: "Receive actionable remedies and funding-ready reports instantly." },
];

export function Features() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="font-mono-label text-mint">Process Workflow</p>
          <h2 className="mt-2 text-4xl md:text-5xl font-display font-medium text-ink underline decoration-mint decoration-2 underline-offset-8">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground">
            From document upload to funding-ready compliance reports in four steps.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ n, icon: Icon, title, desc }) => (
            <div
              key={n}
              className="rounded-2xl bg-secondary p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-mint">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-6 font-mono-label text-muted-foreground">Step {n}</p>
              <h3 className="mt-1 text-xl font-display font-medium text-ink">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
