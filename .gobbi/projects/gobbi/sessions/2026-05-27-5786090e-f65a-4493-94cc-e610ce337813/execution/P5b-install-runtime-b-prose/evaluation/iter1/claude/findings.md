VERDICT: PASS

## Summary

P5b reshaped 20 docs (7 backlogs, 7 checklists, 3 references, 2 scenarios + README) under `features/install-runtime/` to the §4.2 per-type section contracts and made every body self-contained. I diffed commit `e94e94b` in full, read each file's resulting headings, ran the D5 body scan and the §4.5 leak gate (both clean), token-verified content preservation across all reshapes (especially the two table→scenario conversions and the ADR→backlog conversions), and existence-checked every `## Related`/inline link across the tree. No content was dropped or weakened. Every cross-ref resolves to an existing file. Every removed session-coordinate ref was correctly reclassified (§4.3), not silently lost — including the prior-task failure mode (`staging/backlogs/project/ci-symlink-integrity-check.md`), which was correctly replaced with a resolving link to the live project backlog. All forms match their templates exactly (no ad-hoc). PASS is clean and honest.

## Findings

No findings. The work is conformant on every checked dimension. Detail of what was verified:

- [general] [n/a] [confidence 100] All 7 backlogs carry the full template contract Context → Why deferred → When to pick up → Suggested approach → Originating session (+ optional Related/Source footers). ADR headings (Decision/Rationale/Consequences/Alternatives/Effort estimate/Trigger condition) were correctly converted to backlog headings with all facts carried forward. Evidence: `git show e94e94b -- backlogs/*.md`; heading grep on all 7 post-images.
- [general] [n/a] [confidence 100] Every backlog `## Originating session` is a concrete `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/` path; the anchor dir exists. Evidence: grep + `ls -d`.
- [checklist_gap] [n/a] [confidence 100] All 7 checklists match ONE template form exactly — 6 use Form B (What/Why/Verification/Status notes), 1 (`mirror-policy-empirical-verification.md`) uses Form A (title ends "— implementation checklist" + table + `## Item details`). None ad-hoc. The old Check/Evidence/Scenario gap/Addressed and Context/Checklist-item shapes were converted to template forms with facts preserved (commits `5d2a7c6`/`a7ac0d7`, regression greps, 500ms p99, fixture sizes 500/1000/5000, O(transcript_lines), 20-50 fires). Evidence: heading grep + token grep on each.
- [general] [n/a] [confidence 100] All 3 references carry Insight → `## Related` (correctly placed between Insight and Why it applies) → Why it applies → Source → Excerpt → Usage history. The leading "Split from the env-var-audit bundle…" narrative lines were removed from two refs (§4.3 session-coord removal, content not load-bearing — the insight is retained verbatim); `## Excerpt` sections added. Evidence: heading grep.
- [scenario_gap] [n/a] [confidence 100] Both scenarios converted from checklist-table form to scenario form with `**Category:**`/`**Coverage:**` + Situation/Inputs/Expected behavior/Verification/Related. All table facts preserved: `Edit` default method, `test -L` gate, `decision_status: accepted`, `-type l` file-level scan returning 53, symlink-preservation edit contract, orchestration/SKILL.md sample. Evidence: token grep on both post-images.
- [general] [n/a] [confidence 100] README gained `## Status`, `## Open items`, per-dir file counts on `## Subdirectories`, and an upgraded resolving `## Related` link. `## Subdirectories` (9 entries: decisions/design/discussions/references/scenarios/checklists/backlogs/changelogs/archive) == live `ls -d features/install-runtime/*/` (9 dirs). Match.

## Cross-ref resolution check

Every `## Related` / inline path-link in the 20 in-scope files was existence-checked (resolved relative to each file's dir):

- ci-symlink-backlog → `../../../backlogs/ci-symlink-integrity-check.md` — EXISTS (correctly replaces the stale `preparation/staging/backlogs/project/...` ref; prior-task failure mode does NOT recur)
- consequences → `../decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md` — EXISTS
- README → `../../design/memory-system-redesign.md` — EXISTS
- structured-header → `../design/metadata-extraction-input-vs-result.md` — EXISTS
- ccsi-version ↔ stdin-contract (reciprocal sibling links) — both EXIST
- tooluseresult → `../design/metadata-extraction-input-vs-result.md`, `../design/reconstructor-verify-and-fix.md`, `../../guardrails/references/claude-code-posttooluse-hook-schema.md` — all EXIST (last also matches frontmatter `related`)
- consumer-mental-model → decision file + `mirror-policy-workspace-canonical-false-premise.md` — both EXIST
- false-premise → decision file + `consumer-mental-model-symlink-topology.md` + `../checklists/mirror-policy-empirical-verification.md` — all EXIST

Removed refs (all session-only coords: `preparation/staging/...`, `preparation/evaluation/iter3/...`, `evaluation/iter1/...`, `rawdata/draft-iterN.md`, `Task NN`) are legitimately reclassified per §4.3 — none had a durable target that should have been preserved. The one durable target that did exist elsewhere (project ci-symlink backlog) was correctly re-linked, not dropped. No dangling, no weakened-to-parent-dir, no removed-ref-with-existing-target.

## Verification outputs

```
$ git show e94e94b --stat | tail -1
 20 files changed, 223 insertions(+), 182 deletions(-)

$ # D5 body scan (in-scope, archive-excluded)
$ grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' \
    features/install-runtime/{backlogs,checklists,references,scenarios}/ \
    features/install-runtime/README.md --include='*.md' | grep -vE '/archive/'
(clean — no output)

$ # §4.5 leak gate (archive-safe, underscore-aware)
$ find features/install-runtime/{backlogs,checklists,references,scenarios} \
    features/install-runtime/README.md -name '*.md' -not -path '*/archive/*' -print0 \
  | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'
(clean — no leak files)

$ # Stale staging path check
$ grep -rn 'staging/backlogs/project/ci-symlink-integrity-check' features/install-runtime/
(none — correctly removed)

$ # Any surviving session-only coord path in bodies
$ grep -rnE 'preparation/|evaluation/iter|rawdata/|draft-iter|staging/' \
    features/install-runtime/{backlogs,checklists,references,scenarios}/*.md features/install-runtime/README.md
(none — all session-coords removed)

$ # README ## Subdirectories vs live dirs
live dirs (9): archive backlogs changelogs checklists decisions design discussions references scenarios
README §Subdirectories (9): decisions design discussions references scenarios checklists backlogs changelogs archive
MATCH

$ # Scope: files touched outside 4 subdirs + README
$ git show e94e94b --name-only --format='' | grep -vE '...(backlogs|checklists|references|scenarios)/|.../README.md'
(none — no archive, no P5a, no other subdirs touched)
```

## Must-preserve list

- The §4.3 reclassify-not-delete done correctly: the project ci-symlink backlog re-link (resolving) replacing the stale staging path — do not regress this to a deleted/dangling ref.
- The reciprocal sibling cross-links between the two references and between the two scenarios — both directions resolve; keep them paired.
- All ADR-fact carry-forward in backlogs (e.g., the `exec {fd}>>...; flock -x "$fd"` fd-pattern detail in sidecar-lock, the `git diff --cached --raw` plumbing fix in ci-symlink) — these load-bearing technical facts must survive any future edit.
- Form A vs Form B checklist split — `mirror-policy-empirical-verification.md` legitimately keeps the table form; do not flatten it to prose.

## Overall verdict

PASS — no Critical, High, Medium, or Low findings. Content fully preserved, all cross-refs resolve, all forms match templates exactly, both gates clean, scope correct.
