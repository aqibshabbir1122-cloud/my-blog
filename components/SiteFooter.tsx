import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200/60 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-gray-950 block mb-3">
              Wanderline
            </Link>
            <p className="text-sm text-gray-700 max-w-xs leading-relaxed">
              Travel notes, world events, and the crime and culture stories behind them.
            </p>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-700 font-semibold mb-3">
              Categories
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/travel" className="text-gray-700 hover:text-amber-800 transition">
                  Travel
                </Link>
              </li>
              <li>
                <Link href="/category/world-stories" className="text-gray-700 hover:text-amber-800 transition">
                  World Stories
                </Link>
              </li>
              <li>
                <Link href="/category/crime" className="text-gray-700 hover:text-amber-800 transition">
                  Crime
                </Link>
              </li>
              <li>
                <Link href="/category/culture" className="text-gray-700 hover:text-amber-800 transition">
                  Culture
                </Link>
              </li>
              <li>
                <Link href="/category/digital-culture" className="text-gray-700 hover:text-amber-800 transition">
                  Digital Culture
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-700 font-semibold mb-3">
              Company
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-700 hover:text-amber-800 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-amber-800 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-700 font-semibold mb-3">
              Legal
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-700 hover:text-amber-800 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-700 hover:text-amber-800 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-700 hover:text-amber-800 transition">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-300/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-700 gap-4">
          <p>© {new Date().getFullYear()} Wanderline. All rights reserved.</p>
          <p>Designed for fast editorial reading and global reporting.</p>
        </div>
      </div>
    </footer>
  )
}