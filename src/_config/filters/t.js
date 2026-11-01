import i18n from "../../_data/i18n.js";

const DEFAULT_LANG = "en";

// Falls back to English, so a page in a new language builds before every string is translated.
export function t(key) {
  const value = i18n[this.page.lang]?.[key] ?? i18n[DEFAULT_LANG][key];
  if (value === undefined) {
    throw new Error(`No translation for "${key}" in src/_data/i18n.js`);
  }
  return value;
}
