# Dual-system production block (shared partial)

The single canonical source of the dual-system production block. The three producer templates
(`leader.md`, `executor.md`, `assistant.md`) POINT at this file instead of each carrying their own
near-identical copy; `evaluator.md` never carries it (the evaluator reviews, it never proposes).

**This partial is a manager-authoring aid, still inlined, NOT an `@path`.** The manager assembles /
substitutes this block's body into the producer prompt at fill time — the subagent still receives
fully-inlined text. It is NOT a subagent-facing `@path` (a subagent reading the block from a path
would break the inline-paste rule). "Point at this partial" means the manager copies the filled body
in; it never means the rendered prompt cites this file by path.

## Producer-row gate (M2 — fill only when ALL hold)

Fill this block ONLY for **a loop with a producer row in production.md**
(`orchestration/workflow/production.md`) — Research has NO producer row, so DELETE the block for a
Research leader. Both further conditions must also hold:

- `propose.mode == dual` for this loop, AND
- you are the Claude producer on the **Claude Code bridge**.

DELETE the block for a native Codex producer (native-Codex dual production is deferred —
`backlogs/codex/native-codex-proposer-symmetry.md`) and DELETE it when the loop is `single`.

## The block to inline (substitute the per-role proposal / Integration-Log paths at fill time)

```text
## Dual-system production — Claude Code bridge / Claude producer ONLY (fill per the producer-row gate above; DELETE for a native Codex producer and DELETE when `single`)

This block applies ONLY when the producer runtime is the Claude Code bridge. If you are a native
Codex producer, it was included in error — ignore it (native-Codex dual production is deferred:
`backlogs/codex/native-codex-proposer-symmetry.md`).

A Codex proposer ran in parallel and wrote a proposal. You are the Claude producer and the default
integrator. Orchestration lives in `orchestration/workflow/production.md` + `codex/SKILL.md`
§ Dual-System Production — do not re-derive it here.

- **Proposal input (read during Study, after the pre-integration freeze):** the frozen Codex
  proposal at <<per-role proposal path — leader/assistant: `working/proposals/codex/draft-iter{n}.md`;
  Execution per-task: `task-{NN}-{slug}/working/proposals/codex/draft-iter{n}.md`>>.
- **Selective-integration duty:** read the FROZEN Codex proposal; fold in each element that better
  satisfies the 10 principles + the Scope Contract + memory/mistakes; keep your own where stronger.
  NEVER naive-blend — integration is a SELECTION, not an average and not a third synthesized draft.
- **Integration Log:** record one row per delta (`delta` / `decision` / `why` / `codex_origin`) to
  <<Integration-Log path — leader/assistant: `working/reconciliation-iter{n}.md`; Execution per-task:
  `task-{NN}-{slug}/working/reconciliation-iter{n}.md`>>.
- **Large-gap escalation:** surface any unresolvable delta (a `large-gap` — Always-Ask /
  mutually-exclusive fork / principle equipoise) to the manager; do NOT resolve it yourself. It is a
  safety gate (interrupts in both Auto and Chat).
- **Degraded mode:** if no proposal exists (Codex reported BLOCKED / empty / timeout), proceed
  Claude-only and stamp `production_mode: claude-only` +
  `codex_proposal_absent_reason: <timeout|empty|error>` in your artifact frontmatter. NEVER fabricate
  a proposal to stand in for Codex.
```
