import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export interface PackageEntry {
  version: string;
  installed: string; // ISO timestamp
}

export interface GobbiManifest {
  version: string;
  installed: string;      // ISO timestamp
  lastSync: string;       // ISO timestamp
  packages: Record<string, PackageEntry>;
}

function manifestPath(gobbiDir: string): string {
  return path.join(gobbiDir, 'gobbi.json');
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

/** Read .gobbi/gobbi.json, return null if missing or invalid JSON. */
export async function readManifest(gobbiDir: string): Promise<GobbiManifest | null> {
  try {
    const raw = await readFile(manifestPath(gobbiDir), 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (isValidManifest(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/** Write .gobbi/gobbi.json with 2-space indent and trailing newline. */
export async function writeManifest(gobbiDir: string, manifest: GobbiManifest): Promise<void> {
  await mkdir(gobbiDir, { recursive: true });
  await writeFile(manifestPath(gobbiDir), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

/** Create a fresh manifest with current timestamps and empty packages. */
export function createManifest(version: string): GobbiManifest {
  const now = new Date().toISOString();
  return {
    version,
    installed: now,
    lastSync: now,
    packages: {},
  };
}

/** Read manifest, update lastSync to now, write back. */
export async function updateSyncTimestamp(gobbiDir: string): Promise<void> {
  const manifest = await readManifest(gobbiDir);
  if (!manifest) {
    return;
  }
  manifest.lastSync = new Date().toISOString();
  await writeManifest(gobbiDir, manifest);
}

/** Read manifest, add or update a package entry with current timestamp, write back. */
export async function addPackage(gobbiDir: string, name: string, version: string): Promise<void> {
  const manifest = await readManifest(gobbiDir);
  if (!manifest) {
    return;
  }
  manifest.packages[name] = {
    version,
    installed: new Date().toISOString(),
  };
  await writeManifest(gobbiDir, manifest);
}

/** Read manifest, delete a package entry, write back. */
export async function removePackage(gobbiDir: string, name: string): Promise<void> {
  const manifest = await readManifest(gobbiDir);
  if (!manifest) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete manifest.packages[name];
  await writeManifest(gobbiDir, manifest);
}
