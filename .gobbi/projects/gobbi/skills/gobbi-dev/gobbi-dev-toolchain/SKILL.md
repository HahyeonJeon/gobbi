---
name: gobbi-dev-toolchain
description: "MUST load when choosing or diagnosing Gobbi project commands, tools, prerequisites, and effects."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# Gobbi Toolchain

Use this manual to look up the repository-owned Gobbi script toolchain, its current command forms,
prerequisites, effects, outputs, and common failures. Its supported surface is the executable scripts under
this repository's `scripts/` directory at the exact revision being worked.

The manual helps choose or diagnose a command. The applicable lifecycle operation still owns sequence,
mutation scope, external authority, evidence, and completion.

## Principles

### Read the script at the working revision

Repository scripts change with the source tree. The file, its usage branch, and its direct dependencies at the
exact revision outrank a remembered command.

### Distinguish checks from reconciliation

Two commands with similar names can have different writes, cleanup, and runtime effects. Read-only posture must
be proved from the selected mode and implementation, not inferred from `check` in a filename.

### Treat output as bounded evidence

An exit status and diagnostic prove only the checks the script reached in its current environment. A success
does not grant authority or replace a required real runtime observation.

### Diagnose the first failed owner

Most script failures identify a source owner, generated view, tool, runtime, or environment boundary. Correct
that owner through its operation instead of editing a generated result or suppressing the check.

## Rules

- **MUST resolve the repository root and exact script file before selecting a command.** Read its usage,
  required tools, environment inputs, mutation paths, cleanup trap, and exit meanings at the current revision.
- **MUST use the command form whose effects match current caller authority.** A check, sync, materialization,
  fixture test, or installed-runtime smoke is a distinct effect class.
- **MUST verify every required executable through its exact path or the script's declared lookup and record its
  observed version when behavior can vary.** Missing or different tools make the observation unavailable, not
  passed.
- **MUST isolate fixture and runtime-smoke homes, caches, marketplaces, and installed trees in caller-authorized
  temporary roots.** Confirm cleanup and preservation rules before execution.
- **NEVER edit generated discovery, package, installed-cache, or entrypoint output to bypass a tool failure.**
  Diagnose the canonical owner or generator and use the owning operation for any correction.
- **NEVER infer network, credential, mutation, publication, release, deployment, or cleanup authority from a
  documented command.** Tool facts describe behavior only.

## Manual

### Compatibility Boundary

This manual covers the Bash scripts committed under `scripts/` with these stable roles:

| Surface | Current role | Boundary |
|---|---|---|
| `sync-runtime-entrypoints.sh` | Check or regenerate native repository entrypoints | Owns `.codex/AGENTS.md` and `.claude/CLAUDE.md`; validates its canonical sources before sync |
| `sync-plugin-package.sh` | Check or reconcile runtime discovery and package topology, or materialize package components | Owns generated discovery links and package component views; canonical skills and agents stay editable owners |
| `test-sync-plugin-package.sh` | Exercise package reconciliation in private fixtures | Mutates only its temporary fixture roots when its repository root is unchanged |
| `check-markdown-links.sh` | Validate relative Markdown paths and anchors | Takes explicit file or directory inputs; reports broken links without repairing them |
| `test-check-markdown-links.sh` | Exercise link-checker behavior in temporary Git and non-Git fixtures | Creates and removes only its private fixture roots |
| `check-codex-plugin-smoke.sh` | Install the local package with the actual Codex CLI and compare the isolated cache | Requires a materialized package and private Codex homes |
| `check-claude-plugin-smoke.sh` | Install the local package with the actual Claude Code CLI and compare the isolated cache | Requires a materialized package and private Claude homes; the script must exist at the working revision before use |

The named scripts are the tool surface. Git, Codex, Claude Code, Bash, `jq`, and ordinary Unix programs are
dependencies with their own behavior. End-to-end work remains with `gobbi-dev-development`,
`gobbi-dev-testing`, `gobbi-dev-review`, `gobbi-dev-release`, or `gobbi-dev-deployment` when its trigger applies.

