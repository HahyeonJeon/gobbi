---
type: mistakes
skill: evaluation
description: "Recorded traps for evaluation — load before doing evaluation work"
updated: 2026-07-15
---

# Evaluation — Mistakes

> Load before any evaluation work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Freeze Producer Artifact Before Evaluating

`priority: high` · `domain: verification` · `added: 2026-06-24` · `status: active` · `tags: [verification, evaluation]`

**What happened** — The manager spawned the dual-system evaluators (`eval-claude`, `eval-codex`) on a producer's artifact while the producer teammate was still writing it. A queued, in-flight delta landed a new write (11 to 12 principles) around the same time the evaluators read the file, so the evaluation target changed mid-evaluation. Both Codex Risk and Consistency perspectives independently flagged the moving target, and the eval brief still named the stale version.
**Why it happens** — The manager moved from WORK to EVALUATION without confirming the producer's terminal output and without freezing the artifact. A teammate reports DONE and goes idle, but it remains resumable — a previously-sent delta can still be processed and overwrite the file after the manager has already dispatched evaluators against it.
**How to detect** — You are about to spawn evaluators on a file a teammate produced, AND that teammate is idle-but-resumable, AND you have sent it a delta whose completion you have not individually confirmed. The eval brief pins a version or count the teammate may have since changed.
**Correct approach** — Before spawning evaluators on a producer's artifact: (1) confirm the producer's terminal output is the one on disk — read it, check the version or count; (2) stop sending it deltas; (3) pin the exact version in the eval brief; only then dispatch. If the target changes after dispatch, re-pin and re-evaluate rather than reconciling across versions.
**User feedback** — Evaluators surfaced the problem independently: the eval brief named a stale version, and two Codex perspectives flagged the moving target as a gap. The manager recognized the dispatch ordering was the root cause.

## Claude Evaluator Must Write Per-Perspective Files, Not Return Findings Inline

`priority: high` · `domain: evaluation` · `added: 2026-07-03` · `status: active` · `tags: [evaluation, process]`

**What happened** — During an Execution loop's iter1 dual-system evaluation, the Claude evaluator returned its findings INLINE in its final report text instead of writing the required `sessions/.../3-execution/evaluation/iter1/claude/{perspective}.md` + `overall.md` files to the session record. The manager consumed the inline findings and the loop proceeded on their content, but the session record's per-perspective directory was left incomplete — the files this skill's own procedure requires never landed on disk.
**Why it happens** — An evaluator delegation prompt describes WHAT to evaluate (the seven perspectives + Overall) but if it does not equally emphasize the WRITE CONTRACT (one file per perspective, at a named path, before reporting DONE), a capable agent will naturally summarize its findings back to the caller in prose — that is the easier, more conversational default. Nothing in the manager's collection step forced a check that the files actually existed before treating the evaluation as complete.
**How to detect** — An evaluator's final report contains substantive per-perspective findings in the response text, but `sessions/.../{N}-{loop}/evaluation/iter{n}/{claude,codex}/` is missing one or more of the 9 expected files (7 perspectives + overall.md + the filled checklist.md) for that system. Any time RECORD's Step 6 pre-step (reading every iter/system/perspective file) hits a missing file, the evaluator that skipped writing it is the root cause, not a RECORD-side gap.
**Correct approach** — An evaluator delegation must require, as an explicit deliverable, writing each perspective's findings to `sessions/.../{N}-{loop}/evaluation/iter{n}/{system}/{perspective}.md` plus `overall.md` — never accept inline findings as a substitute. The manager verifies the files landed at the stated paths (`ls` / `test -e` each of the 9 expected paths) before treating the evaluator's turn as complete and before advancing to reconciliation — the same "verify the artifact at the exact path" discipline already required for producer artifacts.

### Related
- [[freeze-producer-artifact-before-evaluating]] — the sibling evaluation-dispatch discipline this trap joins

## Skill-Surface Wording Must Pass Its Own Guard

`priority: medium` · `domain: verification` · `added: 2026-07-05` · `status: active` · `tags: [evaluation, verification, tooling]`

**What happened** — During Ideation, wording was authored to be written into a guard-governed skill-surface file (a `skills/{skill}/mistakes.md` section). The wording quoted its rules-dir and delegation-skill paths as bare backtick path tokens — a bare rules-dir token (twice) and a bare delegation SKILL.md token — that the governing guard `check-skill-mistakes.sh` REJECTS: the guard flags any backtick token containing a slash that looks like a path and requires it to resolve on disk. The trap's own convention is the guard-exempt placeholder form `.gobbi/projects/{project-name}/rules/` and the canonical `skills/delegation/SKILL.md`. So the locked wording and its required guard were mutually exclusive; the executor hit a red gate at Execution and escalated.

**Why it happens** — The Ideation dual-eval added the guard to the Verification plan and confirmed the guard was PRESENT, but neither evaluator RAN the guard against a candidate rendering of the proposed wording. "The guard is in the plan" was verified; "the wording passes the guard" was not. The defect surfaced only at Execution's verify gate — the gate working as designed, but one loop later than it should have.

**How to detect** — You are authoring or evaluating wording that will be WRITTEN INTO a guard-governed file (a `skills/{skill}/mistakes.md` section, or any doc a guard validates), and the wording contains backtick path tokens. If the wording is proposed but the governing guard has not been RUN against a candidate rendering, the guard-conformance is unverified. A guard named in a plan but never executed on the real content is a latent red gate deferred to Execution.

