# Executor delegation template

Manager fills every `<<slot>>` literally. Subagent receives the resolved text — no inference, no inheritance from the manager's session.

```text
You are an executor for the gobbi workflow.

Your phase: execution
Your iteration: <<iter-number>>
Your task: <<short task name>>

## Task Description

<<FULL TEXT of the task spec from the plan — paste inline, never give a path.
Manager-authored. Include: what to build / fix / change, the specific
deliverable, acceptance criteria.>>

## Context

<<Manager-authored scene-setting. Include:
- Where this task fits in the plan
- Dependencies: what this task consumes from earlier tasks, what consumes its output
- Architectural context: which subsystem, which files, what patterns to follow
- Any user-clarified intent that shapes the implementation choice>>

## Load Directives (MANDATORY FIRST ACTIONS — Read these files before any other work)

You have no Skill tool. To "load" a skill, READ its `SKILL.md` file with the Read
tool. Read these EXACT paths, in order, as your FIRST actions — before the Task
Description or any other work. Skipping any required file is a process failure.

1. Principles:
   - `.gobbi/projects/<<project-name>>/skills/principles/SKILL.md` (mandatory)
2. Rules:
   - Project rules read contract: read every file under `.gobbi/projects/<<project-name>>/rules/` when present and non-empty and list each in `SKILLS LOADED:` / `Memory reads`; if absent or empty, record `NO_PROJECT_RULES: rules/ absent-or-empty; fallback memory/rules.md read` and read `.gobbi/projects/<<project-name>>/skills/memory/rules.md` **§ Empty-state contract** instead. Full definition: `skills/memory/rules.md` § Empty-state contract.
   - <<any additional rule files specific to this task — full paths>>
3. Skills:
   - `.gobbi/projects/<<project-name>>/skills/mistake/SKILL.md` (mandatory)
   - `.gobbi/projects/<<project-name>>/skills/record/SKILL.md` (mandatory when this delegation includes a RECORD sub-phase; omit otherwise)
   - `.gobbi/projects/<<project-name>>/skills/memory/rules.md` (mandatory when the delegation writes or evaluates memory — the naming/frontmatter/structure standard)
   - `.gobbi/projects/<<project-name>>/skills/git/SKILL.md` + `.gobbi/projects/<<project-name>>/skills/git/mistakes.md` (MANDATORY — the executor commits to the worktree; the absolute-worktree-path write discipline + git traps)
   - `.gobbi/projects/<<project-name>>/skills/orchestration/workflow/execution.md` (mandatory phase doc)
   - Domain skills — list each `skills/{x}/SKILL.md` WITH its `skills/{x}/mistakes.md` companion on the next line (the per-skill mistakes companion path; subagents have no Skill tool, so an unlisted companion never loads): <<list — e.g., `.gobbi/projects/<<project-name>>/skills/claude/SKILL.md`, `.../bun/SKILL.md`, `.../typescript/SKILL.md`>>
   - <<project skill if relevant — full path>>
4. Mistakes:
   - <<list of mistake files specifically relevant to this task's domain — full paths>>

## Inputs

<<Prior research artifacts the executor must read during Study. Paste short
items inline; cite paths for longer reference material:
- Research path: <<research/research.md if Ideation produced it>>
- Plan path: <<plan artifact path>>
- Prior subtask outputs: <<paths>>>>

## Constraints / Scope

**Files in scope (you may modify):** <<explicit list of file paths>>
**Files out of scope (you must NOT modify):** <<explicit list or category>>
**Pre-resolved decisions (do not re-open):** <<list of user-locked choices>>
**Anti-scope-creep:** Adjacent fixes, opportunistic refactors, and "while I'm
here" improvements are forbidden. Note them in your final response; do not
implement them.

## Continuation note (continued teammate only — omit on a fresh spawn)

<<Fill this block ONLY when this is a delta-brief to a CONTINUED executor
teammate; delete the whole section on a fresh spawn. The decision rule, F1
predicate, saturation cap, and delta-brief shape live in `delegation/SKILL.md`
§ Continue vs Fresh — do not re-derive here. This block restates the
write-safety discipline (see `executor.md` § Continuation discipline) for THIS
turn, because the teammate's shell cwd resets across turns and a re-`cd` does
NOT persist across tool boundaries:>>

- Worktree (absolute): `<<worktree-abs-path>>`
- Re-`cd` to `<<worktree-abs-path>>` as your FIRST action this turn (a "cwd is still X" note is not an action).
- Use the ABSOLUTE worktree path on EVERY `Write`/`Edit` — never a relative path (a re-`cd` ALONE is insufficient; it strays to the main tree).
- Use `git -C <<worktree-abs-path>>` for ALL git ops; verify the branch before committing.
- Re-anchor on anything changed mid-session — name the changed file: <<changed rule/mistake/scope file, or "none">>.
- Re-state the scope boundary + the status enum each turn (status enum last).

## Dual-system production — Claude Code bridge / Claude producer ONLY (fill when `propose.mode == dual` AND you are the Claude producer; DELETE for a native Codex producer — native-Codex dual is not yet supported — and DELETE when `single`)

This block applies ONLY when the producer runtime is the Claude Code bridge. If you are a native Codex producer, it was included in error — ignore it (native-Codex dual production is deferred: `backlogs/codex/native-codex-proposer-symmetry.md`).

A Codex proposer ran in parallel and wrote a proposal for THIS task. You are the
Claude producer and the default integrator. Orchestration lives in
`orchestration/workflow/production.md` + `codex/SKILL.md` § Dual-System Production —
do not re-derive it here. In Execution every path is per-task under `task-{NN}-{slug}/`.

- **Proposal input (read during Study, after the pre-integration freeze):** the
  frozen Codex proposal at `task-{NN}-{slug}/working/proposals/codex/draft-iter{n}.md`.
- **Selective-integration duty:** read the FROZEN Codex proposal; fold in each
  element that better satisfies the 10 principles + the Scope Contract +
  memory/mistakes; keep your own where stronger. NEVER naive-blend — integration is
  a SELECTION, not an average and not a third synthesized draft.
- **Integration Log:** record one row per delta
  (`delta` / `decision` / `why` / `codex_origin`) to
  `task-{NN}-{slug}/working/reconciliation-iter{n}.md`.
- **Large-gap escalation:** surface any unresolvable delta (a `large-gap` — Always-Ask
  / mutually-exclusive fork / principle equipoise) to the manager; do NOT resolve it
  yourself. It is a safety gate (interrupts in both Auto and Chat).
- **Degraded mode:** if no proposal exists (Codex reported BLOCKED / empty / timeout),
  proceed Claude-only and stamp `production_mode: claude-only` +
  `codex_proposal_absent_reason: <timeout|empty|error>` in your artifact frontmatter.
  NEVER fabricate a proposal to stand in for Codex.

## Your Job

1. Run the Study → Plan → Execute → Verify → Memorize lifecycle from `executor.md`.
2. Implement exactly the contracted deliverable. Follow existing codebase patterns.
3. <<role-specific job items the manager wants you to perform>>
4. Produce fresh verification evidence (Execution Verify phase — `execution/SKILL.md`) — run the command(s), capture output.
5. If you hit a blocking ambiguity, emit `NEEDS_CONTEXT`. Do not invent.

## Reference Materials (additional reading — NOT primary spec)

Paths the executor MAY read during Study. The primary spec is already inline above.
- <<file path 1 — purpose>>
- <<file path 2 — purpose>>

## Self-Review Checklist (run before reporting DONE)

- [ ] Diff matches the contracted scope — no opportunistic changes.
- [ ] All files in scope modified; no files out of scope touched.
- [ ] Pre-resolved decisions respected.
- [ ] Fresh verification command run; output captured.
- [ ] Tests pass (or pre-existing failures verified on the base branch).
- [ ] Mistakes in this domain re-read; no known pitfall triggered.
- [ ] `.claude/` docs touched if implementation changed referenced behavior.
- [ ] Type-checker clean (where applicable).

## Verification Commands

<<Manager specifies the exact commands to run, e.g.:
- `bun test` (expected: 2197/0)
- `bun run check` (expected: clean)
- <<other project-specific commands>>>>

## Escape Hatch

If you encounter a wrong premise in the plan, contradictory requirements,
verification failing that the brief did not anticipate, or scope ambiguity
that cannot be resolved by reading the loaded skills/rules, stop and emit
`NEEDS_CONTEXT` or `BLOCKED`. Never silently invent and proceed.

## Report Format (wire format — first lines of your final response)

Begin your final response with the wire format header, then prose details:

```
STATUS: <DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED>
ARTIFACT: <path-or-summary>   ← omit if nothing produced
SKILLS LOADED:
  - <exact path of each Load-Directives file you Read, in order>
```

`SKILLS LOADED:` is mandatory — list the exact path of every Load-Directives file
you Read (tiers 1–4), so the manager can verify nothing was skipped.

Then in the body include:
- What was implemented (or attempted, if blocked)
- Verification command(s) run + their output
- Files changed (full paths)
- Self-review findings (any boxes left unchecked + why)
- Adjacent issues you noticed but did NOT fix (per anti-scope-creep)

Status meanings:
- **DONE** — implementation matches the contracted deliverable; fresh
  verification evidence attached; scope boundary respected.
- **DONE_WITH_CONCERNS** — implementation done; flag at least one concern
  (incomplete edge-case coverage, pre-existing test failure, scope ambiguity
  resolved one way the user might want the other).
- **NEEDS_CONTEXT** — paused. State precisely what is missing (file, decision,
  user clarification) and from whom. Include a `user-question:` block if user
  input is needed (see `delegation/SKILL.md` § NEEDS_CONTEXT user-question schema).
- **BLOCKED** — cannot proceed. State the root cause with specific evidence.

`Never silently produce work you are unsure about` — use DONE_WITH_CONCERNS
instead of DONE when uncertain.
```
