# Python — Packaging and Distribution

Child doc of the `python` skill: the deep reference for turning a Python project into an installable,
distributable artifact at the 3.12 baseline. The `SKILL.md` § Procedure P2 router sends a reader here when a
project, package, or CLI is created; when metadata, dependencies, entry points, build, or distribution
change; or when a documented public API is deprecated or evolved. An ordinary edit to an existing package
needs none of this — the parent floor already carries the common path.

This doc **deepens, and does not restate,** the parent rules *"MUST ship a distributable project from a
`src/` layout with a `pyproject.toml`"* and *"MUST evolve a documented public API deliberately"*. The
installed-artifact anti-pattern *"NEVER test only the checkout when shipping a package"* is shared with
`testing.md`; §9–§10 own the build-and-install side and `testing.md` owns the suite side. Those rules are the
floor; the sections below give the mechanics. Every construct here targets Python 3.12; tool names (a build
backend, a build frontend, an installer, a publish tool) are examples, never a lock.

## Contents

1. [The `pyproject.toml` center](#1-the-pyprojecttoml-center)
2. [The build system: backend and frontend](#2-the-build-system-backend-and-frontend)
3. [The `src/` layout and import safety](#3-the-src-layout-and-import-safety)
4. [Project metadata and the Python floor](#4-project-metadata-and-the-python-floor)
5. [Dependencies: runtime, extras, and groups](#5-dependencies-runtime-extras-and-groups)
6. [Entry points and console scripts](#6-entry-points-and-console-scripts)
7. [Package data, inclusion, and `py.typed`](#7-package-data-inclusion-and-pytyped)
8. [Versioning](#8-versioning)
9. [Editable installs vs the built artifact](#9-editable-installs-vs-the-built-artifact)
10. [Verify the artifact in a clean environment](#10-verify-the-artifact-in-a-clean-environment)
11. [The publish boundary](#11-the-publish-boundary)

---

## 1. The `pyproject.toml` center

- **One standardized file is the center for build config and metadata.** A modern pure-Python project needs
  no `setup.py` and no `setup.cfg`; `pyproject.toml` is the standardized home for the build system and the
  project metadata. Two tables are the core: `[build-system]` names *how* the project is built, and
  `[project]` (PEP 621) declares its standardized metadata. Auxiliary inputs still live in their own files
  where a backend or tool needs them — an sdist `MANIFEST.in` (§7), a lock or constraints file, or a native
  build backend's own build script — so "center" does not mean "only file."
- **`[build-system]` is read first by a build frontend** — it lists the `requires` needed to build and the
  `build-backend` entry point. Keep it minimal:

  ```toml
  [build-system]
  requires = ["hatchling"]
  build-backend = "hatchling.build"
  ```

- **`[project]` holds the metadata every installer and index consumes** — `name`, `version` (or `dynamic =
  ["version"]`, §8), `description`, `readme`, `requires-python` (§4), `dependencies` (§5),
  `[project.optional-dependencies]`, `[project.scripts]` (§6), authors, license, and classifiers. A
  backend-specific `[tool.<backend>]` table configures only what PEP 621 does not standardize (file
  inclusion, dynamic version source).
- **Keep tool configuration here where the tool reads it** — `[tool.ruff]`, `[tool.mypy]`,
  `[tool.pytest.ini_options]`. Most modern tools read their config from a `[tool.<name>]` table, so one file
  declares the build, the metadata, and most tooling; a tool that does not read `pyproject.toml` keeps its own
  config file. The tool names are examples; consolidating the config that CAN live here is the convention.

## 2. The build system: backend and frontend

- **Separate the two roles.** A **build backend** is the library that turns source into a wheel and an sdist
  (it implements the PEP 517 hooks). A **build frontend** is the tool a developer runs: it reads
  `[build-system]`, installs the backend into an isolated environment, and calls it. Never invoke a backend
  directly — go through the frontend so the build is reproducible.
- **The backend is a choice with sane defaults.** Hatchling, setuptools, Flit, and PDM-backend are examples;
  pick one and let it own the build, and do not mix two. A pure-Python package needs no `setup.py` under any
  of them.
- **Build both distributions with the standard frontend invocation:**

  ```console
  $ python -m build
  ```

  This produces a **wheel** (`.whl`) and a **source distribution** (`.tar.gz`) in `dist/`. Build in isolation
  (the frontend's default) so the build cannot silently depend on a package that merely happens to be in your
  dev environment.
- **Ship both artifacts.** A wheel is the prebuilt artifact an installer prefers; an sdist is the buildable
  source fallback an index also needs. Some consumers and mirrors require the sdist, so publishing only the
  wheel is incomplete.

## 3. The `src/` layout and import safety

- **Place the importable package under a top-level `src/` directory** — `src/mypkg/__init__.py` — so the
  package is NOT importable from the project root. This is the parent's *"`src/` layout"* rule, and its reason
  is import safety: with a flat layout, `import mypkg` resolves to the checkout directory during tests and
  hides packaging bugs, so the tests never exercise what a user installs.
- **The layout forces tests and tools onto the installed package.** Because there is no source-tree package to
  import by accident, every test uses an editable or real install — which is exactly what makes
  `testing.md` §11's installed-artifact test meaningful.
- **Keep the package import-safe** (the parent's inert-import-time rule): importing `mypkg` must run no I/O,
  open no connection, and parse no arguments. A `[project.scripts]` entry point (§6) is the deliberate action
  boundary.

  ```text
  project/
  ├── pyproject.toml
  ├── src/
  │   └── mypkg/
  │       ├── __init__.py
  │       ├── py.typed
  │       └── core.py
  └── tests/
      └── test_core.py
  ```

## 4. Project metadata and the Python floor

- **`requires-python` declares the interpreter floor and the installer enforces it** — a user on an older
  interpreter gets a clear refusal, not a runtime crash. Set it to the parent's declared floor:

  ```toml
  [project]
  requires-python = ">=3.12"
  ```

- **The floor must agree across every surface** (the parent's one-declared-floor rule): `requires-python`, the
  CI test matrix, the type-checker target, and the syntax and stdlib the code uses. Test the declared minimum
  *and* the latest: a matrix that runs only the latest (say 3.13) and never the declared 3.12 floor lets a
  3.13-only feature slip in and break a user on 3.12, because the minimum the metadata promises is never
  exercised.
- **Declare `classifiers` for discovery, never for enforcement.** The `Programming Language :: Python :: 3.12`
  trove classifiers help humans and the index; they are advisory metadata, and `requires-python` is the actual
  gate.
- **State the license with the current SPDX-expression field** (`license = "MIT"`, PEP 639) and let the
  backend include the license file. The SPDX `license` expression needs a recent build backend and packaging
  toolchain; an older backend still expects the classifier or table form. A borrowed or vendored component
  carries its own license and attribution (the parent's trust-boundary discipline).

## 5. Dependencies: runtime, extras, and groups

- **Split dependencies by who needs them and when:**
  - **Runtime** (`[project.dependencies]`) — imported by the shipped package; installed for every user.
  - **Optional extras** (`[project.optional-dependencies]`) — a named feature set a user opts into
    (`pip install mypkg[postgres]`); the code imports each behind a feature boundary and errors clearly when
    it is absent.
  - **Development-only groups** (`[dependency-groups]`, PEP 735 — needs a recent installer / pip) — the test
    runner, the linter, the type checker; needed to develop the project but never shipped and never a runtime
    dependency. A dev group is local tooling, so it is NOT published in the metadata a consumer sees.
- **Pin an application; range a library.** An application (a deployed service, a CLI you own end to end) may
  pin exact versions — usually through a lock file — so a deploy is reproducible. A library ranges its
  dependencies (a lower bound for the feature it needs; an upper bound only for a known incompatibility) so it
  composes with a consumer's other dependencies without forcing a conflict. This is the packaging face of the
  parent's library-vs-application distinction.
- **Add a runtime dependency only for a capability the standard library does not cover** (the parent's
  stdlib-first rule); every runtime dependency is a cost the consumer inherits.

## 6. Entry points and console scripts

- **A console script maps a command name to a typed callable** in `[project.scripts]`:

  ```toml
  [project.scripts]
  mytool = "mypkg.cli:main"
  ```

  The installer generates a launcher on `PATH` that calls `mypkg.cli.main()`. The target is the parent's typed
  `main` — the same callable `if __name__ == "__main__"` delegates to — so the CLI has one entry boundary that
  parses arguments at the edge and returns an exit code (the parent's *"MUST parse configuration and CLI input
  at the boundary into typed domain values"* rule). Never point a script at code that does work at import time.
- **Distinguish a console script from a plugin entry point.** A console script is a command a user runs; a
  plugin entry point (`[project.entry-points."group.name"]`) is an object a host package discovers at runtime
  to load an extension. A plugin loader reads the entry-point group and imports the named object — gate that
  dynamic import behind an allowlist when the plugin source is not fully trusted (the parent's plugin-loading
  rule).
- **Treat the entry-point target as a public name.** Renaming or removing it is a public-API change governed
  by §8's deprecation discipline.

## 7. Package data, inclusion, and `py.typed`

- **Non-code files must be declared or they are silently missing after install** — the classic "works from the
  checkout, `FileNotFoundError` after install" bug. A wheel includes the Python modules the backend discovers,
  but data files ship only when the backend's inclusion config (or the sdist's `MANIFEST.in`, where the
  backend uses one) names them. Do not assume a file in the source tree lands in the wheel.
- **Load bundled data through a package-relative resource API** (`importlib.resources`), never by building a
  path from `__file__`. The installed package may live in a zip or a relocated prefix where `__file__`-relative
  paths do not resolve.
- **Ship the `py.typed` marker for a typed package** — an empty `src/mypkg/py.typed` file, declared as package
  data so it lands in the wheel. Only then do downstream type checkers read your inline annotations (PEP 561).
  This is the packaging half of the marker that `typing.md` §8 introduces: `typing.md` owns what the marker
  means, and this section owns getting it into the built wheel.
- **Verify inclusion by inspecting the built wheel** (a wheel is a zip), not the source tree. §10's clean
  install is what proves the data and the marker actually shipped.

## 8. Versioning

- **Carry one authoritative version and derive the rest.** Either set `[project].version` literally, or
  declare `dynamic = ["version"]` and let the backend source it from one place — a `__version__` in the
  package, or a VCS tag — so the wheel, the metadata, and the runtime never disagree.
- **Use a PEP 440 version string.** PEP 440 defines only the *format* and the *ordering* of a Python version
  string — release segments, pre / post / dev releases, local versions — so an installer can compare and
  resolve versions. It is a string-and-ordering standard; it mandates no release policy and does not say a
  breaking change is a major bump.
- **Choose a versioning policy separately, and communicate compatibility through it.** SemVer
  (`major.minor.patch`, where a breaking change is a major bump) and CalVer (date-based) are both
  PEP-440-valid; which one carries your compatibility signal is the project's own choice, not something
  PEP 440 dictates. Whichever you pick, pair it with the parent's *"MUST evolve a documented public API
  deliberately"* rule: deprecate a documented public name with a `DeprecationWarning` and a migration note,
  keep the compatibility branch for the project's declared **API support window**, and remove it only after
  that window closes. That window is an API-compatibility policy the project sets — a separate axis from
  `requires-python` (the interpreter floor). `testing.md` §5 asserts that the `DeprecationWarning` is actually
  emitted.
- **Never reuse or move a published version.** An index treats a released version as immutable; a fix ships as
  a new version, never a re-upload of the old one.

## 9. Editable installs vs the built artifact

- **An editable install is the inner-loop tool, not the proof.** It links the installed name to your `src/`
  tree so code edits take effect without reinstalling — ideal for development. But it shares the source tree,
  so it does NOT exercise the packaged wheel: undeclared data, a missing dependency, or a mis-declared entry
  point all still resolve from the source and stay hidden.
- **The built artifact is the truth a user receives.** A claim about the distribution — that a data file
  ships, that an entry point resolves, that the dependency set is complete — is proven only by installing the
  built wheel, never by an editable install or a checkout import.
- **Use each for its job.** Develop against the editable install; verify against the built wheel (§10). Passing
  under editable is necessary but not sufficient.

## 10. Verify the artifact in a clean environment

- **Install the wheel into a fresh, empty virtual environment** — one that holds nothing from your dev setup —
  and smoke-test it there. Installing a wheel does not import your package, so a missing runtime dependency
  does not fail the install; it stays hidden until the **smoke test imports the package**, and in a clean
  environment that import raises `ImportError` immediately — whereas in your dev environment the dependency was
  present by accident and the bug never showed. The clean env is what makes the next step's import a real
  check.
- **Smoke-test the distribution's own claims:** import the public surface by the installed name, run each
  `[project.scripts]` command as an installed console command (§6), and load a bundled data file and the
  `py.typed` marker (§7). This is the build side of *"NEVER test only the checkout when shipping a package"*;
  `testing.md` §11 runs the behavioral suite against this same installed artifact.
- **Check the sdist too — build the wheel *from the sdist*** to confirm the source distribution is
  self-contained (it did not omit a file the build needs). A wheel that builds from the git checkout but not
  from its own sdist is broken for anyone installing from source.

## 11. The publish boundary

- **This doc stops at the artifact.** Publishing uploads the built wheel and sdist to an index so others can
  install them; build it, verify it (§10), and treat the upload as a separate, deliberate release step.
- **Publish from a pipeline with a short-lived, scoped credential.** Do the release from CI against a real
  index using a trusted-publishing / OIDC flow where the index supports it, rather than a long-lived token in
  a developer's shell. This doc does not teach credential handling — never commit or log an index token (the
  parent's secret-handling rule), and keep publish authority in the release pipeline, not in individual
  accounts.
- **Rehearse before the first real upload,** against a test index, and honor §8's immutability rule: a bad
  release is superseded by a new version, never overwritten.
