export function readableDate(date) {
  return new Intl.DateTimeFormat(this.page.lang, { dateStyle: "long", timeZone: "UTC" }).format(date);
}
