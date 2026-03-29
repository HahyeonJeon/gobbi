import { access, readFile, writeFile, readdir, cp, rm, mkdtemp } from 'fs/promises';
import { execFile as execFileCb } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';

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
 * Rejects names containing "..", path separators outside of scoped package format.
 */
function validatePackageName(name: string): void {
  if (name.length === 0) {
    throw new Error('Package name cannot be empty.');
  }
  if (name.includes('..')) {
    throw new Error('Package name cannot contain "..".');
  }
  // After removing the scope prefix, the remainder must not contain slashes
  const slug = toSlug(name);
  if (slug.includes('/') || slug.includes('\\')) {
    throw new Error('Package name contains invalid path characters.');
  }
}

async function updateManifest(targetDir: string, name: string, version: string): Promise<void> {
  const manifestPath = path.join(targetDir, '.gobbi', 'gobbi.json');
  const raw = await readFile(manifestPath, 'utf8');
  const parsed: unknown = JSON.parse(raw);
  if (!isValidManifest(parsed)) {
    throw new Error('Invalid gobbi.json manifest format.');
  }
  parsed.packages[name] = { version, installed: new Date().toISOString() };
  await writeFile(manifestPath, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
}

export async function runInstall(targetDir: string, packageName: string): Promise<void> {
  // 1. Validate package name
  validatePackageName(packageName);

  // 2. Verify .gobbi/ exists
  const manifestPath = path.join(targetDir, '.gobbi', 'gobbi.json');
  try {
    await access(manifestPath);
  } catch {
    throw new Error(
      'No .gobbi/gobbi.json found. Run "gobbi init" first to initialize gobbi in this project.'
    );
  }

  // 3. Create temp directory
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'gobbi-market-'));

  try {
    // 4. npm pack
    console.log(`Downloading ${packageName}...`);
    await execFile('npm', ['pack', packageName, '--pack-destination', tmpDir]);

    // 5. Find the .tgz file
    const files = await readdir(tmpDir);
    const tgz = files.find((f) => f.endsWith('.tgz'));
    if (!tgz) {
      throw new Error('Failed to download package: no .tgz file found.');
    }

    // 6. Extract
    const tgzPath = path.join(tmpDir, tgz);
    await execFile('tar', ['-xzf', tgzPath, '-C', tmpDir]);

    // 7. The extracted content is in {tmpDir}/package/
    const extractedDir = path.join(tmpDir, 'package');
    try {
      await access(extractedDir);
    } catch {
      throw new Error('Unexpected archive structure: no "package/" directory found.');
    }

    // 8. Determine slug
    const slug = toSlug(packageName);

    // 9. Copy to .gobbi/market/{slug}/
    const installDir = path.join(targetDir, '.gobbi', 'market', slug);
    await cp(extractedDir, installDir, { recursive: true, force: true });

    // 10. Read version from the package's package.json
    const pkgJsonPath = path.join(installDir, 'package.json');
    let version = '0.0.0';
    try {
      const pkgRaw = await readFile(pkgJsonPath, 'utf8');
      const pkgData: unknown = JSON.parse(pkgRaw);
      if (
        pkgData !== null &&
        typeof pkgData === 'object' &&
        !Array.isArray(pkgData) &&
        typeof (pkgData as Record<string, unknown>)['version'] === 'string'
      ) {
        version = (pkgData as Record<string, unknown>)['version'] as string;
      }
    } catch {
      // Use default version if package.json is missing or unreadable
    }

    // 11. Update manifest
    await updateManifest(targetDir, packageName, version);

    // 12. Sync
    console.log('Syncing gobbi configuration...');
    try {
      await execFile('npx', ['@gobbi/core', 'sync'], { cwd: targetDir });
    } catch {
      console.warn('Warning: sync failed. You may need to run "npx @gobbi/core sync" manually.');
    }

    // 14. Success
    console.log(`Installed ${packageName}@${version}`);
  } finally {
    // 13. Clean up tmpDir
    await rm(tmpDir, { recursive: true, force: true });
  }
}
