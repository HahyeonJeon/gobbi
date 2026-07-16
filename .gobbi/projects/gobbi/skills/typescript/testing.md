# TypeScript — Testing

**Ownership** — runtime-agnostic behavior tests (`node:test` / vitest / `bun test`) asserting return
values, thrown-error types, and effects; the verification *seam* — a pure core with injected boundaries;
determinism for time, randomness, and concurrency; and **type-level testing** — the TS-unique half
(`expectTypeOf` / `tsd` / `@ts-expect-error` in `*.test-d.ts`, evaluated by `tsc`).

**Split criterion** — skill-writing P3 (d): a self-contained sub-procedure, opened when a unit needs test
seams — including the type-level half that has no `coding` / `python` analogue.

This doc **deepens, and does not restate,** `coding` Principle 6 (*design for verification*) and SKILL.md
§ Procedure P7's verify order (which names *focused tests → full tests → type-level tests*). SKILL.md P7
owns the *order* of the gates; this doc owns *how to write* each test so behavior and types are actually
checked, and the seam design that makes them cheap. `async-resources.md` owns the promise, cancellation,
and disposal mechanics; this doc owns only what changes when you make them **deterministic under test**.

Every fenced `ts` block below type-checks under the skill's maximal-strict examples baseline (TS 5.9
floor; lib `ES2023` + `ESNext.Disposable` + `DOM`). A `declare` line stubs an assumed collaborator — the
test runner included — so each fragment stands alone; in a real file the runner is `import`ed, not
declared.

## Contents

