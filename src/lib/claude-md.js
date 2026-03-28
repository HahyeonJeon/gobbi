import { readFile, writeFile, mkdir, access } from 'fs/promises';
import path from 'path';

const TRIGGER_LINE = 'MUST load this at session start, resume, and compaction. MUST reload skills /gobbi';
const DETECTION_SUBSTRING = 'MUST reload skills /gobbi';

/**
 * Ensure the CLAUDE.md file contains the gobbi trigger line.
 * Creates the file if it doesn't exist, or prepends the trigger line if missing.
 * @param {string} targetDir - The project root directory.
 * @returns {Promise<{created: boolean, modified: boolean, alreadyPresent: boolean}>}
 */
export async function ensureTriggerLine(targetDir) {
  const claudeDir = path.join(targetDir, '.claude');
  const filePath = path.join(claudeDir, 'CLAUDE.md');

  await mkdir(claudeDir, { recursive: true });

  let fileExists = true;
  try {
    await access(filePath);
  } catch {
    fileExists = false;
  }

  if (!fileExists) {
    const content = `# CLAUDE.md\n\n${TRIGGER_LINE}\n`;
    await writeFile(filePath, content, 'utf8');
    return { created: true, modified: false, alreadyPresent: false };
  }

  const existing = await readFile(filePath, 'utf8');

  if (existing.includes(DETECTION_SUBSTRING)) {
    return { created: false, modified: false, alreadyPresent: true };
  }

  let updated;
  if (existing.startsWith('---')) {
    // YAML frontmatter detected — find the closing ---
    const closingIndex = existing.indexOf('---', 3);
    if (closingIndex !== -1) {
      // Find the end of the closing --- line
      const endOfClosing = existing.indexOf('\n', closingIndex);
      const insertPos = endOfClosing !== -1 ? endOfClosing + 1 : existing.length;
      updated = existing.slice(0, insertPos) + '\n' + TRIGGER_LINE + '\n\n' + existing.slice(insertPos);
    } else {
      // No closing --- found, prepend normally with blank line
      updated = TRIGGER_LINE + '\n\n' + existing;
    }
  } else {
    updated = TRIGGER_LINE + '\n\n' + existing;
  }

  await writeFile(filePath, updated, 'utf8');
  return { created: false, modified: true, alreadyPresent: false };
}
