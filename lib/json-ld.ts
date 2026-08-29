/**
 * Safely serialize JSON-LD objects for embedded `<script type="application/ld+json">`.
 * Replaces unsafe characters to prevent HTML/XSS injection when rendered in HTML.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}
