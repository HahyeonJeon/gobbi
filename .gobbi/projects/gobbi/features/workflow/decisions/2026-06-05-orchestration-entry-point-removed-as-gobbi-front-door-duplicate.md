---
name: orchestration-entry-point-removed-as-gobbi-front-door-duplicate
description: Remove the Entry Point section from orchestration/SKILL.md — it duplicated gobbi/SKILL.md, the canonical session-bootstrap front door
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-05
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [orchestration, docs-sync, workflow]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Remove `## Entry Point` from `orchestration/SKILL.md` — Duplicate of `gobbi/SKILL.md` Front Door

## Context

`orchestration/SKILL.md` contained a `## Entry Point` section (with a `### When to start here` subsection) that directed agents to start orchestration from that skill. It also had an `## Orchestration Mode` section with a CORRECTION blockquote and Chat / Auto subsections.

PR #262 (closing issue #259, the "entry-point SOP" follow-up from PR #260) had **deliberately added** `## Entry Point` to `orchestration/SKILL.md` as the canonical session-bootstrap anchor, with reciprocal pointers from `skills/gobbi/SKILL.md` and `agents/manager.md`. This decision **reverses** that addition.

The conflict: `gobbi/SKILL.md` is already the canonical session-bootstrap front door — the entry point for every session, resume, `/clear`, and `/compact` load. Having `orchestration/SKILL.md` also claim an Entry Point section created two competing front doors, and a future agent or session could incorrectly treat orchestration as a bootstrap starting point.

## Decision

Remove `## Entry Point` (and its `### When to start here` child) from `orchestration/SKILL.md`. The `## You Are the Manager` section becomes the new lead section. Collapse `## Orchestration Mode` — fold the CORRECTION blockquote + Chat / Auto subsections into a 2-bullet list. Rewrite the frontmatter `description` to lead with the workflow-governor framing. Repoint the two inbound references that had targeted `#entry-point`.

**WARNING for future sessions:** This reverses the deliberate addition made in PR #262 (closed issue #259). Do not re-add `## Entry Point` to `orchestration/SKILL.md` without re-reading this decision and PR #262's rationale. The canonical entry point lives in `gobbi/SKILL.md` — that is its job, not orchestration's.

## Rationale

The user judged `## Entry Point` in `orchestration/SKILL.md` duplicative of `gobbi/SKILL.md`. `gobbi/SKILL.md` is the canonical session-bootstrap front door (loaded at session start, resume, `/clear`, and compaction). Placing an equivalent entry-point claim in `orchestration/SKILL.md` fragments the canonical path, and the evaluator confirmed no load-bearing content was lost by the removal:

- The 3-tier bootstrap-detection table survives in `orchestration/SKILL.md` at Step 1 (it was never inside `## Entry Point` itself).
- The CORRECTION blockquote's design facts are canonically owned by `chat-mode.md` — they need not be duplicated in both `orchestration/SKILL.md` and `chat-mode.md`.

The user confirmed 3 decisions via AskUserQuestion:
1. Frontmatter `description` wording — accepted the workflow-governor framing.
2. Repoint target for the two inbound references — `#you-are-the-manager` chosen (later superseded in task 02 — see "Update — task 02" — when the `## You Are the Manager` heading was itself removed and the links were repointed to the skill top with no fragment).
3. Mode-collapse shape — 2-bullet list chosen over an H3 subsection.

## Alternatives considered

- **Keep `## Entry Point` in orchestration/SKILL.md** — rejected by the user as duplicative of `gobbi/SKILL.md`. Having two entry-point claims creates an ambiguous front door.
- **Merge the two entry-point sections into one canonical block** — not needed because `gobbi/SKILL.md` already covers bootstrap comprehensively; the orchestration skill's job is workflow governance after bootstrap, not the bootstrap itself.

## Consequences

1. `orchestration/SKILL.md` no longer claims to be a session-bootstrap entry point. After task 02 (below), its lead content is the headingless manager-role opening paragraph directly under the `# Orchestration` title.
2. The two files that referenced `#entry-point` were first repointed to `#you-are-the-manager` (task 01), then — after the `## You Are the Manager` heading was removed in task 02 — repointed to the orchestration skill **top with no fragment**:
   - `skills/gobbi/SKILL.md`: now `[`orchestration` skill](../orchestration/SKILL.md)` (fragment-less) — "is the workflow governor".
   - `agents/manager.md`: now "Start at the top of the `orchestration` skill".
3. Future agents who look for the session-bootstrap entry point are directed only to `gobbi/SKILL.md`, not orchestration.
4. Any future attempt to re-add `## Entry Point` to `orchestration/SKILL.md` must first read this decision and PR #262 to confirm the duplication concern no longer applies.

## Update — task 02 (commit `df87f60`)

In the same session, task 02 polished the opening and **removed the `## You Are the Manager` heading entirely**, so the manager-role content now opens the skill with no heading, directly under the `# Orchestration` title. This invalidated the `#you-are-the-manager` anchor that task 01 had just created, so the two inbound links were repointed again — this time to the orchestration skill **top, with no fragment** (robust against future heading changes). The frontmatter `description` was also rewritten to: "How a manager orchestrates subagents and tasks across a Claude or Codex session." Net end-state across tasks 01+02: `orchestration/SKILL.md` opens with the title, then the manager-role paragraph (no `## You Are the Manager` heading), then `## Orchestration Mode` (2-bullet list), then `## Workflow`.

## Related

- Implemented in commits `9a2b7ff` (task 01) and `df87f60` (task 02) on session `2026-06-05-06668274-cee3-4bc0-9125-91a327467cd2`.
- Reverses the addition made in PR #262 (commit `487fc35`), which closed issue #259 (the "entry-point SOP" follow-up).
- See `[[project_pr262_entry_point_sop_shipped]]` in project memory for the rationale behind the original PR #262 addition.
