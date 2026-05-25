# Promotion Manifest — session-foundations-bundle-c (Resume Wrap-up, 2026-05-25)

Session: `2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f`
Wrap-up iteration: 1 (resume after /clear; prior partial Wrap-up at commit 0e71ddb)
Authored: 2026-05-25

---

## Already-promoted items (prior Wrap-up at 0e71ddb — skip/no-op)

| Staging source | Destination | Action |
|---|---|---|
| `ideation/staging/decisions/session-dir-placed-outside-worktree.md` | `.gobbi/projects/gobbi/mistakes/session-dir-placed-outside-worktree.md` | SKIP — already promoted at 0e71ddb |
| `planning/staging/decisions/codex-subprocess-writes-to-main-tree.md` | `.gobbi/projects/gobbi/mistakes/codex-subprocess-writes-to-main-tree.md` | SKIP — already promoted at 0e71ddb |
| Per-session journal (partial) | `.gobbi/projects/gobbi/notes/2026-05-24-session-foundations-bundle-c-partial.md` | SKIP — already written at 0e71ddb; superseded by new complete journal below |

---

## New promotions (this resume Wrap-up)

### Mistake-candidates (project-scope — manager-confirmed)

| Staging source | Destination | Action |
|---|---|---|
| `execution/staging/decisions/proposed-deleting-model-instead-of-fixing-stale-mechanism.md` | `.gobbi/projects/gobbi/mistakes/proposed-deleting-model-instead-of-fixing-stale-mechanism.md` | PROMOTED (new file) |
| `execution/task-04/staging/decisions/codex-exec-at-file-hangs-on-stdin-in-background.md` | `.gobbi/projects/gobbi/mistakes/codex-exec-at-file-hangs-on-stdin-in-background.md` | PROMOTED (new file) |
| `execution/task-07/staging/decisions/executor-main-tree-edit-near-miss.md` | `.gobbi/projects/gobbi/mistakes/executor-main-tree-edit-near-miss.md` | PROMOTED (new file) |

### Backlog-candidates (project-scope)

| Staging source | Destination | Action |
|---|---|---|
| `execution/task-05/staging/backlogs/project/git-skill-stale-row-5-5-worktree-reference.md` | `.gobbi/projects/gobbi/backlogs/git-skill-stale-row-5-5-worktree-reference.md` | PROMOTED (new file) |
| `execution/task-07/staging/backlogs/project/stale-packages-cli-architecture-refs.md` | `.gobbi/projects/gobbi/backlogs/stale-packages-cli-architecture-refs.md` | PROMOTED (new file) |

### Learnings (project-scope)

| Staging source | Destination | Action |
|---|---|---|
| `execution/task-04/staging/learnings/dual-system-divergence-catches-severity-underrating.md` | `.gobbi/projects/gobbi/learnings/dual-system-divergence-catches-severity-underrating.md` | PROMOTED (new file) |
| `execution/task-05/staging/learnings/design-doc-cross-checking-authoritative-source-not-sibling-skill.md` | `.gobbi/projects/gobbi/learnings/design-doc-cross-checking-authoritative-source-not-sibling-skill.md` | PROMOTED (new file) |
| `execution/task-06/staging/learnings/f-aes-01-locked-wording-supersedes-readability-nit.md` | `.gobbi/projects/gobbi/learnings/f-aes-01-locked-wording-supersedes-readability-nit.md` | PROMOTED (new file) |
| `execution/task-07/staging/learnings/dual-system-cross-mirror-drift-detection.md` | `.gobbi/projects/gobbi/learnings/dual-system-cross-mirror-drift-detection.md` | PROMOTED (new file) |
| `execution/task-03/staging/learnings/sole-exception-phrasing-normalization.md` | `.gobbi/projects/gobbi/learnings/sole-exception-phrasing-normalization.md` | PROMOTED (new file) |

### Checklists (feature-scope: session-foundations-bundle-c)

