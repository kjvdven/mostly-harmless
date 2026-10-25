---
title: Type demo
layout: default.njk
---

<div class="layout py-8">
<article class="flow prose">

# The Guide to Mostly Harmless Typography

A kitchen sink of everything an article can contain. Body text sits at **step 0** of the fluid scale, with *emphasis*, **strong importance**, and [a link to the feed](/en/feed.xml). Inline code looks like `eleventyConfig.addPlugin()`, keys like <kbd>Ctrl</kbd> + <kbd>C</kbd>, and an <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> abbreviation explains itself on hover.

Some text is <mark>highlighted</mark>, some is <small>small print</small>, and formulas need H<sub>2</sub>O and E = mc<sup>2</sup>.

## Second level heading

A heading belongs to what follows, so it gets room above and sits close to this paragraph. Long paragraphs wrap with `text-wrap: pretty`, so the last line never ends on a single orphaned word.

### Third level heading

- An unordered list item
- A second item with a nested list
  - Nested items get a circle marker
  - And keep their list semantics
- A third item

1. Ordered lists count
2. With decimal markers
3. And the same indent

#### Fourth level heading

<dl>
  <dt>Babel fish</dt>
  <dd>A small, yellow translator you put in your ear.</dd>
  <dt>Towel</dt>
  <dd>The most massively useful thing an interstellar hitchhiker can have.</dd>
</dl>

##### Fifth level heading

<figure>
  <blockquote>
    <p>Time is an illusion. Lunchtime doubly so.</p>
  </blockquote>
  <figcaption>Douglas Adams, <cite>The Hitchhiker's Guide to the Galaxy</cite></figcaption>
</figure>

###### Sixth level heading

```js
const answer = 42;
console.log(`The answer is ${answer}`);
```

---

<figure>
  <img src="./blog/spike.jpg" alt="A gradient from blue to red">
  <figcaption>Images go through eleventy-img and get a caption.</figcaption>
</figure>

<div class="table-scroll" role="region" aria-labelledby="ships-caption" tabindex="0">
  <table>
    <caption id="ships-caption">Ships and their drives</caption>
    <thead>
      <tr><th scope="col">Ship</th><th scope="col">Drive</th><th scope="col">Top speed</th></tr>
    </thead>
    <tbody>
      <tr><th scope="row">Heart of Gold</th><td>Infinite Improbability</td><td>Everywhere at once</td></tr>
      <tr><th scope="row">Millennium Falcon</th><td>Hyperdrive class 0.5</td><td>12 parsecs</td></tr>
    </tbody>
  </table>
</div>

</article>

<section class="flow flow-sm mt-16" aria-labelledby="scale-heading">
  <h2 id="scale-heading" class="text-2xl font-bold">Type scale</h2>
  <p class="text-xs">text-xs — step -2</p>
  <p class="text-sm">text-sm — step -1</p>
  <p class="text-base">text-base — step 0</p>
  <p class="text-lg">text-lg — step 1</p>
  <p class="text-xl">text-xl — step 2</p>
  <p class="text-2xl">text-2xl — step 3</p>
  <p class="text-3xl">text-3xl — step 4</p>
  <p class="text-4xl">text-4xl — step 5</p>
  <p class="text-5xl">text-5xl — step 6</p>
</section>
</div>
