# Python — Performance

Child doc of the `python` skill: making Python fast enough, on evidence, at the 3.12 baseline. The `SKILL.md`
§ Procedure P2 router sends a reader here when performance, scale, a hot path, large data, memory, caching,
profiling, or benchmarking is in scope. Ordinary code stays on the parent floor and keeps the clear form until a
measurement says otherwise.

Deepens the parent's principle 8 (*standard vocabulary until evidence earns an escape*) and the § Rules
*Delivery and evidence* default (measured change; a better built-in or data structure over hand-tuning; no
microbenchmark for a system-level claim). The stream-vs-materialize (concrete-vs-iterator) return contract lives
in the parent's § Rules *Signatures and data models* default, decided at Procedure step P3 (design act 5); here
are its mechanics. Tool and library names are examples, not locks.

Bottom-up order: start with the simplest correct algorithm and data structure whose complexity fits the input
(§1–§2); then profile a representative slice, change the one bottleneck it indicts, re-measure the same slice
against a kept baseline, and repeat (§8). Complexity first, tuning last.

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
11. [Footgun index](#11-footgun-index)

---

## 1. Complexity first: performance is a design property

The biggest wins are the algorithm and data structure, chosen before any tuning — and this matters *more* in
Python than in a compiled language: interpreter overhead is high, so an accidental O(n²) path cannot be tuned
away one line at a time. Complexity class is the first lever and the C-vs-Python constant (§3) the second, both
larger than the inner-line form. Spend effort in that order — algorithm and structure, C-layer vocabulary,
wasted work, then a profiled micro-optimization — and keep the clear form until evidence earns the complex one;
optimizing a cold path or trading readability for an unmeasured gain is waste.

| Symptom | Evidence | Change |
|---|---|---|
| The realistic input may outgrow the algorithm | Input size/distribution plus a complexity analysis | Fix the algorithm or data structure first (§2). |
| Python-level iteration dominates | A representative profile attributes time to the loop | Move work into a C-implemented built-in or fitting container (§3). |
| Repeated or wasted work dominates | The profile or I/O trace shows membership scans, N+1 calls, copies, or re-sorts | Remove that one cost (§4). |
| A remaining inner operation is hot | Before/after measurements on the target interpreter | Apply one narrow low-level change (§8, §10). |

Measure a representative slice, change one bottleneck, re-measure the same slice, and retain the baseline for
correctness and comparison; optimize only the part the evidence identifies.

## 2. Data structures for the access pattern

Pick the container by how it is accessed, not by what is convenient to write. The wrong structure turns an O(1)
operation into O(n).

| Access pattern | Use | Cost and trap it removes |
|---|---|---|
| Membership / dedup (`x in coll`) | `set` / `dict` | O(1) average; avoids O(n) `x in list` / `x in tuple` — quadratic in a loop (§4) |
| Keyed lookup | `dict` | O(1) average; avoids scanning a list of pairs |
| Append/pop at both ends, sliding window | `collections.deque` | O(1) each end; avoids O(n) `list.pop(0)` / `list.insert(0, …)` |
| Search a sorted sequence; insert keeping order | `bisect.bisect` / `bisect.insort` | search O(log n); `insort` is O(n) as the list shift dominates; avoids re-sorting O(n log n) after every insert |
| Repeated "smallest / largest k" | `heapq` | O(log n) push/pop; avoids re-sorting to read the top element |
| Counting occurrences | `collections.Counter` | O(n) once; replaces a hand-rolled `dict` increment loop |
| Grouping by key | `collections.defaultdict(list)` | O(n) once; replaces `setdefault` scattered through a loop |

Rule of thumb: if the hot operation is *membership* or *lookup*, the answer is almost always a `set` or a `dict`
built once, outside the loop.

## 3. Let the C layer carry the loop

CPython's built-ins and standard library run their loops in C, far faster than the equivalent Python-level loop
— the performance face of *use the standard vocabulary until evidence earns an escape*. Reach for the
C-implemented built-in first — `sum`, `min`, `max`, `any`, `all`, `sorted`, and the `itertools` / `functools`
combinators — before a hand-written accumulation loop. A comprehension beats an explicit `append` loop for a list
(no repeated `result.append(...)` attribute lookup and call per item) when it holds one transform and at most one
filter — past that, a loop.

Join strings instead of building them with `+=` in a loop:

```python
out = "".join(render(row) for row in rows)
```

Strings are immutable. CPython 3.12 can make a uniquely-referenced local `str` target grow roughly linearly, but
that unspecified optimization disappears for globals, attributes, aliases, or another interpreter, and the loop
is then O(n²). `"".join(pieces)` is portable and linear; use a `bytearray` for incrementally built bytes. Drop
below a built-in to a hand-tuned form only when a profile and benchmark on the target workload show the
replacement wins (§8, §9).

## 4. Three recurring cost traps

Three patterns account for most real Python slowdowns; each has a clean fix.

| Symptom | Evidence | Change |
|---|---|---|
| A membership scan inside another loop | `x in some_list` / tuple makes the path O(n·m) | Build a `set` once, making it O(n+m) average (§2) |
| One DB query, HTTP request, or file read per item | An I/O trace shows N+1 round trips dominate | Batch through one query (an `IN (...)` / bulk endpoint), or hoist the read out of the loop |
| Copies, conversions, or repeated ordering | The profile/allocation trace shows slices, `list(gen)`, `dict(other)`, `deepcopy`, or re-sorts | Stay lazy (§5), pass a `memoryview` or index range for a large buffer, and sort once |

For the first trap, `known = set(known_list)` built once, then `x in known`, turns O(n·m) into O(n+m) average.
A plain function call does **not** copy its arguments — Python binds another reference — so passing a large
container through call layers is free; the cost starts only at an *explicit* operation. `data[:]` and `data[a:b]`
copy the selected elements, `list(gen)` and `dict(other)` allocate new containers, and `copy.deepcopy`
duplicates reachable state — sometimes required by ownership, but avoid them when the result is read once, and
preserve an already-ordered sequence instead of sorting again. As a per-request cost, N+1 I/O usually matters
far more than any CPU tuning.

## 5. Stream instead of materialize

For large or unbounded data, memory is the binding constraint, and streaming keeps it flat. A generator function
(`yield`) or generator expression holds one item at a time — constant memory where a list comprehension
allocates the whole sequence at once — so prefer it when the sequence streams, may be large, or is consumed
once. Compose lazy pipelines with `itertools.islice`, `chain`, `groupby`, and `takewhile`; `yield from` delegates
without materializing the sub-sequence; read files line by line (`for line in file:`) rather than
`file.read().splitlines()`. Materialize a concrete `list` / `dict` / `set` when the caller must replay, index,
measure length, or own the result — a generator is single-pass with per-item overhead, and when the whole result
must live in memory anyway a comprehension can be clearer and faster. Choose by caller use, following Procedure
step P3 (design act 5), not by reflex.

## 6. Allocation and memory

Object churn and per-instance overhead are real costs at scale, but the fixes are targeted, not blanket. For a
class instantiated in the millions, `__slots__ = ("x", "y")` removes the per-instance `__dict__`, cutting memory
and speeding attribute access — but it forbids ad-hoc attributes, needs `__weakref__` listed if weak references
are required, and complicates multiple inheritance, so reserve it for measured hot, high-count classes; a
`@dataclass(slots=True)` (3.10+) gives the same storage shape for a data record. For homogeneous numeric data an
`array.array` or a `memoryview` stores numbers without the per-element object overhead of a `list[int]`, and a
`memoryview` also slices a large buffer without copying it. Bound anything that accumulates: an unbounded cache,
list, or queue that grows with input is a memory leak in slow motion — cap it (§7) or stream past it (§5), and
release large objects when done instead of holding a reference "just in case".

## 7. Caching

A cache trades memory for repeated compute. It is correct only when the function is pure, its arguments are
hashable, capacity matches key variety, and invalidation is designed.

```python
@functools.lru_cache(maxsize=1024)          # bounded: evicts least-recently-used past 1024
def parse_rule(source: str) -> Rule:
    ...
```

Use `functools.lru_cache(maxsize=N)` for a bounded cache; `functools.cache` is `lru_cache(maxsize=None)` and
never evicts, so use it only when the key set is provably small and fixed. Do not cache a function with side
effects, time-varying results, or mutable arguments — stale or wrong output is a correctness bug, not a slow
path. Plan invalidation before enabling the cache: `cache_clear()` drops the whole cache and `lru_cache` has no
per-key eviction, so clear on the invalidating event or include a version in the key. `functools.cached_property`
stores one lazy value per instance; at 3.12 it takes no lock around the computation, so two threads racing the
first access may each compute it — safe only for an idempotent, side-effect-free computation.

## 8. Profile before you optimize

Base every performance change on measurement: intuition about where Python spends time is unreliable, because
attribute lookups, allocation, and interpreter overhead are not visible by eye. Profile the representative
workload to find the hot path — a deterministic profiler (`cProfile`, sorted by cumulative time with
`pstats.Stats(...).sort_stats("cumulative").print_stats(20)`) reports per-function call counts and cumulative time, while a
sampling profiler (`py-spy` and the like) attaches to a running process with low overhead; the rule is "profile
the real workload", not a specific tool. Measure wall time with `time.perf_counter` (a monotonic high-resolution
clock) and memory with `tracemalloc` (which attributes allocations to source lines). Optimize only the top entry
the profile indicts, then re-profile because the hot path moves, and confirm the fix on the same workload against
the retained baseline — a change without before/after evidence is a guess.

