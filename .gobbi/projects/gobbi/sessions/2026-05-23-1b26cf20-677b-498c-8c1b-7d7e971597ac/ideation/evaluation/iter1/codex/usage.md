## Artifact Summary + Memory reads
Artifact: Ideation iter1 draft for T1 worktree-first sessions and T3 `agents[]` telemetry capture.
Primary consumers: Planner, Executor, future manager, future Codex/plugin user, and reviewer.
What the consumer needs: a file map, success criteria, failure modes, and enough path/schema specificity to implement without re-asking the user.
Memory reads:
- `ideation/rawdata/draft-iter1.md` full file.
- `.claude/skills/ideation/evaluation.md` lines 209-255 for Usage seed scenarios.
- `AGENTS.md` lines 3-13, 17-23, and 86-100 for repo-local Codex entry points.
- `.codex-plugin/plugin.json` line 8 for plugin skill root.
- `.claude/skills/orchestration/templates/session.template.json` lines 28-48 for current `agents[]` fields.
- `.claude/settings.json` lines 31-39 for existing hook object.
- `.claude/hooks/session-start.sh` lines 13-25 and 51-67 for hook input/env precedent.
- `rg -n "^Your phase:|^Your iteration:|^Your sub-step:|^Your step:" .claude/skills/orchestration/workflow .claude/skills/delegation -g '*.md'` returned no output.
- Project mistakes: `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`, `leader-iter2-verification-claim-without-evidence.md`, and `evaluator-returned-verdict-inline-no-per-perspective-files.md`.

## Locked Frame (Stage 1)
Scenario U1: Planner can produce task files without asking where implementation should land.
- Check U1.1: Every checklist item names the correct source-of-truth path.
- Check U1.2: If multiple path surfaces exist, the sync obligation is explicit.
- Check U1.3: Backlog and deferred items are still findable.

Scenario U2: Executor can implement T3 hook/reconstructor without inventing state discovery.
- Check U2.1: Session-dir resolver has concrete inputs available in hook stdin or environment.
- Check U2.2: The script knows how to discover project name, date, and session id.
- Check U2.3: Missing or malformed inputs produce deterministic non-blocking behavior.

Scenario U3: Operator can validate `agents[]` success.
- Check U3.1: Field-population threshold has a denominator.
- Check U3.2: Required and optional fields are distinguished.
- Check U3.3: Verification command is concrete enough for a future session.

Scenario U4: Existing and future delegation prompts remain understandable.
- Check U4.1: Structured metadata headers are introduced with migration/fallback behavior.
- Check U4.2: Legacy prompts missing headers do not silently produce null telemetry.
- Check U4.3: Regex patterns are documented where consumers will see them.

Scenario U5 (adversarial): Consumer forms the wrong mental model.
- Check U5.1: "worktree-first" default vs direct-mode opt-out is stated where work starts.
- Check U5.2: Extra `status` field behavior is visible despite template deferral.
- Check U5.3: Failure modes explain what the operator sees and does next.

Scenario U6: Accessibility/I18n awareness.
- Check U6.1: UI accessibility is explicitly not applicable.
- Check U6.2: User-facing strings or logs are treated as operator-facing text.

Scenario U7: Observability at 3am.
- Check U7.1: Logs or warnings are named for hook/reconstructor failure.
- Check U7.2: Reconstructor reports orphans and does not delete.
- Check U7.3: The next manager can identify whether hook or reconstructor wrote an entry.

