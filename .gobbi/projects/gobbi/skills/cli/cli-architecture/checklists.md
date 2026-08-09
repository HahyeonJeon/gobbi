# CLI Architecture Checklist

This reusable unchecked source evaluates one mechanism-free semantic command and automation contract governed
by [`cli-architecture`](SKILL.md), frozen for this source at SHA-256
`b3faf20e8fe3d0a44c810e2c906917b176eb4005cf259140df22f317972cd5bb`. Its stable owner prefix is `CLIARCH`.

The subject includes command hierarchy, command, option, operand, configuration, stdin, semantic events,
stdout and stderr roles, public modes, result and error models, command states, exit statuses, compatibility,
deprecation, and retirement. Interface expression, current Platform facts, Security assurance, TypeScript and
Bun mechanisms, tests, package or direct-delivery behavior, and target support remain outside this source.
Every condition stays unchecked and contains no observation, answer, score, remediation, or verdict.

## Lifecycle Categories

### Design lifecycle

- **Outcome and actor model:** turn human and automation needs into one mechanism-free command outcome with
  complete normal, invalid, failed, interrupted, partial, and recovery meaning.
- **Command and input structure:** choose canonical resource and workflow paths, option and operand roles,
  stdin use, aliases, repetition, and configuration meaning without parser assumptions.
- **Semantic channel and mode model:** define results, diagnostics, progress, prompts, state, stream roles,
  public profiles, completion, and exit meaning independently from presentation.
- **Compatibility decision:** choose additive change, exception, deprecation, replacement, and retirement
  boundaries for every public semantic surface.
- **Owner handoff:** separate Architecture judgment from Interface, Platform, Security, Development, Release,
  and TypeScript owner results.

### Development lifecycle

- **Contract realization handoff:** supply one complete accepted semantic contract to implementation and
  evidence owners without prescribing their mechanisms.
- **Contradiction and reopen:** return implementation or evidence conflicts to the earliest semantic decision.
- **Dependent evidence state:** identify which interface, security, testing, packaging, delivery, development,
  or release result becomes stale after a semantic change.
- **Contract record maintenance:** keep command, input, state, schema, stream, exit, deprecation, and retirement
  records aligned with the accepted product meaning.

### Product lifecycle

- **Discovery and invocation:** let people find one canonical route, supply valid input, reject ambiguity, and
  compose commands without accidental effects.
- **Automation consumption:** preserve deterministic streams, modes, schemas, completion, configuration, and
  exits across redirection, pipes, CI, locale, and terminal differences.
- **Failure and recovery:** expose invalid, operational, interrupted, partial, and recovered states without
  false success or hidden retained effects.
- **Evolution and exit:** preserve accepted consumers through aliases, schema and config evolution,
  deprecation windows, replacements, and retirement.

## Scenario Hierarchy

### Design lifecycle

- Outcome and actor model
  - One outcome serves people and automation
    - `CLIARCH-SC-DESIGN-OUTCOME-01` — A supported command has one profile-independent semantic outcome.
  - The command can change or retain state
    - `CLIARCH-SC-DESIGN-OUTCOME-02` — Every applicable effect and incomplete state has explicit meaning.
- Command and input structure
  - Repeated resource operations
    - `CLIARCH-SC-DESIGN-STRUCTURE-01` — A resource group gives repeated operations one canonical route.
  - Dominant cross-resource work
    - `CLIARCH-SC-DESIGN-STRUCTURE-02` — A shallow workflow is justified without duplicating an outcome.
  - Option and operand boundaries
    - `CLIARCH-SC-DESIGN-GRAMMAR-01` — Option-shaped data and repeated inputs remain unambiguous.
  - Configuration from several sources
    - `CLIARCH-SC-DESIGN-CONFIG-01` — Source discovery, precedence, merge, conflict, and origin are deterministic.
  - Undisclosed ambient input
    - `CLIARCH-SC-DESIGN-CONFIG-02` — An ambient source cannot alter behavior outside the accepted model.
