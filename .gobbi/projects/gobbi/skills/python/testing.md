# Python — Testing

Child doc of the `python` skill: the deep reference for testing Python code at the 3.12 baseline. The
`SKILL.md` § Procedure P5 router sends a reader here when behavior changes, or when tests are written or
reviewed. An ordinary change that alters no behavior needs none of this — the parent floor already carries
the common path.

This doc **deepens, and does not restate,** the parent rule *"MUST test behavior across golden, edge,
failure, and adversarial cases"* and the two anti-patterns *"NEVER mock the unit under test or assert its
private choreography"* and *"NEVER skip or `xfail` a test without a tracked reason and a falsifiable
re-enable condition"*. The installed-artifact anti-pattern *"NEVER test only the checkout when shipping a
package"* is shared with `packaging.md`; §11 owns the test side and `packaging.md` owns the build side. Those
rules are the floor; the sections below give the mechanics. Every construct here is valid at Python 3.12.
The sections teach the **pytest-shaped** idiom — pytest is the dominant Python test runner and the named
example throughout — but pytest is not a lock. Each section separates the **portable testing property**
(behavior-oriented, isolated resources, deterministic) from the **pytest mechanism** that expresses it, so
the discipline transfers to `unittest` or another runner even where the concrete API differs. Tool names (a
test runner, a property engine, a coverage tool) are examples.

## Contents

