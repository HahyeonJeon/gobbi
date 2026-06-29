---
type: mistakes
skill: mistake
description: "Recorded traps for mistake — load before doing mistake work"
updated: 2026-06-27
---

# Mistake — Mistakes

> Load before any mistake work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Recorded Mistakes Recurred Recording Is Not Enforcement

`priority: high` · `domain: process` · `added: 2026-06-26` · `status: active` · `tags: [assumption, process, verification]`

**What happened** — Two mistakes already recorded in `mistakes/` both re-triggered in one session despite being loadable at session start: `executor-wrote-to-main-tree-not-worktree` recurred (the executor edited main-tree skill copies instead of the worktree copies), and `executor-git-stash-in-worktree-during-verify` recurred (a verify gate was authored with `git stash` inside the worktree). Downstream gates caught both, but the recordings did not stop them happening.
**Why it happens** — The implicit assumption "a recorded, loadable mistake will not recur" is false. A recorded mistake is a passive document an agent may skim or skip, and it describes the trap in the surface where it was first seen, not the new surface where it reappears. Loading raises awareness of the trap-as-described; it installs no checkpoint at the moment of the wrong action.
**How to detect** — The same mistake class shows up in a session whose Load Directives DID include the mistakes — the signal that "load the mistake" alone is insufficient. A brief that says "load the mistake skill" but does not inline the EXACT forbidden command or a concrete pre-action assertion for the specific traps the task can hit.
**Correct approach** — Do not rely on "the agent will load and remember." For the specific traps a task can hit, the delegation brief MUST cue them actively: (1) inline the exact forbidden command (literally "never write `git stash` in any command"; "every write path MUST contain `worktrees/{branch}/`"), and (2) require a pre-edit path/command assertion as a concrete step. Treat the recorded mistake as the source of the cue, and the brief as the place the cue is made enforceable.

## Staging a Mistake-Candidate Does Not Fix the Artifact

`priority: high` · `domain: process` · `added: 2026-06-14` · `status: active` · `tags: [process]`

**What happened** — In iter1 the leader staged a mistake-candidate correctly identifying that a grep-backed absence claim must use an exact pattern, but did NOT also correct the false claim already written in the artifact — the draft still stated "grep confirms zero hits" with the imprecise pattern. The dual-system evaluation then returned REVISE because the underlying defect in the artifact was still present, even though the mistake-candidate existed and was well-formed.
**Why it happens** — The agent treated staging a mistake-candidate as a complete response to the defect. The candidate records what went wrong for future sessions; it does NOT retroactively fix the current artifact. These are two separate actions — stage the candidate AND correct the artifact. The mistaken assumption: "I staged the mistake, so the issue is handled."
**How to detect** — You have just written a mistake-candidate that describes a specific flaw, and that flaw is in the current iteration's working draft — the draft still contains it. Secondary signal: during RECORD you review the staging directory and a candidate there describes a flaw that will ship in the outputs artifact; that means WORK was incomplete.
**Correct approach** — When you detect a defect during WORK that warrants a mistake-candidate: (1) stage the candidate immediately, AND (2) correct the artifact in the same WORK pass. Both are required — the candidate is the memory, the artifact correction is the deliverable. Omitting step 2 produces a session where the mistake is documented but the evaluation still fails because the artifact is wrong.

### Related
- [`../evaluation/SKILL.md`](../evaluation/SKILL.md) — the mistake-staging act spans evaluation remediation: a staged candidate is not a fix, so the artifact must still pass EVALUATION
