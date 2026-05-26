---
name: iter1-user-redirects
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: ideation
phase: discussion-post-WORK
iter: 1
captured-by: manager
captured-at: 2026-05-23T05:00:00Z
mistake-candidate: false
disposition: addressed
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/decisions/iter1-user-redirects.md
promoted-at: 2026-05-23T14:00:00Z
status: superseded
superseded_by: [decisions/wrap-up-step-2-5-escalation-default.md, decisions/codex-exec-universal-invocation-pattern.md]
archive_reason: "Bundle file (2 decisions) split to one-concept-per-file per blocklist #11; memory-redesign W2-T3."
archived_at: 2026-05-26
---

# Iter1 user redirects (post-WORK DONE_WITH_CONCERNS resolution)

After leader's iter1 draft returned DONE_WITH_CONCERNS, manager surfaced two design-decision concerns to user. Resolutions below.

## Decision 1 — Wrap-up Step 2.5 escalation default

**User answer**: "Auto-backfill and NEEDS_CONTEXT for design or decision."

**Interpretation**: Hybrid (Option 3 in the manager's question card).
- **Auto-backfill** when the gap is mechanical / routing-deterministic — e.g., a `scenario_gap` finding routes to `staging/scenarios/{slug}.md` deterministically per `evaluation/SKILL.md § Finding Metadata`. Assistant writes the staging file from the finding's content.
- **NEEDS_CONTEXT** when the gap involves a design choice or decision — e.g., a `design_flaw` finding that flags a routing ambiguity, a finding with `disposition: open` requiring user arbitration, or a finding that spans multiple staging subdirs and needs user to pick the canonical destination.

**Implementation impact on Design D**: leader must respec Step 2.5 to:
1. Classify each detected gap as `mechanical` or `judgment-required`.
2. Auto-fill `mechanical` gaps inline.
3. Aggregate `judgment-required` gaps into a single NEEDS_CONTEXT surfacing.
4. Document the classification rules in `wrap-up/SKILL.md` so users can audit the assistant's gap-classification.

## Decision 2 — Codex skill invocation priority

**User answer**: "I think it's better for subagents to use codex cli command like 'codex exec'. Manager too. I think we need to check if subagents can use codex plugin skills. I remember there were some blocks."

**Interpretation**: `codex exec` via Bash is the UNIVERSAL primary pattern, including for the manager. Plugin agents are secondary.

**Manager empirical investigation (resolving user's open question)**:

- `.claude/agents/{leader,executor,evaluator,assistant}.md` confirm tool surfaces — NONE include the Agent tool. Subagents lack Agent tool → cannot spawn `codex:codex-rescue` plugin agent.
- `.claude/agents/manager.md` has `tools: "*"` — only the manager can spawn `codex:codex-rescue`.
- `~/.claude/plugins/cache/openai-codex/codex/1.0.2/agents/codex-rescue.md` is itself `tools: Bash` — even the plugin agent is a thin Bash wrapper around `codex exec`.
- `codex-cli 0.133.0` is installed at `/home/jeonhh0061/.nvm/versions/node/v22.22.1/bin/codex`. `codex exec` available with `--cd`, `--add-dir`, sandbox modes, `-c` config overrides.
- The "blocks" the user remembered are: **subagents cannot spawn plugin agents because they lack the Agent tool**. This is the empirical witness.

**Implementation impact on Design A**: leader must respec the codex skill to:
1. **Primary pattern (universal — manager AND subagents)**: `codex exec` via Bash.
2. **Secondary pattern (manager-only)**: `Agent(subagent_type="codex:codex-rescue", ...)` for ad-hoc rescue / second-opinion work.
3. **Anti-pattern**: trying to spawn a codex plugin agent from a subagent context.
4. **User-action pattern**: `/codex:adversarial-review` is `disable-model-invocation: true` — neither manager nor subagent can invoke.

## Concerns resolved without user input (deterministic verification)

- **Concern 1 (file path)**: No `orchestration/workflow/configuration.md` exists; `orchestration/SKILL.md § Step 1` is authoritative. Auto-resolved.
- **Concern 4 (symlink direction)**: Source-of-truth is `.gobbi/projects/gobbi/skills/codex/SKILL.md`; symlink at `.claude/skills/codex/SKILL.md`. Auto-resolved.
- **Concern 6 (provenance phrasing)**: Deferred to Planning.

## Concerns remaining (Planning-phase)

- **Concern 3 (E matrix row text)**: Exact wording deferred to Planning DISCUSSION (resolved as Draft A at Planning iter2).
