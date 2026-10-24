# PROJECT_BRIEFING.md — Darth Folio (werktitel)

## Doel van dit document

Dit document beschrijft de scope, architectuur en stack-beslissingen van dit project.
Het is bedoeld als referentie voor Claude Code en andere ontwikkelaars.

---

## Projectomschrijving

Persoonlijke portfolio van Kris van der Ven, ter vervanging van de oude IxD-portfolio
(portfolio.krisvanderven.nl, laatst bijgewerkt in 2016). De nieuwe site legt de nadruk op
front-end development en bestaat uit vier onderdelen: een blog, favoriete patterns,
projecten en een pagina over Kris. De site is volledig statisch, gebouwd met Eleventy 3 en gehost als static site.

De site is zelf óók een visitekaartje: de kwaliteit van de HTML, CSS en toegankelijkheid
is onderdeel van wat er getoond wordt.

### Doelgroep

Een mix van:

- potentiële werkgevers en opdrachtgevers (projecten, wie is Kris);
- vakgenoten / de dev-community (patterns, blog);
- Kris zelf (leren, bijhouden, experimenteren met nieuwe front-end-technieken).

### Thema

Werktitel **Darth Folio** (alternatief in beraad: **Mostly Harmless**). Knipogen naar Star Wars en The Hitchhiker's Guide to the Galaxy
zijn welkom (bijvoorbeeld in sectienamen, de 404-pagina of microcopy), zolang ze de
bruikbaarheid en toegankelijkheid niet in de weg zitten.

---

## Architectuur

### Type

Statische site (SSG), geen backend, geen database.

### Onderhoud

Kris bouwt en onderhoudt de site alleen. Greenfield: nieuwe repository, geen code uit de
oude portfolio.

### Domein en URL's

- Domein: **krisvanderven.nl** (apex). `www` stuurt door naar de apex.
- Secties met gewone, Engelse URL's: `/en/blog/`, `/en/patterns/`, `/en/projects/`, `/en/about/`.
  Het Star Wars-/Hitchhiker's-thema zit hooguit in microcopy en de 404-pagina, niet in URL's.
- URL's eindigen op `/` (Eleventy-standaard); "pretty URLs" in Sevalla staat daarop afgestemd.

### Meertaligheid (EN + NL)

De site wordt tweetalig: Engels en Nederlands, via de ingebouwde `I18nPlugin` van Eleventy.

**Fasering — snel online gaat voor:** v1 gaat live in **alleen het Engels**. De structuur is
vanaf dag één wél meertalig-klaar, omdat URL's achteraf omzetten links breekt en dat nu
bijna niets kost. Nederlands volgt in een latere versie; vertalen is daarna **optioneel**
(content mag in één taal bestaan).

**In v1:** `/en/`-prefix, `src/en/`-map, `lang` via directory data, UI-strings via
`src/_data/i18n.js` + `t`-filter (alleen EN gevuld), redirect `/` → `/en/`.
**Later (bij NL):** `src/nl/`, taalwisselaar, `hreflang`-links, NL-feed.

**URL's en root:**

- Beide talen krijgen een prefix: `/en/...` en `/nl/...`.
- `/` stuurt met een `301` door naar `/en/`, via een `_redirects`-bestand. Sevalla leest
  `_redirects` uit de publish directory, dus het bestand wordt met passthrough copy naar
  de output gekopieerd. Regel: `/  /en/  301`.
- 404 per taal via `_redirects`: `/en/*  /en/404.html  404` (en later `/nl/*`).
- Geen JavaScript-redirect en geen taaldetectie (slecht voor toegankelijkheid en SEO).

**Leerpunt:** hoe Eleventy meertaligheid aanpakt staat in de docs van de i18n-plugin
(11ty.dev/docs/plugins/i18n/). In het kort: de plugin herkent de taal aan de eerste map
van de URL, en filters als `locale_url` en `locale_links` vinden de versie van een pagina
in een andere taal.

**Uitgangspunten (gelden zodra NL er is):**

- **Content per taal in een eigen map:** `src/en/...` en `src/nl/...`, met een directory
  data file per taal die `lang` zet.
- **Zelfde slug in beide talen** (`/en/patterns/disclosure/` ↔ `/nl/patterns/disclosure/`),
  zodat de plugin vertalingen automatisch aan elkaar koppelt (`locale_links`).
