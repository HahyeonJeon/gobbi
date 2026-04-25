/**
 * gobbi note — Command router for note subcommands.
 *
 * Subcommands:
 *   metadata                                    Output session metadata as key=value pairs
 *   init <project-name> <task-slug>             Create note directory structure
 *   collect <agent-id> <n> <slug> <note-dir>    Extract subagent result from JSONL transcript (--phase ideation|planning|research|execution|review)
 *   planning <note-dir>                         Extract plan from session transcript (writes plan.json)
 *
 * Note on the `planning` subcommand name: aligned with the W4 state-machine
 * rename from 'plan' -> 'planning'. The on-disk artifact filename remains
 * `plan.json` because the artifact contract is separate from the step name.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

import { error } from '../lib/style.js';
import { isRecord, isString } from '../lib/guards.js';
import {
  aggregateTokenUsage,
  extractMessageContent,
  findLastToolUse,
  readFirstLine,
  readLastLine,
} from '../lib/jsonl.js';

// ---------------------------------------------------------------------------
// Usage strings
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi note <subcommand> [options]

Subcommands:
  metadata                                    Output session metadata as key=value pairs
  init <project-name> <task-slug>             Create note directory structure
  collect <agent-id> <n> <slug> <note-dir>    Extract subagent result from JSONL transcript
  planning <note-dir>                         Extract plan from session transcript

Options:
  --help    Show this help message`;

// ---------------------------------------------------------------------------
// Top-Level Router
// ---------------------------------------------------------------------------

/**
 * Top-level handler for `gobbi note`. Dispatches to subcommands.
 * Called from cli.ts with process.argv.slice(3).
 */
