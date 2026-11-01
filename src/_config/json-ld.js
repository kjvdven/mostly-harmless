import i18n from "../_data/i18n.js";

const label = (lang, key) => i18n[lang]?.[key] ?? i18n.en[key];

// One @graph per page with fixed @ids, so entities point to each other instead of repeating.
export function buildGraph(data) {
  const { site, page } = data;
  // Read via data.page, not the destructured page: Eleventy only then waits for the computed page.lang.
  const lang = data.page.lang;
  if (!page.url) {
    return undefined;
  }

  const personId = `${site.url}/#person`;
  const websiteId = `${site.url}/#website`;
  const pageUrl = `${site.url}${page.url}`;

  const person = {
    "@type": "Person",
    "@id": personId,
    name: site.author.name,
    jobTitle: site.author.jobTitle,
    worksFor: { "@type": "Organization", name: site.author.worksFor },
    url: `${site.url}/`,
    sameAs: site.profiles.length ? site.profiles.map((profile) => profile.url) : undefined,
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    name: site.name,
    url: `${site.url}/`,
    inLanguage: lang,
    publisher: { "@id": personId },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: data.title,
    description: data.description,
    inLanguage: lang,
    isPartOf: { "@id": websiteId },
  };

  const graph = [person, website, webPage];

  if (page.url === `/${lang}/about/`) {
    webPage["@type"] = "ProfilePage";
    webPage.mainEntity = { "@id": personId };
  }

  const tags = [data.tags ?? []].flat();
  if (tags.includes("blog")) {
    const post = {
      "@type": "BlogPosting",
      "@id": `${pageUrl}#post`,
      headline: data.title,
      description: data.description,
      datePublished: page.date.toISOString(),
      dateModified: (data.updated ?? page.date).toISOString(),
      author: { "@id": personId },
      keywords: tags.filter((tag) => tag !== "blog").join(", ") || undefined,
      inLanguage: lang,
      isPartOf: { "@id": pageUrl },
    };
    webPage.mainEntity = { "@id": post["@id"] };
    graph.push(post);
  }

  // Home -> section -> page, from the URL: /en/blog/post/ has segments ["blog", "post"].
  const segments = page.url.split("/").filter(Boolean).slice(1);
  if (segments.length) {
    const crumbs = [{ name: label(lang, "home"), url: `${site.url}/${lang}/` }];
    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      crumbs.push({
        name: isLast ? data.title : (label(lang, segment) ?? segment),
        url: `${site.url}/${lang}/${segments.slice(0, index + 1).join("/")}/`,
      });
    });
    webPage.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }

  if (data.caseStudy) {
    const work = {
      // SoftwareSourceCode is a CreativeWork that can carry codeRepository.
      "@type": data.links?.repo ? "SoftwareSourceCode" : "CreativeWork",
      "@id": `${pageUrl}#work`,
      name: data.title,
      description: data.description,
      dateCreated: String(data.year),
      creator: { "@id": personId },
      url: data.links?.live,
      codeRepository: data.links?.repo,
    };
    webPage.mainEntity = { "@id": work["@id"] };
    graph.push(work);
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
