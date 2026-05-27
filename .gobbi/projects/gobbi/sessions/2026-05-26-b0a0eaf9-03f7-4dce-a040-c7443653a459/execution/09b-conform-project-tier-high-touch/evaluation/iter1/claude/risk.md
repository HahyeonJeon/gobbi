# Risk Perspective — T9b conformance (commit 2e24dfe)

Focus: the CRITICAL diff-read gate — was any KEEP key stripped? Was any data lost?

## Diff-read method
Computed, per touched file, the set of frontmatter keys in the PRE-image (2e24dfe~1) minus the set in the POST-image (2e24dfe). A key in PRE-not-POST = a true strip. Reordered keys (removed line + re-added line, same key) are NOT strips and were excluded by the set-difference method (not the raw `-`-line count, which over-reports due to reordering).

## Result — ZERO true strips of any KEEP key
- Per-file PRE-minus-POST key-set diff across all 20 touched files: **empty for every file.** No key present before is absent after, except the legitimate S-set strips below.
- Legitimate S-set strips (only on `backlogs/normalize-path-conventions-h3.md`): `slug`, `loop`, `promoted-from`, `promoted-at` — all four are enumerated S-set members (§4.4). Correctly removed.
- `task: null` lines that appear as `-` in the raw diff on 9 backlog files: these are S-set strips (`task` is session-routing residue, §4.4) AND were genuinely removed (not re-added). Correct.
- Raw-diff `-` lines for `status`, `project`, `anchor_session`, `title`, `feature`, `session`, `created`, `tags`, `date`, `type` are all REORDER artifacts — each has a matching `+` re-add of the same key in the post-image. Confirmed present in POST. No loss.

## KEEP-key preservation spot-checks (the "when in doubt, KEEP" non-S keys)
- `anchor_session` (non-S, non-base → KEEP): preserved on all 9 backlog files that had it. Verified present in POST.
- `project: gobbi` (KEEP per §4.4 table): preserved on backlog files that had it.
- `date`, `pr`, `commit`, `stamp-commit` on notes journals: preserved (these are non-S non-base → KEEP per "when in doubt").
- `supersedes` on bundle-c-complete note: preserved.
- `domain`, `priority`, `title`, `disposition` on normalize-path backlog: all preserved.

## Findings

### RISK-1 — `feature:` value changed (not stripped) on one backlog; defensible but asymmetric with notes handling
- **Type:** assumption_risk · **Domain:** consistency · **Severity:** Low · **Confidence:** 75 · **Disposition:** open
- **Evidence:** `backlogs/normalize-path-conventions-h3.md` PRE `feature: gobbi-orchestration-workflow-improvements` → POST `feature: null`. By contrast, the 4 touched notes journals KEPT their non-null feature slug (e.g., `notes/2026-05-23-orch-workflow-improvements.md` retains `feature: gobbi-orchestration-workflow-improvements`).
- **Why it matters:** `feature` is a base key (KEEP), so this is a value-change, not a strip — outside gate 6. The change is defensible: a backlog promoted-up to the project tier sheds its feature binding (§3 "promote up… project-wide convention"), so `feature: null` is arguably correct there; notes legitimately retain a content-tag feature value (§2.1 "not feature-bound"). The risk is only the asymmetry — two different treatments of the same key in one commit — which a future reader could misread as inconsistency. Not a defect; recorded for the user's awareness.
- **Suggested direction:** confirm the intended convention (promoted-up backlogs → feature:null; notes → retain feature tag) is the standard; if so, no change.

## Must-preserve
- The exact S-set strip set on normalize-path — do not over-strip its retained KEEP keys (`title`/`domain`/`priority`/`disposition`/`session`/`created`).
- Zero-strip property on the other 19 files.

VERDICT: PASS
