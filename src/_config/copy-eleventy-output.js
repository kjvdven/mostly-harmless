import fs from "node:fs";
import path from "node:path";

// eleventy-plugin-vite only rebuilds HTML, so Eleventy's other output (feeds, sitemaps) is lost without this.
export function copyEleventyOutput(extensions) {
  let root;
  let outDir;

  return {
    name: "copy-eleventy-output",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    writeBundle() {
      for (const file of fs.readdirSync(root, { recursive: true })) {
        if (!extensions.includes(path.extname(file))) continue;
        const target = path.join(outDir, file);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(path.join(root, file), target);
      }
    },
  };
}
