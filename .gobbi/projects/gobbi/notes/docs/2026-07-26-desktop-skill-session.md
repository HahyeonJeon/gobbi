---
name: desktop-skill-session
description: Built the 14-file desktop skill (Electron + TypeScript) across a full Gobbi run; complete and correct but unwired in both runtimes
type: notes
scope: project
feature: null
status: active
created: 2026-07-26
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [docs, process]
keywords: [desktop, electron, typescript, skill-writing, cold-use-test, single-owner, verification]
author: claude
steps_completed: [configuration, ideation, planning, execution]
shipped: true
---

# Building the `desktop` skill — session handoff

Written to tracked memory rather than the session tree, because `.gitignore:21` excludes
`.gobbi/projects/*/sessions/` and everything under it dies with the worktree.

## Where to pick up

**Branch:** `claude-2026-07-25-bb2794ce-bc3d-422a-b011-f8b4750c6eed`, off `develop` at `6f3066c1`.
**Worktree:** `.gobbi/projects/gobbi/worktrees/claude-2026-07-25-bb2794ce-bc3d-422a-b011-f8b4750c6eed`
**HEAD:** `1beaac73` · **24 commits** · tree clean · **nothing pushed, no pull request opened.**
**Session record:** `<worktree>/.gobbi/projects/gobbi/sessions/2026-07-25-bb2794ce-.../` — gitignored, so
read it before the worktree is removed.

## What shipped

Fourteen files at `.gobbi/projects/gobbi/skills/desktop/`, **5,969 lines**.

| File | Role |
|---|---|
| `SKILL.md` (1,088) | Sole policy owner: 30 rules, 11 prohibitions, 4 protected floors, 10 phases, 8 gates |
| `fidelity-ladder.md` (259) | Nine generic design rungs; hoistable — no policy identifiers, no paths |
| `runtime-deltas.md` (~180) | Sole owner of every version literal and per-OS divergence |
| `ideation.md` (452) | The per-run decision tree; the family's real router |
| 7 mechanics children | Privilege boundary, security, lifecycle, native integration, local data, packaging, signing |
| `scenarios.md` (1,161) · `checklists.md` (757) · `evaluation.md` (323) | 63 cases, 46 checks, the crosswalk |

**Independently proved**, not asserted: the four protected floors diffed member-by-member against their
generic parent with **no narrowing**; the rung-closing predicate rejecting four counterexamples and
**accepting** the sanctioned re-entry case non-vacuously; the trace closing at **79 edges across five
surfaces** with zero orphans in both directions, proved at both ends with planted fixtures.

## What did NOT ship — three separate facts, do not fold them together

**1. The skill has no discovery path in either runtime.** `.claude/skills/desktop` and
`.agents/skills/desktop` do not exist. `scripts/sync-plugin-package.sh` fail-closes on a **pre-existing**
package-version mismatch: Codex manifest `0.5.3`, Claude manifest `0.5.3`, Claude marketplace `0.5.4`.
History shows `2aa5f5a7` bumped manifest and marketplace to `0.5.4` together, then `dc5fd3c4`
("docs(memory): close workflow redesign session") reverted **only the manifest** — an accidental partial
revert. **The user ruled versions out of scope for this session.** Fix is one line in either direction and it
is a release decision. Wiring steps W1 and W3 are unrun.

**2. Neither cold-load record exists.** The authoring standard requires one per target runtime and defines
**no waiver path**. The `codex` leg is an **override** — two peer invocations returned zero-byte responses
from service-side capacity errors, so it is unobtainable rather than skipped. The `claude-code` leg was never
attempted, because a cold load through a runtime entrypoint is impossible while the mirrors are absent. The
override record at `3-execution/task-15-wiring/outputs/codex-cold-load-override.md` originally claimed the
`claude-code` record was produced; **that was false and is corrected in place with the error recorded.**

**3. The authoring standard's P6 bundle: coverage CLOSED, acceptance NOT GRANTED.** Five items are
`recorded-open`. Nothing should be read as "P6 passed."

## Workflow deviations — all user decisions

- **Codex waived session-wide** after two empty peer responses. Recorded as a deliberate override of the
  narrow-waiver rule, which the schema cannot express (a waiver is keyed to one system, step and iteration).
- **Ideation cap raised 3 → 4** for a bounded fix round.
- **Planning EVALUATION skipped entirely.**
- **Per-task Execution EVALUATION dropped**, with two adversarial passes retained.

Consequence: only **three** independent reads happened all session — an adversarial proof of the floors and
predicates, a two-ended proof of the trace and family consistency, and a cold-use test.

## The finding that matters most

