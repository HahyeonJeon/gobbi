VERDICT: PASS

## Summary

P4 reshaped 9 docs under `features/guardrails/` to the §4 dev-doc standard (commit `d24c61c`, +50/-30). I diffed the commit file-by-file, read each post-image, verified every cross-ref target against the filesystem, ran the D5 body scan and the §4.5 leak gate, and confirmed scope. The work is clean.

- **Scope**: all 9 changed files are under `features/guardrails/`; nothing in `archive/`, no other feature touched.
- **Content preservation**: no load-bearing fact, bullet, or precise path was deleted or weakened without relocation. The "31 documented hook events" docs-sync fact is preserved verbatim (not silently corrected); the verbatim `PostToolUseFailure` quote tables remain; precise session paths preserved (the posttooluse-failure backlog `## Originating session` was upgraded from a bare `sessions/` to the full session id `2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`); the cross-session manifest + design-doc paths in the changelog are intact and the design path resolves on disk.
- **§4.2 contracts**: every doc matches its template's section shape (README: Overview/Status/Subdirectories/Recent activity/Open items/Related; backlogs: Context/Why deferred/When to pick up/Suggested approach/Originating session/Related; changelog: **Task:**/Summary/What changed/Verification/Deferred/Related; discussion: Context/Question/Options considered/User decision/Implication/Related; references: Insight/Related/Why it applies/Source/Excerpt/Usage history; checklist: Context/Checklist item/Deferred/Related).
- **§4.3 self-contained prose**: session coordinates (`T3`, `D-3-3`, `iter2/iter3`, `COD-RISK-004`, `COD-OVERALL-ITER3-001`, `draft-iter3.md`, `Planning LOCK #3`, `W3-T3`, `W3-T5`) were converted to self-contained prose. The two `iter2` grep hits that survive are inside the cross-referenced mistake filename `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` — a legitimate link to an existing file, not a load-bearing coordinate (§4.3 exempts literal mentions in references).
- **§4.4 KEEP**: no KEEP/base/extension key stripped; the only frontmatter touched is a `# Title` line (discussion/reference titles) — no key removal.
- **§4.5 leak gate**: empty.

## Findings

No Critical/High/Medium findings. Two Low observations, both non-actionable (no fix recommended):

- [general] [Low] [confidence 100] The checklist `hook-event-count-31-vs-29-docs-sync.md` dropped the inline pointer "(lines 45-73)" when rewording (`checklists/hook-event-count-31-vs-29-docs-sync.md:17`). This is not a weakened load-bearing pointer: the referenced file gained a `## Related` section in this same commit, so the 45-73 range is now stale; the load-bearing fact ("that reference enumerates only 29 event names") is fully preserved. Dropping a now-invalid internal line range is correct, not a regression.
- [general] [Low] [confidence 100] The schema reference removed the bare-filename companion ref `claude-code-transcript-tooluseresult-empirical.md` and replaced it with self-contained prose (`references/claude-code-posttooluse-hook-schema.md:91`). This was a CORRECT removal of a dangling link, not a false claim — see Cross-ref resolution check below.

## Cross-ref resolution check

Every `## Related` / inline doc link in the changed files points to an existing file:

- README Open-items + Related → `backlogs/hook-event-count-31-vs-29-docs-sync.md`, `backlogs/posttooluse-failure-webfetch-verification-gap.md`, `backlogs/goodhart-factor-when-demanded-deferred.md` — all EXIST.
- `references/claude-code-hooks-12-lifecycle-events.md` Related → `claude-code-posttooluse-hook-schema.md` (sibling, EXISTS) + `checklists/cross-layer-drift-gate.md` (EXISTS).
- `references/claude-code-posttooluse-hook-schema.md` Related → `claude-code-hooks-12-lifecycle-events.md` (sibling, EXISTS), `checklists/hook-event-count-31-vs-29-docs-sync.md` (EXISTS), `backlogs/hook-event-count-31-vs-29-docs-sync.md` (EXISTS), `backlogs/posttooluse-failure-webfetch-verification-gap.md` (EXISTS).
- `checklists/cross-layer-drift-gate.md` Deferred → repointed from a stale `staging/backlogs/project/...` path to `.gobbi/projects/gobbi/backlogs/codex-ci-integration-for-dual-system-eval.md` — target EXISTS (broken ref correctly repaired). Related → `mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md` — EXISTS.
- `discussions/...mistake-bundle...` cross-refs the mistake `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` — EXISTS under `mistakes/`.

**Companion-ref removal verdict (the flagged change):** The schema file's old text was `(proven empirically — see companion reference \`claude-code-transcript-tooluseresult-empirical.md\`)`. As a bare filename it resolves sibling-relative to `guardrails/references/`, where it does NOT exist (the actual file lives under `features/install-runtime/references/`). So the original was a dangling sibling link. The executor's replacement does NOT claim the target doesn't exist — it states the fact was "verified empirically during the guardrails Ideation" with a pointer to the Insight section above. This is a correct dangling-link removal converted to self-contained prose; no NEW dangling link introduced. Not penalized.

## Verification outputs

```
$ git show d24c61c --stat
 README.md                                         | 16 +++++++++++++---
 backlogs/goodhart-factor-when-demanded-deferred.md |  4 ++--
 backlogs/posttooluse-failure-webfetch-verification-gap.md | 7 +++----
 changelogs/2026-05-26-bundle-b-rehome.md          |  6 +++---
 checklists/cross-layer-drift-gate.md              |  6 +++---
 checklists/hook-event-count-31-vs-29-docs-sync.md |  4 ++--
 discussions/2026-05-24-mistake-bundle-extension-to-t3.md | 8 ++++----
 references/claude-code-hooks-12-lifecycle-events.md | 9 +++++++--
 references/claude-code-posttooluse-hook-schema.md | 20 +++++++++++-------
 9 files changed, 50 insertions(+), 30 deletions(-)

$ # D5 body scan (session-coordinate leaks)
.../discussions/2026-05-24-mistake-bundle-extension-to-t3.md:27: ...manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md...
.../discussions/2026-05-24-mistake-bundle-extension-to-t3.md:37: ...manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md...
# both hits are the filename of an EXISTING cross-referenced mistake — legitimate per §4.3, not a leak

$ # §4.5 leak gate
(empty — 0 leak files)

$ # scope check: paths outside features/guardrails/
(empty — all 9 files under features/guardrails/)
```
