# Python — Interoperability

Child doc of the `python` skill: the deep reference for code that leaves ordinary Python and crosses a
boundary — into a subprocess, a native/foreign library, the buffer protocol, a serialized or durable
on-disk format, generated code, reflection, a plugin, or a notebook on its way to production. The `SKILL.md`
§ Procedure P5 router sends a reader here when a change touches one of those boundaries. An ordinary typed
module needs none of this — the parent floor already carries the common path.

This doc **deepens, and does not restate,** these parent surfaces: the principle *"Make ownership and
lifetime visible in the syntax."*, and the rules *"MUST isolate and document any CPython, operating-system,
or native assumption"*, *"MUST validate untrusted data before use and choose safe primitives"*, *"MUST make
persistence durable where correctness needs it"*, *"MUST keep reusable logic in importable, typed modules,
not in a notebook or script body"*, *"NEVER `eval`/`exec` untrusted text, unpickle or otherwise unsafely
deserialize untrusted data, build a shell command from untrusted text or default `shell=True`, or use
`random` for security material"*, and *"NEVER hand-edit generated code"*. Those rules are the floor; the
sections below give the mechanics. Every construct here is valid at Python 3.12; tool names are examples,
never a lock.

## Contents

1. [Subprocess boundaries](#1-subprocess-boundaries)
2. [Native and foreign-function interfaces](#2-native-and-foreign-function-interfaces)
3. [The buffer protocol and memoryview](#3-the-buffer-protocol-and-memoryview)
4. [Serialization and durable on-disk formats](#4-serialization-and-durable-on-disk-formats)
5. [Reflection, decorators, and callable metadata](#5-reflection-decorators-and-callable-metadata)
6. [Generated code](#6-generated-code)
7. [Plugins and dynamic import](#7-plugins-and-dynamic-import)
8. [Notebooks and scripts to production modules](#8-notebooks-and-scripts-to-production-modules)

---

## 1. Subprocess boundaries

A subprocess is a foreign program with its own encoding, exit convention, and failure modes. Cross the
boundary explicitly.

- **Pass an argument list, never a shell string.** `subprocess.run(["git", "log", "-1"])` invokes the
  program directly. `shell=True` runs the string through a shell that splits on metacharacters, so untrusted
  text in it is command injection — the mechanics behind the parent's *"build a shell command from untrusted
  text or default `shell=True`"* ban. When you genuinely need a shell feature, still never interpolate
  untrusted text; the arg-list form is the default and `shlex.quote` is a last resort, not a habit.
- **Make text vs bytes explicit.** `stdout`/`stderr` are `bytes` by default. Pass `encoding="utf-8"` (not a
  bare `text=True`, which decodes with the ambient locale) so the boundary decodes the same way on every
  machine — the subprocess face of *"MUST make I/O boundaries explicit"*. Keep binary output as `bytes` and
  decode only at a known encoding boundary.
- **Bound every child with a timeout.** A child that hangs hangs the parent. `run(..., timeout=T)` kills the
  child and raises `TimeoutExpired`; with a raw `Popen`, `communicate(timeout=T)` does **not** kill on expiry
  — you must `proc.kill()` then `proc.communicate()` to reap it.
- **Handle the exit code deliberately.** `check=True` raises `CalledProcessError` (carrying `returncode`,
  `stdout`, `stderr`) on any non-zero exit — prefer it unless a non-zero code is an expected branch you
  inspect via `returncode`.
- **Capture vs stream.** `capture_output=True` buffers all output in memory — fine when bounded, a memory
  risk for large or unbounded output. To stream, drive a `Popen` and read incrementally, but avoid the
  pipe-buffer deadlock (filling stdin while the child fills stdout) by letting `communicate()` pump both
  ends, or by reading the pipes concurrently.

```python
import subprocess

result = subprocess.run(
    ["git", "log", "-1", "--format=%H"],   # an argument LIST, never a shell string
    capture_output=True,
    encoding="utf-8",                       # explicit; do not inherit the locale
    timeout=30,                             # bound the child
    check=True,                             # non-zero exit raises CalledProcessError
)
commit = result.stdout.strip()
```

## 2. Native and foreign-function interfaces

Calling into a C library is the sharpest boundary Python has: no type checker, no garbage collector, and no
exception on misuse — a wrong signature corrupts memory silently. This is the core of the parent's *"MUST
isolate and document any CPython, operating-system, or native assumption"* — put the whole foreign surface
behind one narrow, documented adapter, and keep a pure-Python reference behind the same interface where
feasible so the native path can be validated against it and disabled on an unsupported platform.

- **Pick the route by need.** `ctypes` (stdlib) declares a C signature at runtime — good for a small, stable
  ABI. `cffi` (third-party) parses real C declarations and is sturdier for a substantial library. A compiled
  extension (hand-written C, Cython, pybind11) is for when you own the C side or need the speed. This is the
  parent's *"Use the standard vocabulary until evidence earns an escape."* applied to the FFI choice.
- **Declare every signature.** Set `argtypes` and `restype` on each `ctypes` function. An unset `restype`
  defaults to `c_int` and truncates a returned pointer on a 64-bit build — a use-after-free waiting to
  happen. The explicit declaration is what makes the assumption visible.
- **State who allocates and who frees, per call.** If C returns a pointer that C must free, wrap acquire and
  release in a context manager so the free runs on **every** path — the FFI face of *"MUST use a context
  manager for deterministic resource lifetime on every path"*. If Python owns a buffer passed into C, keep a
  reference to it alive for the whole call; `ctypes` does not track lifetime, and a buffer collected mid-call
  is a use-after-free.
- **Translate encoding and errors at the boundary.** C strings are bytes: `encode("utf-8")` on the way in,
  `decode` on the way out — never assume the platform default. Check the C return/`errno` and raise a Python
  exception at the adapter, so the interior sees Pythonic failures, not raw ints.
- **Make the GIL / free-threading assumption explicit.** At the 3.12 baseline the GIL is present;
  free-threading (PEP 703) is an experimental 3.13+ build, not the baseline. A `ctypes.CDLL` function
  releases the GIL around the call (`PyDLL` holds it), and a C callback into Python re-acquires it. Do not
  rely on the GIL to make a compound C-boundary operation atomic; if the native library keeps its own global
  state or threads, guard it, and document the adapter's thread-safety rather than assuming the GIL serializes
  it. Deep task/lock mechanics live in `concurrency.md`.

```python
import ctypes
from contextlib import contextmanager
from collections.abc import Iterator

_lib = ctypes.CDLL("libfoo.so")             # CDLL releases the GIL around each call
_lib.foo_open.argtypes = [ctypes.c_char_p]  # declare EVERY signature
_lib.foo_open.restype = ctypes.c_void_p     # else c_int truncates the pointer
_lib.foo_close.argtypes = [ctypes.c_void_p]
_lib.foo_close.restype = None

@contextmanager
def foo_handle(path: str) -> Iterator[int]:
    handle = _lib.foo_open(path.encode("utf-8"))   # encode at the boundary
    if not handle:                                  # translate the C failure
        raise OSError(f"foo_open failed for {path!r}")
    try:
        yield handle
    finally:
        _lib.foo_close(handle)                      # freed on EVERY path
```

## 3. The buffer protocol and memoryview

The buffer protocol is Python's zero-copy contract for sharing raw memory between objects — `bytes`,
`bytearray`, `array.array`, a native array — without copying. `memoryview(obj)` exposes it, and it is the
right tool for slicing or streaming a large binary buffer that a copy would double in memory.

- **A view is not a copy, and it pins its source.** `memoryview(buf)[1024:2048]` is a window onto `buf`, not
  new bytes. While the view lives it keeps the exporting object alive and pins its buffer — a live view on a
  `bytearray` blocks a resize with `BufferError`. Release it deterministically with a `with` block (or
  `mv.release()`) so the source can be freed or resized.
- **Never hand a caller a writable view of internal state.** Returning `memoryview(self._buf)` lets the caller
  mutate your object's private buffer — the buffer-protocol form of *"NEVER return a live mutable internal
  container"*. Return `bytes(mv)` (a copy) or `mv.toreadonly()` (a read-only view) instead; check `mv.readonly`
  when the writability matters.
- **Across the FFI boundary, ownership still rules.** A `memoryview` or a `ctypes` array passed into C gives
  zero-copy access, but the C side must not retain the pointer past the call unless Python guarantees the
  buffer's lifetime (§2). A retained pointer to a freed buffer is the same use-after-free from the other side.

```python
with memoryview(buffer) as view:   # release() on exit so the source can be freed/resized
    header = view[:8]              # a zero-copy slice, not a copy
    process(header)
```

## 4. Serialization and durable on-disk formats

Serialization crosses a boundary in time or between processes, so the same trust and durability rules apply
as any other boundary. (This section carries the interop depth for area 19; the parent floor states the
minimums.)

- **Never deserialize untrusted data with an executable format.** `pickle` runs arbitrary code on load (via
  `__reduce__`), and a permissive YAML `load` does the same — the mechanics behind *"NEVER ... unpickle or
  otherwise unsafely deserialize untrusted data"*. Reserve `pickle` for a trusted, same-version, local cache
  you fully own; for anything that crosses a trust boundary use an interoperable, non-executable format
  (JSON) and a safe loader (a YAML `safe_load`).
- **Validate the decoded structure.** JSON decodes to `dict`/`list`/`str`/`float`/`bool`/`None` — it does not
  give you your types. Narrow the decoded value into typed domain objects at the boundary (a `TypedDict` or
  dataclass adapter), the deserialization face of *"MUST narrow `Any` or untyped boundary data to a precise
  type at the boundary immediately"* — see `typing.md` § 6. Bound the input size first; an unbounded decode is
  a memory-exhaustion vector.
- **Replace a durable file atomically.** Write a temporary file in the **same directory**, flush and `fsync`
  it, then `os.replace(tmp, target)` — an atomic, overwriting rename on POSIX and Windows (unlike `os.rename`,
  which is not an atomic overwrite on Windows). This is the mechanics of *"MUST make persistence durable where
  correctness needs it"*; for crash durability, `fsync` the containing directory after the replace as well.
- **Version the format.** Write a version tag into the payload or header so an old reader detects a newer
  layout and fails loudly instead of misreading it. Keep serialized output deterministic — do not let it
  depend on `dict`/`set` iteration order — so a regeneration or a diff is meaningful.

```python
import json
import os
from pathlib import Path

def write_atomic(target: Path, body: dict[str, object]) -> None:
    tmp = target.with_suffix(target.suffix + ".tmp")
    payload = json.dumps({"version": 2, "body": body}, sort_keys=True)
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(payload)
        f.flush()
        os.fsync(f.fileno())   # durable before the rename
    os.replace(tmp, target)    # atomic, overwriting, cross-platform
```

## 5. Reflection, decorators, and callable metadata

Reflection reaches into a callable's internals; a decorator rewrites what the reflection sees. Both must
preserve the contract they wrap, and read metadata through supported APIs rather than private attributes.

- **Preserve identity with `functools.wraps`.** A wrapper without it reports itself as `wrapper` in
  tracebacks, `help()`, and `inspect` — the real function's `__name__`, `__qualname__`, `__doc__`,
  `__annotations__`, and `__wrapped__` are lost. `@functools.wraps(fn)` copies them and links `__wrapped__`
  back to the original.
- **Preserve the static signature with `ParamSpec`.** A decorator typed `Callable[..., Any]` erases the
  wrapped function's signature, so callers stop type-checking. Type it with a `ParamSpec` so the caller
  contract survives — the mechanics live in `typing.md` § 4.
- **Read metadata through the supported helpers, never raw attributes.** Use `inspect.signature(fn)` for
  parameters (it follows `__wrapped__`, so a `wraps`-decorated function reports its real signature) and
  `inspect.get_annotations(obj, eval_str=True)` or `typing.get_type_hints(obj)` for annotations — the reason
  *"NEVER ... read or mutate raw `__annotations__`"* exists. Raw `__annotations__`/`__defaults__` may be
  missing, hold unresolved strings, or skip inherited entries. Runtime-annotation depth and the 3.14
  `annotationlib` path are in `typing.md` § 7.
- **Give dynamic registration a discoverable, testable contract.** A registry — decorator-based
  `@register("name")` or entry-point-based (§7) — needs a declared name space, a documented `Protocol` each
  registered object must satisfy, a way to enumerate what is registered, and a test that asserts the
  registry's contents. A registry populated by import side effects is invisible and untestable, and it
  violates the parent's inert-import rule; prefer explicit registration or entry points.

```python
import functools
import inspect
from collections.abc import Callable

def audited[**P, R](fn: Callable[P, R]) -> Callable[P, R]:
    @functools.wraps(fn)                      # keep __name__, __doc__, __wrapped__, __qualname__
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        return fn(*args, **kwargs)
    return wrapper

sig = inspect.signature(audited(load))        # follows __wrapped__ to load's real signature
```

## 6. Generated code

Generated code is a build product, not source. The generator plus its input is the one authoritative home;
the output is derived — the reasoning behind *"NEVER hand-edit generated code"*, whose next regeneration
would silently overwrite any hand edit.

- **Quarantine it.** Keep generated files physically apart from hand-maintained ones (a `_generated/` package
  or a clear naming suffix), and open each with a header comment naming the generator and its input, so no
  reader mistakes it for source to edit.
- **Regenerate; never patch the output.** When generated code needs to change, change the generator or its
  input (a schema, a template) and regenerate. If the generator cannot be changed, apply a post-generation
  transform as an automated build step — never a by-hand edit that the next run erases.
- **Make regeneration deterministic and checked.** Pin the generator version and emit in a stable order (not
  `dict`/`set` iteration order) so a "regenerate and assert no diff" guard in CI is meaningful. Type-check and
  lint generated code like any shipped code — but fix a finding in the generator, not the file.

## 7. Plugins and dynamic import

A plugin loaded at runtime is code you did not write executing with your process's privileges. Discover it
through the packaging system and validate it before you trust it.

- **Discover through entry points.** `importlib.metadata.entry_points(group="myapp.plugins")` (the 3.12
  selectable API) enumerates plugins that installed distributions declared in their `pyproject.toml`
  `[project.entry-points]` — named, versioned, installed on purpose, not arbitrary paths. Declaring the entry
  points is `packaging.md`'s job.
- **Never import an arbitrary untrusted name.** `importlib.import_module(name)` or `__import__` on a name from
  untrusted input runs that module's top-level code — remote code execution, the same class of hole as
  *"NEVER `eval`/`exec` untrusted text"*. Gate every dynamic import behind an allowlist of known names and
  reject anything not on it; this is the mechanics of the parent's "gate dynamic import or plugin loading
  behind an allowlist" clause of *"MUST validate untrusted data before use and choose safe primitives"*.
- **Validate the loaded object before calling it.** `ep.load()` returns whatever the distribution declared —
  treat it as untrusted until checked. Verify it satisfies the expected contract (a `Protocol` check, required
  attributes, a version) and fail loudly if it does not. A `@runtime_checkable` `isinstance` check confirms
  method **presence only**, not signatures (`typing.md` § 5), so pair it with the checks that matter.
- **Entry points are not a sandbox.** Loading a plugin runs its code at your privileges; entry points assume
  the installed distribution is trusted because it was installed deliberately. Do not use them to run
  genuinely untrusted third-party code.

```python
from importlib.metadata import entry_points

ALLOWED_PLUGINS = {"csv_reader", "json_reader"}

for ep in entry_points(group="myapp.readers"):   # 3.12 selectable API
    if ep.name not in ALLOWED_PLUGINS:            # allowlist BEFORE load
        continue
    reader = ep.load()                            # imports and returns the object
    if not isinstance(reader, Reader):            # validate the contract before trusting it
        raise TypeError(f"plugin {ep.name!r} is not a Reader")
    register(ep.name, reader)
```

## 8. Notebooks and scripts to production modules

A notebook is an orchestration surface, not a home for reusable logic — the parent's *"MUST keep reusable
logic in importable, typed modules, not in a notebook or script body"*. Logic trapped in a cell cannot be
imported, type-checked, or tested.

- **Split the roles.** The reusable logic lives in an importable, typed module — functions with signatures,
  Google docstrings, and tests. The notebook or script orchestrates: it imports the module, seeds randomness,
  records the environment and inputs, runs the work, and displays results.
- **Make the run reproducible.** In the orchestrator, seed every RNG explicitly (the stdlib `random` and any
  numeric library in use), record the input and dependency versions, and pin what the result depends on. A
  cell that reads ambient state produces a result no one can reproduce.

**Productionization checklist** — turning notebook logic into a module:

1. Move each reusable function or class out of a cell into a module (under `src/` — see `packaging.md`).
2. Add parameter and return annotations plus Google docstrings; run the strict type checker to zero.
3. Replace hard-coded paths and constants with parameters parsed at the boundary.
4. Route execution through a typed `main` behind `if __name__ == "__main__"`, or a console entry point.
5. Add tests proportional to reuse and risk — the golden path plus the failure paths (`testing.md`).
6. Replace `print` and implicit cell display with a module logger at the handling boundary.
7. Remove notebook-only global state; pass state explicitly instead.

The notebook then imports the productionized module and only orchestrates — the same code runs in the
notebook and in production.