### Command Catalog

| Command | Inputs and output | Effects and exit meaning |
|---|---|---|
| `bash scripts/sync-runtime-entrypoints.sh --check` | Canonical entrypoint sources; prints PASS or drift per native target | Uses a private temporary render; exits `0` on equality, `1` on invalid source or drift, `2` on bad usage |
| `bash scripts/sync-runtime-entrypoints.sh --sync` | Same sources; prints SYNC or PASS | Replaces only stale owned native entrypoints after source validation; same error classes |
| `bash scripts/sync-plugin-package.sh --check` | Canonical owners, manifests, marketplaces, settings, wrappers, entrypoints, local mirrors, package | Read-only topology and byte comparison; nonzero names violated owners |
| `bash scripts/sync-plugin-package.sh` | Same owners plus current generated views | Reconciles `.agents/skills` and per-file `.claude/skills`; preserves a materialized package component and creates a canonical component link only where allowed |
| `bash scripts/sync-plugin-package.sh --materialize-package` | Valid canonical skill and agent roots plus safe package destinations | Replaces or updates package components with real generated files, prunes proved stale entries, then checks byte equality |
| `bash scripts/test-sync-plugin-package.sh` | Current sync script and repository fixture sources | Creates private fixtures, exercises success and failure cases, removes fixtures on exit, and exits nonzero on the first failed assertion |
| `bash scripts/check-markdown-links.sh <file-or-dir> [...]` | One or more Markdown files or directories | Prints broken relative links or `ALL LINKS RESOLVE`; exits `0` for success, `1` for broken links, `2` for bad inputs |
| `bash scripts/test-check-markdown-links.sh` | Current link checker | Creates private Git and non-Git fixtures, removes them on exit, and exits nonzero on a failed assertion |
| `bash scripts/check-codex-plugin-smoke.sh` | Actual Codex CLI and current materialized local package | Installs into private Codex state, compares the installed tree with a frozen manifest, and reports `frozen_sha256`, directory count, and file count |
| `bash scripts/check-claude-plugin-smoke.sh` | Actual Claude Code CLI and current materialized local package | Installs into private Claude state, compares the installed tree with a frozen manifest, and reports `frozen_sha256`, directory count, and file count |

Run a smoke only when its exact script exists, is readable, passes `bash -n`, and names the isolation variables
required by the accepted contract. The current task or release contract decides whether both actual runtime
observations are mandatory; one cannot substitute for the other.

#### Installed-runtime trace boundary

Each runtime stage executes its exact CLI once through a fixed descriptor-closing wrapper under an empty
environment, private homes, a private temporary directory, and `/dev/null` standard input. The wrapper closes
every inherited file descriptor at or above 3 before replacing itself with the runtime. `strace` follows all
descendants without detaching and retains the raw trace, standard output, and standard error for the audit.

The trace includes `%network`, `socketcall` where available, `io_uring_setup`, and `pidfd_getfd`. Injection
denies `socket`, `socketcall` where available, `connect`, `bind`, `listen`, `accept`, `accept4`,
`io_uring_setup`, and `pidfd_getfd`. Local `socketpair(AF_UNIX)` remains available. Successful send or receive
records pass only when descriptor decoding proves a Unix socket; failed calls must prove no effect. Any
nonlocal address family, unproved successful data operation, audit error, or nonzero child status stops the
stage and preserves its evidence.

The trace audit uses three distinct policies. `source-precheck` and `source-postcheck` each require exactly
four full-line `socket(AF_UNIX|AF_LOCAL, SOCK_STREAM|SOCK_CLOEXEC|SOCK_NONBLOCK, 0)` records returning injected
`EACCES`, so they create no descriptor or effect. Helper stages are strict and stop on every injected
prohibited call.

