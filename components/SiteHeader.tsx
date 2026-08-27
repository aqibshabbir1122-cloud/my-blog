type SiteHeaderProps = {
  variant?: 'gradient' | 'plain'
  logoAsH1?: boolean
}

export default function SiteHeader({ variant = 'plain', logoAsH1 = false }: SiteHeaderProps) {
  const wrapperClass =
    variant === 'gradient'
      ? 'w-full bg-gradient-to-r from-blue-50 via-blue-50/60 to-purple-50/40'
      : 'w-full bg-[#faf9f6]'

  const logo = logoAsH1 ? (
    <h1 className="text-2xl font-serif text-amber-700">
      <a href="/">Wanderline</a>
    </h1>
  ) : (
    <a href="/" className="text-2xl font-serif text-amber-700">Wanderline</a>
  )

  return (
    <div className={wrapperClass}>
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between border-b border-gray-200/60 pb-4">
          {logo}
          <nav className="flex gap-4 text-sm text-gray-600">
            <a href="/category/travel" className="hover:text-amber-700">Travel</a>
            <a href="/category/world-stories" className="hover:text-amber-700">World Stories</a>
            <a href="/category/crime" className="hover:text-amber-700">Crime</a>
            <a href="/category/culture" className="hover:text-amber-700">Culture</a>
          </nav>
        </div>
      </div>
    </div>
  )
}