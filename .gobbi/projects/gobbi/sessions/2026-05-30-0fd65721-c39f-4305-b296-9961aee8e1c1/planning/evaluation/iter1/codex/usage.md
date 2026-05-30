# Usage

## COD-USAGE-001 — Fire-once validator is not concrete enough for a fresh Executor to automate reliably

Type: checklist_gap
Severity: Medium
Confidence: 75

Evidence:
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/artifacts/preparation-readiness.md:102-105` requires marker instrumentation and deterministic triggers for `SessionStart`, successful `PostToolUse`, and failing `PostToolUseFailure`.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/rawdata/plan.md:172-177` restates the installed-only environment, marker log, and failing Task requirement, but does not name the exact CLI harness, settings isolation, prompt/agent payloads, or marker source.
- Verified fact: the local `claude` CLI exists and exposes `--include-hook-events` only with stream-json output, plus `plugin marketplace add`, `plugin install`, and `plugin validate`. The plan does not bind T5 to those concrete commands or an equivalent harness.

Why-it-matters:
The Executor can satisfy the prose by inventing a validator that starts the wrong kind of Claude session, cannot trigger a Task/Agent failure deterministically, or counts hook lifecycle output rather than the installed plugin's actual registrations. That would produce a weak pass for the highest-risk runtime check.

Suggested-direction:
T5 should specify the harness at the same level as the JSON verifiers: the isolated Claude config/HOME strategy, marketplace add/install command shape, exact success and failure prompts or custom agent definitions, whether markers come from hook-event stream output or a controlled wrapper, and the pass/fail extraction rule keyed by `hook_event_name`.
