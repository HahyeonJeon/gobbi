# Partner — the Claude-and-Codex dual system

## Problem

Gobbi's Claude-and-Codex dual-system requirement did not work. Its policy was split between
`codex/SKILL.md` and `codex/peer-adapters.md`, named around "peer" — a word that also means agent-to-agent
collaboration inside Agent Teams, so a scripted rename risked corrupting the unrelated sense (see
[`learnings/design/mistakes.md`](../../learnings/design/mistakes.md) for the guard that protected this).
Fixed 2026-08-01/02 in the same session as [the locator](../architecture/plugin-skill-locator.md).

## Design

`gobbi/partner/SKILL.md` now owns the whole system, both launch directions (Claude launching Codex, Codex
launching Claude), as one canonical child. `codex/peer-adapters.md` is deleted; `codex/SKILL.md` is reduced to
CLI usage only, 183 → 205 lines, dominated by its Manual section (137/205 lines).

**Vocabulary fixed at first use**, closing the ambiguity that broke the naming migration:

- **partner** — the system, and the opposite runtime's role in it
- **partner run** — one bounded invocation
- **partner round** — a composed set of partner runs

**Four carry-forward elements**, verified live in the child before the source was deleted:

1. The version-verified surface table — Codex CLI `0.146.0`, Claude Code `2.1.220` — one row per launch
   direction with its command form. Re-verified at authoring time against installed `--help` output; no drift
   from the recorded values.
2. The instruction that installed help wins over the recorded table — re-run `codex exec --help` and
   `claude --help` before trusting a flag.
3. Per-row mutation rules from the failure matrix, 7 rows plus header, each with an evidence-to-surface
   mapping and a mutation rule.
4. The six-step response-handling check order — "no later check compensates for a failed earlier one."

**Deliberately not carried forward**, because both would have bound the child to a Workflow caller: the
envelope's `step: ideation|planning|execution|wrap-up` enum, replaced with `stage: the caller's stage or topic
label`; and "return to DISCUSSION" from the recovery list, replaced with the other four recovery options
(retry, bounded input repair, user-approved one-system waiver, abort), which generalize across callers.

**Rule 4's temp-capture boundary** states explicitly that the child writes `prompt_file`/`response_file`/
`stderr_file` — a flat "writes no file" would have contradicted its own Procedure.

## Wired into both modes

- **Workflow.** All six partner-policy regions across `workflow` and its phase children now call the child
  instead of restating policy; 14 duplicated regions retargeted. A five-row adapter table supplies Workflow's
  caller-specific inputs, making good on the child's own claim that Workflow is one caller among several.
- **Cowork.** Executable partner rounds; a user-called Structured-depth creation offer; commit-gated teammate
  reuse, with a second form for read-only specialists; a recovery evidence set naming only Cowork constructs.
  Problem 4 of the original report ("both should work in Cowork") is closed by this wiring.

## Codex CLI facts the partner design depends on

Measured against installed Codex CLI `0.146.0`, not assumed from its documentation — see
[`learnings/codex/tips.md`](../../learnings/codex/tips.md) for the full detail:

- `.codex/config.toml` at a repository root is **inert**; Codex loads only `$CODEX_HOME/config.toml`. It
  stayed invisible because both files happened to name the same model.
- `codex exec` has no `-a`/`--ask-for-approval` flag and always runs with `approval: never` — **sandbox mode
  is the entire permission boundary of a `codex exec` run**, directly relevant to launching a partner run
  safely.
- `codex exec` did not block outside a git repository in `0.146.0` despite `--skip-git-repo-check` existing as
  a flag.

## References

- `gobbi/partner/SKILL.md` — the canonical owner
- `codex/SKILL.md` — CLI usage only, no partner policy
- [`design/architecture/plugin-skill-locator.md`](../architecture/plugin-skill-locator.md) — the root-resolution contract both launch directions depend on
- [`learnings/codex/tips.md`](../../learnings/codex/tips.md) — measured Codex CLI behavior
