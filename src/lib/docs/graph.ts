/**
 * Navigation graph builder from a scanned gobbi-docs corpus.
 *
 * Builds a directed graph of navigation and parent relationships between
 * documents, enabling orphan detection and link resolution checks.
 */

import path from 'node:path';
import type { ScannedDoc } from './scanner.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface GraphEdge {
  from: string;       // source doc path
  to: string;         // target doc path or unresolved reference
  type: 'navigation' | 'parent';
  resolved: boolean;
}

export interface DocGraph {
  nodes: Map<string, ScannedDoc>;
  edges: GraphEdge[];
  adjacency: Map<string, string[]>;  // path -> connected paths
  orphans: string[];                  // nodes with no incoming edges (except roots)
}

// ---------------------------------------------------------------------------
// Navigation key parsing
// ---------------------------------------------------------------------------

/** Markdown link pattern: `[text](path)` — extract the path portion. */
const MD_LINK_RE = /^\[.*?\]\((.+)\)$/;

/**
 * Attempt to resolve a navigation key to an absolute file path.
 *
 * Navigation keys appear in three formats:
 * 1. Markdown links `[text](path)` — resolve path relative to source doc dir
 * 2. Skill names like `_rules` — resolve to `skills/{name}/SKILL.json` within corpus
 * 3. Descriptive text like `"Benchmark scenarios"` — unresolvable
 *
 * Returns the resolved absolute path if matched, or undefined if unresolvable.
 */
function resolveNavKey(
  key: string,
  sourceDir: string,
  skillPathLookup: Map<string, string>,
): string | undefined {
  // Format 1: Markdown link [text](path)
  const mdMatch = MD_LINK_RE.exec(key);
  if (mdMatch !== null) {
    const linkPath = mdMatch[1];
    if (linkPath !== undefined && linkPath !== '') {
      return path.resolve(sourceDir, linkPath);
    }
    return undefined;
  }

  // Format 2: Skill name (starts with _ or __ prefix, or matches a known skill directory name)
  const skillPath = skillPathLookup.get(key);
  if (skillPath !== undefined) {
    return skillPath;
  }

  // Format 3: Descriptive text — unresolvable
  return undefined;
}

// ---------------------------------------------------------------------------
// Graph builder
// ---------------------------------------------------------------------------

/**
 * Build skill name lookup: map from skill directory name to its SKILL.json absolute path.
 * Extracts from corpus nodes whose filename is SKILL.json.
 */
function buildSkillPathLookup(corpus: ScannedDoc[]): Map<string, string> {
  const lookup = new Map<string, string>();
  for (const doc of corpus) {
    if (path.basename(doc.path) === 'SKILL.json') {
      const skillDirName = path.basename(path.dirname(doc.path));
      lookup.set(skillDirName, doc.path);
    }
  }
  return lookup;
}

/**
 * Resolve a parent field value to an absolute SKILL.json path.
 * Parent fields contain skill directory names (e.g., `"_claude"`, `"gobbi"`).
 */
function resolveParent(
  parentName: string,
  skillPathLookup: Map<string, string>,
): string | undefined {
  return skillPathLookup.get(parentName);
}

/** Entry point file names that are not considered orphans. */
const ENTRY_POINT_NAMES: ReadonlySet<string> = new Set([
  'SKILL.json',
  'README.json',
]);

/**
 * Build a navigation graph from a scanned corpus.
 *
 * Resolves navigation links and parent references between documents,
 * builds adjacency lists, and identifies orphan documents.
 */
export function buildGraph(corpus: ScannedDoc[]): DocGraph {
  const nodes = new Map<string, ScannedDoc>();
  for (const doc of corpus) {
    nodes.set(doc.path, doc);
  }

  const skillPathLookup = buildSkillPathLookup(corpus);
  const edges: GraphEdge[] = [];
  const adjacency = new Map<string, string[]>();
  const incomingCount = new Map<string, number>();

  // Initialize adjacency and incoming counts for all nodes
  for (const docPath of nodes.keys()) {
    adjacency.set(docPath, []);
    incomingCount.set(docPath, 0);
  }

  // Navigation edges
  for (const doc of corpus) {
    const nav = doc.doc.navigation;
    if (nav === undefined) continue;

    const sourceDir = path.dirname(doc.path);

    for (const key of Object.keys(nav)) {
      const resolved = resolveNavKey(key, sourceDir, skillPathLookup);

      // Navigation keys often point to .md files, but corpus nodes are .json files.
      // Check both the resolved path and its .json equivalent.
      let target: string | undefined;
      if (resolved !== undefined) {
        if (nodes.has(resolved)) {
          target = resolved;
        } else if (resolved.endsWith('.md')) {
          const jsonEquiv = resolved.slice(0, -3) + '.json';
          if (nodes.has(jsonEquiv)) {
            target = jsonEquiv;
          }
        }
      }
      if (target !== undefined) {
        const edge: GraphEdge = {
          from: doc.path,
          to: target,
          type: 'navigation',
          resolved: true,
        };
        edges.push(edge);

        const adj = adjacency.get(doc.path);
        if (adj !== undefined) {
          adj.push(target);
        }
        const count = incomingCount.get(target);
        if (count !== undefined) {
          incomingCount.set(target, count + 1);
        }
      } else {
        const edge: GraphEdge = {
          from: doc.path,
          to: resolved ?? key,
          type: 'navigation',
          resolved: false,
        };
        edges.push(edge);
      }
    }
  }

  // Parent edges: child and gotcha docs have a `parent` field
  for (const doc of corpus) {
    const { $schema } = doc.doc;
    if ($schema !== 'gobbi-docs/child' && $schema !== 'gobbi-docs/gotcha') continue;
    const parentField = doc.doc.parent;

    const resolved = resolveParent(parentField, skillPathLookup);
    const isResolved = resolved !== undefined && nodes.has(resolved);

    const edge: GraphEdge = {
      from: doc.path,
      to: isResolved ? resolved : parentField,
      type: 'parent',
      resolved: isResolved,
    };
    edges.push(edge);

    if (isResolved) {
      const adj = adjacency.get(doc.path);
      if (adj !== undefined) {
        adj.push(resolved);
      }
      const count = incomingCount.get(resolved);
      if (count !== undefined) {
        incomingCount.set(resolved, count + 1);
      }
    }
  }

  // Compute orphans: nodes with no incoming edges, excluding entry point files
  const orphans: string[] = [];
  for (const [docPath, count] of incomingCount) {
    if (count === 0) {
      const filename = path.basename(docPath);
      if (!ENTRY_POINT_NAMES.has(filename)) {
        orphans.push(docPath);
      }
    }
  }

  return { nodes, edges, adjacency, orphans };
}