- Semantic channel and mode model
  - Requested data and diagnostics coexist
    - `CLIARCH-SC-DESIGN-STREAM-01` — Result and diagnostic channels keep distinct semantic roles.
  - One bounded machine result
    - `CLIARCH-SC-DESIGN-MODE-01` — JSON has a complete versioned result contract.
  - Incremental machine results
    - `CLIARCH-SC-DESIGN-MODE-02` — JSONL defines record validity and command completion.
  - Invocation and operational failures differ
    - `CLIARCH-SC-DESIGN-EXIT-01` — Exit classes preserve stable automation meaning.
- Compatibility decision
  - Additive surface growth
    - `CLIARCH-SC-DESIGN-COMPAT-01` — A new surface preserves every accepted old invocation.
  - Rename or removal
    - `CLIARCH-SC-DESIGN-COMPAT-02` — Replacement, deprecation, recovery, and retirement remain observable.
- Owner handoff
  - Semantic decision reaches another owner
    - `CLIARCH-SC-DESIGN-OWNER-01` — Each non-Architecture judgment routes to its exact owner.

### Development lifecycle

- Contract realization handoff
  - Implementation receives the product contract
    - `CLIARCH-SC-DEVELOP-HANDOFF-01` — The handoff is complete without choosing a mechanism.
  - Evidence receives observable expectations
    - `CLIARCH-SC-DEVELOP-HANDOFF-02` — Expected behavior is distinct from its test method and result.
- Contradiction and reopen
  - Implementation cannot preserve accepted meaning
    - `CLIARCH-SC-DEVELOP-REOPEN-01` — A semantic contradiction reopens Architecture rather than changing meaning silently.
  - A Platform fact changes
    - `CLIARCH-SC-DEVELOP-REOPEN-02` — Changed facts reopen only the semantic decision that consumed them.
- Dependent evidence state
  - A machine schema changes
    - `CLIARCH-SC-DEVELOP-STALE-01` — Every dependent expression and consumer result is identified as current or stale.
  - A command or stream role changes
    - `CLIARCH-SC-DEVELOP-STALE-02` — Every affected owner result is invalidated or proved unaffected.
- Contract record maintenance
  - Delivered forms expose the same logical command
    - `CLIARCH-SC-DEVELOP-RECORD-01` — The semantic contract stays common while artifact identities stay separate.
  - Contract records disagree
    - `CLIARCH-SC-DEVELOP-RECORD-02` — One accepted semantic owner resolves the disagreement.

### Product lifecycle

- Discovery and invocation
  - A person starts at the root or group
    - `CLIARCH-SC-PRODUCT-DISCOVER-01` — Bare discovery is useful, side-effect-free, and successful.
  - Help targets a recognized command
    - `CLIARCH-SC-PRODUCT-DISCOVER-02` — Explicit help bypasses required inputs and effects.
  - The command path is unknown or ambiguous
    - `CLIARCH-SC-PRODUCT-INVOKE-01` — Invalid input fails without executing a suggestion.
  - Input resembles an option
    - `CLIARCH-SC-PRODUCT-INVOKE-02` — The consumer can supply the exact operand without reinterpretation.
- Automation consumption
  - stdout is redirected while stderr remains interactive
    - `CLIARCH-SC-PRODUCT-AUTOMATE-01` — Per-stream presentation changes preserve one semantic contract.
  - Locale or terminal state changes
    - `CLIARCH-SC-PRODUCT-AUTOMATE-02` — Structured keys, codes, values, and exits retain meaning.
  - A pipeline consumer closes early
    - `CLIARCH-SC-PRODUCT-AUTOMATE-03` — Consumer closure has an effect-aware completion meaning.
  - CI cannot provide interactive input
    - `CLIARCH-SC-PRODUCT-AUTOMATE-04` — Every required input has an explicit non-interactive route or exact failure.
- Failure and recovery
  - Configuration is malformed or conflicting
    - `CLIARCH-SC-PRODUCT-FAILURE-01` — Invalid configuration fails before product mutation.
  - Work stops after some effects
    - `CLIARCH-SC-PRODUCT-FAILURE-02` — Partial state and recovery remain exact and observable.
  - Interruption occurs
    - `CLIARCH-SC-PRODUCT-FAILURE-03` — Retained effects and authoritative state determine recovery.
  - Output looks successful while an effect failed
    - `CLIARCH-SC-PRODUCT-FAILURE-04` — False completion is rejected.