1. [Behavior over implementation](#1-behavior-over-implementation)
2. [Test layout, discovery, and IDs](#2-test-layout-discovery-and-ids)
3. [Fixtures and lifecycle](#3-fixtures-and-lifecycle)
4. [Parametrize a contract](#4-parametrize-a-contract)
5. [Assert on exceptions and effects](#5-assert-on-exceptions-and-effects)
6. [Temporary resources and boundary substitution](#6-temporary-resources-and-boundary-substitution)
7. [Determinism: time, randomness, concurrency](#7-determinism-time-randomness-concurrency)
8. [Async tests](#8-async-tests)
9. [Mocking discipline](#9-mocking-discipline)
10. [Regression-first, property, and coverage](#10-regression-first-property-and-coverage)
11. [Test the installed artifact](#11-test-the-installed-artifact)

---

## 1. Behavior over implementation

The parent floor already states the property — *assert observable behavior ... rather than internal steps*.
This section deepens it by naming the concrete Python surfaces through which "observable" is read, so a test
in Python asserts an outcome rather than a private step.

- **Observe through Python's own surfaces** — the return value; the raised exception's *type and message* via
  `pytest.raises(..., match=...)` (§5); or a recorded effect read back from where Python put it — a file
  under the temp-path fixture (§6), captured log records (`caplog`), captured `stdout` / `stderr` (`capsys`),
  or a fake transport's recorded calls (§9). Never assert a private call order or an internal attribute: a
  test bound to internal structure breaks on every refactor and proves nothing about behavior.
- **Cover the four kinds with Python-concrete probes** — **golden** (an expected input and its correct
  output); **edge** (`""`, `0`, an empty `list` / `dict`, the boundary and one past it, the largest realistic
  input); **failure** (an input that must raise, pinned by exception type *and* message — §5); and
  **adversarial** (the Python trust-boundary footguns a boundary must reject — a path-traversal `Path`, a zip
  bomb, an oversized payload, a malformed encoding, an untrusted pickle — §10).
- **One assertion of behavior per test,** named for that behavior — `test_parse_rejects_unknown_key`, not
  `test_parse_2` — with the act a single call so the assertion pins exactly one operation.

## 2. Test layout, discovery, and IDs

- **Portable property — tests live outside the package and import it by its installed name.** Keep a
  top-level `tests/` tree that mirrors the package. With the parent's `src/` layout (`packaging.md` §3) the
  tests import the package as installed, so they exercise the module a user gets, not a sibling directory that
  only resolves from the checkout root. This holds for any runner.
- **Pytest mechanism — convention-based discovery and rewritten asserts.** Pytest (the example runner)
  collects `test_*.py` files, `test_*` functions, and `Test*` classes with no `__init__`, and rewrites a plain
  `assert` to report its operands — so a test is a plain function with a plain `assert`, no assertion
  vocabulary to learn. This is pytest's convention, not a universal contract: stdlib `unittest` instead
  subclasses `TestCase` and calls `self.assertEqual(...)`. Name the runner in config and follow its discovery
  rules; the *portable* part is the isolated `tests/` tree above, not the discovery protocol.
- **Prefer pytest's `importlib` import mode.** With it, test modules need no `__init__.py`, and two test files
  may share a short name in different directories without a package clash. The older prepend-`sys.path` mode
  couples discovery to directory layout and collides on duplicate basenames. (An import-mode choice is a
  pytest setting; the property it serves — a test module resolves the *installed* package, not the source
  tree — is what any runner must preserve.)
- **Give each case a stable, readable ID.** A readable identifier per case is the portable goal; pytest
  expresses it with an explicit `ids=` on a parametrized test (§4) so a failure reads `test_parse[empty-body]`,
  not `test_parse[input3]`, and a reviewer can re-run one case by name.

## 3. Fixtures and lifecycle

The portable property: a test owns its dependencies' setup and teardown, keeps them isolated, and tears them
down even when the test fails. Pytest expresses this with **fixtures**; stdlib `unittest` expresses the same
property with `setUp` / `tearDown` and `addCleanup`. The mechanics below are pytest's form of it.

- **A fixture owns setup and teardown.** Prefer a fixture that `yield`s the resource and runs teardown after
  the `yield` — the teardown runs even when the test fails, the same deterministic-lifetime discipline the
  parent applies to production resources with context managers.
- **Choose the narrowest correct scope.** Function scope is the default: a fresh instance per test keeps
  cases independent. Widen to module or session scope only for an expensive, immutable, read-only resource (a
  built binary, a started read-only server). A wide scope that hands out *mutable* state leaks one test's
  mutation into the next and makes failures order-dependent.
- **Never make a mutable fixture `autouse` at session or module scope.** An autouse fixture that seeds shared
  mutable state (a cache, a global registry, a populated store) couples every test to execution order — the
  parent's shared-mutation footgun (*"Prefer values and transformations over shared mutation"*), surfaced
  inside the suite. Fix: function scope, or reset the state in teardown.
- **Return a factory when a test needs several, or a per-case configuration.** A factory fixture yields a
  callable that builds the resource on demand and records each one for teardown, instead of yielding a single
  fixed instance.
- **Share a fixture through the nearest `conftest.py`;** the runner injects it by parameter name with no
  import. Keep fixtures thin — a fixture that hides assertions or branches is test logic in disguise.

## 4. Parametrize a contract

The portable property is one test that asserts a contract over a case table rather than copies of the body;
pytest expresses it with `@pytest.mark.parametrize` (below), `unittest` with `subTest`. One test with ten
cases reports ten independent results and documents the contract's domain in one place.

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

- **Give every case an explicit `id`** (§2) so a failure names the case.
- **Keep each case row an immutable literal.** A row that shares a mutable object across cases (a list built
  once at import) is the mutable-default footgun in the case table — one case's mutation corrupts the next.
  Build per-case state in the test or a factory fixture (§3).
- **Parametrize the failure cases too:** a table of `(input, expected_exception)` drives the same body
  through §5's `raises` assertion.
- **Do not let the table become an accidental property test** — a body run over hundreds of generated rows is
  slow and opaque. For a true "holds for all inputs" claim, use a property engine (§10).

## 5. Assert on exceptions and effects

- **Assert a failure by type *and* message,** so a test cannot pass on the wrong error that happens to be the
  right class:

  ```python
  with pytest.raises(ValueError, match=r"unknown key: 'mode'"):
      parse(config)
  ```

  `match` is a regex searched against the string form of the exception; anchor or escape it when the message
  contains regex metacharacters. Asserting the type alone lets an unrelated `ValueError` satisfy the test.
  (`pytest.raises` is the example; `unittest` spells the same assertion `assertRaisesRegex` — the property is
  pinning type *and* message together.)
- **Bind the exception to inspect it** — `with pytest.raises(HttpError) as exc_info:`, then assert on
  `exc_info.value.status`. Assert on the chained cause (`exc_info.value.__cause__`) when the contract is that
  a boundary translated the error with `raise ... from` (the parent's exception-chaining rule).
- **Assert a warning the same way** with the runner's warning-capture context. A `DeprecationWarning` is part
  of the *"MUST evolve a documented public API deliberately"* contract (`packaging.md` §8), so its emission is
  a behavior to test, not noise to silence.
- **Assert an effect by its result, not the call that produced it.** After the unit runs, read the file it
  wrote, inspect the captured log records, or check the fake transport's recorded requests. Capturing
  output or log records is asserting behavior; asserting "the logger's `.info` was called" is asserting
  choreography — prefer the former (§9).

## 6. Temporary resources and boundary substitution

- **Use a temp-path fixture for any filesystem test** — it hands each test a unique empty directory, so cases
  never collide. Pytest's `tmp_path` is the example; the guarantee to rely on is the *isolation* (a fresh
  directory per test), not eager deletion — pytest keeps the last few test-run directories on disk for
  post-mortem and reaps the older ones itself. Never write to a hard-coded `/tmp` path or into the repo tree.
- **Substitute an ambient dependency only through a scoped, auto-restoring patch.** The portable property is
  that the patch reverts at test end; pytest's `monkeypatch` fixture is the example — it sets an environment
  variable, a `sys.path` entry, an attribute, or the working directory and undoes it automatically (`unittest`
  uses `mock.patch` as a context manager or `addCleanup`). A manual `os.environ[...] = ...` with no
  restoration leaks into the next test.
- **Patch at the external boundary, never inside the unit under test.** Replace the network client, the
  clock, or the filesystem edge — the seams built for substitution — not a helper the unit calls internally.
  Patching an internal function is the *"NEVER mock the unit under test"* anti-pattern: the test then asserts
  the unit's private structure.
- **Prefer injecting a fake through the unit's own parameter over patching a module global.** A unit that
  receives its collaborators needs no patch at all — the test passes a stand-in directly, and a unit that is
  hard to substitute is telling you to add a seam, not to patch harder.

## 7. Determinism: time, randomness, concurrency

A test must give the same verdict on every run and every machine. Any nondeterministic input is injected or
frozen — the *"make time, randomness, and concurrency deterministic"* clause of the parent testing floor.

- **Time:** never call the real wall clock in the unit under test. Take `now` (or a clock callable) as a
  parameter, or patch the single time source at the boundary, so a test pins the instant. Freeze it to assert
  a timestamped output; advance it explicitly to test a timeout. Measure durations against a monotonic source
  the test controls (the parent's time-boundary rule).
- **Randomness:** seed the generator, or inject it, so a "random" choice is reproducible. Production draws
  security material from `secrets` (the parent's rule), but a test injects a fixed token through the boundary
  rather than seeding `secrets`. A failing property case (§10) prints its seed so the exact case re-runs.
- **Concurrency:** make a concurrent test deterministic by controlling the schedule — await a specific
  completion order, use a barrier or an injected single-worker executor, and assert the aggregate result, not
  the interleaving. A test that sleeps and hopes is flaky; replace the sleep with an awaited condition. Bound
  every concurrent test with a timeout so a hang fails fast instead of blocking the suite.

## 8. Async tests

- **Drive `async def` code through the framework's async support** (a plugin or a built-in async mode) so the
  runner owns the event loop; do not spin up your own loop per test. Name the mode explicitly in config
  rather than relying on autodetection.
- **Await the unit and assert on its result.** For code that owns tasks with a `TaskGroup` (the parent's
  structured-concurrency rule), assert the group's aggregate outcome and that cancellation propagated — drive
  one child to fail, then assert the sibling was cancelled and the `ExceptionGroup` surfaced.
- **Substitute an async boundary with an async fake** (an object whose method is `async def`), and use an
  `async with` fixture for an async resource so teardown awaits.
- **Assert timeout behavior by injecting a deadline and a slow fake,** then asserting the `TimeoutError` —
  never by making the test wait real seconds.

## 9. Mocking discipline

- **Fake the boundary, never the unit under test.** Substitute I/O, the network, the clock, randomness, and a
  third-party service — the edges. Exercise the real code for everything the test is meant to prove. This is
  the whole of *"NEVER mock the unit under test or assert its private choreography"*.
- **Prefer a fake over a call-asserting mock.** A fake is a small working stand-in — an in-memory store, a
  recording transport — that lets the test assert the observable result. A mock that verifies call sequences
  drifts toward asserting choreography.
- **When you must use a mock, assert the effect it recorded, not the call sequence.** `assert transport.sent
  == [expected_request]` tests behavior; `assert helper.call_count == 3` tests internal structure and is the
  anti-pattern.
- **Patch by the used location, not the definition** — replace the name in the module that looks it up, or
  better, inject the collaborator so no patch is needed.
- **Many patches to run one test is a design signal.** The unit is reaching for its dependencies instead of
  receiving them; the fix is a seam in the design, not more patches.

## 10. Regression-first, property, and coverage

- **Reproduce a reported defect with a failing test before the fix.** The test must fail on the current code
  for the defect's reason, then pass after the fix — this proves the change targets the defect's real cause
  and guards it from returning. A fix committed with no failing-first test proves neither.
- **Property tests assert an invariant over generated inputs** — a round-trip (`decode(encode(x)) == x`), an
  idempotence, an ordering, a never-raises-on-valid-input claim — letting an engine search the input space a
  hand-written table misses. A good engine shrinks a failing case to its minimal form and prints the seed so
  it re-runs deterministically. Reach for one when the contract is "holds for all inputs of this shape," not a
  fixed set.
- **Fuzz the parsers and the trust boundaries.** Feed malformed and hostile bytes and assert the code raises a
  declared exception rather than crashing, hanging, or executing the input — the test side of the parent's
  validate-untrusted-data rule.
- **Coverage is a gap-finder, not a score.** Read a coverage report to find an untested branch or an
  unexercised failure path, then write the missing *behavioral* test. A coverage percentage as a target
  invites tests that execute lines without asserting anything — high coverage with no assertions proves
  nothing. Aim the tool at "which contract has no test," never at a number.

## 11. Test the installed artifact

- **Test against the built, installed artifact, not the checkout.** A suite that imports the source tree still
  lies about the distribution: undeclared package data, a missing dependency, or an entry point that only
  resolves from the checkout all pass against the source and fail for a user. Installing the wheel into a
  clean environment catches them. This is the test side of *"NEVER test only the checkout when shipping a
  package"*; `packaging.md` §9–§10 own building the wheel and the clean-environment install.
- **Run the suite twice:** once against the source for the fast inner loop, and once against the installed
  wheel in CI. An editable install shares the source tree, so it does NOT prove the packaged artifact — only
  the clean install does (`packaging.md` §9).
- **Smoke-test the distribution's own claims** — import each public name by the installed package name, and
  run each declared console command as an installed entry point (`packaging.md` §6–§7) — so the wheel's claims
  are verified by the tests, not assumed.
