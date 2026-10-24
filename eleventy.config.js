import { I18nPlugin } from "@11ty/eleventy";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(I18nPlugin, {
    defaultLanguage: "en",
  });

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      publicDir: "public",
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