- Evolution and exit
  - An old alias remains in its compatibility window
    - `CLIARCH-SC-PRODUCT-EVOLVE-01` — The alias preserves old meaning and identifies the canonical replacement.
  - A structured schema evolves
    - `CLIARCH-SC-PRODUCT-EVOLVE-02` — Consumers can distinguish compatible growth from a version transition.
  - A configuration source is replaced
    - `CLIARCH-SC-PRODUCT-EVOLVE-03` — Precedence and migration remain unambiguous during the window.
  - A command is retired
    - `CLIARCH-SC-PRODUCT-RETIRE-01` — Detection, replacement or recovery, and support boundary remain visible.

## Checklist Conditions

### Design lifecycle > Outcome and actor model > One outcome serves people and automation > CLIARCH-SC-DESIGN-OUTCOME-01

- [ ] CLIARCH-CK-DESIGN-OUTCOME-01-01 — The contract names each affected human consumer.
- [ ] CLIARCH-CK-DESIGN-OUTCOME-01-02 — The contract names each affected automation consumer.
- [ ] CLIARCH-CK-DESIGN-OUTCOME-01-03 — The contract states one profile-independent semantic success result.
- [ ] CLIARCH-CK-DESIGN-OUTCOME-01-04 — Every public mode preserves the same command effect.

### Design lifecycle > Outcome and actor model > The command can change or retain state > CLIARCH-SC-DESIGN-OUTCOME-02

- [ ] CLIARCH-CK-DESIGN-OUTCOME-02-01 — The contract names every applicable read-only state.
- [ ] CLIARCH-CK-DESIGN-OUTCOME-02-02 — The contract names every applicable mutating state.
- [ ] CLIARCH-CK-DESIGN-OUTCOME-02-03 — The contract states the authoritative state after interruption.
- [ ] CLIARCH-CK-DESIGN-OUTCOME-02-04 — Every supported partial result identifies its completeness.
- [ ] CLIARCH-CK-DESIGN-OUTCOME-02-05 — Every retained effect has a recovery obligation.

### Design lifecycle > Command and input structure > Repeated resource operations > CLIARCH-SC-DESIGN-STRUCTURE-01

- [ ] CLIARCH-CK-DESIGN-STRUCTURE-01-01 — Each repeated resource outcome has one canonical resource route.
- [ ] CLIARCH-CK-DESIGN-STRUCTURE-01-02 — Resource group names use stable product nouns.
- [ ] CLIARCH-CK-DESIGN-STRUCTURE-01-03 — Resource operation names use stable product actions.

### Design lifecycle > Command and input structure > Dominant cross-resource work > CLIARCH-SC-DESIGN-STRUCTURE-02

- [ ] CLIARCH-CK-DESIGN-STRUCTURE-02-01 — Each shallow workflow names the dominant end-to-end outcome it serves.
- [ ] CLIARCH-CK-DESIGN-STRUCTURE-02-02 — Each shallow workflow records why no single resource owns its outcome.
- [ ] CLIARCH-CK-DESIGN-STRUCTURE-02-03 — No resource route competes as another canonical spelling of that workflow.

### Design lifecycle > Command and input structure > Option and operand boundaries > CLIARCH-SC-DESIGN-GRAMMAR-01

- [ ] CLIARCH-CK-DESIGN-GRAMMAR-01-01 — Every token position has one command, option, operand, or passthrough meaning.
- [ ] CLIARCH-CK-DESIGN-GRAMMAR-01-02 — `--` ends option parsing for option-shaped operands or passthrough input.
- [ ] CLIARCH-CK-DESIGN-GRAMMAR-01-03 — Every repeated option or operand has one declared repetition meaning.
- [ ] CLIARCH-CK-DESIGN-GRAMMAR-01-04 — A short-option cluster contains no valued option.
- [ ] CLIARCH-CK-DESIGN-GRAMMAR-01-05 — A local option does not shadow a global option name.

### Design lifecycle > Command and input structure > Configuration from several sources > CLIARCH-SC-DESIGN-CONFIG-01

