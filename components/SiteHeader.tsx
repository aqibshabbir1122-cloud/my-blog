import Link from 'next/link'

interface SiteHeaderProps {
  variant?: 'home' | 'plain' | 'gradient'
  logoAsH1?: boolean
}

const CATEGORIES = [
  { name: 'Travel', slug: 'travel' },
  { name: 'World Stories', slug: 'world-stories' },
  { name: 'Crime', slug: 'crime' },
  { name: 'Culture', slug: 'culture' },
  { name: 'Digital Culture', slug: 'digital-culture' },
]

export default function SiteHeader({ variant = 'home', logoAsH1 = false }: SiteHeaderProps) {
  const isGradient = variant === 'gradient'

  const LogoComponent = logoAsH1 ? 'h1' : 'span'

  return (
    <header
      className={`w-full border-b border-gray-200/70 sticky top-0 z-40 transition-colors ${
        isGradient
          ? 'bg-gradient-to-b from-[#faf9f6] via-[#faf9f6]/95 to-[#faf9f6]/80 backdrop-blur-md'
          : 'bg-[#faf9f6]/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <LogoComponent className="font-serif text-2xl font-bold tracking-tight text-amber-900">
          <Link href="/" className="hover:text-amber-950 transition-colors">
            Wanderline
          </Link>
        </LogoComponent>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="hover:text-amber-800 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}