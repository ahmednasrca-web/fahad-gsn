export function generateSlug(text: string, maxLength = 80): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .slice(0, maxLength) +
    '-' +
    Date.now().toString(36)
  )
}
