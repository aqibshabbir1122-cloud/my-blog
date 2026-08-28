import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200/60">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <span className="font-serif text-lg mb-2 text-amber-700 block">
              Wanderline
            </span>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Travel notes, world events, and the crime and culture stories behind them.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
              Categories
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <Link href="/category/travel" className="hover:text-gray-900 transition">
                  Travel
                </Link>
              </li>
              <li>
                <Link href="/category/world-stories" className="hover:text-gray-900 transition">
                  World Stories
                </Link>
              </li>
              <li>
                <Link href="/category/crime" className="hover:text-gray-900 transition">
                  Crime
                </Link>
              </li>
              <li>
                <Link href="/category/culture" className="hover:text-gray-900 transition">
                  Culture
                </Link>
              </li>
              <li>
                <Link href="/category/digital-culture" className="hover:text-gray-900 transition">
                  Digital Culture
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
              Company
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <Link href="/about" className="hover:text-gray-900 transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gray-900 transition">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
              Legal
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-gray-900 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gray-900 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-gray-900 transition">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 Wanderline. All rights reserved.</p>
          <p>Designed for fast editorial reading and global reporting.</p>
        </div>
      </div>
    </footer>
  )
}