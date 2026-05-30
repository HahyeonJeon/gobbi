# Overall

## COD-OVERALL-001 — Cache allow-set coverage is the blocking decomposition gap

Type: checklist_gap
Severity: High
Confidence: 100

Evidence:
- Project finding COD-PROJ-001: the ratified post-install cache allow-set gate is claimed in the self-review and staged decision, but absent from T1 and T5 executable verifiers.

Why-it-matters:
The plan is otherwise ordered and mostly complete, but this omission drops a ratified success criterion tied to the prior high-severity cache-payload failure mode.

Suggested-direction:
Revise the plan so the cache allow-set is explicitly verified at source-package time and installed-cache time. The graph can stay 8 tasks; the missing gate belongs in T1 and T5.

## COD-OVERALL-002 — Secondary executable-quality risks remain in T5/T7

Type: assumption_risk
Severity: Medium
Confidence: 75

Evidence:
- Usage finding COD-USAGE-001: T5 does not pin the concrete installed-case hook trigger harness.
- Consistency finding COD-CONS-001: T7 creates a new canonical skill after T1 while the sync trigger and T1 verifier are worded against the canonical skill root.
- Risk finding COD-RISK-001: T5/T6 do not define a cleanup or isolation boundary for plugin install state.

Why-it-matters:
These do not invalidate the whole task graph, but they leave too much execution judgment in the most stateful runtime checks.

Suggested-direction:
Tighten T5 with concrete CLI/environment mechanics, tighten T1/T7 around a frozen packaged-skill allowlist, and add install-state cleanup or temp-config isolation.

VERDICT: REVISE