## Per-scenario per-check results
U1.1: No. The draft points implementation at `.claude/skills` while `AGENTS.md` and plugin manifest identify `.agents/skills` and `.gobbi/projects/gobbi/skills` as Codex/plugin sources.
U1.2: No. No section explains how `.claude/skills` updates sync to `.gobbi/projects/gobbi/skills`.
U1.3: Yes. Backlog and reference files are listed and file counts verified.
U2.1: No. D-3-3 states `$cwd/.gobbi/projects/<name>/sessions/{date}-{ssid-from-session_id}/session.json`, but the available hook precedent lists `session_id`, `transcript_path`, `cwd`, and hook fields, not project name or date.
U2.2: No. Project name and session date are placeholders, not a concrete extraction algorithm.
U2.3: Partial. T3 F-1 says strict guards and reconstructor recovery, but resolver failure behavior is underspecified.
U3.1: No. `>= 90% field population` is stated, but no denominator is defined.
U3.2: Partial. The existing template shows fields, but `status` is intentionally extra-schema.
U3.3: Partial. The draft names future smoke tests but not the exact jq formula.
U4.1: Partial. The convention is in the checklist, but no migration behavior is stated.
U4.2: No. `rg` found no existing `Your phase:` style headers in current workflow/delegation docs.
U4.3: Yes. The regex is listed at draft lines 321-326.
U5.1: Yes. Direct mode opt-out is preserved at draft lines 292-296.
U5.2: Partial. The extra `status` behavior is visible in Scope and scenarios, but not reconciled with template consumers.
U5.3: Partial. Failure scenarios exist, but not all include operator action.
U6.1: Partial. The artifact says not security-sensitive but does not explicitly mark accessibility/i18n not applicable.
U6.2: Partial. Hook logs/warnings are implied, not specified.
U7.1: No. No log format is named for failed hook writes.
U7.2: Yes. Orphan-report-only is explicit at lines 213, 250, and 307-312.
U7.3: No. Entries do not include a source field such as `recordedBy: hook|reconstructor`.

## Typed findings
COD-USAGE-001
- type: design_flaw
- domain: docs-sync
- confidence: 75
- severity: High
- evidence: `draft-iter1.md:238-253` names `.claude/skills` targets; `AGENTS.md:3-13` and `.codex-plugin/plugin.json:8` identify `.gobbi/projects/gobbi/skills` as the plugin-facing source; `if test -L .claude/skills/git ...` returned `.claude/skills/git not-symlink`.
- surfaced-by: codex
- disposition: open
- detail: A future Codex executor can faithfully follow the checklist and still update the wrong skill surface. This is a consumer-facing usability failure, not just style.

COD-USAGE-002
- type: design_flaw
- domain: process
- confidence: 75
- severity: High
- evidence: `draft-iter1.md:314` defines the session-dir resolver with `<name>` and `{date}` placeholders; `session-start.sh:13-25` documents hook inputs without project name or date.
- surfaced-by: codex
- disposition: open
- detail: The hook/reconstructor consumer has to invent how to find the session directory. This echoes COD-STRUCT-001 from the already-written Structure evaluation and should block Planning until the algorithm is concrete.

COD-USAGE-003
- type: checklist_gap
- domain: observability
- confidence: 75
- severity: Medium
- evidence: `draft-iter1.md:52` and `draft-iter1.md:120-122` state `>= 90% field population`, but no jq formula or required-vs-optional denominator is provided.
- surfaced-by: codex
- disposition: open
- detail: The next operator cannot tell whether the success criterion passed. Add a precise denominator and verification command.

COD-USAGE-004
- type: checklist_gap
- domain: process
- confidence: 75
- severity: Medium
- evidence: `draft-iter1.md:253` requires metadata headers in every delegation prompt; `rg -n "^Your phase:|^Your iteration:|^Your sub-step:|^Your step:" .claude/skills/orchestration/workflow .claude/skills/delegation -g '*.md'` returned no output.
- surfaced-by: codex
- disposition: open
- detail: The artifact needs a rollout/fallback plan for existing prompts that do not yet contain the new headers.

## Low-confidence appendix
- Low-confidence note: If Execution plans to patch both `.claude` and `.gobbi` surfaces, COD-USAGE-001 can be downgraded after the plan states that explicitly.
- Low-confidence note: A hook could derive project/date by walking parent directories or reading nearby `session.json`, but that algorithm is not in the artifact.
- UI accessibility and i18n are mostly not applicable; operator-facing log strings remain applicable.
Verdict: REVISE
