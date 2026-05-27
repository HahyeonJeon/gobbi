# T2 Execution Notes — 02-conform-evaluation

## Summary

All 15 `features/evaluation/` docs brought into conformance with §4 of `memorization/rules.md`.

## Work performed

### §4.4 FIX-1 — Staging-key strip

Docs that carried illegitimate S-set keys before (8 files from §4.5 gate + 5 with disposition leak):

| File | Keys stripped |
|---|---|
| `decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md` | `promoted-from`, `promoted-at`, `mistake-candidate`, `slug`, `title`, `domain`, `type` (was design_flaw→decisions), `disposition`, `loop`, `project`, `date`, `related` |
| `decisions/constraints-body-block-convention-deferred-to-planning.md` | `promoted-from`, `promoted-at`, `finding-id`, `finding-type`, `severity`, `confidence`, `disposition`, `domain`, `date` |
| `decisions/constraints-body-block-kept-per-h2-lock.md` | `promoted-from`, `promoted-at`, `mistake-candidate`, `slug`, `title`, `domain`, `type` (was design_flaw→decisions), `disposition`, `loop`, `project`, `date` |
| `decisions/coverage-ownership-matrix-row-text.md` | `promoted-from`, `promoted-at`, `mistake-candidate`, `slug`, `title`, `domain`, `type` (was design_flaw→decisions), `disposition`, `loop`, `project`, `date` |
| `design/codex-skill-structure.md` | `promoted-from`, `promoted-at`, `loop`, `iter`, `topic`, `date` |
| `design/naming-convention-enforcement.md` | `promoted-from`, `promoted-at`, `loop`, `iter`, `topic`, `date` |
| `discussions/codex-invocation-priority-redirect.md` | `promoted-from`, `promoted-at`, `loop`, `iter`, `topic`, `date` |
| `references/five-type-vocabulary.md` | `promoted-from`, `promoted-at`, `disposition`, `slug`, `title`, `domain`, `loop` |

### Base frontmatter additions (9 base keys)

Docs with missing base keys, and what was added:

| File | Added |
|---|---|
| `changelogs/2026-05-26-bundle-a-rehome.md` | `name`, `description`, `type: changelogs`, `created`, `tags` |
| `decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md` | `name`, `description`, `tags` (type corrected to `decisions`) |
| `decisions/constraints-body-block-convention-deferred-to-planning.md` | `name`, `description`, `type: decisions`, `created`, `tags` |
| `decisions/constraints-body-block-kept-per-h2-lock.md` | `name`, `description`, `tags` (type corrected to `decisions`) |
| `decisions/coverage-ownership-matrix-row-text.md` | `name`, `description`, `tags` (type corrected to `decisions`) |
| `design/codex-skill-structure.md` | `name`, `description`, `type: design`, `created`, `tags` |
| `design/naming-convention-enforcement.md` | `name`, `description`, `type: design`, `created`, `tags` |
| `discussions/2026-05-24-codex-iter2-blocked-aggregation.md` | `name`, `description`, `type: discussions`, `status`, `created`, `tags` |
| `discussions/codex-invocation-priority-redirect.md` | `name`, `description`, `type: discussions`, `created`, `tags` |
| `discussions/eval-fail-revise-escalation.md` | `name`, `description`, `type: discussions`, `status`, `created`, `tags` |
| `discussions/eval-pass-loop-closed.md` | `name`, `description`, `type: discussions`, `status`, `created`, `tags` |
| `README.md` | `name`, `description`, `type: features`, `session`, `tags` |
| `references/five-type-vocabulary.md` | `name`, `description`, `tags` + references extension fields (`title`, `source`, `accessed`, `ref_type`) |

Docs already conformant (no missing base keys, no staging leaks):
- `changelogs/2026-05-26-bundle-b-rehome.md` — already had all 9 base keys, no S-set keys
- `decisions/codex-exec-universal-invocation-pattern.md` — already had all 9 base keys, no S-set keys

### §4.3 Body de-crypting

Session-internal coordinate references converted to self-contained prose in all evergreen-type docs:
- `iter1 user-redirects bundle (Decision 2)` → `bundled user-redirect record`
- `Ideation iter3, Planning iter1 attempt 1` (and similar) → removed iteration coords
- `Task 06 (T06) Execution` → `codex-skill Task 06 brief` / `Commit b9970dc`
- `Decisions Locked row 14` → removed, statement preserved
- `idea.md:294-296`, `draft-iter2.md Decision Log row P3`, `rawdata/draft-iter3.md:519-537` → self-contained prose
- `iter1-user-redirects.md § Decision 2` → removed from Source footer
- `D-3-3-resolver`, `d-1-worktree-row-5-5.md` → de-crypted as "project-json resolver design"
- Finding IDs `COD-*`, `F-*`, `CLAUDE-*` in eval-pass-loop-closed → replaced with prose descriptions
- `Anchored insights: I1, I2...` codes → removed
- `W3-T3`, `W3-T5`, `§8 LOW-16` → de-crypted to plain English
- `design §1.2, RATIFY-1 / L1` → de-crypted

## Out-of-scope observations

1. Several `decisions/` docs carry extra non-base/non-extension fields (`slug`, `title`, `domain`, `loop`, `project`, `date`) that are not in S but also not in the §2.2 declared extension set for decisions. §4.4 FIX-1 only strips S-set keys; a full "only-allowlist" pass is a separate wave.

2. `decisions/constraints-body-block-convention-deferred-to-planning.md` and `decisions/constraints-body-block-kept-per-h2-lock.md` cover the same resolution from two angles (one from Ideation/Preparation, one from Planning). A future atomicity review could consider whether these should be merged.

3. `changelogs/2026-05-26-bundle-a-rehome.md` had `task: memory-redesign W3-T2` and `plan: null` — not S-set keys but non-standard. Dropped as part of frontmatter replacement.

## Verification results

1. §4.5 leak gate: 0 files (was 8)
2. 15/15 docs carry all 9 base keys
3. No backlogs exist in evaluation — no legitimate disposition to preserve
4. `git diff --name-only` lists exactly 15 paths, all under `features/evaluation/`
