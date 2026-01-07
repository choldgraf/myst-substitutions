# myst-substitutions

A tiny MyST plugin that replaces Nunjucks-style `{{ var }}` tokens using values
from project config and page frontmatter. It exists so you can define a value
once (dates, version numbers, repeated phrases) and reuse it throughout a
project.

## Use cases
- Reuse a version string like `v1.3` across many pages.
- Insert dates or short phrases without copy/paste.
- Keep a few project-wide constants and override them per page.

## Install

Add the bundled plugin to your `myst.yml`:

```yaml
project:
  plugins:
    - path/to/dist/index.mjs
  substitutions:
    version: "v1.3"
```

Add page-level substitutions in frontmatter:

```yaml
---
substitutions:
  version: "v2.0"
  meeting_date: "2025-02-01"
---
```

Then use Nunjucks-style syntax in content:

```markdown
The latest release is {{ version }}.
Next meeting: {{ meeting_date }}.
```

## Notes
- Page substitutions override `project.substitutions`.
- Rendering happens on text nodes as a MyST transform.
- `{{ var }}` is supported as the historical MyST/Jinja-style syntax.
