# Ideation iter3 — Performance perspective (codex)

## Stage 0 Artifact Summary

The iter3 draft is a large but bounded destructive cleanup plan. Performance risk here is operational rather than runtime: command count, file deletion volume, git plumbing checks, and review/merge verification should remain proportional and should not turn the cleanup into an unbounded exploration or heavyweight archival process.

## Stage 1 Locked Frame

- Scenario PF1: The reset remains a single bounded sweep.
  - Checklist: no full-history migration, database export, or exhaustive archive copy is introduced.
- Scenario PF2: Verification remains cheap.
  - Checklist: E.2 uses constant-time git branch/tree checks; symlink and directory checks are bounded over the reduced repo tree.
- Scenario PF3: Sessions becoming tracked does not create unnecessary pre-reset bloat.
  - Checklist: only the current date-prefixed session is staged; 52 sibling dirs plus the bare UUID dir are removed.
- Scenario PF4 (adversarial): Merge-head verification adds slow or network-fragile work.
  - Checklist: `gh pr view` and `gh pr merge` are already in the workflow; added checks do not require cloning or diffing all PR contents.

## Stage 2 Findings

No new performance finding.

The E.2 redesign improves performance by dropping the SHA-in-file loop and replacing it with two simple git commands at `draft-iter3.md:318-324`. The Stage G head-SHA mitigation adds one `gh pr view` before merge and one metadata/body check after merge at `draft-iter3.md:343-350`; even though its correctness is disputed in other perspectives, it is not a performance concern.

## Stage 2 Step 3 — Iter2 Inherited Finding Disposition

- F-CX-OV-01: addressed. The impossible SHA write/amend cycle is gone.
- F-CX-OV-02: open at Medium for correctness, not performance. The added checks are operationally cheap.
- Prior performance carryover F-PF-01: deferred/unchanged. The cleanup still intentionally avoids expensive archival beyond the lightweight tag.

## Per-perspective Verdict

PASS. No High>=50 or Critical>=75 performance finding.

## Must-Preserve

- Preserve lightweight tag archival instead of copying deleted project memory elsewhere.
- Preserve bounded git plumbing checks for E.2.
- Preserve the single PR / squash-merge shape rather than expanding into many cleanup PRs.
