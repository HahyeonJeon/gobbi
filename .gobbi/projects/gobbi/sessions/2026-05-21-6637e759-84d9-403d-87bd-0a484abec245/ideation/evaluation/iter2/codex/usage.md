# Ideation iter2 — Usage perspective (codex)

## Stage 0 Artifact Summary

The artifact's users are the Planning loop, the Execution agent, and future maintainers reading the reset record after the repository has been stripped down. It tries to make a destructive cleanup operationally usable by listing concrete commands, success criteria, gate checks, and scenario mappings.

## Stage 1 Locked Frame

- Scenario U1: The Planner can produce tasks without asking what belongs in each stage.
  - Checklist: each user lock maps to a stage; out-of-scope is explicit; post-merge cleanup is included.
- Scenario U2: The Executor can run each stage without interpreting ambiguous gates.
  - Checklist: every destructive command has a precondition; failed gates say NEEDS_CONTEXT; SHA gate is satisfiable by a normal git workflow.
- Scenario U3: Future self can recover context after project memory is placeholdered.
  - Checklist: pre-reset tag exists; session-scoped backlog is referenced; deleted mistakes' lessons are encoded in the draft.
- Scenario U4 (adversarial): A tired executor deletes the live bare-UUID dir after seeing a SHA somewhere, but before durable session state is recoverable.
  - Checklist: the exact state file to inspect is named; the expected SHA is possible to write; indexed vs filesystem session state is clarified.

## Inherited Iter1 Findings

- F-U-01 (bare-UUID LAST delete gate ambiguity): superseded, not fully addressed. Iter2 improves the gate from vague "workflow writes committed" to two explicit checks, but the check is not satisfiable if the commit is required to contain its own SHA.
- F-U-02 (stub README rule mis-citation): addressed. D4 provides an inline template at lines 366-380 and Stage C points to D4 at line 262.

## Stage 2 Findings

### F-CX-U-01 — The executor cannot know what SHA should appear in `session.json`

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: High
- **Evidence**: Stage D says to capture the commit SHA at line 273. Stage E.1 says to stage the session dir after that at lines 277-288. Stage E.2 requires the commit containing the gitignore edits and staged session dir to have its SHA written into the surviving `session.json` at lines 292-294. D9 repeats this at lines 416-422.
- **Why-it-matters**: A user of the artifact cannot execute this gate as written. If they record the Stage D SHA, it is not the commit containing the staged session dir. If they record the E.1 commit SHA inside the same committed `session.json`, the SHA changes. If they write it after the commit, the working tree diverges and the draft does not state whether that divergence must be committed before E.2.

### F-CX-U-02 — E.2 ownership is unclear after "terminal post-commit" but before Wrap-up

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: E.2 is "TERMINAL post-commit" and "NOT part of any commit" at lines 290 and 296, but line 297 says further Wrap-up writes can still happen into the preserved date-prefixed dir and "into commits on the sweep branch as needed."
- **Why-it-matters**: The user story for the executor is ambiguous: "terminal" sounds like the last filesystem change, while line 297 allows subsequent committed writes. This becomes dangerous only because it touches session state; otherwise it would be Low.

## Per-perspective Verdict

REVISE. F-CX-U-01 is High/100.

## Must-Preserve

- Preserve the NEEDS_CONTEXT instruction when either E.2 condition fails.
- Preserve the date-prefixed session as the post-E.2 write target.
- Preserve D4's inline placeholder README template.
