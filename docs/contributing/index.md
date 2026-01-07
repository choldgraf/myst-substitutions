# Contributing

Thanks for helping improve myst-substitutions. This project is intentionally
small, and changes should stay easy to read and review.

## Repository layout

- `src/index.mjs` core plugin logic (single file)
- `dist/index.mjs` bundled plugin used by docs
- `docs/` MyST docs site for this repo
- `test/` Vitest tests
- `Justfile` task runner commands for tests and docs
- `.github/workflows/` CI and release workflows

## How the plugin works

The plugin is a MyST transform. It:

1) Loads substitutions from `myst.yml` (`project.substitutions`).
2) Loads page substitutions from frontmatter.
3) Uses Nunjucks to render `{{ var }}` tokens.
4) Parses substituted text as MyST inline content so markup like `**bold**`
   becomes AST nodes.

All core logic lives in `src/index.mjs`.

## Development setup

Requirements:
- Node.js for tests and dependencies.
- Python + `uv` for docs/test helpers.
- `just` for running repository commands.

Install dependencies:

```bash
npm install
```

## Run tests

```bash
just test
```

## Build the bundle

```bash
just build
```

## Build docs

```bash
just docs
```

## Live docs

```bash
just docs-live
```

## Releasing

Releases are handled by GitHub Actions. To make a release

- Create a release in GitHub
- A workflow will automatically run and attach the latest `dist/index.mjs` to the release.
