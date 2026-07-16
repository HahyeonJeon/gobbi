# TypeScript — Typing

**Ownership** — the type system: discriminated unions and `never` exhaustiveness; generics (`const` type
params, variance, constraints, `NoInfer`); conditional and mapped types; `satisfies` vs annotation vs `as`;
branded / nominal types; narrowing, guards, and inferred predicates; `unknown` vs `never`; `readonly` and
`as const`; utility types; `interface` vs `type`; and declaration-file authoring and module augmentation
(folded per design D3).

**Split criterion** — skill-writing P3 (b) lookup reference + (d) depth: the largest child doc, both a
by-decision lookup surface and a self-contained sub-procedure the parent floor cannot inline.

This doc **deepens, and does not restate,** the SKILL.md typing rules and Principle 3 (*model with the type
system*). The parent P2 router sends a reader here when a change reaches a public boundary, a generic, a guard,
a discriminated union, a `satisfies` / `as` decision, a branded type, or `.d.ts` authoring; an ordinary strict
module stays on the parent floor. SKILL.md P3 owns the *decision tables* (`interface` vs `type`, when a generic
is earned, `satisfies` vs annotation vs `as`); this doc owns the *mechanics* behind each row — why it holds,
how it fails, and the deeper forms the table cannot carry. `design.md` decides whether a given shape is the
right caller contract; it points here for the spelling.

Every fenced `ts` block below type-checks under the skill's maximal-strict examples baseline (TS 5.9 floor); an
untagged declaration-file block is a `.d.ts` (script-context) form the module-based example harness does not
compile, shown for its syntax.

## Contents

