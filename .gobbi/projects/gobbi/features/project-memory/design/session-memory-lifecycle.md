---
name: session-memory-lifecycle
description: End-to-end session-memory lifecycle: born ephemeral, promoted to finalized notes record, deterministic telemetry
type: design
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [session-memory, lifecycle, notes, ephemeral]
supersedes: null
superseded_by: null
related:
  - design/session-lifecycle-worktree-boundaries.md
  - design/memory-system-redesign.md
  - features/git-workflow/design/per-iteration-session-commit-cadence.md
---

# Session-memory lifecycle redesign

## Problem

Three root causes make the current session-memory system incorrect:
1. `sessions/` leaks 2737 ephemeral files into git history — not gitignored, not output-not-source.
2. Metadata recording is convention-only with no gate — `sessionTotal=0` was shipped and backfilled by hand.
3. Session staging grew deep positional-slug paths against the project's own naming standard.

## Scope

In-scope: gitignore `sessions/`; define the finalized `notes/{date}-{slug}-{ssid}/` record; flatten session staging paths; capture transcripts ephemerally; make metadata deterministic via hooks; build a generator.

Out-of-scope: `skills/agents/` relocation (L8 deferral); retro-migrating existing session dirs; Codex token-capture implementation beyond a research spike.

## Approach

**Active-vs-finalized axis:** `sessions/` is active working memory (ephemeral, gitignored, discarded with the worktree). `notes/` is finalized session memory (the durable record, promoted at Wrap-up).

**8 decisions (D1–D8)** govern the full lifecycle:
- D1: retire the D-4 per-iteration session-commit cadence (including the full `git-workflow` D-4 cluster). Wrap-up is the only durable point.
- D2: `notes/{date}-{slug}-{ssid}/` is loop-symmetric: one `.md` per loop + `README.md` + `settings.json` + `session.json`.
- D3: flatten `staging/backlogs/{feature,project}/{slug}` → `staging/backlogs/{slug}` with `scope:` frontmatter; extend `rules.md § 1.3` to the session tier.
- D4: raw `.jsonl` to ephemeral `sessions/.../transcripts/` for debugging; sensitivity class = session-local debug data; removed with the worktree; never to `notes/`.
- D5: PostToolUse writes real subagent cumulative tokens (reads own complete transcript); SessionEnd/Stop hook writes the manager rollup + `usage.sessionTotal`.
- D6: Codex metadata research-then-implement (Planning spike).
- D7: bash+jq template-tree generator, callable from `session-start.sh`.
- D8: `git rm -r --cached` 2737 tracked session files; nothing deleted; files stay on disk.

## Scenarios

See the canonical artifact `ideation/artifacts/ideation-design.md § Scenarios` (S1–S9).

## Validation

5 measurable success criteria: gitignore check, D2 record completeness, telemetry non-zero, structural symmetry, hook latency gate. See `ideation/artifacts/ideation-design.md § Scope Contract § Success Criteria`.

## Trade-offs

- **Abort-by-design:** a session that aborts before Wrap-up loses in-flight working memory. This is the explicit design trade (S6). The D-4 per-iteration commit cadence provided abort-recovery; retiring it means accepting this loss.
- **Two `notes/` shapes:** flat journal files + record directories coexist. The `-{ssid}` suffix disambiguates. See `staging/decisions/2026-06-08-notes-mixed-shape-coexistence.md`.
- **PostToolUse hook is heavier:** it now sums a full agent transcript every fire. The 500ms-p99 latency gate must be verified before ship.

## Open issues

- SessionEnd/Stop hook existence is unverified (Planning must gate). See `staging/decisions/2026-06-08-session-end-hook-existence-assumption.md`.
- Worktree-path resolution in PostToolUse hook must be verified (the prior agents decision identified this as a known constraint).
