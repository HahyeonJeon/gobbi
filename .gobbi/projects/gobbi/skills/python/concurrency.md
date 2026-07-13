# Python — Concurrency

Child doc of the `python` skill: the deep reference for choosing and running concurrent work at the 3.12
baseline. The `SKILL.md` § Procedure P5 router sends a reader here when a change starts tasks or uses async,
threads, processes, executors, queues, locks, or timeouts, or shares state across them. An ordinary
sequential module needs none of this — the parent floor already carries the common path.

This doc **deepens, and does not restate,** four parent surfaces: the principles *"Make ownership and
lifetime visible in the syntax"* and *"Prefer values and transformations over shared mutation"*, the rule
*"MUST choose the concurrency model from the workload and give it structured ownership"*, and the rule
*"NEVER swallow a `CancelledError`, launch an unobserved fire-and-forget task, block the event loop, or
assume the GIL makes a compound operation atomic; NEVER add concurrency as an optimization without workload
evidence and a shutdown design"*. The parent § Procedure P2 *Concurrency model* table owns the one-line
model choice; the sections below give the mechanics behind it. Every construct here is valid at Python 3.12;
tool and library names are examples, never a lock.

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
12. [Footguns](#12-footguns)

---

## 1. Choose the model: I/O, blocking, CPU

The model follows the workload, not preference. The parent § Procedure P2 *Concurrency model* table gives the
one-line rule; the deciding property is what the work does while it is "busy".

- **`asyncio` — many I/O-bound waits to overlap in one thread.** Correct only when the call path is `async`
  end to end: one blocking call anywhere stalls every coroutine on the loop (§5). Best for high-fan-out
  network and disk work where the cost is *waiting*, not computing.
- **Threads — blocking or GIL-releasing calls.** A synchronous library with no `async` API, blocking file
  I/O, or a C extension that releases the GIL while it runs. Threads overlap those waits; they do **not**
  speed up CPU-bound pure-Python code, because the GIL serializes bytecode (§10).
- **Processes — CPU-bound work that must run in parallel past the GIL.** Each process has its own interpreter
  and GIL, so pure-Python compute scales — at the cost of a serialized, copied boundary (§9). Justify the
  startup and copy cost with a measurement, per the parent performance floor.
- **Synchronous — the default.** If there is no waiting to overlap and no parallel compute to win, add no
  concurrency at all. Concurrency is a lifetime-and-shutdown obligation, not a free speedup; the parent rule
  forbids adding it "as an optimization without workload evidence and a shutdown design".

A pipeline often mixes models per stage — async for the network fetch, a process pool for the CPU-heavy
parse — rather than forcing one model on every stage. Measure each stage before committing (see
`performance.md`).

## 2. Structured concurrency with TaskGroup

`asyncio.TaskGroup` (3.11+) is the default way to own a set of concurrent tasks. It makes the parent
principle *"Make ownership and lifetime visible in the syntax"* concrete: the tasks cannot outlive the
`async with` block.

```python
import asyncio
from collections.abc import Sequence

async def fan_out(urls: Sequence[str]) -> list[Response]:
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(fetch(url)) for url in urls]
    # the block exits only when every task is done; each result is now ready
    return [task.result() for task in tasks]
```

- **Automatic cancellation on first failure.** If any child task raises, the group cancels the remaining
  tasks, waits for them to unwind, then raises. The tasks never leak past the block.
- **Errors arrive as an `ExceptionGroup`.** One or several child failures surface together; catch them with
  `except* SpecificError:` to handle a subset and re-raise the rest. Do not flatten the group by catching a
  bare `Exception`.
- **Prefer `TaskGroup` over `asyncio.gather`.** `gather` does not cancel siblings when one task fails by
  default — the others keep running unobserved. Reach for `gather(..., return_exceptions=True)` only when you
  deliberately want every result-or-error and no sibling cancellation; otherwise use `TaskGroup`.
- **Never bare `create_task` for owned work.** A task from `asyncio.create_task` with no strong reference can
  be garbage-collected mid-flight (§12). If a task must live for the duration of an operation, it belongs in a
  `TaskGroup`.

## 3. Timeouts and deadlines

Bound every wait. An unbounded `await` on a hung peer is a silent hang, not an error.

```python
async def fetch_within(url: str) -> Response:
    async with asyncio.timeout(5.0):          # 3.11+ ; raises TimeoutError on expiry
        return await fetch(url)

async def run_stages() -> None:
    # one absolute deadline shared across several awaits:
    deadline = asyncio.get_running_loop().time() + 5.0
    async with asyncio.timeout_at(deadline):
        await step_one()
        await step_two()
```

- **`asyncio.timeout` drives cancellation.** On expiry it cancels the wrapped code (delivering a
  `CancelledError` inside), then converts that to a `TimeoutError` at the context boundary. Cleanup in the
  wrapped code still runs through `finally` (§4).
- **`asyncio.wait_for(coro, timeout)`** is the single-awaitable form; the context-manager `timeout` is
  preferred when several awaits share one deadline.
- **A timeout is a real path, not an edge case.** Give the timed region a cleanup and a caller-visible
  outcome; do not let a `TimeoutError` escape as an unhandled crash where a partial result or a retry was
  expected.

## 4. Cancellation

Cancellation is cooperative: the runtime raises `CancelledError` at the next `await` inside the cancelled
task. Two rules keep it correct.

```python
async def worker(queue: asyncio.Queue[Job]) -> None:
    try:
        while True:
            job = await queue.get()
            await handle(job)
    except asyncio.CancelledError:
        await flush_pending()   # cleanup is allowed to await
        raise                   # MUST re-raise — never swallow
    finally:
        await release()         # runs on cancel AND on normal exit
```

- **Re-raise `CancelledError`.** Swallowing it (returning, or `except Exception` that accidentally catches a
  subclass) tells the runtime the task refused to stop, breaking `TaskGroup` teardown and shutdown. Since 3.8
  `CancelledError` inherits from `BaseException`, so a plain `except Exception` does **not** catch it — but a
  bare `except` or `except BaseException` does; never use those in a task body.
- **Clean up in `try/finally`.** A `finally` block runs on both cancellation and normal exit, so it is the
  reliable place to release resources — but `async with` on the resource itself is better still, because it
  makes the lifetime visible in the syntax.
- **Shield only the truly uninterruptible step.** `asyncio.shield(coro)` keeps `coro` running even if the
  awaiter is cancelled — for a commit or an ack that must not be torn in half:

  ```python
  async def commit_and_wait() -> None:
      commit = asyncio.create_task(commit_transaction())
      await asyncio.shield(commit)   # outer cancel raises here, but commit keeps running
  ```

  Shield protects the inner task only; the awaiting coroutine still receives the `CancelledError`, and you
  remain responsible for awaiting `commit` on the cleanup path. Over-shielding defeats cancellation, so shield
  the one critical section, not a whole subtree.

## 5. Never block the event loop

One synchronous blocking call freezes every coroutine sharing the loop. Blocking work — a synchronous HTTP
client, a heavy CPU loop, `time.sleep`, a blocking DB driver — must move off the loop.

```python
async def load_and_parse(path: str, process_pool: Executor) -> Parsed:
    # a blocking I/O call → run it in the default thread pool:
    raw = await asyncio.to_thread(blocking_read, path)

    # CPU-bound work → a process pool you own, off the loop:
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(process_pool, cpu_parse, raw)
```

- **`asyncio.to_thread(fn, *args)`** offloads a blocking *I/O* call to a worker thread — right when the call
  releases the GIL while it waits (§10).
- **`loop.run_in_executor(pool, fn, *args)`** targets a pool you control; pass a `ProcessPoolExecutor` for
  CPU-bound work so it runs past the GIL (§7, §9).
- **`await asyncio.sleep(...)`, never `time.sleep(...)`,** inside a coroutine — `time.sleep` blocks the whole
  loop.
- **A CPU-heavy pure-Python loop is blocking** even without I/O. Move it to a process pool; a thread will not
  help, because the GIL keeps it on the same core as the loop.

## 6. Bounded fan-out and backpressure

Unbounded concurrency is a memory-and-overload bug: ten thousand simultaneous requests exhaust sockets,
memory, and the peer. Two different limits are in play, and they are not the same — bound both.

**A `Semaphore` caps concurrency, not task count.** It limits how many operations run *at once*:

```python
sem = asyncio.Semaphore(10)   # at most 10 fetches run at once

async def bounded_fetch(url: str) -> Response:
    async with sem:           # caps CONCURRENCY, not how many tasks exist
        return await fetch(url)
```

But a driver that does `[tg.create_task(bounded_fetch(u)) for u in urls]` still creates and retains **one
task per URL** up front, so task memory grows with the whole input even though only ten run at a time. For a
large or unbounded input, also bound the number of *live* tasks.

**Chunked batches bound live-task memory.** Only one batch of tasks exists at a time, so memory is O(batch)
regardless of the input size:

```python
from collections.abc import Sequence
from itertools import batched   # 3.12+

async def run(urls: Sequence[str], *, batch: int = 10) -> list[Response]:
    results: list[Response] = []
    for chunk in batched(urls, batch):          # at most `batch` tasks alive at once
        async with asyncio.TaskGroup() as tg:
            tasks = [tg.create_task(fetch(u)) for u in chunk]
        results.extend(task.result() for task in tasks)
    return results
```

- **Separate the two bounds.** A `Semaphore` bounds *active operations*; batching (or a fixed worker pool)
  bounds *how many tasks exist*. Eagerly creating a task per input is the submission-memory trap the §7
  executor advice rejects too — the fix is the same on both surfaces.
- **A bounded `asyncio.Queue(maxsize=n)`** gives producer/consumer backpressure: `await queue.put(item)`
  blocks when the queue is full, so a fast producer slows to the consumer's rate instead of buffering without
  limit — the memory-safe shape for a streaming pipeline fed by a fixed set of worker tasks.
- **Bound the pool, not just the submission.** A thread or process pool with a fixed `max_workers` is itself a
  bound; do not submit an unbounded list of futures and hold them all — chunk the work or use `as_completed`
  (§7) so memory stays flat.

## 7. concurrent.futures executors and deadlocks

`concurrent.futures` gives a uniform pool API over threads and processes for a synchronous call site.

```python
from concurrent.futures import ProcessPoolExecutor, as_completed

with ProcessPoolExecutor(max_workers=4) as pool:      # the block calls shutdown(wait=True)
    futures = {pool.submit(parse, blob): blob.id for blob in blobs}
    for future in as_completed(futures):
        result = future.result()                       # re-raises the worker's exception here
```

- **`ThreadPoolExecutor` for blocking I/O and GIL-releasing calls; `ProcessPoolExecutor` for CPU-bound
  work.** The choice is the §1 model choice, expressed as a pool.
- **`future.result()` re-raises inside the caller.** A worker exception is not lost — it is re-raised when you
  read the result. Read every result (or use `as_completed`) so no failure is dropped.
- **Deadlock: never wait, from inside a pooled task, on another task in the same bounded pool.** If every
  worker is blocked waiting for work that only a free worker could run, the pool deadlocks. Keep pool tasks
  independent, or give nested work its own pool.
- **Shut the pool down deterministically.** The `with` block calls `shutdown(wait=True)` on exit;
  `shutdown(cancel_futures=True)` (3.9+) also drops queued work that has not started. A pool left un-shut keeps
  its worker threads or processes alive.
- **Do not block the event loop on a pool.** From async code, `await loop.run_in_executor(pool, ...)` (§5) —
  never call `future.result()` directly inside a coroutine, which blocks the loop until the future completes.

## 8. Threads, locks, and shared state

Shared mutable state across threads needs explicit synchronization — this is the parent principle *"Prefer
values and transformations over shared mutation"* enforced under real parallelism.

- **The GIL does not make compound operations atomic.** `counter += 1` is read-modify-write — three bytecode
  steps a thread switch can interleave, so two threads can lose an update. Guard it:

  ```python
  import threading
  lock = threading.Lock()
  with lock:
      counter += 1
  ```

- **Prefer a `queue.Queue` to hand work between threads** over a shared list plus a lock. `queue.Queue` is
  thread-safe and gives producer/consumer flow without an explicit lock; it is the thread analogue of the
  async bounded queue (§6).
- **Pick the primitive for the job** — `threading.Lock`/`RLock` for mutual exclusion, `threading.Event` for a
  one-way signal, `threading.Condition` for wait-until-state. Hold a lock for the shortest region that keeps
  the invariant, and always release it with `with` so an exception cannot leak it.
- **`contextvars.ContextVar` for per-context values, not thread-locals in async code.** A `ContextVar`
  propagates correctly across `asyncio` tasks — each task runs in a copied context — where a `threading.local`
  does not follow an `await`. Use it for request-scoped context (a trace id, a tenant) that must ride along
  the call chain without a parameter.
- **The safest shared state is none.** Where you can pass an immutable value or return a new result instead of
  mutating a shared object, the race cannot happen. Reserve locks for the state that genuinely must be shared.

## 9. Processes, serialization, and start methods

A process pool wins CPU parallelism but pays a serialized boundary, and its start method is a real
correctness knob.

- **Everything crossing the boundary is pickled.** Arguments and return values are serialized and copied into
  the worker. A large object (a big DataFrame, a giant list) pays a copy cost each way — pass a path, an
  offset, or a small descriptor and let the worker load the data, rather than shipping the payload. A value
  that is not picklable (a lambda, an open file, a local closure) cannot cross at all.
- **Choose the start method deliberately.** At 3.12 the Linux default is still `fork`, which is unsafe from a
  multithreaded parent — copying locks held by other threads can deadlock the child (3.12 emits a
  `DeprecationWarning` when `os.fork()` runs in a multithreaded process). Prefer `spawn` or `forkserver` for
  a portable, thread-safe start:

  ```python
  import multiprocessing
  from concurrent.futures import ProcessPoolExecutor

  ctx = multiprocessing.get_context("spawn")
  with ProcessPoolExecutor(mp_context=ctx) as pool:
      ...
  ```

- **`spawn` re-imports the module,** so the worker entry point must be import-safe — the parent's *inert
  import time* rule matters doubly here, and the program's top level must sit behind
  `if __name__ == "__main__"` or the children re-run it.
- **Measure before reaching for processes.** Startup, re-import, and copy cost can erase the parallel win on
  small or I/O-bound work. The parent performance floor requires a measurement, not a guess (see
  `performance.md`).

## 10. The GIL and free-threading

- **The GIL serializes Python bytecode.** In the standard 3.12 interpreter, one thread executes Python at a
  time. Threads still overlap I/O waits and calls into C code that releases the GIL, but two threads never run
  pure-Python compute in parallel — that is why CPU-bound work uses processes (§1, §9).
- **Never rely on the GIL for correctness.** It does not make `+=`, list mutation, or check-then-act atomic
  (§8); it is an implementation detail, not a synchronization primitive. Code that "works because of the GIL"
  is a latent race — use an explicit lock.
- **Free-threading is forward awareness at 3.12, not the baseline.** Python 3.13 ships an experimental
  free-threaded build (PEP 703, invoked as `python3.13t`) that removes the GIL so threads can run Python in
  parallel. It is opt-in, not the default interpreter, and many C extensions are not yet compatible. Do not
  design against it as if it were present, and — because it *removes* the GIL — do not lean on GIL behavior
  either: correct locking is required on both the default and the free-threaded build. Isolate and document
  any interpreter-specific assumption per the parent interoperability floor (see `interoperability.md`).

## 11. Graceful shutdown

Shutdown is part of the concurrency design, not an afterthought — the parent rule pairs "workload evidence"
with "a shutdown design".

- **Let `asyncio.run(main())` own the loop.** It runs `main`, and on exit cancels remaining tasks, runs their
  cleanup, and closes the loop. Structure `main` so every task is owned by a `TaskGroup` and every resource is
  context-managed (`async with`, `contextlib.AsyncExitStack`) — then cancellation unwinds the whole tree
  cleanly.
- **Handle stop signals for an orderly drain — mind the platform.**
  `loop.add_signal_handler(signal.SIGTERM, stop_event.set)` lets a long-running service finish in-flight work
  instead of dying mid-request, but it is a **Unix-only** API: Windows event loops do not support
  `add_signal_handler` and raise `NotImplementedError`. On Windows, register the handler with
  `signal.signal(...)` (which runs in the main thread and must hop back to the loop via
  `loop.call_soon_threadsafe`), or rely on `asyncio.run` translating Ctrl+C (`SIGINT`) into cancellation of
  the main task. Guard any signal-handler wiring behind the OS check per the parent OS-awareness floor.
- **Shut every pool and drain every queue before exit.** The `with` block on an executor calls `shutdown`;
  a bare pool must be shut explicitly, or its workers outlive the program. Await in-flight tasks so committed
  work is not dropped on the way out.

## 12. Footguns

| Footgun | Why it bites | Correct form |
|---|---|---|
| Bare `asyncio.create_task(x)` with no reference | The task can be garbage-collected mid-flight and silently vanish | Own it in a `TaskGroup`, or hold a strong reference until done |
| A bare `except` or `except BaseException` in a task body | Catches `CancelledError` (a `BaseException` since 3.8) and swallows cancellation, breaking teardown — note `except Exception` does NOT catch it | Catch the specific error; if you must catch `CancelledError`, re-raise it (§4) |
| `asyncio.gather(*tasks)` expecting sibling cancellation | `gather` leaves siblings running when one fails | Use `TaskGroup`; reserve `gather(return_exceptions=True)` for all-results-or-errors |
| A synchronous call inside a coroutine (`requests`, `time.sleep`, heavy CPU) | Blocks every coroutine on the loop | `await asyncio.to_thread(...)` / `run_in_executor` / `asyncio.sleep` (§5) |
| Unbounded fan-out (a task or request per input, no cap) | Exhausts sockets, memory, and the peer | `Semaphore` or a bounded `Queue` (§6) |
| Assuming `counter += 1` is atomic under the GIL | Read-modify-write interleaves across a thread switch | Guard with a `Lock`, or hand off via `queue.Queue` (§8) |
| `fork` start method from a multithreaded parent | Copied locks can deadlock the child | `get_context("spawn")` / `forkserver` (§9) |
| Waiting on a same-pool task from inside a pooled task | All workers block, none free to run the awaited task → deadlock | Keep pool tasks independent, or give nested work its own pool (§7) |
| An un-shut executor or an un-awaited task at exit | Workers outlive the program; committed work is dropped | Use the `with` block; await in-flight tasks (§11) |
| A blocking sync `Lock` used to guard state in async code | Blocks the loop while held | Use `asyncio.Lock` in coroutines; keep sync locks for thread code |