- [ ] CLIARCH-CK-DESIGN-CONFIG-01-01 — The contract lists every accepted configuration source.
- [ ] CLIARCH-CK-DESIGN-CONFIG-01-02 — The contract states one low-to-high source precedence.
- [ ] CLIARCH-CK-DESIGN-CONFIG-01-03 — Explicit config-file selection has one declared effect on discovery.
- [ ] CLIARCH-CK-DESIGN-CONFIG-01-04 — Object-merge semantics are explicit when applicable.
- [ ] CLIARCH-CK-DESIGN-CONFIG-01-05 — List semantics are explicit when applicable.
- [ ] CLIARCH-CK-DESIGN-CONFIG-01-06 — `null` semantics are explicit when applicable.
- [ ] CLIARCH-CK-DESIGN-CONFIG-01-07 — Unset semantics are explicit when applicable.
- [ ] CLIARCH-CK-DESIGN-CONFIG-01-08 — Duplicate-source semantics are explicit when applicable.
- [ ] CLIARCH-CK-DESIGN-CONFIG-01-09 — Configuration-conflict semantics are explicit when applicable.
- [ ] CLIARCH-CK-DESIGN-CONFIG-01-10 — Effective-value origin is available without disclosing a secret value.

### Design lifecycle > Command and input structure > Undisclosed ambient input > CLIARCH-SC-DESIGN-CONFIG-02

- [ ] CLIARCH-CK-DESIGN-CONFIG-02-01 — No environment, runtime, working-directory, or file source changes behavior unless the contract names it.
- [ ] CLIARCH-CK-DESIGN-CONFIG-02-02 — Every newly discovered ambient source reopens configuration design.

### Design lifecycle > Semantic channel and mode model > Requested data and diagnostics coexist > CLIARCH-SC-DESIGN-STREAM-01

- [ ] CLIARCH-CK-DESIGN-STREAM-01-01 — Requested results have stdout as their semantic channel.
- [ ] CLIARCH-CK-DESIGN-STREAM-01-02 — Errors have stderr as their semantic channel.
- [ ] CLIARCH-CK-DESIGN-STREAM-01-03 — Warnings have stderr as their semantic channel.
- [ ] CLIARCH-CK-DESIGN-STREAM-01-04 — Progress has stderr as its semantic channel.
- [ ] CLIARCH-CK-DESIGN-STREAM-01-05 — Prompts use stderr while their accepted response uses stdin.

### Design lifecycle > Semantic channel and mode model > One bounded machine result > CLIARCH-SC-DESIGN-MODE-01

- [ ] CLIARCH-CK-DESIGN-MODE-01-01 — JSON stdout contains exactly one complete versioned semantic envelope.
- [ ] CLIARCH-CK-DESIGN-MODE-01-02 — Ordinary JSON failure emits no partial JSON document.
- [ ] CLIARCH-CK-DESIGN-MODE-01-03 — Any supported JSON partial result is one complete envelope with explicit completeness.

### Design lifecycle > Semantic channel and mode model > Incremental machine results > CLIARCH-SC-DESIGN-MODE-02

- [ ] CLIARCH-CK-DESIGN-MODE-02-01 — Every JSONL line is one complete versioned record or event.
- [ ] CLIARCH-CK-DESIGN-MODE-02-02 — The contract states whether records before failure remain valid.
- [ ] CLIARCH-CK-DESIGN-MODE-02-03 — The protocol has a terminal completion or error event when completeness matters.

### Design lifecycle > Semantic channel and mode model > Invocation and operational failures differ > CLIARCH-SC-DESIGN-EXIT-01

- [ ] CLIARCH-CK-DESIGN-EXIT-01-01 — Complete success has status `0`.
- [ ] CLIARCH-CK-DESIGN-EXIT-01-02 — Operational or domain failure has status `1` unless a documented stable distinction applies.
- [ ] CLIARCH-CK-DESIGN-EXIT-01-03 — Invocation or input-shape failure has status `2`.
- [ ] CLIARCH-CK-DESIGN-EXIT-01-04 — Every additional code has one stable automation meaning.
- [ ] CLIARCH-CK-DESIGN-EXIT-01-05 — Signal-derived or conventional process statuses are claimed only for the exact exposed target.

