# myst-substitutions

A tiny MyST plugin that replaces Nunjucks-style `{{ var }}` tokens using values
from project config and page frontmatter. It exists so you can define a value
once (dates, version numbers, repeated phrases) and reuse it throughout a
project.

See [the user documentation](https://chrisholdgraf.com/myst-substitutions) for full documentation.

## Install

Add the bundled plugin to your `myst.yml`:

```yaml
project:
  plugins:
    - path/to/dist/index.mjs
  substitutions:
    version: "v1.3"
```

Then use Nunjucks-style syntax in content:

```markdown
The latest release is {{ version }}.
Next meeting: {{ meeting_date }}.
```
