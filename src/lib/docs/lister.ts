/**
 * List all gobbi-docs JSON templates with metadata.
 *
 * Scans a directory for gobbi-docs files and returns a sorted list of
 * entries with type, title, and content counts.
 */

import path from 'node:path';
import { isDocType, type DocType } from './types.js';
import { scanCorpus, type ScanError, type ScannedDoc } from './scanner.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface ListEntry {
  path: string;        // relative to scan directory
  type: string;        // DocType
  title: string;
  count: number;       // sectionCount or entryCount
}

export interface ListResult {
  entries: ListEntry[];
  errors: ScanError[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract the content count from a scanned document. */
function getCount(doc: ScannedDoc): number {
  if (doc.doc.$schema === 'gobbi-docs/gotcha') {
    return doc.doc.entries.length;
  }

  if ('sections' in doc.doc) {
    const sections = doc.doc.sections;
    return sections !== undefined ? sections.length : 0;
  }

  return 0;
}

/** Convert a ScannedDoc to a ListEntry relative to scanDir. */
function toListEntry(doc: ScannedDoc, scanDir: string): ListEntry {
  return {
    path: path.relative(scanDir, doc.path),
    type: doc.type,
    title: doc.doc.title,
    count: getCount(doc),
  };
}

/** Sort comparator: by type ascending, then path ascending. */
function compareEntries(a: ListEntry, b: ListEntry): number {
  if (a.type < b.type) return -1;
  if (a.type > b.type) return 1;
  if (a.path < b.path) return -1;
  if (a.path > b.path) return 1;
  return 0;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * List gobbi-docs templates in a directory.
 *
 * Scans recursively for JSON files with valid gobbi-docs `$schema` fields,
 * optionally filtering by DocType. Results are sorted by type then path.
 */
export async function listDocs(
  directory: string,
  typeFilter?: string,
): Promise<ListResult> {
  const absDir = path.resolve(directory);
  const result = await scanCorpus(absDir);

  // Validate and apply type filter
  const validFilter: DocType | undefined =
    typeFilter !== undefined && isDocType(typeFilter) ? typeFilter : undefined;

  const entries: ListEntry[] = [];
  for (const doc of result.docs) {
    if (validFilter !== undefined && doc.type !== validFilter) continue;
    entries.push(toListEntry(doc, absDir));
  }

  entries.sort(compareEntries);

  return { entries, errors: result.errors };
}
