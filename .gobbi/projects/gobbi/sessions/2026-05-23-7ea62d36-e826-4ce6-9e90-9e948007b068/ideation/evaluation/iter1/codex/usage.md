## Artifact Summary + Memory reads

Same target and memory reads as `project.md`. Usage lens: whether the next Planner/Executor/operator can consume the idea without guessing.

W/W/H gate: present; phase matches ideation.

## Locked Frame (Stage 1)

Scenario U1: Planner can turn A-G into tasks without re-asking the user.
- Check: every item has a file surface and validation method.
- Check: remaining concerns are explicitly marked blocking or non-blocking.

Scenario U2: Consumers know which Codex invocation path is available in their role.
- Check: manager-only, subagent-available, and user-only paths are distinguished.
- Check: empirical tool-surface witness is included.

Scenario U3 (adversarial): the bootstrap default wording causes the operator to choose or expect the wrong mode.
- Check: stated default matches `settings.default.json`.
- Check: if the draft intentionally changes the default, that decision is explicit.

## Per-scenario per-check results

U1: Mostly passes. File surfaces and validation methods are present; remaining concern 3 is labeled non-blocking at lines 510-514.

U2: Passes. Draft lines 340-361 reflect the user redirect: `codex exec` universal, plugin agent manager-only, slash command user-only. Tool verification confirmed subagents lack `Agent` and manager has `tools: "*"`.

U3: Fails. Draft says the mode question defaults Chat, but the existing defaults file says `mode: "auto"`.

## Typed findings

### COD-USAGE-001 - Mode question default conflicts with existing settings default

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Draft lines 468-474 rewrite Step 4 and state "Question 1 - mode ... Default Chat." Actual `.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json` line 3 sets `"mode": "auto"`. Draft lines 42 and 474 say defaults flow from settings.json / settings.default.json, but do not explicitly authorize changing the current default.
- Observation vs hypothesis: Observation for the contradiction; hypothesis for exact operator behavior.
- Why-it-matters: The bootstrap change is user-facing. If Planning follows the draft literally, the UI default and persisted settings default diverge, producing confusing behavior at the first session-start question.
- Suggested-direction: Resolve the default contract before downstream Planning; no implementation fix proposed here.

## Low-confidence appendix

No suppressed Usage findings.

Verdict: REVISE
