# Usage — iter2 Claude

## Stage 0 — Artifact Summary
See `project.md`. iter2 changes that affect Usage: D-3-4 input/result side disambiguation (line 377-381), structured-header migration note (T3-I-T3.e line 280), success-criteria denominator precision (Scope Contract line 64).

## Stage 1 — Locked Frame

### Scenarios (Usage)

**S-U-1 (carry)** — Operator can decompose / implement / consume — iter1 PASS.
**S-U-2 (carry)** — Diagnostic procedure for hook silence — iter1 U2 Medium.
**S-U-3 (carry)** — Success criteria operationally verifiable — iter1 PARTIAL (no denominator); iter2 line 64 specifies denominator + null-cell threshold.
**S-U-4 (carry, codex)** — Structured-header rollout / migration — iter1 COD-USAGE-004 Medium; iter2 T3-I-T3.e adds migration paragraph.
**S-U-5 (NEW iter2, adversarial)** — D-3-4 input/result side phrasing is operationally unambiguous; an operator can determine WHICH jq path produces WHICH field.

## Stage 2 — Findings

### S-U-3 (success-criteria denominator)

iter1 codex COD-USAGE-003 said `>= 90% field population` lacked a denominator. iter2 line 64: "The denominator for 'field population' is the count of the 12 schema fields (`id`, `name`, `type`, `step`, `phase`, `iter`, `model`, `system`, `transcriptPath`, `tokensUsed.{input,output,cacheRead,cacheCreation}`, `startedAt`, `finishedAt`) × N entries; the threshold is met when `< 10%` of those (field × entry) cells are null." Explicit denominator. Disposition: addressed.

### S-U-4 (structured-header migration)

iter1 codex COD-USAGE-004 flagged missing rollout/fallback plan for existing prompts. iter2 T3-I-T3.e (line 280) adds: "Add a migration paragraph: existing prompts that lack the headers will produce `null` for `step/phase/iter` in `agents[]` until the next prompt-template refresh." Explicit fallback (null entries) + explicit migration trigger (next prompt-template refresh). Disposition: addressed.

### S-U-5 (NEW — D-3-4 input/result clarity)

D-3-4 (lines 377-381) splits the hook stdin into two sides:
- **Input side**: `tool_input.prompt`, `tool_input.model` → step/phase/iter/sub-step/model
- **Result side**: `toolUseResult.agentId`, `toolUseResult.usage.*`, `totalDurationMs` → output telemetry

The operator-facing language reads: "There is no inconsistency between T3-I-3 ('step/phase/iter/model NOT in toolUseResult') and D-3-4 ('prompt-header parsing is sufficient') — T3-I-3 describes the RESULT side; D-3-4 extracts from the INPUT side." Disposition: addressed — but note `model` is now declared as input-side; T3-I-3 originally said `model NOT in toolUseResult`, which is consistent (model IS in `tool_input.model`, the input side). The split is unambiguous. PASS.

### S-U-2 (hook-silence diagnostic — carry-forward Medium)

iter1 U2: no documented diagnostic procedure for "hook silently wrote nothing." iter2 does NOT address this — the design has reconstructor as the recovery mechanism (F-1 mitigation, D-3-2) but no operator-facing "if you suspect the hook silently failed, run these steps" procedure. Where does hook stderr surface? Still undocumented. Disposition: open carry-forward, Medium.

### Typed findings

```yaml
finding-id: U1-iter2
type: general
domain: docs-sync
disposition: addressed
confidence: 100
severity: Medium
surfaced-by: claude
inherited-from: iter1/codex/usage COD-USAGE-003 + iter1/codex/overall COD-OVERALL-003
```
**U1 (carry-forward, addressed)** — Field-population denominator explicit at line 64 (`12 schema fields × N entries`, `< 10%` null threshold). Operator can now run a jq one-liner to verify.

```yaml
finding-id: U2-iter2
type: general
domain: docs-sync
disposition: addressed
confidence: 100
severity: Medium
surfaced-by: claude
inherited-from: iter1/codex/usage COD-USAGE-004
```
**U2 (carry-forward, addressed)** — Structured-header rollout/fallback plan in T3-I-T3.e migration paragraph (line 280).

```yaml
finding-id: U3-iter2
type: scenario_gap
domain: observability
disposition: open
confidence: 50
severity: Medium
surfaced-by: claude
inherited-from: iter1/claude/usage U2
```
**U3 (carry-forward, NOT addressed)** — No documented diagnostic procedure for the "hook silently wrote nothing" failure mode — the literal symptom T3 prevents. A 3am maintainer needs: (1) where does hook stderr surface? (2) what's the canonical jq diff between transcript-line tool_use count and `agents[] | length`? (3) how to invoke reconstructor manually? Reconstructor existence is documented but the diagnostic procedure is implicit. Evidence: draft F-1 (line 245) — "Reconstructor is the recovery mechanism" — but no operator-facing diagnostic checklist. Suggested direction: add "How to diagnose hook silence" sub-section OR a Wrap-up smoke-test command.

```yaml
finding-id: U4-iter2
type: general
domain: docs-sync
disposition: addressed
confidence: 100
severity: Low
surfaced-by: claude
inherited-from: iter1/codex/usage related to stdin enumeration
```
**U4 (carry-forward, addressed)** — F-8 (line 500) addresses iter1 COD-USAGE stdin enumeration by listing the stdin fields (`session_id`, `transcript_path`, `cwd`, `tool_use_id`, `tool_input.*`, `hook_event_name`) in D-3-3-resolver narrative. Operator now knows what's available.

### Low-confidence appendix
- (none above 25)

## Verdict
**PASS** — Usage is acceptable. iter2 addressed U1 (denominator), U2 (migration), U4 (stdin enumeration). U3 (hook-silence diagnostic) remains open at Medium / Confidence 50, which is a follow-up recommendation not a blocker per per-perspective threshold rules.