| Staging source | Destination | Action |
|---|---|---|
| `execution/task-04/staging/checklists/hook-skill-exit-behavior-must-enumerate-all-fatal-paths.md` | `.gobbi/projects/gobbi/features/session-foundations-bundle-c/checklists/hook-skill-exit-behavior-must-enumerate-all-fatal-paths.md` | PROMOTED (new file; feature dir lazy-bootstrapped) |
| `execution/task-04/staging/checklists/skill-must-not-invent-json-field-paths-not-in-witnesses.md` | `.gobbi/projects/gobbi/features/session-foundations-bundle-c/checklists/skill-must-not-invent-json-field-paths-not-in-witnesses.md` | PROMOTED (new file) |
| `execution/task-04/staging/checklists/skill-registration-must-mirror-real-settings-shape.md` | `.gobbi/projects/gobbi/features/session-foundations-bundle-c/checklists/skill-registration-must-mirror-real-settings-shape.md` | PROMOTED (new file) |
| `execution/task-04/staging/checklists/smoke-test-payloads-must-include-all-required-env-vars.md` | `.gobbi/projects/gobbi/features/session-foundations-bundle-c/checklists/smoke-test-payloads-must-include-all-required-env-vars.md` | PROMOTED (new file) |

### Changelogs (feature-scope: session-foundations-bundle-c)

| Staging source | Destination | Action |
|---|---|---|
| `execution/task-04/staging/changelogs/2026-05-25-gobbi-hook-authoring-skill-shipped.md` | `.gobbi/projects/gobbi/features/session-foundations-bundle-c/changelogs/2026-05-25-gobbi-hook-authoring-skill-shipped.md` | PROMOTED (new file) |

### Decision cross-references (resolved inline — no separate file created)

| Staging source | Action | Rationale |
|---|---|---|
| `execution/task-03/staging/decisions/claude-md-gobbi-mistake-promote-residual-xref.md` | RECORDED-AS-RESOLVED (no new project-memory file) | This file was a cross-reference noting the CLAUDE.md `gobbi mistake promote` residual was owned by T07. T07 is now DONE (commits `f2356ca`, `6bf792a`). The decision was recorded as `status: deferred` pending T07 confirmation; T07's completion resolves it. No standalone project-memory decision file is warranted — it was a tracking note, not a design decision. Routing table row: `staging/decisions/{slug}.md` (no special frontmatter) → `features/{feature-name}/decisions/{slug}.md`. Deviation justified: the file itself says "no new backlog entry created here" and its only purpose was to confirm T07 coverage at Wrap-up, which is now confirmed. |

### Feature directory bootstrap

| Action |
|---|
| Created `.gobbi/projects/gobbi/features/session-foundations-bundle-c/` with sub-dirs: `checklists/`, `changelogs/`, `mistakes/`, `decisions/`, `backlogs/`, `scenarios/`, `references/`, `design/`, `discussions/`, `plans/` |
| Created `.gobbi/projects/gobbi/features/session-foundations-bundle-c/README.md` |

### Session journal

| Action |
|---|
| Created `.gobbi/projects/gobbi/notes/2026-05-25-session-foundations-bundle-c-complete.md` (supersedes `2026-05-24-session-foundations-bundle-c-partial.md`) |
| Updated `2026-05-24-session-foundations-bundle-c-partial.md` in-place with `status: superseded` + `superseded_by:` frontmatter |

---

## Step 2.5 — Prior-loop MEMORIZATION compliance scan

Relevant loops scanned for staging content:

| Loop | Staging status |
|---|---|
| `ideation/staging/` | Contained `decisions/session-dir-placed-outside-worktree.md` — already promoted at 0e71ddb |
| `preparation/staging/` | Contains `skills/gobbi-hook-authoring/SKILL.md` — already promoted by manager before Planning (manager note in HANDOFF). Wrap-up verifies presence at `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md`. |
| `planning/staging/` | Contained `decisions/codex-subprocess-writes-to-main-tree.md` + `plans/` entries — mistakes already promoted at 0e71ddb |
| `execution/staging/` | 1 decisions file — promoted this run |
| `execution/task-03/staging/` | 1 decisions (xref, resolved) + 1 learnings — both accounted for |
| `execution/task-04/staging/` | 4 checklists + 1 changelog + 1 decisions (mistake) + 1 learnings — all promoted |
| `execution/task-05/staging/` | 1 backlogs/project + 1 learnings — both promoted |
| `execution/task-06/staging/` | 1 learnings — promoted |
| `execution/task-07/staging/` | 1 backlogs/project + 1 decisions (mistake) + 1 learnings — all promoted |

No `zero-staging`, `directory-absent`, `shape-mismatch`, or `template-mismatch` gaps found in the new T03-T07 staging files. All staging files have required frontmatter. No NEEDS_CONTEXT escalation required.

Non-promotable rawdata (eval prompts, draft files, evaluation perspective files, artifacts) — ignored per wrap-up discipline (rawdata is not staging-for-promotion).
