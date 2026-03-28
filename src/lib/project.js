import { mkdir } from 'fs/promises';
import path from 'path';
import readline from 'readline';

const PROJECT_SUBDIRS = [
  'gotchas',
  'rules',
  'reference',
  'docs',
  'design',
  'note'
];

/**
 * Prompt for and optionally create a project directory structure.
 * Skipped in non-interactive mode.
 * @param {string} targetDir - Target project root.
 * @param {boolean} nonInteractive - If true, skip entirely.
 * @returns {Promise<{created: boolean, name?: string}>}
 */
export async function initProjectDir(targetDir, nonInteractive) {
  if (nonInteractive) {
    return { created: false };
  }

  const name = await askQuestion('Project name (leave empty to skip): ');
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { created: false };
  }

  // Reject path separators and traversal sequences
  if (trimmedName.includes('/') || trimmedName.includes('\\') || trimmedName.includes('..')) {
    console.error('Error: Invalid project name. Must not contain path separators or "..".');
    return { created: false };
  }

  // Verify resolved path stays inside .claude/project/
  const projectBase = path.join(targetDir, '.claude', 'project');
  const projectDir = path.resolve(projectBase, trimmedName);
  if (!projectDir.startsWith(projectBase + path.sep)) {
    console.error('Error: Invalid project name. Resolved path is outside project directory.');
    return { created: false };
  }

  for (const subdir of PROJECT_SUBDIRS) {
    await mkdir(path.join(projectDir, subdir), { recursive: true });
  }

  return { created: true, name: trimmedName };
}

/**
 * Ask a question via readline and return the answer.
 * @param {string} prompt - The question to display.
 * @returns {Promise<string>} The user's answer.
 */
function askQuestion(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
