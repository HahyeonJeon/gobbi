/**
 * Cross-document health checker for gobbi-docs corpus.
 *
 * Runs structural and referential integrity checks across all documents
 * in a scanned corpus, producing a categorized findings report.
 */

import path from 'node:path';
import { scanCorpus, type ScannedDoc } from './scanner.js';
import { buildGraph, type DocGraph, type GraphEdge } from './graph.js';
import { isGotchaDoc, hasSections } from './types.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type FindingSeverity = 'error' | 'warning' | 'info';

export interface Finding {
  path: string;
  severity: FindingSeverity;
  category: string;
  message: string;
  suggestion: string;
}

export interface HealthReport {
  summary: {
    total: number;
    errors: number;
    warnings: number;
    info: number;
  };
  findings: Finding[];
}

// ---------------------------------------------------------------------------
// Severity sort order
// ---------------------------------------------------------------------------

const SEVERITY_ORDER: Readonly<Record<FindingSeverity, number>> = {
  error: 0,
  warning: 1,
  info: 2,
};

// ---------------------------------------------------------------------------
// Individual checks
// ---------------------------------------------------------------------------

/**
 * Check 1: Orphaned documents — docs with no incoming edges.
 * Uses the graph's pre-computed orphan list.
 */
function checkOrphans(graph: DocGraph, scanDir: string): Finding[] {
  const findings: Finding[] = [];
  for (const absPath of graph.orphans) {
    findings.push({
      path: path.relative(scanDir, absPath),
      severity: 'warning',
      category: 'orphaned-document',
      message: `No other document references ${path.relative(scanDir, absPath)}`,
      suggestion: 'Add a navigation link to this document from its parent, or check if it should have a parent field',
    });
  }
  return findings;
}

/**
 * Check 2: Broken navigation links — navigation edges that failed to resolve.
 */
function checkBrokenNavLinks(graph: DocGraph, scanDir: string): Finding[] {
  const findings: Finding[] = [];
  for (const edge of graph.edges) {
    if (edge.type === 'navigation' && !edge.resolved) {
      // Only report as error if it looks like a file path (markdown link format)
      // Descriptive text keys are handled by Check 7
      if (isFilePath(edge.to)) {
        findings.push({
          path: path.relative(scanDir, edge.from),
          severity: 'error',
          category: 'broken-navigation',
          message: `${path.relative(scanDir, edge.from)} has navigation link to '${edge.to}' which does not resolve`,
          suggestion: 'Check the navigation key format — ensure it points to an existing .json or .md file',
        });
      }
    }
  }
  return findings;
}

/**
 * Check 3: Empty sections — sections with zero content blocks.
 */
function checkEmptySections(docs: ScannedDoc[], scanDir: string): Finding[] {
  const findings: Finding[] = [];
  for (const scanned of docs) {
    if (!hasSections(scanned.doc)) continue;
    const sections = scanned.doc.sections;
    if (sections === undefined) continue;

    for (const section of sections) {
      if (section.content.length === 0) {
        const heading = section.heading ?? '(unnamed)';
        findings.push({
          path: path.relative(scanDir, scanned.path),
          severity: 'warning',
          category: 'empty-section',
          message: `${path.relative(scanDir, scanned.path)} section '${heading}' has no content blocks`,
          suggestion: 'Add content blocks to this section or remove the empty section',
        });
      }
    }
  }
  return findings;
}

/**
 * Check 4: Incomplete gotcha entries — entries missing required body fields.
 */
function checkIncompleteGotchas(docs: ScannedDoc[], scanDir: string): Finding[] {
  const REQUIRED_BODY_FIELDS = ['priority', 'what-happened', 'user-feedback', 'correct-approach'] as const;
  const findings: Finding[] = [];

  for (const scanned of docs) {
    if (!isGotchaDoc(scanned.doc)) continue;

    for (let i = 0; i < scanned.doc.entries.length; i++) {
      const entry = scanned.doc.entries[i];
      if (entry === undefined) continue;

      const body = entry.body;
      const missingFields: string[] = [];

      for (const field of REQUIRED_BODY_FIELDS) {
        if (typeof body[field] !== 'string' || body[field].length === 0) {
          missingFields.push(field);
        }
      }

      if (missingFields.length > 0) {
        findings.push({
          path: path.relative(scanDir, scanned.path),
          severity: 'error',
          category: 'incomplete-gotcha',
          message: `entries[${i}] '${entry.title}' is missing required body fields: ${missingFields.join(', ')}`,
          suggestion: 'Add the missing body field(s) to this gotcha entry',
        });
      }
    }
  }
  return findings;
}

/**
 * Check 5: Missing parent references — parent field points to nonexistent skill.
 */