### Design lifecycle > Compatibility decision > Additive surface growth > CLIARCH-SC-DESIGN-COMPAT-01

- [ ] CLIARCH-CK-DESIGN-COMPAT-01-01 — An accepted old invocation retains its command meaning.
- [ ] CLIARCH-CK-DESIGN-COMPAT-01-02 — A new option does not create an old-token ambiguity.
- [ ] CLIARCH-CK-DESIGN-COMPAT-01-03 — An additive structured field preserves the documented schema rule.

### Design lifecycle > Compatibility decision > Rename or removal > CLIARCH-SC-DESIGN-COMPAT-02

- [ ] CLIARCH-CK-DESIGN-COMPAT-02-01 — A renamed surface identifies one canonical replacement.
- [ ] CLIARCH-CK-DESIGN-COMPAT-02-02 — Deprecation is machine-identifiable without corrupting the requested result.
- [ ] CLIARCH-CK-DESIGN-COMPAT-02-03 — The accepted compatibility window is explicit.
- [ ] CLIARCH-CK-DESIGN-COMPAT-02-04 — Retirement includes an observable detection result.
- [ ] CLIARCH-CK-DESIGN-COMPAT-02-05 — Retirement includes a replacement or recovery path.

### Design lifecycle > Owner handoff > Semantic decision reaches another owner > CLIARCH-SC-DESIGN-OWNER-01

- [ ] CLIARCH-CK-DESIGN-OWNER-01-01 — Help expression routes to `cli-interface`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-02 — Terminal wording routes to `cli-interface`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-03 — Rendering routes to `cli-interface`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-04 — Prompt expression routes to `cli-interface`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-05 — Progress expression routes to `cli-interface`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-06 — Visualization routes to `cli-interface`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-07 — Accessibility expression routes to `cli-interface`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-08 — Localization expression routes to `cli-interface`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-09 — Current execution-platform facts route to `cli-platform`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-10 — Trust assurance routes to `cli-security`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-11 — Authority assurance routes to `cli-security`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-12 — Multi-owner lifecycle state routes to `cli-development`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-13 — Multi-owner handoff routes to `cli-development`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-14 — Runtime-target judgment routes to `cli-release`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-15 — Artifact-support judgment routes to `cli-release`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-16 — Installation-compatibility judgment routes to `cli-release`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-17 — Data-compatibility judgment routes to `cli-release`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-18 — Update-policy judgment routes to `cli-release`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-19 — Support judgment routes to `cli-release`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-20 — Readiness judgment routes to `cli-release`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-21 — TypeScript implementation routes to `typescript-development`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-22 — Type modeling routes to `typescript-typing`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-23 — Runtime mechanisms route to `typescript-toolchain`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-24 — Compiler mechanisms route to `typescript-toolchain`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-25 — Module mechanisms route to `typescript-toolchain`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-26 — Build mechanisms route to `typescript-toolchain`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-27 — Process behavior proof routes to `typescript-testing`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-28 — Package-backed artifacts route to `typescript-packaging`.
- [ ] CLIARCH-CK-DESIGN-OWNER-01-29 — Direct non-archive units route to `typescript-cli-delivery`.

### Development lifecycle > Contract realization handoff > Implementation receives the product contract > CLIARCH-SC-DEVELOP-HANDOFF-01

- [ ] CLIARCH-CK-DEVELOP-HANDOFF-01-01 — The handoff contains every accepted semantic input.
- [ ] CLIARCH-CK-DEVELOP-HANDOFF-01-02 — The handoff contains every accepted semantic result.
- [ ] CLIARCH-CK-DEVELOP-HANDOFF-01-03 — The handoff contains every accepted failure state.
- [ ] CLIARCH-CK-DEVELOP-HANDOFF-01-04 — The handoff contains every accepted recovery state.
- [ ] CLIARCH-CK-DEVELOP-HANDOFF-01-05 — The handoff names no parser as product policy.
- [ ] CLIARCH-CK-DEVELOP-HANDOFF-01-06 — The handoff names no renderer as product policy.
- [ ] CLIARCH-CK-DEVELOP-HANDOFF-01-07 — The handoff names no compiler flag as product policy.
- [ ] CLIARCH-CK-DEVELOP-HANDOFF-01-08 — The handoff names no build command as product policy.
- [ ] CLIARCH-CK-DEVELOP-HANDOFF-01-09 — The handoff names no package mechanism as product policy.

