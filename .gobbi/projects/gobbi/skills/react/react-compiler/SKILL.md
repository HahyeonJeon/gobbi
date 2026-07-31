---
name: react-compiler
description: "MUST load when React Compiler configuration, diagnostics, coverage, migration, memoization, or compiler-related performance is in scope."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# React Compiler

Use this lookup tool when a React browser application or Electron renderer configures, evaluates, migrates,
or troubleshoots React Compiler or changes memoization under compiler coverage.

This child owns compiler configuration, diagnostics, coverage, incremental adoption, and the compiler-facing
memoization boundary. React design, generic build tooling, framework integration, and performance measurement
remain with their own owners.

Apply the installed compiler, React, linter, and build-tool contract. Do not infer configuration or coverage
from a neighboring project or version.

## Principles

### Coverage is a function-level fact

A configured compiler is not proof that every component or Hook is compiled. Establish the actual coverage
of each affected function before changing code on that assumption.

### Diagnostics guide adoption

Compiler diagnostics identify code it cannot safely optimize and may cause selective skipping. Treat them as
evidence about coverage and React correctness rather than permission to hide the diagnostic.

### Preserve proven behavior during migration

Automatic optimization can replace much new manual memoization, but removing existing memoization may change
compiler output or identity behavior. Migrate in measured, reversible slices.

## Rules

- **MUST inspect the installed React Compiler, React, linter, build tool, and framework integration before
  applying this manual.** Record their versions, configuration files, plugins, commands, and supported
  compatibility path.

- **MUST validate configuration against the installed
  [compiler options](https://react.dev/reference/react-compiler/configuration).** Record the active
  `compilationMode`, React compatibility setting, gating, and any other non-default option that affects
  coverage or runtime selection.

- **MUST establish actual compiler coverage for every affected component or Hook.** A package, plugin, or
  project-level enablement flag alone is insufficient.

- **MUST treat React Compiler and
  [Hooks lint diagnostics](https://react.dev/reference/eslint-plugin-react-hooks) as evidence.** Repair an
  applicable Rules-of-React cause or record the intentional skipped coverage; never suppress a diagnostic to
  claim compilation.

- **MUST preserve existing manual memoization unless focused evidence supports changing it.** React's
  [compiler guidance](https://react.dev/learn/react-compiler/introduction#what-should-i-do-about-usememo-usecallback-and-reactmemo)
  warns that removal can change compilation output.

- **NEVER claim a performance improvement from compilation without measurement.** Compiler output or a green
  build proves transformation, not user-visible latency, resource, or responsiveness gains.

## Manual

### Establish the compiler contract

- Locate the compiler plugin or framework switch, React compatibility setting, lint preset, and build command.
- Read the live option values rather than assuming defaults. Distinguish no compiler, partial or gated
  adoption, annotation-driven adoption, and broad adoption.
- Confirm that the installed build-tool integration is supported by the current
  [compiler introduction](https://react.dev/learn/react-compiler/introduction).

### Interpret configuration and gating

- `compilationMode` controls which functions are candidates; record the installed option and selection
  behavior instead of reducing it to enabled or disabled.
- Runtime gating controls whether compiled output is selected, while compilation coverage records whether
  optimized output exists. Verify both when gating is present.
- Treat misspelled, unsupported, or wrong-typed options as configuration failures; use the official
  [`config` lint](https://react.dev/reference/eslint-plugin-react-hooks/lints/config) when available.

### Inspect diagnostics and coverage

- Use the installed lint, compiler, build output, or supported inspection surface to establish whether each
  affected component or Hook compiled, skipped, or failed.
- Trace a diagnostic to the applicable Rules-of-React, unsupported syntax, incompatible library, or
  configuration owner. Repair the cause when in scope and recheck actual coverage.
- Do not require immediate cleanup of every unrelated diagnostic; keep skipped functions and resulting
  limitations visible.

### Choose memoization under the real contract

- For new code proven to compile, prefer compiler optimization and add `memo`, `useMemo`, or `useCallback`
  only for measured work, a required identity consumer, or a documented escape hatch.
- For uncompiled code, use the ordinary React design and measurement path; compiler availability elsewhere
  does not optimize the function.
- For existing manual memoization, keep it until focused tests and measurement show that removal preserves
  behavior, identity requirements, compiler coverage, and performance.

### Adopt or recover incrementally

- Change one bounded area, run correctness tests, lint and build checks, confirm coverage, and measure the
  affected behavior before expanding.
- When behavior or performance regresses, restore the last proven boundary, inspect configuration, coverage,
  and identity assumptions, then retry the smallest corrected slice.
- Record compiler state, affected functions, diagnostics, commands, coverage evidence, measurements, and
  remaining skips in the handoff.

## References

- [React Compiler Checklist](checklists.md)
