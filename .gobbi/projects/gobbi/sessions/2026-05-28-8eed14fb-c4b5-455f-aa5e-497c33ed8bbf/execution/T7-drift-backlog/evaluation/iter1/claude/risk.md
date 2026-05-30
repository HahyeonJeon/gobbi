# T7 evaluation — risk perspective (iter1)

**Target:** `.gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md`

**Perspective:** risk — what could go wrong if this ships as-is.

## Stage 0–1: Frame
- Risk scenarios: (a) file gets stale, (b) reader misinterprets options, (c) drift gets resolved silently elsewhere and this stays open.

## Stage 2
- (a) Staleness: The frontmatter cites the specific config keys (`chat.models.claude.executor` etc.). If those keys are renamed later, this doc becomes a hint-but-not-truth — but `git log` + the named paths are grep-able. Low risk.
- (b) Misinterpretation: Options (a/b/c) are labeled, each rationalized in one sentence. Option (c) explicitly defers to Ideation. Low risk.
- (c) Silent resolution elsewhere: If a future session edits `settings.default.json` OR `delegation/SKILL.md` without closing this backlog, the doc and reality desync. Mitigation: `disposition: open` + `status: active` is visible to backlog sweeps; standard housekeeping catches this.

## Findings
**F1** — Type: `assumption_risk` · Domain: `process` · Disposition: `open` · Confidence: 25 · Severity: Low
- Evidence: No `shipped_in` / closure-trigger hint in body. §2.2 backlogs lists `shipped_in` as an extension.
- Why it matters: When the drift is resolved, a future Wrap-up needs to know which PR closed it. Standard backlog closure flow handles this, but a one-line "close when both files agree on assignments" trigger would help.
- Suggested direction: optional; current state is acceptable.

## Verdict
**PASS** — Standard backlog risks; no novel risk introduced by this artifact.
