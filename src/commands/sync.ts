import { isV2Installed } from '../lib/detect.js';
import { sync } from '../lib/sync.js';
import { header, error, printSyncSummary } from '../lib/style.js';

/**
 * Run the gobbi sync command — synchronize .gobbi/ to .claude/.
 * @param targetDir - The project root to sync.
 */
export async function runSync(targetDir: string): Promise<void> {
  if (!(await isV2Installed(targetDir))) {
    console.log(error('Gobbi v0.2.0 is not installed in this project.'));
    console.log("Run 'npx gobbi install' to install it first.");
    process.exit(1);
  }

  console.log(header('Syncing .gobbi/ \u2192 .claude/...'));
  console.log('');

  const result = await sync(targetDir);

  printSyncSummary(result.skillsCopied, result.agentsCopied, result.hooksCopied);
}
