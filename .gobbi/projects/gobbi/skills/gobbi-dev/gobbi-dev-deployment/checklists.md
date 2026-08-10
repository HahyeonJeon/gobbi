# Gobbi Deployment Checklists

Use these unchecked conditions while applying the parent deployment operation. They do not replace its
ordered decisions, grant authority, or prove a result.

## Identity and Authority

- [ ] The released source, version, digest, filtered inventory, and package path identify one immutable local
  package.
- [ ] The caller supplied a frozen per-file hash manifest or protected read-only snapshot, and every package
  relative path and byte matches it.
- [ ] Current caller authority names the exact isolation root, `claude` target, `codex` target, action, and
  allowed effects.
- [ ] Network, credentials, default homes, source writes, external caches, overwrite, retry, and implied
  cleanup are outside the authorized effect set.

## Two-Target Isolation

- [ ] The isolation root is an existing readable real nonsymlink directory with a recorded resolved identity.
- [ ] `claude` and `codex` are absent distinct direct children under both existence and symbolic-link checks.
- [ ] Lexical and resolved checks reject escape, overlap, collision, unsafe parents, repository or worktree
  overlap, package-source overlap, and default-home overlap.
- [ ] Both target preflights complete before either target is created.
- [ ] Each created target resolves beneath the unchanged root and carries its exact operation marker.

## Installed Inventory

- [ ] Claude uses only its private `HOME` and `CLAUDE_CONFIG_DIR` inside the Claude target.
- [ ] Codex uses only its private `HOME`, `CODEX_HOME`, and `CODEX_SQLITE_HOME` inside the Codex target.
- [ ] The current runtime inventory locates each installed package strictly inside its target.
- [ ] Every package path and byte matches the frozen proof immediately before and after each runtime install
  and again before the final receipt.
- [ ] Claude's identity, version, resolved path, complete inventory and bytes, manifests, allowed components,
  hook absence, and local-only family absence all pass before Codex begins.
- [ ] Codex begins only after Claude fully passes and then satisfies the same complete verification.
- [ ] Each runtime stage runs exactly once through the descriptor-closing wrapper with `/dev/null` input,
  private environment state, and all descendants kept under the trace.
- [ ] Local `socketpair(AF_UNIX)` and proved Unix-descriptor traffic are the only successful socket activity;
  every nonlocal family, unproved successful send or receive, audit error, or nonzero child status stops the
  run and preserves trace, standard output, and standard error.
- [ ] `source-precheck` and `source-postcheck` each report exactly four denied `AF_UNIX` or `AF_LOCAL` stream
  probes with the exact ordered flags, protocol zero, injected `EACCES`, no descriptor, and no effect.
- [ ] Every helper stage is strict. Any injected prohibited helper call stops with zero mutation.
- [ ] A fixed production runtime wrapper selects only a stage in its closed allowlist. Only a complete
  fixed-deny record ending exactly `-1 EACCES (Permission denied) (INJECTED)` with zero child status and no
  descriptor or effect is a blocked no-effect probe.
- [ ] Every successful fixed-deny call, successful nonlocal or unproved data operation, descriptor return from
  a denial candidate, malformed, truncated, unfinished or resumed, wrong-error, unmarked, ambiguous, or
  unclassified prohibited-family record is a prohibited effect and stops the run.
- [ ] Each trace is nonempty, private, contained, regular, nonlinked, unchanged in identity, and has recognized
  terminal evidence before parsing. The trace is a trusted-runtime observation boundary, not a hostile-code
  sandbox.
- [ ] Static parser and fixture checks prove policy wiring only. A production runtime PASS still requires a
  separately authorized actual runtime observation.
- [ ] Every expected filtered package file exists at the same relative path with the same bytes.
- [ ] No extra, omitted, changed, linked, unreadable, hook, or repository-local-only family path or literal
  exists.
- [ ] Both targets report one version, source identity, digest, and filtered inventory.

## Failure and Recovery

- [ ] The first failure stopped later install, retry, overwrite, and cleanup actions.
- [ ] No failed runtime stage was replayed. Any fresh whole-smoke run has separate caller recovery authority,
  preserved prior evidence, and a renewed unchanged-subject preflight.
- [ ] The failure receipt records each target state, the first useful sanitized diagnostic, limits, owner, and
  retained objects.
- [ ] Inspect or resume authority is fresh and binds the unchanged prior receipt, root, targets, markers, and
  package identity.
- [ ] Removal authority separately names each target, and direct evidence proves its marker, containment,
  complete operation-created effects, and absence of foreign state.
- [ ] Any target with incomplete proof remains preserved, and the receipt names the first safe continuation.
