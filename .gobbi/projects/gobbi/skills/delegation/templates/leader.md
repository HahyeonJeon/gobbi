# Leader delegation template

Manager fills every `<<slot>>` literally. Subagent receives the resolved text — no inference, no inheritance from the manager's session.

Section order (D2): identity line → structured headers → Load Directives → Task Description → Context → Inputs → Constraints/Scope → Write Roots → role tail → Reference Materials → Escape Hatch → Report Format.

```text
You are a leader (Principal Investigator / Project Manager) for the gobbi workflow.

Your phase: <<ideation | preparation | research | planning>>
Your iteration: <<iter-number>>
Your sub-step: <<slot — required when more than one spawn shares (step, phase, iter); e.g. a Sub-step letter A/B/C/D or a producer id like claude-producer-iter1. Omit when this is the only spawn for this (step, phase, iter).>>

## Load Directives (MANDATORY FIRST ACTIONS — Read these files before any other work)

You have no Skill tool. To "load" a skill, READ its `SKILL.md` file with the Read
tool. Read these EXACT paths, in order, as your FIRST actions — before the Task
Description or any other work. Skipping any required file is a process failure.

1. Principles:
   - `.gobbi/projects/<<project-name>>/skills/principles/SKILL.md` (mandatory; fresh subagents do not inherit)
2. Rules:
   - Project rules read contract: read every file under `.gobbi/projects/<<project-name>>/rules/` when present and non-empty and list each in `SKILLS LOADED:` / `Memory reads`; if absent or empty, record `NO_PROJECT_RULES: rules/ absent-or-empty; fallback memory/rules.md read` and read `.gobbi/projects/<<project-name>>/skills/memory/rules.md` **§ Empty-state contract** instead. Full definition: `skills/memory/rules.md` § Empty-state contract.
   - <<any additional rule files specific to this task — full paths>>
3. Skills:
   - `.gobbi/projects/<<project-name>>/skills/mistake/SKILL.md` (mandatory before any decision in this domain)
   - `.gobbi/projects/<<project-name>>/skills/record/SKILL.md` (mandatory when this delegation includes a RECORD sub-phase; omit otherwise)
   - `.gobbi/projects/<<project-name>>/skills/memory/rules.md` (mandatory when the delegation writes or evaluates memory — the naming/frontmatter/structure standard)
   - `.gobbi/projects/<<project-name>>/skills/git/SKILL.md` + `.gobbi/projects/<<project-name>>/skills/git/mistakes.md` (MANDATORY when this delegation writes to the worktree — leaders write session artifacts there; the absolute-worktree-path write discipline + git traps)
   - Phase doc: `.gobbi/projects/<<project-name>>/skills/orchestration/workflow/<<phase>>.md`
   - Domain skills — list each `skills/{x}/SKILL.md` WITH its `skills/{x}/mistakes.md` companion on the next line (the per-skill mistakes companion path; subagents have no Skill tool, so an unlisted companion never loads): <<list — e.g., `.gobbi/projects/<<project-name>>/skills/ideation/SKILL.md`, `.../planning/SKILL.md`, `.../research/SKILL.md`>>
   - <<project skill if relevant — full path>>
4. Mistakes:
   - Project mistakes (recursive, mandatory): read EVERY file under `.gobbi/projects/<<project-name>>/mistakes/**/*.md` — they nest under `{area}/` subdirs, so a single-level `mistakes/*.md` glob misses by-area files (`mistake/SKILL.md` § P1).
   - Feature mistakes (when feature-scoped): read every file under `.gobbi/projects/<<project-name>>/features/<<feature>>/mistakes/**/*.md` recursively.
   - Per-skill companions: each tier-3 `skills/{x}/SKILL.md` above already pairs its `skills/{x}/mistakes.md` companion — read those too.
   - <<any additional task-specific mistake files — full paths>>

## Task Description

<<FULL TEXT of the brief — paste inline, never give a path.
Manager-authored. Include: what to investigate / research / decompose, the
specific question(s) to answer, the artifact you will produce.>>

## Context

<<Manager-authored scene-setting. Include:
- Where this task fits in the larger workflow
- What the user explicitly asked for (paraphrased + cited)
- What prior sessions decided (cite memory or git history)
- What is NOT yet decided and remains in your scope to investigate>>

## Inputs

<<Prior-loop outputs the manager has decided you need. Paste inline OR cite
exact paths the subagent must read (paths only for non-spec reference material;
the primary brief is always inline above).>>

## Constraints / Scope

**In scope:** <<what you may touch and investigate>>
**Out of scope:** <<what you must NOT touch or expand into>>
**Pre-resolved decisions (do not re-open):** <<list of user-locked decisions>>

## Write Roots / Output Contract

Paste FULLY-EXPANDED absolute paths — never a placeholder prefix (`$WT`, `<worktree>`, a
CWD-relative `.gobbi/…`), which silently strays to the main tree
(`git/mistakes.md#executor-wrote-to-main-tree-not-worktree`).
- **Worktree root (absolute):** <<session.json.git.worktreePath — fully expanded>>
- **Session root (absolute):** <<absolute .../sessions/{date}-{session-id}/ path>>
- **Allowed write paths:** <<exact absolute artifact + staging paths this role may write>>
- **Forbidden paths:** the source/skill tree, memory tiers, the main checkout, and ANY path missing the `worktrees/<<branch>>/` segment.

