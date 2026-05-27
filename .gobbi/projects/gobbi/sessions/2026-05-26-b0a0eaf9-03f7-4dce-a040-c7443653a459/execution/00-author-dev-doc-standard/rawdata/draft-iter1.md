# T0 executor draft — author §4 Dev-document quality standard

## Task
Add §4 "Dev-document quality standard" to the canonical `memorization/rules.md`
(`.gobbi/projects/gobbi/skills/memorization/rules.md`). Implement locked design D3-D6 + FIX-1.
Extend only; do NOT rewrite/renumber §1-3.

## Inputs read
- Canonical `rules.md` §1-3 (intro, naming, frontmatter incl. §2.3 staging-strip, structure).
- Locked design `design-options.md` (D1-D10 + FIX-1 predicate + key-set S + baseline counts).
- Templates: decisions.md (ADR shape: Context/Decision/Rationale/Alternatives/Consequences),
  learnings.md (Insight/Context/Why-it-matters/How-to-apply/Counter-cases),
  notes.md (What-happened/What-shipped/What-got-stuck/What-shifted/Next-session),
  mistakes.md (What-happened/User-feedback/Why-it-happens/Correct-approach/How-to-detect).
- Mistakes obeyed: naming-needs-positive-guidance (LEAD positive + before/after),
  design-literal-retire (never delete narrative → reclassify to notes/),
  edit-tool-refuses-symlink + skills-mirror-symlinks (edit canonical, not .claude/ symlink),
  executor-main-tree-edit (edit worktree copy; verify via git diff --name-only),
  sendmessage-cwd-resets (re-cd worktree each Bash call).

## §4 design (what I am implementing)
- §4 lead = POSITIVE definition (D3): a dev-doc = a doc a zero-context reader understands
  end-to-end without the originating session. + real before/after table from this tree.
- §4.1 type-purity (D1): import Diátaxis "one doc, one type's job"; keep 13 types; prose only.
- §4.2 per-type section contracts (D4): ADR-shaped decisions/design; mistakes existing shape;
  learnings Insight/Context/Why/How-to-apply/Counter-cases; notes What-happened/shipped/etc.
- §4.3 self-contained prose (D5): no load-bearing vanished-session coordinates in bodies;
  provenance → frontmatter + one optional "Source" footer. Never delete narrative —
  reclassify mislabeled session-journals to notes/ (D9). Grep-assistable check.
- §4.4 FIX-1 frontmatter conformance (D6): illegitimate-key-set S with BOTH hyphen AND
  underscore spellings; disposition legitimate ONLY on backlogs/. Type-aware allowlist strip.
- §4.5 archive-safe + underscore-aware grep-gate command (-not -path '*/archive/*').

## Decisions on ambiguity
- D6/FIX-1 lists S in hyphen spelling only; task spec mandates BOTH spellings. I enumerate
  both hyphen and underscore for each key in the §4.4 key-set and the §4.5 gate regex.
- The CN-1 cross-foot (28 vs 27 disposition) is cosmetic per the divergence summary; I do not
  reproduce raw baseline counts in the standard (they are session-measured, not a durable rule).

## Out of scope observations
- The §4.5 gate, run live, surfaces ~65 leak-candidate files across features/* — these
  are the downstream conformance-wave (D7) retrofit targets. T0 authors the standard only;
  normalizing those docs is explicitly out of T0 scope (retrofit waves).
- CN-1 cross-foot (28 vs 27 disposition baseline counts) is cosmetic per the iter2 divergence
  summary; I deliberately did NOT bake session-measured counts into the durable standard.
- D6/FIX-1 in design-options enumerates S in hyphen spelling only; the task spec mandates BOTH
  spellings. I enumerated both for every key (table in §4.4 + regex in §4.5) — this is the
  task-spec-required encoding of the underscore-awareness bug fix, not new policy.
- AGENTS.md 12→13 principle edit (PR-1/N2) is a separate Planning confirm/defer decision, not T0.

## Verification (fresh)
- V1 `grep -nE '^## .*[Dd]ev-document quality'` → `145:## 4. Dev-document quality standard`
- V2 `git diff --name-only` → only `.gobbi/projects/gobbi/skills/memorization/rules.md`
- V3 underscore+archive encoded: finding_id/promoted_from/underscore/archive all present in §4.
- §1-3 headings intact at lines 17/73/128 (pure +106 append).
- Gate command parses + runs (exit 0); commit be43c43, not pushed.
