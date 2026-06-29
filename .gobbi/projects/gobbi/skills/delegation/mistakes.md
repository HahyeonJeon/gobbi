---
type: mistakes
skill: delegation
description: "Recorded traps for delegation — load before doing delegation work"
updated: 2026-06-27
---

# Delegation — Mistakes

> Load before any delegation work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Delegation Briefs Reference Nonexistent Rules Dir

`priority: medium` · `domain: process` · `added: 2026-06-24` · `status: active` · `tags: [process]`

**What happened** — The manager's delegation prompts for the Preparation evaluators carried a Load Directives block that said "all files under `.gobbi/projects/{project-name}/rules/`". Both the iter1 and iter2 evaluators (Claude and Codex) flagged that this directory does not exist in this project; the real project rules live in `skills/memory/rules.md` (the memory standard) plus in-skill rule sections. Agents that follow the directive find nothing, load nothing, and proceed without project rules — and the brief surfaces no error, because a missing directory produces no output rather than an explicit failure.
**Why it happens** — The Load Directives template likely originated from a project that had a populated rules directory, or from a future-state expectation that one would be created, and was carried forward without verifying the path exists for this project. The error is silent: agents get a "no files" result and continue.
**How to detect** — A Load Directives block references a path with a glob like "all files under `.gobbi/projects/{project-name}/rules/`", AND that directory does not exist on disk (verify with `ls` or `find`). If both are true, the brief is sending agents to read from a nonexistent source and they load nothing without erroring.
**Correct approach** — Before issuing a brief that references a rules or memory directory, confirm the path exists (`ls .gobbi/projects/{project-name}/rules/` or `find`). If it does not exist, either remove the directive or replace it with the actual rule source — for this project, "Load `skills/memory/rules.md` (frontmatter/structure standard for staged files)". Do not keep a nonexistent-path Load Directive just because the template included it.

## Subagents Skip Load Directives No Enforcement

`priority: high` · `domain: process` · `added: 2026-06-25` · `status: active` · `tags: [process, verification]`

**What happened** — A transcript audit of four Execution executors found that two of the four SKIPPED a required Load-Directives skill: executor 02 never Read `skills/principles/SKILL.md` (the behavioral floor); executor 03 never Read `skills/execution/SKILL.md` (its own procedure skill). The skips correlated with the tasks the executor judged lighter — the Principle-1 failure of skipping the foundation when the work looks easy. The output still looked complete, so the skip was invisible without auditing the transcript.
**Why it happens** — Two causes compound. (1) No Skill tool for subagents: a spawned subagent's tools are Read/Grep/Glob/Bash/Write/Edit — there is no `Skill` tool, so "load the principles skill" maps to no concrete action; the only way to "load" is to Read the SKILL.md file, but the instruction never says so. (2) The Load Directives are an unenforced instruction: nothing makes the subagent Read the files before acting, and nothing verifies that it did.
**How to detect** — Grep the subagent's transcript `file_path` entries for each required skill path; a required path with zero Read hits = the skill was skipped. A report that lacks the `SKILLS LOADED` checklist is the same signal at accept-time.
**Correct approach** — Reword for subagents: "Read these exact files IN ORDER as your FIRST actions — you have no Skill tool; 'load' = Read the file" instead of "load the X skill". Require a `SKILLS LOADED` checklist in the subagent's report enumerating each path it Read. The manager grep-verifies the transcript against the required set before accepting the task, and re-dispatches on a miss. Optionally embed the principles floor in each agent's system prompt so it never depends on a Read.
**User feedback** — The user explicitly asked that this be captured as a durable mistake: a subagent that skips its principles floor produces work that looks done but was built without the discipline the floor guarantees, and that gap repeats across every future delegation until the briefing and verification change.
