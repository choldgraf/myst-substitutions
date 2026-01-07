import { existsSync, readFileSync } from "fs";
import path from "path";
import { mystParse } from "myst-parser";
import { getFrontmatter } from "myst-transforms";
import nunjucks from "nunjucks";
import yaml from "js-yaml";
import { VFile } from "vfile";

// CH: Only expect myst.yml, simplify this logic
const PROJECT_CONFIG_FILES = ["myst.yml", "myst.yaml"];

// CH: Make clear why this function exists and is used. It feels like it might be unnecessarily complex
function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasTemplateSyntax(text) {
  return text.includes("{{") || text.includes("{%") || text.includes("{#");
}

// CH: Don't worry about the smart quotes, assume users will use normal quotes
// Normalize smart quotes so Nunjucks can parse filter arguments.
function normalizeTemplateText(text) {
  return text
    .replaceAll("\u201C", '"')
    .replaceAll("\u201D", '"')
    .replaceAll("\u2018", "'")
    .replaceAll("\u2019", "'");
}

function readYamlFile(filePath) {
  try {
    const text = readFileSync(filePath, "utf8");
    const data = yaml.load(text);
    return isPlainObject(data) ? data : {};
  } catch {
    return {};
  }
}

// CH: Don't worry about this, assume it exists, mystmd will error if the project config isn't there
function findProjectConfig(rootDir) {
  for (const filename of PROJECT_CONFIG_FILES) {
    const fullPath = path.join(rootDir, filename);
    if (existsSync(fullPath)) return fullPath;
  }
  return null;
}

// Read project.substitutions from myst.yml/myst.yaml in the project root.
export function getProjectSubstitutions(rootDir) {
  const configPath = findProjectConfig(rootDir);
  if (!configPath) {
    return {};
  }

  const config = readYamlFile(configPath);
  const substitutions = config?.project?.substitutions;
  const normalized = isPlainObject(substitutions) ? substitutions : {};
  return normalized;
}

// CH: Assume filePath is always provided
// Parse page frontmatter with MyST's frontmatter helper (no regex).
export function getPageSubstitutions(filePath) {
  if (!filePath) return {};
  try {
    const text = readFileSync(filePath, "utf8");
    // CH: Why do we need the vfile here? We use mystParse by itself later on
    const vfile = new VFile({ path: filePath });
    const tree = mystParse(text, { vfile });
    const { frontmatter } = getFrontmatter(vfile, tree);
    const substitutions = frontmatter?.substitutions;
    return isPlainObject(substitutions) ? substitutions : {};
  } catch {
    return {};
  }
}

// Merge substitution config so that page over-rides project.
export function mergeSubstitutions(projectSubstitutions, pageSubstitutions) {
  return {
    ...(projectSubstitutions ?? {}),
    ...(pageSubstitutions ?? {}),
  };
}

// Render with Nunjucks; return the original text if parsing fails.
export function renderWithSubstitutions(text, substitutions, env) {
  if (!hasTemplateSyntax(text)) return text;
  // CH: Normalization feels unnecessarily complex, only do this if truly needed
  const normalized = normalizeTemplateText(text);
  try {
    return env.renderString(normalized, substitutions);
  } catch {
    return text;
  }
}

// Parse inline MyST so substituted markdown becomes real AST nodes.
function parseInlineMyst(content) {
  const tree = mystParse(content);
  // CH: Add comments for each of these outcomesa and why they're there
  if (!tree || !Array.isArray(tree.children)) return null;
  if (tree.children.length === 0) return [];
  if (tree.children.length === 1 && tree.children[0]?.type === "paragraph") {
    return tree.children[0].children ?? [];
  }
  return null;
}

// CH: This is a confusing function to understand, either add comments, simplify, or use an upstream function
// Depth-first traversal helper for AST nodes.
function visit(node, parent, index, callback) {
  if (!node) return;
  callback(node, parent, index);
  if (!Array.isArray(node.children)) return;
  node.children.forEach((child, childIndex) => visit(child, node, childIndex, callback));
}

// CH: Isn't there a native way in the myst library to traverse or search the AST?
// Collect text nodes that contain templating syntax.
function collectTextNodes(root) {
  const matches = [];
  visit(root, null, null, (node, parent, index) => {
    if (!parent || !Array.isArray(parent.children)) return;
    if (node?.type !== "text" || typeof node.value !== "string") return;
    if (!hasTemplateSyntax(node.value)) return;
    matches.push({ node, parent, index });
  });
  return matches;
}

// Apply substitutions in reverse so splices keep indices stable.
function applySubstitutionsToTree(tree, substitutions, env) {
  const matches = collectTextNodes(tree);
  for (let i = matches.length - 1; i >= 0; i -= 1) {
    // CH: Add comments to each step so it's clear what's happening
    const { node, parent, index } = matches[i];
    const rendered = renderWithSubstitutions(node.value, substitutions, env);
    if (rendered === node.value) continue;

    const inlineNodes = parseInlineMyst(rendered);
    if (inlineNodes === null) {
      node.value = rendered;
      continue;
    }
    if (inlineNodes.length === 0) {
      parent.children.splice(index, 1);
      continue;
    }
    parent.children.splice(index, 1, ...inlineNodes);
  }
}

const substitutionsTransform = {
  name: "myst-substitutions",
  doc: "Replace Nunjucks-style substitutions using project and page metadata.",
  stage: "document",
  plugin: () => {
    const env = new nunjucks.Environment(null, {
      autoescape: false,
      throwOnUndefined: false,
    });

    return (tree, file) => {
      // Merge project + page substitutions, then replace text nodes inline.
      const rootDir = file?.cwd || process.cwd();
      const projectSubstitutions = getProjectSubstitutions(rootDir);
      const pageSubstitutions = getPageSubstitutions(file?.path);
      const substitutions = mergeSubstitutions(projectSubstitutions, pageSubstitutions);

      if (!Object.keys(substitutions).length) return tree;

      applySubstitutionsToTree(tree, substitutions, env);

      return tree;
    };
  },
};

const plugin = {
  name: "MyST Substitutions",
  transforms: [substitutionsTransform],
};

export default plugin;
