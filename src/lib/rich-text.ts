export function normalizeRichTextHtml(html: string = "") {
  return html
    .replace(/&nbsp;/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]{2,}/g, " ");
}

export function stripHtml(html: string = "") {
  return normalizeRichTextHtml(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