- **UI-strings** (navigatie, labels, knoppen) in één woordenboek, `src/_data/i18n.js`,
  met een `t`-filter in Nunjucks. Geen hardcoded UI-tekst in templates.
- **`<html lang>`** per pagina; `<link rel="alternate" hreflang>` naar de vertaling als die
  bestaat.
- **Taalwisselaar** linkt naar de vertaalde versie van de huidige pagina, of naar de
  homepage van de andere taal als er geen vertaling is. Links krijgen `hreflang` en
  `lang` (WCAG 3.1.2).
- **Feeds:** één Atom-feed per taal.
- **Demopagina's van patterns** zijn taalonafhankelijk en bestaan één keer.

### Homepage

Korte introductie (1–2 zinnen: wie, wat, waar), de laatste blogposts, een selectie
projecten en een link naar de About-pagina. Alles verwijst door naar de secties; de
homepage herhaalt geen content.

### About

Eén pagina, `/en/about/` (`src/en/about.md`), in Markdown met een eigen layout.

- **Inhoud:** wie Kris is, wat hij nu doet (front-end bij Lemone), waar zijn focus ligt
  (front-end, toegankelijkheid, met een achtergrond in interaction design) en contact.
- **Foto (optioneel):** via `@11ty/eleventy-img`, met alt-tekst.
- **Contact:** gewone `mailto:`-link en links naar profielen, met `rel="me"` op de
  profiellinks (koppelt je profielen aan je site). Geen contactformulier in v1 (KISS).
- **Profielen:** in `src/_data/site.js`, zodat header, footer en About dezelfde lijst
  gebruiken. Welke profielen: zie openstaande beslissingen.

### Blog

Posts **met titel**, chronologisch, met tags. Geen vaste lengte: kort of lang mag allebei.

- **Content:** één Markdown-bestand per post in een eigen map, bijvoorbeeld
  `src/en/blog/2026-10-23-post-title.md` (en het NL-equivalent onder `src/nl/`).
- **Front matter:** `title`, `date`, `tags`, optioneel `description` (voor de feed en meta).
- **Collectie:** via een directory data file (`blog.11tydata.js`) krijgen alle posts
  automatisch de tag `blog` en de juiste layout.
- **Overzicht:** lijst van posts, nieuwste eerst. Paginering pas toevoegen als de lijst
  daar om vraagt (KISS).
- **Tags:** tagpagina's gegenereerd met Eleventy-paginering over de tags. De technische
  collectie-tag `blog` wordt uitgefilterd zodat die geen eigen tagpagina krijgt.
- **Feed:** Atom-feed via `@11ty/eleventy-plugin-rss` (virtual template, één feed per
  taal). Feed-link in de `<head>` (`rel="alternate"`) en zichtbaar op de pagina.
- **Reageren:** geen comments, geen webmentions in v1. Mensen volgen via de feed.
- **Semantiek:** elke post is een `<article>` met `<time datetime>`; tags als lijst met links.

### Favorite patterns

Aparte sectie met een eigen collectie, los van de blog. Mix van UI-componenten,
CSS-technieken/layouts en code-snippets (JS, Nunjucks, tooling).

- **Content:** één Markdown-bestand per pattern, bijvoorbeeld `src/en/patterns/disclosure.md` (en NL onder `src/nl/`).
- **Front matter:** `title`, `description`, `category` (`component` | `css` | `snippet`),
  `tags`, `date`, optioneel `updated`.
- **Vaste paginastructuur** per pattern:
  1. Wat is het (korte uitleg)
  2. Wanneer gebruik je het (en wanneer niet)
  3. Demo (alleen als er iets te zien is; snippets kunnen zonder)
  4. Code
  5. Toegankelijkheid (toetsenbordgedrag, ARIA, screenreader-gedrag), verplicht bij UI-componenten
  6. Bronnen
- **Single source of truth:** de demo en de getoonde code komen uit hetzelfde bestand.
  Een Nunjucks-shortcode (bijv. `{% demo "disclosure" %}`) rendert de demo én toont de
  broncode, zodat die twee nooit uit elkaar lopen.
- **Code-highlighting:** tijdens de build met `@11ty/eleventy-plugin-syntaxhighlight`
  (Prism). Geen client-side JS nodig; het kleurenschema wordt met Tailwind-tokens gestyled
  en moet in light én dark mode voldoen aan het contrast van WCAG AA.
