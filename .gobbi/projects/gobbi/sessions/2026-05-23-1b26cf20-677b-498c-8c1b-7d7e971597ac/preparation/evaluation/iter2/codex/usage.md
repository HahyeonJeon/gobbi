## Artifact Summary + Memory reads

What: Usage evaluates whether Planning, Execution, and Wrap-up can consume the iter2 corrected Preparation output without forming the wrong mental model. Why: the next consumer should not reintroduce the false mirror model or over-edit workflow sub-phase docs. How: iter2 supplies a corrected mirror-canonical decision, closes the sync backlog as moot, and adds an excluded-files rationale plus Planning verification gate. Scope: T1/T3 readiness only. Consumers: Planning task-brief author, T1/T3 executors, Wrap-up assistant.

Memory reads: `draft-iter2.md`; five iter2 target staging files; all iter1 Codex/Claude evaluation files; `draft-iter1.md`; `sub-steps-a-d-iter1.md`; project rule and mistakes; evaluation docs. Verification included the required symlink/workflow/staging checks, targeted stale-wording `rg`, `git ls-files -s` for symlink-vs-regular-file modes, and a temporary symlink rewrite check.

## Locked Frame (Stage 1)

Scenario U1: Planning can brief mirror topology correctly.
- Check U1.1: The current decision says mirror canonical and workspace symlink runtime layer.
- Check U1.2: The old workspace-canonical decision is marked superseded.
- Check U1.3: The old manual mirror-edit instruction is rescinded.

Scenario U2: Planning can brief the workflow doc set without clarifying questions.
- Check U2.1: Five target docs are listed.
- Check U2.2: Two excluded docs are listed with rationale.
- Check U2.3: Verification can catch accidental sub-phase edits.

Scenario U3: Wrap-up can route every staging file.
- Check U3.1: Accepted and superseded decisions remain in `staging/decisions/`.
- Check U3.2: Moot backlog remains in `staging/backlogs/project/`.
- Check U3.3: D-4 design remains in `staging/design/`.

Scenario U4 (adversarial): A tired executor follows the corrected guidance but still breaks the symlink layer.
- Check U4.1: The guidance says which path to cite.
- Check U4.2: The guidance says which edit operations are safe on a symlink path.
- Check U4.3: The task brief can verify that workspace symlinks were not replaced.

Accessibility/I18n: not applicable to UI; the internal markdown remains scannable via headings and tables.

## Per-scenario per-check results

U1.1: Yes. The accepted decision states mirror canonical and workspace symlink runtime layer.
U1.2: Yes. The old decision is `status: superseded` with a `superseded_by` pointer.
U1.3: Yes. The new decision and draft both rescind manual mirror-edit discipline.
U2.1: Yes. D-4 names the five loop docs.
U2.2: Yes. D-4 names `evaluation.md` and `memorization.md` and explains exclusion.
U2.3: Yes. The D-4 gate checks for five positive matches and zero sub-phase matches.
U3.1: Yes. Decision files are in `staging/decisions/`.
U3.2: Yes. The moot backlog is in `staging/backlogs/project/`.
U3.3: Yes. The design file is in `staging/design/`.
U4.1: Yes. The recommended convention is workspace `.claude/skills/...` for runtime-loadability discoverability.
U4.2: No. The artifact does not warn that symlink-replacing tools are unsafe on the workspace path.
U4.3: No. No instruction tells Planning to verify `test -L` on workspace skill paths or prefer canonical mirror paths for bulk rewrites.

## Iter1 finding dispositions

ID: COD-USAGE-PREP1-001
disposition: addressed
evidence: The false workspace-canonical model is replaced by the accepted mirror-canonical symlink decision.

ID: COD-USAGE-PREP1-002
disposition: superseded
evidence: Manual mirror-edit ambiguity is removed, but the consumer-facing edit-method gap remains as COD-USAGE-PREP2-001.

ID: COD-USAGE-PREP1-003
disposition: addressed
evidence: The iter2 draft and this frame explicitly include wrong-mental-model scenarios for mirror policy consumption.

## Typed findings

ID: COD-USAGE-PREP2-001
Type: assumption_risk
Domain: task-briefing
Disposition: open
Confidence: 100
Severity: High
Evidence: The new policy tells Planning that skill-file briefs can cite either path and recommends workspace paths, while also saying editing either path edits the same physical file. That is only safe for symlink-following edit operations. Tool evidence: workspace paths are tracked symlinks (`git ls-files -s` mode `120000`), and a temporary `sed -i` rewrite on a symlink path replaced the symlink with a regular file while leaving the canonical target unchanged. A Planning brief copied from the current artifact can still be wrong at 3am unless it says how to preserve the symlink layer.
surfaced-by: codex

## Low-confidence appendix

None.

VERDICT: REVISE
