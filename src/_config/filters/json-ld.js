// Escaping < keeps a "</script>" inside content from closing the script element.
export function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
