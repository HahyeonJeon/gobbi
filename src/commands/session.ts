/**
 * gobbi session — Command router for session hook subcommands.
 *
 * Subcommands:
 *   metadata    Extract session metadata from stdin JSON and write to CLAUDE_ENV_FILE
 *   load-env    Load .claude/.env file and write exports to CLAUDE_ENV_FILE
 *
 * Both subcommands are silent on success and exit 0 on missing env vars or files.
 * They are designed to replace shell hook scripts on every session startup.
 */

import { appendFile, readFile, chmod } from 'fs/promises';

import { readStdinJson } from '../lib/stdin.js';

// ---------------------------------------------------------------------------
// Stdin JSON shape
// ---------------------------------------------------------------------------

interface SessionStartJson {
  session_id?: unknown;
  transcript_path?: unknown;
  model?: unknown;
  source?: unknown;
}

// ---------------------------------------------------------------------------
// Top-Level Router
// ---------------------------------------------------------------------------

/**
 * Top-level handler for `gobbi session`. Dispatches to subcommands.
 * Called from cli.ts with process.argv.slice(3).
 */
export async function runSession(args: string[]): Promise<void> {
  const subcommand = args[0];

  switch (subcommand) {
    case 'metadata':
      await runSessionMetadata();
      break;
    case 'load-env':
      await runSessionLoadEnv();
      break;
    default:
      // Unknown or missing subcommand — exit silently (hook context)
      break;
  }
}

// ---------------------------------------------------------------------------
// metadata
// ---------------------------------------------------------------------------

/**
 * Read session metadata from stdin JSON and append env var exports to CLAUDE_ENV_FILE.
 *
 * Matches the behavior of session-metadata.sh:
 * - CLAUDE_PROJECT_DIR comes from process.env, NOT from stdin JSON
 * - CLAUDE_ENV_FILE comes from process.env
 * - Exits silently if CLAUDE_ENV_FILE is not set
 * - Uses append-only writes to CLAUDE_ENV_FILE
 */
async function runSessionMetadata(): Promise<void> {
  const envFile = process.env['CLAUDE_ENV_FILE'];
  if (envFile === undefined || envFile === '') {
    return;
  }

  const projectDir = process.env['CLAUDE_PROJECT_DIR'] ?? '';

  const data = await readStdinJson<SessionStartJson>();

  // If stdin is not piped or not valid JSON, exit silently (matches shell fallback)
  if (data === null) {
    return;
  }

  const sessionId = typeof data.session_id === 'string' ? data.session_id : '';
  const transcriptPath = typeof data.transcript_path === 'string' ? data.transcript_path : '';
  const model = typeof data.model === 'string' ? data.model : '';
  const source = typeof data.source === 'string' ? data.source : '';

  const lines = [
    `export CLAUDE_SESSION_ID=${sessionId}`,
    `export CLAUDE_TRANSCRIPT_PATH=${transcriptPath}`,
    `export CLAUDE_MODEL=${model}`,
    `export CLAUDE_SESSION_SOURCE=${source}`,
    `export CLAUDE_PROJECT_DIR=${projectDir}`,
  ].join('\n') + '\n';

  await appendFile(envFile, lines, 'utf8');
}

// ---------------------------------------------------------------------------
// load-env
// ---------------------------------------------------------------------------

/**
 * Read .claude/.env and append export lines to CLAUDE_ENV_FILE.
 *
 * Matches the behavior of load-notification-env.sh:
 * - Exits silently if CLAUDE_ENV_FILE or CLAUDE_PROJECT_DIR is not set
 * - Exits silently if .claude/.env does not exist
 * - Sets file permissions to 0o600 (errors suppressed)
 * - Skips empty lines and comment lines (starting with #)
 * - Validates each line with regex before writing
 * - Writes warning to stderr for malformed lines
 */
async function runSessionLoadEnv(): Promise<void> {
  const envFile = process.env['CLAUDE_ENV_FILE'];
  const projectDir = process.env['CLAUDE_PROJECT_DIR'];

  if (envFile === undefined || envFile === '' || projectDir === undefined || projectDir === '') {
    return;
  }

  const dotEnvPath = `${projectDir}/.claude/.env`;

  let content: string;
  try {
    content = await readFile(dotEnvPath, 'utf8');
  } catch {
    // File does not exist or is unreadable — exit silently
    return;
  }

  // Set chmod 600 — suppress errors
  try {
    await chmod(dotEnvPath, 0o600);
  } catch {
    // Suppress — matches `chmod 600 "$ENV_FILE" 2>/dev/null || true`
  }

  const validLinePattern = /^[A-Za-z_][A-Za-z0-9_]*=/;
  const lines = content.split('\n');

  for (const line of lines) {
    // Skip empty lines and comment lines
    if (line === '' || line.startsWith('#')) {
      continue;
    }

    if (validLinePattern.test(line)) {
      await appendFile(envFile, `export ${line}\n`, 'utf8');
    } else {
      process.stderr.write(`load-notification-env: skipping malformed line: ${line}\n`);
    }
  }
}
