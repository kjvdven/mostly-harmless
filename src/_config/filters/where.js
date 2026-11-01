// Nunjucks' selectattr can't compare against a value or follow a dotted path like "data.category".
export function where(items, path, value) {
  return items.filter((item) => path.split(".").reduce((obj, key) => obj?.[key], item) === value);
}
