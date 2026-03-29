import { execFile as execFileCb } from 'child_process';
import { promisify } from 'util';

const execFile = promisify(execFileCb);

interface NpmSearchResult {
  name: string;
  description: string;
  version: string;
}

function isSearchResultArray(value: unknown): value is NpmSearchResult[] {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every(
    (item): item is NpmSearchResult =>
      item !== null &&
      typeof item === 'object' &&
      typeof (item as Record<string, unknown>)['name'] === 'string' &&
      typeof (item as Record<string, unknown>)['version'] === 'string'
  );
}

function isGobbiPackage(name: string): boolean {
  return name.startsWith('@gobbi/') || name.includes('gobbi');
}

export async function runSearch(query: string): Promise<void> {
  console.log(`Searching for gobbi packages matching "${query}"...`);

  let stdout: string;
  try {
    const result = await execFile('npm', ['search', query, '--json']);
    stdout = result.stdout;
  } catch {
    console.error('Failed to search npm registry.');
    process.exit(1);
  }

  const parsed: unknown = JSON.parse(stdout);
  if (!isSearchResultArray(parsed)) {
    console.error('Unexpected response format from npm search.');
    process.exit(1);
  }

  const results = parsed.filter((pkg) => isGobbiPackage(pkg.name));

  if (results.length === 0) {
    console.log(`No gobbi packages found matching '${query}'`);
    return;
  }

  // Calculate column widths
  const nameHeader = 'Name';
  const versionHeader = 'Version';
  const descHeader = 'Description';

  const nameWidth = Math.max(nameHeader.length, ...results.map((r) => r.name.length));
  const versionWidth = Math.max(versionHeader.length, ...results.map((r) => r.version.length));

  // Print header
  const header = `${nameHeader.padEnd(nameWidth)}  ${versionHeader.padEnd(versionWidth)}  ${descHeader}`;
  console.log(header);
  console.log('-'.repeat(header.length));

  // Print rows
  for (const pkg of results) {
    const description = typeof pkg.description === 'string' ? pkg.description : '';
    console.log(
      `${pkg.name.padEnd(nameWidth)}  ${pkg.version.padEnd(versionWidth)}  ${description}`
    );
  }
}
