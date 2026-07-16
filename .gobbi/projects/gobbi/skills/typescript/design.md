# TypeScript — Design

**Ownership** — the design *choice* for a TypeScript unit or API: function vs `const`-object vs class;
modelling variants as a union vs a class hierarchy; signature shape and when a generic is *earned*;
composition over inheritance; the ownership and mutation boundary (`readonly`); the least-demanding input
surface; and the exported-type / public `.d.ts` surface as the deliberate contract.

**Split criterion** — skill-writing P3 (d): a self-contained design sub-procedure an author works through
before writing bodies, distinct from the SKILL.md cold-load floor.

This doc **deepens, and does not restate,** SKILL.md § Procedure P3 (the six design acts) and Principles 2
(*design the TypeScript surface*) and 3 (*model with the type system*). SKILL.md P3 owns the *decision tables*
(`interface` vs `type`, when a generic is earned, discriminated union vs `enum`, `satisfies` vs annotation vs
`as`); this doc owns the *choice behind them* — which unit shape, which contract, which input surface fits the
caller. `typing.md` owns the type *form* (generic variance and bounds, guards, branded types, `.d.ts`
mechanics); `convention.md` owns name spelling; `async-resources.md` owns promise and disposal lifetime. The
parent P2 router sends a reader here on a unit-or-API shape choice; an ordinary module decides from `SKILL.md`
alone.

Every fenced `ts` block below type-checks under the skill's maximal-strict examples baseline (TS 5.9 floor); a
`declare` line stubs an assumed collaborator so the fragment stands alone. Constructs are valid at TS 5.9; tool
and library names are illustrative, not a lock.

**One bottom-up design sequence:** module tree and ESM boundary → candidate functions over plain data → only
the classes that earn their keep → signatures, earned generics, and the exported surface → typed skeleton
stubs. Revisit an earlier step when a later seam exposes a bad choice.

## Contents

