# Risk (iter9, claude)

## Artifact Summary + Memory reads (Stage 0)

iter9 closes the highest-risk bug-seed class that iter5-8 had not yet addressed at the contract level: the evaluator's Stage 0 step 3 directs the agent to "Load the matching phase child doc: `preparation/evaluation.md`" — if that file is missing, a Preparation-phase evaluation would crash at the load attempt OR (worse) silently skip Stage 1 frame-build and produce an underspecified evaluation. iter9 creates the file AND ensures all 22 sibling contract surfaces enumerate `preparation` so no consumer (manager, assistant, evaluator, delegation template) can be misrouted.

**Memory reads**: as project.md; explicit focus on bug-seed analysis (which surfaces, what failure mode if absent, what rollback path).

## Locked Frame (Stage 1)

Seeds carried from iter8: three bug-seed classes (wrong-route / runtime-stamping / MEMORIZATION-stamping) were closed at the 6-step contract level. iter9 adds: **a fourth bug-seed class — phase-child-doc-load-failure — is closed by creating the file AND by the 22-site sweep ensuring every consumer's enum agrees on `preparation`**.

Adversarial scenario: **Staged skill slugs will not collide with existing project skills on Wrap-up promotion** (recursively applied: does the new `skills/preparation/evaluation.md` path collide with any existing project memory or sibling skill child?). Answer: no — the file is at `skills/preparation/evaluation.md`, a path the evaluation/SKILL.md contract specifically references and no other file occupies.

Checklist:
- [x] Bug-seed class 4 (phase-child-doc-load-failure) closed: file exists at the contracted load path
- [x] Rollback path trivial: 22-site sweep + 1 new file deletion would revert; no schema migration; no destructive changes
- [x] No collateral damage to .claude/CLAUDE.md, .codex/*, packages/cli/src/specs/*.json (out-of-scope) — VERIFIED via iter9 fix list enumeration
- [x] No `loop ∈ {ideation, planning, execution}` sole-writer invariant violation — iter9 only edits skills + agents + creates one new skill child doc; no project-memory writes touched
- [x] Blast radius bounded: all changes are in `.gobbi/projects/gobbi/skills/` + `.gobbi/projects/gobbi/agents/` — no upstream consumer of these paths outside the gobbi project
- [x] Security surface delta = none (text-only docs)
- [x] Two-week smell test: a maintainer returning in two weeks sees a clean 5-loop enum across every consumer surface + a proper Preparation phase child doc
- [x] F-P-01 / F-P-03 / F-R-06 stuck closures remain intact (Wrap-up sole-writer + v0.4→v0.5 retirement + dual-stance + manager misroute) — VERIFIED via direct grep of canonical surfaces

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| Phase-child-doc-load bug-seed closed | File exists at contracted path | PASS | file resolves; 329 lines |
| Rollback path | Trivial text revert | PASS | no destructive operation |
| Sole-writer invariant preserved | No project-memory writes during loop MEMORIZATION | PASS | iter9 edits skills + agents only |
| Blast radius bounded | All changes inside `.gobbi/projects/gobbi/skills/` + `agents/` | PASS | iter9 fix list enumeration |
| Adversarial path-collision | preparation/evaluation.md does not overwrite any existing project skill | PASS | path was previously missing |
| Stuck closures intact (4-iter cumulative) | F-P-01, F-P-03, F-R-06 retirements remain closed | PASS | direct grep verification |

## Typed findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence |
|---|---|---|---|---|---|---|
| F-R-01 / F-R-02 / F-R-03 (carry from iter5) | `general` | `process` | **open (carry, deferred)** | 50 | Low | pre-existing low-severity items not in iter9 scope |
| F-R-iter5-NEW-01 (re-dispatch cap in delegation) | `general` | `process` | **open (carry, deferred)** | 50 | Low | filed as small follow-up |
| F-R-iter9-NEW-01 | `general` | `process` | **addressed (this iter)** | 100 | n/a | iter9 closes bug-seed class 4 (phase-child-doc-load-failure) by creating the file AND making all 22 consumer surfaces agree on the `preparation` enum value |

No NEW open Risk finding. iter8's three identified bug-seed classes (wrong-route / runtime-stamping / MEMORIZATION-stamping) remain closed; the fourth class is now closed in iter9.

## Verdict

**PASS — TRULY-FINAL (closing).** No Critical ≥ 75; no High ≥ 50. All four bug-seed classes now closed at the contract level. F-S-04 remains disputed per #258. Rollback trivial; blast radius bounded; no collateral damage. The two-week smell test passes (a maintainer returning in two weeks finds a clean 5-loop / 6-step contract surface across every consumer).

## Low-confidence appendix

None.
