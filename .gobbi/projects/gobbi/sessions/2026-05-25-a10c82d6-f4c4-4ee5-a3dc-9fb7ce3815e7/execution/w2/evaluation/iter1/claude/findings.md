# Wave 2 (slug renames + bundle splits) — Claude Adversarial Evaluation, iter1

Perspective: consistency (memory-redesign W2). Target: `8cead69..HEAD` (6 commits 9bf2781..3c60e11).
Branch verified: `chore/session-2026-05-25-a10c82d6`. All checks run with own tools (git/ls/grep/find).

## Contract checks — RESULT TABLE

| # | Check | Expect | Got | Pass |
|---|---|---|---|---|
| W2-T1 | `ls backlogs/ \| grep -c '^item-'` | 0 | 0 | YES |
| W2-T1 | 5 concept slugs present | 5 | 5 (auto-mode-silence, broader-delegation, skill-loading, symlink-into-worktree, two-surface) | YES |
| W2-T2 | `ls learnings/ \| grep -c 'f-aes-01'` | 0 | 0 | YES |
| W2-T2 | learning concept slug present | 1 | locked-wording-supersedes-readability-nit.md | YES |
| W2-T3 | orch decisions blocklist count | 0 | 0 | YES |
| W2-T3 | orch design `item-` count | 0 | 0 | YES |
| W2-T3 | 4 compliant decision files present + untouched | 4 | all 4 present; none in diff range (pre-existing, unchanged) | YES |
| W2-T3 | iter1-user-redirects split to atomic + archived superseded | yes | archive/decisions/2026-05-23-iter1-user-redirects.md `status: superseded`, 2 new atomic files | YES |
| W2-T3b | env-var-audit blocklist count | 0 | 0 | YES |
| W2-T3b | README present + untouched | yes | present; not in diff | YES |
| W2-T3b | 5 logs de-prefixed, kept INTACT (R100) | R100 | all 5 R100 (0 content change) | YES |
| W2-T3b | references bundle split + archived not deleted | yes | archive/references/2026-05-22-ideation-references.md `status: superseded`; 2 new ref files | YES |
| W2-T4 | bundle-b iter/t blocklist count | 0 | 0 | YES |
| W2-T4 | five-locked-decisions.md MUST EXIST (user amendment) | present | PRESENT (untouched) | YES |
| W2-T4 | only the 3 discussion files renamed | 3 | commit c0f9200 = exactly 3 R-renames | YES |
| #6 | physical deletes | 0 | 0 (4A/2M/26R, no D) | YES |
| #7 | every NEW split file starts `---` + base frontmatter, 1 concept | yes | all 4 A-files: leading `---`, distinct H1/title | YES |
| #8 | scope: only backlogs/ learnings/ notes/ + 3 feature dirs | yes | no leak; no skills/, no sessions/, no main-tree | YES |

USER AMENDMENT honored: five-locked-decisions.md NOT renamed (PRESENT); 5 env logs de-prefixed to content slugs and kept INTACT at R100 (option 3, not atomized). Both verified.

## Findings

### F1 — Orch feature README mis-points to 6 renamed/archived decision+design files [HIGH | scenario_gap | 100]
- Domain: docs-sync
- Evidence: `features/gobbi-orchestration-workflow-improvements/README.md` (NOT touched in W2 — confirmed `git diff --name-only` excludes it):
  - L46 `decisions/iter1-user-redirects.md` — file was archived+split this wave; no longer in `decisions/`.
  - L48 `decisions/concern-1-wrap-up-step-2-5-anchor.md` — renamed to `wrap-up-step-2-5-anchor-placement.md` (R098 this wave).
  - L49 `decisions/concern-3-coverage-ownership-cell-text.md` — renamed to `coverage-ownership-matrix-row-text.md` (R098).
  - L54 `design/item-{a-g}-*.md` glob — all 7 design files de-prefixed this wave (item-a…item-g removed).
- Why it matters: the README is the feature's identity document (rules.md §3 "the README names itself"). After W2 it now points at 4+ stale/dead addresses inside its own feature dir. The W2-T3 contract explicitly required "any internal refs to old names repointed." A reader/agent following the README will hit missing files. This is the highest-impact gap because the README is the canonical entry to the whole feature.
- Suggested direction: repoint the 4 README bullets/glob to the current slugs (and decide whether the archived iter1-user-redirects bullet should now point to the 2 split files or be dropped). Manager + user decide.

