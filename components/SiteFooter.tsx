export default function SiteFooter() {
  return (
    <div className="w-full bg-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <h5 className="font-serif text-lg mb-2 text-amber-700">Wanderline</h5>
            <p className="text-sm text-gray-500 max-w-xs">
              Travel notes, world events, and the crime and culture stories behind them.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Categories</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><a href="/category/travel" className="hover:text-gray-900">Travel</a></li>
              <li><a href="/category/world-stories" className="hover:text-gray-900">World Stories</a></li>
              <li><a href="/category/crime" className="hover:text-gray-900">Crime</a></li>
              <li><a href="/category/culture" className="hover:text-gray-900">Culture</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Company</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><a href="#" className="hover:text-gray-900">About</a></li>
              <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              <li><a href="#" className="hover:text-gray-900">Careers</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Legal</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
              <li><a href="#" className="hover:text-gray-900">Terms</a></li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-10 pt-6 border-t border-gray-200">© 2026 Wanderline. All stories are for illustration purposes.</p>
      </div>
    </div>
  )
}