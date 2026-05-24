# Overall — iter2 Claude

## Stage 0 — Artifact Summary
Per-perspective files written. iter2 made 7 surgical fix-decisions (F-1…F-7) against 7 iter1 findings. Five address (F-1 flock, F-2 trailer, F-5 resolver, F-6 input/result split, F-7 correlation key). One introduces a new high-severity regression (F-4 branch naming). One cannot be independently verified (F-3 PostToolUseFailure WebFetch claim).

## Stage 1 — Inheritance Summary

iter1 findings disposition table (re-walked iter2):

| iter1 Finding | Source | iter2 Disposition | Notes |
|---|---|---|---|
| P1 / C1 (invented `loop/` trailer) | claude+codex Project/Consistency | **addressed** | F-2 + whole-file grep confirms canonical `task/{task-id}` form |
| P2 (PostToolUseFailure unverified) | claude Project | **disputed/unverified** | F-3 claims WebFetch confirms; cannot independently verify (network policy blocks `code.claude.com`) — downgraded to assumption_risk |
| P3 (steel-man read-only sessions) | claude Project | **addressed** | iter2 adds explicit paragraph at lines 114–115 |
| P4 (no migration smoke test) | claude Project | **addressed** | T1-I-T1.h adds concrete `jq` post-merge command |
| R1 / COD-STRUCT-002 (lost-update race) | claude Risk + codex Structure | **addressed** | D-3-5 POSIX `flock -x` (refinement R4 noted) |
| R2 (partial-promotion rollback) | claude Risk | **addressed** | T1-I-T1.j + D-3 + F-4-scenario specify `git rm` rollback |
| R3 (Goodhart factor-when-demanded) | claude Risk | **NOT addressed** | Two scripts now have shared inline jq; deferral structurally indefinite |
| R4 (abort-mid-commit scenario) | claude Risk | **NOT addressed** | No E-3.5 scenario added |
| S1 (DRY inline jq) | claude Structure | **NOT addressed** | Hook + reconstructor have duplicated jq |
| S2 (partial deploy safety note) | claude Structure | **NOT addressed** | Acceptable per iter1 Confidence 50 |
| S3 (decimal row 5.5) | claude Structure | **deferred** | Aesthetic decision for Planning |
| A1 (`tool_result` over-claim) | claude Aesthetics | **addressed** | D-3-3 rephrased with WebFetch citation |
| A2 (hyphenation drift) | claude Aesthetics | **NOT addressed** | Persists Low |
| U2 (hook-silence diagnostic) | claude Usage | **NOT addressed** | Recovery via reconstructor but no diagnostic checklist |
| Pf1 (latency budget) | claude Performance | **addressed** | Bounded paragraph at line 426 |
| Pf2 (scale limit > 100 spawns) | claude Performance | **deferred** | Low |
| COD-PROJ-001 (row 5.5 branch precondition) | codex Project | **REGRESSED** | F-4 chose `session/{date}` which violates `git/conventions.md:22` regex — see NEW P1 |
| COD-PROJ-002 (no-issue scenario) | codex Project | **partially addressed** | F-4 attempts to remove issue dependency by using session-id-based name, but the name itself fails the regex |
| COD-STRUCT-001 (resolver underspec) | codex Structure | **addressed** | D-3-3-resolver explicit; `.gobbi/project.json` not-yet-existing flagged as P3 follow-up |
| COD-STRUCT-003 (correlation key) | codex Structure | **addressed** | D-3-6 exact jq paths (verified empirically) |
| COD-AESTH-001 (path-vocab split) | codex Aesthetics | **addressed** | CL-1 reconciliation note |
| COD-AESTH-002 (DQ glossary) | codex Aesthetics | **deferred** | F-9 acceptable |
| COD-CONS (D-3-4 vs T3-I-3 tension) | codex Consistency | **addressed** | F-6 input/result-side language |
| COD-CONS-003 (status extra-property) | codex Consistency | **deferred** | Schema bump backlogged |
| COD-PERF-001/002 (latency + storage) | codex Performance | **addressed** | Bounded paragraph |
| COD-RISK-003 (privacy) | codex Risk | **deferred** | F-9 acceptable |
| COD-RISK-004 (cross-layer drift) | codex Risk | **partially addressed** | No explicit cross-layer gate added but Wrap-up note flags migration boundary |
| COD-USAGE-001/002 (path-surface + resolver) | codex Usage | **addressed** | CL-1 + D-3-3-resolver |
| COD-USAGE-003 (denominator) | codex Usage | **addressed** | Line 64 |
| COD-USAGE-004 (header migration) | codex Usage | **addressed** | T3-I-T3.e migration paragraph |
| COD-OVERALL-001 (resolver+concurrency) | codex Overall | **addressed** | D-3-5 + D-3-3-resolver |
| COD-OVERALL-003 (denominator) | codex Overall | **addressed** | Line 64 |
| COD-OVERALL-004 (DQ index) | codex Overall | **deferred** | F-9 acceptable |

