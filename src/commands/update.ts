import { fileURLToPath } from 'url';
import path from 'path';
import { readFile, readdir, rm, cp, chmod } from 'fs/promises';
import { getInstalledVersion } from '../lib/detect.js';
import { sync } from '../lib/sync.js';
import { SUBDIRS } from '../lib/gobbi-dir.js';
import { printBanner, header, ok, error } from '../lib/style.js';

interface UpdateOptions {
  nonInteractive: boolean;
}

/**
 * Run the gobbi update command — replace gobbi core files and sync.
 * @param targetDir - The project root to update.
 * @param options - Command options.
 */
export async function runUpdate(targetDir: string, options: UpdateOptions): Promise<void> {
  // 1. Check installed version — must be v2
  const version = await getInstalledVersion(targetDir);
  if (version !== 'v2') {
    console.log(error('Gobbi v2 is not installed in this project.'));
    console.log("Run 'npx gobbi init' to install it first.");
    process.exit(1);
  }

  // 2. Resolve templates directory
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const templatesDir = path.resolve(currentDir, '..', '..', 'plugins', 'gobbi-core');

  // 3. Read version from package.json
  const pkgPath = path.resolve(currentDir, '..', '..', 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as { version: string };

  // 4. Print banner
  printBanner(pkg.version);

  // 5. Print update header
  console.log(header('Updating gobbi core...'));
  console.log('');

  // 6. Replace .gobbi/core/skills/ — readdir for gobbi* dirs, rm old, cp new
  const skillsSrcDir = path.join(templatesDir, 'skills');
  const skillsDestDir = path.join(targetDir, SUBDIRS.coreSkills);
  const skillEntries = await readdir(skillsSrcDir, { withFileTypes: true });
  let skillCount = 0;

  for (const entry of skillEntries) {
    if (!entry.isDirectory() || !entry.name.startsWith('gobbi')) {
      continue;
    }
    const src = path.join(skillsSrcDir, entry.name);
    const dest = path.join(skillsDestDir, entry.name);
    await rm(dest, { recursive: true, force: true });
    await cp(src, dest, { recursive: true });
    skillCount++;
  }

  console.log(ok(`Updated ${skillCount} core skill directories`));

  // 7. Replace .gobbi/core/agents/ — readdir for gobbi-* files, cp
  const agentsSrcDir = path.join(templatesDir, 'agents');
  const agentsDestDir = path.join(targetDir, SUBDIRS.coreAgents);
  const agentEntries = await readdir(agentsSrcDir, { withFileTypes: true });
  let agentCount = 0;

  for (const entry of agentEntries) {
    if (!entry.isFile() || !entry.name.startsWith('gobbi-')) {
      continue;
    }
    const src = path.join(agentsSrcDir, entry.name);
    const dest = path.join(agentsDestDir, entry.name);
    await cp(src, dest);
    agentCount++;
  }

  console.log(ok(`Updated ${agentCount} core agent definitions`));

  // 8. Replace .gobbi/core/hooks/ — cp all, chmod 755
  const hooksSrcDir = path.join(templatesDir, 'hooks');
  const hooksDestDir = path.join(targetDir, SUBDIRS.coreHooks);
  const hookEntries = await readdir(hooksSrcDir, { withFileTypes: true });
  let hookCount = 0;

  for (const entry of hookEntries) {
    if (!entry.isFile()) {
      continue;
    }
    const src = path.join(hooksSrcDir, entry.name);
    const dest = path.join(hooksDestDir, entry.name);
    await cp(src, dest);
    await chmod(dest, 0o755);
    hookCount++;
  }

  console.log(ok(`Updated ${hookCount} core hooks`));

  // 9. Replace .gobbi/core/GOBBI.md
  const gobbiMdSrc = path.join(templatesDir, 'GOBBI.md');
  const gobbiMdDest = path.join(targetDir, SUBDIRS.core, 'GOBBI.md');
  await cp(gobbiMdSrc, gobbiMdDest);
  console.log(ok('Updated GOBBI.md'));

  // 10. Run sync
  await sync(targetDir);
  console.log(ok('Synced .gobbi/ to .claude/'));

  // 11. Print success
  console.log('');
  console.log(ok(`Updated gobbi core to v${pkg.version}`));
}
