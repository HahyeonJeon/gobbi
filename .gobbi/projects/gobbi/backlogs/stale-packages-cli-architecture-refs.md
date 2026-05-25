---
title: "Stale packages/cli + CLI-init architecture references in gobbi/SKILL.md + delegation template"
name: stale-packages-cli-architecture-refs
type: backlog
severity: medium
confidence: 90
scope: project
source: session-2026-05-24-45388fa9-T07-iter2-codex-eval (OVERALL-001)
disposition: addressed
status: addressed
created: 2026-05-25
feature: session-foundations-bundle-c
promoted-from: sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/execution/task-07/staging/backlogs/project/stale-packages-cli-architecture-refs.md
promoted-at: 2026-05-25
---

# Stale `packages/cli` / CLI-init architecture references survive the v0.5.0 markdown-driven redesign

## Context

Surfaced by the Codex evaluator during T07 iter2 confirmation (finding OVERALL-001, High/90). T07 fully eradicated the `gobbi mistake promote` CLI defect tree-wide and reconciled `CLAUDE.md` line 13's `packages/cli`/`gobbi workflow init` refs. But Codex found a RELATED, distinct stale-reference class — `packages/cli` architecture citations + "CLI init" labels — still present in other docs. `packages/cli/` was wiped (commit e083fad) and the workflow is now markdown/skill-driven (no CLI).

User decision (2026-05-25): out of T07's contracted scope; deferred to this follow-up backlog rather than rushed into Bundle C's final commit. The `gobbi/SKILL.md:74` ref in particular needs investigation, not a mechanical reword (see below).

## The stale references (3 known)

1. **`.gobbi/projects/gobbi/skills/gobbi/SKILL.md:74`** (security/sanitization note) — cites the sanitizer as "the CLI's settings-IO seam (`packages/cli/src/lib/config/settings-io.ts`, project-name validator)". `packages/cli` is absent. **Needs investigation**: what (if anything) performs project-name/slot sanitization in the current markdown-driven design? The reword must state the real current mechanism (or explicitly say no automated seam exists and untrusted values must be sanitized at the consumer) — not just delete the path. This is a security-relevant claim; do not reword inaccurately.
2. **`.gobbi/projects/gobbi/skills/gobbi/SKILL.md:129`** (Workflow Overview table) — labels the Configuration step as "CLI init". Configuration is now the session-init phase governed by the orchestration skill, not a CLI step. Mechanical reword (e.g. "session init" / "CLI/session bootstrap" per current truth).
3. **`.gobbi/projects/gobbi/skills/delegation/templates/assistant.md:14`** — an illustrative example prompt references `packages/cli/src/`. Lowest stakes (fictional example), but retains a dead path; swap for a live example path.

## Suggested approach

- Audit ALL real (non-symlink) entry/skill/template docs for `packages/cli`, "CLI init", and "gobbi <subcommand>" CLI-era framing (grep `packages/cli|CLI init|gobbi (workflow|mistake|config) `). The 3 above are the known hits; confirm there are no others.
- For `:74`, first determine the current sanitization reality (is there a validator? where?), then reword accurately. Coordinate with the gobbi-config / settings work if a real seam exists elsewhere.
- For `:129` and the delegation example, mechanical rewords.
- Same drift class as issue #258 (cross-doc drift detector) — a detector would have caught these.

## When to pick up

A dedicated docs-cleanup session (or fold into the next gobbi-config / release-prep pass). Not urgent — the user-flagged mistake-promote defect is already fully resolved.

## Resolution

Fixed in PR #270 (session 2026-05-24-45388fa9 / follow-up FU-2, 2026-05-25):

- `gobbi/SKILL.md:74` sanitization note corrected: investigation confirmed `packages/` directory is absent and no automated sanitization seam replaced the v0.4.x `packages/cli` settings-IO validator; note now states no automated seam exists and slot values must be treated as untrusted at the point of interpolation.
- `gobbi/SKILL.md:129` Workflow Overview table: "CLI init" relabeled to "session init"; "workflow init" relabeled to "workflow configuration" to match the markdown-driven reality.
- `delegation/templates/assistant.md:14` example path changed from dead `packages/cli/src/` reference to live `.gobbi/projects/gobbi/skills/` path.
