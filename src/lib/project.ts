import { mkdir } from 'fs/promises';
import path from 'path';
import { askQuestion } from './prompt.js';

const PROJECT_SUBDIRS = [
  'gotchas',
  'rules',
  'reference',
  'docs',
  'design',
  'note'
];

interface ProjectResult {
  created: boolean;
  name?: string;
}

/**
 * Prompt for and optionally create a project directory structure.
 * Skipped in non-interactive mode.
 * @param targetDir - Target project root.
 * @param nonInteractive - If true, skip entirely.
 */
export async function initProjectDir(targetDir: string, nonInteractive: boolean): Promise<ProjectResult> {
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