export async function runNote(args: string[]): Promise<void> {
  const subcommand = args[0];

  switch (subcommand) {
    case 'metadata':
      await runNoteMetadata();
      break;
    case 'init':
      await runNoteInit(args.slice(1));
      break;
    case 'collect':
      await runNoteCollect(args.slice(1));
      break;
    case 'planning':
      await runNotePlan(args.slice(1));
      break;
    case '--help':
    case undefined:
      console.log(USAGE);
      break;
    default:
      console.error(error(`Unknown subcommand: ${subcommand}`));
      console.error(USAGE);
      process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Format a Date as `YYYYMMDD-HHMM` in local time.
 *
 * Uses local time to match the original `date +%Y%m%d-%H%M` in note-metadata.sh,
 * preserving backward compatibility with existing note directories.
 */
function formatDatetime(date: Date): string {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}`;
}

/**
 * Convert `YYYYMMDD-HHMM` to ISO-like YAML datetime: `YYYY-MM-DDTHH:MM`.
 */
function datetimeToYaml(datetime: string): string {
  // datetime is exactly 13 chars: YYYYMMDD-HHMM
  const year = datetime.slice(0, 4);
  const month = datetime.slice(4, 6);
  const day = datetime.slice(6, 8);
  const hours = datetime.slice(9, 11);
  const minutes = datetime.slice(11, 13);
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Attempt to get the current git branch name.
 * Returns empty string when not in a git repo or git is unavailable.
 */
function getGitBranch(): string {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['pipe', 'pipe', 'pipe'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

/**
 * Resolve the `<phase>/subtasks/` directory inside a note-dir, with a
 * backward-compat fallback for pre-W4 layouts. When `phase` is
 * `'planning'` and the new-shape directory is absent but a legacy
 * `plan/subtasks/` directory exists, return the legacy path so existing
 * note trees stay readable. Same mapping applies for `'planning_eval'`
 * -> legacy `plan_eval`. When `phase` is undefined, the flat
 * `noteDir/subtasks/` path is returned (un-phased layout).
 */
function resolvePhaseSubtasksDir(
  noteDir: string,
  phase: string | undefined,
): string {
  if (phase === undefined) {
    return path.join(noteDir, 'subtasks');
  }
  const primary = path.join(noteDir, phase, 'subtasks');
  if (existsSync(primary)) return primary;
  // Legacy fallback — only applies when the phase was renamed in W4.
  const legacyName =
    phase === 'planning'
      ? 'plan'
      : phase === 'planning_eval'
        ? 'plan_eval'
        : null;
  if (legacyName !== null) {
    const legacy = path.join(noteDir, legacyName, 'subtasks');
    if (existsSync(legacy)) return legacy;
  }
  return primary;
}

/**
 * Parse the note directory basename to extract task metadata.
 *
 * Format: `{YYYYMMDD-HHMM}-{slug}-{session_id}`
 * Example: `20260404-0430-cli-migration-480b307e`
 *
 * - `taskDatetime` = first 13 characters
 * - `taskSlug`     = everything after char 14, minus the trailing `-{session_id}`
 */
function parseNoteDirName(
  noteDirBasename: string,
  sessionId: string,
): { taskDatetime: string; taskSlug: string } {
  const taskDatetime = noteDirBasename.slice(0, 13);
  const rest = noteDirBasename.slice(14);
  const suffix = `-${sessionId}`;
  const taskSlug = rest.endsWith(suffix) ? rest.slice(0, rest.length - suffix.length) : rest;
  return { taskDatetime, taskSlug };
}

// ---------------------------------------------------------------------------
// metadata
// ---------------------------------------------------------------------------

async function runNoteMetadata(): Promise<void> {
  const sessionId = process.env['CLAUDE_SESSION_ID'];
  if (sessionId === undefined || sessionId === '') {
    console.error('Error: CLAUDE_SESSION_ID not set. Is the session-metadata hook configured?');
    process.exit(1);
  }

  const datetime = formatDatetime(new Date());
  const gitBranch = getGitBranch();
  const cwd = process.cwd();
  const claudeModel = process.env['CLAUDE_MODEL'] ?? '';
  const transcriptPath = process.env['CLAUDE_TRANSCRIPT_PATH'] ?? '';

  process.stdout.write(`session_id=${sessionId}\n`);
  process.stdout.write(`datetime=${datetime}\n`);
  process.stdout.write(`git_branch=${gitBranch}\n`);
  process.stdout.write(`cwd=${cwd}\n`);
  process.stdout.write(`claude_model=${claudeModel}\n`);
  process.stdout.write(`transcript_path=${transcriptPath}\n`);
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

async function runNoteInit(args: string[]): Promise<void> {
  if (args[0] === '--help') {
    console.log(
      `Usage: gobbi note init <project-name> <task-slug>\n\nCreate a note directory structure for a task.`,
    );
    return;
  }

  const projectName = args[0];
  const slug = args[1];

  if (projectName === undefined || slug === undefined) {
    console.error(error('Usage: gobbi note init <project-name> <task-slug>'));
    process.exit(1);
  }

  const sessionId = process.env['CLAUDE_SESSION_ID'] ?? '';
  const claudeProjectDir = process.env['CLAUDE_PROJECT_DIR'];
  if (claudeProjectDir === undefined || claudeProjectDir === '') {
    console.error('Error: CLAUDE_PROJECT_DIR is not set.');
    process.exit(1);
  }

  const claudeModel = process.env['CLAUDE_MODEL'] ?? '';
  const transcriptPath = process.env['CLAUDE_TRANSCRIPT_PATH'] ?? '';

  const datetime = formatDatetime(new Date());
  const gitBranch = getGitBranch();
  const cwd = process.cwd();
  const formattedDatetime = datetimeToYaml(datetime);

  const dirName = `${datetime}-${slug}-${sessionId}`;
  const noteDir = path.join(claudeProjectDir, '.claude', 'project', projectName, 'note', dirName);

  // Create per-step subdirectories — subtasks/ in every step. Post-W4,
  // the planning step uses `planning/`; legacy note directories that
  // still carry `plan/` are read-only supported in `runNoteCollect` via
  // the `resolvePhaseDir` helper.
  await Promise.all([
    mkdir(path.join(noteDir, 'ideation', 'subtasks'), { recursive: true }),
    mkdir(path.join(noteDir, 'ideation', 'evaluation'), { recursive: true }),
    mkdir(path.join(noteDir, 'planning', 'subtasks'), { recursive: true }),
    mkdir(path.join(noteDir, 'planning', 'evaluation'), { recursive: true }),
    mkdir(path.join(noteDir, 'research', 'results'), { recursive: true }),
    mkdir(path.join(noteDir, 'research', 'subtasks'), { recursive: true }),
    mkdir(path.join(noteDir, 'research', 'evaluation'), { recursive: true }),
    mkdir(path.join(noteDir, 'execution', 'subtasks'), { recursive: true }),
    mkdir(path.join(noteDir, 'execution', 'evaluation'), { recursive: true }),
    mkdir(path.join(noteDir, 'review', 'subtasks'), { recursive: true }),
  ]);

  // README.md with YAML frontmatter
  const readme = [
    '---',
    `session_id: ${sessionId}`,
    `datetime: ${formattedDatetime}`,
    `git_branch: ${gitBranch}`,
    `cwd: ${cwd}`,
    `claude_model: ${claudeModel}`,
    `transcript: ${transcriptPath}`,
    `task: ${slug}`,
    '---',
    '',
    `# ${slug}`,
    '',
    '<!-- Task description goes here -->',
    '',
  ].join('\n');

  await writeFile(path.join(noteDir, 'README.md'), readme, 'utf8');

  // Extract Claude Code version and model from transcript (first 20 lines)
  let claudeCodeVersion = '';
  let claudeModelId = '';

  if (transcriptPath !== '') {
    let lineCount = 0;
    const { parseJsonlFile } = await import('../lib/jsonl.js');
    for await (const obj of parseJsonlFile(transcriptPath)) {
      if (lineCount >= 20) break;
      lineCount++;
      if (!isRecord(obj)) continue;

      if (claudeCodeVersion === '') {
        const version = obj['version'];
        if (isString(version)) claudeCodeVersion = version;
      }

      if (claudeModelId === '') {
        const message = obj['message'];
        if (isRecord(message)) {
          const model = message['model'];
          if (isString(model)) claudeModelId = model;
        }
      }
    }
  }

  // metadata.json
  const metadata = {
    task: {
      sessionId,
      datetime: formattedDatetime,
      slug,
    },
    env: {
      gitBranch,
      cwd,
      CLAUDE_MODEL: claudeModel,
      CLAUDE_MODEL_ID: claudeModelId,
      CLAUDE_CODE_VERSION: claudeCodeVersion,
      CLAUDE_PROJECT_DIR: claudeProjectDir,
      CLAUDE_TRANSCRIPT_PATH: transcriptPath,
      CLAUDE_CODE_ENTRYPOINT: process.env['CLAUDE_CODE_ENTRYPOINT'] ?? '',
      CLAUDE_SESSION_SOURCE: process.env['CLAUDE_SESSION_SOURCE'] ?? '',
    },
  };

  await writeFile(
    path.join(noteDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2) + '\n',
    'utf8',
  );

  // Output absolute path
  process.stdout.write(path.resolve(noteDir) + '\n');
}