**Correct approach** — (1) When authoring skill-surface wording a guard validates, use the guard-exempt or canonical path forms the surrounding file already uses — for a rules-dir reference the placeholder `.gobbi/projects/{project-name}/rules/`; for a real path, one that resolves on disk. (2) At evaluation, when a finding adds a guard to the verification plan for an edited guard-governed file, RUN that guard on a candidate rendering of the ACTUAL proposed wording — do not stop at "the guard is listed".

## Evaluator Flags User-Approved Removal As Normative Loss

`priority: medium` · `domain: verification` · `added: 2026-07-08` · `status: active` · `tags: [verification, process]`

**What happened** — A base→HEAD no-loss evaluator (checking that Execution did not silently drop content) flagged a section as a "normative loss" finding. The section had in fact been REMOVED deliberately, on the user's explicit instruction during this session's DISCUSSION — not dropped by accident. The evaluator's diff sees only content-present-before / content-absent-after; it has no channel for "the user asked for this."
**Why it happens** — The no-loss check's entire job is to catch SILENT drops, and a base-vs-HEAD diff alone cannot distinguish a silent drop from a deliberate, discussed-and-approved one. Without cross-checking the discussion log, every removal — accidental or requested — looks identical to the evaluator.
**How to detect** — A no-loss / normative-loss finding names content that is (a) entirely absent from HEAD, and (b) recorded in the session's discussion log as content the user asked to remove. That combination is a won't-fix, not an open defect.
**Correct approach** — Before treating a no-loss finding as a defect, cross-check the discussion log for a matching user-requested removal. When the log confirms it, disposition the finding `won't-fix` (user-approved removal) rather than restoring the content. Only escalate if there is a genuine reason to reconsider the removal (e.g., a later user message suggests the removal was not meant to be permanent).

### Related
- [[freeze-producer-artifact-before-evaluating]] — sibling evaluation-target-integrity trap: know exactly what you are diffing against before calling something a loss

## Execution Evaluator Union-Check Must Cover Softened Items

`priority: high` · `domain: process` · `added: 2026-07-14` · `status: active` · `tags: [evaluation, verification]`

**What happened** — In a dual evaluation of a compaction task, one evaluator diffed the full pre-edit
MUST/NEVER rule set against the post-edit doc, correctly found "no hard hazard dropped," and returned
PASS. But it did not check the SOFTENED items for scope narrowing, so it missed that a softened rule
had dropped a special-method breadth condition the hard rule originally named. The independent
evaluator caught it — the dual-system's non-overlapping catch.
**Why it happens** — The evaluator's union-scope verification was scoped to the hard-invariant set
(the obvious risk surface) and treated softened items as lower-risk "just guidance," so it skipped the
same diff on them.
**How to detect** — Any compaction or reframe that both keeps some rules hard and softens others. The
softened set is a scope-loss surface too.
**Correct approach** — An evaluator reviewing a compaction must diff BOTH the hard set AND the
softened set against the pre-edit source, confirming every softened item preserves its source union
scope. Add "every softened item preserves its source union scope" as an explicit compaction-review
check. Reinforces the dual-system value: run both systems; divergence is the signal.

### Related
- [[softening-can-narrow-scope-like-a-merge]] — the producer-side sibling: the same union-narrowing
  failure on the artifact being reviewed

## use-codex-for-shell-dependent-evaluation-proof

`priority: medium` · `domain: process` · `added: 2026-07-11` · `status: active` · `tags: [process, evaluation, verification]`

**What happened** — One evaluation system lacked the shell capability needed to prove exact Git scope, parsed values, inode identity, and file modes.
**Why it happens** — Close reading can review content but cannot prove live repository state or parser behavior. A producer report is still a proxy for those claims.
**How to detect** — An evaluator marks a Git, parse, inode, or mode claim as PASS without live command output, or caps the claim because its runtime cannot execute the required command.
**Correct approach** — Keep the capability limit visible, then obtain fixed-target executable evidence from an independent system that can run the command. Never attribute the executable coverage to the shellless evaluator.

## evaluator-retry-overwrote-canonical-files

`priority: high` · `domain: process` · `added: 2026-07-11` · `status: active` · `tags: [process, evaluation, verification]`

**What happened** — A complete Claude evaluation was retried directly into its populated canonical directory. The retry exhausted its budget after replacing only four perspective files, leaving a mixed canonical set from two attempts.
**Why it happens** — The retry contract treated each output write as independently publishable and had no all-nine completion gate before replacing the prior complete attempt.
**How to detect** — An evaluator retry targets an already populated canonical directory and writes multiple files incrementally, so timeout, capacity, or budget failure can publish only a prefix of the result set.
**Correct approach** — Write every retry to a distinct attempt directory. Validate exactly nine nonempty, structurally complete files (seven perspectives, Overall, and the filled checklist) and a terminal status, then replace the canonical system directory as one coordinated operation. A failed retry leaves the last complete canonical set unchanged.

### Related

- [[iter-artifact-edited-in-place-destroys-snapshot]] — canonical iteration evidence must stay immutable.
- [[evaluator-spawn-without-producer-done-handshake]] — publication begins only after the producer is complete.
