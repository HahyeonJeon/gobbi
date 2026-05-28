# Wave 1 Executor Notes — iter1

## Summary

W1-T1, W1-T2, W1-T3 all implemented and committed. 3 focused commits.

## W1-T1 Notes

- 17 mistake files had staging flags (mistake-candidate, promoted-from, promoted-at, finding-id, disposition).
- 4 additional non-candidate files lacked base fields: codex-subprocess-writes-to-main-tree.md, handoff-verdict-claim-not-matched-to-on-disk-eval.md, session-dir-placed-outside-worktree.md (and skills-mirror-symlinks-not-copies which was already compliant).
- Total 20 files modified.
- `session` field: files used bare UUID (e.g., `1b26cf20-677b-498c-8c1b-7d7e971597ac`) not the date-prefixed form (consistent with manager-skipped-dual-system-eval.md which already had proper format).
- `status: accepted` → `status: active` (only valid mistake status values are active/superseded per §2.2).
- Kept: priority, domain, supersedes, superseded_by (all in mistakes extension allowlist).
- Dropped: loop, iter, feature (non-allowlist sprint metadata), severity, confidence, surfaced-by, addressed-in (not in allowlist).

**ONE CONCERN (false positive in verify):** `memorization-delegation-prompts-must-load-memorization-skill.md` body contains the text `mistake-candidates` (line 67, pluralized, as a cross-reference to the SKILL.md concept). The verify `grep -rl "mistake-candidate" mistakes/ | wc -l` returns 1, not 0, because `mistake-candidate` is a substring of `mistake-candidates`. The frontmatter key `mistake-candidate: true` has been removed (confirmed `grep -rl "^mistake-candidate:"` returns 0). This is a body text false-positive in the verify command, not a staging flag leak.

## W1-T2 Notes

- Added 13-field base frontmatter block.
- `established` key used (rules extension allowlist includes `established`).
- `created: 2026-05-21` — inferred from Wave A.2 (PR #151) origin date in the file body.
- Rewrote "No frontmatter" bullet to scope it explicitly to "stub-redirect TARGET docs" (published .claude/ redirect stubs), not project-memory files.
- FLAG-3 (the `_claude/SKILL.md` reference in Related section) is an out-of-scope finding documented in design §11.

## W1-T3 Notes

- `design/archive-move-on-terminal-model.md`: `supersedes` had prose value "the in-place archive model formerly documented in memorization/templates/archive.md" — not a path-pointer. Set to `null` per allowlist (design extension `supersedes` should be a file path reference). The prose context is preserved in the body.
- `design/session-lifecycle-worktree-boundaries.md`: session determined from learnings files referencing task-05 from session `45388fa9`.
- All 5 learnings files: dropped promoted-from, promoted-at, related (not in learnings allowlist), eval-routing fields.
- Bounded sweep (design/ learnings/ rules/ backlogs/) = 0 files missing frontmatter after fixes.
- f-aes-01 filename NOT renamed (W2-T2 scope).

## Scope Confirmation

git diff --name-only W1-T1..HEAD shows ONLY: mistakes/ (20 files), rules/stub-redirect-format.md, design/ (2 files), learnings/ (5 files). No features/, sessions/, skills/ touched.
