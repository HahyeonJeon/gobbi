/**
 * Remediation library for gobbi doctor --plan / --fix.
 *
 * Computes available remediations from health/audit findings and applies
 * auto-fixable ones. Pure computation in `computeRemediations`, side-effects
 * isolated to `applyRemediation` and `applyRemediations`. No console output.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Finding } from './health.js';
import type { GobbiDoc } from './types.js';
import { renderDoc } from './renderer.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type RemediationAction = 'json2md' | 'add-nav-entry' | 'rename-frontmatter' | 'review';

export interface Remediation {
  action: RemediationAction;
  finding: Finding;
  description: string;
  targetPath: string;
}

export interface RemediationResult {
  remediation: Remediation;
  success: boolean;
  error?: string | undefined;
}

export interface RemediationPlan {
  auto: Remediation[];
  suggested: Remediation[];
  skipped: Finding[];
}

// ---------------------------------------------------------------------------
// Context extraction helpers
// ---------------------------------------------------------------------------

/**
 * Safely extract a context value from a finding, returning undefined when the
 * key is absent or the context object itself is undefined.
 */
function ctx(finding: Finding, key: string): string | undefined {
  if (finding.context === undefined) return undefined;
  return finding.context[key];
}

// ---------------------------------------------------------------------------
// computeRemediations — pure function
// ---------------------------------------------------------------------------

/**
 * Route findings into auto-fixable, suggested, or skipped buckets.
 *
 * Auto-fixable findings must have all required context fields present;
 * those missing context are demoted to skipped.
 */
export function computeRemediations(findings: Finding[]): RemediationPlan {
  const auto: Remediation[] = [];
  const suggested: Remediation[] = [];
  const skipped: Finding[] = [];

  for (const finding of findings) {
    if (finding.fixable === 'auto') {
      const remediation = buildAutoRemediation(finding);
      if (remediation !== undefined) {
        auto.push(remediation);
      } else {
        // Auto finding but missing required context — demote to skipped
        skipped.push(finding);
      }
    } else if (finding.fixable === 'suggested') {
      suggested.push({
        action: 'review',
        finding,
        description: finding.suggestion,
        targetPath: finding.path,
      });
    } else {
      skipped.push(finding);
    }
  }

  return { auto, suggested, skipped };
}

/**
 * Build an auto remediation from a finding, or return undefined if the
 * required context fields are missing.
 */
function buildAutoRemediation(finding: Finding): Remediation | undefined {
  if (finding.category === 'sync-out-of-date') {
    const jsonPath = ctx(finding, 'jsonPath');
    if (jsonPath === undefined) return undefined;

    const jsonBasename = path.basename(jsonPath);
    const mdBasename = path.basename(jsonPath, '.json') + '.md';
    return {
      action: 'json2md',
      finding,
      description: `Regenerate ${mdBasename} from ${jsonBasename}`,
      targetPath: jsonPath.replace(/\.json$/, '.md'),
    };
  }

  if (finding.category === 'bidirectional-consistency') {
    const parentJsonPath = ctx(finding, 'parentJsonPath');
    const childTitle = ctx(finding, 'childTitle');
    const childNavKey = ctx(finding, 'childNavKey');
    if (parentJsonPath === undefined || childTitle === undefined || childNavKey === undefined) {
      return undefined;
    }

    const parentBasename = path.basename(parentJsonPath);
    return {
      action: 'add-nav-entry',
      finding,
      description: `Add navigation entry for ${childNavKey} to ${parentBasename}`,
      targetPath: parentJsonPath,
    };
  }

  if (finding.category === 'naming-mismatch') {
    const jsonPath = ctx(finding, 'jsonPath');
    const dirName = ctx(finding, 'dirName');
    if (jsonPath === undefined || dirName === undefined) return undefined;

    const jsonBasename = path.basename(jsonPath);
    return {
      action: 'rename-frontmatter',
      finding,
      description: `Update frontmatter name to '${dirName}' in ${jsonBasename}`,
      targetPath: jsonPath,
    };
  }

  // Auto finding with unrecognized category — cannot build remediation
  return undefined;
}

// ---------------------------------------------------------------------------
// applyRemediation — single fix
// ---------------------------------------------------------------------------

/**
 * Apply a single auto-fix remediation. Returns success/failure with error
 * detail on failure.
 */
export async function applyRemediation(remediation: Remediation): Promise<RemediationResult> {
  try {
    switch (remediation.action) {
      case 'json2md':
        return await applyJson2Md(remediation);
      case 'add-nav-entry':
        return await applyAddNavEntry(remediation);
      case 'rename-frontmatter':
        return await applyRenameFrontmatter(remediation);
      case 'review':
        return { remediation, success: false, error: 'Review actions cannot be applied automatically' };
    }
  } catch (err) {
    return { remediation, success: false, error: String(err) };
  }
}

async function applyJson2Md(remediation: Remediation): Promise<RemediationResult> {
  const jsonPath = ctx(remediation.finding, 'jsonPath');
  if (jsonPath === undefined) {
    return { remediation, success: false, error: 'Missing context.jsonPath' };
  }

  const content = await readFile(jsonPath, 'utf8');
  const doc = JSON.parse(content) as GobbiDoc;
  const markdown = renderDoc(doc, jsonPath);
  const mdPath = jsonPath.replace(/\.json$/, '.md');
  await writeFile(mdPath, markdown, 'utf8');

  return { remediation, success: true };
}

