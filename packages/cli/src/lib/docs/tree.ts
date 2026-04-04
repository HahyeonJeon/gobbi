/**
 * Navigation hierarchy tree builder for gobbi-docs.
 *
 * Builds a tree structure from the document graph's navigation edges,
 * identifies root nodes (no incoming navigation/parent edges), and provides
 * text formatting with tree connectors.
 */

import path from 'node:path';
import type { DocGraph } from './graph.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface TreeNode {
  name: string;        // filename without extension
  type: string;        // DocType
  path: string;        // relative path
  children: TreeNode[];
}

export interface TreeResult {
  roots: TreeNode[];     // legitimate top-level entry points
  orphans: TreeNode[];   // nodes with no incoming edges that are not entry points
  flatCount: number;     // total nodes
}

// ---------------------------------------------------------------------------
// Tree builder
// ---------------------------------------------------------------------------

/**
 * Build a tree from the document graph.
 *
 * Finds root nodes — those with no incoming navigation or parent edges —
 * and recursively constructs a tree from outgoing navigation edges.
 * Uses a visited set to handle cycles safely.
 */
export function buildTree(graph: DocGraph, scanDir: string): TreeResult {
  const absScanDir = path.resolve(scanDir);

  // Compute incoming edges per node (navigation edges only go from parent to child;
  // parent-type edges go from child to parent, so both contribute incoming edges)
  const hasIncoming = new Set<string>();
  for (const edge of graph.edges) {
    if (!edge.resolved) continue;
    hasIncoming.add(edge.to);
  }

  // Build a map of outgoing navigation targets per node
  const navChildren = new Map<string, string[]>();
  for (const edge of graph.edges) {
    if (edge.type !== 'navigation' || !edge.resolved) continue;
    const existing = navChildren.get(edge.from);
    if (existing !== undefined) {
      existing.push(edge.to);
    } else {
      navChildren.set(edge.from, [edge.to]);
    }
  }

  // Separate legitimate roots from orphans using the graph's orphan list
  const orphanSet = new Set(graph.orphans);
  const rootPaths: string[] = [];
  const orphanPaths: string[] = [];
  for (const nodePath of graph.nodes.keys()) {
    if (!hasIncoming.has(nodePath)) {
      if (orphanSet.has(nodePath)) {
        orphanPaths.push(nodePath);
      } else {
        rootPaths.push(nodePath);
      }
    }
  }
  rootPaths.sort();
  orphanPaths.sort();

  // Recursive builder with cycle protection
  let flatCount = 0;
  const visited = new Set<string>();

  function buildNode(nodePath: string): TreeNode | undefined {
    if (visited.has(nodePath)) return undefined;
    visited.add(nodePath);
    flatCount++;

    const doc = graph.nodes.get(nodePath);
    const docType = doc !== undefined ? doc.type : 'unknown';

    const children: TreeNode[] = [];
    const childPaths = navChildren.get(nodePath);
    if (childPaths !== undefined) {
      for (const childPath of childPaths) {
        const childNode = buildNode(childPath);
        if (childNode !== undefined) {
          children.push(childNode);
        }
      }
    }

    return {
      name: path.basename(nodePath, path.extname(nodePath)),
      type: docType,
      path: path.relative(absScanDir, nodePath),
      children,
    };
  }

  const roots: TreeNode[] = [];
  for (const rootPath of rootPaths) {
    const node = buildNode(rootPath);
    if (node !== undefined) {
      roots.push(node);
    }
  }

  const orphanNodes: TreeNode[] = [];
  for (const orphanPath of orphanPaths) {
    const node = buildNode(orphanPath);
    if (node !== undefined) {
      orphanNodes.push(node);
    }
  }

  return { roots, orphans: orphanNodes, flatCount };
}

// ---------------------------------------------------------------------------
// Text formatter
// ---------------------------------------------------------------------------

/**
 * Format tree nodes as indented text with tree connectors.
 *
 * Uses `├──` and `└──` connectors like the `tree` command.
 * Each line shows `name (type)`.
 */
export function formatTreeText(roots: TreeNode[], indent?: string): string {
  const lines: string[] = [];
  const prefix = indent ?? '';

  function formatNode(node: TreeNode, linePrefix: string, isLast: boolean): void {
    const connector = isLast ? '└── ' : '├── ';
    lines.push(`${linePrefix}${connector}${node.name} (${node.type})`);

    const childPrefix = linePrefix + (isLast ? '    ' : '│   ');
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child !== undefined) {
        formatNode(child, childPrefix, i === node.children.length - 1);
      }
    }
  }

  for (let i = 0; i < roots.length; i++) {
    const root = roots[i];
    if (root !== undefined) {
      formatNode(root, prefix, i === roots.length - 1);
    }
  }

  return lines.join('\n');
}
