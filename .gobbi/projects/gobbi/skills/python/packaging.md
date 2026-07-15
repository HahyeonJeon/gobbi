# Python — Packaging and Distribution

Child doc of the `python` skill: the deep reference for turning a Python 3.12 project into an installable,
distributable artifact. The `SKILL.md` § Procedure P2 router sends a reader here when a project, package, or
CLI is created; when metadata, dependencies, entry points, package data, build, or distribution change; or
when a documented public API is deprecated or evolved. An ordinary edit needs none of this.

This doc **deepens, and does not restate,** the parent floor: the *Delivery and evidence* judgment default (a
new distributable project normally uses `pyproject.toml` and a `src/` layout), H1 (one consistent Python
floor), H2 (inert imports), H8 (allowlist plugin/dynamic loading), H13 (deprecate a documented public API
deliberately), and H15 (verify from built artifacts in a clean environment). The installed-artifact side is
shared with `testing.md`: §9 owns the build-and-install side, `testing.md` the suite side. Tool names (a build
backend, a build frontend, an installer, a publish tool) are examples, never a lock.

Build a package bottom-up: scaffold `pyproject.toml`, a `src/` package with a minimal importable
`__init__.py`, a `tests/` tree, and an entry-point stub; then build, install, and smoke-test that minimal
artifact (§9) before adding real code — so a packaging bug surfaces while the package is still one file.

## Contents

