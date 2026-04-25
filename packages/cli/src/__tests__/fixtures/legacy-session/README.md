# Legacy-session fixtures

Frozen on-disk shapes that pre-date one or more v0.5.0 Phase-2 passes.
Used by `cross-pass-invariant.test.ts` to verify that the init-cascade
seam normalises EVERY layer to its current schema in the right order.

| File | Shape | Pass that introduced it | Pass that supersedes it |
|---|---|---|---|
| `project-config.json` | T2-v1 (Pass-3 era project config) | Pass 3 | Pass 3 finalize |
| `claude-gobbi.json` | Pre-Pass-3 user-tier JSON config | pre-Pass 3 | Pass 3 finalize |

A fresh-install scenario uses no fixtures; the comparison test asserts
that running `ensureSettingsCascade` + `runInitWithOptions` against a
legacy-fixture seed yields a session shape semantically equivalent to
the fresh-install scenario (modulo session-id / createdAt / project-root
paths).
