---
title: Example project
description: A placeholder case study to try out figures and splits.
type: side
role: Front-end development
stack: [Eleventy, Tailwind CSS]
year: 2026
links:
  live: https://example.com
image: /en/projects/example/cover.jpg
caseStudy: true
---

An intro paragraph in the main column.

{% figure "/en/projects/example/cover.jpg", "Blue placeholder", layout="popout", caption="A popout figure with a caption." %}

Text between figures.

{% split "/en/projects/example/detail.jpg", "Green placeholder" %}
## Text left, image right

Markdown **works** in here.
{% endsplit %}

{% split "/en/projects/example/detail.jpg", "Green placeholder", side="left", zoom=false %}
## Image left, no zoom

The image comes first in the DOM, so the grid keeps both on one row.
{% endsplit %}

{% figure "/en/projects/example/cover.jpg", "Blue placeholder", layout="full" %}
