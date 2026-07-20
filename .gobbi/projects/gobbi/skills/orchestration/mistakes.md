---
type: mistakes
skill: orchestration
description: "Recorded traps for Gobbi delegation dispatch — load before manager dispatch work"
updated: 2026-07-20
---

# Orchestration Delegation — Mistakes

> Load before any Gobbi manager dispatch work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Delegation Briefs Reference Nonexistent Rules Dir

`priority: medium` · `domain: process` · `added: 2026-06-24` · `status: active` · `tags: [process]`

**What happened** — The manager's delegation prompts for the Preparation evaluators carried a Load Directives block that said "all files under `.gobbi/projects/{project-name}/rules/`". Both the iter1 and iter2 evaluators (Claude and Codex) flagged that this directory does not exist in this project; the real project rules live in `skills/memory/rules.md` (the memory standard) plus in-skill rule sections. Agents that follow the directive find nothing, load nothing, and proceed without project rules — and the brief surfaces no error, because a missing directory produces no output rather than an explicit failure.
**Why it happens** — The Load Directives template likely originated from a project that had a populated rules directory, or from a future-state expectation that one would be created, and was carried forward without verifying the path exists for this project. The error is silent: agents get a "no files" result and continue.
**How to detect** — A Load Directives block references a path with a glob like "all files under `.gobbi/projects/{project-name}/rules/`", AND that directory does not exist on disk (verify with `ls` or `find`). If both are true, the brief is sending agents to read from a nonexistent source and they load nothing without erroring.
**Correct approach** — Before issuing a brief that references a rules or memory directory, confirm the path exists (`ls .gobbi/projects/{project-name}/rules/` or `find`). If it does not exist, apply the empty-state read contract in [`skills/memory/rules.md` § Empty-state contract](../memory/rules.md). The shared assignment skeleton in `skills/orchestration/delegation.md` carries this ordered load directive for every role. A brief resolves to `RULES_PRESENT` or `NO_PROJECT_RULES`; it never silently reads nothing or invents a role-specific fallback.

## Subagents Skip Load Directives No Enforcement

`priority: high` · `domain: process` · `added: 2026-06-25` · `status: active` · `tags: [process, verification]`

**What happened** — Two of four Execution executors omitted a required Load-Directives skill from their structured `SKILLS LOADED` reports: one omitted `skills/principles/SKILL.md` (the behavioral floor), and another omitted `skills/execution/SKILL.md` (its own procedure skill). Both outputs looked complete, so accepting the reports without checking the required path set would have hidden the skipped foundation.
**Why it happens** — Two causes compound. (1) A fresh specialist does not inherit the manager's loaded skills; "load the principles skill" is ambiguous unless the brief says to read the exact file. (2) Load directives are only enforceable when the specialist reports the exact paths and the manager compares that report with the assignment before accepting the artifact.
**How to detect** — Compare the report's structured `SKILLS LOADED` list with every ordered path in the assignment. A missing path is a load-contract failure. A mismatched runtime identity, stable assignment, or promised artifact is the same accept-time signal that the report cannot be trusted as completion proof.
**Correct approach** — Tell every fresh specialist to read the exact files in order before acting. Require a structured `SKILLS LOADED` list of those exact paths. Before acceptance, the manager compares the list with the brief, confirms runtime identity and stable assignment, rereads the promised artifact or commit, and reproduces its verification. Re-dispatch on any missing path or identity/evidence mismatch.
**User feedback** — The user explicitly asked that this be captured as a durable mistake: a subagent that skips its principles floor produces work that looks done but was built without the discipline the floor guarantees, and that gap repeats across every future delegation until the briefing and verification change.

## Use Runtime Skill Surface In Load Directives

`priority: high` · `domain: process` · `added: 2026-07-06` · `status: active` · `tags: [process, codex, verification]`

