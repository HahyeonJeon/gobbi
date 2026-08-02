# Agent Teams

## Problem

Gobbi's Agent Teams requirement did not work in an installed plugin. Root cause: a plugin cannot ship `env` or
`permissions`, so the prerequisite `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` setting never arrived in a consumer
project, and nothing in Gobbi checked for its absence before assuming teammates were available. No skill owned
Agent Teams at all before this fix. Fixed 2026-08-01/02 in the same session as
[the locator](../architecture/plugin-skill-locator.md) and [partner](partner.md).

## Design

`gobbi/agent-teams/SKILL.md` was built from nothing, 293 lines, mode-neutral: **zero** occurrences of
`RECORD`, `gate.md`, `Hand-off`, `TODO`, or `Workflow Step` in a document derived entirely from a
Workflow-coupled source (`workflow/agent-teams.md`). Procedure is 212 of 293 lines (72%).

**Preflight checks the live environment, not a settings file.** It runs
`printenv CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` rather than reading `.claude/settings.json` alone, because a
settings file is only one source of that value — a consumer who exports it as a shell variable would produce
a false negative from a file-only check, the same silent-failure class as the root cause. Settings precedence
for Claude Code, verified: `.claude/settings.local.json` > `.claude/settings.json` > `~/.claude/settings.json`.

**Five-phase lifecycle**, each phase reaching an observable completion state — a degraded preflight is a
terminal state (Step 1.2), not routed into the acceptance-close phase, because a degraded run spawns no
teammate and creates no lifecycle for that phase to close.

**An entry configuration gate** was added to `gobbi/SKILL.md` recommending the prefixed skill/agent identifier
form (`gobbi:principles`, `gobbi:leader`, …) for a consumer project and the bare form for this repository,
backed by the namespacing measurement in [the locator design](../architecture/plugin-skill-locator.md).

### 15 Workflow constructs converted to adapter inputs

The split's own test: a construct that converts to a caller-supplied input stays; a construct expressible
through no adapter input is Workflow-coupled and drops. Highlights: `Workflow Step 1.3` → an assignment-field
set; the TODO route → the caller's route; RECORD receipts + `gate.md` + Hand-off → a recovery evidence set;
the acceptance decision → an acceptance signal; "worktree, record, Git, TODO, external-system mutations" → the
caller's mutation-surface list; the leader's "coherent Ideation or Planning chain" → "one coherent shaping
chain, as the caller's per-role reuse boundary defines it".

**One construct dropped, correctly, not substituted:** "one mutable item per productive-step iteration /
DISCUSSION→WORK→EVALUATION→RECORD / PASS gate marker" — a route shape no adapter input can express. It still
lives in `workflow/agent-teams.md`, which retained it deliberately rather than losing it from the tree.

**Rule 5 encodes two of this session's own coordination failures** as binding rules rather than advice: a
claim that an artifact is complete, frozen, or verified is a claim and not a check; silence is not even a
claim. See [`learnings/work/mistakes.md`](../../learnings/work/mistakes.md) for the incidents that produced
this rule.

## Open

- The locator's no-brief fallback path is unverified for a spawned Agent Teams specialist, for the same reason
  recorded in [the locator design's Open section](../architecture/plugin-skill-locator.md#open): a spawned
  specialist has no `Skill` tool. Not a defect in this child; the manager's brief is the actual contract.

## References

- `gobbi/agent-teams/SKILL.md` — the canonical owner, mode-neutral
- `workflow/agent-teams.md` — the Workflow-coupled residue this child was extracted from
- [`design/architecture/plugin-skill-locator.md`](../architecture/plugin-skill-locator.md) — the namespacing measurement behind the configuration gate
- [`design/feature/partner.md`](partner.md) — the sibling system built in the same session