- **Overzicht:** gegroepeerd per `category`, zonder JS. Filteren met JS kan later als
  progressive enhancement.
- **Demo-weergave:** iframe met een losse demopagina per pattern
  (bijv. `/patterns/disclosure/demo/`).
  - Isolatie: artikelstijlen (Markdown-typografie) lekken niet in de demo, en scripts van
    verschillende demo's zitten elkaar niet in de weg.
  - De demopagina is los te openen ("Open demo in nieuw tabblad").
  - Breedte aanpasbaar, handig voor responsive- en container-query-demo's.
  - `loading="lazy"` op het iframe, zodat demo's pas laden als ze in beeld komen.
  - Elk iframe krijgt een beschrijvende `title` (WCAG 4.1.2).
  - Demopagina's krijgen `noindex` en komen niet in de sitemap.
- **Waarom geen islands:** islands (zoals `@11ty/is-land`) regelen _wanneer_ JS laadt,
  niet _isolatie_. Stijlen van de pagina lekken nog steeds in de demo. Lazy laden lossen we
  native op met `loading="lazy"` op het iframe, zonder extra dependency (KISS).

### Projecten

Mix van klantwerk (o.a. via Lemone), eigen side projects en open source-bijdragen.
Elk project heeft een korte kaart; een case study is optioneel.

- **Content:** één Markdown-bestand per project, bijvoorbeeld `src/en/projects/project-name.md` (en NL onder `src/nl/`).
- **Front matter:**
  - `title`, `description` (één zin)
  - `type`: `client` | `side` | `oss`
  - `role` (wat deed Kris), `stack` (lijst), `year`
  - `links`: `live`, `repo` (beide optioneel)
  - `image` (optioneel, screenshot)
  - `caseStudy`: `true` | `false`
- **Kaart vs. case study:** bij `caseStudy: false` bestaat het project alleen als kaart in
  het overzicht (`permalink: false`). Bij `caseStudy: true` krijgt het een eigen pagina, met
  de Markdown-body als case study. Regelen via `eleventyComputed.permalink` in een
  directory data file.
- **Overzicht:** gegroepeerd of gelabeld per `type`, nieuwste eerst.
- **Afbeeldingen:** via `@11ty/eleventy-img` (responsive formaten, AVIF/WebP, `width`/`height`
  tegen layout shift). Alt-tekst verplicht in de front matter.
- **Klantwerk:** alleen tonen met toestemming van de klant (en waar nodig van Lemone).

---

### Structured data (JSON-LD)

Elke pagina krijgt JSON-LD (schema.org) in de `<head>`. Dit is een kernvereiste, geen extraatje.

