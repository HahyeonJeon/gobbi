---
name: gobbi-dev-deployment
description: "MUST load when installing, verifying, or recovering a released Gobbi plugin deployment in caller-named isolated Claude Code and Codex targets."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# Gobbi Deployment

A deployment operator uses this operation to install one released Gobbi plugin package into one isolated
Claude Code target and one isolated Codex target. Completion means both targets contain the same released
identity, match the filtered package inventory, and contain no repository-local-only content.

This operation owns containment, order, observations, and recovery for those two targets. It grants no
network, credential, source, default-home, release, Git, production, or cleanup authority.

## Principles

### Bind both targets to one release

The two runtime installs represent one deployment only when their source identity, digest, and allowed file
inventory agree. A changed package starts a new deployment.

### Prove containment before effects

Lexical path checks alone cannot reveal symbolic-link escape or target overlap. Resolve the existing root and
every existing parent before creating or installing anything.

### Stop at the first failed observation

Continuing after a failure makes the resulting state harder to attribute. Preserve both targets and the first
useful sanitized diagnostic for recovery.

### Treat removal as a new action

An incomplete install can still contain runtime or foreign state. Removal needs new authority and proof that
the exact marked target contains only effects this operation created.

## Rules

- **MUST bind the deployment to explicit current caller authority and prove package immutability from a
  caller-supplied frozen per-file hash manifest or protected read-only snapshot.** The authority names one
  existing isolation root, the exact two target paths, and the allowed effects.
- **MUST require `claude` and `codex` to be absent, distinct, nonsymlink direct children of one resolved real
  isolation root.** Reject lexical or resolved escape, overlap, collision, unsafe parent, repository or
  worktree overlap, package-source overlap, and default-home overlap before mutation.
- **MUST confine every environment binding, cache, metadata file, install path, marker, and observation to its
  named target.** Bind Claude through a private `HOME` and `CLAUDE_CONFIG_DIR`, and bind Codex through a private
  `HOME`, `CODEX_HOME`, and `CODEX_SQLITE_HOME`.
- **MUST install the same local immutable package into both targets and fully verify Claude before Codex
  begins.** Each runtime must prove the released identity, resolved containment, complete installed inventory
  and bytes, hook absence, and repository-local-only family absence.
- **NEVER use the network, credentials, default runtime homes, external caches, source writes, automatic
  retries, overwrite, or implicit cleanup in this operation.** A required effect outside the authorized
  targets is a stop condition.
- **MUST preserve the exact partial state on the first failure and require a separate recovery contract.**
  Resume only from unchanged identity and containment evidence; remove only an exact marked operation-created
  target with fresh authority and no foreign effects.

## Procedure

### Phase 1 — Bind Identity and Authority

#### 1.1 Validate immutable release and caller mutation authority

- Take the caller identity, released commit or source identity, package path, digest, filtered file inventory,
  caller-supplied frozen per-file hash manifest or protected read-only snapshot, release observations,
  isolation root, target names, requested action, and current authority.
- Require the package to be local, readable, and already released. Compare every current relative path and
  byte with the frozen manifest or protected snapshot, recompute its digest and inventory, and stop and return
  to `gobbi-dev-release` on any mismatch or missing release evidence.
- Require authority for only `inspect`, `deploy`, `resume`, or `remove`, the exact root and targets, and the
  effects that action needs. Prior deployment, release, Evaluation, or acceptance evidence is not authority.
- Record a sanitized deployment identity and its exact immutability-proof form. Omit credentials, secret
  values, private unrelated paths, and unrestricted environment data.

### Phase 2 — Preflight Containment

#### 2.1 Validate the real isolation root and absent direct-child targets

- Require the caller-named isolation root to exist as a real nonsymlink directory. Resolve it and record its
  device, inode, owner, permissions, and preimage inventory without changing it.
- Derive the exact absolute targets as the root's `claude` and `codex` direct children. Require both paths to
  be lexically normalized, absent under both existence and symbolic-link tests, distinct, and nonoverlapping.
- Require the root and targets to be outside the repository, session worktree, released package source, user
  default home, and each other's resolved subtree. Stop with the conflicting path and no mutation on failure.

#### 2.2 Reject collisions, symlinks, overlap, and escape

- Walk each existing root component without following an unsafe symbolic link. Resolve every existing parent
  and require the target's resolved parent to equal the recorded root.
- Preflight both targets before creating either. A file, directory, link, mount, inaccessible component,
  changed root identity, or unknown collision at either target stops the operation with zero target creation.
- Record the lexical and resolved containment proof, root preimage, and exact allowed-effects set for later
  comparison.

### Phase 3 — Create, Install, and Verify

#### 3.1 Create and mark both targets

- Enter only for `deploy` with unchanged Phase 1 and Phase 2 evidence. Recheck authority, root identity, both
  absent targets, and every package path and byte against the frozen proof immediately before mutation.
- Create both targets with owner-only access, then create an operation marker inside each target containing the
  sanitized deployment identity, target role, and creation time.
