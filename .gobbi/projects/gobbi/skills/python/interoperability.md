# Python — Interoperability

Child doc of the `python` skill: the deep reference for code that leaves ordinary Python and crosses a
boundary — a subprocess, a native/foreign library, the buffer protocol, a serialized or durable on-disk
format, generated code, reflection, a plugin, or a notebook on its way to production. The `SKILL.md` §
Procedure P2 router sends a reader here when a change touches one. An ordinary typed module needs none of it.

This doc **deepens, and does not restate,** the parent floor these boundaries touch: principle 6 (visible
lifetime, local mutation); H6 (no untrusted execute/deserialize, no shell-interpolation, no `random` for
security material); H8 (validate and bound boundary data, allowlist dynamic/plugin loading); H11 (atomic,
durable, versioned persistence); H16 (no hand-edited generated code); H17 (no live mutable internal
container); H18 (no raw `__annotations__`); and the *Delivery and evidence* default (each boundary behind a
documented adapter with a pure-Python reference; reusable logic in typed modules). Every construct is valid at
Python 3.12; tool names are examples.

**Every boundary is one adapter with the same five-part contract.** Design each as a single narrow adapter
that — narrowing the boundary surface per `final P9` — demands only the inputs it uses, in a signature the
caller can read, not an opaque aggregate. Build it bottom-up: fix the signature, ownership, encoding, and
error-translation, plus a pure-Python reference where feasible, *before* the native or dynamic body — the
reference is an oracle for the contract, not a byte-for-byte equality claim. The table is the index, the
sections the depth.

| Boundary | Input to validate / encode | Ownership / lifetime | Failure translation | Cleanup | Trust |
|---|---|---|---|---|---|
| Subprocess (§1) | arg list; `encoding="utf-8"` | child process | `check=True`→`CalledProcessError`; `timeout`→`TimeoutExpired` | `timeout` / `kill()` reaps | untrusted argv is injection |
| Native / FFI (§2) | `argtypes` / `restype`; `encode` / `decode` | who allocates vs frees, per call | check return / `errno` → Python exception | context manager, every path | wrong signature corrupts memory |
| Buffer / `memoryview` (§3) | — | a view pins its source | `BufferError` on live-view resize | `with` / `mv.release()` | no writable view of internals |
| Serialization (§4) | bound size; narrow to a typed object | payload owns a version tag | fail loudly on a newer layout | unlink the temp on failure | no executable format from untrusted |
| Reflection (§5) | `inspect`, not raw `__annotations__` | wrapper keeps the contract | — | — | supported helpers only |
| Generated code (§6) | the generator input | generator + input own output | CI `git diff --exit-code` | regenerate, never patch | never hand-edit |
| Plugin (§7) | allowlist the name before load | host-process privileges | reject a non-conforming object | — | runs at your privileges |
| Notebook → module (§8) | parameters parsed at the edge | the module owns the logic | — | — | seed and record |

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

A subprocess is a foreign program with its own encoding, exit convention, and failure modes.

- **Argument list, never a shell string.** `subprocess.run(["git", "log", "-1"])` invokes the program
  directly; `shell=True` splits on metacharacters, so untrusted text is command injection — `shlex.quote` is a
  last resort.
- **Text vs bytes explicit.** `stdout` / `stderr` are `bytes` by default; pass `encoding="utf-8"` (not a bare
  `text=True`, which uses the ambient locale), and keep binary output as `bytes` until a known decoding edge.
- **Bound with a timeout.** `run(..., timeout=T)` kills the child and raises `TimeoutExpired`; a raw `Popen`'s
  `communicate(timeout=T)` does **not** kill on expiry — `proc.kill()` then `proc.communicate()` to reap it.
- **Exit code deliberate.** `check=True` raises `CalledProcessError` (`returncode`, `stdout`, `stderr`) on any
  non-zero exit; inspect `returncode` instead when a non-zero code is an expected branch.
- **Capture vs stream.** `capture_output=True` buffers everything in memory — safe when bounded. To stream,
  read a `Popen` incrementally, avoiding the pipe-buffer deadlock (stdin fills while the child fills stdout) by
  letting `communicate()` pump both ends or reading the pipes concurrently.