- **Eén `@graph` per pagina,** met vaste `@id`'s, zodat entiteiten naar elkaar verwijzen in
  plaats van overal herhaald te worden:
  - `Person` (`https://krisvanderven.nl/#person`): naam, `jobTitle`, `worksFor` (Lemone),
    `url`, `image`, `sameAs` (de profiel-URL's uit `site.js`).
  - `WebSite` (`https://krisvanderven.nl/#website`): naam, `url`, `inLanguage`,
    `publisher` → `#person`.
  - `WebPage` per pagina: `url`, `name`, `description`, `inLanguage`, `isPartOf` → `#website`.
- **Per paginatype:**

  | Pagina                     | Type                                       | Belangrijkste velden                                                                                                                            |
  | -------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
  | Homepage                   | `WebSite` + `Person`                       | zie hierboven                                                                                                                                   |
  | About                      | `ProfilePage` met `mainEntity` → `#person` |                                                                                                                                                 |
  | Blogpost                   | `BlogPosting`                              | `headline`, `description`, `datePublished`, `dateModified`, `author` → `#person`, `keywords` (tags), `inLanguage`, `image`                      |
  | Blogoverzicht              | `Blog`                                     | `blogPost` (lijst met verwijzingen)                                                                                                             |
  | Pattern                    | `TechArticle`                              | `headline`, `description`, `datePublished`, `dateModified` (`updated`), `author`, `keywords`, `proficiencyLevel` optioneel                      |
  | Project (case study)       | `CreativeWork`                             | `name`, `description`, `dateCreated` (`year`), `creator` → `#person`, `url` (live), `codeRepository` waar van toepassing (`SoftwareSourceCode`) |
  | Alle pagina's behalve home | `BreadcrumbList`                           | pad home → sectie → pagina                                                                                                                      |

- **Bron:** alle waarden komen uit de bestaande data (`site.js`, front matter,
  i18n-taal). Nooit dubbel handmatig invullen.
- **Opbouw:** in JavaScript (een Eleventy-filter of `eleventyComputed`) als object, dan
  geserialiseerd. **Geen JSON met de hand in Nunjucks schrijven**: quotes en tekens in
  titels breken dan de JSON.
- **Veilig serialiseren:** een eigen filter `jsonLd` doet `JSON.stringify` en vervangt `<`
  door `\u003c`, zodat een `</script>` in content de pagina niet kan breken (security).
  Gebruik: `<script type="application/ld+json">{{ graph | jsonLd | safe }}</script>`.
- **Meertalig:** `inLanguage` volgt `lang`; zodra NL er is, verwijzen vertalingen naar elkaar
  via `workTranslation` / `translationOfWork`.
- **Demopagina's** krijgen geen JSON-LD (ze hebben al `noindex`).
- **Validatie:** elk template-type controleren met de Schema.org Validator en de Google
  Rich Results Test, vóór livegang en bij wijzigingen aan layouts.

---

## Tech Stack

| Laag              | Keuze                                            | Versie                   | Reden                                                                                                                                        |
| ----------------- | ------------------------------------------------ | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime           | Node.js via mise                                 | 24.x (LTS "Krypton")     | Actuele LTS op major-versie, zodat security-patches meekomen; voldoet ook aan het minimum van Eleventy 4                                     |
| SSG               | Eleventy (`@11ty/eleventy`)                      | 3.1.7                    | Stabiele release; alle plugins en de referentie-starters draaien erop                                                                        |
| Templates         | Nunjucks (layouts/partials) + Markdown (content) | via Eleventy             | Simpel en het meest uitgetest; geen extra onzekerheid naast de Vite-integratie                                                               |
| Bundler           | Vite via `@11ty/eleventy-plugin-vite`            | Vite 8.3.5, plugin 8.0.0 | Lemone-standaard: CSS en JS altijd via Vite                                                                                                  |
| CSS               | Tailwind CSS via `@tailwindcss/vite`             | 4.3.3                    | Keuze van Kris, in lijn met de Lemone-standaard                                                                                              |
| Feed              | `@11ty/eleventy-plugin-rss`                      | 3.1.0                    | Officiële plugin; Atom-feed via virtual template                                                                                             |
| Code-highlighting | `@11ty/eleventy-plugin-syntaxhighlight`          | 5.0.2                    | Highlighting tijdens de build, geen client-side JS                                                                                           |
| Afbeeldingen      | `@11ty/eleventy-img`                             | 7.1.1                    | Responsive afbeeldingen, moderne formaten, geen layout shift                                                                                 |
| Animatie          | GSAP (`gsap`)                                    | 3.15.0                   | Keuze van Kris; via Vite geïmporteerd, alleen op pagina's die het gebruiken                                                                  |
| JavaScript        | Vanilla JS, progressive enhancement              | n.v.t.                   | Site werkt volledig zonder JS; JS voegt alleen gedrag toe                                                                                    |
| Hosting           | Sevalla Static Site Hosting                      | n.v.t.                   | Gratis, bouwt vanuit de GitHub-repo zelf (geen GitHub Actions nodig), Cloudflare CDN, ondersteunt `_redirects` en een instelbare Node-versie |

### Tailwind 4 + Eleventy

- Tailwind 4 is CSS-first: configuratie in de CSS met `@theme`, geen `tailwind.config.js`.
- Controleren dat Tailwind de `.njk`- en `.md`-bestanden scant. Waar nodig expliciet
  toevoegen met `@source` in de hoofd-CSS.
- Voorkeur voor utilities in templates. Herbruikbare componenten via Nunjucks-partials/macros,
  niet via `@apply`-zware CSS.

### GSAP

- Installeren via npm (`gsap`) en importeren via Vite; geen CDN-script (geen third-party
  scripts, zie Ontwerpprincipes). Alleen de plugins importeren die echt gebruikt worden
  (bijv. `ScrollTrigger`) en registreren met `gsap.registerPlugin()`.
- Licentie: GSAP valt onder de gratis "Standard 'no charge' license" van GSAP (geen
  open-sourcelicentie). Prima voor een persoonlijke portfolio.
- **Progressive enhancement:** content is altijd zichtbaar en bruikbaar zonder JS. Begintoestanden
  van animaties (bijv. onzichtbaar, verschoven) worden door GSAP zelf gezet (`gsap.from()`),
  nooit in de CSS. Anders blijft content verborgen als JS faalt.
- **Reduced motion:** alle animaties via `gsap.matchMedia()` met
  `(prefers-reduced-motion: no-preference)`. Bij `reduce` geen beweging, of alleen een
  korte fade (WCAG 2.3.3).
- **Geen animatie die de bediening blokkeert:** geen scroll-jacking, focus en toetsenbord
  blijven werken tijdens animaties, en niets dat langer dan 5 seconden automatisch beweegt zonder pauzeknop
  (WCAG 2.2.2).
- GSAP-voorbeelden kunnen ook als pattern verschijnen (demo in iframe).

### Vite + Eleventy

- `@11ty/eleventy-plugin-vite` 8.0.0 vereist Vite ^8.0.9. De combinatie met Eleventy 3.1 is
  bewezen in eleventy-plus-vite (zie Referenties).
- **Open risico:** bij een build hernoemt de plugin `_site` naar een tijdelijke map en laat
  Vite alleen de HTML opnieuw bouwen. Niet-HTML-output (`_redirects`, `feed.xml`,
  afbeeldingen van eleventy-img) moet daarom via `public/` en Vite's `publicDir`. Dit is de
  kernvraag van de spike (dev-server én productiebuild).

### Eleventy 4 later

- Bewust v3: v4 is nog alpha (`@11ty/eleventy@canary`) en heet upstream inmiddels
  **Build Awesome** (repo: github.com/11ty/buildawesome, pakket `@awesome.me/buildawesome@alpha`).
  Let op: `@awesome.me/buildawesome@latest` (0.0.3) is een lege placeholder.
- Upgraden zodra v4 stabiel is. Let dan op het verwijderde `slug`-filter (gebruik nu al
  `slugify`) en het Node-minimum van 22.15+.
- Bij elke major-upgrade de release notes lezen op breaking changes.

---

## Ontwerpprincipes

Dezelfde principes als bij elk Lemone-project — _Puur Online Vakmanschap_:

- **KISS** — Houd het simpel. Vermijd onnodige complexiteit in code, architectuur en UX.
- **Toegankelijkheid (WCAG)** — Semantische HTML, correcte ARIA-attributen, toetsenbordnavigatie,
  voldoende kleurcontrast. Minimaal WCAG 2.1 AA.
- **Gebruiksvriendelijkheid** — Intuïtieve flows, duidelijke feedback, geen onnodige drempels.
  De gebruiker hoeft nooit na te denken over hoe de interface werkt.
- **Security** — Geen gevoelige data in frontend-state of URLs, correcte HTTP-headers,
  dependencies up-to-date houden, geen onnodige third-party scripts.

---

## Niet-functionele vereisten

- **Interfacetaal:** Engels in v1, Nederlands later (zie Meertaligheid).
- **Performance:** statische HTML, geen client-side rendering. JS alleen als progressive
  enhancement. Afbeeldingen via eleventy-img. Geen third-party scripts in v1.
- **SEO:** unieke `<title>` en `meta description` per pagina, canonical URL's, sitemap
  (zonder demopagina's), Atom-feed gelinkt in de `<head>`, JSON-LD op elke pagina
  (zie Structured data).
- **Toegankelijkheid:** WCAG 2.1 AA (zie Ontwerpprincipes), skip link, logische koppenstructuur,
  zichtbare focusstijlen, `prefers-reduced-motion` respecteren.

---

## Projectstructuur (verwacht)

```
darth-folio/
├── mise.toml                  # Node-versie (24.x)
├── package.json               # dependencies, engines (node 24.x)
├── eleventy.config.js         # plugins (Vite, i18n, RSS, syntaxhighlight), filters, shortcodes
├── PROJECT_BRIEFING.md        # dit document
└── src/
    ├── _redirects             # / → /en/, 404 per taal (passthrough copy)
    ├── _config/
    │   └── json-ld.js         # bouwt de @graph per paginatype + jsonLd-filter
    ├── _data/
    │   ├── site.js            # titel, URL, auteur, profielen (bron voor Person/sameAs)
    │   └── i18n.js            # UI-strings per taal
    ├── _includes/
    │   ├── layouts/           # base.njk, page.njk, post.njk, pattern.njk, project.njk, demo.njk
    │   └── partials/          # header, footer, nav, project-card, tag-list, json-ld
    ├── assets/
    │   ├── css/main.css       # Tailwind 4 (@import "tailwindcss", @theme, @source)
    │   └── js/                # vanilla JS-modules (progressive enhancement)
    ├── demos/                 # demo-markup per pattern (taalonafhankelijk, één bron)
    ├── en/
    │   ├── en.11tydata.js     # lang: "en"
    │   ├── index.njk          # homepage
    │   ├── about.md           # over Kris
    │   ├── 404.njk
    │   ├── feed.njk           # of virtual template via de RSS-plugin
    │   ├── blog/              # posts + blog.11tydata.js
    │   ├── patterns/          # patterns + patterns.11tydata.js
    │   └── projects/          # projecten + projects.11tydata.js
    └── nl/                    # later
```

---

## Development tooling

### MCP servers

- **Context7** — haalt actuele library-docs op in Claude Code. Extra nuttig hier, omdat
  Tailwind 4 en Vite 8 nieuwer zijn dan de trainingsdata van de meeste modellen.

### Referenties

Voorbeeld, geen template: we klonen niet, we bouwen zelf.

- **[eleventy-plus-vite](https://github.com/matthiasott/eleventy-plus-vite)** — de Vite-opzet:
  assets via passthrough copy, `setServerPassthroughCopyBehavior("copy")`, statische bestanden
  via `public/` + `publicDir`. Niet overnemen: Sass, PostCSS, `rollup-plugin-critical`, luxon,
  ESLint 8, version ranges en een genegeerde `package-lock.json`.
- **[eleventy-excellent](https://github.com/madrilene/eleventy-excellent)** — mappen en
  config-indeling: `src/_config/` (filters, plugins, shortcodes) en `export const config`.
  Niet overnemen: CSS bouwen via `eleventy.before`-events, WebC, JSON-LD als Nunjucks-template,
  Tailwind 3.

### Editor & environment

**mise** beheert de Node-versie én de project-commands. `mise.toml` in de root:

```toml
[tools]
node = "24"

[tasks.install]
description = "Install dependencies"
run = "npm install"

[tasks.dev]
description = "Start the Eleventy dev server (with Vite) on localhost"
run = "npm run dev"

[tasks.build]
description = "Build the site for production into _site/"
run = "npm run build"

[tasks.clean]
description = "Remove build output"
run = "rm -rf _site .11ty-vite"
```

Gebruik: `mise install` (Node), `mise run install`, `mise run dev`, `mise run build`.

**Waarom mise-tasks `npm run` aanroepen in plaats van de commands zelf:** Sevalla bouwt de
site zonder mise en draait `npm run build`. De echte commands staan daarom één keer in
`package.json`; mise is de prettige ingang lokaal. Zo kunnen lokaal en Sevalla nooit uit
elkaar lopen.

### Versiebeleid

- **Node:** major-versie in `mise.toml` (`node = "24"`), `engines` (`"node": "24.x"`) en Sevalla
  gelijk. Node draait alleen tijdens de build; zo komen security-patches mee met `mise upgrade`
  zonder ongemerkt naar een nieuwe major te gaan.
- **npm-dependencies:** `^`-ranges in `package.json` mogen; `package-lock.json` wordt altijd
  gecommit en is de echte pin. Builds installeren uit de lockfile.
- **Bijhouden:** regelmatig `npm outdated` en `mise outdated`, of Dependabot op GitHub. Bij een
  major-upgrade eerst de release notes lezen.

```json
"scripts": {
  "dev": "eleventy --serve",
  "build": "eleventy"
}
```

---

## Codestijl & conventies

### Codebase taal

Engels: variabelen, functies, comments, bestandsnamen, mapnamen, front matter-keys en
collectienamen. Alleen de content en de UI-strings in `src/_data/i18n.js` zijn tweetalig.

### Git

- Commit messages: English, Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, ...)
- Branch names: English, Conventional Branch (`feat/`, `fix/`, `chore/`, `release/`, ...)

---

## Bewuste niet-keuzes

- **Alpine.js** — niet nodig; de interactiviteit op deze site is beperkt en vanilla JS met
  progressive enhancement volstaat. Pas heroverwegen als er complexe UI-state ontstaat.
- **WebC** — component-gericht en Eleventy-eigen, maar extra complexiteit naast Vite en Tailwind.
- **Moderne vanilla CSS zonder framework** — overwogen als showcase van CSS-vakmanschap;
  gekozen is Tailwind via Vite.
- **Oude IxD-projecten** (Rabobank, Interpolis, Oodit, ...) — worden niet meegenomen, ook
  niet als archief. De nieuwe site richt zich op front-end; de oude content is uit 2016.
- **Islands (`@11ty/is-land`) voor demo's** — regelen laadmoment, niet isolatie; zie Patterns.
- **Frameworks (React, Astro, Next.js, ...)** — overbodig voor een statische contentsite.

---

## Niet in scope (v1)

- Nederlandse versie (`/nl/`), taalwisselaar, `hreflang`-links en NL-feed
- Webmentions / IndieWeb-reacties op de blog
- Feeds per tag
- Filteren van patterns met JS (progressive enhancement op het gegroepeerde overzicht)
- Browserondersteuning per pattern tonen (bijv. Baseline-status)

---

## Openstaande beslissingen

- [ ] Definitieve naam. Kandidaten: **Darth Folio** en **Mostly Harmless**. _Niet blokkerend:_
      repo en werktitel blijven `darth-folio` tot er gekozen is. Beslissen vóór livegang of de
      naam ook in de UI (titel, logo) terugkomt.
- [ ] Toestemming voor klantprojecten. _Blocked by:_ keuze welke klantprojecten erop komen.
- [ ] Oud subdomein `portfolio.krisvanderven.nl` doorsturen naar `https://krisvanderven.nl/en/`.
      _Blocked by:_ nagaan waar het subdomein nu gehost wordt; de redirect gebeurt daar of via DNS.
- [ ] Nagaan wat er nu op `krisvanderven.nl` staat en of daar iets van bewaard moet blijven.
      _Blocked by:_ inventarisatie door Kris vóór de DNS-omzetting.
- [ ] Welke profielen en contactkanalen op de About-pagina (bijv. e-mail,
      GitHub, LinkedIn). Kris kiest zelf welke kanalen erop komen.
- [ ] Spike-resultaten (zie Volgende stappen, stap 2). Na de spike hier vastleggen wat wel en
      niet werkte met Eleventy 3 + Vite.

---

## Volgende stappen

1. **Repo opzetten:** GitHub-repo `darth-folio`, `mise.toml` met Node 24 en de tasks, `npm init`,
   Eleventy `@11ty/eleventy@3.1.7`. Deze briefing in de root.
2. **Spike — fundering (Eleventy 3 + Vite)** (vóór er content komt). Werkt het allemaal,
   zowel in de dev-server als in de productiebuild?
   - `@11ty/eleventy-plugin-vite` + `@tailwindcss/vite` (CSS met gehashte bestandsnamen)
   - een GSAP-import via Vite in de productiebuild
   - `I18nPlugin` met `/en/`-prefix
   - `@11ty/eleventy-plugin-rss`, `@11ty/eleventy-plugin-syntaxhighlight`, `@11ty/eleventy-img`
   - passthrough copy van `_redirects`
     Werkt iets niet: issue zoeken/melden bij 11ty, en per plugin beslissen (workaround, of
     die ene dependency tijdelijk anders oplossen).
3. **Basislayout:** `base.njk` met skip link, landmarks, navigatie, `lang`, `i18n.js` + `t`-filter,
   JSON-LD-basis (`Person`, `WebSite`, `WebPage`) en GSAP-setup met `gsap.matchMedia()` en
   reduced motion.
4. **Sevalla koppelen:** static site uit de GitHub-repo, Node-versie gelijk aan `mise.toml`,
   build command `npm run build`, publish directory `_site`, pretty URLs aan.
   Testen op het tijdelijke `sevalla.page`-adres.
5. **Secties bouwen:** homepage + About → blog → patterns (met demo-shortcode en iframe) → projecten.
6. **Eerste content:** About-tekst, een paar blogposts, 2–3 patterns, een handvol projecten.
7. **Livegang:** `krisvanderven.nl` (apex) koppelen in Sevalla, `www` doorsturen naar de
   apex, oud subdomein doorsturen, toegankelijkheidscheck (WCAG 2.1 AA) op alle templates,
   JSON-LD van elk template-type valideren (Schema.org Validator + Rich Results Test).
