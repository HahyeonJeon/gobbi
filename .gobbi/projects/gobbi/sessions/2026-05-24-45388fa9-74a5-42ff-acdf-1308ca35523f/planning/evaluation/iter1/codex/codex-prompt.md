# Codex Planning Evaluation — Bundle C Plan iter1

You are the Codex leg of a dual-system Planning evaluation (iter1). Adversarially verify this plan.

## Artifact

Read this file in full:
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/planning/rawdata/draft-iter1.md

This plan decomposes 6 Bundle C CLs into 6 executor tasks T01..T06.

## 7 Adversarial Checks (Critical/High only)

**Check 1 — DAG file-touch conflicts**: Are T01..T06 file-touch sets pairwise disjoint? Read each task's `files-may-touch:` list. Cross-check against the "File-overlap audit" section. Note any undeclared shared file. Also check: T02's `files-must-not-touch` — does it explicitly list `orchestration/workflow/evaluation.md` or just cover it via "any of the 11 CL-5 sweep skills"?

**Check 2 — CK coverage**: Read the § Spec coverage check table. Do all CK-1..CK-10 map to at least 1 task or bundle-wide criterion? Is CK-10 legitimately a bundle-wide criterion (not a coverage gap)?

**Check 3 — Verification executability**: For each task T01..T06, read the `verifies:` block. Flag any item that is prose-only (no grep/awk/test/jq). Flag any shell construct with a syntax problem (e.g., unquoted loop variable). The T06 `$FILES` variable in the for-loop — is it quoted correctly in the shell construct?

**Check 4 — CL-5 single-sweep rationale**: Read DR-1 in the Decisions log. Does DR-1 cite `manager-context-overflow-with-large-bundle.md` explicitly? Also read:
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/manager-context-overflow-with-large-bundle.md
Is 1-task vs N-task the right call for 11 mechanical file edits?

**Check 5 — CL-6 citation precision**: Read T02's `what:` and `verifies:` blocks. The canonical anchor in git/SKILL.md is: H2 `## Memory Access Matrix` (line 17) and inline `**Critical rule — write paths**:` (line 33). The plan should cite `Memory Access Matrix (Critical rule — write paths)`. Does T02 instruct this exact form? Does T02's negative-grep block the wrong hyphenated `Critical-Rule` form?

Read: /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.claude/skills/git/SKILL.md

**Check 6 — mistake/SKILL.md exclusion from T06**: Read T06's `files-must-not-touch:` list. Is `.claude/skills/mistake/SKILL.md` explicitly listed?

**Check 7 — Sequencing blast-radius**: Does the ordering T01(1 file)→T02(1 file)→T03(2 files)→T04(3 files)→T05(2 files)→T06(12 files) satisfy smallest-first/largest-last? Read DR-2. Note: T03's output `bundle-c-canonical-m2-wording-on-mistake-skill` is consumed by T06 as the reference string — does T03 before T06 satisfy this dependency?

## Output — Write 3 files at these EXACT absolute paths

DO NOT use relative paths. DO NOT use pwd-derived paths. These are under the MAIN TREE at /playinganalytics/git/gobbi, not the worktree.

FILE 1:
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/planning/evaluation/iter1/codex/p3-scope.md

Frontmatter:
---
evaluator: codex
model: <your model>
iter: 1
verbatim: true
perspective: p3-scope
verdict: <PASS|REVISE|FAIL>
---

Content: Check 1 (DAG), Check 2 (CK coverage), Check 6 (mistake exclusion), Check 7 (sequencing). For each: evidence + verdict. End with VERDICT line.

FILE 2:
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/planning/evaluation/iter1/codex/p4-specificity.md

Frontmatter:
---
evaluator: codex
model: <your model>
iter: 1
verbatim: true
perspective: p4-specificity
verdict: <PASS|REVISE|FAIL>
---

Content: Check 3 (verify executability), Check 4 (CL-5 rationale), Check 5 (citation precision). For each: evidence + verdict. End with VERDICT line.

FILE 3:
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/planning/evaluation/iter1/codex/overall.md

Frontmatter:
---
evaluator: codex
model: <your model>
iter: 1
verbatim: true
perspective: overall
verdict: <PASS|REVISE|FAIL>
---

Content: Aggregate all 7 checks. Preserve list (what to keep). Final VERDICT.

## Constraints
- ONLY write the 3 output files above.
- Critical ≥75 confidence → FAIL; High ≥50 → REVISE; else PASS.
- Do NOT modify the draft or any other file.