```python
result = subprocess.run(
    ["git", "log", "-1", "--format=%H"],   # an argument LIST, never a shell string
    capture_output=True, encoding="utf-8", # explicit; do not inherit the locale
    timeout=30, check=True,                # bound the child; non-zero exit raises CalledProcessError
)
```

## 2. Native and foreign-function interfaces

Calling into a C library is the sharpest boundary: no type checker, no garbage collector, no exception on
misuse. Put the whole surface behind one narrow, documented adapter with a pure-Python reference, so the
native path is validated against it and disabled on an unsupported platform.

- **Route by need.** `ctypes` (stdlib) declares a C signature at runtime, for a small stable ABI; `cffi` parses
  real C declarations, for a substantial library; a compiled extension (C, Cython, pybind11) for when you own
  the C side or need the speed — principle 8's standard-vocabulary-until-evidence escape at the FFI choice.
- **Declare every signature.** Set `argtypes` and `restype` on each `ctypes` function; an unset `restype`
  defaults to `c_int` and truncates a returned pointer on a 64-bit build — a use-after-free.
- **Who allocates, who frees, per call.** A C-owned pointer's free runs in a context manager on **every** path;
  a Python-owned buffer passed into C stays referenced for the whole call — `ctypes` does not track lifetime,
  and a buffer collected mid-call is a use-after-free.
- **Translate at the boundary.** C strings are bytes: `encode("utf-8")` in, `decode` out. Check the return /
  `errno` and raise a Python exception, so the interior sees Pythonic failures.
- **GIL / free-threading explicit.** At 3.12 the GIL is present; free-threading (PEP 703) is an experimental
  3.13+ build. `ctypes.CDLL` releases the GIL around a call (`PyDLL` holds it), and a C callback re-acquires
  it. Never rely on the GIL for compound-operation atomicity; guard the native library's own global state and
  document thread-safety (`concurrency.md`).

```python
_lib = ctypes.CDLL("libfoo.so")             # CDLL releases the GIL around each call
_lib.foo_open.argtypes = [ctypes.c_char_p]  # declare EVERY signature
_lib.foo_open.restype = ctypes.c_void_p     # else c_int truncates the pointer

@contextmanager
def foo_handle(path: str) -> Iterator[int]:
    handle = _lib.foo_open(path.encode("utf-8"))    # encode at the boundary
    if not handle:
        raise OSError(f"foo_open failed for {path!r}")   # translate the C failure
    try:
        yield handle
    finally:
        _lib.foo_close(handle)                      # freed on EVERY path
```

## 3. The buffer protocol and memoryview

The buffer protocol shares raw memory between objects — `bytes`, `bytearray`, `array.array`, a native array —
without copying; `memoryview(obj)` exposes it, for slicing or streaming a large binary buffer a copy would
double in memory.

- **A view is not a copy; it pins its source.** `memoryview(buf)[1024:2048]` is a window onto `buf`, not new
  bytes; while it lives it pins the exporter, so a live view on a `bytearray` blocks a resize with
  `BufferError`. Release it with a `with` block or `mv.release()`.
- **Never return a writable view of internal state.** `memoryview(self._buf)` lets the caller mutate your
  private buffer — H17's buffer-protocol form. Return `bytes(mv)` (a copy) or `mv.toreadonly()`, and check
  `mv.readonly` when writability matters.
- **Across the FFI boundary, ownership still rules.** A `memoryview` or `ctypes` array passed into C is
  zero-copy, but C must not retain the pointer past the call unless Python guarantees the buffer's lifetime
  (§2) — a retained pointer to a freed buffer is the same use-after-free.

```python
with memoryview(buffer) as view:   # release() on exit so the source can be freed/resized
    header = view[:8]              # a zero-copy slice, not a copy
    process(header)
```

## 4. Serialization and durable on-disk formats

Serialization crosses a boundary in time or between processes, so the same trust and durability rules apply.

- **No executable format on untrusted data.** `pickle` runs arbitrary code on load (via `__reduce__`), as does
  a permissive YAML `load`; reserve `pickle` for a trusted, same-version, local cache you own, and across a
  trust boundary use a non-executable format (JSON) and a safe loader (YAML `safe_load`).