// ---------------------------------------------------------------------------
// collect
// ---------------------------------------------------------------------------

async function runNoteCollect(args: string[]): Promise<void> {
  if (args[0] === '--help') {
    console.log(
      `Usage: gobbi note collect <agent-id> <subtask-number> <subtask-slug> <note-dir> [--phase <ideation|planning|research|execution|review>]\n\nExtract subagent result from JSONL transcript.\n\nOptions:\n  --phase <ideation|planning|research|execution|review>  Route to step-specific subtasks/ subdirectory`,
    );
    return;
  }

  // Parse --phase flag from args
  let phase: string | undefined;
  const filteredArgs: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--phase' && i + 1 < args.length) {
      phase = args[i + 1];
      i++; // skip value
    } else {
      filteredArgs.push(args[i]!);
    }
  }

  const agentId = filteredArgs[0];
  const subtaskNumber = filteredArgs[1];
  const subtaskSlug = filteredArgs[2];
  const noteDir = filteredArgs[3];

  if (
    agentId === undefined ||
    subtaskNumber === undefined ||
    subtaskSlug === undefined ||
    noteDir === undefined
  ) {
    console.error(
      error(
        'Usage: gobbi note collect <agent-id> <subtask-number> <subtask-slug> <note-dir> [--phase <ideation|planning|research|execution|review>]',
      ),
    );
    process.exit(1);
  }

  // Post-W4 phase names align with the state-machine loop name `planning`.
  // Legacy `plan` phase directories on disk are still honoured by
  // `resolvePhaseSubtasksDir` below — a note-dir created before the rename
  // retains its `plan/subtasks/` layout and continues to work.
  const validPhases = ['ideation', 'planning', 'research', 'execution', 'review'];
  if (phase !== undefined && !validPhases.includes(phase)) {
    console.error(error(`Invalid phase: ${phase}. Must be one of: ${validPhases.join(', ')}.`));
    process.exit(1);
  }

  const sessionId = process.env['CLAUDE_SESSION_ID'];
  if (sessionId === undefined || sessionId === '') {
    console.error('Error: CLAUDE_SESSION_ID is not set.');
    process.exit(1);
  }

  const transcriptPath = process.env['CLAUDE_TRANSCRIPT_PATH'];
  if (transcriptPath === undefined || transcriptPath === '') {
    console.error('Error: CLAUDE_TRANSCRIPT_PATH is not set.');
    process.exit(1);
  }

  // Derive subagent transcript paths.
  //
  // `CLAUDE_TRANSCRIPT_PATH` is set by the SessionStart hook to the path
  // Claude Code reports as `transcript_path`. The canonical layout is the
  // *main session* transcript at `<projects-root>/<slug>/<session-id>.jsonl`
  // — its dirname is the per-project root, and joining `<sessionId>/subagents`
  // resolves to the per-session subagent directory.
  //
  // Some hook contexts (notably SubagentStop) may instead supply a path that
  // already lives inside `<projects-root>/<slug>/<session-id>/subagents/`.
  // Naively re-appending `<sessionId>/subagents` then yields a doubled path
  // (`.../<session>/subagents/<session>/subagents`) and the meta-file lookup
  // fails — see issue #132. Make the derivation idempotent by detecting when
  // the dirname already matches the canonical subagent directory and using
  // it directly; otherwise derive it from the project root as before.
  const transcriptDir = path.dirname(transcriptPath);
  const expectedSubagentSuffix = path.join(sessionId, 'subagents');
  const dirnameIsSubagentDir =
    transcriptDir === expectedSubagentSuffix ||
    transcriptDir.endsWith(`${path.sep}${expectedSubagentSuffix}`);
  const subagentDir = dirnameIsSubagentDir
    ? transcriptDir
    : path.join(transcriptDir, sessionId, 'subagents');
  const metaFile = path.join(subagentDir, `agent-${agentId}.meta.json`);
  const jsonlFile = path.join(subagentDir, `agent-${agentId}.jsonl`);

  if (!existsSync(metaFile)) {
    console.error(`Error: Meta file not found: ${metaFile}`);
    process.exit(1);
  }

  if (!existsSync(jsonlFile)) {
    console.error(`Error: JSONL file not found: ${jsonlFile}`);
    process.exit(1);
  }

  // Resolve subtasks directory based on --phase flag. Backward-compat:
  // when `--phase planning` is requested and the new-shape directory
  // does not exist but a legacy `plan/subtasks/` does, fall back to the
  // legacy name so pre-W4 note directories stay readable.
  const subtasksDir = resolvePhaseSubtasksDir(noteDir, phase);
  if (!existsSync(subtasksDir)) {
    console.error(`Error: subtasks/ directory not found: ${subtasksDir}`);
    process.exit(1);
  }

  // Parse task metadata from note directory basename
  const noteDirBasename = path.basename(noteDir);
  const { taskDatetime, taskSlug } = parseNoteDirName(noteDirBasename, sessionId);

  // Read meta.json for agentType and description
  const { readFile } = await import('node:fs/promises');
  let metaContent: string;
  try {
    metaContent = await readFile(metaFile, 'utf8');
  } catch {
    console.error(`Error: Cannot read meta file: ${metaFile}`);
    process.exit(1);
  }

  let metaJson: unknown;
  try {
    metaJson = JSON.parse(metaContent);
  } catch {
    console.error(`Error: Invalid JSON in meta file: ${metaFile}`);
    process.exit(1);
  }

  const agentType = isRecord(metaJson) && isString(metaJson['agentType'])
    ? metaJson['agentType']
    : '';
  const description = isRecord(metaJson) && isString(metaJson['description'])
    ? metaJson['description']
    : '';

  // Read first and last lines of JSONL
  const firstLine = await readFirstLine(jsonlFile);
  const lastLine = await readLastLine(jsonlFile);

  // Extract timestamp from first line
  const timestamp =
    isRecord(firstLine) && isString(firstLine['timestamp']) ? firstLine['timestamp'] : '';

  // Extract model from last line
  const model =
    isRecord(lastLine) && isRecord(lastLine['message']) && isString(lastLine['message']['model'])
      ? lastLine['message']['model']
      : '';

  // Extract delegation prompt (content of first line)
  let delegationPrompt = '';
  if (isRecord(firstLine)) {
    const message = firstLine['message'];
    if (isRecord(message)) {
      delegationPrompt = extractMessageContent(message['content']);
    }
  }

  // Extract final result (content of last line)
  let finalResult = '';
  if (isRecord(lastLine)) {
    const message = lastLine['message'];
    if (isRecord(message)) {
      finalResult = extractMessageContent(message['content']);
    }
  }

  // Aggregate token usage
  const usage = await aggregateTokenUsage(jsonlFile);

  if (finalResult === '') {
    process.stderr.write(`Warning: finalResult is empty or null for agent ${agentId}\n`);
  }

  // Write output JSON
  const outputFile = path.join(subtasksDir, `${subtaskNumber}-${subtaskSlug}.json`);
  const output = {
    sessionId,
    taskDatetime,
    taskSlug,
    agentId,
    agentType,
    description,
    timestamp,
    model,
    usage,
    delegationPrompt,
    finalResult,
  };

  await writeFile(outputFile, JSON.stringify(output, null, 2) + '\n', 'utf8');

  process.stdout.write(path.resolve(outputFile) + '\n');
}

