---
name: wrap-up-step-2-5-compliance-check
description: Insert Step 2.5 into wrap-up/SKILL.md between staging inventory and feature-destination routing — 4-category gap detection with hybrid auto-backfill + NEEDS_CONTEXT escalation.
type: design
scope: feature
feature: workflow
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [wrap-up, step-2-5, memorization, compliance-check]
topic: wrap-up-step-2-5-compliance-check
---

# Wrap-up Step 2.5 — prior-loop memorization compliance check

## Context

Wrap-up's Step 2 builds a staging inventory and assumes prior loop MEMORIZATION was clean. That assumption broke empirically: an earlier session had full evaluations for several loops but zero staging files, and two loops had no staging directory at all. Without a gap-detection step, those memorization gaps reach Wrap-up's promotion silently and the findings are lost.

## Decision

Insert a "Step 2.5 — Prior-loop memorization compliance check" between Step 2 (staging inventory) and Step 3 (feature destination) in `wrap-up/SKILL.md § WORK Phase`. Step 2.5 detects four categories of memorization gap, then resolves each gap with a hybrid escalation: auto-backfill mechanical gaps inline, and aggregate judgment-required gaps into a single NEEDS_CONTEXT surfacing.

## Approach

Step 2.5 specification:

Inputs: prior loops' `rawdata/` + `staging/` + `evaluation/iter*/{claude,codex}/` (read-only).

Scan procedure:
1. For each prior loop, enumerate evaluation findings per perspective × system.
2. Count staging files per loop; note staging-dir presence/absence.
3. Compute gaps across 4 categories:
   - (a) zero-staging: `staging/` exists but empty, `evaluation/` has findings
   - (b) directory-absent: `staging/` does not exist at all for a loop
   - (c) shape gap: files exist but filenames don't match `{slug}.md` per finding-id
   - (d) template gap: files exist but template frontmatter missing/wrong

4. Classify each gap using the actual 5-Type vocabulary from `evaluation/SKILL.md:344-352`:
   - **Mechanical** (auto-backfill): Type in {`scenario_gap`, `checklist_gap`, `general`} + single Domain value + routes deterministically.
   - **Judgment-required** (NEEDS_CONTEXT): Type in {`design_flaw`, `assumption_risk`}; OR `disposition: open` requiring user arbitration; OR Type/Domain missing/unrecognized; OR finding spans multiple staging subdirs.
   - **NOT valid Types**: `improvement`, `bug` — these are not in the 5-Type vocabulary.

5. Auto-fill mechanical gaps with `evaluation/SKILL.md § Slug + collision policy` (lines 385-393) pre-write check.

6. Aggregate judgment-required gaps into single NEEDS_CONTEXT with `user-question:` block.

Output: gap report appended to `rawdata/promotion-manifest.md`.

## Rationale

Step 2 builds the staging inventory but assumes prior MEMORIZATION was clean, and a real session (`2026-05-22-bac669ad`) disproved that: several loops had full evaluations yet zero staging files, and two loops had no staging directory at all. The hybrid escalation shape — auto-backfill the mechanical gaps, NEEDS_CONTEXT the judgment-required ones — splits the difference between two extremes the user rejected: pure NEEDS_CONTEXT is too friction-heavy for routing-deterministic gaps, and pure auto-backfill is too autonomous on findings that need user arbitration. The step also creates two cross-links from `wrap-up/SKILL.md § Step 2.5` into `evaluation/SKILL.md` (the Finding Metadata section and the Slug + collision policy section).

## Alternatives considered

- **Pure NEEDS_CONTEXT (escalate every gap).** Rejected by the user: too friction-heavy when the gap routes deterministically (a `scenario_gap` finding has one valid destination).
- **Pure auto-backfill (fill every gap inline).** Rejected by the user: too autonomous on findings that require arbitration (a `design_flaw`, or a finding with `disposition: open`).
- **No compliance step (trust Step 2's inventory).** Rejected: the empirical witness shows memorization gaps reaching Wrap-up undetected, losing evaluation findings.

## Consequences

`wrap-up/SKILL.md` gains a Step 2.5 H3 that classifies gaps and resolves them by the hybrid policy; users can audit the classification because the rules are documented in the skill. Validation: `grep "Step 2.5" wrap-up/SKILL.md` returns the new step; `grep -i "mechanical\|judgment-required" wrap-up/SKILL.md` returns ≥ 1 each; `grep "scenario_gap\|checklist_gap\|design_flaw\|assumption_risk\|general" wrap-up/SKILL.md` confirms the 5-Type vocabulary.

## Related

- `decisions/wrap-up-step-2-5-escalation-default.md` — the decision fixing the hybrid escalation policy.
- `decisions/wrap-up-step-2-5-anchor-placement.md` — where Step 2.5 lands in `wrap-up/SKILL.md`.
- `discussions/wrap-up-step-2-5-escalation-shape.md` — the AskUserQuestion exchange that selected the hybrid shape.