- **Validate the decoded structure.** JSON gives `dict` / `list` / `str` / `float` / `bool` / `None`, not your
  types; bound the input size first (an unbounded decode is a memory-exhaustion vector), then narrow the value
  into a typed domain object at the boundary (a `TypedDict` or dataclass adapter — H8; `typing.md` § 6).
- **Replace a durable file atomically.** Write a **unique** temp file in the same directory with
  `tempfile.mkstemp(dir=...)` (`O_EXCL`, so a predictable shared `.tmp` name cannot be clobbered by two writers
  or reuse a symlink); flush and `fsync` the temp, then `os.replace(tmp, target)` — an atomic, overwriting
  rename on POSIX and Windows (unlike `os.rename`, not an atomic overwrite on Windows). For crash durability on
  POSIX, `fsync` the containing directory after the replace; Windows has no directory-`fsync`. Remove the temp
  on any failure.
- **Version the format.** A version tag in the payload or header lets an old reader detect a newer layout and
  fail loudly; keep serialized output deterministic (`json.dumps(..., sort_keys=True)`), never dependent on
  `dict` / `set` iteration order.

```python
def write_atomic(target: Path, body: dict[str, object]) -> None:
    payload = json.dumps({"version": 2, "body": body}, sort_keys=True)
    fd, tmp = tempfile.mkstemp(dir=target.parent, suffix=".tmp")   # unique, same dir, O_EXCL
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(payload)
            f.flush()
            os.fsync(f.fileno())     # the temp's bytes are durable first
        os.replace(tmp, target)      # atomic, overwriting rename
    except BaseException:
        os.unlink(tmp)               # never leave an orphan temp behind
        raise
    dir_fd = os.open(target.parent, os.O_RDONLY)   # POSIX: fsync the dir so the rename survives a crash
    try:
        os.fsync(dir_fd)
    finally:
        os.close(dir_fd)
```

## 5. Reflection, decorators, and callable metadata

Reflection reads a callable's internals; a decorator rewrites what it sees. Both preserve the wrapped contract
and read metadata through supported APIs, not private attributes.

- **Preserve identity with `functools.wraps`.** Without it a wrapper introspects as `wrapper` — `help()`,
  `repr`, `__name__` / `__qualname__`, `__doc__`, `__annotations__` — with no `__wrapped__` link.
  `@functools.wraps(fn)` copies that metadata and links `__wrapped__`, so `inspect.signature` sees the real
  function; it does **not** rewrite the code object, so a raw traceback frame still shows `wrapper`.
- **Preserve the static signature with `ParamSpec`.** `Callable[..., Any]` erases the wrapped signature; a
  `ParamSpec` keeps the caller contract (`typing.md` § 4).
- **Read metadata through the supported helpers.** `inspect.signature(fn)` for parameters (follows
  `__wrapped__`), `inspect.get_annotations(obj, eval_str=True)` or `typing.get_type_hints(obj)` for annotations
  — the reason H18 exists. Raw `__annotations__` (or `__dict__["__annotations__"]`) can hold unresolved strings
  (under a future-import or forward ref), does not merge inherited class entries, and is absent on some
  callables (a plain function carries `{}` unannotated). The 3.14 `annotationlib` path is in `typing.md` § 7.
- **Dynamic registration needs a testable contract.** A registry — `@register("name")` or entry-point-based
  (§7) — needs a declared namespace, a documented `Protocol`, a way to enumerate what is registered, and a test
  of its contents. One populated by import side effects is invisible and untestable and violates the
  inert-import rule; prefer explicit registration or entry points.

```python
def audited[**P, R](fn: Callable[P, R]) -> Callable[P, R]:
    @functools.wraps(fn)                      # keep __name__, __doc__, __wrapped__, __qualname__
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        return fn(*args, **kwargs)
    return wrapper

sig = inspect.signature(audited(load))        # follows __wrapped__ to load's real signature
```

## 6. Generated code

Generated code is a build product; the generator plus its input is the one authoritative home — the reason for
H16, whose next regeneration overwrites any hand edit. Common generators: protobuf / gRPC emitting `*_pb2.py`,
a schema-to-model tool emitting dataclass or attrs models, a stub generator emitting `.pyi`, Cython emitting
`.c`.

- **Quarantine it.** Keep generated modules apart from hand-maintained ones (a `_generated/` package or a
  suffix like `*_pb2.py`), mark each with a `# @generated by <tool> from <input>` header, and exclude the tree
  from the formatter and linter in `pyproject.toml` (an `extend-exclude`).