### Development lifecycle > Contract realization handoff > Evidence receives observable expectations > CLIARCH-SC-DEVELOP-HANDOFF-02

- [ ] CLIARCH-CK-DEVELOP-HANDOFF-02-01 — Each behavior claim has an observable expected outcome.
- [ ] CLIARCH-CK-DEVELOP-HANDOFF-02-02 — The Architecture contract contains no test procedure or result.

### Development lifecycle > Contradiction and reopen > Implementation cannot preserve accepted meaning > CLIARCH-SC-DEVELOP-REOPEN-01

- [ ] CLIARCH-CK-DEVELOP-REOPEN-01-01 — A mechanism limitation cannot silently weaken the accepted result.
- [ ] CLIARCH-CK-DEVELOP-REOPEN-01-02 — The contradiction returns to the earliest affected Architecture decision.

### Development lifecycle > Contradiction and reopen > A Platform fact changes > CLIARCH-SC-DEVELOP-REOPEN-02

- [ ] CLIARCH-CK-DEVELOP-REOPEN-02-01 — The changed fact retains its exact tuple at handoff.
- [ ] CLIARCH-CK-DEVELOP-REOPEN-02-02 — The changed fact retains its exact bounds at handoff.
- [ ] CLIARCH-CK-DEVELOP-REOPEN-02-03 — Only semantic decisions that consumed the changed fact reopen.
- [ ] CLIARCH-CK-DEVELOP-REOPEN-02-04 — A Platform fact is not converted into product support.

### Development lifecycle > Dependent evidence state > A machine schema changes > CLIARCH-SC-DEVELOP-STALE-01

- [ ] CLIARCH-CK-DEVELOP-STALE-01-01 — Every affected Interface expression is identified.
- [ ] CLIARCH-CK-DEVELOP-STALE-01-02 — Every affected automation-consumer result is identified.
- [ ] CLIARCH-CK-DEVELOP-STALE-01-03 — Each dependent result is marked current, stale, or proved unaffected.

### Development lifecycle > Dependent evidence state > A command or stream role changes > CLIARCH-SC-DEVELOP-STALE-02

- [ ] CLIARCH-CK-DEVELOP-STALE-02-01 — Every affected Security result is identified.
- [ ] CLIARCH-CK-DEVELOP-STALE-02-02 — Every affected Testing result is identified.
- [ ] CLIARCH-CK-DEVELOP-STALE-02-03 — Every affected Packaging consumer result is identified.
- [ ] CLIARCH-CK-DEVELOP-STALE-02-04 — Every affected CLI Delivery consumer result is identified.
- [ ] CLIARCH-CK-DEVELOP-STALE-02-05 — Every affected Development result is identified.
- [ ] CLIARCH-CK-DEVELOP-STALE-02-06 — Every affected Release result is identified.

### Development lifecycle > Contract record maintenance > Delivered forms expose the same logical command > CLIARCH-SC-DEVELOP-RECORD-01

- [ ] CLIARCH-CK-DEVELOP-RECORD-01-01 — A package-backed form references the accepted semantic contract for its claimed command behavior.
- [ ] CLIARCH-CK-DEVELOP-RECORD-01-02 — A direct form references the accepted semantic contract for its claimed command behavior.
- [ ] CLIARCH-CK-DEVELOP-RECORD-01-03 — A package-backed form retains its own artifact identity.
- [ ] CLIARCH-CK-DEVELOP-RECORD-01-04 — A direct form retains its own artifact identity.
- [ ] CLIARCH-CK-DEVELOP-RECORD-01-05 — A result for one delivery form does not establish the other form.

### Development lifecycle > Contract record maintenance > Contract records disagree > CLIARCH-SC-DEVELOP-RECORD-02

- [ ] CLIARCH-CK-DEVELOP-RECORD-02-01 — One current Architecture record is authoritative for semantic meaning.
- [ ] CLIARCH-CK-DEVELOP-RECORD-02-02 — A stale conflicting record is not presented as another valid contract.

