# Verdict events only fire from eval steps

---
priority: high
tech-stack: typescript, gobbi-cli, state-machine
enforcement: advisory
---

**What happened**

`decision.eval.verdict` events carry one of `'pass' | 'revise' | 'escalate'`. Pre-PR-#206, the reducer arms for `pass` and `revise` relied on `findTransition` returning null when fired from a non-eval step (so the event would land in an `err("No valid transition...")` path). The `escalate` arm had no rule and silently fell through to `return ok(state)` — a verdict event from an arbitrary step would be accepted as a no-op.

**User feedback**

CV-11 from the adversarial review campaign, fixed in PR #206. Reviewer noted: "ESCALATE is accepted as no-op — reducer returns `ok(state)` without error transition."

**Correct approach**

Verdict events are valid ONLY when the current `state.step` is an eval step (`*_eval` literal). The reducer now enforces this with an explicit eval-step gate at the `decision.eval.verdict` dispatch entry — BEFORE the per-verdict switch:

```
if (!isEvalStep(state.step)) {
  return error('decision.eval.verdict requires an eval step; got ${state.step}');
}
```

The per-verdict switch then handles the verdict semantics (pass → forward transition, revise → loopback, escalate → error step). Each arm uses `assertNever` for exhaustiveness on the verdict union.

**Why this matters**

The single dispatch-entry gate is the source of truth: future verdict variants (e.g., a hypothetical `defer`) inherit the rejection-from-non-eval-step behavior automatically rather than each variant having to re-derive it. The pre-fix design had three different rejection paths (or no rejection) for three verdicts — fragile.

See `packages/cli/src/workflow/reducer.ts` `decision.eval.verdict` arm and `packages/cli/src/workflow/__tests__/reducer.test.ts` for the regression tests added in PR #206 commit `25b9e85`.