**Reversed 2026-07-08** — Prior guidance mandated `.agents/skills` as the load path for native Codex and treated a `.gobbi/…` citation as the mistake. That guidance is superseded by the `.gobbi` SSOT decision in `skills/orchestration/delegation.md` (§ Skill-load path SSOT): the canonical source `.gobbi/projects/gobbi/skills/` is the single skill-load path for BOTH runtimes, and `.agents/skills` stays the Codex *discovery* symlink — never a load-path citation. The trap's SUBJECT is unchanged — naming the WRONG skill-load surface in a delegation prompt is still a trap — only the correct answer flipped: the surface that used to be "required" (`.agents/skills`) is now the WRONG one to cite as a load path.

**What happened** — A delegation prompt told a subagent to load mandatory skills from a per-runtime discovery surface — `.agents/skills/<skill>/SKILL.md` on native Codex, or `.claude/skills/<skill>/SKILL.md` on Claude Code — instead of the canonical source `.gobbi/projects/gobbi/skills/<skill>/SKILL.md`, which is the single skill-load path for BOTH runtimes. Native Codex reads the real canonical files directly, so a `.gobbi/…` citation is always resolvable; naming the runtime symlink surface as the load path is the drift.
**Why it happens** — The canonical source and the per-runtime symlink surfaces (`.agents/skills`, `.claude/skills`) point at the same files, so it is tempting to cite whichever surface matches the current runtime. But a per-runtime citation forks the load contract by runtime and re-introduces the discovery symlink as a load path; the SSOT is one path for both runtimes, so the load-path citation must not vary by runtime.
**How to detect** — A delegation prompt's Load Directives block names a per-runtime surface (`.agents/skills/<skill>/SKILL.md` or `.claude/skills/<skill>/SKILL.md`) for mandatory skill loading instead of `.gobbi/projects/gobbi/skills/<skill>/SKILL.md`. Any runtime-specific skill-load path in a brief is the signal.
**Correct approach** — Cite `.gobbi/projects/gobbi/skills/<skill>/SKILL.md` for every mandatory skill load, for BOTH runtimes, paired with `.gobbi/projects/gobbi/skills/<skill>/mistakes.md` when the companion exists. Do NOT name a per-runtime surface (`.agents/skills` / `.claude/skills`) as the load path — those stay discovery / entry-point surfaces only. Keep project mistakes under `.gobbi/projects/gobbi/mistakes/...`; those are durable memory records, not skill-load surfaces.

### Related
- [[delegation-briefs-reference-nonexistent-rules-dir]] — delegation prompts must cite loadable paths for this repo.
- [[subagents-skip-load-directives-no-enforcement]] — exact load paths are part of the load-compliance audit.

## Skill Prose Template Drift

`priority: high` · `domain: docs-sync` · `added: 2026-07-08` · `status: active` · `tags: [docs-sync, process]`

**What happened** — Dual-system review found required assignment fields stated in delegation policy but absent from the shared delegation skeleton. The policy required complete workflow context, ordered load evidence, and explicit expected artifacts, while the skeleton used to leave some of those fields implicit.
**Why it happens** — Normative policy and the embedded skeleton are two sections of one owner document, but they can still drift when an edit changes only one section. Each section reads plausibly in isolation, so the mismatch is invisible until an actual assignment is checked field by field.
**How to detect** — `skills/orchestration/delegation.md` states that every assignment carries a field or invariant, but its `## Shared delegation skeleton` has no matching heading or instruction. Compare each mandatory policy claim with the skeleton and role overlays; a required field with no skeleton slot is drift.
**Correct approach** — Treat the delegation policy and its shared skeleton as one coupled artifact. Any normative edit must check and update the skeleton in the same change, and every skeleton change must be checked against the policy and role overlays. Mechanically verify stable headings and required fields where practical.

### Related
- [[documented-trap-not-gated]] — a specific instance of this drift (a known trap not encoded in the template)
- [[template-embeds-unnamed-exception]] — a specific instance of this drift (a template silently violating stated policy)

## Documented Trap Not Gated

`priority: high` · `domain: process` · `added: 2026-07-08` · `status: active` · `tags: [process, docs-sync]`

