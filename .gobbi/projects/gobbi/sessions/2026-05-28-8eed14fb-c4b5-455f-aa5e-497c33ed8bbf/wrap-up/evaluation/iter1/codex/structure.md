VERDICT: REVISE

# Structure Perspective - Wrap-up iter1

## Artifact Summary

**What:** Evaluate the structural shape of the wrap-up outputs and project-memory writes. **Why:** Wrap-up is not only a summary; it must leave deterministic audit files and valid memory documents. **How:** I checked the wrap-up directory tree, current-session staging trees, promoted memory frontmatter, archive paths, and the memory rules standard.

Memory reads:
- `.agents/skills/wrap-up/SKILL.md`
- `.agents/skills/wrap-up/evaluation.md`
- `.agents/skills/memorization/rules.md`
- `.gobbi/projects/gobbi/notes/2026-05-28-chat-auto-mode-redesign.md`
- `.gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md`
- `sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/wrap-up/artifacts/handoff.md`

## Locked Frame (Stage 1)

Scenario 1 - Required wrap-up rawdata audit files exist.
- Check 1.1: `rawdata/pre-wrap-up-snapshot.txt` exists.
- Check 1.2: `rawdata/staging-inventory.md` exists.
- Check 1.3: `rawdata/promotion-manifest.md` exists.
- Check 1.4: Empty staging, if intentional, is still recorded explicitly.

Scenario 2 - Project-memory files follow memory schema.
- Check 2.1: New backlog carries base frontmatter.
- Check 2.2: New note carries base frontmatter (`name`, `description`, `type`, `scope`, `feature`, `status`, `created`, `session`, `tags`).
- Check 2.3: Promoted archive files preserve archive extensions.

Scenario 3 - Directory placement follows the documented routing surface.
- Check 3.1: Journal is under `.gobbi/projects/gobbi/notes/`.
- Check 3.2: New backlog is under `.gobbi/projects/gobbi/backlogs/`.
- Check 3.3: Closed backlogs are under `.gobbi/projects/gobbi/archive/backlogs/`.

Scenario 4 (adversarial) - A wrap-up can look complete while its audit trail is missing.
- Check 4.1: `find wrap-up -maxdepth 3 -type f` lists the audit outputs, not only the handoff and evaluator prompt.

## Per-scenario per-check results

| Check | Result | Evidence |
|---|---|---|
| 1.1 | no | `find wrap-up -maxdepth 3 -type f` listed only `artifacts/handoff.md` and `rawdata/codex-eval-prompt-iter1.md`. |
| 1.2 | no | `sed` on `rawdata/staging-inventory.md` failed: No such file or directory. |
| 1.3 | no | `sed` on `rawdata/promotion-manifest.md` failed: No such file or directory. |
| 1.4 | no | Current-session `find ... -path '*/staging/*' -type f` returned no files, but no inventory/manifest records that empty result. |
| 2.1 | yes | New backlog includes base fields including `name`, `description`, `type`, `scope`, `feature`, `status`, `created`, `session`, `tags`. |
| 2.2 | no | Journal note frontmatter has `type`, `project`, `session`, `date`, `title`, `tags`; it lacks `name`, `description`, `scope`, `feature`, `status`, and `created`. |
| 2.3 | yes | Archive files carry `status: closed`, `disposition: addressed`, `archived_at`, `archive_reason`, and `shipped_in`. |
| 3.1 | yes | Journal path is `.gobbi/projects/gobbi/notes/2026-05-28-chat-auto-mode-redesign.md`. |
| 3.2 | yes | New backlog path is `.gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md`. |
| 3.3 | yes | Both closed backlogs are under `.gobbi/projects/gobbi/archive/backlogs/`. |
| 4.1 | no | Rawdata audit files are absent despite wrap-up WORK exit checklist requiring them. |

## Typed findings

### COD-STRUCT-001 - Wrap-up audit inventory and promotion manifest are missing

- Type: `checklist_gap`
- Domain: `process`
- Confidence: 100
- Severity: High
- Disposition: open
- Evidence: `find <session>/wrap-up -maxdepth 3 -type f` returns only `artifacts/handoff.md` and `rawdata/codex-eval-prompt-iter1.md`; `rawdata/staging-inventory.md` and `rawdata/promotion-manifest.md` do not exist.
- Why this matters: `wrap-up/SKILL.md` requires the inventory and manifest so every staging file is accounted for as promoted, backlogged, or dropped. Even when staging is empty, the empty result needs a durable audit record.

### COD-STRUCT-002 - Journal note frontmatter does not satisfy the memory base schema

- Type: `general`
- Domain: `project-memory`
- Confidence: 100
- Severity: Medium
- Disposition: open
- Evidence: `.gobbi/projects/gobbi/notes/2026-05-28-chat-auto-mode-redesign.md` has `type`, `project`, `session`, `date`, `title`, `tags` but lacks required base fields from `memorization/rules.md` section 2.1: `name`, `description`, `scope`, `feature`, `status`, `created`.
- Why this matters: The note is durable project memory. Future tooling that expects the base schema will not be able to treat it uniformly with other memory files.

## Low-confidence appendix

None.