async function applyAddNavEntry(remediation: Remediation): Promise<RemediationResult> {
  const parentJsonPath = ctx(remediation.finding, 'parentJsonPath');
  const childNavKey = ctx(remediation.finding, 'childNavKey');
  const childTitle = ctx(remediation.finding, 'childTitle');
  if (parentJsonPath === undefined || childNavKey === undefined || childTitle === undefined) {
    return { remediation, success: false, error: 'Missing required context fields' };
  }

  const content = await readFile(parentJsonPath, 'utf8');
  const doc = JSON.parse(content) as GobbiDoc;

  // Add navigation entry (skip if already present for idempotency)
  if (!Object.hasOwn(doc.navigation, childNavKey)) {
    doc.navigation[childNavKey] = childTitle;
  }

  // Write updated JSON
  await writeFile(parentJsonPath, JSON.stringify(doc, null, 2) + '\n', 'utf8');

  // Regenerate .md
  const markdown = renderDoc(doc, parentJsonPath);
  const mdPath = parentJsonPath.replace(/\.json$/, '.md');
  await writeFile(mdPath, markdown, 'utf8');

  return { remediation, success: true };
}

async function applyRenameFrontmatter(remediation: Remediation): Promise<RemediationResult> {
  const jsonPath = ctx(remediation.finding, 'jsonPath');
  const dirName = ctx(remediation.finding, 'dirName');
  if (jsonPath === undefined || dirName === undefined) {
    return { remediation, success: false, error: 'Missing required context fields' };
  }

  const content = await readFile(jsonPath, 'utf8');
  const doc = JSON.parse(content) as GobbiDoc;

  // Update frontmatter name — naming-mismatch findings target skill docs
  if (doc.$schema === 'gobbi-docs/skill' || doc.$schema === 'gobbi-docs/agent') {
    doc.frontmatter.name = dirName;
  }

  // Write updated JSON
  await writeFile(jsonPath, JSON.stringify(doc, null, 2) + '\n', 'utf8');

  // Regenerate .md
  const markdown = renderDoc(doc, jsonPath);
  const mdPath = jsonPath.replace(/\.json$/, '.md');
  await writeFile(mdPath, markdown, 'utf8');

  return { remediation, success: true };
}

// ---------------------------------------------------------------------------
// applyRemediations — batch with write coalescing
// ---------------------------------------------------------------------------

/**
 * Apply all auto remediations from a plan. Coalesces multiple `add-nav-entry`
 * actions targeting the same parent JSON file into a single read/write cycle.
 * Deduplicates `json2md` fixes for files that already get structural fixes
 * (add-nav-entry and rename-frontmatter both regenerate the .md).
 */
export async function applyRemediations(plan: RemediationPlan): Promise<RemediationResult[]> {
  const results: RemediationResult[] = [];

  // Group add-nav-entry by targetPath for coalescing
  const navGroups = new Map<string, Remediation[]>();
  const otherRemediations: Remediation[] = [];

  // Collect all JSON paths that get structural fixes (they regenerate .md already)
  const structuralFixJsonPaths = new Set<string>();
  for (const rem of plan.auto) {
    if (rem.action === 'add-nav-entry' || rem.action === 'rename-frontmatter') {
      structuralFixJsonPaths.add(rem.targetPath);
    }
  }

  for (const rem of plan.auto) {
    if (rem.action === 'add-nav-entry') {
      const group = navGroups.get(rem.targetPath) ?? [];
      group.push(rem);
      navGroups.set(rem.targetPath, group);
    } else if (rem.action === 'json2md') {
      // Skip json2md if a structural fix already covers this file's .md regeneration
      const jsonPath = ctx(rem.finding, 'jsonPath');
      if (jsonPath !== undefined && structuralFixJsonPaths.has(jsonPath)) {
        results.push({ remediation: rem, success: true });
        continue;
      }
      otherRemediations.push(rem);
    } else {
      otherRemediations.push(rem);
    }
  }

  // Apply coalesced nav entries — one read/write per parent
  for (const [parentJsonPath, group] of navGroups) {
    try {
      const content = await readFile(parentJsonPath, 'utf8');
      const doc = JSON.parse(content) as GobbiDoc;

      for (const rem of group) {
        const childNavKey = ctx(rem.finding, 'childNavKey');
        const childTitle = ctx(rem.finding, 'childTitle');
        if (childNavKey === undefined || childTitle === undefined) {
          results.push({ remediation: rem, success: false, error: 'Missing required context fields' });
          continue;
        }
        if (!Object.hasOwn(doc.navigation, childNavKey)) {
          doc.navigation[childNavKey] = childTitle;
        }
      }

      await writeFile(parentJsonPath, JSON.stringify(doc, null, 2) + '\n', 'utf8');
      const markdown = renderDoc(doc, parentJsonPath);
      const mdPath = parentJsonPath.replace(/\.json$/, '.md');
      await writeFile(mdPath, markdown, 'utf8');

      for (const rem of group) {
        // Only mark as success if not already recorded as failure above
        if (!results.some((r) => r.remediation === rem)) {
          results.push({ remediation: rem, success: true });
        }
      }
    } catch (err) {
      for (const rem of group) {
        if (!results.some((r) => r.remediation === rem)) {
          results.push({ remediation: rem, success: false, error: String(err) });
        }
      }
    }
  }

  // Apply other remediations sequentially
  for (const rem of otherRemediations) {
    const result = await applyRemediation(rem);
    results.push(result);
  }

  return results;
}
