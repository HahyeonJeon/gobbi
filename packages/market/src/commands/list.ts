import { readFile } from 'fs/promises';
import path from 'path';

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

export async function runList(targetDir: string): Promise<void> {
  const manifestPath = path.join(targetDir, '.gobbi', 'gobbi.json');

  let raw: string;
  try {
    raw = await readFile(manifestPath, 'utf8');
  } catch {
    console.log('No .gobbi/gobbi.json found. Run "gobbi init" first.');
    return;
  }

  const parsed: unknown = JSON.parse(raw);
  if (!isValidManifest(parsed)) {
    console.error('Invalid gobbi.json manifest format.');
    process.exit(1);
  }

  const entries = Object.entries(parsed.packages);

  if (entries.length === 0) {
    console.log('No marketplace packages installed.');
    return;
  }

  // Calculate column widths
  const nameHeader = 'Name';
  const versionHeader = 'Version';
  const installedHeader = 'Installed';

  const nameWidth = Math.max(nameHeader.length, ...entries.map(([name]) => name.length));
  const versionWidth = Math.max(
    versionHeader.length,
    ...entries.map(([, entry]) => entry.version.length)
  );
  const installedWidth = Math.max(
    installedHeader.length,
    ...entries.map(([, entry]) => entry.installed.length)
  );

  // Print header
  const header = `${nameHeader.padEnd(nameWidth)}  ${versionHeader.padEnd(versionWidth)}  ${installedHeader.padEnd(installedWidth)}`;
  console.log(header);
  console.log('-'.repeat(header.length));

  // Print rows
  for (const [name, entry] of entries) {
    console.log(
      `${name.padEnd(nameWidth)}  ${entry.version.padEnd(versionWidth)}  ${entry.installed.padEnd(installedWidth)}`
    );
  }
}
