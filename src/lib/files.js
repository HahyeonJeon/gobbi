import { readdir, cp, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Copy all gobbi skill directories from templates to target.
 * Copies directories starting with "gobbi" (matches both gobbi and gobbi-*).
 * @param {string} templatesDir - Source templates directory.
 * @param {string} targetDir - Target project root.
 * @returns {Promise<number>} Count of skill directories copied.
 */
export async function copySkills(templatesDir, targetDir) {
  const srcDir = path.join(templatesDir, 'skills');
  const destDir = path.join(targetDir, '.claude', 'skills');
  await mkdir(destDir, { recursive: true });

  const entries = await readdir(srcDir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('gobbi')) {
      const src = path.join(srcDir, entry.name);
      const dest = path.join(destDir, entry.name);
      await cp(src, dest, { recursive: true });
      count++;
    }
  }

  return count;
}

/**
 * Copy all gobbi agent files from templates to target.
 * Copies files matching gobbi-* pattern.
 * @param {string} templatesDir - Source templates directory.
 * @param {string} targetDir - Target project root.
 * @returns {Promise<number>} Count of agent files copied.
 */
export async function copyAgents(templatesDir, targetDir) {
  const srcDir = path.join(templatesDir, 'agents');
  const destDir = path.join(targetDir, '.claude', 'agents');
  await mkdir(destDir, { recursive: true });

  const entries = await readdir(srcDir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    if (entry.isFile() && entry.name.startsWith('gobbi-')) {
      const src = path.join(srcDir, entry.name);
      const dest = path.join(destDir, entry.name);
      await cp(src, dest);
      count++;
    }
  }

  return count;
}

/**
 * Copy GOBBI.md from templates to target .claude/ directory.
 * @param {string} templatesDir - Source templates directory.
 * @param {string} targetDir - Target project root.
 * @returns {Promise<number>} Always 1 on success.
 */
export async function copyGobbiMd(templatesDir, targetDir) {
  const src = path.join(templatesDir, 'GOBBI.md');
  const destDir = path.join(targetDir, '.claude');
  await mkdir(destDir, { recursive: true });

  const dest = path.join(destDir, 'GOBBI.md');
  await cp(src, dest);

  return 1;
}
