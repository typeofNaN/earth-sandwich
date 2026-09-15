export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 text-white md:px-8">
      <div className="text-sm font-semibold uppercase tracking-[0.28em]">Earth Sandwich</div>
      <a
        className="pointer-events-auto text-xs uppercase tracking-[0.22em] text-white/55 transition hover:text-white"
        href="https://en.wikipedia.org/wiki/Antipodes"
        target="_blank"
        rel="noreferrer"
      >
        About
      </a>
    </header>
  )
}
