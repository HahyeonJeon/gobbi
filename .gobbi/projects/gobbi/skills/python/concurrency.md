# Python — Concurrency

Child doc of the `python` skill: choosing and running concurrent work at the 3.12 baseline. The `SKILL.md`
§ Procedure P2 router sends a reader here when a change starts tasks or uses async, threads, processes,
executors, queues, locks, timeouts, or deadlines, or shares state across them. Sequential code stays on the
parent floor.

Deepens the parent's principle 6 (*make lifetime visible, keep mutation local*), principle 8 (*standard
vocabulary until evidence earns an escape*), and hard invariant **H12** (own tasks, propagate cancellation,
enforce timeouts and deadlines, keep blocking work off the loop, bound fan-out, drive shutdown, synchronize
shared state). The one-line model choice lives in the parent's § Rules *Concurrency and dependencies* default,
chosen at Procedure step P3 (design act 3); here are its mechanics. Tool and library names are examples, not
locks.

Bottom-up order: synchronous is the simplest correct shape — add concurrency only on workload and shutdown
evidence (§1). Before any worker body, sketch the owner tree, cancellation, timeouts and deadlines, the queue,
the bounds, and shutdown order; the bodies fill a structure that already unwinds.

## Contents

1. [Choose the model: I/O, blocking, CPU](#1-choose-the-model-io-blocking-cpu)
2. [Structured concurrency with TaskGroup](#2-structured-concurrency-with-taskgroup)
3. [Timeouts and deadlines](#3-timeouts-and-deadlines)
4. [Cancellation](#4-cancellation)
5. [Never block the event loop](#5-never-block-the-event-loop)
6. [Bounded fan-out and backpressure](#6-bounded-fan-out-and-backpressure)
7. [concurrent.futures executors and deadlocks](#7-concurrentfutures-executors-and-deadlocks)
8. [Threads, locks, and shared state](#8-threads-locks-and-shared-state)
9. [Processes, serialization, and start methods](#9-processes-serialization-and-start-methods)
10. [The GIL and free-threading](#10-the-gil-and-free-threading)
11. [Graceful shutdown](#11-graceful-shutdown)
12. [Footgun index](#12-footgun-index)

---

## 1. Choose the model: I/O, blocking, CPU

Synchronous is the default: with no waiting to overlap and no parallel compute to win, add no concurrency — it
is a lifetime-and-shutdown obligation, not a free speedup, and the parent forbids adding it without workload and
shutdown evidence. Otherwise the model follows what the work does while "busy":

| Workload | Model | Deciding condition |
|---|---|---|
| Many I/O waits to overlap | `asyncio` | Correct only when the call path is `async` end to end — one blocking call anywhere stalls every coroutine on the loop (§5). Fits high-fan-out network/disk work where the cost is *waiting*, not computing. |
| A blocking sync API, blocking file I/O, or a C call that releases the GIL | Threads | Threads overlap those waits but do **not** speed CPU-bound pure-Python code, because the GIL serializes bytecode (§10). |
| Measured CPU-bound work to run past the GIL | Processes | Each process has its own interpreter and GIL, so pure-Python compute scales — but startup, import, serialization, and copying (§9) must be cheaper than the gain. |
| No measured overlap or parallel win | Synchronous | Concurrency adds ownership, failure, and shutdown cost with no evidence. |

A pipeline often mixes models per stage — async fetch, process-pool parse — rather than forcing one model
across every stage. Measure each stage first (`performance.md`).

## 2. Structured concurrency with TaskGroup

`asyncio.TaskGroup` (3.11+) is the default owner of a task set: its `async with` boundary makes lifetime
visible, since children finish or unwind before the block exits.

```python
async def fan_out(urls: Sequence[str]) -> list[Response]:
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(fetch(url)) for url in urls]
    return [task.result() for task in tasks]   # block exits only when every task is done
```

If one child fails, the group cancels its siblings, waits for their cleanup, and raises an `ExceptionGroup`;
handle a known subset with `except* SpecificError:` and let the rest propagate — do not flatten the group with a
broad catch. Prefer `TaskGroup` to `asyncio.gather`, which does not cancel siblings on one failure by default;
use `gather(..., return_exceptions=True)` only when you deliberately need every result-or-error with no sibling
cancellation. A bare `asyncio.create_task` is not ownership: the loop holds only a weak reference, so a task
without a strong reference can be garbage-collected mid-flight — keep owned work in a `TaskGroup`, and give
genuinely longer-lived work another explicit owner that awaits it.

## 3. Timeouts and deadlines

H12 requires enforced timeouts **and** deadlines because they bound different budgets. A timeout bounds one wait
or region by a duration; an absolute deadline gives several awaits one shared budget, so a later stage cannot
restart the full allowance. An unbounded `await` on a hung peer is a silent hang, not an error.

```python
async def run_stages() -> None:
    deadline = asyncio.get_running_loop().time() + 5.0   # one absolute deadline for several awaits
    async with asyncio.timeout_at(deadline):
        await step_one()
        await step_two()
```

Use `asyncio.timeout(seconds)` (3.11+) for a relative region, `asyncio.timeout_at(deadline)` for a monotonic
absolute deadline, and `asyncio.wait_for(coro, seconds)` for one awaitable; prefer the context-manager `timeout`
when several awaits share one deadline. Expiry cancels the wrapped code (delivering a `CancelledError` inside),
runs `finally` cleanup (§4), then exposes a `TimeoutError` outside the context. Treat a timeout as a real path,
not an edge case: give the timed region cleanup and a caller-visible outcome — a partial result, a retry, or a
failure — never an unhandled crash.

## 4. Cancellation

Cancellation is cooperative: `CancelledError` arrives at an `await` in the cancelled task. Clean up, then
re-raise it so `TaskGroup` teardown and shutdown can finish.

```python
async def worker(queue: asyncio.Queue[Job]) -> None:
    try:
        while True:
            await handle(await queue.get())
    except asyncio.CancelledError:
        await flush_pending()   # cleanup may await
        raise                   # MUST re-raise — never swallow
    finally:
        await release()         # runs on success, failure, AND cancel
```

Swallowing `CancelledError` (returning, or catching a subclass) tells the runtime the task refused to stop.
Since 3.8 it inherits from `BaseException`, so `except Exception` does **not** catch it, but a bare `except` or
`except BaseException` does — never use either in a task body. Prefer `async with` on the resource for a visible
lifetime, otherwise `try/finally` so cleanup runs on success, failure, and cancellation. Use `asyncio.shield(coro)`
only for a small operation that must not be torn in half, such as a commit or an ack: it keeps the inner task
running, but the awaiter still receives the `CancelledError`, so keep a strong reference and await the inner task
on cleanup — never shield a whole subtree.

## 5. Never block the event loop

A synchronous HTTP client, blocking DB driver, file call, `time.sleep`, or heavy CPU loop freezes every
coroutine on the loop. Use `await asyncio.to_thread(fn, *args)` for a blocking I/O or GIL-releasing call, and
`await loop.run_in_executor(process_pool, fn, *args)` for CPU-bound pure Python — a CPU-heavy pure-Python loop
is blocking even without I/O, and a thread will not help because the GIL keeps it on the loop's core. Inside a
coroutine use `await asyncio.sleep(...)`, never `time.sleep(...)`, and never call a future's blocking `result()`
from the loop (§7).

## 6. Bounded fan-out and backpressure

Unbounded concurrency is a memory-and-overload bug: ten thousand simultaneous requests exhaust sockets, memory,
and the peer. Two distinct limits are in play — bound both. A `Semaphore(n)` caps how many operations run *at
once*, but `[tg.create_task(bounded_fetch(u)) for u in urls]` still creates and retains **one task per URL**, so
task memory grows with the whole input though only ten run at once. Bound live tasks too — with
`itertools.batched` (3.12+), a fixed worker set, or another chunked submission shape:

```python
from itertools import batched   # 3.12+

async def run(urls: Sequence[str], *, batch: int = 10) -> list[Response]:
    results: list[Response] = []
    for chunk in batched(urls, batch):          # at most `batch` tasks alive at once
        async with asyncio.TaskGroup() as tg:
            tasks = [tg.create_task(fetch(u)) for u in chunk]
        results.extend(task.result() for task in tasks)
    return results
```

Separate the two bounds: a `Semaphore` bounds *active operations*, while batching or a fixed-`max_workers` worker pool bounds
*how many tasks exist*. A bounded `asyncio.Queue(maxsize=n)` adds producer/consumer backpressure — `await
queue.put(item)` blocks when the queue is full, so a fast producer slows to the consumer's rate. Pools bound
workers, not submitted futures: do not retain an unbounded future per input — submit in chunks or consume through
`as_completed` (§7) so submission memory stays flat.

## 7. concurrent.futures executors and deadlocks

`concurrent.futures` gives synchronous callers a uniform pool API over threads and processes. Use
`ThreadPoolExecutor` for blocking or GIL-releasing calls and `ProcessPoolExecutor` for measured CPU work — the
§1 model choice as a pool. Read every future through `result()` or `as_completed`; `result()` re-raises the
worker's exception in the caller. Never let a pooled task wait on another task in the same bounded pool: if every
worker blocks on work only a free worker could run, the pool deadlocks — keep tasks independent, or give nested
work its own pool. Own the pool with `with`, which calls `shutdown(wait=True)`; use `shutdown(cancel_futures=True)`
(3.9+) to drop queued, not-yet-started work; an un-shut pool keeps its workers alive. From async code await
`run_in_executor` (§5), never blocking `future.result()`.

## 8. Threads, locks, and shared state

Prefer immutable messages and returned results over shared mutation — *keep mutation local* under real
parallelism. When threads must share compound state, guard the whole invariant: `counter += 1` is
read-modify-write, so two threads can lose an update and the GIL does not make it atomic (`with lock: counter += 1`).
Use `threading.Lock` or `RLock` for mutual exclusion, `Event` for a one-way signal, and `Condition` for
wait-until-state; hold a lock for the shortest invariant-preserving region and release it with `with`. Prefer a
`queue.Queue` to a shared list plus a lock — it is thread-safe and needs no explicit lock, the thread analogue of the async bounded queue (§6). Inside async
code use `asyncio.Lock`; a contended blocking `threading.Lock` freezes the loop while held (§5), so keep sync
locks for thread code. Use `contextvars.ContextVar` for request-scoped values such as a trace or tenant id: each
async task runs in a copied context and task contexts propagate across awaits, while `threading.local` does not
model async task context. Reserve locks for
state that genuinely must be shared.

## 9. Processes, serialization, and start methods

A process pool wins CPU parallelism but pays a serialized boundary, and its start method is a real correctness
knob. Arguments and results crossing the boundary are pickled and copied into the worker, so a large payload
pays a copy each way — pass a path, offset, or small descriptor and let the worker load the data — and a value
that is not picklable (a lambda, an open file, a local closure) cannot cross at all.
Choose the start method: at the 3.12 Linux baseline `fork` from a multithreaded parent can copy held locks and
deadlock the child, and 3.12 warns for `os.fork()` in that state, so prefer `spawn` or `forkserver` via
`multiprocessing.get_context(...)` and `ProcessPoolExecutor(mp_context=ctx)`. `spawn` re-imports the module, so
keep imports inert and put top-level execution behind `if __name__ == "__main__"` or the children re-run it.
Measure startup, re-import, serialization, and copy cost before reaching for processes; small or I/O-bound work
may lose the parallel win (`performance.md`).

## 10. The GIL and free-threading

The standard 3.12 GIL lets one thread execute Python bytecode at a time. Threads still overlap I/O and C calls
that release the GIL, but pure-Python CPU parallelism needs processes (§1, §9). The GIL is neither an atomicity
guarantee nor a synchronization primitive — it does not make a compound operation such as `+=`, list mutation,
or check-then-act atomic, so lock it explicitly (§8), and code that "works because of the GIL" is a latent race.
Python 3.13's experimental, opt-in free-threaded build (PEP 703, `python3.13t`) removes the GIL so threads run
Python in parallel, but it is not this doc's baseline and extension compatibility varies. Do not assume it is
present or depend on GIL behavior; isolate and document interpreter-specific assumptions per
`interoperability.md`.

## 11. Graceful shutdown

Shutdown is part of the concurrency design, not an afterthought — H12 pairs owning tasks with driving an
explicit shutdown. Let `asyncio.run(main())` own the loop: it runs `main`, and on exit cancels remaining tasks,
runs their cleanup, and closes the loop. Put every task in a `TaskGroup` and every resource in `async with` or
`contextlib.AsyncExitStack`, so cancellation unwinds the whole owner tree cleanly. For a service, translate stop
signals into an orderly drain: `loop.add_signal_handler(signal.SIGTERM, stop_event.set)` lets it finish in-flight
work instead of dying mid-request, but it is **Unix-only** — Windows event loops raise `NotImplementedError`. On
Windows use `signal.signal(...)` in the main thread and hop to the loop via `loop.call_soon_threadsafe`, or rely
on `asyncio.run` turning Ctrl+C (`SIGINT`) into cancellation of the main task; guard platform-specific wiring.
Drain in-flight tasks and every queue, then shut every pool — a `with` block calls `shutdown`, a bare pool must
be shut explicitly, and un-awaited work drops committed results or leaves workers outliving the program.

## 12. Footgun index

Each row points to the section that explains the hazard and its fix in full.

| Footgun | See |
|---|---|
| **Task ownership** — a bare `create_task` with no strong reference (GC'd mid-flight), or `gather` assumed to cancel siblings on failure | §2 |
| **Cancellation** — a bare `except` or `except BaseException` in a task body swallows `CancelledError` (`except Exception` does *not* catch it) | §4 |
| **Timeouts and deadlines** — an unbounded wait, or a fresh child timeout that resets a caller-owned shared budget | §3 |
| **Event-loop blocking** — a synchronous call (`requests`, `time.sleep`, a heavy CPU loop), a direct `future.result()`, or a contended sync `Lock` in a coroutine | §5, §8 |
| **Bounded fan-out** — a task, request, or retained future per input with no cap | §6 |
| **Executor deadlock** — a pooled task waits on another task in the same bounded pool | §7 |
| **Shared state** — a compound mutation such as `counter += 1` assumed atomic | §8 |
| **Process boundary** — `fork` from a multithreaded parent, an unpicklable value, or an oversized copied payload | §9 |
| **GIL** — threads expected to speed pure-Python CPU work, or GIL behavior treated as correctness | §10 |
| **Shutdown** — an un-shut executor, an un-awaited task, an undrained queue, or signal wiring that assumes Unix | §11 |
