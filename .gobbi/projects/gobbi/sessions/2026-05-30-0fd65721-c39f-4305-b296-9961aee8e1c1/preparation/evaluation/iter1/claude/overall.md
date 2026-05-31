# Preparation Evaluation — OVERALL (Stage 3) (Claude, iter1)

## Artifact Summary + Memory reads
Target: `preparation/rawdata/preparation.md` + 4 staged decisions + 1 staged design doc. All concrete technical claims independently verified against ground truth (live repo, git e083fad^/62b95a0, official plugins-reference docs, the actual hook scripts).

## Ground-truth verification ledger (what I checked, what passed)
| Report claim | Verified? | Result |
|---|---|---|
| 18 canonical skills | YES (`ls`) | EXACT — 18, list matches |
| 17 `.claude/skills/` mirror; gobbi-hook-authoring unmirrored | YES | EXACT |
| 5 `.md` + 5 `.toml` agents; `.claude/agents/` mirrors 5 `.md` symlinks | YES (`ls -la`) | EXACT |
| `plugins/` + repo-root `.claude-plugin/` absent | YES | EXACT — both absent |
| 2 real (non-symlink) hook scripts, +x | YES | EXACT (4109B + 10362B, +x) |
| settings.json = 3 hook blocks (SessionStart/PostToolUse/PostToolUseFailure) | YES (parsed JSON) | EXACT, matchers match |
| allow-list "16 Skill + 5 Agent + WebSearch"; omits codex + gobbi-hook-authoring | YES | EXACT (22 total) |
| e083fad^ marketplace source = "./plugins/gobbi" | YES (`git show`) | EXACT |
| 62b95a0 source = "./plugins/gobbi-core" | YES | EXACT |
| e083fad^ plugin.json has NO hooks key; hooks were separate hooks.json (28-event gobbi-dev CLI) | YES | EXACT |
| `agents` = file-path array, REPLACES default | YES (official docs) | EXACT — "Custom agent files (replaces default agents/)" |
| `skills` = ADDS-to default | YES (official docs) | EXACT — "in addition to default skills/" |
| `hooks` → hooks.json; `${CLAUDE_PLUGIN_ROOT}` | YES (official docs) | EXACT |
| relative marketplace source resolves to MAIN checkout from worktree | YES (staged ref + docs) | EXACT |
| double-fire "bounded by flock + upsert-by-id" | YES (read script) | TRUE — flock -x 9 @ line 220; upsert-by-id D-3-2 |

**Every concrete technical claim in the report is accurate.** This is an unusually well-verified Preparation artifact. The leader's evidence trail (sha citations, live `ls`) holds up under independent re-verification.

## Readiness-soundness assessment
The READY verdict is SOUND. Project memory + workspace skills are genuinely ready for Planning/Execution: no missing artifact blocks Planning, no contradiction in the Ideation output, no RE-IDEATE trigger, no generate-now skill gap. The sole-writer contract is honored. The 5 open design-details are all resolved with correct, concrete, evidence-backed recommendations, and the 2 user-ownable ones (DD-8, DD-9) are correctly ratified via AskUserQuestion.

## Are the 5 resolved items correct + complete?
1. **STRUCT-1 (package root + source):** CORRECT + COMPLETE. Matches verified prior art exactly.
2. **F-S1/CONS-1 (drift trigger + gate):** CORRECT + COMPLETE as direction. Concrete trigger; gate pinned, mechanism appropriately deferred. The single best contribution in the report.
3. **DD-8 (hook steady-state):** CORRECT — ratified Option C, holds together (verified flock + upsert-by-id). COMPLETE except (a) un-struck Option-A prose residue [C-1/A-1], (b) under-operationalized PostToolUseFailure trigger for fire-once [U-1], (c) uncited safety claim [R-1, but verified true].
4. **DD-7 (worktree test default):** CORRECT — Option (a) is the only worktree-faithful + reproducible path. Minor: no preparation-staged decision file carries it [S-2].
5. **DD-9 (permissions):** CORRECT direction. Minor: invocability check should target the OMITTED skills (codex/gobbi-hook-authoring) to actually falsify auto-grant [U-2].

