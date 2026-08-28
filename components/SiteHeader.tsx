import Link from 'next/link'

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
      <Link href="/">Wanderline</Link>
    </h1>
  ) : (
    <Link href="/" className="text-2xl font-serif text-amber-700">
      Wanderline
    </Link>
  )

  return (
    <div className={wrapperClass}>
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between border-b border-gray-200/60 pb-4 flex-wrap gap-y-3">
          {logo}
          <nav className="flex gap-4 sm:gap-6 text-sm text-gray-600 flex-wrap">
            <Link href="/category/travel" className="hover:text-amber-700 transition">
              Travel
            </Link>
            <Link href="/category/world-stories" className="hover:text-amber-700 transition">
              World Stories
            </Link>
            <Link href="/category/crime" className="hover:text-amber-700 transition">
              Crime
            </Link>
            <Link href="/category/culture" className="hover:text-amber-700 transition">
              Culture
            </Link>
            <Link href="/category/digital-culture" className="hover:text-amber-700 transition">
              Digital Culture
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}