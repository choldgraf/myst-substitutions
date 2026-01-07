---
substitutions:
  version: "v2.0"
  meeting_date: "2025-02-01"
  meeting_date_literal: "`2025-02-01`"
  release_channel: "preview"
---

# myst-substitutions

A small MyST plugin that replaces Nunjucks-style `{{ var }}` tokens using values from project config and page frontmatter.

Define a value once and reuse it across your documentation.

## Configuration

Define substitutions at either the project-level (in `myst.yml`), or in page frontmatter. Page-level configuration over-rides project-level configuration. Here are examples from these docs:

```{literalinclude} ./myst.yml
:language: yaml
:lines: 2-11
```

```{code-block} yaml
:filename: index.md

---
substitutions:
  version: "v2.0"
  meeting_date: "2025-02-01"
  meeting_date_literal: "`2025-02-01`"
  release_channel: "preview"
---
```

## Basic usage

Use `{{ var }}` syntax to insert variables into your documentation:

:::{myst:demo}
Welcome to {{ site_name }}.

Style variables in their definition: {{ brand_emphasis }}.

Or style them in your content: **{{ site_name }}**.
:::

This even works in headers:

:::{myst:demo}

### Header variable: {{ site_name | literal }}
:::

## Page-level over-rides

Override or add values per page with frontmatter. This page sets `version`,
`meeting_date`, and overrides `release_channel`.

:::{myst:demo}
Latest release: {{ version }}.

Next meeting: {{ meeting_date }}.

Channel for this page: {{ release_channel }}.
:::

## Nunjucks filters

[Nunjucks Filters](https://mozilla.github.io/nunjucks/templating.html) work too:

:::{myst:demo}
Shout it: {{ site_name | upper }}!

Fancy filters: {{ site_name | replace("Docs", "is totally cool") | upper }}
:::

Advanced filters work (sometimes):

:::{myst:demo}
{% set items = [1,2,3,4,5,6] %}
{% set dash = joiner("-") %}
{% for item in items | batch(2) %}
    {{ dash() }} {% for items in item %}
       {{ items }}
    {% endfor %}
{% endfor %}
:::

However, **filters that split syntax across lines do not work**.
