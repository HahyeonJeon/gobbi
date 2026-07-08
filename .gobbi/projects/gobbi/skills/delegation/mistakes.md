---
type: mistakes
skill: delegation
description: "Recorded traps for delegation — load before doing delegation work"
updated: 2026-07-08
---

# Delegation — Mistakes

> Load before any delegation work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Delegation Briefs Reference Nonexistent Rules Dir

`priority: medium` · `domain: process` · `added: 2026-06-24` · `status: active` · `tags: [process]`

**What happened** — The manager's delegation prompts for the Preparation evaluators carried a Load Directives block that said "all files under `.gobbi/projects/{project-name}/rules/`". Both the iter1 and iter2 evaluators (Claude and Codex) flagged that this directory does not exist in this project; the real project rules live in `skills/memory/rules.md` (the memory standard) plus in-skill rule sections. Agents that follow the directive find nothing, load nothing, and proceed without project rules — and the brief surfaces no error, because a missing directory produces no output rather than an explicit failure.
**Why it happens** — The Load Directives template likely originated from a project that had a populated rules directory, or from a future-state expectation that one would be created, and was carried forward without verifying the path exists for this project. The error is silent: agents get a "no files" result and continue.
**How to detect** — A Load Directives block references a path with a glob like "all files under `.gobbi/projects/{project-name}/rules/`", AND that directory does not exist on disk (verify with `ls` or `find`). If both are true, the brief is sending agents to read from a nonexistent source and they load nothing without erroring.
**Correct approach** — Before issuing a brief that references a rules or memory directory, confirm the path exists (`ls .gobbi/projects/{project-name}/rules/` or `find`). If it does not exist, either remove the directive or replace it with the actual rule source — for this project, "Load `skills/memory/rules.md` (frontmatter/structure standard for staged files)". Do not keep a nonexistent-path Load Directive just because the template included it. **Now enforced by the aligned contract (2026-07-05):** the `.gobbi/projects/{project-name}/rules/` empty-state read contract is defined once in [`skills/memory/rules.md` § Empty-state contract](../memory/rules.md) and referenced from all 16 aligned read-sites (the 5 role prompts, the 4 delegation templates + `skills/delegation/SKILL.md`, the 5 phase-doc read/record sites) plus the `memory-map.md` tier row. A brief that references `.gobbi/projects/{project-name}/rules/` now resolves to the `RULES_PRESENT` / `NO_PROJECT_RULES` two-state contract instead of a silent read-nothing — follow that central contract rather than re-deriving a per-brief fallback.

## Subagents Skip Load Directives No Enforcement

`priority: high` · `domain: process` · `added: 2026-06-25` · `status: active` · `tags: [process, verification]`

**What happened** — A transcript audit of four Execution executors found that two of the four SKIPPED a required Load-Directives skill: executor 02 never Read `skills/principles/SKILL.md` (the behavioral floor); executor 03 never Read `skills/execution/SKILL.md` (its own procedure skill). The skips correlated with the tasks the executor judged lighter — the Principle-1 failure of skipping the foundation when the work looks easy. The output still looked complete, so the skip was invisible without auditing the transcript.
**Why it happens** — Two causes compound. (1) No Skill tool for subagents: a spawned subagent's tools are Read/Grep/Glob/Bash/Write/Edit — there is no `Skill` tool, so "load the principles skill" maps to no concrete action; the only way to "load" is to Read the SKILL.md file, but the instruction never says so. (2) The Load Directives are an unenforced instruction: nothing makes the subagent Read the files before acting, and nothing verifies that it did.
**How to detect** — Grep the subagent's transcript `file_path` entries for each required skill path; a required path with zero Read hits = the skill was skipped. A report that lacks the `SKILLS LOADED` checklist is the same signal at accept-time.
**Correct approach** — Reword for subagents: "Read these exact files IN ORDER as your FIRST actions — you have no Skill tool; 'load' = Read the file" instead of "load the X skill". Require a `SKILLS LOADED` checklist in the subagent's report enumerating each path it Read. The manager grep-verifies the transcript against the required set before accepting the task, and re-dispatches on a miss. Optionally embed the principles floor in each agent's system prompt so it never depends on a Read.
**User feedback** — The user explicitly asked that this be captured as a durable mistake: a subagent that skips its principles floor produces work that looks done but was built without the discipline the floor guarantees, and that gap repeats across every future delegation until the briefing and verification change.

