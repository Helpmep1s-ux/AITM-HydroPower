export function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 bg-surface-soft/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="/" className="text-xl font-display font-semibold tracking-tight text-ink">
          BridgeHydro
        </a>
        <div className="flex items-center gap-6">
          <a href="#login" className="text-sm text-ink/80 hover:text-ink transition">Login</a>
          <a
            href="#start"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-ink/90 transition"
          >
            Get Started
          </a>
        </div>
      </nav>
    </header>
  );
}
