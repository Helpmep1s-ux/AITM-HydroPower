export function Footer() {
  return (
    <footer className="bg-ink text-white/80 mt-20">
      <div className="h-6 bg-surface-soft" />
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-2xl font-display italic text-white">BridgeHydro</p>
          <p className="mt-3 text-sm text-white/60 max-w-xs leading-relaxed">
            © 2026 BridgeHydro. Engineering trust in hydropower ESG compliance.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-3">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="#" className="hover:text-mint transition">Privacy Policy</a>
            <a href="#" className="hover:text-mint transition">Terms of Service</a>
            <a href="#" className="hover:text-mint transition">IFC Standards</a>
            <a href="#" className="hover:text-mint transition">ADB Guidelines</a>
          </div>
          <a href="#" className="text-sm hover:text-mint transition">Contact Support</a>
        </div>
      </div>
    </footer>
  );
}
