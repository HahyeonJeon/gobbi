---
date: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
feature: gobbi-orchestration-workflow-improvements
loop: ideation
iter: 3
topic: item-d-wrap-up-step-2-5-compliance-check
status: final
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/design/item-d-wrap-up-step-2-5-compliance-check.md
promoted-at: 2026-05-23T14:00:00Z
---

# Design D — Wrap-up Step 2.5: Prior-Loop Memorization Compliance Check

**Chosen direction**: Insert "Step 2.5 — Prior-loop memorization compliance check" between Step 2 (staging inventory) and Step 3 (feature destination) in `wrap-up/SKILL.md § WORK Phase`.

**Step 2.5 specification (final — post-iter3 vocabulary repair)**:

Inputs: prior loops' `rawdata/` + `staging/` + `evaluation/iter*/{claude,codex}/` (read-only).

Scan procedure:
1. For each prior loop, enumerate evaluation findings per perspective × system.
2. Count staging files per loop; note staging-dir presence/absence.
3. Compute gaps across 4 categories:
   - (a) zero-staging: `staging/` exists but empty, `evaluation/` has findings
   - (b) directory-absent: `staging/` does not exist at all (e.g., session `bac669ad` T2/T3)
   - (c) shape gap: files exist but filenames don't match `{slug}.md` per finding-id
   - (d) template gap: files exist but template frontmatter missing/wrong

4. Classify each gap using the actual 5-Type vocabulary from `evaluation/SKILL.md:344-352`:
   - **Mechanical** (auto-backfill): Type in {`scenario_gap`, `checklist_gap`, `general`} + single Domain value + routes deterministically.
   - **Judgment-required** (NEEDS_CONTEXT): Type in {`design_flaw`, `assumption_risk`}; OR `disposition: open` requiring user arbitration; OR Type/Domain missing/unrecognized; OR finding spans multiple staging subdirs.
   - **NOT valid Types**: `improvement`, `bug` — these are not in the 5-Type vocabulary.

5. Auto-fill mechanical gaps with `evaluation/SKILL.md § Slug + collision policy` (lines 385-393) pre-write check.

6. Aggregate judgment-required gaps into single NEEDS_CONTEXT with `user-question:` block.

Output: gap report appended to `rawdata/promotion-manifest.md`.

**Rationale**: Wrap-up's Step 2 builds staging inventory and assumes prior MEMORIZATION was clean. Session `2026-05-22-bac669ad` empirically showed T1/T2/T5 had full evaluations but zero staging files. T2/T3 had no staging directories at all. The hybrid escalation shape (mechanical auto-backfill + judgment-required NEEDS_CONTEXT) was user-selected over pure-NEEDS_CONTEXT (too friction-heavy) and pure-auto-backfill (too autonomous on arbitration-required findings).

**Anchored insights**: I7, I11 + iter1 user redirect § Decision 1.

**Validation**: `grep "Step 2.5" wrap-up/SKILL.md` returns the new step; `grep -i "mechanical\|judgment-required" wrap-up/SKILL.md` returns ≥ 1 each; `grep "scenario_gap\|checklist_gap\|design_flaw\|assumption_risk\|general" wrap-up/SKILL.md` confirms 5-Type vocabulary.

**Cross-links Bundle A creates (item D)**: wrap-up/SKILL.md § Step 2.5 → evaluation/SKILL.md § Finding Metadata (lines 344-352); wrap-up/SKILL.md § Step 2.5 → evaluation/SKILL.md § Slug + collision policy (lines 385-393).
