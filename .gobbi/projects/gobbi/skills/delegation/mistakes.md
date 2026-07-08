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
