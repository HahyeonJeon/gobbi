/**
 * Corpus statistics aggregator for gobbi-docs JSON templates.
 *
 * Scans a directory and computes aggregate counts by doc type, block type,
 * navigation presence, gotcha priority distribution, and section size
 * distribution.
 */

import path from 'node:path';
import { scanCorpus } from './scanner.js';
import { isGotchaDoc, hasSections } from './types.js';
import type { ContentBlock, Section } from './types.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface CorpusStats {
  total: number;
  byType: Record<string, number>;
  byBlockType: Record<string, number>;
  totalSections: number;
  totalBlocks: number;
  navigation: { with: number; without: number };
  gotchas: { totalEntries: number; byPriority: Record<string, number> };
  sizeDistribution: {
    minSections: number;
    maxSections: number;
    avgSections: number;
  };
  tokens: {
    total: number;
    byType: Record<string, number>;
  };
}

// ---------------------------------------------------------------------------
// Token estimation
// ---------------------------------------------------------------------------

/** Rough characters-per-token ratio for estimating token counts. */
const CHARS_PER_TOKEN = 4;

/** Estimate token count from a JSON-stringified document's character length. */
function estimateTokens(doc: unknown): number {
  const chars = JSON.stringify(doc).length;
  return Math.ceil(chars / CHARS_PER_TOKEN);
}

// ---------------------------------------------------------------------------
// Block counting helpers
// ---------------------------------------------------------------------------

/** Recursively count content blocks by type, including nested subsection blocks. */
function countBlocks(blocks: ContentBlock[], counts: Record<string, number>): number {
  let total = 0;
  for (const block of blocks) {
    const current = counts[block.type];
    counts[block.type] = current !== undefined ? current + 1 : 1;
    total += 1;

    if (block.type === 'subsection') {
      total += countBlocks(block.content, counts);
    }
  }
  return total;
}

/** Count total blocks in a sections array and accumulate per-type counts. */
function countSectionBlocks(
  sections: Section[],
  blockCounts: Record<string, number>,
): number {
  let total = 0;
  for (const section of sections) {
    total += countBlocks(section.content, blockCounts);
  }
  return total;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Compute aggregate statistics for a gobbi-docs corpus.
 *
 * Scans the given directory for all gobbi-docs JSON templates and returns
 * counts broken down by doc type, content block type, navigation presence,
 * gotcha priorities, and section size distribution.
 */
export async function computeStats(directory: string): Promise<CorpusStats> {
  const absDir = path.resolve(directory);
  const { docs } = await scanCorpus(absDir);

  const byType: Record<string, number> = {};
  const byBlockType: Record<string, number> = {};
  let totalSections = 0;
  let totalBlocks = 0;
  let navWith = 0;
  let navWithout = 0;
  let gotchaTotalEntries = 0;
  const gotchaByPriority: Record<string, number> = {};

  // Per-doc section counts for distribution calculation
  const sectionCounts: number[] = [];

  // Token estimation accumulators
  let totalTokens = 0;
  const tokensByType: Record<string, number> = {};

  for (const scanned of docs) {
    const doc = scanned.doc;

    // --- By doc type ---
    const typeCount = byType[scanned.type];
    byType[scanned.type] = typeCount !== undefined ? typeCount + 1 : 1;

    // --- Token estimation ---
    const docTokens = estimateTokens(doc);
    totalTokens += docTokens;
    const existingTokens = tokensByType[scanned.type];
    tokensByType[scanned.type] = existingTokens !== undefined ? existingTokens + docTokens : docTokens;

    // --- Navigation presence ---
    if (doc.navigation !== undefined) {
      navWith += 1;
    } else {
      navWithout += 1;
    }

    // --- Gotcha entries ---
    if (isGotchaDoc(doc)) {
      gotchaTotalEntries += doc.entries.length;
      for (const entry of doc.entries) {
        const priority = entry.body.priority;
        const priorityCount = gotchaByPriority[priority];
        gotchaByPriority[priority] = priorityCount !== undefined ? priorityCount + 1 : 1;
      }
    }

    // --- Sections and blocks ---
    if (hasSections(doc)) {
      const sections = doc.sections;
      if (sections !== undefined) {
        const sectionCount = sections.length;
        totalSections += sectionCount;
        sectionCounts.push(sectionCount);
        totalBlocks += countSectionBlocks(sections, byBlockType);
      } else {
        sectionCounts.push(0);
      }
    } else if (isGotchaDoc(doc)) {
      // Gotcha docs have no sections — push 0 for distribution
      sectionCounts.push(0);
    }
  }

  // --- Size distribution ---
  let minSections = 0;
  let maxSections = 0;
  let avgSections = 0;

  if (sectionCounts.length > 0) {
    minSections = Math.min(...sectionCounts);
    maxSections = Math.max(...sectionCounts);
    const sum = sectionCounts.reduce((a, b) => a + b, 0);
    avgSections = Math.round((sum / sectionCounts.length) * 100) / 100;
  }

  return {
    total: docs.length,
    byType,
    byBlockType,
    totalSections,
    totalBlocks,
    navigation: { with: navWith, without: navWithout },
    gotchas: { totalEntries: gotchaTotalEntries, byPriority: gotchaByPriority },
    sizeDistribution: { minSections, maxSections, avgSections },
    tokens: { total: totalTokens, byType: tokensByType },
  };
}