function checkMissingParents(graph: DocGraph, scanDir: string): Finding[] {
  const findings: Finding[] = [];
  for (const edge of graph.edges) {
    if (edge.type === 'parent' && !edge.resolved) {
      findings.push({
        path: path.relative(scanDir, edge.from),
        severity: 'error',
        category: 'missing-parent',
        message: `${path.relative(scanDir, edge.from)} declares parent '${edge.to}' but no matching skill exists`,
        suggestion: 'Update the parent field to reference an existing skill directory name',
      });
    }
  }
  return findings;
}

/**
 * Check 6: Parent-child bidirectional consistency.
 * For each child/gotcha doc with a resolved parent, verifies the parent's
 * navigation includes a reference back to this child.
 */
function checkBidirectionalConsistency(
  graph: DocGraph,
  scanDir: string,
): Finding[] {
  const findings: Finding[] = [];

  // Build set of paths that each parent navigates to (resolved targets)
  const parentNavTargets = new Map<string, Set<string>>();
  for (const edge of graph.edges) {
    if (edge.type === 'navigation' && edge.resolved) {
      let targets = parentNavTargets.get(edge.from);
      if (targets === undefined) {
        targets = new Set<string>();
        parentNavTargets.set(edge.from, targets);
      }
      targets.add(edge.to);
    }
  }

  // Check each parent edge: does the parent's navigation point back to child?
  for (const edge of graph.edges) {
    if (edge.type !== 'parent' || !edge.resolved) continue;

    const childPath = edge.from;
    const parentPath = edge.to;
    const targets = parentNavTargets.get(parentPath);

    if (targets === undefined || !targets.has(childPath)) {
      findings.push({
        path: path.relative(scanDir, childPath),
        severity: 'warning',
        category: 'bidirectional-consistency',
        message: `${path.relative(scanDir, childPath)} claims parent '${path.relative(scanDir, parentPath)}' but parent's navigation does not reference it`,
        suggestion: 'Add a navigation entry in the parent document pointing back to this child',
      });
    }
  }

  return findings;
}

/**
 * Check 7: Unresolvable navigation keys — descriptive text that cannot map
 * to a file. Reported as info since these are often intentional labels.
 */
function checkUnresolvableNavKeys(graph: DocGraph, scanDir: string): Finding[] {
  const findings: Finding[] = [];
  for (const edge of graph.edges) {
    if (edge.type === 'navigation' && !edge.resolved && !isFilePath(edge.to)) {
      findings.push({
        path: path.relative(scanDir, edge.from),
        severity: 'info',
        category: 'unresolvable-nav-key',
        message: `Navigation key '${edge.to}' could not be resolved to any file`,
        suggestion: 'This navigation key uses a descriptive format that cannot be resolved to a file',
      });
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Heuristic: does this string look like a file path rather than descriptive text?
 * File paths contain path separators, file extensions, or start with `.` or `/`.
 */
function isFilePath(value: string): boolean {
  return (
    value.includes('/') ||
    value.includes('\\') ||
    value.includes('.json') ||
    value.includes('.md') ||
    value.startsWith('.')
  );
}

/** Compare findings by severity (errors first, then warnings, then info). */
function compareFindings(a: Finding, b: Finding): number {
  const aOrder = SEVERITY_ORDER[a.severity];
  const bOrder = SEVERITY_ORDER[b.severity];
  if (aOrder !== bOrder) return aOrder - bOrder;
  if (a.path < b.path) return -1;
  if (a.path > b.path) return 1;
  return 0;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Run all health checks on a gobbi-docs corpus.
 *
 * Scans the given directory, builds a navigation graph, and runs structural
 * and referential integrity checks. Returns a report with categorized findings
 * sorted by severity.
 */
export async function checkHealth(directory: string): Promise<HealthReport> {
  const absDir = path.resolve(directory);
  const corpus = await scanCorpus(absDir);
  const graph = buildGraph(corpus.docs);

  // Run all checks
  const findings: Finding[] = [
    ...checkOrphans(graph, absDir),
    ...checkBrokenNavLinks(graph, absDir),
    ...checkEmptySections(corpus.docs, absDir),
    ...checkIncompleteGotchas(corpus.docs, absDir),
    ...checkMissingParents(graph, absDir),
    ...checkBidirectionalConsistency(graph, absDir),
    ...checkUnresolvableNavKeys(graph, absDir),
  ];

  // Sort by severity
  findings.sort(compareFindings);

  // Compute summary
  let errors = 0;
  let warnings = 0;
  let info = 0;
  for (const finding of findings) {
    switch (finding.severity) {
      case 'error':
        errors += 1;
        break;
      case 'warning':
        warnings += 1;
        break;
      case 'info':
        info += 1;
        break;
    }
  }

  return {
    summary: {
      total: findings.length,
      errors,
      warnings,
      info,
    },
    findings,
  };
}