### F2 — env-var-audit scope-discussion body dangles to renamed `ideation-decisions.md` [HIGH | scenario_gap | 100]
- Domain: docs-sync
- Evidence: `features/env-var-audit/discussions/env-var-audit-scope-discussion.md` L75 and L81 both read ``See `decisions/ideation-decisions.md` …``. That target was renamed THIS wave (W2-T3b) to `env-file-load-semantics-decisions.md` (R100). The discussion file is itself R100 (renamed, body untouched), so the references were not swept.
- Why it matters: same-wave, same-feature broken cross-reference. The user-amendment "keep the 5 logs INTACT" governs *atomization* (don't split content) — it does not preclude a one-token sibling-rename repoint. Net result is a dead intra-feature link introduced by this wave's own rename.
- Suggested direction: repoint L75/L81 to `decisions/env-file-load-semantics-decisions.md`. Confirm with user that a surgical link-repoint is consistent with the "keep INTACT" ruling (it changes one path token, not the log content).

### F3 — backlogs/skill-loading-discipline.md body dangles to renamed sibling (asymmetric T1 sweep) [MEDIUM | checklist_gap | 100]
- Domain: docs-sync
- Evidence: `backlogs/skill-loading-discipline.md:25` cites ``see `item-1-2-broader-delegation-contract-verifier.md` `` — renamed this wave to `broader-delegation-contract-verifier.md`. The reverse direction WAS repointed: commit 9bf2781 edited `broader-delegation-contract-verifier.md` to drop the `item-1-2-` prefix from its reference to skill-loading. So T1 swept one direction of the bidirectional sibling xref and missed the other.
- Why it matters: dead link between two live project backlogs; demonstrates the repoint pass was not exhaustive (the producer found and fixed one occurrence but not its mirror). Lower severity than F1/F2 because it is a single body line in a deferred backlog, not the feature entry doc.
- Suggested direction: repoint L25 to `broader-delegation-contract-verifier.md`.

## Non-findings (verified, deliberately NOT flagged)
- `promoted-from:` / `promoted_from:` frontmatter values citing `sessions/.../staging/.../{concern-N,item-X,ideation-,t1-}-*.md` — these are immutable historical provenance to past-session staging paths (sessions/ out of scope; those staging files genuinely had those names). Correct as-is. (rules.md §2.3 flags promoted-from as a future strip-candidate — a separate cleanup, not a W2 mandate.)
- `features/session-foundations-bundle-b/discussions/*` and `backlogs/goodhart-factor-*` referencing `staging/backlogs/project/item-1-2-…` — historical narrative of where a file lived in a prior session's staging tree, not live xrefs. Correct.
- bundle-b residual `d-N-*`, `cp-d-N-*`, `mechanism-N-*`, `failure-mode-N-*` design/discussion slugs — outside the W2-T4 blocklist (`iter[0-9]`, `t[0-9]-`); not in scope this wave.
- Split-file frontmatter carries `loop`/`disposition`/`mistake-candidate`/`promoted_from`/`type: design_flaw` — inherited verbatim from pre-existing siblings; W2 is a rename/split wave, not a frontmatter-cleanup wave. Not a W2 regression.
- Orch archive source lacks `archived_at` (env archive has it) — cosmetic frontmatter inconsistency, base `status: superseded` + `archive_reason` + `superseded_by` all present. Below threshold.

## Must-preserve list
- The strict no-delete model: 26 renames + 4 adds + 0 deletes; bundle sources git-mv'd into `archive/…` with `status: superseded` + `superseded_by` + `archive_reason`. Exemplary supersede hygiene — do not "tidy up" by deleting archived bundles.
- five-locked-decisions.md left intact (user amendment honored).
- 5 env logs kept INTACT at R100 (user option-3 honored).
- The 4 pre-compliant orch decision files untouched.
- Clean scope: zero leak into skills/, sessions/, or main tree.

VERDICT: REVISE
