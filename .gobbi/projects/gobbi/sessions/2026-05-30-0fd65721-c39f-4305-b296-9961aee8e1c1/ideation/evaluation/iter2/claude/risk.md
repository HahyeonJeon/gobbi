# Risk Perspective — Claude Evaluation (iter 2)

## Artifact Summary + Memory reads
See project.md. Risk lens: blast radius, reversibility, security surface, the R1 cache-payload risk, R2 hook double-registration, irreversibility, two-week smell test.

**Memory reads:** as project.md; iter-1 codex `risk.md` + overall (R1/R2); mistakes (skills-mirror-symlinks-not-copies, symlink-restore-depth-wrong, edit-tool-refuses-symlink-paths, worktree-physical-file-missing); `.claude/settings.json`; cache-symlink reference.

## Locked Frame (Stage 1)
- **Rollback path identified for irreversible steps** — install/uninstall lifecycle reversible; no irreversible repo mutation.
- **Blast radius bounded** — which files/consumers affected; backwards-compat for any interface.
- **No silent security-surface expansion** — escaping-symlink skip is a SECURITY behavior; the package respects it.
- **Irreversible steps gated** — none expected (markdown + manifest).
- **Two-week smell test** — no load-bearing future-self promise; maintenance burden named.
- **Scope drift: design touches files outside contract (adversarial)** — diff Scope Contract vs Design.
- **Cache leaks session memory / secrets (adversarial, R1)** — 77M sessions tree + project memory MUST stay out of the global cache.
- **Hook double-fire corrupts session.json (adversarial, R2)** — both plugin + project-local registering → double env-export + competing session.json upserts.
- **Privacy/data-retention (Coverage Matrix)** — session memory is the sensitive surface; the cache-contents gate is the retention boundary.
- **License/IP** — not-applicable: no new external dependency or borrowed code; MIT, in-house content.
- **Cost/budget** — not-applicable: no paid API/infra; local install only.

## Per-scenario per-check results
- Rollback: YES. `/plugin uninstall` removes cache+data dir; project `.gobbi/` untouched (Uninstall scenario). Reversible.
- Blast radius: YES. The package is additive; the only mutated surfaces are the new package dir + marketplace.json + the new skill + its symlink. DD-8 names the one cross-surface interaction (hooks vs settings.json).
- Security surface: YES, and the escaping-symlink-skip (a SECURITY rule per the docs) is RESPECTED by the materialize decision — the package does not attempt to traverse outside its root. Verified: docs say "Outside the marketplace: the symlink is skipped for security."
- Irreversible steps: none. Confirmed.
- Two-week smell test: MOSTLY YES — the one maintenance burden (drift/sync, F-S1) IS named, not denied. Good. The residual is trigger-specificity (see structure.md F-S1).
- Scope drift: NONE. Design stays within the 4-content package + marketplace + skill. No file outside the contract is touched.
- Cache leaks session memory (R1): RESOLVED. Bounded package (DD-2) + post-install cache-contents gate asserting NO sessions/, NO project memory, NO repo content. This is the privacy/retention boundary and it is explicit. Confidence 100.
- Hook double-fire (R2): RESOLVED as a Planning blocker. DD-8 gives Options A (replace, recommended) / B (coexist, rejected) / C (conditional split) + a REQUIRED fire-exactly-once validation across all 3 registrations. The double-fire consequence (double env-export + competing session.json upserts) is named.
- Privacy: covered by R1 gate. License/IP, Cost: not-applicable (declared).

## Typed findings

### F-R1 — Worktree-write-path mistake-class not surfaced as a build-time risk for the materialize step
- Type: assumption_risk · Domain: process · Disposition: open · Confidence: 25 · Severity: Low
- Evidence: the project's dominant mistake class (subagent/cwd-reset writes straying to the main tree — `subagent-relative-write-paths-stray-cd-doesnt-persist.md`, `executor-cwd-reset-commits-task-to-wrong-branch.md`, `worktree-physical-file-missing-when-checked-out.md`) is directly relevant to DD-2a's "materialize real copies" step (a build/sync script that writes the package). The draft does not flag that the materialization step must write into the worktree, not the main checkout, nor that worktree symlinks may resolve differently than main.
- Why it matters: this is an Execution-time hazard, not an ideation defect, so confidence is low (25) — ideation correctly defers mechanism. But given the project's mistake history, a one-line "the materialize step must respect worktree write-paths" note would pre-empt a known recurrence. Low/25.
- Suggested direction: optionally note the worktree-write-path mistake class as an Execution caution in the skill's gobbi section or the Plan briefing; not an ideation blocker.

### F-R2 — R1 cache-contents gate is the load-bearing privacy boundary and is correctly specified
- Type: general · Domain: privacy · Disposition: addressed · Confidence: 100 · Severity: Low
- Evidence: success criterion line 81-83 ("Post-install cache-contents gate (R1): ... contains ONLY skills/agents/hooks — NO sessions tree, NO project memory, NO repo content [verify: enumerate ...]").
- Why it matters: confirms R1 (the highest-impact iter-1 risk: 77M session memory into global cache) is resolved with a verifiable gate. Preserve.

## iter-1 finding dispositions (Risk-owned)
- **R1 (cache payload / session memory in cache, High/75)** — RESOLVED/addressed by DD-2 bounded package + cache-contents gate. Confidence 100.
- **R2 (hook double-registration, Medium/75)** — RESOLVED/addressed as DD-8 Planning blocker with options A/B/C + fire-exactly-once validation. Confidence 100.

## Per-perspective verdict: PASS
Only Low findings (F-R1 Low/25, F-R2 addressed).

## Low-confidence appendix
- F-R1 (Confidence 25) retained above for visibility given the project's worktree-write-path mistake history.