NEW iter2 findings (regressions or surfaced-by-deeper-walk):

| ID | Severity | Confidence | Type |
|---|---|---|---|
| P1 (project) — F-4 branch-name violates regex | **Critical** | 100 | design_flaw |
| C1 (consistency, mirrors P1) | **Critical** | 100 | design_flaw |
| R5 (risk, mirrors P1 — defeats T1 success) | **High** | 100 | design_flaw |
| P2 (project) — F-3 unverified WebFetch | **High** | 50 | assumption_risk |
| P3 (project) — `.gobbi/project.json` not-existing | Medium | 75 | assumption_risk |
| S1 (structure) — flock+mv inode-replacement | Medium | 50 | design_flaw |
| R4 (risk, mirrors S1) | Medium | 50 | design_flaw |
| U3 (usage) — hook-silence diagnostic missing | Medium | 50 | scenario_gap |

## Stage 3 — Karpathy 4-mode check

The 4 Karpathy failure modes for iter2 work:

### 1. Wrong assumptions (carried forward without re-verification)
**FAIL.** F-3 carries the assumption that `PostToolUseFailure` is officially documented; the leader cites a WebFetch but no verbatim artifact is preserved. The staged OFFICIAL reference still does not contain `PostToolUseFailure`. The carry-forward "PostToolUseFailure officially supported" is now THE basis for D-3-3 + Decisions Locked + T3-E-5 + T3-I-T3.c. **This is exactly the failure pattern of `mistakes/leader-iter2-verification-claim-without-evidence.md`.**

### 2. Over-complexity (fix introduces more surface than the original problem)
**PASS.** F-1's flock primitive is one line per script (small). F-2 is a text substitution. F-5 resolver is a 3-step algorithm (moderate, justified by the COD-STRUCT-001 finding). F-6 is a paragraph clarification. F-7 is exact jq paths. F-4 is a branch-name choice (would be small if correct). No over-engineering.

### 3. Orthogonal edits (fix for finding X breaks something else)
**FAIL.** F-4 (branch naming) is the canonical orthogonal-edit regression. It was introduced to address COD-PROJ-001 (branch-naming precondition gap). The chosen value (`session/{date}-{ssid-short}`) violates the existing branch-naming regex at `git/conventions.md:22`. Fixing one citation-discipline failure (F-2 trailer) introduced a new one (F-4 branch prefix). This is Karpathy mode 3 explicitly.

### 4. Imperative over declarative (fix prescribes mechanism where directional design was correct)
**PASS.** Each fix-decision stays at the directional Ideation level (flock primitive named; resolver algorithm sketched; correlation key path sketched; rollback semantics stated). No implementation-level escape into Ideation. Detailed mechanism still deferred to Execution.

**Karpathy verdict**: 2 of 4 modes triggered (modes 1 and 3 — wrong-assumption + orthogonal-edit). This is unusual for iter2; it suggests the leader did not run a final cross-perspective whole-file verification before declaring iter2 complete.

