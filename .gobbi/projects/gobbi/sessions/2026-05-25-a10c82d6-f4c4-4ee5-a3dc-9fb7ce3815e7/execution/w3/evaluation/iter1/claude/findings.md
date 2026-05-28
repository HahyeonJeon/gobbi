# Wave 3 (feature re-homing, 136 md) — Claude adversarial evaluation, iter1

Perspective: structure/consistency (re-homing correctness). Target: `c4155bb..HEAD` (12 commits).
Branch confirmed `chore/session-2026-05-25-a10c82d6`. HEAD = c8d4cd9. All evidence tool-verified on the worktree branch.

## Verdict inputs — all 9 brief checks PASS

1. **Feature shape — PASS.** `ls features/` == exactly the 7 capability dirs (workflow project-memory agents evaluation guardrails git-workflow install-runtime) + README.md, nothing else. `ls archive/features/` == the 4 retired sprints; all 4 READMEs stamped `archived_at: 2026-05-26` + `archive_reason: retired` (verified head -15 each).
2. **No-delete invariant — PASS (CRITICAL gate).** `git diff --name-status c4155bb..HEAD | grep -c '^D'` == **0**. Disposition: 22 A + 140 R, zero D. Every source-file move is a rename (history preserved).
3. **File accounting — PASS.** 140 renames = 136 content files → capability features + 4 sprint READMEs → archive. Source breakdown: env-var-audit 8 content (+1 README), Bundle A 23 (+1), Bundle B 100 (+1), Bundle C 5 (+1) = **136 content + 4 READMEs**, exactly matching design §8 (8+23+100+5=136). The 4 sprint dirs hold 0 `.md` (gone). 136 rename TARGETS land in capability features; 0 land anywhere unexpected (only features/ or archive/).
4. **Routing — PASS (spot-checked 14 files across all 7 features).** Every read file is defensibly placed per §1.3/§8 content-routing: hook stack/stdin/hook-skill → install-runtime; RBAC matrix + execution-intake + delegation → agents; codex-invocation + eval-escalation → evaluation; worktree/branch-collision → git-workflow; mistake-bundle → guardrails; memorization-moment + path-conventions → project-memory; wave-ordering/step-2.5 → workflow. Bundle C's 5 content files (all hook-skill/hook-authoring) correctly route to install-runtime (owns `gobbi-hook-authoring` per §1.2) — the §1.3 guardrails/project-memory "secondaries" were never physical files in Bundle C's dir (verified: dir held only README + changelogs/ + checklists/ at c4155bb). **No defensibly-wrong placement found.**
5. **Frontmatter restamp — PASS (within declared W3 scope).** Of all moved files carrying a `feature:` key, **100% are restamped to the destination feature** (zero mismatches — verified by comparing every `feature:` value against its destination dir). The env-var-audit set: the 5 files that carried `feature: env-var-audit` were correctly restamped to `install-runtime`; the dispatch-1 "rules.md doesn't exist" concern is moot — restamp was performed.
6. **Changelogs — PASS.** Every (destination-feature × source-bundle) pair that actually received files has a matching `2026-05-26-{bundle}-rehome.md` (or `-env-var-audit-shipped.md`) entry. 13/13 landing pairs covered; no orphaned re-home.
7. **7 READMEs — PASS.** All 7 capability READMEs start with `---`, carry `value_proposition` + `status: active`.
8. **Promote-up — PASS.** `design/archive-move-on-terminal-model.md` + `design/session-lifecycle-worktree-boundaries.md` both present at project `design/`; `find features/ -name` for either == empty (not duplicated into features/).
9. **No main-tree leak — PASS.** All 12 commits on the worktree branch; develop tip still `82a5137`.

## Findings

### F1 [Low | assumption_risk | Confidence 100] — 21 re-homed files lack a `feature:` key (Category-C deferral, documented)
**Domain:** docs-sync.
**Evidence:** 21 of 136 moved files carry no `feature:` key (install-runtime 8, git-workflow 6, agents 4, guardrails 2, workflow 1). These are the ad-hoc-frontmatter files (`type: decisions-log`, `name: t1-decisions`, plus `promoted_from`/`promoted_at` keys) — e.g. `features/install-runtime/decisions/pre-planning-readiness-decisions.md`, `task-decomposition-decisions.md`, `session-start-hook-script-decisions.md`, `features/project-memory/decisions/path-conventions-anchor-casing.md`.
**Why it matters:** these files are not yet schema-conformant to `memorization/rules.md` §2.1 base (no `feature:`, non-enum `type` values, residual staging keys). Without a `feature:` key, scope=feature self-reference is absent.
**Disposition: deferred.** The W3 changelog (`features/install-runtime/changelogs/2026-05-26-env-var-audit-shipped.md` § Deferred) explicitly scopes W3 to re-homing + restamping *existing* `feature:` keys, and routes "Frontmatter normalization of the 3 ad-hoc decision files → migration cat C." Design §8 separates Category A (re-homing, this wave) from Category C (frontmatter fixes, later wave). This is a deliberate, documented wave boundary — not a W3 defect.
**Suggested direction:** confirm Category C is genuinely scheduled in a later wave so these 21 files (plus the §8 cat-C set: 17 mistake `mistake-candidate` strips, stub-redirect frontmatter, ad-hoc-key migrations) are not orphaned. No W3 remediation required.

### F2 [Low | general | Confidence 100] — un-split bundle decision files moved intact (Category-B deferral, documented)
**Domain:** process.
**Evidence:** `features/install-runtime/decisions/{pre-planning-readiness,task-decomposition,session-start-hook-script}-decisions.md` are loop-phase bundle files (`type: decisions-log`, multiple decisions per file) that design §2.3/§8-cat-B flags as FORBIDDEN (must split 1→N).
**Why it matters:** one-record-one-concept atomicity (L5) not yet satisfied for these files; supersede/archive will operate at wrong granularity until split.
**Disposition: deferred.** §8 places bundle-splitting in Category B (slug renames + bundle-splits), a distinct wave from Category A. W3's contract is re-homing, not splitting. Documented, not a W3 defect.
**Suggested direction:** ensure Category B wave splits these before frontmatter normalization (§8 heuristic rule 4: split-first-then-route — but routing was correct regardless since all sub-decisions share the install-runtime destination).

## Must-preserve list
- The no-delete (0 D, 140 R) move-on-terminal execution — history fully preserved; do NOT let any later wave introduce a physical delete.
- 100% correct `feature:` restamping on all keyed files — do not regress when Category C adds keys to the 21 unkeyed files.
- Complete, accurate changelog coverage (13/13 landing pairs) — keep this discipline in B/C waves.
- Exact 136-file accounting matching design §8 — the wave hit its scope precisely.
- Correct content-over-sprint routing (esp. Bundle C → install-runtime by content, not git-workflow by sprint-primary).

VERDICT: PASS