### Product lifecycle > Discovery and invocation > A person starts at the root or group > CLIARCH-SC-PRODUCT-DISCOVER-01

- [ ] CLIARCH-CK-PRODUCT-DISCOVER-01-01 — Bare root discovery performs no product effect.
- [ ] CLIARCH-CK-PRODUCT-DISCOVER-01-02 — Bare group discovery performs no product effect.
- [ ] CLIARCH-CK-PRODUCT-DISCOVER-01-03 — Successful discovery uses status `0`.
- [ ] CLIARCH-CK-PRODUCT-DISCOVER-01-04 — Discovery identifies each canonical resource route.
- [ ] CLIARCH-CK-PRODUCT-DISCOVER-01-05 — Discovery identifies each canonical workflow route.

### Product lifecycle > Discovery and invocation > Help targets a recognized command > CLIARCH-SC-PRODUCT-DISCOVER-02

- [ ] CLIARCH-CK-PRODUCT-DISCOVER-02-01 — Explicit help for a recognized path requires no effect-bearing operand.
- [ ] CLIARCH-CK-PRODUCT-DISCOVER-02-02 — Explicit help performs no product effect.
- [ ] CLIARCH-CK-PRODUCT-DISCOVER-02-03 — Root version conflicts with a command path or effect-bearing option.

### Product lifecycle > Discovery and invocation > The command path is unknown or ambiguous > CLIARCH-SC-PRODUCT-INVOKE-01

- [ ] CLIARCH-CK-PRODUCT-INVOKE-01-01 — An unknown path has status `2`.
- [ ] CLIARCH-CK-PRODUCT-INVOKE-01-02 — An ambiguous input has status `2`.
- [ ] CLIARCH-CK-PRODUCT-INVOKE-01-03 — A suggestion never executes the suggested command.
- [ ] CLIARCH-CK-PRODUCT-INVOKE-01-04 — Invalid invocation performs no product effect.

### Product lifecycle > Discovery and invocation > Input resembles an option > CLIARCH-SC-PRODUCT-INVOKE-02

- [ ] CLIARCH-CK-PRODUCT-INVOKE-02-01 — `--` permits an option-shaped operand when that operand is valid.
- [ ] CLIARCH-CK-PRODUCT-INVOKE-02-02 — An undeclared option-shaped token is not silently reinterpreted.
- [ ] CLIARCH-CK-PRODUCT-INVOKE-02-03 — A negative numeric token follows the declared operand schema.

### Product lifecycle > Automation consumption > stdout is redirected while stderr remains interactive > CLIARCH-SC-PRODUCT-AUTOMATE-01

- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-01-01 — stdout retains requested result data after redirection.
- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-01-02 — stderr retains diagnostic meaning when its presentation adapts independently.
- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-01-03 — Redirection changes no command effect or exit meaning.

### Product lifecycle > Automation consumption > Locale or terminal state changes > CLIARCH-SC-PRODUCT-AUTOMATE-02

- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-02-01 — Structured keys retain their spelling across locale changes.
- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-02-02 — Stable codes retain their meaning across locale changes.
- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-02-03 — Terminal width or capability changes no structured value.
- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-02-04 — Terminal state changes no exit meaning.

### Product lifecycle > Automation consumption > A pipeline consumer closes early > CLIARCH-SC-PRODUCT-AUTOMATE-03

- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-03-01 — A read-only producer has an explicit downstream-closure result.
- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-03-02 — A mutating command does not infer effect cancellation from stdout closure.
- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-03-03 — Retained effects remain reportable from authoritative state.

### Product lifecycle > Automation consumption > CI cannot provide interactive input > CLIARCH-SC-PRODUCT-AUTOMATE-04

- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-04-01 — Every required prompt value has an explicit non-interactive source when the path supports automation.
- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-04-02 — Missing non-interactive input cannot cause an indefinite prompt.
- [ ] CLIARCH-CK-PRODUCT-AUTOMATE-04-03 — Missing accepted input reports the exact supplying route.

### Product lifecycle > Failure and recovery > Configuration is malformed or conflicting > CLIARCH-SC-PRODUCT-FAILURE-01