- Resolve both created targets and require each to remain a direct child of the recorded root. On failure,
  create nothing further and continue to Phase 4 without deleting either target.

#### 3.2 Install the same local release

- Build each runtime environment entirely inside its target. Use `gobbi-dev-toolchain` and the current runtime
  and package owners to select the supported local marketplace and install commands; those facts grant no
  additional authority.
- Immediately before Claude installation, compare every package path and byte with the frozen proof. Install
  Claude, repeat that comparison immediately afterward, then verify Claude's command exit, released identity,
  version, resolved installed path, complete inventory and bytes, both manifests, allowed components, hook
  absence, and repository-local-only family absence.
- Begin Codex only after every Claude observation passes. Immediately before Codex installation, compare every
  package path and byte with the frozen proof; install Codex, repeat that comparison immediately afterward,
  then apply the same complete identity, path, inventory, byte, manifest, component, hook, and local-only
  absence verification to Codex.
- Stop on the first failed command, external write, network or credential request, containment mismatch, or
  package or installed-tree mismatch. Do not start the next install, retry, overwrite, or clean up.
- Treat local `socketpair(AF_UNIX)` and audited traffic on its proved Unix descriptors as local runtime IPC,
  not external network authority. The smoke guard denies endpoint acquisition and association, follows every
  descendant, closes inherited descriptors, and stops on a nonlocal address family, unproved successful send
  or receive, audit error, or nonzero child status.
- Keep three policies separate. `source-precheck` and `source-postcheck` each require exactly four denied
  `AF_UNIX` or `AF_LOCAL` stream probes with the exact ordered flags, protocol zero, injected `EACCES`, no
  descriptor, and no effect. Helper stages remain strict and stop on every injected prohibited call.
- Fixed production runtime wrappers may classify a complete fixed-deny record as a blocked no-effect probe
  only in their closed stage allowlists and only when its anchored result is exactly
  `-1 EACCES (Permission denied) (INJECTED)`, the child exits zero, and no descriptor or effect exists. A
  successful fixed-deny call, successful nonlocal or unproved data operation, descriptor return from a denial
  candidate, malformed, truncated, unfinished or resumed, wrong-error, unmarked, ambiguous, or unclassified
  prohibited-family record is a prohibited effect and stops the deployment.
- Authenticate each nonempty private current-stage trace before parsing. Reject links, replacement, identity
  change, missing terminal evidence, or caller-selected production policy. This is a trusted-runtime
  observation boundary, not a hostile-code sandbox.
- Static parser and fixture checks prove policy wiring only. They do not prove a production runtime PASS;
  deployment completion still requires separately authorized actual runtime observations.
- Invoke each runtime stage once. Never replay a failed stage. A fresh whole-smoke run is a separate recovery
  action that requires caller authority, preserved prior evidence, and a renewed unchanged-identity,
  containment, package, executable, and policy preflight.

#### 3.3 Verify both identities and inventories

- Compare every package path and byte with the frozen proof again before forming the final receipt. Reject a
  changed, missing, extra, linked, unreadable, or unproved package path.
- Require the two fully verified runtime observations to report the same released source identity, version,
  digest, filtered inventory, and package proof. Require every reported and resolved installed path to remain
  strictly inside its target.
- Completion is a sanitized receipt with both exact identities, environments, markers, inventories, hashes,
  observations, effects, and limits. Hand that receipt to the caller without changing any release or
  acceptance state.

### Phase 4 — Stop or Recover

#### 4.1 Preserve exact failure state

- On any failure, stop all further effects and inventory both targets read-only when the existing authority
  permits it. Record which targets are absent, created, marked, partially installed, or fully verified.
- Record the first useful sanitized diagnostic, affected obligation, retained paths and objects, evidence
  limits, risk, and earliest responsible owner. Route release identity defects to `gobbi-dev-release`, package
  topology to the package owner, command facts to `gobbi-dev-toolchain`, runtime facts to the runtime owner,
  and ambiguous ownership to the manager.
- Return a recoverable stop, never a success receipt. Keep both targets unchanged until a new recovery action
  is authorized.

#### 4.2 Inspect, resume, or separately remove

- For `inspect`, revalidate the prior receipt, root, targets, markers, containment, package identity, and
  inventories read-only. Report drift and stop without repair.
- For `resume`, require fresh authority, unchanged operation markers and package identity, no foreign effects,
  and a uniquely known first incomplete action. Repeat its preflight and continue once; otherwise preserve.
  A runtime-smoke failure never resumes by replaying its failed stage; only a separately authorized fresh
  whole-smoke run may start after the complete smoke preflight passes again.
- For `remove`, require separate fresh authority for each named target and prove its marker, containment,
  complete effect inventory, and absence of foreign state. Remove only that proved target, then verify its
  absence; preserve any target whose proof fails.
- Return the exact action result, surviving targets, observations, authority used, and first safe continuation.
  Recovery never changes the released source or broadens the deployment target.

## References

- [Deployment checklists](checklists.md) supplies reusable unchecked containment, inventory, and recovery
  conditions subordinate to this operation.
