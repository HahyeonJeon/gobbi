# Python — Testing

Child doc of the `python` skill: the deep reference for testing Python 3.12 code. The `SKILL.md` § Procedure
P2 router sends a reader here when behavior changes, or tests are written or reviewed. A no-behavior-change
edit needs none of this — the parent floor carries the common path.

This doc **deepens, and does not restate,** the parent test floor: the *Delivery and evidence* judgment
default (cover golden, edge, failure, and adversarial cases; assert returns, exception type and message, and
visible effects; make time, randomness, and concurrency deterministic; substitute at a real boundary, not
private choreography; give every `skip`/`xfail` a tracked reason and re-enable condition; reproduce a defect
with a failing test) and H15 (verify a shipped distribution from built artifacts in a clean environment). The
installed-artifact side is shared with `packaging.md`: §10 owns the test side, `packaging.md` §9 the build
side.

Each section separates the **portable testing property** (behavior-oriented, isolated, deterministic) from the
**pytest mechanism** that expresses it — stated once here, not re-prefaced per section — so the discipline
transfers to `unittest` or another runner where the API differs. pytest is the named example, not a lock. Build
the suite bottom-up with each vertical slice: the golden/contract case first, then edge, failure, and
adversarial cases as the slice grows those paths.

## Contents

1. [Behavior over implementation](#1-behavior-over-implementation)
2. [Test layout, discovery, and IDs](#2-test-layout-discovery-and-ids)
3. [Fixtures and lifecycle](#3-fixtures-and-lifecycle)
4. [Parametrize a contract](#4-parametrize-a-contract)
5. [Assert on exceptions and effects](#5-assert-on-exceptions-and-effects)
6. [Boundary substitution and mocking](#6-boundary-substitution-and-mocking)
7. [Determinism: time, randomness, concurrency](#7-determinism-time-randomness-concurrency)
8. [Async tests](#8-async-tests)
9. [Regression-first, property, and coverage](#9-regression-first-property-and-coverage)
10. [Test the installed artifact](#10-test-the-installed-artifact)

---

## 1. Behavior over implementation

Assert observable behavior, read through Python's own surfaces:

- the return value;
- the raised exception's *type and message* via `pytest.raises(..., match=...)` (§5);
- an effect read back from its boundary — a file under the temp-path fixture (§6), `caplog` records,
  `capsys`-captured `stdout`/`stderr`, or a fake transport's recorded calls (§6).

Never assert a private call order, an internal attribute, or a "logger `.info` was called" — a test bound to
internal structure breaks on every refactor. Name one behavior per test, one call to the act:
`test_parse_rejects_unknown_key`, not `test_parse_2`.

Cover the four case kinds: **golden** (a normal input and its result); **edge** (`""`, `0`, empty
`list`/`dict`, the boundary and one past it, the largest realistic input); **failure** (an input that must
raise, pinned by type *and* message — §5); **adversarial** (trust-boundary footguns a boundary must reject — a
path-traversal `Path`, a zip bomb, an oversized payload, a malformed encoding, an untrusted pickle — §9).

## 2. Test layout, discovery, and IDs

- **Tests live outside the package and import it by its installed name.** Keep a top-level `tests/` tree that
  mirrors the package. With the parent's `src/` layout (`packaging.md` §3) tests exercise the module a user
  gets, not a checkout-root sibling.
- **Discovery is convention-based.** Pytest collects `test_*.py` files, `test_*` functions, and `Test*` classes
  with no `__init__`, and rewrites a plain `assert` to report its operands — no assertion vocabulary to learn.
  Stdlib `unittest` instead subclasses `TestCase` and calls `self.assertEqual(...)`. Name the runner in config.
- **Prefer pytest's `importlib` import mode** — test modules need no `__init__.py`, and two files may share a
  short name in different directories without a clash. The older prepend-`sys.path` mode couples discovery to
  layout and collides on duplicate basenames. The portable requirement is installed-name resolution, not the
  flag.
- **Give each case a stable, readable ID** — pytest's `ids=` (§4) makes a failure read `test_parse[empty-body]`,
  not `test_parse[input3]`, so a reviewer can re-run one case by name.

## 3. Fixtures and lifecycle

A test owns its dependencies' setup and teardown, keeps them isolated, and tears them down even on failure.
Pytest uses **fixtures**; `unittest` uses `setUp`/`tearDown` and `addCleanup`.

- **A fixture `yield`s the resource and tears down after the `yield`** — teardown runs even when the test
  fails, the deterministic-lifetime discipline the parent applies with context managers.
- **Choose the narrowest correct scope.** Function scope (a fresh instance per test) is the default. Widen to
  module or session scope only for an expensive, immutable, read-only resource (a built binary, a read-only
  server); a wide scope handing out *mutable* state leaks one test's mutation into the next.
- **Never make a mutable fixture `autouse` at session/module scope** — seeding shared mutable state (a cache, a
  registry, a store) couples every test to execution order. Use function scope, or reset in teardown.
- **Return a factory fixture** when a test needs several instances or per-case configuration — a callable that
  builds on demand and records each for teardown.
- **Share through the nearest `conftest.py`;** the runner injects it by parameter name with no import. Keep
  fixtures thin: assertions and branches belong in tests.

## 4. Parametrize a contract

One test asserts a contract over a case table rather than copies of the body — pytest's
`@pytest.mark.parametrize`, `unittest`'s `subTest`. Ten cases report ten independent results.

```python
import pytest

@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        pytest.param("1", 1, id="digits"),
        pytest.param("-1", -1, id="negative"),
        pytest.param("  2  ", 2, id="surrounding-space"),
    ],
)
def test_parse_int(raw: str, expected: int) -> None:
    assert parse_int(raw) == expected
```

- **Give every case an explicit `id`** (§2) so a failure names it and a new row does not renumber the others.
- **Keep each row an immutable literal.** A row sharing a mutable object across cases (a list built once at
  import) is the mutable-default footgun in the table. Build per-case state in the test or a factory fixture.
- **Parametrize failures too** — a `(input, expected_exception)` table drives the same body through §5's
  `raises`.
- **Do not let the table become a hidden property test** — hundreds of generated rows are slow and opaque; use
  a property engine (§9) for a "holds for all inputs" claim.
- **Give every `skip`/`xfail` a tracked reason and a falsifiable re-enable condition** — a marker is runner
  config, and an untracked skip silently stops proving its contract.

## 5. Assert on exceptions and effects

- **Pin a failure by type *and* message,** so the wrong error of the right class cannot pass:

  ```python
  with pytest.raises(ValueError, match=r"unknown key: 'mode'"):
      parse(config)
  ```

  `match` is a regex over the exception's string form; anchor or escape it when the message has regex
  metacharacters. Type alone lets an unrelated `ValueError` pass. (`unittest`'s `assertRaisesRegex` expresses
  the same property.)
- **Bind it to inspect** — `with pytest.raises(HttpError) as exc_info:`, then assert `exc_info.value.status`, or
  `exc_info.value.__cause__` when the contract is a boundary translating the error with `raise ... from`.
- **Assert a warning** with the runner's warning-capture context. A `DeprecationWarning` is public behavior
  under H13 (`packaging.md` §8), to test rather than suppress.
- **Assert an effect by its result** — read the written file, the `caplog` records, or the fake transport's
  requests. Capturing output is behavior; "`.info` was called" is choreography (§6).

## 6. Boundary substitution and mocking

Substitute the external boundary — I/O, network, clock, randomness, a third-party service, the filesystem edge
— and run the real code for everything the test proves.

- **Use `tmp_path` for any filesystem test** — a unique empty directory per test, so cases never collide. Rely
  on the *isolation*, not eager deletion: pytest keeps the last few run directories for post-mortem and reaps
  older ones itself. Never write to a hard-coded `/tmp` path or into the repo.
- **Patch ambient state only through an auto-restoring scope.** Pytest's `monkeypatch` sets an environment
  variable, a `sys.path` entry, an attribute, or the working directory and undoes it (`unittest` uses
  `mock.patch` as a context manager, or `addCleanup`). A manual `os.environ[...] = ...` with no restoration
  leaks into the next test.
- **Patch at the external boundary, not inside the unit** — the network client, clock, or filesystem edge, not
  a helper the unit calls internally, which would make the test assert private structure. Patch by the *used*
  location (the name in the module that looks it up), not the definition.
- **Prefer injecting a fake over patching.** A unit that receives its collaborators needs no patch; a unit hard
  to substitute is asking for a seam, not more patches — many patches to run one test is that design signal.
- **Prefer a fake over a call-asserting mock** — a small working stand-in (an in-memory store, a recording
  transport) lets the test assert the observable result. If a mock is unavoidable, assert the effect it
  recorded: `assert transport.sent == [expected_request]`, not `assert helper.call_count == 3` (internal
  structure, the anti-pattern).

## 7. Determinism: time, randomness, concurrency

Every nondeterministic input is injected or frozen — the *"make time, randomness, and concurrency
deterministic"* clause of the parent floor.

- **Time:** never call the real wall clock in the unit. Take `now` (or a clock callable) as a parameter, or
  patch one time source at the boundary. Freeze it for a timestamped output; advance it to test a timeout;
  measure durations against a monotonic source the test controls.
- **Randomness:** seed or inject the generator. Production draws security material from `secrets`, but a test
  injects a fixed token rather than seeding `secrets`. A failing property case (§9) prints its seed for exact
  reruns.
- **Concurrency:** control the schedule — await a specific completion order or condition, a barrier, or an
  injected single-worker executor — and assert the aggregate result, not the interleaving. Replace a
  sleep-and-hope with an awaited condition, and bound every concurrent test with a timeout so a hang fails
  fast.

## 8. Async tests

- **Drive `async def` code through the framework's async support** (a plugin or built-in async mode) so the
  runner owns the event loop; do not spin up your own loop. Name the mode in config, not by autodetection.
- **Await the unit and assert its result.** For a `TaskGroup`, drive one child to fail, then assert the sibling
  was cancelled and the `ExceptionGroup` surfaced.
- **Substitute an async boundary with an async fake** (a method that is `async def`), and use an `async with`
  fixture for a resource whose teardown must be awaited.
- **Assert timeout behavior by injecting a deadline and a slow fake,** then asserting `TimeoutError` — never by
  waiting real seconds.

## 9. Regression-first, property, and coverage

- **Reproduce a reported defect with a failing test before the fix.** It must fail on current code for the
  defect's reason, then pass after the fix — proving the change targets the real cause and guarding against
  return. A test that is already green, or fails for a different reason, does not reproduce the defect.
- **Property tests assert an invariant over generated inputs** — a round-trip (`decode(encode(x)) == x`),
  idempotence, ordering, or never-raises-on-valid-input — letting an engine search where a hand table misses. A
  good engine shrinks a failing case and prints its seed for a deterministic rerun. Reach for one when the
  claim ranges over an input space.
- **Fuzz parsers and trust boundaries** with malformed, hostile bytes; require a declared exception, not a
  crash, hang, or execution of the input.
- **Coverage is a gap-finder, not a score.** Read the report for an untested branch or failure path, then add
  the missing *behavioral* test. A percentage target invites tests that execute lines without asserting; aim at
  "which contract has no test."

## 10. Test the installed artifact

- **Test the built, installed artifact, not the checkout.** A source-tree suite hides undeclared package data,
  a missing dependency, or a checkout-only entry point — each passes at source and fails for a user. The
  clean-environment wheel install catches them (H15); `packaging.md` §9 owns the build and install.
- **Run the suite twice** — against source for the fast inner loop, and against the installed wheel in CI. An
  editable install shares the source tree, so it does NOT prove the packaged artifact. Keep the clean
  environment free of dev dependencies beyond the runner, so an undeclared runtime import cannot succeed by
  accident.
- **Smoke-test the distribution's claims** — import each public name by the installed package name, and run
  each declared console command through its generated launcher as an installed entry point (`packaging.md`
  §6–§7).
