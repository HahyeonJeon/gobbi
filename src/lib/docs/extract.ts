/**
 * Structural content extraction from a single gobbi-docs JSON template.
 *
 * Resolves dot-path queries like `sections.Setup`, `frontmatter.name`, or
 * `entries.Never use any` against the typed document structure.
 */

import { readFile } from 'node:fs/promises';
import {
  isDocSchema,
  isGotchaDoc,
  hasSections,
  hasFrontmatter,
  type GobbiDoc,
  type Section,
  type GotchaEntry,
} from './types.js';
import { renderSection, renderBlock } from './renderer.js';
import type { ContentBlock } from './types.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface ExtractResult {
  value: unknown;            // the extracted JSON value
  found: boolean;
  availablePaths?: string[]; // shown on error
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Split a query on the first `.` to separate root from subpath.
 * Returns [root, subpath | undefined].
 */
function splitQuery(query: string): [string, string | undefined] {
  const dotIndex = query.indexOf('.');
  if (dotIndex === -1) return [query, undefined];
  return [query.slice(0, dotIndex), query.slice(dotIndex + 1)];
}

/** Check if a string is a non-negative integer. */
function isNumericIndex(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Build the list of valid top-level paths for a given document,
 * used in error responses.
 */
function availablePathsFor(doc: GobbiDoc): string[] {
  const paths: string[] = ['$schema', 'title'];

  if (doc.opening !== undefined) paths.push('opening');
  if (doc.navigation !== undefined) paths.push('navigation');
  if (hasFrontmatter(doc)) paths.push('frontmatter');

  if (doc.$schema === 'gobbi-docs/child' || doc.$schema === 'gobbi-docs/gotcha') {
    paths.push('parent');
  }

  if (isGotchaDoc(doc)) {
    paths.push('entries');
  } else if (hasSections(doc) && doc.sections !== undefined) {
    paths.push('sections');
  }

  return paths;
}

/**
 * Resolve a sections query with an optional subpath.
 * Subpath can be a numeric index or a case-insensitive heading match.
 */
function resolveSections(
  sections: Section[],
  subpath: string | undefined,
): ExtractResult {
  if (subpath === undefined) {
    return { value: sections, found: true };
  }

  if (isNumericIndex(subpath)) {
    const index = Number(subpath);
    const section = sections[index];
    if (section === undefined) {
      return {
        value: undefined,
        found: false,
        availablePaths: sections.map((_s, i) => `sections.${i}`),
      };
    }
    return { value: section, found: true };
  }

  // Case-insensitive heading match
  const lowerSub = subpath.toLowerCase();
  const section = sections.find(
    (s) => s.heading !== null && s.heading.toLowerCase() === lowerSub,
  );

  if (section === undefined) {
    return {
      value: undefined,
      found: false,
      availablePaths: sections.map((s, i) =>
        s.heading !== null ? `sections.${s.heading}` : `sections.${i}`,
      ),
    };
  }

  return { value: section, found: true };
}

/**
 * Resolve an entries query with an optional subpath.
 * Subpath is a case-insensitive title match.
 */
function resolveEntries(
  entries: GotchaEntry[],
  subpath: string | undefined,
): ExtractResult {
  if (subpath === undefined) {
    return { value: entries, found: true };
  }

  const lowerSub = subpath.toLowerCase();
  const entry = entries.find(
    (e) => e.title.toLowerCase() === lowerSub,
  );

  if (entry === undefined) {
    return {
      value: undefined,
      found: false,
      availablePaths: entries.map((e) => `entries.${e.title}`),
    };
  }

  return { value: entry, found: true };
}

// ---------------------------------------------------------------------------
// Main extract function
// ---------------------------------------------------------------------------

/**
 * Extract content from a single gobbi-docs JSON template by dot-path query.
 *
 * @param filePath  Absolute path to the JSON template file
 * @param query     Dot-path query (e.g., `title`, `sections.Setup`, `frontmatter.name`)
 */
export async function extractFromDoc(
  filePath: string,
  query: string,
): Promise<ExtractResult> {
  let raw: string;
  try {
    raw = await readFile(filePath, 'utf8');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Cannot read file: ${message}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Invalid JSON: ${message}`);
  }

  // Validate schema
  if (typeof parsed !== 'object' || parsed === null) {
    return { value: undefined, found: false, availablePaths: [] };
  }
  const record = parsed as Record<string, unknown>;
  const schema = record['$schema'];
  if (typeof schema !== 'string' || !isDocSchema(schema)) {
    return { value: undefined, found: false, availablePaths: [] };
  }

  const doc = parsed as GobbiDoc;
  const [root, subpath] = splitQuery(query);

  switch (root) {
    case '$schema':
      return { value: doc.$schema, found: true };

    case 'title':
      return { value: doc.title, found: true };

    case 'opening':
      if (doc.opening !== undefined) {
        return { value: doc.opening, found: true };
      }
      return { value: undefined, found: false, availablePaths: availablePathsFor(doc) };

    case 'navigation':
      if (doc.navigation !== undefined) {
        return { value: doc.navigation, found: true };
      }
      return { value: undefined, found: false, availablePaths: availablePathsFor(doc) };

    case 'parent':
      if (doc.$schema === 'gobbi-docs/child' || doc.$schema === 'gobbi-docs/gotcha') {
        return { value: doc.parent, found: true };
      }
      return { value: undefined, found: false, availablePaths: availablePathsFor(doc) };

    case 'frontmatter':
      if (hasFrontmatter(doc)) {
        if (subpath !== undefined) {
          const fm = doc.frontmatter as Record<string, unknown>;
          const fieldVal = fm[subpath];
          if (fieldVal !== undefined) {
            return { value: fieldVal, found: true };
          }
          return {
            value: undefined,
            found: false,
            availablePaths: Object.keys(fm).map((k) => `frontmatter.${k}`),
          };
        }
        return { value: doc.frontmatter, found: true };
      }
      return { value: undefined, found: false, availablePaths: availablePathsFor(doc) };

    case 'sections':
      if (isGotchaDoc(doc)) {
        return { value: undefined, found: false, availablePaths: availablePathsFor(doc) };
      }
      if (hasSections(doc) && doc.sections !== undefined) {
        return resolveSections(doc.sections, subpath);
      }
      return { value: undefined, found: false, availablePaths: availablePathsFor(doc) };

    case 'entries':
      if (isGotchaDoc(doc)) {
        return resolveEntries(doc.entries, subpath);
      }
      return { value: undefined, found: false, availablePaths: availablePathsFor(doc) };

    default:
      return { value: undefined, found: false, availablePaths: availablePathsFor(doc) };
  }
}

// ---------------------------------------------------------------------------
// Markdown formatter for extracted values
// ---------------------------------------------------------------------------

/**
 * Format an extracted value as Markdown.
 *
 * Uses the renderer's `renderSection()` and `renderBlock()` for typed
 * structures; falls back to `JSON.stringify` for scalar/unknown values.
 */
export function formatExtractMd(value: unknown): string {
  if (value === undefined || value === null) return '';

  // String scalar
  if (typeof value === 'string') return value;

  // Number/boolean scalar
  if (typeof value !== 'object') return String(value);

  // Array — could be sections, entries, or content blocks
  if (Array.isArray(value)) {
    const parts: string[] = [];
    for (const item of value) {
      parts.push(formatExtractMd(item));
    }
    return parts.join('\n\n---\n\n');
  }

  // Object — try to detect typed structures
  const record = value as Record<string, unknown>;

  // Section: has `heading` (string | null) and `content` (array)
  if ('heading' in record && 'content' in record && Array.isArray(record['content'])) {
    return renderSection(value as Section);
  }

  // ContentBlock: has `type` field
  if ('type' in record && typeof record['type'] === 'string') {
    return renderBlock(value as ContentBlock);
  }

  // Fallback: JSON
  return JSON.stringify(value, null, 2);
}
