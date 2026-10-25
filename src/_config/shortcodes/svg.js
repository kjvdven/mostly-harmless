import fs from "node:fs";
import { optimize } from "svgo";

const escapeAttr = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

let count = 0;

export function svg(name, label = "", className = "") {
  if (!name) {
    throw new Error('{% svg %} needs a file name, e.g. {% svg "misc/star" %}');
  }

  const path = `./src/assets/svg/${name}.svg`;
  const { data } = optimize(fs.readFileSync(path, "utf8"), {
    // Unique prefix per call: the same icon twice on a page would otherwise repeat its ids.
    plugins: ["preset-default", { name: "prefixIds", params: { prefix: `svg${++count}` } }],
  });

  const attrs = label
    ? [`role="img"`, `aria-label="${escapeAttr(label)}"`]
    : [`aria-hidden="true"`];
  if (className) {
    attrs.push(`class="${escapeAttr(className)}"`);
  }

  return data.replace("<svg", `<svg ${attrs.join(" ")}`);
}