1. [Behavior over implementation, runner-agnostic](#1-behavior-over-implementation-runner-agnostic)
2. [Design for verification: the seam](#2-design-for-verification-the-seam)
3. [Determinism at the seam: time, randomness, concurrency](#3-determinism-at-the-seam-time-randomness-concurrency)
4. [Type-level testing](#4-type-level-testing)

---

## 1. Behavior over implementation, runner-agnostic

A test asserts **observable behavior**, read through the unit's own surface — never its internals:

- the **return value**;
- the **thrown error's type** (and message), caught as `unknown` and narrowed;
- an **effect** read back at its boundary — a returned structure, a written record, or a fake's recorded
  calls (§2).

Never assert a private call order, an internal field, or "the logger's `.info` was called" — a test bound
to internal structure breaks on every refactor. Name one behavior per test and act once. Cover the four
case kinds: **golden** (a normal input and result), **edge** (`""`, `0`, an empty array, the boundary and
one past it), **failure** (an input that must throw, pinned by type *and* message), and **adversarial**
(a trust-boundary footgun the unit must reject).

The three runners — `node:test`, vitest, and `bun test` — differ only in the *registration* and
*assertion* API; the discipline above is identical. Name the runner in config; do not autodetect it.

```ts
// `test` / `expect` stand for the configured runner — imported in a real file.
declare function test(name: string, fn: () => void): void;
declare function expect<T>(actual: T): { toEqual(expected: T): void };

function slugify(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}

test("slugify lowercases and hyphenates a golden input", () => {
  expect(slugify("  Hello World  ")).toEqual("hello-world");
});
```

Under `strict`, a caught error is `unknown` — the runner cannot hand you an `any`. Narrow it before you
assert, so the *wrong* error of the right shape cannot pass:

```ts
declare function test(name: string, fn: () => void): void;

function parseCount(raw: string): number {
  const n = Number(raw);
  if (!Number.isInteger(n)) {
    throw new RangeError(`not an integer: ${raw}`);
  }
  return n;
}

test("parseCount rejects a non-integer with a RangeError", () => {
  let caught: unknown;
  try {
    parseCount("1.5");
  } catch (error) {
    caught = error;
  }
  if (!(caught instanceof RangeError)) {
    throw new Error("expected a RangeError");
  }
});
```

Give every `skip` / `todo` a tracked reason and a re-enable condition; an untracked skip silently stops
proving its contract.

## 2. Design for verification: the seam

Testability is a **design** property (`coding` P6), decided before a line of test runs. The TypeScript
delta: a seam is a **typed collaborator the caller passes in**. A unit that *takes* its boundaries — a
store, a clock, a fetch-like function — as typed parameters can be exercised with a stand-in; a unit that
*constructs* them (news up a client, reads `process.env`, calls `Date.now()`) has no seam and can only be
tested by standing up the whole environment. Keep a pure core and push I/O, the clock, randomness, and the
network to injected edges.

The collaborator's *type* is the seam contract: one narrow `interface` is both the production dependency
and the shape a fake satisfies. Prefer a small working **fake** — an in-memory store, a recording
transport — over a call-asserting mock, and assert the observable result, not that a method was called:

```ts
interface Store {
  get(key: string): Promise<string | undefined>;
  put(key: string, value: string): Promise<void>;
}

async function cacheThrough(
  store: Store,
  key: string,
  compute: () => Promise<string>,
): Promise<string> {
  const hit = await store.get(key);
  if (hit !== undefined) {
    return hit;
  }
  const fresh = await compute();
  await store.put(key, fresh);
  return fresh;
}

// The fake IS a `Store`; the test asserts the returned value and the stored effect.
class MapStore implements Store {
  readonly #data = new Map<string, string>();
  async get(key: string): Promise<string | undefined> {
    return this.#data.get(key);
  }
  async put(key: string, value: string): Promise<void> {
    this.#data.set(key, value);
  }
}
```

Substitute at the *real* boundary — the injected `Store`, not a helper the unit calls internally, which
would make the test assert private structure. If a mock is unavoidable, assert the effect it recorded
(`transport.sent` equals the expected requests), never `callCount`. Needing many stand-ins to run one test
is a design signal: the unit wants a narrower seam, not more mocks.

## 3. Determinism at the seam: time, randomness, concurrency

Every nondeterministic input is **injected or frozen**. Never read the wall clock, call `Math.random`, or
start a real timer inside the unit — each makes the test flaky and slow.

**Time** — take `now` (a clock callable) as a parameter. A test passes a fixed clock to freeze a
timestamp, or advances it to drive a timeout; it never waits real seconds.

```ts
type Clock = () => number;

function expiresAt(now: Clock, ttlMs: number): number {
  return now() + ttlMs;
}

const frozen: Clock = () => 1_000;
const deadline: number = expiresAt(frozen, 500); // deterministically 1_500
```

**Randomness** — inject the generator; a test passes a fixed draw so the choice is exact. Production may
draw from `crypto`, but a test supplies the sequence rather than seeding a global.

```ts
type Rng = () => number;

function pick<T>(rng: Rng, xs: readonly T[]): T | undefined {
  if (xs.length === 0) {
    return undefined;
  }
  return xs[Math.floor(rng() * xs.length)];
}

const chosen = pick(() => 0, ["a", "b", "c"]); // always "a"
```

**Concurrency and timers** — control the schedule instead of sleeping. Inject the wait as a seam, carry
cancellation on an `AbortSignal` (the `async-resources.md` idiom), and pass an *instant* wait under test so
no real time passes. Assert the aggregate result, not the interleaving, and bound every async test with a
deadline so a hang fails fast.

```ts
type Wait = (signal: AbortSignal) => Promise<void>;

async function fetchWithRetry(
  attempt: () => Promise<string>,
  backoff: Wait,
  signal: AbortSignal,
  maxTries: number,
): Promise<string> {
  let lastError: unknown;
  for (let i = 0; i < maxTries; i++) {
    try {
      return await attempt();
    } catch (error) {
      lastError = error;
      await backoff(signal);
    }
  }
  throw new Error("exhausted retries", { cause: lastError });
}

// A test injects an instant `backoff` — the retry logic is exercised with zero delay.
const instant: Wait = async () => {};
const settled = fetchWithRetry(async () => "ok", instant, AbortSignal.timeout(0), 3);
```

## 4. Type-level testing

Types get their **own** tests — the half with no `coding` or `python` analogue. A behavior test never runs
a type, so a wrong return type or a leaked `any` ships green through a passing suite. The fix is to assert
the *type itself*, evaluated by `tsc` rather than the runtime.

The ecosystem tools are `expectTypeOf` (built into vitest, also the standalone `expect-type` package),
`tsd`, and the bare `@ts-expect-error` directive; by convention type tests live in `*.test-d.ts` files
that a type-test run type-checks with `tsc`. The portable, dependency-free core needs none of them — a
hand-rolled `Equal<A, B>` plus an `Expect<T extends true>` checks under the same compiler:

```ts type-level
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true
    : false;
type Expect<T extends true> = T;

function first<T>(xs: readonly T[]): T | undefined {
  return xs[0];
}

// PASS: `noUncheckedIndexedAccess` makes the element type `T | undefined`.
type _ok = Expect<Equal<ReturnType<typeof first<number>>, number | undefined>>;

// @ts-expect-error the return is `number | undefined`, not `number` — asserting
// the narrower type is a compile error, which proves the wider type is correct.
type _bad = Expect<Equal<ReturnType<typeof first<number>>, number>>;
```

`@ts-expect-error` asserts a line **should** fail to type-check: the block compiles clean *if and only if*
the error is present. A genuinely-broken assertion fails, and a since-fixed one *also* fails (the directive
now guards a valid line), so the marker self-verifies. It reads at the value level too — a wrong annotation
must be rejected:

```ts type-level
function parseFlags(raw: string): ReadonlySet<string> {
  return new Set(raw.split(","));
}

const flags = parseFlags("a,b");

// @ts-expect-error the result is a ReadonlySet<string>, not a mutable string[].
const wrong: string[] = flags;
```

**Guard:** include the `*.test-d.ts` files in the *runtime* test set too. A `@ts-expect-error` sitting on a
line that no longer errors is itself a `tsc` error under the type-test pass, so running the type tests
(SKILL.md P7's *type-level tests* gate) catches a directive that has gone stale. This skill's own fenced
`ts` blocks are type-tested by exactly this mechanism — the example harness compiles each one under the
maximal-strict baseline, applying the same rule the SKILL.md Rules state: an example is a taught fact, not
decoration.
