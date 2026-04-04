/**
 * gobbi validate — Structural validators for agent/skill/gotcha definitions and lint.
 *
 * Subcommands:
 *   agent <file.md>    Validate agent definition frontmatter and body
 *   skill <SKILL.md>   Validate skill definition frontmatter and body
 *   gotcha <file.md>   Validate gotcha entry structure
 *   lint <file.md>     Lint for anti-patterns (code blocks, BAD/GOOD, recipes, interfaces)
 *
 * Output convention (matches shell script originals):
 *   FAIL/WARN/FAILED/PASSED-with-warnings  → stderr
 *   PASS / CLEAN                            → stdout
 *   Exit 0 for pass (with or without warnings), exit 1 for failures/violations.
 */

import { readFile } from 'fs/promises';
import { existsSync, statSync } from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Usage strings
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi validate <subcommand> <file.md>

Subcommands:
  agent <file.md>    Validate agent definition
  skill <SKILL.md>   Validate skill definition
  gotcha <file.md>   Validate gotcha entries
  lint <file.md>     Lint for anti-patterns

Options:
  --help    Show this help message`;

// ---------------------------------------------------------------------------
// Top-level router
// ---------------------------------------------------------------------------

/**
 * Top-level handler for \`gobbi validate\`. Dispatches to subcommands.
 * Called from cli.ts with process.argv.slice(3).
 */
export async function runValidate(args: string[]): Promise<void> {
  const subcommand = args[0];

  switch (subcommand) {
    case 'agent':
      await runValidateAgent(args.slice(1));
      break;
    case 'skill':
      await runValidateSkill(args.slice(1));
      break;
    case 'gotcha':
      await runValidateGotcha(args.slice(1));
      break;
    case 'lint':
      await runValidateLint(args.slice(1));
      break;
    case '--help':
    case undefined:
      console.log(USAGE);
      break;
    default:
      process.stderr.write(`Unknown subcommand: ${subcommand}\n`);
      console.log(USAGE);
      process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read a file and split into lines (no trailing newline on last element). */
async function readLines(filePath: string): Promise<string[]> {
  const content = await readFile(filePath, 'utf8');
  // Split on \n; remove a single trailing empty string produced by a final \n
  const lines = content.split('\n');
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

/**
 * Parse YAML frontmatter from a file's lines.
 * Returns { fmLines, closingIndex } where closingIndex is the 0-based index
 * of the closing '---' line in the original lines array, or null if not found.
 *
 * fmLines contains the frontmatter content (between the two '---' markers,
 * excluding both markers themselves).
 */
function parseFrontmatter(lines: readonly string[]): {
  fmLines: string[];
  closingIndex: number;
} | null {
  if (lines[0] !== '---') return null;

  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') {
      return {
        fmLines: lines.slice(1, i) as string[],
        closingIndex: i,
      };
    }
  }
  return null;
}

/** Extract the value of a YAML scalar field (e.g. "name: foo" → "foo"). */
function getFrontmatterField(fmLines: readonly string[], field: string): string | null {
  const prefix = `${field}:`;
  for (const line of fmLines) {
    if (line.startsWith(prefix)) {
      return line.slice(prefix.length).trimStart();
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// gobbi validate agent
// ---------------------------------------------------------------------------

async function runValidateAgent(args: string[]): Promise<void> {
  const filePath = args[0];
  if (filePath === undefined) {
    process.stderr.write('Usage: gobbi validate agent <file.md>\n');
    process.exit(1);
  }

  if (!existsSync(filePath)) {
    process.stderr.write(`FAIL: File not found: ${filePath}\n`);
    process.exit(1);
  }

  const lines = await readLines(filePath);

  let errors = 0;
  let warnings = 0;

  // ---- YAML frontmatter ----
  if (lines[0] !== '---') {
    process.stderr.write(`FAIL: ${filePath}: No YAML frontmatter — first line must be '---'\n`);
    errors++;
  }

  let fmLines: string[] = [];
  let closingIndex: number | null = null;

  if (lines[0] === '---') {
    const fm = parseFrontmatter(lines);
    if (fm === null) {
      process.stderr.write(`FAIL: ${filePath}: YAML frontmatter not closed — missing second '---'\n`);
      errors++;
    } else {
      fmLines = fm.fmLines;
      closingIndex = fm.closingIndex;

      // ---- Required fields ----
      for (const field of ['name', 'description', 'tools'] as const) {
        if (getFrontmatterField(fmLines, field) === null) {
          process.stderr.write(`FAIL: ${filePath}: Missing required frontmatter field: ${field}\n`);
          errors++;
        }
      }

      // ---- Name format ----
      const nameValue = getFrontmatterField(fmLines, 'name');
      if (nameValue !== null && nameValue.length > 0) {
        const nameLen = nameValue.length;
        if (nameLen < 3 || nameLen > 50) {
          process.stderr.write(
            `FAIL: ${filePath}: Name '${nameValue}' must be 3-50 characters (got ${nameLen})\n`,
          );
          errors++;
        }
        if (!/^[a-z][a-z0-9-]*$/.test(nameValue)) {
          process.stderr.write(
            `FAIL: ${filePath}: Name '${nameValue}' must be lowercase with hyphens only\n`,
          );
          errors++;
        }
        // Cross-validate name vs filename
        const fileBasename = path.basename(filePath, '.md');
        if (nameValue !== fileBasename) {
          process.stderr.write(
            `WARN: ${filePath}: Frontmatter name '${nameValue}' does not match filename '${fileBasename}' — convention: filename equals agent name\n`,
          );
          warnings++;
        }
      }

      // ---- Description trigger language ----
      const descValue = getFrontmatterField(fmLines, 'description');
      if (descValue !== null && descValue.length > 0) {
        const triggerPattern =
          /use this agent when|must delegate|delegate here when|use when|must spawn|spawn alongside|must load when/i;
        if (!triggerPattern.test(descValue)) {
          process.stderr.write(
            `WARN: ${filePath}: Description may lack trigger language (expected phrases like 'Use when', 'MUST delegate here when', etc.)\n`,
          );
          warnings++;
        }
      }

      // ---- Model field ----
      const modelValue = getFrontmatterField(fmLines, 'model');
      if (modelValue !== null && modelValue.length > 0) {
        if (!['sonnet', 'opus', 'haiku', 'inherit'].includes(modelValue)) {
          process.stderr.write(
            `FAIL: ${filePath}: Invalid model value '${modelValue}' — must be one of: sonnet, opus, haiku, inherit\n`,
          );
          errors++;
        }
      }
    }
  }

  // ---- System prompt body ----
  if (lines[0] === '---' && closingIndex !== null) {
    const bodyStart = closingIndex + 1;
    const bodyLines = lines.slice(bodyStart);
    const bodyStripped = bodyLines.join('').replace(/\s/g, '');
    if (bodyStripped.length < 20) {
      process.stderr.write(
        `FAIL: ${filePath}: System prompt body too short (${bodyStripped.length} chars, minimum 20)\n`,
      );
      errors++;
    }
  }

  // ---- Final output ----
  if (errors > 0) {
    process.stderr.write(`FAILED: ${filePath} — ${errors} error(s), ${warnings} warning(s)\n`);
    process.exit(1);
  }

  if (warnings > 0) {
    process.stderr.write(`PASSED with ${warnings} warning(s): ${filePath}\n`);
  }

  process.stdout.write(`PASS: ${filePath}\n`);
}

// ---------------------------------------------------------------------------
// gobbi validate skill
// ---------------------------------------------------------------------------

async function runValidateSkill(args: string[]): Promise<void> {
  const filePath = args[0];
  if (filePath === undefined) {
    process.stderr.write('Usage: gobbi validate skill <SKILL.md>\n');
    process.exit(1);
  }

  if (!existsSync(filePath)) {
    process.stderr.write(`FAIL: File not found: ${filePath}\n`);
    process.exit(1);
  }

  const lines = await readLines(filePath);

  let errors = 0;
  let warnings = 0;

  // ---- YAML frontmatter ----
  let fmLines: string[] = [];
  let closingIndex: number | null = null;
  let descValue: string | null = null;

  if (lines[0] !== '---') {
    process.stderr.write(`FAIL: ${filePath}: No YAML frontmatter — first line must be '---'\n`);
    errors++;
  } else {
    const fm = parseFrontmatter(lines);
    if (fm === null) {
      process.stderr.write(`FAIL: ${filePath}: YAML frontmatter not closed — missing second '---'\n`);
      errors++;
    } else {
      fmLines = fm.fmLines;
      closingIndex = fm.closingIndex;

      // ---- description field ----
      const descLine = fmLines.find((l) => /^description:/.test(l));
      if (descLine === undefined) {
        process.stderr.write(`FAIL: ${filePath}: Missing required frontmatter field: description\n`);
        errors++;
      } else {
        const val = descLine.slice('description:'.length).trimStart();
        if (val.length === 0) {
          process.stderr.write(`FAIL: ${filePath}: description field is empty\n`);
          errors++;
        } else {
          descValue = val;
        }
      }

      // ---- name field ----
      const nameLine = fmLines.find((l) => /^name:/.test(l));
      if (nameLine === undefined) {
        process.stderr.write(`FAIL: ${filePath}: Missing required frontmatter field: name\n`);
        errors++;
      } else {
        const nameValue = nameLine.slice('name:'.length).trimStart();
        const dirName = path.basename(path.dirname(filePath));
        if (nameValue !== dirName) {
          process.stderr.write(
            `WARN: ${filePath}: Frontmatter name '${nameValue}' does not match directory name '${dirName}' — convention: directory name equals skill name equals invocation command\n`,
          );
          warnings++;
        }
      }

      // ---- allowed-tools field ----
      const toolsLine = fmLines.find((l) => /^allowed-tools:/.test(l));
      if (toolsLine === undefined) {
        process.stderr.write(`FAIL: ${filePath}: Missing required frontmatter field: allowed-tools\n`);
        errors++;
      }
    }
  }

  // ---- Line count ----
  const lineCount = lines.length;
  if (lineCount > 500) {
    process.stderr.write(
      `FAIL: ${filePath}: File exceeds 500 line limit (${lineCount} lines)\n`,
    );
    errors++;
  } else if (lineCount > 200) {
    process.stderr.write(
      `WARN: ${filePath}: File exceeds 200 line target (${lineCount} lines) — consider decomposing\n`,
    );
    warnings++;
  }

  // ---- Child documents: sibling .md files ----
  const fileDir = path.dirname(filePath);
  let hasSiblingMds = false;
  try {
    const { readdirSync } = await import('fs');
    const entries = readdirSync(fileDir);
    hasSiblingMds = entries.some(
      (entry) =>
        entry.endsWith('.md') &&
        entry !== 'SKILL.md' &&
        (() => {
          try {
            return statSync(path.join(fileDir, entry)).isFile();
          } catch {
            return false;
          }
        })(),
    );
  } catch {
    // If we can't read the dir, skip this check
  }

  if (hasSiblingMds) {
    const hasNavigate = lines.some((l) => l.includes('Navigate deeper from here:'));
    if (!hasNavigate) {
      process.stderr.write(
        `WARN: ${filePath}: Has child .md files but missing 'Navigate deeper from here:' section\n`,
      );
      warnings++;
    }
  }

  // ---- Description checks (only when descValue was successfully extracted) ----
  if (descValue !== null) {
    const descLen = descValue.length;

    // Max length
    if (descLen > 1024) {
      process.stderr.write(
        `WARN: ${filePath}: Description exceeds 1024 character limit (${descLen} chars) — auto-invocation may truncate\n`,
      );
      warnings++;
    }

    // Min length
    if (descLen < 20) {
      process.stderr.write(
        `WARN: ${filePath}: Description is very short (${descLen} chars) — may not provide enough trigger specificity\n`,
      );
      warnings++;
    }

    // Trigger language
    const triggerPattern =
      /Use (when|this|after|during|to|for)|MUST load when|Load (when|this)|TRIGGER when/i;
    if (!triggerPattern.test(descValue)) {
      process.stderr.write(
        `WARN: ${filePath}: Description may lack trigger-oriented language — consider adding 'Use when...' or 'MUST load when...' phrasing\n`,
      );
      warnings++;
    }
  }

  // ---- Blockquote in first 50 lines of body ----
  if (closingIndex !== null) {
    const bodyStart = closingIndex + 1;
    const bodyFirst50 = lines.slice(bodyStart, bodyStart + 50);
    const hasBlockquote = bodyFirst50.some((l) => /^>/.test(l));
    if (!hasBlockquote) {
      process.stderr.write(
        `WARN: ${filePath}: No blockquote (>) found in first 50 lines of body — skills should lead with core principles\n`,
      );
      warnings++;
    }

    // ---- Stub detection: non-empty lines in body ----
    const bodyLines = lines.slice(bodyStart);
    const nonEmptyCount = bodyLines.filter((l) => /\S/.test(l)).length;
    if (nonEmptyCount < 10) {
      process.stderr.write(
        `WARN: ${filePath}: Body has only ${nonEmptyCount} non-empty lines — may be a stub\n`,
      );
      warnings++;
    }
  }

  // ---- Final output ----
  if (errors > 0) {
    process.stderr.write(`FAILED: ${filePath} — ${errors} error(s), ${warnings} warning(s)\n`);
    process.exit(1);
  }

  if (warnings > 0) {
    process.stderr.write(`PASSED with ${warnings} warning(s): ${filePath}\n`);
  }

  process.stdout.write(`PASS: ${filePath}\n`);
}

// ---------------------------------------------------------------------------
// gobbi validate gotcha
// ---------------------------------------------------------------------------

async function runValidateGotcha(args: string[]): Promise<void> {
  const filePath = args[0];
  if (filePath === undefined) {
    process.stderr.write('Usage: gobbi validate gotcha <file.md>\n');
    process.exit(1);
  }

  if (!existsSync(filePath)) {
    process.stderr.write(`FAIL: File not found: ${filePath}\n`);
    process.exit(1);
  }

  const lines = await readLines(filePath);
  let errors = 0;

  // ---- Entry count and stub check ----
  const entryHeadingPattern = /^#{2,3}\s+[^#]/;
  const entryCount = lines.filter((l) => entryHeadingPattern.test(l)).length;

  // File size in bytes (utf-8 byte length approximation matching `wc -c`)
  let fileSize = 0;
  try {
    fileSize = statSync(filePath).size;
  } catch {
    // fallback: character count
    fileSize = lines.join('\n').length;
  }

  if (entryCount === 0 && fileSize <= 5) {
    process.stderr.write(`INFO: ${filePath}: Empty stub file (no entries yet)\n`);
    process.stdout.write(`PASS: ${filePath}\n`);
    return;
  }

  if (entryCount === 0) {
    process.stderr.write(`FAIL: ${filePath}: No gotcha entries found (expected ## or ### headings)\n`);
    errors++;
  }

  // ---- Per-entry structural checks ----
  interface EntryState {
    title: string;
    line: number;
    hasPriority: boolean;
    hasWhatHappened: boolean;
    hasUserFeedback: boolean;
    hasCorrectApproach: boolean;
  }

  let currentEntry: EntryState | null = null;

  const checkEntry = (entry: EntryState): void => {
    if (!entry.hasPriority) {
      process.stderr.write(
        `FAIL: ${filePath}:${entry.line}: Entry '${entry.title}' missing Priority line\n`,
      );
      errors++;
    }
    if (!entry.hasWhatHappened) {
      process.stderr.write(
        `FAIL: ${filePath}:${entry.line}: Entry '${entry.title}' missing 'What happened' section\n`,
      );
      errors++;
    }
    if (!entry.hasUserFeedback) {
      process.stderr.write(
        `FAIL: ${filePath}:${entry.line}: Entry '${entry.title}' missing 'User feedback' section\n`,
      );
      errors++;
    }
    if (!entry.hasCorrectApproach) {
      process.stderr.write(
        `FAIL: ${filePath}:${entry.line}: Entry '${entry.title}' missing 'Correct approach' section\n`,
      );
      errors++;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const lineNum = i + 1;

    // Detect ## or ### heading (entry delimiter)
    if (entryHeadingPattern.test(line)) {
      // Flush previous entry
      if (currentEntry !== null) {
        checkEntry(currentEntry);
      }
      // Extract title: strip leading ## or ### and whitespace
      const title = line.replace(/^#{2,3}\s*/, '');
      currentEntry = {
        title,
        line: lineNum,
        hasPriority: false,
        hasWhatHappened: false,
        hasUserFeedback: false,
        hasCorrectApproach: false,
      };
      continue;
    }

    if (currentEntry !== null) {
      // Priority line
      if (/^\*\*Priority:\*\*/.test(line)) {
        currentEntry.hasPriority = true;
        // Validate priority value
        const priorityVal = line.replace(/.*\*\*Priority:\*\*\s*/, '');
        if (!['Critical', 'High', 'Medium', 'Low'].includes(priorityVal)) {
          process.stderr.write(
            `FAIL: ${filePath}:${lineNum}: Invalid priority '${priorityVal}' in entry '${currentEntry.title}' — must be Critical, High, Medium, or Low\n`,
          );
          errors++;
        }
      }

      if (/^\*\*What happened:\*\*/.test(line)) {
        currentEntry.hasWhatHappened = true;
      }

      if (/^\*\*User feedback:\*\*/.test(line)) {
        currentEntry.hasUserFeedback = true;
      }

      if (/^\*\*Correct approach:\*\*/.test(line)) {
        currentEntry.hasCorrectApproach = true;
      }
    }
  }

  // Flush the last entry
  if (currentEntry !== null) {
    checkEntry(currentEntry);
  }

  // ---- Final output ----
  if (errors > 0) {
    process.stderr.write(`FAILED: ${filePath} — ${errors} error(s)\n`);
    process.exit(1);
  }

  process.stdout.write(`PASS: ${filePath}\n`);
}

// ---------------------------------------------------------------------------
// gobbi validate lint
// ---------------------------------------------------------------------------

async function runValidateLint(args: string[]): Promise<void> {
  const filePath = args[0];
  if (filePath === undefined) {
    process.stderr.write('Usage: gobbi validate lint <file.md>\n');
    process.exit(1);
  }

  if (!existsSync(filePath)) {
    process.stderr.write(`FAIL: File not found: ${filePath}\n`);
    process.exit(1);
  }

  const lines = await readLines(filePath);
  let violations = 0;

  // ---- Pass 1: Code blocks with programming keywords (not directory trees) ----
  {
    let inCodeBlock = false;
    let codeBlockStart = 0;
    let codeBlockContent = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const lineNum = i + 1;

      if (/^\s*```/.test(line)) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockStart = lineNum;
          codeBlockContent = '';
        } else {
          inCodeBlock = false;

          // Check if it's a directory tree (acceptable)
          const isDirTree = /(├──|└──|│|\.claude\/|\/note\/|\/project\/)/.test(codeBlockContent);

          // Check if it contains code keywords
          const hasCode =
            /\b(function|const |let |var |import |export |class |def |return |async |await |interface |type |enum |struct |impl |fn |pub |module |require\(|from |extends |implements )\b/.test(
              codeBlockContent,
            );

          if (hasCode && !isDirTree) {
            process.stderr.write(
              `VIOLATION: ${filePath}:${codeBlockStart}: Code example in code block (contains programming keywords)\n`,
            );
            violations++;
          }
        }
      } else if (inCodeBlock) {
        codeBlockContent += line + '\n';
      }
    }
  }

  // ---- Pass 2: BAD/GOOD comparison patterns ----
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const lineNum = i + 1;

    // Headers or standalone labels
    if (/^\s*(#{1,6}\s+)?(BAD|GOOD)\s*[:.]?\s*$/.test(line)) {
      process.stderr.write(`VIOLATION: ${filePath}:${lineNum}: BAD/GOOD comparison pattern\n`);
      violations++;
    }

    // Inline bold labels
    if (/\*\*(BAD|GOOD)\*\*/.test(line)) {
      process.stderr.write(`VIOLATION: ${filePath}:${lineNum}: BAD/GOOD comparison label\n`);
      violations++;
    }
  }

  // ---- Pass 3: Step-by-step numbered recipes ----
  {
    const imperativePattern =
      /^\s*[0-9]+\.\s+(Run|Create|Open|Set|Add|Install|Configure|Execute|Copy|Move|Delete|Write|Build|Deploy|Start|Stop|Enable|Disable|Update|Download|Upload|Check|Verify|Ensure|Navigate|Click|Select|Enter|Type)\b/;

    let consecutiveImperatives = 0;
    let recipeStart = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const lineNum = i + 1;

      if (imperativePattern.test(line)) {
        if (consecutiveImperatives === 0) {
          recipeStart = lineNum;
        }
        consecutiveImperatives++;
      } else {
        if (consecutiveImperatives >= 4) {
          process.stderr.write(
            `VIOLATION: ${filePath}:${recipeStart}: Step-by-step recipe (${consecutiveImperatives} consecutive imperative numbered steps)\n`,
          );
          violations++;
        }
        consecutiveImperatives = 0;
      }
    }

    // Trailing accumulation
    if (consecutiveImperatives >= 4) {
      process.stderr.write(
        `VIOLATION: ${filePath}:${recipeStart}: Step-by-step recipe (${consecutiveImperatives} consecutive imperative numbered steps)\n`,
      );
      violations++;
    }
  }

  // ---- Pass 4: TypeScript/Go interface/type definitions in code blocks ----
  {
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const lineNum = i + 1;

      if (/^\s*```/.test(line)) {
        inCodeBlock = !inCodeBlock;
      } else if (inCodeBlock) {
        if (/^\s*(interface|type)\s+[A-Z]\w*\s*(\{|=)/.test(line)) {
          process.stderr.write(
            `VIOLATION: ${filePath}:${lineNum}: Interface/type definition in code block\n`,
          );
          violations++;
        }
      }
    }
  }

  // ---- Final output ----
  if (violations > 0) {
    process.stderr.write(`FAILED: ${filePath} — ${violations} violation(s)\n`);
    process.exit(1);
  }

  process.stdout.write(`CLEAN: ${filePath}\n`);
}
