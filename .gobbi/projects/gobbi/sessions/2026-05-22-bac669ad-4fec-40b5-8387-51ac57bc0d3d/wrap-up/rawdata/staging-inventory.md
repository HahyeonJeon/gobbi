---
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
loop: wrap-up
step: rawdata
created: 2026-05-22
---

# Staging Inventory — All Prior Loops

Master inventory of every staging file across Ideation / Preparation / Planning / Execution loops. Each entry includes loop, path, type (derived from staging sub-directory), and disposition (see promotion-manifest.md).

---

## Ideation

| Path | Type | Disposition |
|---|---|---|
| `ideation/staging/backlogs/project/f-struct-01-jq-sh-env-passthrough.md` | backlog/project | PROMOTE → `backlogs/f-struct-01-jq-sh-env-passthrough.md` |
| `ideation/staging/backlogs/project/f-risk-01-subagent-ccsi-semantics.md` | backlog/project | PROMOTE → `backlogs/f-risk-01-subagent-ccsi-semantics.md` |
| `ideation/staging/decisions/ideation-decisions.md` | decisions (no mistake-candidate frontmatter) | PROMOTE → `features/env-var-audit/decisions/ideation-decisions.md` |
| `ideation/staging/discussions/ideation-discussion.md` | discussions | PROMOTE → `features/env-var-audit/discussions/ideation-discussion.md` |
| `ideation/staging/references/ideation-references.md` | references | PROMOTE → `features/env-var-audit/references/ideation-references.md` |

---

## Preparation

| Path | Type | Disposition |
|---|---|---|
| `preparation/staging/decisions/preparation-decisions.md` | decisions (no mistake-candidate frontmatter) | PROMOTE → `features/env-var-audit/decisions/preparation-decisions.md` |

---

## Planning

| Path | Type | Disposition |
|---|---|---|
| `planning/staging/decisions/planning-decisions.md` | decisions (no mistake-candidate frontmatter) | PROMOTE → `features/env-var-audit/decisions/planning-decisions.md` |

---

## Execution

| Path | Type | Disposition |
|---|---|---|
| `execution/T1/staging/decisions/t1-decisions.md` | decisions (no mistake-candidate frontmatter) | PROMOTE → `features/env-var-audit/decisions/t1-decisions.md` |

---

## Mistake-candidates (from delegation prompt — authored in Wrap-up WORK, not from prior staging)

These 2 entries were provided in the Wrap-up delegation prompt as mistakes to create and promote. They were authored directly in Wrap-up WORK (the sole project-memory writer) and promoted to `mistakes/` per the routing table (project-scope confirmed by manager in delegation prompt).

| Slug | Destination |
|---|---|
| `codex-eval-session-write-path-nested-in-worktree` | `mistakes/codex-eval-session-write-path-nested-in-worktree.md` |
| `manager-rm-rf-without-investigating-tracked-files` | `mistakes/manager-rm-rf-without-investigating-tracked-files.md` |

---

## Summary counts

- Staging files from prior loops: 5
- Mistake-candidates (Wrap-up authored): 2
- Total items accounted for: 7
- All items have a disposition entry in promotion-manifest.md.
