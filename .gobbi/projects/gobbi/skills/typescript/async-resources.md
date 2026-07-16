# TypeScript — Async and Resources

**Ownership** — promise idioms and the no-floating-promises rule; `AbortSignal` / `AbortController`
cancellation; the four combinators (`all` / `allSettled` / `race` / `any`) and when each fits; async
iterators and `for await`; error propagation across `await`; deterministic disposal via `using` /
`await using`, `Symbol.dispose` / `Symbol.asyncDispose`, and `DisposableStack` / `AsyncDisposableStack`;
and typed events on `EventTarget`.

**Split criterion** — skill-writing P3 (d): a self-contained sub-procedure for async and
resource-lifetime work, opened when a unit touches promises, cancellation, or disposal.

This doc **deepens, and does not restate,** the SKILL.md async rules and Principle 5 (*make async and
resource lifetime explicit; never float a promise*). SKILL.md owns the Rules — handle every promise,
throw only `Error` subclasses and catch as `unknown`; this doc owns the *mechanics*: the exact idiom for
each, and the footguns `tsc` alone does not catch. SKILL.md P6 owns the throw-vs-return-typed-result
decision; §5 here owns only what changes when a failure crosses an `await`. `design.md` decides whether a
unit should be async or own a resource at all; it points here for the spelling.

Every fenced `ts` block below type-checks under the skill's maximal-strict examples baseline (TS 5.9
floor; lib `ES2023` + `ESNext.Disposable` + `DOM`). Where a taught fact is enforced by the typed lint
(`no-floating-promises`) and **not** by `tsc`, the prose says so — an example cannot fence a rule the
compiler does not check.

## Contents

