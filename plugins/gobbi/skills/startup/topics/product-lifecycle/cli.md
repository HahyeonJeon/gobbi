# CLI Product Lifecycle Overlay

Select this overlay only from accepted command-line Product evidence. It covers people and automation without
creating separate Products for invocation modes.

## Project

## Product

- [cli-install-first-run] How does a human or automated consumer install, configure, authenticate, and verify first CLI readiness?
  - **Owner:** CLI access-promise owner
  - **Purpose:** Exercise CLI install and first usable command
  - **Oracle:** A human or automation reaches a verified first usable command or actionable refusal
  - **Activation evidence:** Accepted evidence establishes an independently useful CLI with install, configuration, or authentication needs
  - **Source aliases:** NEW

- [cli-human-automation] How does the same Product task behave in interactive and noninteractive CLI modes?
  - **Owner:** CLI interaction-promise owner
  - **Purpose:** Define one Product task across human and automation modes
  - **Oracle:** Each supported mode exposes the same promised outcome with mode-appropriate interaction
  - **Activation evidence:** Accepted evidence establishes support for both interactive and noninteractive modes
  - **Source aliases:** NEW

- [cli-stream-status] For each selected lifecycle outcome, how do the accepted standard-output, standard-error, and exit-status contracts make it unambiguous?
  - **Owner:** CLI outcome-mapping owner
  - **Purpose:** Apply accepted stream and status contracts to lifecycle outcomes
  - **Oracle:** The caller distinguishes each outcome without corrupting machine output
  - **Activation evidence:** Accepted evidence establishes machine-consumed output or distinct status contracts
  - **Source aliases:** NEW

- [cli-interruption-partial-effect] After cancellation, timeout, or signal, what partial effects remain and how may the caller retry, reconcile, or stop?
  - **Owner:** CLI interruption-promise owner
  - **Purpose:** Define effects and reconciliation after CLI interruption
  - **Oracle:** The caller detects partial effects and can safely retry, reconcile, or stop
  - **Activation evidence:** Accepted evidence establishes long-running work, signals, cancellation, timeout, or non-atomic effects
  - **Source aliases:** NEW

- [cli-environment-failure] Without a terminal or with missing configuration, credentials, permission, or network, how does the CLI refuse or recover safely?
  - **Owner:** CLI runtime-refusal owner
  - **Purpose:** Define safe CLI behavior when required runtime facilities are absent
  - **Oracle:** The caller receives stable safe refusal or actionable recovery with protected state
  - **Activation evidence:** Accepted evidence establishes dependency on a terminal, configuration, credentials, permission, or network
  - **Source aliases:** NEW

- [cli-version-transition] Across update, downgrade, deprecation, or retirement, how are scripts, configuration, and data preserved or refused safely?
  - **Owner:** CLI compatibility-transition owner
  - **Purpose:** Preserve or safely refuse CLI automation and state across version transition
  - **Oracle:** Automation remains compatible or receives stable safe refusal and a migration path
  - **Activation evidence:** Accepted evidence establishes versioned distribution or public CLI contracts
  - **Source aliases:** NEW

- [cli-operator-diagnostics] How can an operator diagnose CLI failure without corrupting standard output or exposing protected data?
  - **Owner:** CLI diagnostic-support owner
  - **Purpose:** Expose actionable diagnosis while protecting streams and secrets
  - **Oracle:** The operator identifies failure while machine output remains valid and secrets remain protected
  - **Activation evidence:** Accepted evidence establishes CLI automation, operation, or support duty
  - **Source aliases:** NEW

## Implementation
