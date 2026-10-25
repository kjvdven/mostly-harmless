import { I18nPlugin } from "@11ty/eleventy";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import Tailwindcss from "@tailwindcss/vite";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { copyEleventyOutput } from "./src/_config/copy-eleventy-output.js";

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(I18nPlugin, {
    defaultLanguage: "en",
  });

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
