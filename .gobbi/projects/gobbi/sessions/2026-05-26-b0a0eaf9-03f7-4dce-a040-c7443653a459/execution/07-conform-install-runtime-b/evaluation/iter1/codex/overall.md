## Findings

1. **Type:** general
   **Severity:** High
   **Confidence:** 100
   **Evidence:** The "no narrative deleted" and "no body section reshaping" gates fail. `git diff --unified=0 6f9dbf9^ 6f9dbf9 -- .gobbi/projects/gobbi/features/install-runtime/backlogs/dot-gobbi-project-json-bootstrap.md` deletes the entire `## Anchor` section, including the empirical verification line and the originating `F-Fix-C` decision pointer. `git diff --unified=0 6f9dbf9^ 6f9dbf9 -- .gobbi/projects/gobbi/features/install-runtime/backlogs/dry-inline-jq-hook-script.md` replaces `## Related` plus five provenance bullets (`evaluation/iter1/claude/structure.md`, `evaluation/iter1/claude/risk.md`, `staging/decisions/goodhart-factor-when-demanded-deferred.md`, and two `rawdata/draft-iter3.md` anchors) with a single `## When to pick up` sentence. A heading diff also shows section-shape changes across the T7 set (`## Rationale` -> `## Why deferred`, removed `## Anchor`, `## Related` -> `## When to pick up`, added `## Source`). This is more than frontmatter plus inline-coordinate de-crypting.
   **Fix:** Restore the deleted narrative/provenance content or move it into the appropriate self-contained section/source footer. Keep section changes to de-crypt heading text only; do not collapse source/provenance sections into generic pickup guidance.

2. **Type:** checklist_gap
   **Severity:** High
   **Confidence:** 100
   **Evidence:** The "no non-S key dropped" gate fails. A before/after frontmatter-key comparison over the 20 T7 paths reports dropped non-S keys in many files, including `.gobbi/projects/gobbi/features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md: related`. The preimage has `related: [claude-code-posttooluse-hook-schema]`; HEAD has no `related:` key. Other non-S drops include `project`, `last_updated`, `domain`, `supersedes`, `superseded_by`, `scenario`, `finding_source`, and `task`. The §4.5 leak gate is about the S key-set; this commit removes keys outside S instead of preserving them or explicitly migrating the information.
   **Fix:** Re-apply the type-aware allowlist without dropping non-S metadata required by this task gate. At minimum, restore `related:` where present in the preimage, or preserve its value in an agreed durable field with an explicit migration note; audit the other non-S drops before re-submitting.

Mechanical gates verified clean before this verdict: live install-runtime doc count excluding archive is 44; §4.5 archive-safe leak gate is 0 and the regex catches underscore spellings; all 44 live docs carry the 9 base keys; all 7 backlogs preserve `disposition:` while non-backlogs have none; the T7 title regex returns 0; and `git show --stat 6f9dbf9` touches only the 20 T7 paths, with T6 subdirs untouched. De-crypt spot-checks on `dot-gobbi-project-json-bootstrap.md`, `hook-latency-bounds.md`, and `claude-code-transcript-tooluseresult-empirical.md` are readable.

VERDICT: REVISE