Only fixed runtime wrappers and closed stage allowlists select production semantic no-effect policy. Codex
allows exactly `version`, `marketplace-add`, `available-list`, `install`, and `installed-list`; Claude allows
exactly `version`, `validate`, `marketplace-add`, `available-list`, `install`, and `installed-list`. The
parser first authenticates a nonempty private current-stage trace, rejects malformed, truncated,
unfinished/resumed, ambiguous, or unknown records, then classifies an anchored fixed-deny record only when it
ends exactly `-1 EACCES (Permission denied) (INJECTED)`, returns no descriptor or effect, and the child exits
zero. The later prohibited-family scan skips only those classified blocked no-effect probes. Every successful
fixed-deny call, successful nonlocal or unproved data operation, descriptor return from a denial candidate,
wrong error, missing marker, unclassified prohibited-family record, trace identity failure, or nonzero child
is a prohibited effect and stops the smoke.

Static parser and fixture checks prove policy wiring only. They do not prove a production runtime PASS; an
actual runtime observation remains separate and requires caller authority.

This is a trusted-runtime observation boundary, not a hostile-code sandbox. A stage is never replayed. A fresh
whole-smoke retry is a separate recovery action that needs caller authority and a renewed unchanged-subject
preflight.

### Prerequisites and Effects

- All commands require Bash and a readable repository tree. The scripts currently use combinations of Git,
  `awk`, `sed`, `grep`, `find`, `sort`, `comm`, `cmp`, `readlink`, `realpath`, `mktemp`, `cp`, `ln`, `jq`, `sha256sum`, and
  the selected runtime CLI; inspect the exact script for the authoritative subset.
- `GOBBI_ENTRYPOINT_REPO_ROOT` and `GOBBI_SYNC_REPO_ROOT` redirect their owning scripts for controlled
  fixtures. Use them only with an exact caller-authorized root and never as a fallback owner search.
- Sync and materialization commands mutate tracked or generated repository views. Require one writer, a clean
  understood preimage, an allowlisted path set, and post-command diff inspection.
- Fixture tests use temporary directories and cleanup traps. Record the retained path when an interrupted or
  intentionally preserved fixture is needed for diagnosis instead of deleting it broadly.
- Installed-runtime smokes require a materialized package and exact executable runtime. Bind private `HOME`,
  runtime configuration, database, marketplace, cache, and installed paths as required by the script; default
  homes, network, and credentials remain outside the local package smoke contract.

### Diagnostics and Recovery

| Symptom | Inspect first | Recovery boundary |
|---|---|---|
| Usage exit `2` | The script's usage function and supplied arguments | Correct only the invocation; do not change the script to accept an unintended mode |
| Canonical source absent, unreadable, linked, or mistyped | The exact canonical owner and preflight diagnostic | Restore or correct the owner through its operation; a mutation mode must have made zero changes |
| Local discovery drift | Canonical skill tree and the named `.agents` or `.claude` target | Run normal sync only with mirror-mutation authority; never hand-edit the view |
| Package missing, stale, linked, or byte-different | Canonical owner, exact relative package path, and component shape | Materialize only with package-mutation authority; preserve unrelated package paths |
| Broken Markdown link or anchor | The linking file, relative target, and generated anchor | Correct the canonical document or link owner; regenerate a view through its owner |
| Runtime executable or version mismatch | The exact required executable path, resolved target, and built-in version output | Mark the runtime observation unavailable and stop the requiring operation |
| Installed inventory mismatch | Runtime-reported installed path, materialized package path, and first differing relative file | Preserve the isolated target; route package topology to the package owner and runtime facts to the runtime owner |
| Unexpected write, network, credential, or default-home access | Process environment, resolved paths, first effect, and current authority | Stop later commands, preserve exact state, and return to the caller for a new bounded action |

Report the exact command, repository revision, tool paths and versions, environment bindings, exit status,
first useful sanitized diagnostic, effects, retained paths, and evidence limits. Retry only through the owning
operation on an unchanged subject and a newly proved preflight.

## References
