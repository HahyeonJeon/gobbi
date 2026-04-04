/**
 * File locking utility for atomic gobbi.json operations.
 *
 * Wraps `proper-lockfile` with a higher-order function that matches the
 * pattern of `with_flock()` in gobbi-config.sh: acquire lock, run callback,
 * release lock — always, even if the callback throws.
 *
 * The lock file is placed at `${filePath}.lock` (proper-lockfile default).
 * If the target file does not exist it is created as an empty file before
 * locking, so proper-lockfile can stat it (required by the library).
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import lockfile from 'proper-lockfile';

/** Default lock acquisition timeout in milliseconds (matches FLOCK_TIMEOUT=5 in shell). */
const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Acquire an exclusive lock on `filePath`, run `fn`, then release the lock.
 *
 * The lock is always released in a `finally` block — the caller does not need
 * to handle cleanup even if `fn` throws.
 *
 * @param filePath - Path to the file to lock. Must be an absolute path.
 * @param fn       - Async callback to run while the lock is held.
 * @param timeout  - Max milliseconds to wait for lock acquisition. Default: 5000.
 * @throws         If the lock cannot be acquired within `timeout` ms.
 * @throws         Re-throws any error from `fn` after releasing the lock.
 */
export async function withLock<T>(
  filePath: string,
  fn: () => Promise<T>,
  timeout: number = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  // proper-lockfile requires the target file to exist before locking.
  // On first run gobbi.json may not yet exist — create it as an empty file.
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    // File does not exist — create it so proper-lockfile can stat it.
    await fs.writeFile(filePath, '', { flag: 'wx' }).catch(() => {
      // Ignore EEXIST: another process may have created it between the
      // access() check and the writeFile() call.
    });
  }

  // Acquire the lock.  Use retry so we poll until `timeout` ms elapses.
  let release: (() => Promise<void>) | undefined;
  try {
    release = await lockfile.lock(filePath, {
      retries: {
        retries: Math.ceil(timeout / 100),
        minTimeout: 100,
        maxTimeout: 500,
        maxRetryTime: timeout,
      },
    });
  } catch (err) {
    throw new Error(
      `Could not acquire lock on "${filePath}" within ${timeout}ms: ${String(err)}`,
    );
  }

  // Run the callback, always releasing the lock afterwards.
  try {
    return await fn();
  } finally {
    await release();
  }
}
