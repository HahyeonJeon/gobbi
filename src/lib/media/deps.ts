import { execFileSync } from 'child_process';

/**
 * Cached module references for dynamic imports.
 * Stored at module level so subsequent calls skip the import overhead.
 * Typed as `unknown` because these are optional runtime dependencies
 * whose type declarations may not be available at compile time.
 */
let cachedSharp: unknown;
let cachedPlaywright: unknown;

/**
 * Assert that the `sharp` image processing library is available.
 * Attempts a dynamic import and throws a descriptive error with install
 * instructions if the module is not found.
 */
export async function assertSharpAvailable(): Promise<void> {
  try {
    await import('sharp' as string);
  } catch {
    throw new Error(
      'sharp is required but not installed.\n' +
      'Install it with:\n\n' +
      '  npm install sharp\n',
    );
  }
}

/**
 * Assert that the `playwright` browser automation library is available.
 * Attempts a dynamic import and throws a descriptive error with install
 * instructions if the module is not found.
 */
export async function assertPlaywrightAvailable(): Promise<void> {
  try {
    await import('playwright' as string);
  } catch {
    throw new Error(
      'playwright is required but not installed.\n' +
      'Install it with:\n\n' +
      '  npm install playwright && npx playwright install chromium\n',
    );
  }
}

/**
 * Get platform-specific ffmpeg install instructions.
 */
function getFfmpegInstallInstructions(): string {
  const platform = process.platform;

  if (platform === 'darwin') {
    return '  brew install ffmpeg';
  }
  if (platform === 'win32') {
    return '  winget install ffmpeg';
  }
  // Linux and other Unix-like systems
  return '  sudo apt install ffmpeg';
}

/**
 * Check whether a binary is available on the system PATH.
 * Uses `which` on Unix-like systems and `where` on Windows.
 * @param binary - The binary name to look up.
 * @returns true if the binary is found.
 */
function isBinaryAvailable(binary: string): boolean {
  const lookupCommand = process.platform === 'win32' ? 'where' : 'which';
  try {
    execFileSync(lookupCommand, [binary], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check whether a binary responds to `-version` without error.
 * @param binary - The binary name to check.
 * @returns true if the binary executes successfully.
 */
function isBinaryWorking(binary: string): boolean {
  try {
    execFileSync(binary, ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Assert that `ffmpeg` and `ffprobe` are available on the system PATH
 * and respond to `-version`. Throws a descriptive error with
 * platform-specific install instructions if either is missing.
 */
export function assertFfmpegAvailable(): void {
  const missing: string[] = [];

  if (!isBinaryAvailable('ffmpeg') || !isBinaryWorking('ffmpeg')) {
    missing.push('ffmpeg');
  }
  if (!isBinaryAvailable('ffprobe') || !isBinaryWorking('ffprobe')) {
    missing.push('ffprobe');
  }

  if (missing.length > 0) {
    const names = missing.join(' and ');
    throw new Error(
      `${names} required but not found.\n` +
      'Install with:\n\n' +
      getFfmpegInstallInstructions() + '\n',
    );
  }
}

/**
 * Get the `sharp` module via cached dynamic import.
 * On the first call, imports and caches the module. Subsequent calls
 * return the cached reference without import overhead.
 *
 * Returns `unknown` because sharp is an optional runtime dependency
 * whose types may not be available at compile time. Callers with
 * sharp's type declarations installed can narrow the return value.
 * @returns The sharp module namespace.
 */
export async function getSharp(): Promise<unknown> {
  if (cachedSharp !== undefined) {
    return cachedSharp;
  }
  try {
    cachedSharp = await import('sharp' as string);
    return cachedSharp;
  } catch {
    throw new Error(
      'sharp is required but not installed.\n' +
      'Install it with:\n\n' +
      '  npm install sharp\n',
    );
  }
}

/**
 * Get the `playwright` module via cached dynamic import.
 * On the first call, imports and caches the module. Subsequent calls
 * return the cached reference without import overhead.
 *
 * Returns `unknown` because playwright is an optional runtime dependency
 * whose types may not be available at compile time. Callers with
 * playwright's type declarations installed can narrow the return value.
 * @returns The playwright module namespace.
 */
export async function getPlaywright(): Promise<unknown> {
  if (cachedPlaywright !== undefined) {
    return cachedPlaywright;
  }
  try {
    cachedPlaywright = await import('playwright' as string);
    return cachedPlaywright;
  } catch {
    throw new Error(
      'playwright is required but not installed.\n' +
      'Install it with:\n\n' +
      '  npm install playwright && npx playwright install chromium\n',
    );
  }
}
