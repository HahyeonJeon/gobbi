/**
 * Audit library — Documentation drift detection.
 *
 * Pure library functions that scan markdown files for stale references,
 * naming convention violations, and missing shell commands. Returns
 * structured Finding[] arrays — no console output, no process.exit().
 *
 * Consumed by the `gobbi audit` CLI wrapper and the `gobbi doctor`
 * orchestrator.
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import type { Finding } from './health.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface AuditOptions {
  directory: string;
  repoRoot: string;
}

// ---------------------------------------------------------------------------
// Shared utilities
// ---------------------------------------------------------------------------

/** Collect all .md files recursively under a directory. */
export function collectMdFiles(dir: string): string[] {
  const results: string[] = [];
  collectMdFilesInto(dir, results);
  return results;
}

function collectMdFilesInto(dir: string, results: string[]): void {
  let entries: string[];
  try {
    entries = readdirSync(dir, { encoding: 'utf8' });
  } catch {
    return;
  }
  for (const name of entries) {
    const fullPath = path.join(dir, name);
    let isDir = false;
    let isFile = false;
    try {
      const st = statSync(fullPath);
      isDir = st.isDirectory();
      isFile = st.isFile();
    } catch {
      continue;
    }
    if (isDir) {
      collectMdFilesInto(fullPath, results);
    } else if (isFile && name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
}

/** Check if a path matches the note directory pattern: .claude/project/{name}/note/... */
export function isNotePath(filePath: string): boolean {
  return /\/.claude\/project\/[^/]+\/note\//.test(filePath);
}

/** Known repo-root prefixes for backtick path checks. */
export const KNOWN_PREFIXES = ['plugins/', 'src/', 'packages/', 'bin/'];

export function hasKnownPrefix(ref: string): boolean {
  return KNOWN_PREFIXES.some((prefix) => ref.startsWith(prefix));
}

/** Extract all markdown link targets `[text](path)` from a line. */
export function extractMarkdownLinks(line: string): string[] {
  const results: string[] = [];
  const re = /\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(line)) !== null) {
    const ref = match[1];
    if (ref !== undefined) results.push(ref);
  }
  return results;
}

