/**
 * Corpus scanner for gobbi-docs JSON templates.
 *
 * Recursively walks a directory, collects all `.json` files with a valid
 * `$schema` matching `gobbi-docs/*`, and returns parsed documents alongside
 * any parse errors encountered.
 */

import { readdir, stat, readFile } from 'node:fs/promises';
import path from 'node:path';
import { isDocSchema, type DocType, type GobbiDoc, type DocSchema } from './types.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface ScanError {
  path: string;
  error: string;
}

export interface ScannedDoc {
  path: string;       // absolute path to .json file
  doc: GobbiDoc;      // parsed and type-narrowed
  type: DocType;      // extracted from $schema
}

export interface ScanResult {
  docs: ScannedDoc[];
  errors: ScanError[];
}

// ---------------------------------------------------------------------------
// Excluded directory names
// ---------------------------------------------------------------------------

const EXCLUDED_DIRS: ReadonlySet<string> = new Set([
  'node_modules',
  'worktrees',
  'note',
  'project',
]);

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/** Extract `DocType` from a valid `DocSchema` string. */
function extractDocType(schema: DocSchema): DocType {
  return schema.slice('gobbi-docs/'.length) as DocType;
}

/**
 * Check if an unknown parsed JSON value has a string `$schema` property.
 * Returns the schema string if present, undefined otherwise.
 */
function getSchemaString(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const record = value as Record<string, unknown>;
  const schema = record['$schema'];
  if (typeof schema !== 'string') return undefined;
  return schema;
}

/**
 * Recursively walk a directory, collecting `.json` file paths.
 * Skips directories in the EXCLUDED_DIRS set.
 */
async function collectJsonFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  await collectJsonFilesInto(dir, results);
  return results;
}

async function collectJsonFilesInto(dir: string, results: string[]): Promise<void> {
  let entries: string[];
  try {
    entries = await readdir(dir, { encoding: 'utf8' });
  } catch {
    return;
  }

  for (const name of entries) {
    const fullPath = path.join(dir, name);

    let isDir = false;
    let isFile = false;
    try {
      const st = await stat(fullPath);
      isDir = st.isDirectory();
      isFile = st.isFile();
    } catch {
      continue;
    }

    if (isDir) {
      if (!EXCLUDED_DIRS.has(name)) {
        await collectJsonFilesInto(fullPath, results);
      }
    } else if (isFile && name.endsWith('.json')) {
      results.push(fullPath);
    }
  }
}

/**
 * Scan a directory for gobbi-docs JSON templates.
 *
 * Walks the directory recursively, parses each `.json` file, and checks for
 * a valid `$schema` field. Files that fail JSON parsing are reported as errors.
 * Files without a valid gobbi-docs `$schema` are silently skipped.
 */
export async function scanCorpus(directory: string): Promise<ScanResult> {
  const absDir = path.resolve(directory);
  const jsonFiles = await collectJsonFiles(absDir);

  const docs: ScannedDoc[] = [];
  const errors: ScanError[] = [];

  for (const filePath of jsonFiles) {
    let raw: string;
    try {
      raw = await readFile(filePath, 'utf8');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ path: filePath, error: `Failed to read file: ${message}` });
      continue;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ path: filePath, error: `JSON parse error: ${message}` });
      continue;
    }

    const schemaStr = getSchemaString(parsed);
    if (schemaStr === undefined || !isDocSchema(schemaStr)) {
      // Not a gobbi-docs file — silently skip
      continue;
    }

    const docType = extractDocType(schemaStr);
    docs.push({
      path: filePath,
      doc: parsed as GobbiDoc,
      type: docType,
    });
  }

  return { docs, errors };
}