1. [Unit shape: function, `const`-object, or class](#1-unit-shape-function-const-object-or-class)
2. [Type surface and signatures](#2-type-surface-and-signatures)
3. [Composition and ownership boundaries](#3-composition-and-ownership-boundaries)
4. [The input surface and the exported `.d.ts`](#4-the-input-surface-and-the-exported-dts)

---

## 1. Unit shape: function, `const`-object, or class

The decisive question is the same as the parent's: does state have a lifetime across calls? If not, a typed
function over plain data is the whole unit — TypeScript needs no class to give a transformation a home. A class
earns its keep only for identity, an invariant held across calls, or several behaviors over the same owned
mutable state. Below the function default, TypeScript offers two more shapes a nominal language reaches for a
class to express; pick by the table, switch on evidence.

| Form | Choose when | Switch signal |
|---|---|---|
| Function over plain data | one transformation; no state outlives the call | calls must share identity or hold an invariant across calls → a class |
| Closure (a function returning a function) | setup validates or derives values once, then a simple call repeats | the captured state needs several distinct operations → a class |
| `const`-object companion | a set of operations over one type, no per-instance state | instances carry independent mutable state → a class |
| Discriminated union + a function | a closed set of variants whose behavior switches on the tag | each variant owns mutable state and a lifecycle → a small class set |
| Class | identity, an invariant across calls, or several behaviors over owned mutable state | the surface is one constructor plus one method → a closure |

**A configured callable is a closure, not a one-method class.** When setup validates or derives values and the
result is a single repeated call, capture the values in a closure and return the function. Collapse a class
whose whole surface is a constructor plus one method.

```ts
type Rate = (amountCents: number) => number;

function makeRate(percent: number): Rate {
  if (percent < 0 || percent > 100) {
    throw new Error("percent must be within 0..100");
  }
  return (amountCents) => Math.round((amountCents * percent) / 100);
}
```

**A set of operations over one type is a `const`-object companion, not a class of `static` methods.** Name the
shape with an `interface`; give the operations a `const` object that shares the name (a type and a value may
share a name). Callers reach `Money.of` / `Money.add` with no instance, and there is no `static`-only class or
singleton to construct.

```ts
interface Money {
  readonly cents: number;
  readonly currency: string;
}

const Money = {
  of(cents: number, currency: string): Money {
    return { cents, currency };
  },
  add(a: Money, b: Money): Money {
    if (a.currency !== b.currency) {
      throw new Error("currency mismatch");
    }
    return { cents: a.cents + b.cents, currency: a.currency };
  },
} as const;
```

**Model a closed set of variants as a discriminated union with a function, not a class hierarchy.** The union
keeps data separate from behavior, stays erasable (no `enum`, no abstract base), and lets a new behavior be a
new function rather than a method added across every subclass. Adding a variant turns each switch into a
compile error until it is handled — the `never` exhaustiveness check SKILL.md P3 shows and `typing.md` §1 owns
the form of. Reach for a class hierarchy only when each variant owns mutable state and a lifecycle, not merely
different data.

```ts
type Notification =
  | { readonly kind: "email"; readonly address: string }
  | { readonly kind: "sms"; readonly number: string };

function assertNever(x: never): never {
  throw new Error(`unhandled variant: ${JSON.stringify(x)}`);
}

function recipient(n: Notification): string {
  switch (n.kind) {
    case "email":
      return n.address;
    case "sms":
      return n.number;
    default:
      return assertNever(n); // a new variant becomes a compile error here
  }
}
```

## 2. Type surface and signatures

A signature is the contract a caller reads before the body exists. This section owns its *shape* — argument
order, the required/optional boundary, and whether a type parameter earns its place; `typing.md` owns the
annotation form, `convention.md` the spelling.

**Prefer required, ordered parameters for a small arity; move to an options object when inputs are optional,
flag-like, or same-typed.** TypeScript has no positional-only or keyword-only marker, so an options object is
the tool that forces a name at the call site. Use it when two or more parameters share a type, when position no
longer identifies purpose, or when several inputs are optional.

**Kill the boolean trap with a literal union.** A bare boolean reads as `render(doc, true)` at the call site,
telling the reader nothing. A string-literal union names each state and stays erasable — the TypeScript form of
the parent's "no boolean flag" rule.

```ts
interface RenderOptions {
  readonly format: "html" | "text";
  readonly pretty?: boolean;
}

function render(doc: string, options: RenderOptions): string {
  const body = options.pretty === true ? `\n${doc}\n` : doc;
  return options.format === "html" ? `<p>${body}</p>` : body;
}
```

**Choose an optional property `?:` versus `| undefined` deliberately** — under `exactOptionalPropertyTypes`
(in the maximal-strict base) they differ. `limit?: number` means the key may be *absent*; `limit: number |
undefined` means the key must be *present* and may hold `undefined`. Pick the one the contract means; the flag
then rejects the other.

```ts expect-error
interface Query {
  readonly table: string;
  readonly limit?: number;
}

// @ts-expect-error exactOptionalPropertyTypes forbids an explicit `undefined` where the key may simply be absent
const q: Query = { table: "users", limit: undefined };
```

**A generic is earned only when the type parameter *links* one position to another** — an input to the output,
or two inputs to each other — so the caller's concrete type flows through and is preserved. A type parameter
that appears once, only in an input and never in the output, links nothing: it is a disguised `unknown`, and a
plain `unknown` (or a constraint) reads clearer. Do not add a type parameter for a future caller that does not
exist yet.

```ts
// earned: T links the element type of the input to the return type
function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}
```

```ts
// unearned: T appears once and links nothing — the element type is irrelevant to the count
function countGeneric<T>(items: readonly T[]): number {
  return items.length;
}

// fixed: drop the type parameter
function count(items: readonly unknown[]): number {
  return items.length;
}
```

Prefer a single signature with a union parameter over a stack of overloads; reach for overloads only when the
return type genuinely depends on the argument in a way one signature cannot state. `typing.md` §2 owns the
generic *form* — `const` type parameters, variance, and bounds.

## 3. Composition and ownership boundaries

**Compose by holding a collaborator; do not inherit to borrow behavior** — `coding` owns *why* (composition
over inheritance); the TypeScript spelling is here. Receive a collaborator at the constructor boundary and hold
it as a `readonly` field, typed by a small structural `interface` so the surface stays swappable and testable.

**`readonly` marks the ownership and mutation boundary the signature would otherwise leave unstated.** A
`readonly` field cannot be reassigned; a `readonly T[]` parameter tells the caller "I only read this array, I
will not mutate it"; a `readonly`-fielded return type asks the caller not to mutate what it received. Because
these erase at runtime they cost nothing, yet they document ownership at the exact boundary. TypeScript's
`readonly` is *shallow*, so a value contract must reach one level in — `readonly tags: readonly string[]`, not
`readonly tags: string[]`, which still permits `config.tags.push(...)`.

Note a TypeScript-specific trap at the constructor boundary: `erasableSyntaxOnly` bans parameter-properties
(`constructor(private clock: Clock)`), so assign the field explicitly in the body.

```ts
interface Clock {
  now(): number;
}

class RateLimiter {
  readonly #clock: Clock;
  readonly #windowMs: number;
  #hits: number[] = [];

  constructor(clock: Clock, windowMs: number) {
    this.#clock = clock; // assign in the body — parameter-properties are non-erasable
    this.#windowMs = windowMs;
  }

  allow(limit: number): boolean {
    const cutoff = this.#clock.now() - this.#windowMs;
    this.#hits = this.#hits.filter((t) => t > cutoff);
    this.#hits.push(this.#clock.now());
    return this.#hits.length <= limit;
  }
}
```

The class above earns its keep — it holds an invariant (the sliding window) across calls over owned mutable
state (`#hits`) — and it composes `Clock` by interface rather than extending a base clock. A pure reader states
its non-mutation in the signature:

```ts
function total(prices: readonly number[]): number {
  return prices.reduce((sum, p) => sum + p, 0);
}
```

```ts
interface Config {
  readonly name: string;
  readonly tags: readonly string[]; // deep: neither the field nor the array can be mutated
}
```

## 4. The input surface and the exported `.d.ts`

**Demand only the fields the unit uses.** When a body reads two fields of a wide record, a signature that takes
the whole record is stamp coupling: it hides the real dependency and makes every caller assemble more than the
call needs. Take the fields as parameters (data coupling), a small purpose-built value carrying exactly the
used surface, or — because TypeScript is *structural* — an `interface` that declares only the members the unit
reads, which any wider value already satisfies. Keep an aggregate whole only when the unit genuinely uses it as
one concept. The structural branch is the TypeScript-specific gain: the signature narrows to two members while
a caller passes the wide object it already holds, no adapter required.

```ts
declare function fetchWithRetry(timeoutMs: number, retries: number): Promise<Response>;

interface AppConfig {
  readonly baseUrl: string;
  readonly timeoutMs: number;
  readonly retries: number;
  readonly logLevel: string;
  readonly apiKey: string;
}

// bad — the signature demands all of AppConfig, but the body reads only 2 of its 5
// fields; baseUrl, logLevel, and apiKey go unused: stamp coupling
function fetchBad(config: AppConfig): Promise<Response> {
  return fetchWithRetry(config.timeoutMs, config.retries);
}

// good 1 — take the two fields it uses, as parameters (data coupling)
function fetchNarrow(timeoutMs: number, retries: number): Promise<Response> {
  return fetchWithRetry(timeoutMs, retries);
}

// good 2 — a small purpose-built value carrying exactly the used surface
interface RetryBudget {
  readonly timeoutMs: number;
  readonly retries: number;
}
function fetchBudgeted(budget: RetryBudget): Promise<Response> {
  return fetchWithRetry(budget.timeoutMs, budget.retries);
}

// good 3 — a structural interface: any value with these members satisfies it, so a
// caller may pass the wider AppConfig it already holds, yet the signature still
// declares only the two members the unit reads
interface RetryPolicy {
  readonly timeoutMs: number;
  readonly retries: number;
}
function fetchWith(policy: RetryPolicy): Promise<Response> {
  return fetchWithRetry(policy.timeoutMs, policy.retries);
}

declare const appConfig: AppConfig;
const pending: Promise<Response> = fetchWith(appConfig); // AppConfig already satisfies RetryPolicy
```

**The exported surface is the published contract — design it, do not let it fall out of the bodies.** Whatever
a module `export`s becomes its public `.d.ts`, and because TypeScript infers return types, an un-annotated
export can widen a return or leak an internal field into the contract at one keystroke (the risk Principle 2
names). Export only the intended API, keep helper types unexported, and annotate every exported return so an
internal shape cannot escape into the emitted declarations — the same discipline `isolatedDeclarations`
enforces mechanically (`modules-tooling.md` owns the flag). Prefer a named, narrow return type over an inferred
structural blob a consumer must read the body to understand.

```ts
export interface PublicUser {
  readonly id: string;
  readonly name: string;
}

// the explicit return annotation pins the published contract to PublicUser; without it,
// a later edit that returns an extra field (or `return row`) would silently widen the
// emitted .d.ts and leak an internal field such as `passwordHash`
export function loadUser(id: string): PublicUser {
  const row = { id, name: "Ada", passwordHash: "9f…" };
  return { id: row.id, name: row.name };
}
```

When the exported surface changes, it is a blast-radius change — coding P15 / principles P9 — so every
consumer, the emitted `.d.ts`, and the package `exports` move together (`packaging-publishing.md` owns
publishing evolution).
