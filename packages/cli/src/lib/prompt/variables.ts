/**
 * Variable resolution pipeline for prompt templates.
 *
 * Resolves {{variable}} references from 8 source types: env, config, file,
 * glob, command, state, git, runtime. Each variable declaration specifies
 * its source and path; this module dispatches to the correct resolver.
 *
 * Follows the same patterns as config.ts and state.ts: pure data operations,
 * type-safe narrowing, no `as` casts, strict mode compliance.
 */

import { readFile } from 'node:fs/promises';
import { readdirSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, basename, join } from 'node:path';

import { isRecord, isString } from '../guards.js';
import { readGobbiJson, getNestedValue } from '../config.js';
import { readPromptState, resolvePromptStatePath } from './state.js';
import type { VariableDeclaration, VariableSource } from './types.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Resolved variables — key/value map ready for interpolation. */
export type ResolvedVariables = Record<string, string>;

/** Error thrown when a required variable fails resolution. */
export class PromptResolutionError extends Error {
  readonly variableName: string;
  readonly source: VariableSource;

  constructor(variableName: string, source: VariableSource, message: string) {
    super(message);
    this.name = 'PromptResolutionError';
    this.variableName = variableName;
    this.source = source;
  }
}

// ---------------------------------------------------------------------------
// Path Resolution Helpers
// ---------------------------------------------------------------------------

/**
 * Resolve the path to gobbi.json using CLAUDE_PROJECT_DIR.
 * Returns null if CLAUDE_PROJECT_DIR is not set.
 */
function resolveGobbiJsonPath(): string | null {
  const projectDir = process.env['CLAUDE_PROJECT_DIR'];
  if (!projectDir) return null;
  return join(projectDir, '.claude', 'gobbi.json');
}

// ---------------------------------------------------------------------------
// Source Resolvers
// ---------------------------------------------------------------------------

/**
 * Resolve a variable from the `env` source.
 * Returns the environment variable value, or null if not set.
 */
function resolveEnv(declaration: VariableDeclaration): string | null {
  const value = process.env[declaration.path];
  return value !== undefined ? value : null;
}

/**
 * Resolve a variable from the `config` source.
 * Reads gobbi.json, finds the current session by CLAUDE_SESSION_ID,
 * then accesses the nested path within that session.
 */
async function resolveConfig(declaration: VariableDeclaration): Promise<string | null> {
  const filePath = resolveGobbiJsonPath();
  if (filePath === null) return null;

  const data = await readGobbiJson(filePath);
  if (data === null) return null;

  const sessionId = process.env['CLAUDE_SESSION_ID'];
  if (!sessionId) return null;

  const session: unknown = data.sessions[sessionId];
  if (!isRecord(session)) return null;

  const value = getNestedValue(session, declaration.path);
  if (value === undefined || value === null) return null;

  return isString(value) ? value : JSON.stringify(value);
}

/**
 * Resolve a variable from the `file` source.
 * Reads the file at the declared path. Returns null on ENOENT.
 */
async function resolveFile(declaration: VariableDeclaration): Promise<string | null> {
  try {
    return await readFile(declaration.path, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Resolve a variable from the `glob` source.
 * Splits the path into directory + pattern, lists matching files,
 * and concatenates their contents separated by `\n---\n`.
 *
 * Uses simple glob matching: `*` matches any sequence of non-separator
 * characters, `?` matches a single character. No external library.
 */
function resolveGlob(declaration: VariableDeclaration): string | null {
  const dir = dirname(declaration.path);
  const pattern = basename(declaration.path);

  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return null;
  }

  // Convert simple glob pattern to regex
  const regexStr = '^' + pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.') + '$';
  const regex = new RegExp(regexStr);

  const matched = entries
    .filter((entry) => regex.test(entry))
    .sort();

  if (matched.length === 0) return null;

  const contents: string[] = [];
  for (const entry of matched) {
    try {
      const content = readFileSync(join(dir, entry), 'utf8');
      contents.push(content);
    } catch {
      // Skip unreadable files
    }
  }

  return contents.length > 0 ? contents.join('\n---\n') : null;
}

/**
 * Resolve a variable from the `command` source.
 * Executes the command and returns trimmed stdout. Returns null on error.
 */
function resolveCommand(declaration: VariableDeclaration): string | null {
  try {
    return execSync(declaration.path, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Resolve a variable from the `state` source.
 * Reads prompt-state.json and accesses the nested path.
 */
async function resolveState(declaration: VariableDeclaration): Promise<string | null> {
  const filePath = resolvePromptStatePath();
  if (filePath === null) return null;

  const state = await readPromptState(filePath);
  if (state === null) return null;

  const stateAsRecord = state as unknown as Record<string, unknown>;
  const value = getNestedValue(stateAsRecord, declaration.path);
  if (value === undefined || value === null) return null;

  return isString(value) ? value : JSON.stringify(value);
}

/**
 * Resolve a variable from the `git` source.
 * Executes `git <path>` and returns trimmed stdout. Returns null on error.
 */
function resolveGit(declaration: VariableDeclaration): string | null {
  try {
    return execSync('git ' + declaration.path, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Resolve a variable from the `runtime` source.
 * Simple lookup in the runtime values map.
 */
function resolveRuntime(
  declaration: VariableDeclaration,
  runtimeValues: Record<string, string>,
): string | null {
  const value = runtimeValues[declaration.path];
  return value !== undefined ? value : null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Resolve a single variable from its declared source.
 * Returns the resolved string value, or null if resolution fails.
 */
export async function resolveVariable(
  name: string,
  declaration: VariableDeclaration,
  runtimeValues: Record<string, string>,
): Promise<string | null> {
  // Suppress unused parameter lint — name is part of the public API signature
  void name;

  switch (declaration.source) {
    case 'env':
      return resolveEnv(declaration);
    case 'config':
      return resolveConfig(declaration);
    case 'file':
      return resolveFile(declaration);
    case 'glob':
      return resolveGlob(declaration);
    case 'command':
      return resolveCommand(declaration);
    case 'state':
      return resolveState(declaration);
    case 'git':
      return resolveGit(declaration);
    case 'runtime':
      return resolveRuntime(declaration, runtimeValues);
  }
}

/**
 * Resolve all variables in a template.
 * Throws PromptResolutionError for any required variable that fails.
 * Returns a ResolvedVariables map.
 */
export async function resolveAllVariables(
  variables: Record<string, VariableDeclaration>,
  runtimeValues: Record<string, string>,
): Promise<ResolvedVariables> {
  const resolved: ResolvedVariables = {};

  for (const [name, declaration] of Object.entries(variables)) {
    const value = await resolveVariable(name, declaration, runtimeValues);

    if (value === null) {
      if (declaration.required) {
        throw new PromptResolutionError(
          name,
          declaration.source,
          `Required variable "${name}" could not be resolved from source "${declaration.source}" (path: "${declaration.path}")`,
        );
      }
      resolved[name] = declaration.fallback ?? '';
    } else {
      resolved[name] = value;
    }
  }

  return resolved;
}

/**
 * Replace all {{key}} references in a template string with resolved values.
 * Unresolved references (not in resolved map) become empty string.
 */
export function interpolate(template: string, resolved: ResolvedVariables): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => resolved[key] ?? '');
}