1. [Discriminated unions and `never` exhaustiveness](#1-discriminated-unions-and-never-exhaustiveness)
2. [Generics](#2-generics)
3. [Conditional and mapped types](#3-conditional-and-mapped-types)
4. [`satisfies`, annotation, and `as`](#4-satisfies-annotation-and-as)
5. [Branded and nominal types](#5-branded-and-nominal-types)
6. [Narrowing, guards, and predicates](#6-narrowing-guards-and-predicates)
7. [`unknown`, `never`, `readonly`, and `as const`](#7-unknown-never-readonly-and-as-const)
8. [Utility types and `interface` vs `type`](#8-utility-types-and-interface-vs-type)
9. [Declaration files and module augmentation](#9-declaration-files-and-module-augmentation)

---

## 1. Discriminated unions and `never` exhaustiveness

A discriminated union is the core modeling tool: a shared literal tag (`type`, `kind`, `ok`) lets the compiler
narrow to one member and prove every member is handled. SKILL.md P3 shows the canonical `switch` +
`assertNever`; this section deepens *why* it is total, *how* a new member breaks it, and a map-based
alternative.

The `assertNever` helper is total because control-flow narrowing reduces the discriminant to `never` once every
member is handled — so the `default` argument type-checks only while the switch is exhaustive:

```ts
type Action =
  | { type: "inc"; by: number }
  | { type: "reset" }
  | { type: "set"; value: number };

function assertNever(x: never): never {
  throw new Error(`unhandled variant: ${JSON.stringify(x)}`);
}

function reduce(count: number, action: Action): number {
  switch (action.type) {
    case "inc":
      return count + action.by;
    case "reset":
      return 0;
    case "set":
      return action.value;
    default:
      return assertNever(action); // `action` is `never` here — proof of totality
  }
}
```

Add a member and leave it unhandled: the `default` argument is no longer `never`, so `assertNever` fails to
compile — the missing case becomes a *build* error, not a runtime surprise:

```ts expect-error
type Action = { type: "inc" } | { type: "dec" };

function assertNever(x: never): never {
  throw new Error(String(x));
}

function label(a: Action): string {
  switch (a.type) {
    case "inc":
      return "up";
    default:
      // @ts-expect-error "dec" is unhandled, so `a` is `{ type: "dec" }`, not `never`
      return assertNever(a);
  }
}
```

When each member maps to a value rather than a computation, a `Record` keyed by the discriminant union is a
tighter total form: the compiler demands a key for every member, so a missing case fails with no `assertNever`
call:

```ts
type Kind = "draft" | "sent" | "paid";

// A Record keyed by the union forces a handler for EVERY member — a missing key
// is a compile error at the object literal itself.
const kindLabel: Record<Kind, string> = {
  draft: "Draft",
  sent: "Awaiting payment",
  paid: "Complete",
};

function describe(k: Kind): string {
  return kindLabel[k]; // `string`, not `string | undefined`: all keys are present
}
```

## 2. Generics

Add a type parameter only when it links an input to an output (or two inputs) across many types; SKILL.md P3
owns that *when-earned* decision. This section owns the four mechanics that make an earned generic precise.

A `const` type parameter (5.0) infers the narrowest literal, readonly type from the argument — as if the caller
wrote `as const` at the call site — so a returned literal keeps its exact type:

```ts
function asTuple<const T extends readonly unknown[]>(xs: T): T {
  return xs;
}

const point = asTuple([3, 4]); // T = readonly [3, 4], not number[]
const first: 3 = point[0]; // the literal survives the call
```

A constraint (`K extends keyof T`) both restricts the argument and *links* it to the return type, so the result
type follows the key the caller passes:

```ts
function prop<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const label = prop({ id: 1, label: "a" }, "label"); // string, tracked from the key
```

`NoInfer<T>` (5.4) marks a position that must *not* drive inference, so one argument fixes `T` and the other is
merely checked against it:

```ts
// A `const` type parameter preserves the literal element types (T = "a" | "b", not
// `string`); NoInfer then stops `fallback` from re-widening T, so it must be a member.
// (Without `const`, T widens to `string` and any string fallback would be accepted.)
function pick<const T extends string>(values: readonly T[], fallback: NoInfer<T>): T {
  return values[0] ?? fallback;
}

const chosen = pick(["a", "b"], "a"); // T = "a" | "b"; ok
// @ts-expect-error "c" is not one of the element types "a" | "b"
const rejected = pick(["a", "b"], "c");
```

Variance is inferred from usage, but an `in` / `out` annotation *declares* it — documenting the intent and
making a wrong future edit (using a covariant parameter contravariantly) a compile error:

```ts
// `out T` declares Box covariant in T: a Box<Dog> is usable where Box<Animal> is.
interface Box<out T> {
  readonly value: T;
}

interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

const dogBox: Box<Dog> = { value: { name: "Rex", breed: "lab" } };
const animalBox: Box<Animal> = dogBox; // allowed by the declared covariance
```

## 3. Conditional and mapped types

Conditional and mapped types compute one type from another. Reach for them to derive a related type from a
source of truth instead of hand-maintaining a parallel one.

A conditional type with `infer` extracts a component of a matched shape:

```ts
type ElementOf<T> = T extends readonly (infer E)[] ? E : never;

type Item = ElementOf<string[]>; // string
const item: Item = "x";
```

A *naked* type parameter distributes over a union — the conditional applies to each member and the results
recombine, which is how the built-in `Exclude` / `NonNullable` work:

```ts
type NonNull<T> = T extends null | undefined ? never : T;

type Clean = NonNull<string | null | number>; // string | number
const c: Clean = 5;
```

A mapped type rewrites every property. Key remapping with `as` renames each key — here building a getters type
from a source, with `Capitalize` (an intrinsic string type) in a template-literal key:

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Person = { name: string; age: number };
type PersonGetters = Getters<Person>; // { getName: () => string; getAge: () => number }

const g: PersonGetters = {
  getName: () => "a",
  getAge: () => 1,
};
```

Mapped modifiers add or strip `readonly` and optionality with a `+` / `-` prefix — `-?` makes every property
required, `+readonly` makes it immutable:

```ts
type Concrete<T> = {
  +readonly [K in keyof T]-?: T[K];
};

type Loose = { a?: number; b?: string };
type Firm = Concrete<Loose>; // { readonly a: number; readonly b: string }

const firm: Firm = { a: 1, b: "x" };
```

## 4. `satisfies`, annotation, and `as`

SKILL.md P3 carries the three-way table; this section deepens each row with the mechanic and the failure it
prevents. `satisfies T` validates a value against `T` yet keeps its narrow *inferred* type — the gap an
annotation and an assertion both leave. It matters when you must both check the shape and still use the narrow
type afterward:

```ts
type Palette = Record<string, readonly [number, number, number] | string>;

// `satisfies` checks every value against Palette but keeps each one's narrow type,
// so `red` stays a tuple you can index — an annotation would widen it to the union.
const theme = {
  red: [255, 0, 0],
  bg: "#fff",
} satisfies Palette;

const green: number = theme.red[1]; // ok: theme.red is the tuple, not `[...] | string`
```

An annotation (`: T`) *checks and widens* to `T`; an assertion (`as T`) *neither checks nor widens* — it asserts
a type the value may not have, and the compiler stops catching drift. Prefer the annotation, which surfaces a
missing field that `as` hides:

```ts expect-error
interface User {
  id: number;
  name: string;
}

// `as` asserts without checking: the missing `name` is hidden. Do not do this.
const u1 = { id: 1 } as User;

// @ts-expect-error an annotation catches the missing `name` that `as` silently hid
const u2: User = { id: 1 };
```

`as const` is the safe assertion: it only *restricts* — literals stay literal and the literal's own structure
becomes `readonly` at the type level, nested literals included (a compile-time constraint, not a runtime
`Object.freeze`, and not a freeze of a mutable value the literal merely references) — so it can never lie. It pairs with a derived union to make one literal object the single source of
truth:

```ts
const routes = {
  home: "/",
  help: "/help",
} as const;

type Route = (typeof routes)[keyof typeof routes]; // "/" | "/help"
const r: Route = routes.home;
```

Reserve a plain `as` for a static fact the compiler cannot see *after* a runtime narrow — for example minting a
branded type behind a validating gate (§5). An `as` used to silence an error is a lie the compiler will stop
reporting.

## 5. Branded and nominal types

TypeScript is structural: two types with the same shape are interchangeable. A brand adds a phantom,
non-constructable tag so two otherwise-identical types (both `string`) become distinct — nominal typing layered
on top of the structural system. The tag exists only at the type level and is erased at runtime:

```ts
// A `unique symbol` key means ordinary structural code cannot write the tag; the value
// is still a plain string at runtime. A deliberate `as` CAN still forge one (assertions
// are erased), so the brand discourages forgery and channels minting through the gate below.
declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };

type UserId = Brand<string, "UserId">;

// Mint only behind a REAL runtime check, then assert — the check is what makes this `as`
// honest (the invariant is verified first); the assertion alone would validate nothing.
function toUserId(raw: string): UserId {
  if (!/^u_\d+$/.test(raw)) throw new Error(`not a UserId: ${raw}`);
  return raw as UserId;
}

const id: UserId = toUserId("u_1");
const plain: string = id; // a branded value is still usable as its base type
```

The payoff is that the compiler refuses to mix two brands, though both are plain strings at runtime — the class
of bug (passing the wrong id) that structural typing alone cannot catch:

```ts expect-error
declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

declare function loadOrder(id: OrderId): void;
declare const user: UserId;

// @ts-expect-error a UserId is not an OrderId, though both are strings at runtime
loadOrder(user);
```

## 6. Narrowing, guards, and predicates

Narrowing is how a wide type (a union, `unknown`) becomes usable. Built-in narrowing — `typeof`, `instanceof`,
`in`, and a discriminant check — covers most cases; three custom forms extend it across a function boundary.

A user-defined type predicate (`x is T`) teaches the compiler what a boolean-returning function proves, so its
result narrows at the call site:

```ts
interface Cat {
  meow: () => void;
}
interface Dog {
  bark: () => void;
}

function isCat(pet: Cat | Dog): pet is Cat {
  return "meow" in pet;
}

function speak(pet: Cat | Dog): void {
  if (isCat(pet)) {
    pet.meow(); // narrowed to Cat
  } else {
    pet.bark(); // narrowed to Dog
  }
}
```

TS 5.5 *infers* the predicate when a function with no explicit return type is a single narrowing return — so a
plain helper narrows an array `filter` with no `is` annotation. Prefer the explicit `is` form at a public
boundary (it is the stated contract); rely on inference for a local helper:

```ts
// No `x is string` written: 5.5 infers it from the body, so `filter` narrows.
function isString(x: unknown) {
  return typeof x === "string";
}

const mixed: readonly unknown[] = [1, "a", true, "b"];
const strings = mixed.filter(isString); // string[]
const head: string | undefined = strings[0];
```

An assertion function (`asserts x is T`) narrows by *throwing* instead of returning a boolean — everything after
the call sees the narrowed type, and there is no `else` branch:

```ts
function assertIsString(x: unknown): asserts x is string {
  if (typeof x !== "string") {
    throw new Error("expected a string");
  }
}

function useValue(v: unknown): number {
  assertIsString(v);
  return v.length; // v is `string` for the rest of the scope
}
```

A predicate lies if its body and its claim disagree (`pet is Cat` on a check that does not prove `Cat`); the
compiler trusts the signature, so a wrong guard defeats the whole point. Keep the body and the claim in step.

## 7. `unknown`, `never`, `readonly`, and `as const`

`unknown` is the top type and `never` is the bottom type — the two ends of the assignability lattice, and the
tools for a safe boundary and a proven-impossible branch.

`unknown` accepts any value but permits no operation until you narrow it — the safe replacement for `any`, which
accepts any value AND permits everything unchecked (§ SKILL.md Rules ban `any`):

```ts
// `unknown` forces a narrow before use; `any` would let `x.length` through unchecked.
function lengthOf(x: unknown): number {
  if (typeof x === "string" || Array.isArray(x)) {
    return x.length;
  }
  return 0;
}
```

`never` has no values, is assignable to every type, and accepts only `never` — which is exactly what powers
`assertNever` (§1) and marks a branch as impossible:

```ts
function unreachable(): never {
  throw new Error("unreachable");
}

const n: never = unreachable();
const s: string = n; // never is assignable to any type
```

`readonly` on a property and `readonly T[]` (or `ReadonlyArray<T>`) push immutability into the type, so a
mutation is a compile error rather than a runtime aliasing bug — the type-level face of *prefer immutable data*:

```ts
interface Point {
  readonly x: number;
  readonly y: number;
}

// A shift returns a new Point; it cannot mutate the input.
function shift(p: Point, dx: number): Point {
  return { x: p.x + dx, y: p.y };
}

function total(xs: readonly number[]): number {
  return xs.reduce((a, b) => a + b, 0); // read-only methods only
}
```

```ts expect-error
interface Config {
  readonly retries: number;
}
const c: Config = { retries: 3 };

// @ts-expect-error cannot assign to a readonly property
c.retries = 5;
```

`as const` (§4) is the value-level counterpart: it makes a literal's structure `readonly` at the type level (a compile-time constraint, not a runtime freeze) and keeps every member at
its narrow literal type.

## 8. Utility types and `interface` vs `type`

The built-in utility types derive a related type from a source, so a shape has one home and its variants follow.
The core set — `Partial`, `Pick`, `Omit`, `Record` — composes:

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserPatch = Partial<Pick<User, "name" | "email">>; // both keys optional
type PublicUser = Omit<User, "email">; // { id: number; name: string }
type UsersById = Record<number, User>;

const patch: UserPatch = { name: "new" };
const pub: PublicUser = { id: 1, name: "a" };
const byId: UsersById = { 1: { id: 1, name: "a", email: "e" } };
```

`ReturnType` and `Awaited` derive types from a function and a promise — `Awaited` unwraps recursively, so a type
tracks an async result without a hand-written duplicate:

```ts
async function loadCount(): Promise<number> {
  return 42;
}

type Loaded = Awaited<ReturnType<typeof loadCount>>; // number
const n: Loaded = 1;
```

SKILL.md P3 tables the `interface` vs `type` choice; the mechanic behind it is that each can do something the
other cannot. An `interface` *merges* — two same-named declarations combine, which is what powers
declaration-file augmentation (§9); a `type` alias cannot be reopened. A `type`, in turn, expresses a union,
tuple, or mapped/conditional type that an `interface` cannot:

```ts
// Two `interface Settings` declarations merge into one shape.
interface Settings {
  theme: string;
}
interface Settings {
  locale: string;
}
const s: Settings = { theme: "dark", locale: "en" };

// A `type` alias expresses what an interface cannot: a union.
type Id = number | string;
const id: Id = "x";
```

So: `interface` for an object shape that may be extended, implemented, or augmented; `type` for a union, tuple,
mapped, conditional, or any alias of a non-object type.

## 9. Declaration files and module augmentation

A declaration file (`.d.ts`) carries types with no runtime code. Its jobs are typing a value some other script
provides, typing an untyped or non-code import, and *augmenting* an existing type. Everything here erases at
runtime.

A `declare` statement types a value that exists at runtime but has no local definition — an ambient declaration.
Module-scoped, it types (say) an analytics global injected by a `<script>` tag:

```ts
// Types a global the runtime provides; there is no runtime code to emit.
declare function gtag(command: string, ...args: readonly unknown[]): void;

export function trackPageView(path: string): void {
  gtag("event", "page_view", { path });
}
```

`declare global` (valid only inside a module) reaches the global scope. Use it to add a global binding, or to
*augment* a built-in interface — the same declaration-merging mechanism as an `interface` (§8), applied to a
type you do not own:

```ts
export {};

declare global {
  // Add a typed global binding.
  var __APP_VERSION__: string;
}

const version: string = globalThis.__APP_VERSION__;
```

```ts
export {};

declare global {
  // Augment a built-in interface — the merge adds `first` to every Array.
  interface Array<T> {
    first(): T | undefined;
  }
}

const f = [1, 2, 3].first(); // number | undefined
```

Two forms live in a `.d.ts` script file (no top-level `import` / `export`) and need a resolvable target, so the
module-based example harness does not compile them; the syntax is standard. An **ambient module declaration**
types a whole class of untyped imports — a wildcard name types every matching import a bundler produces:

```
// assets.d.ts — types a non-code import the bundler resolves.
declare module "*.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}
```

**Module augmentation** reopens a dependency's module to add to its declared types — the identical `declare
module "<name>"` reopen form, requiring the real module to resolve (the `import` makes this a module, so the
`declare module` augments rather than replaces):

```
// augment.d.ts — extend a library's types without editing it.
import "some-orm";

declare module "some-orm" {
  interface QueryOptions {
    trace?: boolean; // merged into the library's existing interface
  }
}
```

Keep every declaration honest: an ambient `declare` or a `.d.ts` states a contract the compiler cannot verify
against an implementation, so a drifted declaration is a silent false type — the same accuracy discipline a
public signature carries.