1. [The `pyproject.toml` center](#1-the-pyprojecttoml-center)
2. [The build system: backend and frontend](#2-the-build-system-backend-and-frontend)
3. [The `src/` layout and import safety](#3-the-src-layout-and-import-safety)
4. [Project metadata and the Python floor](#4-project-metadata-and-the-python-floor)
5. [Dependencies: runtime, extras, and groups](#5-dependencies-runtime-extras-and-groups)
6. [Entry points and console scripts](#6-entry-points-and-console-scripts)
7. [Package data, inclusion, and `py.typed`](#7-package-data-inclusion-and-pytyped)
8. [Versioning](#8-versioning)
9. [Editable install vs the built artifact, verified clean](#9-editable-install-vs-the-built-artifact-verified-clean)
10. [The publish boundary](#10-the-publish-boundary)

---

## 1. The `pyproject.toml` center

- **One standardized file centers build config and metadata.** A modern pure-Python project needs no
  `setup.py` and no `setup.cfg`. Two tables are the core: `[build-system]` names *how* the project is built,
  and `[project]` (PEP 621) declares standardized metadata. Auxiliary inputs stay in their own files where a
  backend or tool needs them — an sdist `MANIFEST.in` (§7), a lock or constraints file, a native backend's
  build script — so "center" is not "only file."
- **`[build-system]` lists the `requires` to build and the `build-backend` entry point.** Keep it minimal:

  ```toml
  [build-system]
  requires = ["hatchling"]
  build-backend = "hatchling.build"
  ```

- **`[project]` holds the metadata every installer and index consumes** — `name`, `version` (or `dynamic =
  ["version"]`, §8), `description`, `readme`, `requires-python` (§4), `dependencies` (§5),
  `[project.optional-dependencies]`, `[project.scripts]` (§6), authors, license, classifiers. A
  `[tool.<backend>]` table configures only what PEP 621 does not standardize (file inclusion, dynamic version).
- **Keep tool configuration here** — `[tool.ruff]`, `[tool.mypy]`, `[tool.pytest.ini_options]`. A tool that
  cannot read `pyproject.toml` keeps its own file.

## 2. The build system: backend and frontend

- **Separate the two roles.** A **build backend** turns source into a wheel and an sdist (it implements the
  PEP 517 hooks); a **build frontend** reads `[build-system]`, installs the backend into an isolated
  environment, and calls it. Never invoke a backend directly — go through the frontend so the build is
  reproducible.
- **The backend is a choice with sane defaults.** Hatchling, setuptools, Flit, PDM-backend are examples; pick
  one, let it own the build, do not mix two.
- **Build both distributions with the frontend:**

  ```console
  $ python -m build
  ```

  It produces a **wheel** (`.whl`) and a **source distribution** (`.tar.gz`) in `dist/`. Build in isolation so
  the build cannot silently depend on a package that merely happens to be in your dev environment.
- **Ship both artifacts.** A wheel is the prebuilt artifact an installer prefers; an sdist is the buildable
  fallback some consumers and mirrors require. Publishing only the wheel is incomplete.

## 3. The `src/` layout and import safety

- **A new distributable project should default to a `src/` layout** — the importable package under a top-level
  `src/` (`src/mypkg/__init__.py`), NOT importable from the project root. This is the recommended default, not
  a universal rule: an existing flat layout or a compatibility constraint can be correct when its import and
  artifact tests prove the same boundary. Its reason is import safety: with a flat layout, `import mypkg`
  resolves to the checkout directory during tests and hides packaging bugs.
- **The layout forces tests onto the installed package.** With no source-tree package to import by accident,
  every test uses an editable or real install — what makes `testing.md` §10's installed-artifact test
  meaningful.
- **Keep the package import-safe (H2):** importing `mypkg` runs no I/O, opens no connection, parses no
  arguments. A `[project.scripts]` entry point (§6) is the deliberate action boundary.

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

- **`requires-python` declares the interpreter floor, and the installer enforces it** — an older-interpreter
  user gets a clear refusal, not a runtime crash:

  ```toml
  [project]
  requires-python = ">=3.12"
  ```

- **The floor must agree across every surface (H1):** `requires-python`, the CI test matrix, the type-checker
  target, and the syntax and stdlib used. Test the declared minimum *and* the latest — a matrix that runs only
  the latest (say 3.13) and never the 3.12 floor lets a 3.13-only feature slip in and break a 3.12 user.
- **Declare `classifiers` for discovery, never enforcement.** `Programming Language :: Python :: 3.12` trove
  classifiers are advisory; `requires-python` is the gate.
- **State the license with the current SPDX field** (`license = "MIT"`, PEP 639) and let the backend include
  the license file. The SPDX expression needs a recent backend/toolchain; an older backend expects the
  classifier or table form. A vendored component carries its own license and attribution.

## 5. Dependencies: runtime, extras, and groups

- **Split dependencies by who needs them and when:**
  - **Runtime** (`[project.dependencies]`) — imported by the shipped package; installed for every user.
  - **Optional extras** (`[project.optional-dependencies]`) — a named feature set a user opts into
    (`pip install mypkg[postgres]`); the code imports each behind a feature boundary and errors clearly when it
    is absent.
  - **Development-only groups** (`[dependency-groups]`, PEP 735 — needs a recent installer/pip) — the test
    runner, linter, type checker; needed to develop but never shipped, and NOT published in consumer metadata.
- **Pin an application; range a library.** An application (a deployed service, a CLI you own end to end) may
  pin exact versions through a lock file, so a deploy is reproducible. A library ranges its dependencies (a
  lower bound for the feature it uses; an upper bound only for a known incompatibility) so it composes with a
  consumer without forcing a conflict.
- **Add a runtime dependency only for a capability the standard library does not cover** (stdlib-first); every
  runtime dependency is a cost the consumer inherits.

## 6. Entry points and console scripts

- **A console script maps a command name to a typed callable** in `[project.scripts]`:

  ```toml
  [project.scripts]
  mytool = "mypkg.cli:main"
  ```

  The installer generates a launcher on `PATH` that calls `mypkg.cli.main()`. The target is the parent's typed
  `main` — the callable `if __name__ == "__main__"` delegates to — parsing arguments at the edge and returning
  an exit code. Never point a script at code that does work at import time.
- **Distinguish a console script from a plugin entry point.** A plugin entry point
  (`[project.entry-points."group.name"]`, e.g. `[project.entry-points."myapp.readers"]`) is an object a host
  package discovers at runtime to load an extension; gate that dynamic import behind an allowlist when the
  plugin source is not fully trusted (H8; `interoperability.md` §7 owns runtime discovery and validation).
- **Treat the entry-point target as a public name.** Renaming or removing the group, command, module, or
  callable is a public-API change governed by §8's deprecation discipline (H13).

## 7. Package data, inclusion, and `py.typed`

- **Non-code files must be declared or they are silently missing after install** — the classic "works from the
  checkout, `FileNotFoundError` after install" bug. Data files ship only when the backend's inclusion config
  (or the sdist's `MANIFEST.in`, where the backend uses one) names them.
- **Load bundled data through `importlib.resources`,** never a path built from `__file__` — the installed
  package may live in a zip or a relocated prefix.
- **Ship the `py.typed` marker for a typed package** — an empty `src/mypkg/py.typed`, declared as package data
  so it lands in the wheel; only then do downstream type checkers read your inline annotations (PEP 561).
  `typing.md` §8 owns what the marker means; this section owns getting it into the wheel.
- **Verify inclusion by inspecting the built wheel** (a wheel is a zip), not the source tree. §9's clean
  install proves the data and marker shipped.

## 8. Versioning

- **Carry one authoritative version and derive the rest.** Set `[project].version` literally, or declare
  `dynamic = ["version"]` and let the backend source it from one place — a package `__version__` or a VCS tag
  — so the wheel, the metadata, and the runtime never disagree.
- **Use a PEP 440 version string.** PEP 440 defines only the *format* and *ordering* — release / pre / post /
  dev / local segments — so an installer can compare and resolve versions. It mandates no release policy.
- **Choose a versioning policy separately.** SemVer (`major.minor.patch`, a breaking change is a major bump)
  and CalVer (date-based) are both PEP-440-valid; which one carries your compatibility signal is your choice.
  Pair it with H13: deprecate a documented public name with a `DeprecationWarning` and a migration note, keep
  the compatibility branch for the declared **API support window**, and remove it only after that window
  closes. The API window is a separate axis from `requires-python`. `testing.md` §5 asserts the
  `DeprecationWarning` is emitted.
- **Never reuse or move a published version.** An index treats a release as immutable; a fix ships as a new
  version.

## 9. Editable install vs the built artifact, verified clean

- **An editable install is the inner-loop tool, not the proof.** It links the installed name to your `src/`
  tree so edits take effect without reinstalling, but it shares the source tree, so it does NOT exercise the
  wheel — undeclared data, a missing dependency, or a mis-declared entry point stay hidden. Develop against the
  editable install; verify against the built wheel — passing under editable is necessary, not sufficient.
- **Install the wheel into a fresh, empty virtual environment** and smoke-test it there. Installing a wheel
  does not import your package, so a missing runtime dependency does not fail the install; it stays hidden until
  the **smoke test imports the package**, where a clean environment raises `ImportError` immediately — whereas
  in dev the dependency was present by accident. Then import the public surface by the installed name, run each
  `[project.scripts]` command as an installed console command (§6), and load a bundled data file and the
  `py.typed` marker (§7). This is the build side of H15; `testing.md` §10 runs the behavioral suite against the
  same artifact.
- **Check the sdist too — build the wheel *from the sdist*** to confirm the source distribution is
  self-contained. A wheel that builds from the checkout but not from its own sdist is broken for anyone
  installing from source.

## 10. The publish boundary

- **This doc stops at the artifact.** Publishing uploads the built wheel and sdist to an index; build it,
  verify it (§9), and treat the upload as a separate, deliberate release step.
- **Publish from a pipeline with a short-lived, scoped credential** — release from CI against a real index
  using a trusted-publishing / OIDC flow where the index supports it, not a long-lived token in a developer's
  shell. Never commit or log an index token (the parent's secret-handling rule), and keep publish authority in
  the pipeline, not individual accounts.
- **Rehearse before the first real upload,** against a test index, and honor §8's immutability rule: a bad
  release is superseded by a new version, never overwritten.
