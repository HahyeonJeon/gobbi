# Wave 1 (frontmatter fixes) — Claude Evaluation (execution-eval, iter1)

**Target:** commits `71b69ab..HEAD` (26646e7, 02dc8e0, 0750e8a)
**Perspective:** Claude-side adversarial executor evaluator. All checks tool-verified on the worktree; producer claims not trusted.

## Verification summary (all PASS)

- **W1-T1 mistakes/ staging strip:** line-anchored greps for `^mistake-candidate:`, `^finding-id:`, `^promoted-from:`, `^promoted-at:`, `^disposition:` over `mistakes/` all return 0. All 22 mistakes files start with `---` and carry base fields (name/description/type/scope/created + session/status/feature/tags). README.md excluded (correct).
- **executor-mirror-path-vs-worktree-physical-copy.md:** frontmatter-only diff confirmed — non-frontmatter body diff is EMPTY (`git diff` body lines = 0). Staging flags stripped (`date`→`created`, `status: accepted`→`active`, `mistake-candidate`/`finding-id` removed); body NOT reworded. W5-T2 reword deferral respected. CONFIRMED.
- **W1-T2 stub-redirect-format.md:** starts with `---`, `type: rules`, allowlisted extensions (`priority`,`established`,`supersedes`). "No frontmatter" clause rescoped to TARGET published stubs; project-memory files affirmed to carry frontmatter. CORRECT.
- **W1-T3 design/ + learnings/ + sweep:** `grep -rL "^---" design/ learnings/ rules/ backlogs/ | grep -v README.md | wc -l` == 0. No ad-hoc keys (`discovered`/`promoted-from`/`promoted-at`/`source-*`/`finding-type`/`disposition`/`severity`/`confidence`/`title`/`metadata`/`source`) survive anywhere in touched dirs (line-anchored scan = 0 leaks). f-aes-01 learning frontmatter-fixed but NOT renamed (W2-T2 deferral respected). CORRECT.
- **Allowlist compliance:** every frontmatter key across all touched files is a base field or a §2.2 per-type extension. design = base+supersedes/superseded_by/related; learnings = base+supersedes/superseded_by; mistakes = base+priority/domain/supersedes/superseded_by; rules = base+priority/established/supersedes. PASS.
- **Scope:** `git diff --name-only` touches ONLY mistakes/, rules/stub-redirect-format.md, design/ (2 files), learnings/ (5 files). Zero features/, sessions/, skills/ hits. PASS.

## Producer concerns — judged

- **(a) `supersedes: null` on archive-move-on-terminal-model.md (was prose):** ACCEPTABLE. The old prose value (`the in-place archive model formerly documented in memorization/templates/archive.md`) was never a valid file-pointer per the allowlist semantics (supersedes points to a superseded memory file slug, not free prose, and not a template doc). The supersession narrative survives intact in the `description` field. Setting null is the allowlist-correct choice; no information lost.
- **(b) grep false-positive:** BENIGN — confirmed. The two `mistake-candidate` matches (`mistakes/memorization-delegation-...md:67`, `design/memory-system-redesign.md:48`) are body prose, not column-1 `^key:` frontmatter. Line-anchored greps correctly excluded them (returned 0).

## Findings

### F1 [Low|general|CONFIDENCE 100] — `archive-move-on-terminal-model.md` sets `feature: project-memory` under `scope: project`
- **Evidence:** `design/archive-move-on-terminal-model.md` lines 10-11: `scope: project` / `feature: project-memory`. No `features/project-memory/` dir exists (`ls features/` → env-var-audit, gobbi-orchestration-workflow-improvements, session-foundations-bundle-b, session-foundations-bundle-c). rules.md §2.1: `feature` is "null when scope=project and not feature-bound." Sibling file `session-lifecycle-worktree-boundaries.md` (also `scope: project`) correctly uses `feature: null`.
- **Why it matters:** A non-null `feature` value pointing at a non-existent feature dir is a soft schema inconsistency — tools that key feature-grouping off this field would mis-bucket the file, and it diverges from the sibling design file's convention set in the same wave.
- **Domain:** docs-sync. **Type:** general. **Disposition:** open.
- **Suggested direction:** Either set `feature: null` (matching the sibling and §2.1), or — if "project-memory" is intended as a thematic tag rather than a feature — move it to `tags:`. Manager + user decide. Note: the `feature` KEY is a base field, so this does not breach the allowlist; it is a value-semantics nit, not a structural defect.

## Must-preserve list
- Body-untouched migration of executor-mirror file (frontmatter-only; body reword correctly deferred to W5-T2).
- f-aes-01 learning kept its original filename (rename correctly deferred to W2-T2).
- Clean rescope of the stub-redirect "No frontmatter" clause (TARGET docs vs project-memory distinction).
- Complete removal of the large eval-routing key pile from `sole-exception-phrasing-normalization.md`.
- Allowlist-clean frontmatter across all 30 touched files.

## VERDICT: PASS

Single Low-severity value-semantics nit (F1); no Critical/High. Per evaluation thresholds → PASS. The wave's contracted goal (strip staging-only frontmatter, add allowlist-compliant base frontmatter, bounded sweep, respect W2/W5 deferrals) is met with tool-verified evidence.
