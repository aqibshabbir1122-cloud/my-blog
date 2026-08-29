export function calculateReadingTime(content?: string | null): string {
  if (!content) return '1 min read'

  // Strip HTML tags and normalize whitespace
  const cleanText = content.replace(/<[^>]*>/g, ' ').trim()
  const words = cleanText.split(/\s+/).filter(Boolean).length

  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200
  const minutes = Math.ceil(words / wordsPerMinute)

  return `${Math.max(1, minutes)} min read`
}