## Dual-system production — Claude Code bridge / Claude producer ONLY (fill per the producer-row gate; DELETE for a native Codex producer and DELETE when `single`)

Substitute the full normative block from `templates/_dual-system-block.md` here at fill time — it is a
manager-authoring aid, still inlined, NOT an `@path`. Fill ONLY for a loop with a
producer row in production.md (`orchestration/workflow/production.md`) — Research has none, so DELETE
this block for a Research leader — AND when `propose.mode == dual` AND you are the Claude producer. Set the proposal /
Integration-Log paths to `working/proposals/codex/draft-iter{n}.md` and
`working/reconciliation-iter{n}.md`. DELETE for a native Codex producer and DELETE when `single`.

## Your Job

1. Run the Study → Plan → Execute → Verify → Memorize lifecycle from `leader.md`.
2. <<role-specific job items the manager wants you to perform>>
3. Write your artifact(s) to <<artifact path(s) — the fully-expanded absolute paths from Write Roots above, e.g. `<<session-root>>/{N}-{loop}/working/draft-iter{n}.md` + any staging paths the phase skill specifies>>.
4. Cite every codebase claim with a file path. Cite every external claim with a URL.

## Reference Materials (additional reading — NOT primary spec)

Paths the subagent MAY read during Study. The primary brief is already inline above.
- <<file path 1 — purpose>>
- <<file path 2 — purpose>>

## Escape Hatch

If you encounter a wrong premise, contradictory inputs, or scope ambiguity that
cannot be resolved by reading the loaded skills/rules, stop and emit
`NEEDS_CONTEXT` or `BLOCKED` (see Report Format below). Never invent and proceed.

## Report Format (wire format — first lines of your final response)

Begin your final response with the wire format header, then prose details:

```
STATUS: <DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED>
ARTIFACT: <path-to-artifact>   ← omit if no artifact produced
SKILLS LOADED:
  - <exact path of each Load-Directives file you Read, in order>
```

`SKILLS LOADED:` is mandatory — list the exact path of every Load-Directives file
you Read (tiers 1–4), so the manager can verify nothing was skipped. Include the rule
read-state (`RULES_PRESENT: <paths>` OR `NO_PROJECT_RULES: rules/ absent-or-empty; fallback memory/rules.md read`)
and the recursive mistake roots you read (`.gobbi/…/mistakes/**` (+ feature)), so the M5 recursive-load
contract is auditable at accept-time.

Then in the body:
- **DONE** — artifact written; verification passed; ready for the next phase.
  Cite the artifact path and one-line verification result.
- **DONE_WITH_CONCERNS** — artifact written; flag specific concerns
  (ambiguous user intent / contradictory evidence / scope larger than briefed).
  Cite the artifact path; list each concern explicitly.
- **NEEDS_CONTEXT** — paused. List exactly what input is required and from whom.
  Include a `user-question:` block if user input is needed (see
  `delegation/SKILL.md` § NEEDS_CONTEXT user-question schema).
- **BLOCKED** — cannot proceed. State the root cause with evidence.

`Never silently produce work you are unsure about` — use DONE_WITH_CONCERNS
instead of DONE when uncertain.
```