## Cross-perspective tensions

| Tension | Perspectives | Resolution |
|---|---|---|
| F-3 verification artifact | Project (P2) + Aesthetics (A1 in iter1) | Both lenses see the lack of verbatim quote; verdict aligned |
| F-4 branch naming | Project (P1) + Consistency (C1) + Risk (R5) | All three converge — F-4 fails the regex; this is a CRITICAL convergent finding |
| D-3-5 flock semantics | Structure (S1) + Risk (R4) | Refinement (sidecar lock) recommended but not blocker |

## Must-preserve list

Things iter2 got right that remediation must not break:

1. **F-2 (trailer fix)** — The whole-file grep + 6-occurrence audit + canonical citation is the model behavior. Preserve.
2. **D-3-5 (flock serialization)** — Closes the iter1 R1 / COD-STRUCT-002 race; the primary lost-update window is gone (the inode-replacement refinement R4 is a follow-up, not a redo).
3. **D-3-3-resolver** — Explicit precedence + fallback + negative-case exit + sessions-scan. The `.gobbi/project.json` not-existing caveat (P3) is graceful, not blocking.
4. **D-3-6 (correlation key)** — Exact jq paths for tool_use + tool_result lines; empirically verified against transcript line 165.
5. **F-6 (input/result-side disambiguation)** — Resolves the COD-CONS tension cleanly with explicit two-paragraph explanation.
6. **T1-I-T1.j (partial-promotion rollback)** — Closes iter1 R2 with explicit `git rm` rollback + AskUserQuestion.
7. **T1-I-T1.i (delegation grep audit)** — Closes iter1 C2 by extending the qualified-rule cross-skill check.
8. **CL-1 (path-vocabulary reconciliation)** — Closes COD-AESTH-001 / COD-USAGE-001 cleanly with explicit Claude/Codex/plugin surface explanation.
9. **Inline iter2 flag consistency** — 19 "UPDATED iter2 — finding N" / "NEW iter2 — finding N" inline flags all findable; preserves audit trail.
10. **Scope Contract preservation** — iter2 did NOT reopen the user-locked Scope Contract; all fixes stayed at the Implementation Checklist + Design level.

## Aggregate verdict

**FAIL** — Convergent Critical at Confidence 100 across 3 perspectives (Project P1, Consistency C1, Risk R5): F-4's branch name `session/{date}-{ssid-short}` violates the `git/conventions.md:22` shape-check regex. The `session/` prefix is not in the 11-prefix type registry. T1's row 5.5 will fail on first invocation of git P2. This is a recurrence of the iter1 P1/C1 citation-discipline pattern (cited mistake: `leader-iter2-verification-claim-without-evidence.md`).

Per `evaluation/SKILL.md` verdict thresholds: any Critical at confidence ≥ 75 → FAIL.

**Top 3 highest-severity NEW iter2 findings**:

1. **P1/C1/R5 (convergent)** — F-4 branch name violates branch-naming regex (Critical, Confidence 100). Pick a registry-compliant prefix (e.g., `chore/session-{date}-{ssid-short}`) OR surface an explicit "extend conventions.md type registry" CP for user lock.
2. **P2 (project)** — F-3's WebFetch verification of `PostToolUseFailure` cannot be independently re-verified (network policy + no verbatim artifact). Preserve a verbatim quote in the staged OFFICIAL reference OR add a PostToolUse-only fallback design.
3. **P3 (project)** — D-3-3-resolver's step (i) reads `.gobbi/project.json` which does not exist today. Step (ii) covers the active path, so not blocking; flag the dormant precondition explicitly.

**Recommendation for iter3**: surgical 3-finding fix — re-pick branch name (no new design surface), preserve a verbatim quote for PostToolUseFailure, flag the project.json precondition. iter3 should converge in one round if the fixes are narrow.
