# Planning iter2 — Usage perspective evaluation

Scope: Can a fresh executor execute the iter2 plan without context bridging? Did Fix 1/3 close iter1's load-bearing usage gaps?

## Verdict: PASS

## iter1 Usage findings — disposition transitions

| iter1 ID | Severity | iter2 disposition | Evidence |
|---|---|---|---|
| F-USAGE-1 (Claude — Cited mistake `stub-redirect-format.md` does NOT exist in `mistakes/`) | **High** | **addressed** | iter2 Task 09 row (line 460) removes citation entirely. § Decisions row 13 documents the removal with empirical evidence: "`ls .gobbi/projects/gobbi/mistakes/stub-redirect-format.md` → No such file or directory". **My own empirical re-check**: `ls .gobbi/projects/gobbi/mistakes/stub-redirect-format.md` → exit 2 (confirmed not present); `ls .gobbi/projects/gobbi/rules/stub-redirect-format.md` → 4295-byte file (rules location confirmed). iter2 evidence valid. |
| F-USAGE-2 (Claude — Symlink-restore command WRONG `../` prefix) | **High** | **addressed** | iter2 § Execution intake notes (line 520) + § Agent assignment table edit-contract brief note (line 447) both use `../../../`. **My own empirical re-check**: `ls -la .claude/skills/orchestration/SKILL.md` → `... -> ../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (3-dot confirmed). iter2 evidence valid. Depth disclaimer also includes `../../../../` for sub-directory paths. |
| F-USAGE-3 (Claude — Heavy D-3-3/D-4/D-5/D-9 reference codes without inline expansion) | Medium | **open** (not addressed) | iter2 5-fix scope did not address. Same references at lines 272 (D-3-3-resolver step ii), 297 (D-5), 287 (D-9 implicit via header comments), 458 (D-4). |

## Stage 1/2 scenarios

| Scenario | Result |
|---|---|
| S-U1 — Fresh executor brief for Task 09 is self-sufficient | PASS — Task 09 row (line 460) is now clean: tier-4 mistakes column = procedural mistake only; brief notes explain WHY stub-redirect-format was removed (Fix 3 explanation included for executor context). |
| S-U2 — Symlink-restore recipe is runnable as-is | PASS — `rm -f .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>` works for SKILL.md-depth paths (my empirical witness). Depth disclaimer + `ls -la` verification fallback covers other depths. |
| S-U3 — `bash -n` / conditional `shellcheck` is runnable | PASS — `bash -n` is universally available; conditional `shellcheck` includes the fallback path. iter2 leader empirically verified `command -v shellcheck` is absent and instructed commit-body note. |
| S-U4 — Task 03 rollback command runnable | PASS — `git -C "$worktreePath" rm <copied-paths>` is standard git; `<copied-paths>` is template placeholder per Self-review line 596 clarification. AskUserQuestion is a standard tool. |
| S-U5 — D-3-3/D-4/D-5/D-9 reference codes still inline-expansion-deferred | PARTIAL (carry from F-USAGE-3) — Tier-3 + Tier-4 Load Directives still require executor to hold Preparation iter3 doc context. |
| S-U6 — Adversarial: any executor brief now under-specified? | PASS — Task 03 brief (line 455) now MORE-specified (cites Ideation:283 verbatim, full rollback prose); Task 07+08 brief (line 459) now MORE-specified (Fix 5 conditional shellcheck note); Task 09 brief (line 460) now CORRECTLY-specified (no spurious stub-redirect citation). Net usability improvement. |

## NEW iter2 findings

None. iter2 closes 2 of 2 iter1 High findings on this perspective with empirical evidence that I independently re-verified.

## Karpathy mode-3 check

- Fix 3 (citation removal) could theoretically leave Task 09 under-specified. iter2 mitigates by explaining the removal inline ("Task 09's discipline is enforced by `jq . .claude/settings.json` post-edit verify gate") — actually the per-task brief now flags the JSON-validity gate explicitly. No degradation; small clarity improvement.
- Fix 1 (depth fix) could theoretically over-specify (5-line bullet) — see Aesthetics F2-AESTH-1.
- Fix 4 expansion adds Task 03 verifies bar; verifies are runnable (greps), not over-specifying.

## Must-preserve list

- The empirical-witness language in iter2's Fix 1 explanation (`ls -la .claude/skills/orchestration/SKILL.md` cite). Future iters touching symlink layer should reproduce this discipline.
- The "removed-and-explained" pattern for Fix 3 (Task 09 brief notes why the citation was removed, not just that it was).
- The conditional-tool pattern (Fix 5) — could become a project rule.

## Verdict rationale

Both iter1 High findings on Usage are `addressed` with valid empirical evidence (independently verified by me). F-USAGE-3 carries Medium but is not in iter2 scope. **PASS**.

VERDICT: PASS