## Use Runtime Skill Surface In Load Directives

`priority: high` · `domain: process` · `added: 2026-07-06` · `status: active` · `tags: [process, codex, verification]`

**Reversed 2026-07-08** — Prior guidance mandated `.agents/skills` as the load path for native Codex and treated a `.gobbi/…` citation as the mistake. That guidance is superseded by the `.gobbi` SSOT decision in `skills/delegation/SKILL.md` (§ Skill-load path SSOT): the canonical source `.gobbi/projects/gobbi/skills/` is the single skill-load path for BOTH runtimes, and `.agents/skills` stays the Codex *discovery* symlink — never a load-path citation. The trap's SUBJECT is unchanged — naming the WRONG skill-load surface in a delegation prompt is still a trap — only the correct answer flipped: the surface that used to be "required" (`.agents/skills`) is now the WRONG one to cite as a load path.

**What happened** — A delegation prompt told a subagent to load mandatory skills from a per-runtime discovery surface — `.agents/skills/<skill>/SKILL.md` on native Codex, or `.claude/skills/<skill>/SKILL.md` on Claude Code — instead of the canonical source `.gobbi/projects/gobbi/skills/<skill>/SKILL.md`, which is the single skill-load path for BOTH runtimes. Native Codex reads the real canonical files directly, so a `.gobbi/…` citation is always resolvable; naming the runtime symlink surface as the load path is the drift.
**Why it happens** — The canonical source and the per-runtime symlink surfaces (`.agents/skills`, `.claude/skills`) point at the same files, so it is tempting to cite whichever surface matches the current runtime. But a per-runtime citation forks the load contract by runtime and re-introduces the discovery symlink as a load path; the SSOT is one path for both runtimes, so the load-path citation must not vary by runtime.
**How to detect** — A delegation prompt's Load Directives block names a per-runtime surface (`.agents/skills/<skill>/SKILL.md` or `.claude/skills/<skill>/SKILL.md`) for mandatory skill loading instead of `.gobbi/projects/gobbi/skills/<skill>/SKILL.md`. Any runtime-specific skill-load path in a brief is the signal.
**Correct approach** — Cite `.gobbi/projects/gobbi/skills/<skill>/SKILL.md` for every mandatory skill load, for BOTH runtimes, paired with `.gobbi/projects/gobbi/skills/<skill>/mistakes.md` when the companion exists. Do NOT name a per-runtime surface (`.agents/skills` / `.claude/skills`) as the load path — those stay discovery / entry-point surfaces only. Keep project mistakes under `.gobbi/projects/gobbi/mistakes/...`; those are durable memory records, not skill-load surfaces.

### Related
- [[delegation-briefs-reference-nonexistent-rules-dir]] — delegation prompts must cite loadable paths for this repo.
- [[subagents-skip-load-directives-no-enforcement]] — exact load paths are part of the load-compliance audit.

## Skill Prose Template Drift

`priority: high` · `domain: docs-sync` · `added: 2026-07-08` · `status: active` · `tags: [docs-sync, process]`

**What happened** — During Ideation discovery on the `delegation` skill, dual-system review (Claude + Codex) found six High-severity gaps where `skills/delegation/SKILL.md` stated a normative rule in prose but the four templates the manager actually fills (`leader.md`, `executor.md`, `evaluator.md`, `assistant.md`) did not carry it. Examples: `SKILL.md` says every prompt ships structured headers pre-filled, but `templates/assistant.md` shipped none; `SKILL.md` requires a `Your sub-step:` slot for parallel spawns, but no template had one; `SKILL.md` states a deterministic "principles → rules → skills → mistakes, no re-ordering" load order, but `templates/evaluator.md` placed a domain skill in the principles tier.
**Why it happens** — A skill with both a policy document (`SKILL.md`) and fill-in templates (`templates/`) has two sources of truth. Nothing forces a template edit when the prose changes; each surface reads as complete and correct in isolation, so the drift is invisible until an agent reads both together and diffs them by hand.
**How to detect** — `SKILL.md` states "every X carries Y" (a rule about what a produced artifact must contain), and `templates/` has files that produce that artifact. Grep the templates for the token the rule requires; a rule with zero matching template hits is drift.
**Correct approach** — Treat a skill's policy doc and its fill templates as one coupled artifact: any edit to a normative rule in the prose MUST be checked against every template the rule applies to in the same change, and vice versa. Where practical, add a lint/grep check that verifies each template contains the token a stated rule requires, so the coupling is mechanically checkable, not only reviewer-diligence-dependent.

