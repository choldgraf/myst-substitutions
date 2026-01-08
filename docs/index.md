---
substitutions:
  version: "v2.0"
  meeting_date: "2025-02-01"
  meeting_date_literal: "`2025-02-01`"
  release_channel: "preview"
  myvar: "**Wow!**"
---

# myst-substitutions

A small MyST plugin that replaces Nunjucks-style `{{ var }}` tokens using values from project config and page frontmatter.

Define a value once and reuse it across your documentation.

## Basic usage

Enable by adding the `.mjs` file for the latest release of this plugin in your `myst.yml` plugins configuration:

```{code-block} yaml
:filename: myst.yml
project:
  plugins:
    - https://github.com/choldgraf/myst-substitutions/releases/download/v0.1/index.mjs
```

Define key/value pairs in project or page metadata:

```{code-block} md
:filename: page.md
---
substitutions:
  myvar: "**Wow!**"
---
```

Then insert it with `{{ var }}` syntax in your MyST markdown:

:::{myst:demo}
Here's a styled variable: {{ myvar }}.
:::

Here are a few examples of how to use it:

:::{myst:demo}
Welcome to {{ site_name }}.

Style variables in their definition: {{ brand_emphasis }}.

Or style them in your content: **{{ site_name }}**.
:::

This even works in headers:

:::{myst:demo}

### Header variable: {{ site_name }}
:::

:::{note} You'll see an expected warning
MyST throws a warning if there's an un-recognized configuration (like `substitutions:`) so you'll see a warning about this, and can safely ignore it.
:::

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

## Known limitations

- You cannot insert content that isn't part of the base `mystmd` package (e.g. roles defined in extra extensions, like `{button}` won't work until MyST transforms have the ability to re-use the `mystmd` parser.)
- Variables that span multiple lines will not work right now! Keep your variables to a single line.