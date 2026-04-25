/**
 * Scoped `process.env` mutation helper for tests — captures the prior value
 * of every key in the overlay, applies the overlay, runs the supplied
 * function, and restores the prior values in `finally`. Restoration runs
 * regardless of whether the function returns or throws, eliminating the
 * env-bleed flake class where one test's mutation contaminates a sibling
 * (issue #131).
 *
 * Overlay semantics — the value type is `string | undefined`:
 *   - `string` (including `''`)  → assign `process.env[key] = value`
 *   - `undefined`                → `delete process.env[key]`
 *
 * Restoration distinguishes "key was absent" from "key was present" using a
 * tagged discriminant rather than the value alone — `process.env` values
 * are always strings under the Node/Bun contract, so an absent key cannot
 * be encoded as a `string | undefined` directly without conflating with
 * a deliberate empty-string value the test author wanted to restore.
 *
 * Usage:
 *   await withEnv({ CLAUDE_CODE_VERSION: '2.1.110' }, async () => {
 *     // process.env.CLAUDE_CODE_VERSION === '2.1.110' inside the callback
 *   });
 *   // process.env.CLAUDE_CODE_VERSION is restored to its prior state here
 *
 * The helper is async-aware — the callback may return a Promise and the
 * env restoration is correctly tied to that Promise's settlement. For
 * synchronous callbacks the same body still runs the restore in `finally`.
 *
 * Anti-patterns this helper replaces:
 *   - Hand-written `try { setenv; await fn() } finally { restore }`
 *     blocks that drift across tests and forget the "was absent" case.
 *   - Tests that assume `afterEach` will reset env — `bun:test` does not
 *     reset `process.env` between tests, so leaks survive.
 */

type PriorValue =
  | { readonly present: false }
  | { readonly present: true; readonly value: string };

export async function withEnv(
  overlay: Readonly<Record<string, string | undefined>>,
  fn: () => Promise<void> | void,
): Promise<void> {
  const env = process.env;
  const keys = Object.keys(overlay);

  // Capture prior values BEFORE applying the overlay. The "was present"
  // check uses hasOwnProperty so that a prior empty-string value is
  // restored to '' rather than deleted.
  const prior = new Map<string, PriorValue>();
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(env, key)) {
      const captured = env[key];
      // process.env values are always strings under the Node/Bun
      // contract; the runtime guard is defensive against a future
      // platform that exposes a non-string slot.
      if (typeof captured === 'string') {
        prior.set(key, { present: true, value: captured });
      } else {
        prior.set(key, { present: false });
      }
    } else {
      prior.set(key, { present: false });
    }
  }

  // Apply the overlay.
  for (const key of keys) {
    const value = overlay[key];
    if (value === undefined) {
      delete env[key];
    } else {
      env[key] = value;
    }
  }

  try {
    await fn();
  } finally {
    // Restore — keys absent prior get deleted, keys present prior get
    // their captured string reassigned (preserves '' as ''-not-deleted).
    for (const key of keys) {
      const priorValue = prior.get(key);
      if (priorValue === undefined || !priorValue.present) {
        delete env[key];
      } else {
        env[key] = priorValue.value;
      }
    }
  }
}
