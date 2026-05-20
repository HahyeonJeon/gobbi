---
priority: high
tech-stack: bun, typescript, node
enforcement: blocking
---

### `mkdtempSync` random suffix breaks NAME_PATTERN-style validators

**Priority:** High

**What happened:** PR-CFM-D T2 inserted a B.0 guard in `commands/workflow/init.ts` that validates `projectFlag ?? basename(repoRoot)` against `NAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/`. The Plan's pre-flight item 8 asserted that the 4 `mkdtempSync` test-fixture prefixes (`gobbi-init-test-`, `gobbi-config-`, `gobbi-project-create-`, `gobbi-install-repo-`) were "all conformant — verified via grep at planning time." The check confirmed the *prefix* was lowercase + hyphenated, but missed that `mkdtempSync` appends a `[a-zA-Z0-9]{6}` random suffix that frequently includes UPPERCASE letters. Result: ~30+ test files using `mkdtempSync(join(tmpdir(), 'PREFIX-'))` produce basenames like `gobbi-init-test-AbCdEf` that fail NAME_PATTERN's lowercase-only character class. ~91 tests fail downstream because `runInit` (and any future `runInstall`/`runConfigInit` with B.0 guards) exits 2 before fixturing completes.

**User feedback:** Surfaced during T2 verification when 91/2275 tests failed across 15 test files despite T2's diff being scoped to 2 files (init.ts + init.test.ts).

**Correct approach:** When a validator restricts to lowercase-only character classes, every test fixture that constructs a directory whose basename will flow through the validator MUST use a deterministic-lowercase suffix. The clean replacement for `mkdtempSync(join(tmpdir(), 'PREFIX-'))`:

```ts
import { randomBytes } from 'node:crypto';
import { mkdirSync } from 'node:fs';

const dir = join(tmpdir(), `PREFIX-${randomBytes(4).toString('hex')}`);
mkdirSync(dir, { recursive: true });
```

`randomBytes(N).toString('hex')` yields `[0-9a-f]+` — guaranteed validator-conformant. This fix is mechanical (single transformation per call site) but blast-radius is wide: all 30+ `mkdtempSync` sites that flow into `runInit` / `runInstall` / `runConfigInit` / `ensureSettingsCascade`.

**Why:** `mkdtempSync` is documented as appending 6 random characters, but the character set isn't fixed in stone — `[a-zA-Z0-9]` is the practical default. Validators that restrict to `[a-z0-9]` cannot trust mkdtemp's basename. The B.0 single-guard architecture (validate-resolved-expression-once) is correct; the test fixtures are wrong.

**Pre-flight check that catches this:** Before locking a Plan that adds a NAME_PATTERN-style guard at any entry point (workflow init, install, config init, project create), grep `src/**/*.test.ts` for `mkdtempSync(join(tmpdir(), '...'))` and verify EITHER:

1. Every site is followed by a `--project <fixed-lowercase-name>` flag in the relevant `runInit`-style call, OR
2. Every site is replaced with the deterministic-lowercase pattern above.

The pre-flight grep on PREFIX alone is INSUFFICIENT — must also verify the random suffix shape interaction.
