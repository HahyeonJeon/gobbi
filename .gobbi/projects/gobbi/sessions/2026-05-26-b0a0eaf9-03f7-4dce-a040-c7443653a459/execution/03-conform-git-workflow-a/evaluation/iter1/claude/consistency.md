# Consistency Perspective — T3 conform git-workflow (commit 2d01316)

## Frame
Whole-file vocabulary consistency (per mistake `claude-evaluator-step4-only-vs-codex-whole-file-grep`): retired staging-routing keys must be gone EVERYWHERE in the 3 subdirs, not just the changed sections; de-cryption must be consistent across docs; type/dir alignment.

## Verified (own commands)
- **Whole-subdir leak scan** (not just changed lines): all 8 S-keys (both hyphen+underscore spellings) grep-clean across all 20 docs. No residual `finding-id`, `confidence`, `severity`, `surfaced-by`, `promoted-from`, `promoted-at`, `addressed-by`, `mistake-candidate`, or non-backlog `disposition`.
- **Type/dir alignment**: every doc's `type` matches its directory — `decisions/`→`decisions`, `design/`→`design`, `discussions/`→`discussions`. Dated discussions correctly retain `loop`/`topic`/`outcome` (discussions-template extensions, not in S).
- **De-cryption consistency**: the de-crypt pattern (cryptic coord → self-contained prose; `## Related`/`## Cite` → `## Source` footer pointing at canonical session dir) is applied uniformly across decisions + discussions, and on most design docs.

## Findings

### CONS-1 — Partial de-cryption: residual session-coordinate labels in one design doc body
- **Type**: checklist_gap · **Domain**: docs-sync · **Disposition**: open · **Confidence**: 90 · **Severity**: Low
- **Evidence**: `features/git-workflow/design/workflow-phase-doc-set-for-per-iter-cadence.md` body retains `T1-I-T1.f` (lines 28, 62, 92, 97), `T1-I-T1.h`/`T1-I-T1.j` (line 28), `G-1`/`E-1` scenario labels (lines 54-55), `iter1`/`iter2` (lines 81, 50). The commit's `## Problem` and `## Source` were de-crypted but `## Scope`, `## Scenarios`, `## Excluded files` sections were left untouched. The commit message claims "de-crypt session-internal body refs to self-contained prose across all 3 subdirs" — slightly overstated for this doc.
- **Why it matters**: A zero-context reader hits `T1-I-T1.f` / `G-1` and cannot resolve them. Per §4.3 these are NOT strictly load-bearing (surrounding prose carries the meaning: "the smoke test verifying commit subjects (T1-I-T1.h)" explains what T1-I-T1.h is), and §4.3's grep is explicitly "advisory, not a hard gate." T3's hard gates (leak=0, 9 base keys) both pass; full §4.2/§4.3 prose rewrite is plan-DEFERRED (P1-P7). So this is a quality residue, not a contract breach.
- **Suggested direction**: Either fold this doc into the deferred P-series prose rewrite, or soften the commit-message completeness claim. No T3 re-work required.

## Must-preserve
- Uniform type/dir alignment and complete S-key removal across all 20 docs.

VERDICT: PASS
