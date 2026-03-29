import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { askQuestion } from './prompt.js';

export interface GitignoreResult {
  alreadyIgnored: boolean;
  added: boolean;
  skipped: boolean;
}

/**
 * Check if `.claude/` is ignored in `.gitignore` and optionally add it.
 * @param targetDir - The project root directory containing `.gitignore`.
 * @param interactive - Whether to prompt the user to add the entry.
 * @returns The result indicating what action was taken.
 */
export async function ensureClaudeDirIgnored(
  targetDir: string,
  interactive: boolean,
): Promise<GitignoreResult> {
  const gitignorePath = path.join(targetDir, '.gitignore');

  let content: string;
  try {
    content = await readFile(gitignorePath, 'utf-8');
  } catch {
    content = '';
  }

  const lines = content.split('\n').map((line) => line.trim());
  const alreadyIgnored = lines.some((line) => line === '.claude/');

  if (alreadyIgnored) {
    return { alreadyIgnored: true, added: false, skipped: false };
  }

  if (!interactive) {
    return { alreadyIgnored: false, added: false, skipped: true };
  }

  const answer = await askQuestion('Add .claude/ to .gitignore? (y/N) ');
  if (answer.toLowerCase() !== 'y') {
    return { alreadyIgnored: false, added: false, skipped: true };
  }

  const suffix = content.length > 0 && !content.endsWith('\n') ? '\n' : '';
  const additions = '.claude/\n';
  await writeFile(gitignorePath, content + suffix + additions, 'utf-8');

  return { alreadyIgnored: false, added: true, skipped: false };
}
