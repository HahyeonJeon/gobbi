# Sibling-parameter pattern keeps `compile()` pure

**Priority:** Medium (architectural cleanliness)

**Tech-stack:** typescript, gobbi-cli

## What happened

PR-FIN-1e initially proposed extending `CompileInput` (`packages/cli/src/specs/types.ts`) with a new `originals` field carrying the spec's pre-overlay `(modelTier, effort)` values per agent role. Architecture evaluator (and Plan-eval Project F2) flagged this as a layering violation:

1. `CompileInput` is consumed by ~11 source/test sites; a new field would either break every fixture (if required) or silently miss the new behavior (if optional)
2. `assembly.ts::compile` is documented as "deterministic given (spec, state, dynamic)" — adding `originals` to its input bag widens that contract to "deterministic given (spec, state, dynamic, settings-derived overrides)"
3. The snapshot tests rely on `CompileInput` literals; widening would force fixture updates across the entire spec suite

## User feedback

Architecture evaluator's recommendation: keep `CompileInput` unchanged and pass `originals` as a sibling parameter via `CompileOptions` (the same options bag that already carries `lintRules`, `allocator`, etc.). This was adopted as the locked design choice in plan v2.

## Correct approach

When extending a function that has a "pure" or "deterministic given inputs" contract:

1. **Don't widen the input type.** Adding fields to `CompileInput` (or any equivalent input bag) violates the contract for every existing caller.
2. **Use the options bag (or add one).** Existing call sites that don't care about the new behavior get default behavior; new call sites opt in by passing the new option.
3. **Default the new option to "no-op behavior."** When `compile(input, {})` is called without `originals`, the new agent-routing block is NOT emitted — preserving byte-identical output for backward compat.

The shipped pattern in `packages/cli/src/specs/assembly.ts`:
```
interface CompileOptions {
  readonly allocator?: BudgetAllocator;
  readonly contextWindowTokens?: number;
  readonly lintRules?: readonly ContentLintRule[];
  readonly lintMode?: 'throw' | 'collect';
  readonly originals?: Readonly<Record<string, AgentOriginal>>;
  readonly slotHint?: string | null;
}
```

`originals` and `slotHint` are sibling parameters — `compile(input, {})` works identically to before; `compile(input, {originals, slotHint})` opts into the agent-routing block. Snapshot tests that don't pass `originals` stay byte-stable. This is the right pattern for any future "settings-aware extension to a pure function" work.