### Related
- [[documented-trap-not-gated]] — a specific instance of this drift (a known trap not encoded in the template)
- [[template-embeds-unnamed-exception]] — a specific instance of this drift (a template silently violating stated policy)

## Documented Trap Not Gated

`priority: high` · `domain: process` · `added: 2026-07-08` · `status: active` · `tags: [process, docs-sync]`

**What happened** — `skills/delegation/mistakes.md` already carried the active High-priority trap "Use Runtime Skill Surface In Load Directives", recording the correct skill-load path. Despite this, Ideation discovery on the same skill found that all four delegation templates still hard-coded the pattern the mistake describes as wrong, with no runtime-aware branch — the exact trap reproduced in the templates the mistake file's own owning skill ships.
**Why it happens** — Recording a mistake documents the trap for an agent who reads it before acting; it does not, by itself, change the artifact where the trap gets made. A mistake file is read at Study time; a template is filled at author/dispatch time. If the template itself still contains the faulty pattern, every fill reproduces the trap regardless of whether the filling agent read the mistake file.
**How to detect** — A `mistakes.md` entry's "Correct approach" names a specific file or template that should be different, and that file still matches the pattern the mistake describes as wrong. Grep the named target for the faulty pattern; a hit means the mistake is recorded but not enforced.
**Correct approach** — When a mistake's correct approach describes a concrete fix to an artifact (a template, a script, a config default), apply that fix to the artifact itself as part of closing out the mistake — do not treat recording the mistake as sufficient. This session added the Pre-Dispatch Fill Checklist to `skills/delegation/SKILL.md` as that gate: before a template ships, check it against every currently-recorded mistake whose correct approach names that template.

### Related
- [[use-runtime-skill-surface-in-load-directives]] — the exact trap this recurrence reproduced
- [[delegation-briefs-reference-nonexistent-rules-dir]] — a sibling documented-but-unenforced trap
- [[skill-prose-template-drift]] — the general drift pattern this is one instance of

## Template Embeds Unnamed Exception

`priority: medium` · `domain: docs-sync` · `added: 2026-07-08` · `status: active` · `tags: [docs-sync, process]`

**What happened** — `skills/delegation/SKILL.md` states a Core Principle: the load order is "principles → rules → skills → mistakes" with "no skipping, no re-ordering." `templates/evaluator.md` listed `skills/evaluation/SKILL.md` — a domain skill — inside the tier-1 "Principles:" load block, ahead of project rules and the mistake floor, with no comment or carve-out marker explaining that the placement is a deliberate, sanctioned exception.
**Why it happens** — A template author reordering one line for a locally-reasonable-seeming purpose (evaluators need `skills/evaluation/SKILL.md` early because their whole procedure depends on it) can lose sight of the fact that the skill's own prose treats the order as a hard, named invariant with "no re-ordering" spelled out. When the deviation is not labeled, a later reader has no way to distinguish an intentional, reviewed exception from unnoticed drift.
**How to detect** — A skill states an ordering or sequencing invariant as a Core Principle ("no skipping, no re-ordering", "must always precede X"), and one of its own generated artifacts (a template, a checklist, a generated file) places items in a sequence that contradicts it — mechanically checkable once the invariant and the artifact are read side by side.
**Correct approach** — When a template or artifact must deviate from a stated Core Principle or invariant for a good reason, name the deviation explicitly at the point of deviation — a short inline note such as "Exception to the no-reorder rule: `skills/evaluation/SKILL.md` loads in tier 1 because ___" — so a reader can evaluate whether the exception still holds. If the exception is not actually justified, fix the ordering instead of leaving it unlabeled.

### Related
- [[skill-prose-template-drift]] — the general drift pattern this is one instance of