/** Extract all backtick-quoted tokens from a line. */
export function extractBacktickTokens(line: string): string[] {
  const results: string[] = [];
  const re = /`([^`]+)`/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(line)) !== null) {
    const token = match[1];
    if (token !== undefined) results.push(token);
  }
  return results;
}

/** Extract all backtick-quoted tokens that end with `/` (directories). */
export function extractBacktickDirTokens(line: string): string[] {
  return extractBacktickTokens(line).filter((t) => t.endsWith('/'));
}

/** Extract frontmatter `name` value from SKILL.md lines. Returns null if not found. */
export function extractFrontmatterName(lines: string[]): string | null {
  let inFrontmatter = false;
  for (const line of lines) {
    if (line === '---') {
      if (inFrontmatter) break; // closing fence
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter && line.startsWith('name:')) {
      return line.slice('name:'.length).trim();
    }
  }
  return null;
}

/**
 * PATH-based command lookup with caching.
 *
 * Splits `process.env.PATH` once per unique token, then checks `existsSync`
 * for each directory entry. Results are cached in a module-scoped Map so each
 * unique token is resolved at most once per process lifetime.
 */
export const commandExistsCache = new Map<string, boolean>();

export function commandExistsOnPath(token: string): boolean {
  const cached = commandExistsCache.get(token);
  if (cached !== undefined) return cached;

  const pathEnv = process.env['PATH'] ?? '';
  const dirs = pathEnv.split(':');
  let found = false;

  for (const dir of dirs) {
    if (dir === '') continue;
    if (existsSync(path.join(dir, token))) {
      found = true;
      break;
    }
  }

  commandExistsCache.set(token, found);
  return found;
}

export const CONTROL_FLOW_KEYWORDS = new Set([
  'if', 'then', 'else', 'elif', 'fi', 'do', 'done',
  'for', 'while', 'until', 'case', 'esac', 'function', 'in', 'select',
]);

/** Shell token patterns to skip outright. */
export function isSkippableToken(token: string): boolean {
  // Quoted strings, redirections, numbers
  return /^["'>0-9<]/.test(token);
}

// ---------------------------------------------------------------------------
// auditReferences
// ---------------------------------------------------------------------------

/**
 * Check markdown links and backtick paths resolve to existing files.
 *
 * Returns a Finding for each stale reference found. Throws if the scan
 * directory does not exist.
 */
export async function auditReferences(opts: AuditOptions): Promise<Finding[]> {
  const { directory, repoRoot } = opts;

  if (!existsSync(directory) || !statSync(directory).isDirectory()) {
    throw new Error(`Directory does not exist: ${directory}`);
  }

  const mdFiles = collectMdFiles(directory);
  const findings: Finding[] = [];

  for (const mdFile of mdFiles) {
    if (isNotePath(mdFile)) continue;

    const fileDir = path.dirname(mdFile);
    let content: string;
    try {
      content = readFileSync(mdFile, 'utf8');
    } catch {
      continue;
    }
    const lines = content.split('\n');
    const relativePath = path.relative(directory, mdFile);

    // Pass 1: Markdown links [text](path)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const lineNum = i + 1;
      const refs = extractMarkdownLinks(line);
      for (let ref of refs) {
        // Skip URLs and pure anchors
        if (/^(https?|mailto|ftp):/.test(ref)) continue;
        if (ref.startsWith('#')) continue;

        // Strip anchor from path#anchor references
        ref = ref.split('#')[0] ?? '';
        if (ref === '') continue;

        const resolved = path.resolve(fileDir, ref);
        if (!existsSync(resolved)) {
          findings.push({
            path: relativePath,
            severity: 'warning',
            category: 'stale-reference',
            message: `line ${lineNum}: broken markdown link -> ${ref}`,
            suggestion: 'Check if the file was renamed or moved, update the link path',
          });
        }
      }
    }

    // Pass 2: Backtick-quoted paths with known repo-root prefixes
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const lineNum = i + 1;
      const tokens = extractBacktickTokens(line);
      for (const ref of tokens) {
        // Skip non-path content: spaces, $, (, =, |, >, <
        if (/[ $()=|><]/.test(ref)) continue;
        // Skip URLs
        if (/^https?:/.test(ref)) continue;
        // Skip flags
        if (/^--?[a-zA-Z]/.test(ref)) continue;
        // Skip templates and globs
        if (/[{*]/.test(ref)) continue;

        // Only check paths starting with known repo directories
        if (!hasKnownPrefix(ref)) continue;

        // Must end with a file extension to be a concrete file reference
        if (!/\.(md|sh|ts|js|json|ya?ml)$/.test(ref)) continue;

        const resolved = path.resolve(repoRoot, ref);
        if (!existsSync(resolved)) {
          findings.push({
            path: relativePath,
            severity: 'warning',
            category: 'stale-reference',
            message: `line ${lineNum}: broken backtick path -> ${ref}`,
            suggestion: 'Check if the file was renamed or moved, update the backtick reference',
          });
        }
      }
    }
  }

  return findings;
}

// ---------------------------------------------------------------------------
// auditConventions
// ---------------------------------------------------------------------------

/**
 * Validate SKILL.md naming conventions and navigation links.
 *
 * Returns a Finding for each naming mismatch, broken nav link, or stale
 * directory claim. Throws if the scan directory does not exist.
 */
export async function auditConventions(opts: AuditOptions): Promise<Finding[]> {
  const { directory, repoRoot } = opts;

  if (!existsSync(directory) || !statSync(directory).isDirectory()) {
    throw new Error(`Directory does not exist: ${directory}`);
  }

  const mdFiles = collectMdFiles(directory);
  // SKILL.md files only
  const skillFiles = mdFiles.filter((f) => path.basename(f) === 'SKILL.md');
  const findings: Finding[] = [];

  // Check 1: SKILL.md frontmatter `name` matches parent directory name
  for (const skillFile of skillFiles) {
    const skillDir = path.dirname(skillFile);
    const dirName = path.basename(skillDir);
    const relativePath = path.relative(directory, skillFile);

    let content: string;
    try {
      content = readFileSync(skillFile, 'utf8');
    } catch {
      continue;
    }
    const lines = content.split('\n');

    const fmName = extractFrontmatterName(lines);
    if (fmName !== null && fmName !== dirName) {
      findings.push({
        path: relativePath,
        severity: 'warning',
        category: 'naming-mismatch',
        message: `line 1: frontmatter name '${fmName}' != directory name '${dirName}'`,
        suggestion: 'Update the frontmatter name to match the directory name',
      });
    }
  }

  // Check 2: Navigation table link targets exist
  for (const skillFile of skillFiles) {
    const skillDir = path.dirname(skillFile);
    const relativePath = path.relative(directory, skillFile);

    let content: string;
    try {
      content = readFileSync(skillFile, 'utf8');
    } catch {
      continue;
    }
    const lines = content.split('\n');
    let inNavSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const lineNum = i + 1;

      // Detect navigation section headers
      if (
        line.includes('Navigate deeper') ||
        (line.includes('Gotcha') && line.includes('File')) ||
        line.includes('Cross-project gotchas')
      ) {
        inNavSection = true;
        continue;
      }

      // End nav section at next heading or horizontal rule
      if (inNavSection) {
        if (/^## /.test(line) || /^---/.test(line)) {
          inNavSection = false;
          continue;
        }
      }

      if (!inNavSection) continue;

      // Check markdown links in nav/table sections
      const refs = extractMarkdownLinks(line);
      for (let ref of refs) {
        // Skip URLs and anchors
        if (/^(https?|mailto):/.test(ref) || ref.startsWith('#')) continue;

        // Strip anchor
        ref = ref.split('#')[0] ?? '';
        if (ref === '') continue;

        const resolved = path.resolve(skillDir, ref);
        if (!existsSync(resolved)) {
          findings.push({
            path: relativePath,
            severity: 'error',
            category: 'broken-nav-link',
            message: `line ${lineNum}: navigation link -> ${ref} (not found)`,
            suggestion: 'Check if the referenced file was renamed or moved',
          });
        }
      }
    }
  }

  // Check 3: Backtick-quoted directory paths with known repo prefixes
  for (const mdFile of mdFiles) {
    if (isNotePath(mdFile)) continue;

    const relativePath = path.relative(directory, mdFile);

    let content: string;
    try {
      content = readFileSync(mdFile, 'utf8');
    } catch {
      continue;
    }
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const lineNum = i + 1;
      const tokens = extractBacktickDirTokens(line);
      for (const ref of tokens) {
        // Skip templates, variables, globs
        if (/[{$*]/.test(ref) || ref.includes(' ')) continue;
        if (/^https?:/.test(ref)) continue;

        // Only check paths with known repo-root prefixes
        if (!hasKnownPrefix(ref)) continue;

        const resolved = path.resolve(repoRoot, ref);
        if (!existsSync(resolved) || !statSync(resolved).isDirectory()) {
          findings.push({
            path: relativePath,
            severity: 'warning',
            category: 'stale-directory-claim',
            message: `line ${lineNum}: directory claim -> ${ref} (not found)`,
            suggestion: 'Check if the directory was renamed or moved',
          });
        }
      }
    }
  }

  return findings;
}

// ---------------------------------------------------------------------------
// auditCommands
// ---------------------------------------------------------------------------

/**
 * Verify shell commands in code blocks exist on PATH or as repo-relative paths.
 *
 * Returns a Finding for each stale command found. Throws if the scan
 * directory does not exist.
 */
export async function auditCommands(opts: AuditOptions): Promise<Finding[]> {
  const { directory, repoRoot } = opts;

  if (!existsSync(directory) || !statSync(directory).isDirectory()) {
    throw new Error(`Directory does not exist: ${directory}`);
  }

  const mdFiles = collectMdFiles(directory);
  const findings: Finding[] = [];

  for (const mdFile of mdFiles) {
    if (isNotePath(mdFile)) continue;

    const relativePath = path.relative(directory, mdFile);

    let content: string;
    try {
      content = readFileSync(mdFile, 'utf8');
    } catch {
      continue;
    }
    const lines = content.split('\n');

    let inCodeBlock = false;
    let isShellBlock = false;
    let skipBlock = false;
    let prevLine = '';
    let heredocDelim: string | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const lineNum = i + 1;

      // Handle heredoc: skip until matching delimiter
      if (heredocDelim !== null) {
        const stripped = line.trimStart();
        if (stripped === heredocDelim) {
          heredocDelim = null;
        }
        prevLine = line;
        continue;
      }

      // Detect code block fences
      if (/^[^\S\n]*```/.test(line)) {
        if (inCodeBlock) {
          // Closing fence
          inCodeBlock = false;
          isShellBlock = false;
          skipBlock = false;
        } else {
          // Opening fence
          inCodeBlock = true;
          isShellBlock = false;
          skipBlock = false;

          // Check for ignore comment on previous line
          if (/<!--\s*gobbi-(?:audit|doctor):ignore\s*-->/.test(prevLine)) {
            skipBlock = true;
          }

          // Check if it's a bash or sh code block
          if (/^[^\S\n]*```(bash|sh)\s*$/.test(line)) {
            isShellBlock = true;
          }
        }
        prevLine = line;
        continue;
      }

      // Only process lines inside shell code blocks
      if (!inCodeBlock || !isShellBlock || skipBlock) {
        prevLine = line;
        continue;
      }

      // Strip leading whitespace
      const stripped = line.trimStart();

      // Skip empty lines
      if (stripped === '') {
        prevLine = line;
        continue;
      }

      // Skip comment lines
      if (stripped.startsWith('#')) {
        prevLine = line;
        continue;
      }

      // Skip continuation lines (starting with | || &&)
      if (/^(\||\|\||&&)/.test(stripped)) {
        prevLine = line;
        continue;
      }

      // Skip lines that are just braces or closing parens
      if (stripped === '{' || stripped === '}' || stripped === ')') {
        prevLine = line;
        continue;
      }

      // Extract first token
      const firstToken = stripped.split(/\s+/)[0] ?? '';

      // Skip control flow keywords
      if (CONTROL_FLOW_KEYWORDS.has(firstToken)) {
        prevLine = line;
        continue;
      }

      // Skip variable assignments (first token contains = before any space)
      if (firstToken.includes('=')) {
        prevLine = line;
        continue;
      }

      // Skip lines that are clearly variable references
      if (firstToken.startsWith('$')) {
        prevLine = line;
        continue;
      }

      // Detect heredoc — set delimiter and continue processing the command line itself
      const heredocMatch = /<<-?\s*'?([A-Za-z_][A-Za-z0-9_]*)'?/.exec(stripped);
      if (heredocMatch !== null) {
        heredocDelim = heredocMatch[1] ?? null;
      }

      // Extract the command token
      let cmdToken = firstToken;

      // Handle sudo prefix — use the second token instead, skipping flags
      if (cmdToken === 'sudo') {
        const parts = stripped.split(/\s+/).slice(1);
        // Skip flags like -u, -E, etc.
        let idx = 0;
        while (idx < parts.length && (parts[idx]?.startsWith('-') ?? false)) {
          idx++;
        }
        const next = parts[idx];
        if (next === undefined || next === '') {
          prevLine = line;
          continue;
        }
        cmdToken = next;
      }

      // Skip variable references as command tokens
      if (cmdToken.startsWith('$')) {
        prevLine = line;
        continue;
      }

      // Skip tokens that are clearly not commands
      if (isSkippableToken(cmdToken)) {
        prevLine = line;
        continue;
      }

      // Strip trailing punctuation that isn't part of the command name
      const cleanToken = cmdToken.replace(/[;|&<>]+$/, '');
      if (cleanToken === '') {
        prevLine = line;
        continue;
      }

      // Check if the command exists
      let found = true;
      if (cleanToken.includes('/')) {
        // Path-based command — check relative to repo root
        const resolved = path.resolve(repoRoot, cleanToken);
        if (!existsSync(resolved)) {
          found = false;
        }
      } else {
        found = commandExistsOnPath(cleanToken);
      }

      if (!found) {
        findings.push({
          path: relativePath,
          severity: 'warning',
          category: 'stale-command',
          message: `line ${lineNum}: command -> ${cleanToken} not found on PATH`,
          suggestion: 'Install the missing command or update the code block',
        });
      }

      prevLine = line;
    }
  }

  return findings;
}
