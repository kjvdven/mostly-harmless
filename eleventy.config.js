import { I18nPlugin } from "@11ty/eleventy";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import Tailwindcss from "@tailwindcss/vite";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { copyEleventyOutput } from "./src/_config/copy-eleventy-output.js";
import markdownItShiki from "@shikijs/markdown-it";
import { createCssVariablesTheme } from "shiki";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { svg } from "./src/_config/shortcodes/svg.js";

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(I18nPlugin, {
    defaultLanguage: "en",
  });

  const shiki = await markdownItShiki({
    theme: createCssVariablesTheme(),
    langs: ["html", "css", "js", "ts", "json", "yaml", "bash", "jinja"],
    langAlias: { njk: "jinja-html" },
  });
  eleventyConfig.amendLibrary("md", (md) => md.use(shiki));

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg", "svg"],
    svgShortCircuit: true,
    widths: ["auto"],
  });

  eleventyConfig.addShortcode("svg", svg);

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/en/feed.xml",
    collection: { name: "blog", limit: 0 },
    metadata: {
      language: "en",
      title: "Mostly Harmless",
      base: "https://krisvanderven.nl/",
      author: { name: "Kris van der Ven" },
    },
  });

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      publicDir: "public",
      plugins: [Tailwindcss(), copyEleventyOutput([".xml"])],
      build: {
        // Vite inlines assets under 4 kB as data URIs; keep images as cacheable files.
        assetsInlineLimit: 0,
      },
    },
  });

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.setServerPassthroughCopyBehavior("copy");
}

export const config = {
  dir: {
    input: "src",
    layouts: "_includes/layouts",
  },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};
