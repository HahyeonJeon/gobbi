import { access, readFile, writeFile, rm } from 'fs/promises';
import { execFile as execFileCb } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFile = promisify(execFileCb);

interface PackageEntry {
  version: string;
  installed: string;
}

interface GobbiManifest {
  version: string;
  installed: string;
  lastSync: string;
  packages: Record<string, PackageEntry>;
}

function isValidManifest(value: unknown): value is GobbiManifest {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return (
    typeof obj['version'] === 'string' &&
    typeof obj['installed'] === 'string' &&
    typeof obj['lastSync'] === 'string' &&
    obj['packages'] !== null &&
    typeof obj['packages'] === 'object' &&
    !Array.isArray(obj['packages'])
  );
}

/**
 * Derive a filesystem-safe slug from a package name.
 * @gobbi/skill-foo -> skill-foo
 * gobbi-skill-bar -> gobbi-skill-bar
 */
function toSlug(packageName: string): string {
  const scopeMatch = packageName.match(/^@[^/]+\/(.+)$/);
  if (scopeMatch?.[1] !== undefined) {
    return scopeMatch[1];
  }
  return packageName;
}

/**
 * Validate a package name to prevent path traversal.
 */
function validatePackageName(name: string): void {
  if (name.length === 0) {
    throw new Error('Package name cannot be empty.');
  }
  if (name.includes('..')) {
    throw new Error('Package name cannot contain "..".');
  }
  const slug = toSlug(name);
  if (slug.includes('/') || slug.includes('\\')) {
    throw new Error('Package name contains invalid path characters.');
  }
}

async function removeFromManifest(targetDir: string, name: string): Promise<void> {
  const manifestPath = path.join(targetDir, '.gobbi', 'gobbi.json');
  const raw = await readFile(manifestPath, 'utf8');
  const parsed: unknown = JSON.parse(raw);
  if (!isValidManifest(parsed)) {
    throw new Error('Invalid gobbi.json manifest format.');
  }
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete parsed.packages[name];
  await writeFile(manifestPath, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
}

export async function runUninstall(targetDir: string, packageName: string): Promise<void> {
  // 1. Validate
  validatePackageName(packageName);

  // 2. Determine slug and check directory exists
  const slug = toSlug(packageName);
  const installDir = path.join(targetDir, '.gobbi', 'market', slug);

  try {
    await access(installDir);
  } catch {
    throw new Error(
      `Package "${packageName}" is not installed (no directory at .gobbi/market/${slug}/).`
    );
  }

  // 3. Delete the directory
  console.log(`Removing ${packageName}...`);
  await rm(installDir, { recursive: true, force: true });

  // 4. Update manifest
  await removeFromManifest(targetDir, packageName);

  // 5. Sync
  console.log('Syncing gobbi configuration...');
  try {
    await execFile('npx', ['@gobbi/core', 'sync'], { cwd: targetDir });
  } catch {
    console.warn('Warning: sync failed. You may need to run "npx @gobbi/core sync" manually.');
  }

  // 6. Success
  console.log(`Uninstalled ${packageName}`);
}