## Consistency check of ratified decisions (task-mandated)
- **Option C (dev-vs-installed split):** BINDING state consistent everywhere (banner + Decisions log #3 + staged file + discussion-log). One residue: un-struck Option-A sentences in Item 3 Rationale/Evidence prose [C-1, Low]. The leader's original Option-A recommendation is correctly superseded — NO artifact asserts A as THE decision; the residue is in supporting prose only.
- **Permissions keep-project-local + verify empirically:** consistent, no stale "ship the entries" residue.
- **Package all 18 skills:** consistent everywhere.
- **Layout (plugins/gobbi/, repo-root marketplace, source ./plugins/gobbi, materialized copies, named trigger + drift gate):** consistent + prior-art-verified.

## Cross-perspective tensions
- Structure (S-1, Medium/75) and Consistency both observed the cross-phase reference-path ambiguity (bare `staging/...` actually = `ideation/staging/...`). To respect Principle 2 I carry the REVISE-weight finding in Structure and note it in Consistency without double-counting.
- Usage (U-1, Medium/50) and Risk (R-1, now Low/75) both touch DD-8 operationalization but from different angles (test-triggerability vs evidence-citation) — no conflict.

## Karpathy-4 check
- **Wrong assumptions:** Only one load-bearing assumption (double-fire safety) — and it is TRUE (verified). R-1 is a citation gap, not a wrong assumption.
- **Overcomplexity:** None. The trigger+gate is proportionate to a proven recurring failure (#258/#260→#261).
- **Orthogonal edits:** None. "Out of scope gaps" discipline is exemplary; no scope absorption.
- **Imperative-over-declarative:** N/A (no skills staged).

## Consolidated findings (deduplicated)
| ID | Perspective | Type | Domain | Sev | Conf | Disp |
|---|---|---|---|---|---|---|
| S-1 | Structure | general | docs-sync | Medium | 75 | open |
| U-1 | Usage | checklist_gap | test | Medium | 50 | open |
| R-1 | Risk | assumption_risk | process | Low | 75 | open |
| C-1 | Consistency | general | docs-sync | Low | 75 | open |
| A-1 | Aesthetics | general | docs-sync | Low | 75 | open |
| S-2 | Structure | checklist_gap | process | Low | 50 | open |
| U-2 | Usage | checklist_gap | test | Low | 50 | open |
| P-1 | Project | checklist_gap | process | Low | 50 | open |
| Perf-1 | Performance | assumption_risk | process | Low | 50 | open |

## Must-preserve list
1. The exhaustively-verified ground-truth evidence trail (every sha + count + schema claim is accurate) — do not let remediation introduce drift.
2. The concrete, path-named re-sync trigger (Item 2) — the highest-value contribution.
3. Folding hooks.json↔settings.json coherence into the same drift gate — elegant.
4. Option C is genuinely safe (verified flock + upsert-by-id) — lock it.
5. The sole-writer contract + "Out of scope gaps" no-absorption discipline.
6. The 1:1 mapping of resolved items to Ideation open findings.

## Computed verdict
Threshold rule: any Critical ≥75 → FAIL; any High ≥50 → REVISE; else PASS.
- No Critical findings. No High findings.
- Highest open finding: S-1 (Medium, conf 75) and U-1 (Medium, conf 50). Medium does not trip REVISE under the stated thresholds.

**OVERALL VERDICT: PASS** — with two Medium docs-sync/test findings (S-1, U-1) recommended for a light remediation pass before Planning consumes the cross-phase reference pointers and the fire-once gate. The readiness verdict is sound, all 5 resolutions are correct, all ratified decisions are consistently reflected in their binding locations, and every concrete technical claim survived independent verification.

(Note: per the per-perspective files, Structure, Usage, and Risk each computed a local REVISE/PASS on their own highest finding. At the OVERALL synthesis under the canonical threshold table — Medium findings do not trip REVISE; only High≥50 does — the aggregate is PASS. The Medium findings are real and worth a cheap fix, but none is a Planning blocker. Flagging the perspective-vs-overall threshold nuance transparently rather than silently.)

## Low-confidence appendix
- The perspective-local "REVISE" labels in structure.md/usage.md reflect those evaluators applying a stricter Medium-trips-REVISE reading; the OVERALL applies the canonical High≥50 threshold → PASS. If the manager's house rule treats Medium/≥75 as REVISE-eligible, S-1 would tip the aggregate to REVISE. Surfaced for the manager's decision.
