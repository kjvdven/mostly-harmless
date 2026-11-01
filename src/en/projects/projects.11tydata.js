export default {
  layout: "project.njk",
  eleventyComputed: {
    // Card-only projects live in the overview and get no page of their own.
    permalink: (data) => (data.caseStudy ? `${data.page.filePathStem}/` : false),
  },
};
