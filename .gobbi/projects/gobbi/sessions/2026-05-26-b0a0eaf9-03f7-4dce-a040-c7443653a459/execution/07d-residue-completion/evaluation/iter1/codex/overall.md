## Findings

**Type:** general
**Severity:** High
**Confidence:** 100
**Evidence:** `git show --stat --oneline 720ae9d` and `git show --name-only --format= 720ae9d` show 18 changed files, not exactly `rules.md` plus the 16 conformed feature docs. The extra file is `.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/07d-residue-completion/rawdata/draft-iter1.md`, with `44` added lines in `git show --numstat --format= 720ae9d`. This violates the requested scope gate. The other requested gates were clean: the exact residue grep over the five conformed features printed nothing, the full §4.5 gate over those features printed nothing, deletion checks found only `phase`, `loop-iter`, `sub-step`, and `session-id` frontmatter removals, `discussion-id` survived in the four install-runtime discussion docs, and the 16 feature docs had no additions or body-prose edits.
**Fix:** Amend the commit to remove the session rawdata draft from `720ae9d`, leaving only `.gobbi/projects/gobbi/skills/memorization/rules.md` and the 16 feature-memory docs in the change-set.

VERDICT: REVISE
