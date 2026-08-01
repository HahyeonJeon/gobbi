---
name: typescript-typing
description: "MUST load when writing or reviewing TypeScript code to model or inspect types, narrowing, generics, unions, assertions, public declarations, or boundary validation."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# TypeScript Typing

TypeScript Typing governs how code models states, narrows values, uses generics and assertions, and exposes declarations. It distinguishes compile-time evidence from runtime validation and keeps unsound escape hatches visible.

These preferences apply after the runtime domain is understood. The goal is the narrowest honest model, not the most elaborate type expression.

## Principles

### Model valid states directly

Use the type system to make invalid combinations difficult to construct and exhaustive behavior easy to inspect.

### Earn abstraction from relationships

A generic is useful when it preserves a relationship among inputs, outputs, or members; otherwise a concrete type is clearer.

### Narrow from evidence

Values cross untrusted or untyped boundaries as `unknown` and become domain values only through runtime checks.

### Protect the public surface

Declarations are consumer contracts and must avoid leaking private implementation, unstable inference, or unsafe augmentation.

## Rules

- **MUST** accept external, decoded, or otherwise unverified data as `unknown` and parse or narrow it before use.
- **NEVER** use `any` where the program can preserve uncertainty with `unknown`, a relationship-preserving generic, or a precise boundary adapter. `any` disables checking and spreads that loss through assignment.
- **MUST** use `as` only to state a fact established outside the compiler and record or localize the evidence for that fact.
- **NEVER** use a type assertion, non-null assertion, or double assertion as a substitute for validation or control-flow narrowing.
- **MUST** make discriminated unions exhaustive with a `never` check when every variant must be handled.
- **MUST** inspect emitted public declarations and confine module or global augmentation to the owning integration boundary.

## Preferences

- Prefer discriminated unions over correlated optional fields or boolean combinations when a value has distinct modes.
- Prefer narrow input types and inference from precise values; widen only at an intentional abstraction or public boundary.
- Prefer generics that preserve a visible relationship, with the smallest useful constraint and no unused type parameter.
- Prefer built-in control-flow narrowing, user-defined guards, and parsers over assertions; return validated domain values from one boundary adapter.
- Prefer annotations for stable public contracts, `satisfies` when checking a value without replacing its useful inferred type, and `as const` for intentionally literal immutable data.
- Prefer `readonly` to express mutation ownership while remembering that it is shallow unless the model says otherwise.
- Prefer explicit return types on exported APIs when they stabilize declarations or compatibility; allow inference for local implementation details.
- Prefer `interface` for open object contracts intended for compatible augmentation and `type` for unions, aliases, and closed compositions, while following established project convention.
- Prefer utility types only when the transformed contract remains easier to understand than a dedicated domain type.

These are overridable house preferences except where a Rule establishes soundness. A project may choose different declaration styles, explicitness levels, or object-type forms while preserving the same honest runtime and public contracts.

This complete example narrows an unknown boundary value before returning a domain value:

```ts complete
interface User {
  readonly id: string;
}

function parseUser(value: unknown): User {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    typeof value.id !== "string"
  ) {
    throw new TypeError("invalid user");
  }
  return { id: value.id };
}
```

This negative example stays green only while the unsafe assignment remains rejected:

```ts expect-error
declare const payload: unknown;

// @ts-expect-error unknown data must be narrowed before assignment
const userId: string = payload;
```

This type-level example checks an exact relationship:

```ts type-level
type Equal<A, B> = [A] extends [B]
  ? ([B] extends [A] ? true : false)
  : false;

const same: Equal<Readonly<{ id: string }>, { readonly id: string }> = true;

// @ts-expect-error the properties are not the same type
const different: Equal<{ id: string }, { id: number }> = true;
```

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
