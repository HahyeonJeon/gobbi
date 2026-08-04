# CLI Product Lifecycle Overlay

Select this overlay only from accepted command-line Product evidence. It covers people and automation without
creating separate Products for invocation modes.

## Project

## Product

- [cli-install-first-run] How does a human or automated consumer install, configure, authenticate, and verify first CLI readiness?

- [cli-human-automation] How does the same Product task behave in interactive and noninteractive CLI modes?

- [cli-stream-status] For each selected lifecycle outcome, how do the accepted standard-output, standard-error, and exit-status contracts make it unambiguous?

- [cli-interruption-partial-effect] After cancellation, timeout, or signal, what partial effects remain and how may the caller retry, reconcile, or stop?

- [cli-environment-failure] Without a terminal or with missing configuration, credentials, permission, or network, how does the CLI refuse or recover safely?

- [cli-version-transition] Across update, downgrade, deprecation, or retirement, how are scripts, configuration, and data preserved or refused safely?

- [cli-operator-diagnostics] How can an operator diagnose CLI failure without corrupting standard output or exposing protected data?

- [cli-self-discovery] Which stable help, version, completion, and example surfaces let a consumer discover supported commands and identify the current contract?
  - **Example:** `--help` lists supported commands and `--version` identifies the installed contract.

- [cli-configuration-precedence] When arguments, environment variables, and project, user, or system configuration disagree, which value wins and how can the consumer inspect the effective configuration?

## Implementation