- **Regenerate; never patch the output.** Change the generator or its input (the `.proto`, the JSON Schema, the
  template) and regenerate; if the generator cannot change, apply an automated post-generation `ast` /
  transform step, never a hand edit. For code you would otherwise generate by hand, prefer the stdlib's
  declarative generators — `dataclass`, `Enum`, `NamedTuple`, `dataclasses.make_dataclass`, `types.new_class` —
  over an `exec`-of-a-source-string, which reopens the `eval` / `exec` hole.
- **Deterministic and checked.** Pin the generator in the dev dependencies, emit in a stable order (not `dict`
  / `set` iteration order), and gate CI with a regenerate-and-`git diff --exit-code` step. Ship the generated
  types (`py.typed` or the generator's `.pyi` — `packaging.md` §7). Fix any type or lint finding in the
  generator, not the file.

## 7. Plugins and dynamic import

A plugin loaded at runtime is code you did not write executing at your process's privileges. Discover it
through the packaging system and validate it before you trust it.

- **Discover through entry points.** `importlib.metadata.entry_points(group="myapp.plugins")` (the selectable
  API, stable since 3.10) enumerates plugins that installed distributions declared in their `pyproject.toml`
  `[project.entry-points]` — named, versioned, installed on purpose (declaring them is `packaging.md` §6).
- **Never import an arbitrary untrusted name.** `importlib.import_module(name)` or `__import__` on an untrusted
  name runs that module's top-level code — remote code execution, the hole H6 bans. Gate every dynamic import
  behind an allowlist, checked against `ep.name` before load.
- **Validate the loaded object before calling it.** `ep.load()` returns whatever was declared — untrusted until
  checked; verify the contract (a `Protocol` check, required attributes, a version) and fail loudly.
  `isinstance` against a `Protocol` works **only** if it is `@runtime_checkable` (a plain `Protocol` raises
  `TypeError`), and even then confirms method **presence only**, not signatures (`typing.md` § 5) — pair it with
  a version or attribute check.
- **Entry points are not a sandbox.** A plugin runs at your privileges; use them only for deliberately
  installed, trusted distributions, not genuinely untrusted third-party code.

```python
@runtime_checkable
class Reader(Protocol):                            # runtime_checkable: the isinstance below is legal
    def read(self) -> bytes: ...

ALLOWED_PLUGINS = {"csv_reader", "json_reader"}

for ep in entry_points(group="myapp.readers"):     # the selectable API (3.10+)
    if ep.name not in ALLOWED_PLUGINS:             # allowlist BEFORE load
        continue
    reader = ep.load()                             # imports and returns the object
    if not isinstance(reader, Reader):             # presence-only check; pair with a version check
        raise TypeError(f"plugin {ep.name!r} is not a Reader")
    register(ep.name, reader)
```

## 8. Notebooks and scripts to production modules

A notebook is an orchestration surface, not a home for reusable logic — the parent's rule that reusable logic
lives in importable, typed modules, not a notebook or script body. Logic trapped in a cell cannot be imported,
type-checked, or tested.

- **Split the roles.** Reusable logic lives in an importable, typed module (functions with signatures, Google
  docstrings, tests); the notebook or script orchestrates — imports the module, seeds randomness, records the
  environment and inputs, runs, and displays results.
- **Make the run reproducible.** Seed every RNG (the stdlib `random` and any numeric library), record the input
  and dependency versions, and pin what the result depends on — a cell that reads ambient state is not
  reproducible.

**Productionization checklist** — turning notebook logic into a module:

1. Move each reusable function or class out of a cell into a module (under `src/` — see `packaging.md`).
2. Add parameter and return annotations plus Google docstrings; run the strict type checker to zero.
3. Replace hard-coded paths and constants with parameters parsed at the boundary.
4. Route execution through a typed `main` behind `if __name__ == "__main__"`, or a console entry point.
5. Add tests proportional to reuse and risk — the golden path plus the failure paths (`testing.md`).
6. Replace `print` and implicit cell display with a module logger at the handling boundary.
7. Remove notebook-only global state; pass state explicitly instead.

The notebook then imports the productionized module and only orchestrates — the same code runs in the notebook
and in production.
