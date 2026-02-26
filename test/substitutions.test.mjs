import path from "path";
import os from "os";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";
import plugin, {
  getProjectSubstitutions,
  getPageSubstitutions,
  mergeSubstitutions,
  renderWithSubstitutions,
} from "../src/index.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "fixtures");
const pagePath = path.join(fixturesDir, "page.md");

describe("myst-substitutions", () => {
  it("renders Nunjucks-style variables and filters", () => {
    const output = renderWithSubstitutions("Hello {{ name | upper }}", { name: "myst" });
    expect(output).toBe("Hello MYST");
  });

  it("renders filters with arguments", () => {
    const output = renderWithSubstitutions(
      'Fancy filters: {{ site_name | replace("Docs", "Guide") }}',
      { site_name: "MyST Docs" },
    );
    expect(output).toBe("Fancy filters: MyST Guide");
  });

  it("renders filters with smart quotes (curly quotes) normalized", () => {
    const output = renderWithSubstitutions(
      'Fancy filters: {{ site_name | replace(\u201CDocs\u201D, \u201CGuide\u201D) }}',
      { site_name: "MyST Docs" },
    );
    expect(output).toBe("Fancy filters: MyST Guide");
  });

  it("merges project and page substitutions with page override", () => {
    const project = getProjectSubstitutions(fixturesDir);
    const page = getPageSubstitutions(pagePath);
    const merged = mergeSubstitutions(project, page);

    expect(merged.version).toBe("v2.0");
    expect(merged.site_name).toBe("MyST Docs");
    expect(merged.meeting_date).toBe("2025-02-01");
  });

  it("leaves text without template syntax unchanged", () => {
    const output = renderWithSubstitutions("Nothing to replace here.", { name: "myst" });
    expect(output).toBe("Nothing to replace here.");
  });

  it("substitutes merged values into text", () => {
    const project = getProjectSubstitutions(fixturesDir);
    const page = getPageSubstitutions(pagePath);
    const substitutions = mergeSubstitutions(project, page);
    const output = renderWithSubstitutions(
      "Release {{ version }} for {{ site_name }} on {{ meeting_date }}.",
      substitutions,
    );
    expect(output).toBe("Release v2.0 for MyST Docs on 2025-02-01.");
  });

  it("parses substituted values as MyST inline nodes", () => {
    const tempDir = mkdtempSync(path.join(os.tmpdir(), "myst-substitutions-"));
    try {
      writeFileSync(
        path.join(tempDir, "myst.yml"),
        `version: 1
project:
  substitutions:
    site_name: "**MyST Docs**"
`,
      );
      writeFileSync(path.join(tempDir, "index.md"), "Placeholder.");
      const tree = {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", value: "Welcome to {{ site_name }}." }],
          },
        ],
      };
      const transform = plugin.transforms[0].plugin({}, {});
      transform(tree, { cwd: tempDir, path: path.join(tempDir, "index.md") });
      const paragraph = tree.children[0];
      const hasStrong = paragraph.children.some((child) => child.type === "strong");
      expect(hasStrong).toBe(true);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("runs an end-to-end MyST build with substitutions applied", () => {
    const tempDir = mkdtempSync(path.join(os.tmpdir(), "myst-substitutions-"));
    const pluginPath = path.resolve(__dirname, "../src/index.mjs");
    const outputPath = path.join(tempDir, "out.md");

    try {
      writeFileSync(
        path.join(tempDir, "myst.yml"),
        `version: 1
project:
  title: Substitutions Test
  plugins:
    - ${pluginPath}
  substitutions:
    site_name: "MyST Docs"
    release_channel: "stable"
    items:
      - name: "Alice"
      - name: "Bob"
`,
      );
      writeFileSync(
        path.join(tempDir, "index.md"),
        `---
substitutions:
  version: "v2.0"
---

Release {{ version }} for {{ site_name }} on {{ release_channel }}.

:::{substitution}
{% for item in items %}
- {{ item.name }}
{% endfor %}
:::
`,
      );

      execFileSync(
        "myst",
        ["build", "--md", "--force", "index.md", "--output", outputPath],
        { cwd: tempDir, stdio: "pipe" },
      );

      const built = readFileSync(outputPath, "utf8");
      expect(built).toContain("Release v2.0 for MyST Docs on stable.");
      expect(built).toContain("Alice");
      expect(built).toContain("Bob");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
