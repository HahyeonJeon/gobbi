/**
 * Schema-aware content search across gobbi-docs JSON templates.
 *
 * Walks the typed content tree of every scanned document, matching a regex
 * pattern against text fields, principles, table cells, list items, and
 * gotcha entry bodies. Supports doc-type and block-type filtering.
 */

import path from 'node:path';
import { scanCorpus, type ScannedDoc } from './scanner.js';
import type {
  ContentBlock,
  Section,
  GotchaEntry,
} from './types.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface SearchMatch {
  path: string;        // relative to scan directory
  docType: string;     // DocType
  section: string;     // section heading or entry title
  blockType: string;   // ContentBlock type or 'title'/'opening'/'frontmatter'
  blockIndex: number;  // index within section, -1 for non-block matches
  match: string;       // matched text snippet (truncated to ~100 chars)
}

export interface SearchResult {
  matches: SearchMatch[];
  scannedCount: number;
  error?: string | undefined;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MAX_SNIPPET = 100;

/** Truncate a string to roughly MAX_SNIPPET characters, adding ellipsis. */
function truncate(text: string): string {
  if (text.length <= MAX_SNIPPET) return text;
  return text.slice(0, MAX_SNIPPET) + '...';
}

/**
 * Build a case-insensitive regex from a user-supplied pattern string.
 * Returns the compiled RegExp, or an Error if the pattern is invalid.
 */
function toRegex(pattern: string): RegExp | Error {
  try {
    return new RegExp(pattern, 'i');
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
}

/** Test whether a blockType string passes the block filter. */
function blockFilterMatch(blockType: string, filter: string | undefined): boolean {
  if (filter === undefined) return true;
  return blockType === filter;
}

// ---------------------------------------------------------------------------
// Block text extraction + matching
// ---------------------------------------------------------------------------

/**
 * Collect search matches from a single content block.
 * Recurses into subsections.
 */
function searchBlock(
  block: ContentBlock,
  blockIndex: number,
  sectionLabel: string,
  regex: RegExp,
  blockFilter: string | undefined,
  base: Omit<SearchMatch, 'section' | 'blockType' | 'blockIndex' | 'match'>,
): SearchMatch[] {
  const matches: SearchMatch[] = [];

  if (!blockFilterMatch(block.type, blockFilter)) {
    // subsection still needs recursive check even if filter doesn't match the container
    if (block.type === 'subsection') {
      for (let i = 0; i < block.content.length; i++) {
        const child = block.content[i];
        if (child === undefined) continue;
        matches.push(
          ...searchBlock(child, i, block.heading, regex, blockFilter, base),
        );
      }
    }
    return matches;
  }

  const push = (text: string): void => {
    if (regex.test(text)) {
      matches.push({
        ...base,
        section: sectionLabel,
        blockType: block.type,
        blockIndex,
        match: truncate(text),
      });
    }
  };

  switch (block.type) {
    case 'text':
      push(block.value);
      break;
    case 'principle':
      push(block.statement);
      if (block.body !== undefined) {
        push(block.body);
      }
      break;
    case 'table':
      push(block.headers.join(' '));
      for (const row of block.rows) {
        push(row.join(' '));
      }
      break;
    case 'constraint-list':
    case 'list':
      for (const item of block.items) {
        push(item);
      }
      break;
    case 'subsection':
      for (let i = 0; i < block.content.length; i++) {
        const child = block.content[i];
        if (child === undefined) continue;
        matches.push(
          ...searchBlock(child, i, block.heading, regex, blockFilter, base),
        );
      }
      break;
  }

  return matches;
}

/**
 * Search a single section (heading + content blocks).
 */
function searchSection(
  section: Section,
  regex: RegExp,
  blockFilter: string | undefined,
  base: Omit<SearchMatch, 'section' | 'blockType' | 'blockIndex' | 'match'>,
): SearchMatch[] {
  const matches: SearchMatch[] = [];
  const sectionLabel = section.heading ?? '(headingless)';

  // Match against heading itself
  if (section.heading !== null && blockFilterMatch('title', blockFilter) && regex.test(section.heading)) {
    matches.push({
      ...base,
      section: sectionLabel,
      blockType: 'title',
      blockIndex: -1,
      match: truncate(section.heading),
    });
  }

  // Walk content blocks
  for (let i = 0; i < section.content.length; i++) {
    const block = section.content[i];
    if (block === undefined) continue;
    matches.push(
      ...searchBlock(block, i, sectionLabel, regex, blockFilter, base),
    );
  }

  return matches;
}

/**
 * Search a gotcha entry's title and body fields.
 */
function searchGotchaEntry(
  entry: GotchaEntry,
  regex: RegExp,
  blockFilter: string | undefined,
  base: Omit<SearchMatch, 'section' | 'blockType' | 'blockIndex' | 'match'>,
): SearchMatch[] {
  const matches: SearchMatch[] = [];

  // Title
  if (blockFilterMatch('title', blockFilter) && regex.test(entry.title)) {
    matches.push({
      ...base,
      section: entry.title,
      blockType: 'title',
      blockIndex: -1,
      match: truncate(entry.title),
    });
  }

  // Body fields — treat as text-like content
  if (blockFilterMatch('text', blockFilter)) {
    const bodyFields: readonly string[] = [
      entry.body.priority,
      entry.body['what-happened'],
      entry.body['user-feedback'],
      entry.body['correct-approach'],
    ];
    for (const field of bodyFields) {
      if (regex.test(field)) {
        matches.push({
          ...base,
          section: entry.title,
          blockType: 'text',
          blockIndex: -1,
          match: truncate(field),
        });
      }
    }
  }

  return matches;
}

// ---------------------------------------------------------------------------
// Main search function
// ---------------------------------------------------------------------------

/**
 * Search all gobbi-docs JSON templates in a directory for content matching
 * a regex pattern.
 *
 * @param directory   Root directory to scan
 * @param pattern     Regex pattern string (case-insensitive)
 * @param typeFilter  Optional DocType to restrict to (e.g., 'skill', 'gotcha')
 * @param blockFilter Optional block type to restrict to (e.g., 'text', 'principle', 'frontmatter')
 */
export async function searchDocs(
  directory: string,
  pattern: string,
  typeFilter?: string,
  blockFilter?: string,
): Promise<SearchResult> {
  const result = await scanCorpus(directory);
  const regexOrError = toRegex(pattern);
  if (regexOrError instanceof Error) {
    return { matches: [], scannedCount: 0, error: `Invalid regex pattern: ${regexOrError.message}` };
  }
  const regex = regexOrError;
  const matches: SearchMatch[] = [];
  const absDir = path.resolve(directory);

  let docs: ScannedDoc[] = result.docs;
  if (typeFilter !== undefined) {
    docs = docs.filter((d) => d.type === typeFilter);
  }

  for (const scanned of docs) {
    const relPath = path.relative(absDir, scanned.path);
    const base = { path: relPath, docType: scanned.type };
    const doc = scanned.doc;

    // Check title
    if (blockFilterMatch('title', blockFilter) && regex.test(doc.title)) {
      matches.push({
        ...base,
        section: '(document)',
        blockType: 'title',
        blockIndex: -1,
        match: truncate(doc.title),
      });
    }

    // Check opening
    if (doc.opening !== undefined && blockFilterMatch('opening', blockFilter) && regex.test(doc.opening)) {
      matches.push({
        ...base,
        section: '(document)',
        blockType: 'opening',
        blockIndex: -1,
        match: truncate(doc.opening),
      });
    }

    // Check frontmatter (skill, agent, rule docs)
    if (blockFilterMatch('frontmatter', blockFilter) && 'frontmatter' in doc) {
      const fm = doc.frontmatter as Record<string, unknown>;
      for (const val of Object.values(fm)) {
        if (typeof val === 'string' && regex.test(val)) {
          matches.push({
            ...base,
            section: '(document)',
            blockType: 'frontmatter',
            blockIndex: -1,
            match: truncate(val),
          });
        }
      }
    }

    // Gotcha entries
    if (doc.$schema === 'gobbi-docs/gotcha') {
      for (const entry of doc.entries) {
        matches.push(
          ...searchGotchaEntry(entry, regex, blockFilter, base),
        );
      }
    } else {
      // Regular sections
      const sections = 'sections' in doc ? doc.sections : undefined;
      if (sections !== undefined) {
        for (const section of sections) {
          matches.push(
            ...searchSection(section, regex, blockFilter, base),
          );
        }
      }
    }
  }

  return { matches, scannedCount: docs.length };
}
