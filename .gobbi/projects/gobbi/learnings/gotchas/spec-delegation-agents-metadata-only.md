# `spec.delegation.agents[*]` is metadata-only without `agent-routing` block

**Priority:** High (wrong output looks correct)

**Tech-stack:** typescript, gobbi-cli

## What happened

PR-FIN-1e research surfaced that `spec.delegation.agents[*].modelTier` and `.effort` fields exist in the validated `StepSpec` and are walked by the SubagentStop hook for artifact validation, but **`assembly.ts::renderSpec` (lines 524-623) NEVER reads them into the rendered prompt prose**. The orchestrator's spawn decisions today flow from `_gobbi-rule.md:51-55` Model Selection (always-active via `_gobbi-rule-container` symlink), not from the spec.

The first ideation pass assumed that overlaying settings onto `spec.delegation.agents[*]` would change the orchestrator's spawn behavior. It would not — the orchestrator never sees those fields in the rendered prompt. Both ideation researchers (innovative + best-practice) independently flagged this as load-bearing.

## User feedback

User correctly identified that "settings exist but do nothing observable" is a lie of completion: shipping the schema + cascade overlay without rendered-prompt visibility would have left the cluster's locked decision #8 ("wire them, not delete") unfulfilled. Folded the `agent-routing` block back into PR-FIN-1e scope.

## Correct approach

To make settings overrides change orchestrator behavior, the spec values must reach the rendered prompt prose:
1. Settings flow into `spec.delegation.agents[*]` via the loader overlay (`loadSpecForRuntime`)
2. The renderer (`assembly.ts::renderAgentRoutingBlock`) must explicitly emit a static block listing each agent's resolved `(role, modelTier, effort)` with provenance — `(default)`, `(override: <slot>)`, or `(auto: resolve via _gobbi-rule Model Selection)`
3. The orchestrator reads the block and uses those values when calling `Agent()`

Without step 2, steps 1 and 3 are decoupled — settings reshape the spec object but the orchestrator never sees the change.

**Future check:** before shipping any "wire X into spawn pipeline" PR, verify that the rendered prompt actually contains the resolved value. Grep the compiled prompt output for the field; if it's not there, the orchestrator can't act on it.
