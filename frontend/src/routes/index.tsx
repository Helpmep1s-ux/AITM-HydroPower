import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { Showcase } from "@/components/site/Showcase";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BridgeHydro — Hydropower ESG Compliance" },
      { name: "description", content: "Bridge the gap between local EIA standards and international financier requirements with AI-powered auditing." },
      { property: "og:title", content: "BridgeHydro — Hydropower ESG Compliance" },
      { property: "og:description", content: "AI-powered ESG auditing for hydropower projects." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Showcase />
      </main>
      <Footer />
    </div>
  );
}
