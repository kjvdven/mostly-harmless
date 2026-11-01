const escapeAttr = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Large steps stay in the srcset so a future zoom dialog can reuse it with sizes="100vw".
const WIDTHS = "480,960,1600,2400";

// Literal class names: Tailwind only finds classes it can read in full.
const LAYOUTS = {
  content: { className: "layout-content", sizes: "(min-width: 48rem) 48rem, 100vw" },
  main: { className: "layout-main", sizes: "(min-width: 60rem) 60rem, 100vw" },
  popout: { className: "layout-popout", sizes: "(min-width: 63rem) 63rem, 100vw" },
  full: { className: "layout-full", sizes: "100vw" },
};

const SIDES = {
  right: { text: "layout-left", image: "layout-right" },
  left: { text: "layout-right", image: "layout-left" },
};

function requireImage(name, src, alt) {
  if (!src || alt === undefined) {
    throw new Error(`{% ${name} %} needs a src and an alt text ("" for decorative images)`);
  }
}

function renderFigure({ src, alt, className, sizes, caption, zoom }) {
  const attrs = [`class="${className}"`];
  if (zoom !== false) {
    attrs.push("data-zoom");
  }

  return [
    `<figure ${attrs.join(" ")}>`,
    `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" sizes="${sizes}" eleventy:widths="${WIDTHS}">`,
    caption ? `<figcaption>${caption}</figcaption>` : "",
    "</figure>",
  ].join("");
}

// {% figure "/en/projects/x/shot.jpg", "Alt text", layout="popout", caption="…", zoom=false %}
export function figure(src, alt, { layout = "main", caption = "", zoom } = {}) {
  requireImage("figure", src, alt);
  const { className, sizes } = LAYOUTS[layout] ?? LAYOUTS.main;
  return renderFigure({ src, alt, className, sizes, caption, zoom });
}

// {% split "/en/projects/x/shot.jpg", "Alt text", side="left" %}Markdown{% endsplit %}
export function split(content, src, alt, { side = "right", caption = "", zoom } = {}) {
  requireImage("split", src, alt);
  const classes = SIDES[side] ?? SIDES.right;
  const image = renderFigure({
    src,
    alt,
    className: classes.image,
    sizes: "(min-width: 60rem) 30rem, 50vw",
    caption,
    zoom,
  });
  // Blank lines around the content let markdown-it render it as Markdown.
  const text = `<div class="${classes.text} flow">\n\n${content.trim()}\n\n</div>`;
  // Image first in the DOM when it sits left, or grid auto-placement wraps it to a new row.
  const parts = side === "left" ? [image, text] : [text, image];

  return `<div class="layout-full layout-subgrid">\n${parts.join("\n")}\n</div>`;
}
