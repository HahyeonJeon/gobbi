# Project Perspective — T9b conformance (commit 2e24dfe)

**Target:** commit 2e24dfe — conform 35 project-tier docs ({decisions,design,learnings,notes,backlogs}/*.md, maxdepth 1, archive-safe) to memorization/rules.md §4.
**Verification:** own commands (git show diff-read, find/grep gate, per-file key-set diff). Reports NOT trusted.

## Mechanical gate results (all run fresh against the target HEAD)

| Gate | Expected | Observed | Pass |
|------|----------|----------|------|
| §4.5 S-set gate over 5 dirs (maxdepth 1, archive-safe, underscore-aware) | 0 leak files | 0 | YES |
| Conditional `disposition` leak on non-backlogs | 0 | 0 | YES |
| 9 base keys on all 35 docs | all present | all 35 carry all 9 | YES |
| scope == project on all 35 | yes | all 35 `scope: project` | YES |
| scope:feature on any project-tier doc | none | none | YES |
| disposition present on backlog content items | yes | 15/15 content backlogs (README index correctly exempt) | YES |
| disposition absent on non-backlogs | yes | absent | YES |
| type enum validity (12 promotable types) | all valid | all valid (journal/session-journal/general canonicalized to notes/notes/backlogs) | YES |
| Scope boundary (only 5 dirs, maxdepth 1) | clean | 20/20 touched files inside the 5 dirs maxdepth 1; 0 T9c-domain files | YES |

## Findings

### PROJ-1 — Verification claim "0 cryptic-led titles" is false; 5 cryptic-led H1 titles remain
- **Type:** general · **Domain:** process · **Severity:** High · **Confidence:** 100 · **Disposition:** open
- **Evidence:** The commit body claims "§4.1 concept-first titles: no cryptic-led H1/H2/H3 found; no changes needed on title de-crypt" and "0 cryptic-led titles." Fresh scan finds 5 backlog docs whose H1 (and `title:` frontmatter) lead with a positional/plan coordinate:
  - `backlogs/two-surface-collapsing-strategy.md:17` — `# Item 1-3 alternative — two-surface collapsing strategy`
  - `backlogs/broader-delegation-contract-verifier.md:17` — `# Item 1-2 broader re-framing — delegation contract verifier`
  - `backlogs/symlink-into-worktree-alternative.md:17` — `# Item 1-3 alternative — symlink-into-worktree model`
  - `backlogs/skill-loading-discipline.md:17` — `# Item 1-2 — Skill-loading-discipline matrix + Load-Directives validator`
  - `backlogs/auto-mode-silence-vs-always-ask.md:17` — `# Item 2-1 — Auto-mode silence vs Always-Ask categories`
- **Why it matters:** §1.3 "Positional / sequence index" anti-pattern names `item-1-2` explicitly as a smell; §4.1 requires the `# Title` to "state the concept, not a session coordinate." The immediately-preceding sibling commit in this same campaign (T9a, fc17c34, Part B) de-crypted exactly this class ("LOCK #2 Tasks 07+08…" → subject-first) — so the campaign's own established §4.1 treatment was not applied to T9b's backlogs. The verification claim contradicting fresh evidence is the more serious half: an Iron-Law-7/-11 signal (a "0" metric reported without the check catching the cases). Brief gate 5 ("0 cryptic-led titles, broadened incl LOCK/Task") is a stated PASS condition and is not met.
- **Suggested direction (not a prescription):** de-crypt to subject-first with the coordinate demoted to a parenthetical (mirroring T9a Part B), updating both the H1 body and the `title:` frontmatter — OR the user may rule "Item N-N" out of T9b scope, in which case the false verification claim still needs correcting.

## Must-preserve
- The §4.5 gate is genuinely 0; the S-set strip on `normalize-path-conventions-h3.md` (slug/loop/promoted-from/promoted-at) is correct and complete.
- Zero KEEP keys stripped (verified by pre/post key-set diff per file — see Risk perspective).
- All note-journal bodies byte-identical pre/post; no narrative deleted.

VERDICT: REVISE