**What happened** — This companion already carried the active High-priority trap "Use Runtime Skill Surface In Load Directives", but the shared delegation skeleton still encoded the wrong load surface. The trap was documented while the assignment source kept reproducing it.
**Why it happens** — Recording a mistake changes what a reader knows; it does not change the artifact where the trap is made. If `skills/orchestration/delegation.md` still carries the faulty pattern, every assignment can reproduce the trap even when the manager read this companion.
**How to detect** — A `mistakes.md` entry's Correct approach names the shared skeleton or another concrete assignment source, and that source still matches the rejected pattern. A residual hit means the mistake is recorded but not enforced.
**Correct approach** — When a mistake names a concrete assignment-source fix, update the shared skeleton in `skills/orchestration/delegation.md` as part of closing the mistake. Before dispatch, check the filled assignment against every active orchestration mistake whose Correct approach applies to the skeleton or role overlay.

### Related
- [[use-runtime-skill-surface-in-load-directives]] — the exact trap this recurrence reproduced
- [[delegation-briefs-reference-nonexistent-rules-dir]] — a sibling documented-but-unenforced trap
- [[skill-prose-template-drift]] — the general drift pattern this is one instance of

## Template Embeds Unnamed Exception

`priority: medium` · `domain: docs-sync` · `added: 2026-07-08` · `status: active` · `tags: [docs-sync, process]`

**What happened** — The shared delegation skeleton stated one fixed ordered-load sequence, while a role overlay implied that a domain skill should load earlier. The deviation was not named, so a reader could not distinguish an intentional exception from unnoticed drift.
**Why it happens** — An author may reorder one role-specific load for a locally reasonable purpose and lose sight of the shared skeleton's sequencing invariant. Without an explicit marker, later managers copy both instructions and resolve the conflict differently.
**How to detect** — `skills/orchestration/delegation.md` states an ordering invariant, and a role overlay or filled assignment places an item in a sequence that contradicts it. Compare the shared skeleton and applicable overlay before dispatch.
**Correct approach** — Prefer the shared skeleton's order. If a role overlay must deviate for a proven reason, name and justify the exception at that exact point in `skills/orchestration/delegation.md`. Otherwise align the overlay with the skeleton.

### Related
- [[skill-prose-template-drift]] — the general drift pattern this is one instance of

## Brief Override Silently Competes With Loaded Skill Default

`priority: high` · `domain: process` · `added: 2026-07-12` · `status: active` · `tags: [process, git, verification]`

**What happened** — In the python-skill child-doc Execution loop, the manager's delegation brief told each parallel executor "do NOT commit — T9 owns commit" for the 7-doc wiring wave. 6 of 7 executors held off as instructed; the interoperability executor committed its file per-task anyway (`55eb4677`), following `skills/git/SKILL.md` P3's default "commit only after Verify passes — one focused commit per subtask." The result was a mixed state — 6 uncommitted canonical files plus 1 already-committed file — that the manager had to reconcile at the T9 wiring step instead of a clean batch.
**Why it happens** — `skills/git/SKILL.md` is a loaded, standing instruction every executor reads and follows by default. A brief's single inline "do NOT commit" line is a DEVIATION from that default, but nothing marks it as authoritative over the loaded skill or explains why it overrides it — so it competes with the skill instead of replacing it, and different executors resolve the conflict differently.
**How to detect** — A delegation brief tells the executor NOT to do something its loaded skill instructs it TO do by default (here: commit). Any inline override of a skill's stated default deserves a check: is it stated loudly enough, and is the reason given, or does it read as a single easy-to-miss line competing with the skill?
**Correct approach** — Prefer the skill's own default absent a strong reason to deviate: let each executor commit its own file per-task, and scope any batching step (e.g. T9) to what genuinely needs batching (mirror-generation + mirror-commit), not the per-task commits themselves. When an override IS wanted, state it as a loud, first-line, repeated constraint, and explain WHY it overrides the loaded skill default, so it wins uniformly across every executor reading the same brief.

### Related
- [[template-embeds-unnamed-exception]] — the general pattern this is one instance of: a deviation from a stated default/invariant needs an explicit, named justification at the point of deviation, or a reader (here, some executors) won't recognize it as authoritative