## 9. Benchmark design: micro vs macro

A benchmark that measures the wrong thing produces a confident wrong conclusion, so match its scope to the
claim: a microbenchmark (`timeit`) isolates one operation to compare two forms, a macro benchmark runs the
end-to-end path on representative data, and a micro win does not imply a system win — the operation may be a
rounding error next to the I/O around it. Benchmark on production-like sizes and distributions (a form that wins
on a tiny sorted list can lose on a large skewed one). Control variance: run several trials and report the
minimum or median, not a single noisy sample; warm up before timing; run on an otherwise-quiet machine; and know
that `timeit` repeats and disables the garbage collector by default. Keep the work real — CPython does **not**
eliminate a function call whose result is unused (a call always runs, since it may have side effects or raise),
so the danger is not dead-code elimination but *accidentally measuring nothing*: a per-call cache (`lru_cache`)
that turns the second run into a no-op, a result already computed outside the timed loop, or a compile-time
constant the peephole optimizer folds — feed fresh inputs each run and time the real call. Finally, assert that
the fast candidate returns the same result as the baseline on the same inputs before trusting the timing; a
speedup that changes the answer is not a speedup.

## 10. CPython costs and alternate interpreters

The last-resort micro-optimizations depend on the interpreter — conditional, not universal. CPython's attribute
lookup, function calls, dynamic dispatch, and integer boxing have costs, and a local is faster to read than a
global or attribute, but hoisting a repeated `obj.method` lookup to a local matters only in a profiled hot loop.
CPython 3.11+ also specializes common patterns (PEP 659), so measure on the *target* version instead of porting
an old folk rule. PyPy's JIT can make a plain loop faster than a hand-tuned CPython form, so a CPython
micro-optimization may be pointless or harmful there, and some C extensions do not run under PyPy. Isolate and
document any interpreter-specific optimization behind a narrow boundary with a clear pure-Python reference form
(`interoperability.md`).

## 11. Footgun index

Each row points to the section that explains the cost trap and its fix in full.

| Footgun | See |
|---|---|
| `x in some_list` inside a loop — O(n·m) membership | §4, §2 |
| `list.pop(0)` / `list.insert(0, …)` in a loop — O(n) shift → O(n²) | §2 |
| `s += piece` to build a string in a loop — O(n²) when CPython's fragile in-place optimization does not apply (global/attribute target, aliased, other interpreter) | §3 |
| One query/request/read per loop iteration (N+1) — per-call I/O dominates | §4 |
| `list(generator)` then iterate once — materializes the whole sequence needlessly | §5 |
| `functools.cache` on a wide key space — unbounded growth, a memory leak | §7 |
| Caching an impure, time-varying, or mutable-argument function — stale or wrong results | §7 |
| Optimizing from intuition with no representative profile — effort off the real hot path | §8, §1 |
| A microbenchmark cited for a system-level claim — the isolated op may be noise end-to-end | §9 |
| `__slots__` added to every class by reflex — breaks dynamic attributes / weakrefs / inheritance for no measured win | §6 |
| A CPython micro-tuning assumed universal — pointless or harmful on PyPy / a newer CPython | §10 |
