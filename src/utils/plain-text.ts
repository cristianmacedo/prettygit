const BLOCK_BREAK_PATTERN =
  /<\/(blockquote|div|p|li|section|article|header|footer|tr|h[1-6])>/gi;
const LINE_BREAK_PATTERN = /<br\s*\/?>/gi;

export function htmlToPlainText(html: string): string {
  if (typeof DOMParser === "undefined") {
    return html.replace(/<[^>]+>/g, "").trim();
  }

  const parser = new DOMParser();
  const normalizedHtml = html
    .replace(LINE_BREAK_PATTERN, "\n")
    .replace(BLOCK_BREAK_PATTERN, "$&\n");
  const doc = parser.parseFromString(normalizedHtml, "text/html");
  const text = doc.body.textContent ?? "";

  return text.replace(/\n{3,}/g, "\n\n").trim();
}
