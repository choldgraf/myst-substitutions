import { readFileSync } from "fs";
import path from "path";
import { mystParse } from "myst-parser";
import { getFrontmatter } from "myst-transforms";
import nunjucks from "nunjucks";
import yaml from "js-yaml";
import { VFile } from "vfile";

const env = new nunjucks.Environment(null, {
  autoescape: false,
  throwOnUndefined: false,
});

function hasTemplateSyntax(text) {
  return text.includes("{{") || text.includes("{%") || text.includes("{#");
}

function ensureMapping(value, label) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (value != null) {
    const kind = Array.isArray(value) ? "array" : typeof value;
    console.warn(`myst-substitutions: ${label} must be a mapping, got ${kind}`);
  }
  return {};
}

function readYamlFile(filePath) {
  const text = readFileSync(filePath, "utf8");
  const data = yaml.load(text);
  return ensureMapping(data, `config in ${filePath}`);
}

// Read project.substitutions from myst.yml in the project root.
export function getProjectSubstitutions(rootDir) {
  const configPath = path.join(rootDir, "myst.yml");
  const config = readYamlFile(configPath);
  const substitutions = config?.project?.substitutions;
  return ensureMapping(substitutions, `project.substitutions in ${configPath}`);
}

// Parse page frontmatter with MyST's frontmatter helper (no regex).
export function getPageSubstitutions(filePath) {
  const text = readFileSync(filePath, "utf8");
  const tree = mystParse(text);
  const vfile = new VFile({ path: filePath });
  const { frontmatter } = getFrontmatter(vfile, tree);
  const substitutions = frontmatter?.substitutions;
  return ensureMapping(substitutions, `frontmatter.substitutions in ${filePath}`);
}

// Merge substitution config so that page over-rides project.
export function mergeSubstitutions(projectSubstitutions, pageSubstitutions) {
  return {
    ...(projectSubstitutions ?? {}),
    ...(pageSubstitutions ?? {}),
  };
}

// Normalize smart/curly quotes back to straight quotes so Nunjucks
// string arguments work. MyST initially converts these to "smart" quotes.
function normalizeQuotes(text) {
  return text.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
}

// Render with Nunjucks; return the original text if parsing fails.
export function renderWithSubstitutions(text, substitutions) {
  if (!hasTemplateSyntax(text)) return text;
  try {
    return env.renderString(normalizeQuotes(text), substitutions);
  } catch {
    return text;
  }
}

// Parse inline MyST so substituted markdown becomes real AST nodes.
function parseInlineMyst(content) {
  const tree = mystParse(content);
  const children = tree?.children;
  if (!Array.isArray(children)) return null;
  if (children.length === 0) return [];
  if (children.length === 1 && children[0]?.type === "paragraph") {
    return children[0].children ?? [];
  }
  return null;
}

// Walk text nodes and replace Nunjucks templates with rendered inline MyST.
function applySubstitutionsToChildren(children, substitutions) {
  if (!Array.isArray(children)) return;
  let index = 0;
  while (index < children.length) {
    const child = children[index];
    if (child?.children) {
      applySubstitutionsToChildren(child.children, substitutions);
    }
    if (child?.type !== "text" || typeof child.value !== "string") {
      index += 1;
      continue;
    }
    if (!hasTemplateSyntax(child.value)) {
      index += 1;
      continue;
    }

    const rendered = renderWithSubstitutions(child.value, substitutions);
    if (rendered === child.value) {
      index += 1;
      continue;
    }

    const inlineNodes = parseInlineMyst(rendered);
    if (inlineNodes === null) {
      child.value = rendered;
      index += 1;
      continue;
    }
    if (inlineNodes.length === 0) {
      children.splice(index, 1);
      continue;
    }
    children.splice(index, 1, ...inlineNodes);
    index += inlineNodes.length;
  }
}

// Load substitutions for a given file and merge with project substitutions config
function getSubstitutionsForFile(vfile) {
  const rootDir = vfile?.cwd || process.cwd();
  const filePath = vfile?.path;
  const projectSubs = getProjectSubstitutions(rootDir);
  const pageSubs = filePath ? getPageSubstitutions(filePath) : {};
  return mergeSubstitutions(projectSubs, pageSubs);
}

const substitutionDirective = {
  name: "substitution",
  doc: "Render Nunjucks template as block-level MyST content. Supports loops, conditionals, tables, and lists.",
  body: {
    type: String,
    doc: "Nunjucks template that produces MyST markdown",
  },
  run(data, vfile, ctx) {
    const body = data.body?.trim();
    if (!body) return [];

    const substitutions = getSubstitutionsForFile(vfile);
    const rendered = renderWithSubstitutions(body, substitutions);
    const parsed = ctx.parseMyst(rendered);

    return parsed?.children ?? [];
  },
};

const substitutionsTransform = {
  name: "myst-substitutions",
  doc: "Replace Nunjucks-style substitutions using project and page metadata.",
  stage: "document",
  plugin: () => {
    return (tree, file) => {
      const substitutions = getSubstitutionsForFile(file);

      if (!Object.keys(substitutions).length) return tree;

      applySubstitutionsToChildren(tree.children, substitutions);

      return tree;
    };
  },
};

const plugin = {
  name: "MyST Substitutions",
  directives: [substitutionDirective],
  transforms: [substitutionsTransform],
};

export default plugin;
