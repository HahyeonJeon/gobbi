# Python — Performance

Child doc of the `python` skill: the deep reference for making Python fast enough, on evidence, at the 3.12
baseline. The `SKILL.md` § Procedure P5 router sends a reader here when performance, scale, a hot path, large
data, memory, caching, or profiling is in scope. An ordinary module needs none of this — the parent floor
already carries the common path, and the clear form stands until a measurement says otherwise.

This doc **deepens, and does not restate,** three parent surfaces: the principle *"Use the standard
vocabulary until evidence earns an escape"*, the rule *"MUST base a Python performance change on measurement,
and prefer a better built-in or data structure to hand-tuned code"*, and the rule *"NEVER optimize a Python
hot path from intuition alone, or cite a microbenchmark for a system-level claim"*. The parent § Procedure P3
*Return shape* table owns the stream-vs-materialize contract; the sections below give the mechanics behind
it. Every construct here is valid at Python 3.12; tool and library names are examples, never a lock.

## Contents

1. [Complexity first: performance is a design property](#1-complexity-first-performance-is-a-design-property)
2. [Data structures for the access pattern](#2-data-structures-for-the-access-pattern)
3. [Let the C layer carry the loop](#3-let-the-c-layer-carry-the-loop)
4. [Three recurring cost traps](#4-three-recurring-cost-traps)
5. [Stream instead of materialize](#5-stream-instead-of-materialize)
6. [Allocation and memory](#6-allocation-and-memory)
7. [Caching](#7-caching)
8. [Profile before you optimize](#8-profile-before-you-optimize)
9. [Benchmark design: micro vs macro](#9-benchmark-design-micro-vs-macro)
10. [CPython costs and alternate interpreters](#10-cpython-costs-and-alternate-interpreters)
11. [Footguns](#11-footguns)

---

## 1. Complexity first: performance is a design property

The parent rule *"MUST base a Python performance change on measurement, and prefer a better built-in or data
structure to hand-tuned code"* fixes the order: the biggest wins are the algorithm and the data structure,
decided before any tuning. This matters *more* in Python than in a compiled language, not less. Python's
per-bytecode interpreter overhead is high and its "fast line" ceiling is low, so you cannot micro-optimize
your way out of a bad complexity the way a JIT or a C compiler sometimes masks one — the interpreter magnifies
every extra operation on the hot path. An accidental O(n²) on data that grows is a wall no faster inner line
will rescue; a fit data structure removes the cost outright.

- **Fit the algorithm's complexity to the realistic input size** — and note the constant factor is a Python
  interpreter loop, so an O(n) Python-level scan is already far slower per element than the same scan inside a
  C-implemented built-in (§3). Complexity class is the first lever; the C-vs-Python constant is the second,
  and both are larger levers in Python than the inner-line form.
- **The order to spend effort:** first the algorithm and data structure (§1, §2); then push the per-item work
  into a C-implemented built-in or the right container (§3); then remove wasted work (§4); and only then, on a
  *profiled* hot path, reach for a lower-level micro-optimization (§8, §10). Skipping to the last step is
  exactly what the parent rule forbids.
- **Keep the clear form until evidence justifies the complex one.** Optimizing a cold path, or trading
  readability for an unmeasured gain, is waste — it costs every future reader for nothing (the parent's
  *Optimize for the Reader* tension). Measure first; optimize the part the measurement points to.

## 2. Data structures for the access pattern

Pick the container by how it is accessed, not by what is convenient to write. The wrong structure turns an
O(1) operation into O(n).

| Access pattern | Use | Cost | Trap it removes |
|---|---|---|---|
| Membership / dedup (`x in coll`) | `set` / `dict` | O(1) average | `x in list` / `x in tuple` is O(n) — quadratic in a loop (§4) |
| Keyed lookup | `dict` | O(1) average | scanning a list of pairs |
| Append/pop at both ends, sliding window | `collections.deque` | O(1) each end | `list.pop(0)` / `list.insert(0, …)` is O(n) |
| Search a sorted sequence; insert keeping order | `bisect.bisect` / `bisect.insort` | search O(log n); `insort` is O(n) — the list shift dominates the O(log n) search | re-sorting in O(n log n) after every insert |
| Repeated "smallest / largest k" | `heapq` | O(log n) push/pop | re-sorting to read the top element |
| Counting occurrences | `collections.Counter` | O(n) once | a hand-rolled `dict` increment loop |
| Grouping by key | `collections.defaultdict(list)` | O(n) once | `setdefault` scattered through a loop |

The rule of thumb: if the hot operation is *membership* or *lookup*, the answer is almost always a `set` or a
`dict` built once, outside the loop.

## 3. Let the C layer carry the loop

CPython's built-ins and standard library run their loops in C, which is far faster than the equivalent
Python-level loop. This is the performance face of the parent principle *"Use the standard vocabulary until
evidence earns an escape"*.

- **Reach for the C-implemented built-in first** — `sum`, `min`, `max`, `any`, `all`, `sorted`, and the
  `itertools` / `functools` combinators — before a hand-written accumulation loop. They compute in C and read
  more clearly.
- **A comprehension beats an explicit `append` loop** for building a list: it avoids the repeated attribute
  lookup and method call of `result.append(...)` per item, and the intent is one expression. (Keep it to one
  transform plus at most one filter, per the parent rule — past that it is a loop.)
- **Join strings; do not rely on `+=` in a loop.** Strings are immutable, so `s += piece` conceptually
  builds a new string each time. CPython 3.12 has a *fragile* in-place optimization for the exact shape below
  — a uniquely-referenced local `str` target — that makes this particular loop run roughly linearly; but it is
  an unspecified implementation detail, not a language guarantee. It vanishes the moment the target is a
  global or attribute, a second reference exists, or the code runs on another interpreter — and then the loop
  is O(n²). `"".join(pieces)` is O(n), portable, guaranteed, and clearer, so prefer it regardless. For bytes
  built incrementally, use a `bytearray` (genuinely mutable, no such caveat).

  ```python
  # relies on a fragile CPython in-place optimization; O(n^2) the moment it doesn't apply
  out = ""
  for row in rows:
      out += render(row)

  # O(n), portable, one pass — prefer this
  out = "".join(render(row) for row in rows)
  ```

- **The escape is earned, not assumed.** Drop below a built-in to a hand-tuned form only when a profile on the
  target workload shows the built-in is the hot path and the replacement is genuinely faster there (§8, §9).

## 4. Three recurring cost traps

Three patterns account for most real Python slowdowns. Each has a clean fix.

- **Accidental quadratic membership.** `if x in some_list:` inside a loop over another collection is O(n·m).
  Build a `set` once before the loop and test against it:

  ```python
  # O(n * m): linear scan of `known` per item
  dupes = [x for x in items if x in known_list]

  # O(n + m): one set build, O(1) membership
  known = set(known_list)
  dupes = [x for x in items if x in known]
  ```

- **N+1 I/O.** One database query, HTTP request, or file read *per loop iteration* dominates any in-process
  cost. Batch it: fetch the whole set in one query (an `IN (...)` / a bulk endpoint), or hoist the read out of
  the loop. This is a per-request cost, so it usually matters far more than any CPU tuning.
- **Needless copies and materialization.** Slicing copies (`data[:]`, `data[a:b]`); `list(gen)` or
  `dict(other)` when the result is only read once; `copy.deepcopy` of a large structure that was only going to
  be read; re-sorting an already-ordered sequence. (A plain function call does **not** copy its arguments —
  Python binds another reference to the same object — so passing a large container through call layers is
  free; the cost is only in an *explicit* slice, conversion, or copy.) Consume iterators lazily (§5), pass a
  `memoryview` or an index range instead of a slice for large buffers, and sort once.

## 5. Stream instead of materialize

For large or unbounded data, memory is the binding constraint, and streaming keeps it flat. The
stream-vs-materialize decision is owned by the parent § Procedure P3 *Return shape* table; the mechanics:

- **A generator holds one item at a time.** A generator function (`yield`) or a generator expression processes
  a million rows in constant memory, where a list comprehension allocates all million at once. Prefer the
  generator when the sequence streams, may be large, or is consumed once.
- **Compose with `itertools` and `yield from`.** `itertools.islice`, `chain`, `groupby`, and `takewhile`
  build lazy pipelines with no intermediate list; `yield from sub()` delegates without materializing the
  sub-sequence. Read files line by line (`for line in file:`) rather than `file.read().splitlines()`.
- **Materialize deliberately.** Return a concrete `list` / `dict` / `set` when the caller must replay, index,
  measure length, or own the result — the parent *Return shape* contract. The cost of a generator is that it
  is single-pass and has per-item call overhead; when the whole sequence is needed in memory anyway, a list
  comprehension can be both clearer and faster. Choose by how the caller uses the result, not by reflex.

## 6. Allocation and memory

Object churn and per-instance overhead are real costs at scale, but the fixes are targeted, not blanket.

- **`__slots__` removes the per-instance `__dict__`.** For a class instantiated in the millions, declaring
  `__slots__ = ("x", "y")` drops the per-instance dictionary, cutting memory and speeding attribute access.
  Caveats: no ad-hoc attributes, `__weakref__` must be listed if weak references are needed, and slots
  interact with multiple inheritance — so reserve it for measured hot, high-count classes, not every class.

  ```python
  class Point:
      __slots__ = ("x", "y")
      def __init__(self, x: float, y: float) -> None:
          self.x = x
          self.y = y
  ```

- **A `dataclass(slots=True)`** (3.10+) gives the same win for a data record without hand-writing the slots.
- **Use packed buffers for homogeneous numeric data.** An `array.array` or a `memoryview` stores numbers
  without the per-element object overhead of a `list[int]`; a `memoryview` also lets you slice a large buffer
  without copying it.
- **Bound anything that accumulates.** An unbounded cache, list, or queue that grows with input is a memory
  leak in slow motion. Cap it (§7) or stream past it (§5). Release large objects when done so they can be
  collected; do not hold a reference "just in case".

## 7. Caching

A cache trades memory for repeated compute. It is correct only when the function is pure and the cache is
bounded and invalidated.

```python
import functools

@functools.lru_cache(maxsize=1024)          # bounded: evicts least-recently-used past 1024
def parse_rule(source: str) -> Rule:
    ...
```

- **`functools.lru_cache(maxsize=N)` for a bounded cache; `functools.cache` for an unbounded one.**
  `functools.cache` is `lru_cache(maxsize=None)` — it never evicts, so on unbounded key variety it grows
  without limit. Prefer a bounded `maxsize` unless the key set is provably small and fixed.
- **Cache only pure functions with hashable arguments.** The arguments become the key, so they must be
  hashable and the result must depend only on them. Caching a function with side effects, time-varying
  results, or mutable arguments returns stale or wrong data — a correctness bug, not a slow path.
- **Plan invalidation up front.** `func.cache_clear()` drops the whole cache; there is no per-key eviction on
  `lru_cache`. If entries can go stale, design the invalidation (clear on the triggering event, or include a
  version in the key) rather than letting the cache serve outdated values.
- **`functools.cached_property` for a per-instance lazy value.** It computes once per instance and stores the
  result on the instance. Note that at 3.12 it no longer takes a lock around the computation, so two threads
  racing the first access can each compute it — fine for an idempotent pure computation, wrong if the compute
  has side effects.

## 8. Profile before you optimize

The parent rule is absolute: base a performance change on measurement. Intuition about where Python spends
time is unreliable — attribute lookups, allocation, and interpreter overhead are not visible by eye.

- **Profile the representative workload to find the hot path.** A deterministic profiler (`cProfile`) reports
  per-function call counts and cumulative time; a sampling profiler (`py-spy` and the like) attaches with low
  overhead to a running process. These are examples — the rule is "profile the real workload", not a specific
  tool.

  ```python
  import cProfile, pstats
  cProfile.run("run_pipeline(sample_input)", "profile.out")
  pstats.Stats("profile.out").sort_stats("cumulative").print_stats(20)
  ```

- **Optimize only what the profile indicts.** Most time hides in a small fraction of the code; tuning anything
  else is effort spent where it cannot pay back. Fix the top entry, then re-profile — the hot path moves.
- **Measure wall time with `time.perf_counter`, memory with `tracemalloc`.** `perf_counter` is the monotonic
  high-resolution clock for timing a region; `tracemalloc` attributes allocations to source lines when memory
  is the problem.
- **Confirm the fix on the same workload.** Re-run the profile after the change to prove the hot path shrank —
  a fix you cannot measure is a guess (the parent's root-cause discipline applied to speed).

## 9. Benchmark design: micro vs macro

A benchmark that measures the wrong thing produces a confident wrong conclusion. The parent rule bans citing
a microbenchmark for a system-level claim — so match the benchmark's scope to the claim.

- **Micro vs macro.** A microbenchmark (`timeit`) isolates one operation to compare two forms; a macro
  benchmark runs the end-to-end path on representative data. A micro win does not imply a system win — the
  operation may be a rounding error next to the I/O around it. Claim only at the level you measured.
- **Use representative inputs.** Benchmark on data whose size and distribution match production. A form that
  wins on a tiny sorted list can lose on a large skewed one; the input shape decides the result.
- **Control variance.** Run several trials and report the minimum or median, not a single noisy sample; warm
  up before timing; and run on an otherwise-quiet machine. `timeit` disables the garbage collector by default
  and repeats automatically — understand what it holds fixed.
- **Keep the work real in the benchmark.** Make sure the benchmark exercises the work you think it does.
  CPython does **not** eliminate a function call whose result is unused — a call always runs, because it may
  have side effects or raise — so the danger is not dead-code elimination but *accidentally measuring
  nothing*: a per-call cache (`lru_cache`) that turns the second run into a no-op, a result that was already
  computed once outside the timed loop, or a timed expression that is a compile-time constant the peephole
  optimizer folds. Feed fresh inputs each run and time the real call, not a memoized or constant-folded stand-in.
- **Verify correctness inside the benchmark.** The fast candidate must produce the same output as the baseline
  on the same inputs. A speedup that changes the answer is not a speedup. Assert equality of results before
  trusting the timing.

## 10. CPython costs and alternate interpreters

The last-resort micro-optimizations depend on the interpreter — they are conditional, not universal.

- **CPython's per-operation costs are real but small.** Attribute lookup, function-call overhead, dynamic
  dispatch, and integer boxing each cost a little; a local variable is faster to read than a global or an
  attribute. These matter only inside a profiled hot loop — hoisting a repeated `obj.method` lookup to a local
  is a legitimate fix *there*, and noise everywhere else.
- **The interpreter is already optimizing.** CPython 3.11+ ships a specializing adaptive interpreter (PEP 659)
  that speeds many common patterns automatically, which is another reason to measure on the *target* version
  rather than porting a micro-tuning folk rule from an older one.
- **Alternate interpreters invert conclusions.** PyPy's JIT can make a plain Python loop faster than a
  hand-tuned CPython form, so a CPython micro-optimization may be pointless or harmful there; some C
  extensions also do not run under PyPy. A technique tuned for one interpreter is a conditional assumption.
- **Isolate and document any interpreter-specific optimization.** Put a CPython-specific micro-tuning behind a
  narrow, documented boundary with a clear pure-Python reference form, per the parent interoperability floor
  (see `interoperability.md`), so the assumption is visible and testable rather than baked silently into
  ordinary code.

## 11. Footguns

| Footgun | Why it costs | Correct form |
|---|---|---|
| `x in some_list` inside a loop | O(n·m) — linear membership per iteration | Build a `set` once outside the loop (§4) |
| `list.pop(0)` / `list.insert(0, …)` in a loop | O(n) per shift → O(n²) | `collections.deque` (§2) |
| Relying on `s += piece` to build a string in a loop | O(n²) whenever CPython's fragile in-place optimization does not apply (global/attribute target, aliased, other interpreter) | `"".join(pieces)` / `bytearray` (§3) |
| One query/request/read per loop iteration (N+1) | Per-call I/O dominates everything else | Batch or hoist the I/O out of the loop (§4) |
| `list(generator)` then iterate once | Materializes the whole sequence needlessly | Consume the generator lazily (§5) |
| `functools.cache` on a wide key space | Unbounded growth → memory leak | `lru_cache(maxsize=N)` (§7) |
| Caching an impure or mutable-arg function | Serves stale or wrong results | Cache only pure, hashable-arg functions (§7) |
| Optimizing from intuition, no profile | Effort spent off the real hot path | Profile the representative workload first (§8) |
| A microbenchmark cited for a system claim | The isolated op may be noise end-to-end | Benchmark at the level of the claim (§9) |
| `__slots__` added to every class by reflex | Breaks dynamic attributes / weakrefs / inheritance for no measured win | Reserve for measured hot, high-count classes (§6) |
| A CPython micro-tuning assumed universal | May be pointless or harmful on PyPy / a newer CPython | Measure on the target; isolate + document it (§10) |
