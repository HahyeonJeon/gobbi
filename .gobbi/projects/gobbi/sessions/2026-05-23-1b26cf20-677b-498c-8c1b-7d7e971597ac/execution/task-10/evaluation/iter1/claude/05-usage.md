# Perspective: Usage

## Frame execution

**Scenario U1 — fresh reader builds a correct mental model of the hook+reconstructor flow without reading T07/T08 source.**

Walking the row 6 cell as a first-time reader:
- Identifies that PostToolUse + PostToolUseFailure both fire the hook. ✓
- Identifies the matcher is `Task|Agent`. ✓
- Identifies upsert key is `tool_use_id`. ✓
- Identifies idempotency comes from a separate verify-and-fix reconstructor at `.claude/scripts/reconstruct-agents.sh`. ✓
- Knows where metadata comes from (delegation structured headers, cross-link given). ✓

Then walking delegation `## Hook Integration`:
- Knows the four header names. ✓
- Knows when `sub-step` is required vs optional. ✓
- Knows the value-shape vocabulary per header. ✓
- Knows omission → `null` fields → "missing data" downstream. ✓
- Knows the lock is `flock -x` on a `.lock` sidecar, with atomic `mv`. ✓
- Knows concurrent spawns are safe without manager throttling. ✓

The mental model the reader can build is sound at the surface level. Conclusion: U1 passes.

**Scenario U2 — fresh reader writes a hand-rolled (non-template) delegation prompt with the right headers.**

Doc says: "Per-role templates ship the headers pre-filled with `<<slot>>` markers". Adversarial check: do they?

| Template | `Your phase:` | `Your iteration:` | `Your sub-step:` | `Your step:` |
|---|---|---|---|---|
| `templates/executor.md` | yes (`execution`) | yes (`<<iter-number>>`) | no | no |
| `templates/evaluator.md` | yes (slot) | yes (slot) | no | no |
| `templates/leader.md` | yes (slot) | yes (slot) | no | no |
| `templates/assistant.md` | no | no | no | no |

The doc claims **the headers** (plural, implying all four) ship pre-filled. Reality: only `Your phase:` and `Your iteration:` are in 3 of 4 templates; `Your sub-step:` and `Your step:` are absent from all four; `assistant.md` ships NONE of the four. A reader relying on the doc may add a sub-step at dispatch time and assume the template slot will catch it — and instead silently produce a `sub-step: null` entry.

**Scenario U3 — fresh reader reasons about `endStatus`.** See Consistency F-C-1 — the field name doesn't exist in the hook output, so a reader who tries to consume `agents[*].endStatus` from `session.json` will find nothing. This is a usage-correctness failure rooted in a Consistency defect.

## New findings

- **F-U-1 [docs-sync, Medium, 100]**: Delegation doc overstates template coverage. "Per-role templates ship the headers pre-filled with `<<slot>>` markers" implies all four headers across all four roles. Actual: 2 of 4 headers in 3 of 4 templates. Reader who trusts the doc and edits a template may omit `sub-step` even in scenarios where the doc table says it's required (parallel spawns).
- **F-U-2 [docs-sync, Medium, 75]**: `assistant.md` template ships ZERO structured headers despite the doc saying every delegation prompt MUST place the headers at the top. Either the spec needs to exclude assistant-role spawns (it doesn't say so), or the assistant template needs the headers added. Documentation-vs-template contradiction.

## Verdict

REVISE — F-U-1 + F-U-2 produce concrete reader-misleading defects, both Medium severity. Findings are docs-sync.