- [ ] CLIARCH-CK-PRODUCT-FAILURE-01-01 — Malformed configuration has status `2`.
- [ ] CLIARCH-CK-PRODUCT-FAILURE-01-02 — Conflicting configuration has status `2`.
- [ ] CLIARCH-CK-PRODUCT-FAILURE-01-03 — Configuration rejection occurs before product mutation.

### Product lifecycle > Failure and recovery > Work stops after some effects > CLIARCH-SC-PRODUCT-FAILURE-02

- [ ] CLIARCH-CK-PRODUCT-FAILURE-02-01 — The result identifies every completed effect.
- [ ] CLIARCH-CK-PRODUCT-FAILURE-02-02 — The result identifies every incomplete effect.
- [ ] CLIARCH-CK-PRODUCT-FAILURE-02-03 — The result identifies every retained effect.
- [ ] CLIARCH-CK-PRODUCT-FAILURE-02-04 — The result identifies the supported safe recovery state.

### Product lifecycle > Failure and recovery > Interruption occurs > CLIARCH-SC-PRODUCT-FAILURE-03

- [ ] CLIARCH-CK-PRODUCT-FAILURE-03-01 — The contract distinguishes interruption from invocation failure.
- [ ] CLIARCH-CK-PRODUCT-FAILURE-03-02 — Interruption preserves the authoritative current state.
- [ ] CLIARCH-CK-PRODUCT-FAILURE-03-03 — Retry is available only for an idempotent or explicitly resumable state.

### Product lifecycle > Failure and recovery > Output looks successful while an effect failed > CLIARCH-SC-PRODUCT-FAILURE-04

- [ ] CLIARCH-CK-PRODUCT-FAILURE-04-01 — A failed required effect cannot produce complete-success status.
- [ ] CLIARCH-CK-PRODUCT-FAILURE-04-02 — Human success wording cannot override the semantic exit state.
- [ ] CLIARCH-CK-PRODUCT-FAILURE-04-03 — A partial result cannot omit its incomplete state.

### Product lifecycle > Evolution and exit > An old alias remains in its compatibility window > CLIARCH-SC-PRODUCT-EVOLVE-01

- [ ] CLIARCH-CK-PRODUCT-EVOLVE-01-01 — The alias preserves the accepted old operand meaning.
- [ ] CLIARCH-CK-PRODUCT-EVOLVE-01-02 — The alias preserves the accepted old effect meaning.
- [ ] CLIARCH-CK-PRODUCT-EVOLVE-01-03 — The alias identifies the canonical replacement.
- [ ] CLIARCH-CK-PRODUCT-EVOLVE-01-04 — The alias exposes its deprecation state.

### Product lifecycle > Evolution and exit > A structured schema evolves > CLIARCH-SC-PRODUCT-EVOLVE-02

- [ ] CLIARCH-CK-PRODUCT-EVOLVE-02-01 — Compatible growth follows the documented additive rule.
- [ ] CLIARCH-CK-PRODUCT-EVOLVE-02-02 — An incompatible semantic change uses an explicit version transition.
- [ ] CLIARCH-CK-PRODUCT-EVOLVE-02-03 — TTY or locale state never selects a schema version implicitly.

### Product lifecycle > Evolution and exit > A configuration source is replaced > CLIARCH-SC-PRODUCT-EVOLVE-03

- [ ] CLIARCH-CK-PRODUCT-EVOLVE-03-01 — The replacement source has one declared precedence position.
- [ ] CLIARCH-CK-PRODUCT-EVOLVE-03-02 — Conflict between the old source and the replacement has explicit behavior during the window.
- [ ] CLIARCH-CK-PRODUCT-EVOLVE-03-03 — The migration preserves an observable value origin.

### Product lifecycle > Evolution and exit > A command is retired > CLIARCH-SC-PRODUCT-RETIRE-01

- [ ] CLIARCH-CK-PRODUCT-RETIRE-01-01 — A retired invocation has a machine-identifiable detection result.
- [ ] CLIARCH-CK-PRODUCT-RETIRE-01-02 — The result identifies a replacement or recovery path.
- [ ] CLIARCH-CK-PRODUCT-RETIRE-01-03 — The semantic compatibility window is distinct from target or artifact support.
