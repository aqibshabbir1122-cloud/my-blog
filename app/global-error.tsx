'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 text-gray-900 font-sans">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block mb-2">
            System Notice
          </span>
          <h2 className="text-2xl font-serif font-bold text-gray-950 mb-3">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-600 font-serif mb-6 leading-relaxed">
            An unexpected error occurred while loading this dispatch.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold rounded-xl transition"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}