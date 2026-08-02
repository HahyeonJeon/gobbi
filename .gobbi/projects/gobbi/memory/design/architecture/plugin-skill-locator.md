# Plugin skill and agent locator

## Problem

A user installed `plugins/gobbi/` into an external project and every distributed role — leader, executor,
evaluator, assistant — failed to find its own skills. The five role contracts (`manager.md`, `leader.md`,
`executor.md`, `evaluator.md`, `assistant.md`) hardcoded `.gobbi/projects/gobbi/skills/...` and
`.gobbi/projects/gobbi/agents/...`, paths that exist only inside this repository's own checkout, never inside
a consumer project that installed the plugin. Fixed 2026-08-01/02 across the `claude-2026-08-01-a84c8507…`
session (base `968edb02`, head `f5f54a74`).

## The locator contract

`gobbi/SKILL.md` Procedure Step 1.1 owns this contract. Every role contract now references `{gobbi-skills-root}`
and `{gobbi-agents-root}` as placeholders the entry resolves once per session, never a literal path. 59
references were converted across the five role contracts (not the 24 the plan estimated — see
[`learnings/work/mistakes.md`](../../learnings/work/mistakes.md)).

Four steps, run once at the Gobbi entry:

1. **Acquire.** Take the base directory the active entrypoint reports when it loads the skill. No environment
   variable, config file, or filesystem search is needed, and **none exists to supply one** — confirmed on
   both runtimes, see Measured facts below.
2. **Derive two candidates, not one.** The reported path may name the skill's own directory (Claude Code) or
   the skills root directly (Codex CLI) — the two runtimes disagree on shape. Build one candidate for each
   shape and let the sentinels decide which is real: "never decide which from its spelling."
3. **Validate.** All three sentinels must exist and be readable, in order:
   `{gobbi-skills-root}/gobbi/SKILL.md`, `{gobbi-skills-root}/principles/SKILL.md`,
   `{gobbi-agents-root}/manager.md` — `{gobbi-agents-root}` is the `agents/` sibling of `{gobbi-skills-root}`.
   Exactly one candidate passes in every real topology (see the trace table below); the ambiguity stop never
   fires spuriously.
4. **Fail loudly on five conditions**, not silently: sentinel failure, an ambiguous pair (both candidates
   pass), a partial pair (a supplied root without its counterpart), a re-derived pair diverging from the one
   already recorded this session, and a not-absolute or unreadable root. The entry writes nothing, so it
   cannot propagate a corrected root once one is wrong — a diverged pair must stop and report both.

**Divergence rule.** The resolved pair is fixed for the whole session — "one session runs against exactly one
pair" — re-derived at every entry and compared against the recorded pair.

**Root-pair invariant** (in every role contract, not just the entry): the two roots are one pair, never one
value. Either the brief supplies both or supplies neither, and a specialist derives both from its own
contract's location only in the neither case. A supplied root is never trusted unvalidated. Four failure
tokens discriminate the stop reason: `partial-pair`, `not-an-absolute-path`, `absent-or-unreadable`,
`location-underivable`.

### Verified topology trace

| Reported shape | Rejected candidate | Selected | `{gobbi-agents-root}/manager.md` |
|---|---|---|---|
| Claude Code, skill's own dir (`…/skills/principles`) | `…/skills/principles` | `…/skills` | readable |
| Codex CLI, skills root (`…/skills`) | `…/1.0.1` | `…/skills` | readable |
| This repository (`.claude/skills/gobbi`) | `.claude/skills/gobbi` | `.claude/skills` | readable |

## Measured runtime facts backing the design

Established by three external validation probes against a fresh consumer fixture (no `.gobbi`, no `.claude`,
plugin installed via a real marketplace), not by reasoning about either runtime's documentation:

- **The entrypoint reports its own location on load.** Claude Code's `Skill` tool result opens with `Base
  directory for this skill: <path>` — the skill's own directory. Codex CLI's root alias reports the skills
  root directly. This line was visible from the first turn of every session and went unnoticed until a probe
  forced the question.
- **Neither runtime has a plugin-root environment variable.** No `${CLAUDE_PLUGIN_ROOT}` or Codex equivalent
  exists — confirmed by a full `env` dump on both runtimes. The design's earlier rejection of
  `${CLAUDE_PLUGIN_ROOT}` was correct, now on measurement rather than a defect report.
- **Both runtimes namespace identically.** A consumer project offers only `gobbi:<name>` — for example
  `gobbi:principles`, `gobbi:gobbi` — never the bare form. 28 skills and 5 agent types observed, all prefixed,
  on both Claude Code and Codex CLI. The entry's configuration gate recommends the prefixed form for a
  consumer and the bare form for this repository, with the reason stated rather than a both-spellings hedge.
- **A spawned specialist (leader, executor, evaluator, assistant) has no `Skill` tool** unless its role's
  `tools:` frontmatter grants one, so it cannot itself read the "Base directory" report. It receives the
  resolved pair from its brief instead; the root-pair invariant above is what makes that safe.
- Claude Code appends `<plugin-root>/bin` onto `PATH` for a session with the plugin active — a real,
  undocumented side effect usable as a fallback signal, not the primary mechanism.
- `~/.claude/plugins/marketplaces/<name>/` is a full git clone of the marketplace source repository, created
  automatically by `/plugin marketplace add`; it satisfies all three sentinels on its own.

## Open

- **The no-brief fallback is unverified for a spawned specialist.** It tells a specialist to derive both roots
  from "this contract's own location," but a spawned specialist has no `Skill` tool and cannot reliably
  determine that location itself. The design holds today because the manager always carries both roots in
  every brief, so the fallback path is never exercised in practice. Recorded, not fixed; see
  [`backlogs/project.md`](../../backlogs/project.md).
- Four role-contract surfaces still name paths or files that do not exist in a consumer project, outside the
  locator conversion's own scope: `plugins/gobbi/` cited as a Codex runtime surface, a nonexistent "Project
  skill", the user's own unreachable auto-memory file, and one cosmetic stale frontmatter line. See
  [`backlogs/project.md`](../../backlogs/project.md).

## References

- `gobbi/SKILL.md` Procedure Step 1.1 — the locator contract
- Five role contracts (`.gobbi/projects/gobbi/agents/*.md`) — the root-pair invariant and failure tokens
- [`reports/review/2026-08-02-locator-partner-agentteams-review.md`](../../reports/review/2026-08-02-locator-partner-agentteams-review.md) — evaluation and probe evidence
