/**
 * Stdin reading utilities for gobbi hook commands and piped input.
 *
 * - `readStdin` — reads all stdin as a string, returns null when not piped
 * - `readStdinJson` — reads stdin and parses as JSON, returns null on any failure
 */

// ---------------------------------------------------------------------------
// Raw stdin
// ---------------------------------------------------------------------------

/**
 * Read all stdin as a string.
 *
 * Returns null immediately when stdin is a TTY (not piped), preventing hooks
 * from hanging when invoked without piped input. Returns an empty string when
 * stdin is piped but no data arrives.
 */
export function readStdin(): Promise<string | null> {
  if (process.stdin.isTTY === true) {
    return Promise.resolve(null);
  }

  return new Promise<string>((resolve) => {
    const chunks: Buffer[] = [];

    process.stdin.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    process.stdin.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    process.stdin.on('error', () => {
      resolve('');
    });
  });
}

// ---------------------------------------------------------------------------
// JSON stdin
// ---------------------------------------------------------------------------

/**
 * Read stdin and parse as JSON.
 *
 * Returns null when stdin is not piped, when the input is empty, or when the
 * input is not valid JSON. Callers that need to distinguish between these cases
 * should use `readStdin` directly.
 */
export async function readStdinJson<T>(): Promise<T | null> {
  const raw = await readStdin();

  if (raw === null || raw.trim() === '') {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