1. [Promise idioms and no floating promises](#1-promise-idioms-and-no-floating-promises)
2. [Cancellation with `AbortSignal`](#2-cancellation-with-abortsignal)
3. [Combinators: `all` / `allSettled` / `race` / `any`](#3-combinators-all-allsettled-race-any)
4. [Async iterators and `for await`](#4-async-iterators-and-for-await)
5. [Error propagation across `await`](#5-error-propagation-across-await)
6. [Deterministic disposal: `using` and `await using`](#6-deterministic-disposal-using-and-await-using)
7. [Typed events with `EventTarget`](#7-typed-events-with-eventtarget)

---

## 1. Promise idioms and no floating promises

A `Promise` is an ordinary value, so the compiler lets you discard one — and a discarded rejection
surfaces later as an unhandled rejection, far from its cause. SKILL.md Rules state the fix (`await`,
`void`, or `.catch`); the mechanic is that each is a *deliberate* handling and a bare call is not:

```ts
declare function save(id: string): Promise<void>;
declare function reportError(err: unknown): void;

// await — the default: propagate both the value and any rejection to the caller.
async function persist(id: string): Promise<void> {
  await save(id);
}

// void + .catch — deliberately fire-and-forget, but never drop the rejection.
function fireAndForget(id: string): void {
  void save(id).catch((err: unknown) => {
    reportError(err);
  });
}
```

The trap: a bare `save(id);` is **not** a `tsc` error. Only the typed-lint rule `no-floating-promises`
flags it, so treat "handle every promise" as lint-enforced, not compiler-enforced — the maximal-strict
`tsc` pass in P7 will not catch a floated promise on its own.

## 2. Cancellation with `AbortSignal`

Cancellation is cooperative: an `AbortController` owns the switch, and its `signal` is the read-only end
you hand to the work. The work checks the signal and stops. `signal.throwIfAborted()` is the idiom —
it throws the signal's `reason` at a checkpoint, so a long loop aborts promptly:

```ts
async function process(items: readonly number[], signal: AbortSignal): Promise<number> {
  let sum = 0;
  for (const item of items) {
    signal.throwIfAborted(); // throws the abort reason at each checkpoint
    sum += item;
  }
  return sum;
}

async function run(): Promise<number> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1000);
  try {
    return await process([1, 2, 3], controller.signal);
  } finally {
    clearTimeout(timer);
  }
}
```

Two static factories build signals without a controller, and compose them: `AbortSignal.timeout(ms)`
aborts itself after a delay, and `AbortSignal.any([...])` aborts as soon as the earliest input does —
the way to merge a caller's signal with a local deadline:

```ts
function combined(userSignal: AbortSignal): AbortSignal {
  return AbortSignal.any([userSignal, AbortSignal.timeout(5000)]);
}

// A DOM-style API takes the signal directly; the fetch rejects on abort.
async function fetchJson(url: string, signal: AbortSignal): Promise<unknown> {
  const res = await fetch(url, { signal });
  return res.json();
}
```

## 3. Combinators: `all` / `allSettled` / `race` / `any`

The four static combinators differ in *which* settlement wins and *whether* one rejection sinks the
group. Pick by the answer you need, not by habit:

| Use | When |
|---|---|
| `Promise.all` | every task must succeed; fail fast on the first rejection; a tuple keeps position + type |
| `Promise.allSettled` | you want every outcome regardless of failures; it never rejects |
| `Promise.race` | first to **settle** (resolve *or* reject) wins — a timeout, a first-response |
| `Promise.any` | first to **fulfill** wins; rejections are ignored until all reject (`AggregateError`) |

`Promise.all` over a tuple preserves each element's type and order, and rejects the moment any input
does:

```ts
declare function fetchUser(id: number): Promise<string>;

async function loadTwo(): Promise<[string, string]> {
  return Promise.all([fetchUser(1), fetchUser(2)]); // fail-fast, order preserved
}
```

`Promise.allSettled` never rejects — each result is a `{ status, value }` / `{ status, reason }` you
narrow on `status`, so a partial failure stays visible instead of sinking the batch:

```ts
declare function fetchUser(id: number): Promise<string>;

async function countOk(ids: readonly number[]): Promise<number> {
  const results = await Promise.allSettled(ids.map(fetchUser));
  return results.filter((r) => r.status === "fulfilled").length;
}
```

`Promise.race` settles on the first input to settle — the timeout idiom races real work against a
rejecting timer (typed `Promise<never>`, since it only ever rejects):

```ts
async function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  const timer = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("timed out")), ms);
  });
  return Promise.race([work, timer]); // Promise<T | never> is Promise<T>
}
```

`Promise.any` fulfills on the first input to *fulfill* — a rejection is ignored unless every input
rejects, at which point it throws an `AggregateError` carrying them all. It is the "first success" idiom
(a fastest-mirror fetch), the mirror of `race`, which settles on the first to reject too:

```ts
declare function fetchUser(id: number): Promise<string>;

async function firstOk(ids: readonly number[]): Promise<string> {
  return Promise.any(ids.map(fetchUser)); // first fulfilled wins; all-reject → AggregateError
}
```

## 4. Async iterators and `for await`

An async iterator yields values that each arrive over time. An `async function*` produces one, and
`for await` consumes it — awaiting each step, so backpressure is automatic (the next pull waits for the
body):

```ts
async function* countTo(n: number): AsyncGenerator<number> {
  for (let i = 0; i < n; i++) {
    yield i;
  }
}

async function sum(): Promise<number> {
  let total = 0;
  for await (const x of countTo(3)) {
    total += x;
  }
  return total;
}
```

Type the *consumer* against `AsyncIterable<T>`, not a concrete generator, so any async source — a
stream, a paginated API — satisfies it. `noUncheckedIndexedAccess` and `noImplicitReturns` force the
empty-source path to be explicit:

```ts
async function firstOf<T>(source: AsyncIterable<T>): Promise<T | undefined> {
  for await (const item of source) {
    return item;
  }
  return undefined; // the source was empty — an explicit, typed outcome
}
```

## 5. Error propagation across `await`

The delta from the sync case is the boundary: a rejection only enters a `try` if the promise is
`await`ed *inside* it. `return somePromise()` without `await` returns the pending promise before it
settles, so its rejection bypasses the local `catch` entirely — a silent footgun `tsc` does not flag:

```ts
declare function load(): Promise<string>;

// WRONG shape: no `await`, so a rejection escapes this try/catch.
async function unguarded(): Promise<string> {
  try {
    return load(); // returns the pending promise; catch never runs on rejection
  } catch {
    return "default"; // unreachable on a rejection
  }
}
```

The correct shape awaits inside the `try`. Because `strict` types the catch variable as `unknown`
(`useUnknownInCatchVariables`), narrow before use, and chain the original with `cause` to keep the
stack:

```ts
class ConfigError extends Error {}

async function load(): Promise<string> {
  throw new ConfigError("missing config", { cause: new Error("no file") });
}

async function caller(): Promise<string> {
  try {
    return await load(); // `await` inside try — the rejection lands in catch
  } catch (err: unknown) {
    if (err instanceof ConfigError) {
      return "default";
    }
    throw err; // re-throw what you cannot handle
  }
}
```

Skipping the narrow is a compile error, which is the point — `unknown` forces the guard the sync case
also requires:

```ts expect-error
async function messageLength(p: Promise<string>): Promise<number> {
  try {
    return (await p).length;
  } catch (err: unknown) {
    // @ts-expect-error `err` is `unknown` across the await boundary; narrow first
    return err.message.length;
  }
}
```

## 6. Deterministic disposal: `using` and `await using`

A `using` binding calls the value's `[Symbol.dispose]()` at scope exit — on the normal path, an early
`return`, and a `throw` alike — so release cannot be skipped. It replaces the hand-written
`try`/`finally` close chain. The resource declares the contract with `implements Disposable`:

```ts
class FileHandle implements Disposable {
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
  [Symbol.dispose](): void {
    // close the underlying handle here
  }
}

function readConfig(): void {
  using handle = new FileHandle("config.json");
  void handle.name; // disposed at scope exit, on every path including a throw
}
```

`await using` is the async form: it awaits `[Symbol.asyncDispose]()`, for a resource whose release is
itself async (a connection flush, a graceful close):

```ts
class Connection implements AsyncDisposable {
  async [Symbol.asyncDispose](): Promise<void> {
    // await the graceful close
  }
}

async function withConnection(): Promise<void> {
  await using conn = new Connection();
  void conn; // conn[Symbol.asyncDispose]() is awaited at scope exit
}
```

The compiler enforces the contract: a value with no disposer cannot back a `using` binding, so a
forgotten `[Symbol.dispose]` is a build error, not a leak:

```ts expect-error
function bad(): void {
  // @ts-expect-error a `using` binding requires a value implementing Disposable
  using plain = { size: 1 };
  void plain;
}
```

For a dynamic set of resources, `DisposableStack` (and `AsyncDisposableStack`) collects disposers and
runs them in reverse order at scope exit. `use` tracks a `Disposable`; `defer` registers a bare
callback; `adopt` wraps a value that is not itself disposable; and `move()` transfers ownership so the
current scope stops disposing — the way to hand a fully-acquired resource back to a caller:

```ts
class Resource implements Disposable {
  readonly id: number;
  constructor(id: number) {
    this.id = id;
  }
  [Symbol.dispose](): void {}
}

function acquireTwo(): void {
  using stack = new DisposableStack();
  const first = stack.use(new Resource(1));
  const second = stack.use(new Resource(2));
  stack.defer(() => {
    // extra cleanup; runs before the used resources, in reverse order
  });
  void first;
  void second;
}

function makeResource(): DisposableStack {
  using stack = new DisposableStack();
  stack.use(new Resource(1));
  return stack.move(); // ownership passes to the caller; this scope disposes nothing
}
```

`AsyncDisposableStack` is the `await using` sibling — the same API over async disposers, so `adopt`
wraps a non-disposable value with an async cleanup callback:

```ts
class Conn implements AsyncDisposable {
  async [Symbol.asyncDispose](): Promise<void> {}
}

async function openAsync(): Promise<void> {
  await using stack = new AsyncDisposableStack();
  stack.use(new Conn());
  stack.adopt(42, (n) => {
    void n; // an async cleanup for a value that is not itself disposable
  });
}
```

## 7. Typed events with `EventTarget`

The web-standard `EventTarget` is portable across Node, Deno, Bun, and the browser, so prefer it over
Node's `EventEmitter` (which needs `@types/node` and is runtime-bound). Its base `addEventListener` is
untyped (`type: string`, listener over a plain `Event`). Wrap it once with a typed `on` / `emit` keyed
by an event map, so each event name resolves to its payload type:

```ts
type BusEvents = {
  data: CustomEvent<number>;
  done: Event;
};

class TypedBus extends EventTarget {
  on<K extends keyof BusEvents>(type: K, listener: (ev: BusEvents[K]) => void): void {
    super.addEventListener(type, listener as EventListener); // the one cast, behind the typed gate
  }
  emit<K extends keyof BusEvents>(_type: K, ev: BusEvents[K]): void {
    super.dispatchEvent(ev);
  }
}

function useBus(): void {
  const bus = new TypedBus();
  bus.on("data", (ev) => {
    void ev.detail; // ev is CustomEvent<number>; detail is number
  });
  bus.emit("data", new CustomEvent("data", { detail: 5 }));
}
```

The single `as EventListener` is legitimate — it sits behind the typed wrapper (like the branded-type
gate in `typing.md` §5), so callers never assert. The payoff is that the map catches a wrong payload at
compile time — a `done` event has no `detail`:

```ts expect-error
type BusEvents = {
  data: CustomEvent<number>;
  done: Event;
};

class TypedBus extends EventTarget {
  on<K extends keyof BusEvents>(type: K, listener: (ev: BusEvents[K]) => void): void {
    super.addEventListener(type, listener as EventListener);
  }
}

function useBus(bus: TypedBus): void {
  bus.on("done", (ev) => {
    // @ts-expect-error `done` carries a plain Event; it has no `detail`
    void ev.detail;
  });
}
```
