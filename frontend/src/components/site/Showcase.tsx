import { BarChart3, ShieldCheck } from "lucide-react";

export function Showcase() {
  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-7xl grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl bg-white border border-border p-8 grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-display font-medium text-ink">Real-time Gaps Analysis</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Identify critical environmental risks before they stall your financing process.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-xl bg-mint-soft flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-mint" strokeWidth={2.5} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-white border border-border p-6">
              <span className="inline-block rounded-md bg-destructive/10 px-2 py-0.5 font-mono-label text-destructive">
                Critical
              </span>
              <span className="ml-2 font-mono-label text-muted-foreground">Audit Log</span>
              <p className="mt-4 text-sm text-ink leading-relaxed">
                Fish migration mitigation plan missing in Section 4.2 of IEE.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-border p-6">
              <span className="inline-block rounded-md bg-mint-soft px-2 py-0.5 font-mono-label text-ink">
                Fixed
              </span>
              <span className="ml-2 font-mono-label text-muted-foreground">Suggested Remedy</span>
              <p className="mt-4 text-sm text-ink leading-relaxed">
                Implementing nature-like bypass channel meets IFC Standard 6.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-ink p-8 flex flex-col justify-between min-h-[400px]">
          <ShieldCheck className="h-7 w-7 text-mint" />
          <div>
            <h3 className="text-2xl font-display font-medium text-white">Financier Confidence</h3>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              Used by leading development banks to verify environmental compliance in South Asia.
            </p>
            <button className="mt-6 w-full rounded-md bg-mint py-3 text-sm font-medium text-ink hover:bg-mint/90 transition">
              Explore ESG Standards
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