// ---------------------------------------------------------------------------
// plan
// ---------------------------------------------------------------------------

async function runNotePlan(args: string[]): Promise<void> {
  if (args[0] === '--help') {
    console.log(
      `Usage: gobbi note planning <note-dir>\n\nExtract plan from session transcript and write plan.json.`,
    );
    return;
  }

  const noteDir = args[0];
  if (noteDir === undefined) {
    console.error(error('Usage: gobbi note planning <note-dir>'));
    process.exit(1);
  }

  const sessionId = process.env['CLAUDE_SESSION_ID'];
  if (sessionId === undefined || sessionId === '') {
    console.error('Error: CLAUDE_SESSION_ID is not set.');
    process.exit(1);
  }

  const transcriptPath = process.env['CLAUDE_TRANSCRIPT_PATH'];
  if (transcriptPath === undefined || transcriptPath === '') {
    console.error('Error: CLAUDE_TRANSCRIPT_PATH is not set.');
    process.exit(1);
  }

  if (!existsSync(transcriptPath)) {
    console.error(`Error: Transcript file not found: ${transcriptPath}`);
    process.exit(1);
  }

  if (!existsSync(noteDir)) {
    console.error(`Error: Note directory not found: ${noteDir}`);
    process.exit(1);
  }

  // Parse task metadata from note directory basename
  const noteDirBasename = path.basename(noteDir);
  const { taskDatetime, taskSlug } = parseNoteDirName(noteDirBasename, sessionId);

  // Find last ExitPlanMode tool_use
  const toolUse = await findLastToolUse(transcriptPath, 'ExitPlanMode');
  if (toolUse === null) {
    console.error('Error: No ExitPlanMode found in transcript');
    process.exit(1);
  }

  const planInput = toolUse.input;
  const plan = isRecord(planInput) && isString(planInput['plan']) ? planInput['plan'] : '';
  const planFilePath =
    isRecord(planInput) && isString(planInput['planFilePath']) ? planInput['planFilePath'] : '';

  if (plan === '') {
    process.stderr.write('Warning: plan content is empty or null\n');
  }

  // Aggregate token usage from main session transcript
  const usage = await aggregateTokenUsage(transcriptPath);

  const outputFile = path.join(noteDir, 'plan.json');
  const output = {
    sessionId,
    taskDatetime,
    taskSlug,
    timestamp: toolUse.timestamp,
    planFilePath,
    plan,
    usage,
  };

  await writeFile(outputFile, JSON.stringify(output, null, 2) + '\n', 'utf8');

  process.stdout.write(path.resolve(outputFile) + '\n');
}