The skill passed every mechanical gate and three verification passes. Then a fresh agent tried to **use** it
cold on a real scenario — a three-platform menu-bar notes app — and could not plan the central requirement.
`native-integration.md`'s own header claimed ownership of *tray* and *dock* and the family contained neither.
The Procedure routed to 2 of 13 children. `P1` never pointed at the decision tree that `ideation.md` says is
loaded at `P1`, so following the entry document literally skipped it.

**None of those are checkable.** There is no gate for "a document honours its own ownership line." All four
were fixed; the lesson is that **verification and use test different things**, and passing every gate says
nothing about whether an artifact works.

The same reader listed **fourteen things it would have gotten wrong** working from general knowledge —
notably the migration *downgrade* path, which it called the one it would have shipped broken.

## Open items for the next session, ranked

1. **The relation test has no runnable implementation in the repository.** `evaluation.md` specifies it
   precisely; both agents who ran one built it in `/tmp`, now gone. The triad's central claim is specified
   but not executable. Small, well-specified work.
2. **Version reconciliation**, then W1/W3, then both cold-load records. Unblocks discovery in both runtimes.
3. **Hoist `fidelity-ladder.md` into `ui`/`ux`.** A known residual ships with it: a non-token altitude leak
   passes every remaining gate, because the reviewed semantic check was deleted for being unsound in both
   readings. The hoist session's first obligation.
4. **Outbound drag-and-drop has no check** — deliberately scoped out to avoid re-conjoining claims.
5. **`gobbi/SKILL.md`'s "every non-floor skill is indexed once" is false** — `desktop`'s row was added, ten
   peers remain absent, and the base needs reconciling (27 top-level dirs vs 31 `SKILL.md` files).
6. **`agents/evaluator.md:37,39`** point at a `§ Finding Metadata` section of `evaluation/SKILL.md` that does
   not exist, calling it the single source of truth. Every evaluator dispatched through that path is pointed
   at nothing.
7. **`state.json.lastVerdict` is a trailing field** — it showed `FAIL` beside `iteration=3` while that FAIL
   belonged to iteration 2, and a fresh evaluator read them as a pair and blocked partly on it.
8. **The record placement contract has no home for step-level working evidence** spanning iterations.
9. **Reduced-motion API-absence stated at three sites** — latent, because there is no owner row to point at
   and no announced expiry. The fix is a design decision about where API-surface facts are owned.
10. **`DESK-CHECK-17`'s field enumerates two conditions while its Pass carries four legs** — a coverage
    question on a protected item, not a count fix.

## Mistake candidates — 19, none promoted

Seven staged at `1-ideation/staging/decisions/`; twelve written up at
`4-wrap-up/working/iteration-1/research/execution-mistake-candidates.md`. **Both locations are gitignored.**
Routing is Always-Ask and was never run. Two candidates have no valid area in the vocabulary (their only tag
is not an area for their type), and one `related:` target does not exist in the tree.

The three most transferable:

- **A restatement is a defect only when the sentence characterises the state of a *versioned row*.** Naming an
  *unversioned per-OS divergence* is the sanctioned form. Twelve absence-claim candidates resolved as twelve
  false positives under this test where a description-based sweep would have produced twelve arguments.
- **A guard's own fixture suite passing is not evidence the guard passes on the real repository.** The sync
  test suite exits zero *while proving* that source topology rejects marketplace drift — and that drift is
  live here.
- **Pointing at a single-owner value protects against a stale value, not a stale characterisation of it.**
  Pure-pointer sentences self-heal when the owner is corrected; restatements rot silently.

## Manager errors, recorded because they recurred

**Seven scan-form mismatches.** Seven times a scan returned zero or a wrong count against an artifact that was
correct. Three separate agents' counts were right where mine were wrong. Writing the subject-versus-scan-unit
rule down mid-session did **not** stop it recurring four more times. What the subagents did differently:
their extractors parse structure and compare two independently-derived sets, and each was proved against a
planted fixture before being cited.

**Three unverified propagations.** A non-existent "nine-output contract" carried from a study report into two
artifacts; a `skeleton`-vocabulary premise the tree refutes, amplified to the user as the session's best
finding; and three version rows written from recollection, two of which were factually wrong by a whole major
— in the file that is the family's sole owner of version literals.

**Eight crossed reads.** Reading a working tree while an agent holds the write lock returns whichever half of
the operation has landed. Two agents refused to act on a manager read that contradicted disk and were right
both times; I nearly made the reciprocal error and edited a file mid-write.

## Related

- [[project_desktop_skill]]
- [[feedback_askuserquestion_for_decisions]]
- [[feedback_skill_structure]]
