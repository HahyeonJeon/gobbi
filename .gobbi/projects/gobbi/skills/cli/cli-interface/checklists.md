# CLI Interface Checklist

This reusable unchecked source evaluates one accepted human and automation expression contract for an exact
line-oriented CLI semantic model and its Architecture-assigned stream roles. It covers help, wording,
`human`, `plain`, `json`, and `jsonl` rendering, diagnostics, prompts, progress, line-oriented visualization,
accessibility, localization, adaptation, and the independent color, progress, input, ASCII, and screen-reader
controls governed by [`cli-interface`](SKILL.md). The source commit containing this file identifies its frozen
version. Its stable owner prefix is `CLIINTF`.

Command meaning, stream-role assignment, parser and configuration semantics, current platform facts,
security requirements, TypeScript implementation and process tests, target support, automatic paging, and
full-screen terminal interfaces remain outside this subject. Route semantic or stream changes to
[`cli-architecture`](../cli-architecture/SKILL.md), current facts to
[`cli-platform`](../cli-platform/SKILL.md), spoofing and trust requirements to
[`cli-security`](../cli-security/SKILL.md), realization to the applicable TypeScript owners, and support
judgment to [`cli-release`](../cli-release/SKILL.md).

The evidence used to derive coverage is the frozen Interface skill, the accepted CLI Ideation, its terminal
and accessibility research, and the Architecture and Platform contracts. A positive claim about what people
using assistive technology can discover, understand, complete, or recover from remains a named evidence gap
until current representative-user evidence covers that exact expression and context.

This file defines coverage only. Every condition is reusable, unchecked, and result-free. The parent
[Evaluation](../../evaluation/SKILL.md) operation owns later observations, answers, findings, and any
criteria-derived verdict.

## Lifecycle Categories

### Design lifecycle

- **Audience and context framing:** identify the people, automation consumers, destinations, terminal states,
  locales, access needs, and evidence limits the expression contract must serve.
- **Semantic handoff:** bind accepted fields, stream roles, profiles, completeness, failure, recovery, and
  security constraints before expression choices begin.
- **Expression alternatives:** compare help structures, line-oriented visual forms, density, interaction,
  and fallback paths against affected contexts.
- **Profile and control contract:** define the four profiles and each independent presentation control,
  including explicit conflicts and overrides.
- **Accessibility and claim boundary:** preserve equivalent meaning without visual-only cues and separate
  requirements from claims that need representative evidence.

### Development lifecycle

- **Expression handoff:** give realizers one complete rendering contract without selecting libraries or
  changing the accepted semantic model.
- **Profile realization:** keep human, plain, and structured protocols consistent across both assigned
  streams and every supported control combination.
- **Interaction and recovery realization:** preserve prompt, progress, interruption, terminal restoration,
  and non-interactive behavior through implementation constraints.
- **Security reconciliation:** express accepted quoting, redaction, and spoofing controls without weakening
  their Security-owned requirements.
- **Change reconciliation:** distinguish a presentation-only revision from one that reopens semantic,
  structured-compatibility, fact, security, or evidence owners.

### Product lifecycle

- **Discovery:** let people and automation find the canonical task, inputs, profiles, effects, exits, and
  recovery from root, group, command, and invalid-invocation expression.
- **Use across destinations:** preserve meaning across independent stdout and stderr TTY states, pipes,
  files, capture, CI, width, color, Unicode, ASCII, locale, and explicit assistive controls.
- **Interaction and failure:** make progress, prompts, diagnostics, partial state, completion, interruption,
  and recovery understandable without hanging or relying on ephemeral output.
- **Evolution:** keep human wording and layout adaptable while structured protocols, accessibility
  obligations, complete-result routes, and deferred scope remain explicit.

## Scenario Hierarchy

### Design lifecycle

- Audience and context framing
  - Complete affected-context map
    - `CLIINTF-SC-DESIGN-CONTEXT-01` — The expression subject covers every materially different consumer and destination.
  - Product-specific accessibility claim
    - `CLIINTF-SC-DESIGN-CONTEXT-02` — A claim about assistive use stays limited to current representative evidence.
- Semantic handoff
  - Complete accepted input
    - `CLIINTF-SC-DESIGN-HANDOFF-01` — Expression begins from a complete current Architecture and Security handoff.
  - Presentation proposal changes meaning
    - `CLIINTF-SC-DESIGN-HANDOFF-02` — A field, stream, status, or compatibility change returns to its owner.
- Expression alternatives
  - Help and discovery hierarchy
    - `CLIINTF-SC-DESIGN-OPTION-01` — Help alternatives expose purpose, safe action, and recovery in a navigable order.
  - Dense comparison rendering
    - `CLIINTF-SC-DESIGN-OPTION-02` — A table is compared with a labeled narrow and assistive alternative.
  - Hierarchy and change rendering
    - `CLIINTF-SC-DESIGN-OPTION-03` — Trees and diffs retain ancestry and change without decoration.
- Profile and control contract
  - Four-profile expression
    - `CLIINTF-SC-DESIGN-PROFILE-01` — Every accepted profile has one complete stream and interaction expression.
  - Independent controls
    - `CLIINTF-SC-DESIGN-CONTROL-01` — Each control affects only its named expression dimension.
  - Cosmetic conflict handling
    - `CLIINTF-SC-DESIGN-CONTROL-02` — Incompatible controls fail visibly instead of being ignored.
- Accessibility and claim boundary
  - Redundant meaning
    - `CLIINTF-SC-DESIGN-ACCESS-01` — Every state and action survives removal of visual-only cues.
  - Screen-reader expression
    - `CLIINTF-SC-DESIGN-ACCESS-02` — Sequential reading retains record identity, progress, failure, and recovery.

### Development lifecycle

- Expression handoff
  - Complete realization input
    - `CLIINTF-SC-DEVELOP-HANDOFF-01` — Realizers receive profiles, controls, states, fallbacks, and owner routes.
  - Mechanism contradicts expression intent
    - `CLIINTF-SC-DEVELOP-HANDOFF-02` — A renderer limitation reopens the earliest affected decision.
- Profile realization
  - Plain output gains terminal decoration
    - `CLIINTF-SC-DEVELOP-PROFILE-01` — Plain output remains append-only and ANSI-free on both streams.
  - Structured stdout and stderr
    - `CLIINTF-SC-DEVELOP-PROFILE-02` — Structured result and diagnostic protocols remain separate and complete.
  - Per-stream adaptation
    - `CLIINTF-SC-DEVELOP-PROFILE-03` — stdout and stderr adapt from their own facts rather than a shared terminal guess.
- Interaction and recovery realization
  - Prompt lifecycle
    - `CLIINTF-SC-DEVELOP-PROMPT-01` — Every prompt state has visible behavior and an exact non-interactive route.
  - Terminal input mode failure
    - `CLIINTF-SC-DEVELOP-PROMPT-02` — Secret-input terminal state restores after every exit path.
  - Progress destination changes
    - `CLIINTF-SC-DEVELOP-PROGRESS-01` — Progress degrades from redraw to sparse append-only or structured records without losing completion.
- Security reconciliation
  - Untrusted text forges the interface
    - `CLIINTF-SC-DEVELOP-SPOOF-01` — Accepted safe representation prevents line, link, bidi, invisible-text, and terminal-state spoofing.
  - Redaction removes useful recovery context
    - `CLIINTF-SC-DEVELOP-SPOOF-02` — Redaction preserves source identity and safe next action without exposing a secret.
- Change reconciliation
  - Human-only redesign
    - `CLIINTF-SC-DEVELOP-CHANGE-01` — A wording or layout change leaves structured meaning and owner contracts unchanged.
  - Structured expression change
    - `CLIINTF-SC-DEVELOP-CHANGE-02` — A changed structured field or completion promise reopens Architecture and evidence.

### Product lifecycle

- Discovery
  - Root, group, and command help
    - `CLIINTF-SC-PRODUCT-DISCOVER-01` — Each help level reveals the next safe discovery or action.
  - Invalid invocation with a near match
    - `CLIINTF-SC-PRODUCT-DISCOVER-02` — The diagnostic distinguishes rejection from a non-executing suggestion.
- Use across destinations
  - Redirected stdout with terminal stderr
    - `CLIINTF-SC-PRODUCT-ADAPT-01` — Clean plain results coexist with independently adaptive diagnostics.
  - Narrow terminal
    - `CLIINTF-SC-PRODUCT-ADAPT-02` — Narrow output preserves every field through wrapping or record blocks.
  - Color and Unicode unavailable
    - `CLIINTF-SC-PRODUCT-ADAPT-03` — No-color and ASCII expression preserve state, data, and action.
  - CI or captured execution
    - `CLIINTF-SC-PRODUCT-ADAPT-04` — Automatic expression is conservative and never changes semantics.
- Interaction and failure
  - Non-interactive command lacks input
    - `CLIINTF-SC-PRODUCT-INPUT-01` — The command fails without waiting and names an accepted supply route.
  - Long-running command without redraw
    - `CLIINTF-SC-PRODUCT-PROGRESS-01` — Append-only milestones remain sparse, labeled, and followed by final state.
  - Failure after partial effect
    - `CLIINTF-SC-PRODUCT-FAILURE-01` — The diagnostic exposes current state, retained effect, and safe recovery.
  - Output consumer closes
    - `CLIINTF-SC-PRODUCT-PIPE-01` — Expression does not treat a broken output pipe as proof of semantic completion or failure.
- Visualization and comprehension
  - Ornamental table hides record identity
    - `CLIINTF-SC-PRODUCT-QUALITY-01` — Labeled identity and values survive loss of borders, alignment, and color.
  - Verbose output hides the failure
    - `CLIINTF-SC-PRODUCT-QUALITY-02` — Error summary and recovery remain findable in sequential reading.
  - Human summary omits requested data
    - `CLIINTF-SC-PRODUCT-SUMMARY-01` — The summary discloses its bound and gives a complete-result route.
- Accessibility and localization
  - Screen-reader use
    - `CLIINTF-SC-PRODUCT-ACCESS-01` — Label-rich append-only expression supports discovery, state tracking, and recovery.
  - Dynamic output with motion disabled
    - `CLIINTF-SC-PRODUCT-ACCESS-02` — Meaning remains available without animation or cursor rewrites.
  - Human locale changes
    - `CLIINTF-SC-PRODUCT-LOCALE-01` — Human text localizes while machine keys, codes, values, and ordering promises remain stable.
  - Bidirectional or invisible user data
    - `CLIINTF-SC-PRODUCT-LOCALE-02` — Human rendering keeps boundaries legible while structured data follows its accepted exact-data contract.
- Evolution
  - Built-in pager or full-screen behavior proposed
    - `CLIINTF-SC-PRODUCT-SCOPE-01` — Deferred interaction stays outside the line-oriented expression contract.
  - Accessibility fix changes semantic data
    - `CLIINTF-SC-PRODUCT-CHANGE-01` — The change returns to Architecture instead of hiding a semantic revision in presentation.

## Checklist Conditions

### Design lifecycle > Audience and context framing > Complete affected-context map > CLIINTF-SC-DESIGN-CONTEXT-01

- [ ] CLIINTF-CK-DESIGN-CONTEXT-01-01 — The expression contract identifies each materially different person and automation consumer it serves.
- [ ] CLIINTF-CK-DESIGN-CONTEXT-01-02 — The expression contract identifies terminal, pipe, file, capture, and CI destinations that can change presentation.
- [ ] CLIINTF-CK-DESIGN-CONTEXT-01-03 — The expression contract identifies supported locale, width, color, Unicode, ASCII, and explicit assistive contexts.
- [ ] CLIINTF-CK-DESIGN-CONTEXT-01-04 — Every unobserved answer-changing context is recorded as a limitation rather than assumed equivalent.

### Design lifecycle > Audience and context framing > Product-specific accessibility claim > CLIINTF-SC-DESIGN-CONTEXT-02

- [ ] CLIINTF-CK-DESIGN-CONTEXT-02-01 — Every claim about what people can discover, understand, complete, or recover from names current representative-user evidence for the exact expression and context.
- [ ] CLIINTF-CK-DESIGN-CONTEXT-02-02 — Standards, expert review, and prior research are not presented as product-specific representative-user proof.
- [ ] CLIINTF-CK-DESIGN-CONTEXT-02-03 — Missing representative-user evidence remains an explicit claim limitation with a reopen condition.

### Design lifecycle > Semantic handoff > Complete accepted input > CLIINTF-SC-DESIGN-HANDOFF-01

- [ ] CLIINTF-CK-DESIGN-HANDOFF-01-01 — The contract identifies the exact accepted semantic model and version it expresses.
- [ ] CLIINTF-CK-DESIGN-HANDOFF-01-02 — The contract identifies the accepted stdout and stderr roles separately.
- [ ] CLIINTF-CK-DESIGN-HANDOFF-01-03 — The contract identifies accepted result, warning, error, progress, prompt, completeness, partial-state, and recovery fields before rendering them.
- [ ] CLIINTF-CK-DESIGN-HANDOFF-01-04 — The contract identifies each current Security-owned expression constraint before choosing a representation.

### Design lifecycle > Semantic handoff > Presentation proposal changes meaning > CLIINTF-SC-DESIGN-HANDOFF-02

- [ ] CLIINTF-CK-DESIGN-HANDOFF-02-01 — A proposed field, stream, exit, state, or compatibility change is returned to `cli-architecture`.
- [ ] CLIINTF-CK-DESIGN-HANDOFF-02-02 — A proposed trust, redaction, spoofing, or destructive-warning requirement is returned to `cli-security`.
- [ ] CLIINTF-CK-DESIGN-HANDOFF-02-03 — A current terminal, stream, width, encoding, locale, or OS question is returned to `cli-platform`.

### Design lifecycle > Expression alternatives > Help and discovery hierarchy > CLIINTF-SC-DESIGN-OPTION-01

- [ ] CLIINTF-CK-DESIGN-OPTION-01-01 — Root help leads from product purpose to canonical groups or commands.
- [ ] CLIINTF-CK-DESIGN-OPTION-01-02 — Group help leads from group purpose to canonical subcommands.
- [ ] CLIINTF-CK-DESIGN-OPTION-01-03 — Command help makes applicable inputs, profiles, effects, exits, recovery, compatibility, and related commands findable.
- [ ] CLIINTF-CK-DESIGN-OPTION-01-04 — Each example distinguishes the exact command from the expected kind of result.

### Design lifecycle > Expression alternatives > Dense comparison rendering > CLIINTF-SC-DESIGN-OPTION-02

- [ ] CLIINTF-CK-DESIGN-OPTION-02-01 — A table is selected only when rows share comparable fields.
- [ ] CLIINTF-CK-DESIGN-OPTION-02-02 — A table preserves every required field at the accepted wide width.
- [ ] CLIINTF-CK-DESIGN-OPTION-02-03 — The same records have a labeled form that does not depend on column alignment.
- [ ] CLIINTF-CK-DESIGN-OPTION-02-04 — The rendering states when width or assistive context selects the labeled form.

### Design lifecycle > Expression alternatives > Hierarchy and change rendering > CLIINTF-SC-DESIGN-OPTION-03

- [ ] CLIINTF-CK-DESIGN-OPTION-03-01 — Every tree represents an actual parent-child relation.
- [ ] CLIINTF-CK-DESIGN-OPTION-03-02 — Tree ancestry remains identifiable without box-drawing glyphs.
- [ ] CLIINTF-CK-DESIGN-OPTION-03-03 — Every diff identifies old and new or added and removed content without color.

### Design lifecycle > Profile and control contract > Four-profile expression > CLIINTF-SC-DESIGN-PROFILE-01

- [ ] CLIINTF-CK-DESIGN-PROFILE-01-01 — `human` has defined stdout and stderr expression.
- [ ] CLIINTF-CK-DESIGN-PROFILE-01-02 — `plain` has defined append-only stdout and stderr expression.
- [ ] CLIINTF-CK-DESIGN-PROFILE-01-03 — `json` has one complete stdout envelope expression and versioned JSONL stderr diagnostics.
- [ ] CLIINTF-CK-DESIGN-PROFILE-01-04 — `jsonl` has one-record-per-line stdout expression and versioned JSONL stderr diagnostics.
- [ ] CLIINTF-CK-DESIGN-PROFILE-01-05 — Each structured profile states its accepted failure and completion expression.
- [ ] CLIINTF-CK-DESIGN-PROFILE-01-06 — Structured profiles imply non-interactive expression.

### Design lifecycle > Profile and control contract > Independent controls > CLIINTF-SC-DESIGN-CONTROL-01

- [ ] CLIINTF-CK-DESIGN-CONTROL-01-01 — Color control changes color only.
- [ ] CLIINTF-CK-DESIGN-CONTROL-01-02 — Progress control changes accepted progress emission only.
- [ ] CLIINTF-CK-DESIGN-CONTROL-01-03 — No-input control forbids prompts in every profile.
- [ ] CLIINTF-CK-DESIGN-CONTROL-01-04 — ASCII control replaces decoration without changing user data.
- [ ] CLIINTF-CK-DESIGN-CONTROL-01-05 — Screen-reader control selects label-rich append-only expression without changing semantics.
- [ ] CLIINTF-CK-DESIGN-CONTROL-01-06 — Every explicit control overrides only its corresponding automatic default.

### Design lifecycle > Profile and control contract > Cosmetic conflict handling > CLIINTF-SC-DESIGN-CONTROL-02

- [ ] CLIINTF-CK-DESIGN-CONTROL-02-01 — Color-always with `json` or `jsonl` is rejected instead of ignored.
- [ ] CLIINTF-CK-DESIGN-CONTROL-02-02 — ASCII with `json` or `jsonl` is rejected instead of ignored.
- [ ] CLIINTF-CK-DESIGN-CONTROL-02-03 — Screen-reader expression with `json` or `jsonl` is rejected instead of ignored.
- [ ] CLIINTF-CK-DESIGN-CONTROL-02-04 — Progress-always in a structured profile uses versioned structured stderr records without cursor motion.

### Design lifecycle > Accessibility and claim boundary > Redundant meaning > CLIINTF-SC-DESIGN-ACCESS-01

- [ ] CLIINTF-CK-DESIGN-ACCESS-01-01 — Identity remains explicit without color.
- [ ] CLIINTF-CK-DESIGN-ACCESS-01-02 — State remains explicit without a symbol.
- [ ] CLIINTF-CK-DESIGN-ACCESS-01-03 — Severity remains explicit without emphasis or animation.
- [ ] CLIINTF-CK-DESIGN-ACCESS-01-04 — Change remains explicit without color or line style.
- [ ] CLIINTF-CK-DESIGN-ACCESS-01-05 — Completeness remains explicit without cursor position or the last progress frame.
- [ ] CLIINTF-CK-DESIGN-ACCESS-01-06 — Recovery remains explicit without layout or localized wording alone.

### Design lifecycle > Accessibility and claim boundary > Screen-reader expression > CLIINTF-SC-DESIGN-ACCESS-02

- [ ] CLIINTF-CK-DESIGN-ACCESS-02-01 — Screen-reader expression uses stable headings.
- [ ] CLIINTF-CK-DESIGN-ACCESS-02-02 — Each value remains adjacent to a spoken field label.
- [ ] CLIINTF-CK-DESIGN-ACCESS-02-03 — Progress uses sparse labeled milestones.
- [ ] CLIINTF-CK-DESIGN-ACCESS-02-04 — The error summary precedes optional diagnostic detail.
- [ ] CLIINTF-CK-DESIGN-ACCESS-02-05 — The safe recovery action is reachable through sequential reading.

### Development lifecycle > Expression handoff > Complete realization input > CLIINTF-SC-DEVELOP-HANDOFF-01

- [ ] CLIINTF-CK-DEVELOP-HANDOFF-01-01 — The handoff contains every profile and supported control combination.
- [ ] CLIINTF-CK-DEVELOP-HANDOFF-01-02 — The handoff contains wide, narrow, redirected, piped, CI, ASCII, locale, and screen-reader states.
- [ ] CLIINTF-CK-DEVELOP-HANDOFF-01-03 — The handoff contains prompt, progress, failure, interruption, and recovery expression.
- [ ] CLIINTF-CK-DEVELOP-HANDOFF-01-04 — The handoff names implementation and process-evidence owners without selecting their mechanisms.

### Development lifecycle > Expression handoff > Mechanism contradicts expression intent > CLIINTF-SC-DEVELOP-HANDOFF-02

- [ ] CLIINTF-CK-DEVELOP-HANDOFF-02-01 — A mechanism that changes semantics or stream roles reopens `cli-architecture`.
- [ ] CLIINTF-CK-DEVELOP-HANDOFF-02-02 — A mechanism that cannot preserve accepted expression reopens `cli-interface`.
- [ ] CLIINTF-CK-DEVELOP-HANDOFF-02-03 — A platform assumption exposed by implementation reopens `cli-platform`.
- [ ] CLIINTF-CK-DEVELOP-HANDOFF-02-04 — Dependent expression evidence is marked stale after its input decision changes.

### Development lifecycle > Profile realization > Plain output gains terminal decoration > CLIINTF-SC-DEVELOP-PROFILE-01

- [ ] CLIINTF-CK-DEVELOP-PROFILE-01-01 — Plain stdout contains no ANSI control sequence.
- [ ] CLIINTF-CK-DEVELOP-PROFILE-01-02 — Plain stderr contains no ANSI control sequence.
- [ ] CLIINTF-CK-DEVELOP-PROFILE-01-03 — Plain output never rewrites a prior line.
- [ ] CLIINTF-CK-DEVELOP-PROFILE-01-04 — Plain record meaning does not depend on aligned columns.

### Development lifecycle > Profile realization > Structured stdout and stderr > CLIINTF-SC-DEVELOP-PROFILE-02

- [ ] CLIINTF-CK-DEVELOP-PROFILE-02-01 — Structured stdout contains no human diagnostic text.
- [ ] CLIINTF-CK-DEVELOP-PROFILE-02-02 — Structured stderr contains only accepted versioned diagnostic records.
- [ ] CLIINTF-CK-DEVELOP-PROFILE-02-03 — Structured output contains no ANSI control sequence.
- [ ] CLIINTF-CK-DEVELOP-PROFILE-02-04 — Locale does not change structured keys, discriminators, codes, numbers, timestamps, or ordering promises.
- [ ] CLIINTF-CK-DEVELOP-PROFILE-02-05 — Exit status remains identifiable independently from a structured diagnostic.

### Development lifecycle > Profile realization > Per-stream adaptation > CLIINTF-SC-DEVELOP-PROFILE-03

- [ ] CLIINTF-CK-DEVELOP-PROFILE-03-01 — stdout presentation uses stdout destination and capability facts only.
- [ ] CLIINTF-CK-DEVELOP-PROFILE-03-02 — stderr presentation uses stderr destination and capability facts only.
- [ ] CLIINTF-CK-DEVELOP-PROFILE-03-03 — Redirecting stdout does not force plain stderr when stderr remains a capable TTY.
- [ ] CLIINTF-CK-DEVELOP-PROFILE-03-04 — TTY detection changes no semantic field, stream role, effect, or exit meaning.

### Development lifecycle > Interaction and recovery realization > Prompt lifecycle > CLIINTF-SC-DEVELOP-PROMPT-01

- [ ] CLIINTF-CK-DEVELOP-PROMPT-01-01 — Every prompt states its label.
- [ ] CLIINTF-CK-DEVELOP-PROMPT-01-02 — Every prompt states whether input is visible or secret.
- [ ] CLIINTF-CK-DEVELOP-PROMPT-01-03 — Every prompt states its echo policy.
- [ ] CLIINTF-CK-DEVELOP-PROMPT-01-04 — Every prompt states its default behavior.
- [ ] CLIINTF-CK-DEVELOP-PROMPT-01-05 — Every prompt states validation and retry bounds.
- [ ] CLIINTF-CK-DEVELOP-PROMPT-01-06 — Every prompt states EOF behavior.
- [ ] CLIINTF-CK-DEVELOP-PROMPT-01-07 — Every prompt states interruption behavior.
- [ ] CLIINTF-CK-DEVELOP-PROMPT-01-08 — Every timed prompt states timeout behavior.
- [ ] CLIINTF-CK-DEVELOP-PROMPT-01-09 — Every prompt states one exact non-interactive input route.

### Development lifecycle > Interaction and recovery realization > Terminal input mode failure > CLIINTF-SC-DEVELOP-PROMPT-02

- [ ] CLIINTF-CK-DEVELOP-PROMPT-02-01 — Secret input is never echoed.
- [ ] CLIINTF-CK-DEVELOP-PROMPT-02-02 — The prior terminal input mode is restored after accepted input.
- [ ] CLIINTF-CK-DEVELOP-PROMPT-02-03 — The prior terminal input mode is restored after validation failure.
- [ ] CLIINTF-CK-DEVELOP-PROMPT-02-04 — The prior terminal input mode is restored after EOF or timeout.
- [ ] CLIINTF-CK-DEVELOP-PROMPT-02-05 — The prior terminal input mode is restored after cancellation or signal.

### Development lifecycle > Interaction and recovery realization > Progress destination changes > CLIINTF-SC-DEVELOP-PROGRESS-01

- [ ] CLIINTF-CK-DEVELOP-PROGRESS-01-01 — Redraw progress is used only on an accepted capable stderr TTY.
- [ ] CLIINTF-CK-DEVELOP-PROGRESS-01-02 — Plain, redirected, CI, and screen-reader progress is append-only.
- [ ] CLIINTF-CK-DEVELOP-PROGRESS-01-03 — Structured progress appears only when explicitly forced and uses structured stderr records.
- [ ] CLIINTF-CK-DEVELOP-PROGRESS-01-04 — Disabling progress does not remove the final result, failure, or recovery expression.
- [ ] CLIINTF-CK-DEVELOP-PROGRESS-01-05 — Final completion does not depend on the last progress frame.

### Development lifecycle > Security reconciliation > Untrusted text forges the interface > CLIINTF-SC-DEVELOP-SPOOF-01

- [ ] CLIINTF-CK-DEVELOP-SPOOF-01-01 — Untrusted text cannot insert an apparent diagnostic line.
- [ ] CLIINTF-CK-DEVELOP-SPOOF-01-02 — Untrusted text cannot emit an active terminal control sequence.
- [ ] CLIINTF-CK-DEVELOP-SPOOF-01-03 — Untrusted text cannot create an undisclosed active hyperlink.
- [ ] CLIINTF-CK-DEVELOP-SPOOF-01-04 — Bidirectional controls and invisible separators remain visibly bounded in human diagnostics.
- [ ] CLIINTF-CK-DEVELOP-SPOOF-01-05 — The representation follows the exact Security-owned control instead of inventing a weaker local escape rule.

### Development lifecycle > Security reconciliation > Redaction removes useful recovery context > CLIINTF-SC-DEVELOP-SPOOF-02

- [ ] CLIINTF-CK-DEVELOP-SPOOF-02-01 — A secret value is absent from ordinary result and diagnostic expression.
- [ ] CLIINTF-CK-DEVELOP-SPOOF-02-02 — Redaction preserves the safe identity of the failed input source.
- [ ] CLIINTF-CK-DEVELOP-SPOOF-02-03 — Redaction preserves the accepted safe recovery action.

### Development lifecycle > Change reconciliation > Human-only redesign > CLIINTF-SC-DEVELOP-CHANGE-01

- [ ] CLIINTF-CK-DEVELOP-CHANGE-01-01 — A human wording change preserves accepted semantic fields.
- [ ] CLIINTF-CK-DEVELOP-CHANGE-01-02 — A human layout change preserves assigned stream roles.
- [ ] CLIINTF-CK-DEVELOP-CHANGE-01-03 — A human layout change preserves structured schema meaning and completion.
- [ ] CLIINTF-CK-DEVELOP-CHANGE-01-04 — A presentation-only change records which existing process evidence remains applicable.

### Development lifecycle > Change reconciliation > Structured expression change > CLIINTF-SC-DEVELOP-CHANGE-02

- [ ] CLIINTF-CK-DEVELOP-CHANGE-02-01 — A changed structured field meaning reopens `cli-architecture`.
- [ ] CLIINTF-CK-DEVELOP-CHANGE-02-02 — A changed discriminator, code, ordering promise, or completion rule reopens compatibility judgment.
- [ ] CLIINTF-CK-DEVELOP-CHANGE-02-03 — Process and consumer evidence for the changed structured protocol is marked stale.

### Product lifecycle > Discovery > Root, group, and command help > CLIINTF-SC-PRODUCT-DISCOVER-01

- [ ] CLIINTF-CK-PRODUCT-DISCOVER-01-01 — Root help states the product purpose before command detail.
- [ ] CLIINTF-CK-PRODUCT-DISCOVER-01-02 — Root help identifies canonical groups or commands.
- [ ] CLIINTF-CK-PRODUCT-DISCOVER-01-03 — Group help identifies canonical subcommands.
- [ ] CLIINTF-CK-PRODUCT-DISCOVER-01-04 — Command help identifies every applicable input source.
- [ ] CLIINTF-CK-PRODUCT-DISCOVER-01-05 — Command help identifies every available output profile and independent control.
- [ ] CLIINTF-CK-PRODUCT-DISCOVER-01-06 — Command help identifies destructive effects and recovery when applicable.

### Product lifecycle > Discovery > Invalid invocation with a near match > CLIINTF-SC-PRODUCT-DISCOVER-02

- [ ] CLIINTF-CK-PRODUCT-DISCOVER-02-01 — The rejected token is identifiable in the diagnostic.
- [ ] CLIINTF-CK-PRODUCT-DISCOVER-02-02 — A suggested canonical route is labeled as a suggestion.
- [ ] CLIINTF-CK-PRODUCT-DISCOVER-02-03 — The suggestion is not expressed as an executed or accepted command.
- [ ] CLIINTF-CK-PRODUCT-DISCOVER-02-04 — The diagnostic gives one safe next discovery or correction action.

### Product lifecycle > Use across destinations > Redirected stdout with terminal stderr > CLIINTF-SC-PRODUCT-ADAPT-01

- [ ] CLIINTF-CK-PRODUCT-ADAPT-01-01 — Redirected stdout defaults to plain expression when no format is explicit.
- [ ] CLIINTF-CK-PRODUCT-ADAPT-01-02 — A capable terminal stderr may retain human diagnostics when no format is explicit.
- [ ] CLIINTF-CK-PRODUCT-ADAPT-01-03 — Progress remains confined to its accepted stderr role.
- [ ] CLIINTF-CK-PRODUCT-ADAPT-01-04 — Redirected stdout contains no diagnostic or progress text.

### Product lifecycle > Use across destinations > Narrow terminal > CLIINTF-SC-PRODUCT-ADAPT-02

- [ ] CLIINTF-CK-PRODUCT-ADAPT-02-01 — Narrow output wraps values without hiding their labels.
- [ ] CLIINTF-CK-PRODUCT-ADAPT-02-02 — A table becomes labeled record blocks before a required column is clipped.
- [ ] CLIINTF-CK-PRODUCT-ADAPT-02-03 — A long unbroken value remains recoverable without changing its data.
- [ ] CLIINTF-CK-PRODUCT-ADAPT-02-04 — Width adaptation claims no universal cross-terminal alignment.

### Product lifecycle > Use across destinations > Color and Unicode unavailable > CLIINTF-SC-PRODUCT-ADAPT-03

- [ ] CLIINTF-CK-PRODUCT-ADAPT-03-01 — No-color expression retains every state label.
- [ ] CLIINTF-CK-PRODUCT-ADAPT-03-02 — No-color expression retains every change label.
- [ ] CLIINTF-CK-PRODUCT-ADAPT-03-03 — ASCII fallback changes no user data.
- [ ] CLIINTF-CK-PRODUCT-ADAPT-03-04 — ASCII fallback preserves tree ancestry and diff meaning through text labels or indentation.

### Product lifecycle > Use across destinations > CI or captured execution > CLIINTF-SC-PRODUCT-ADAPT-04

- [ ] CLIINTF-CK-PRODUCT-ADAPT-04-01 — Automatic color is disabled when the exact destination facts do not justify it.
- [ ] CLIINTF-CK-PRODUCT-ADAPT-04-02 — Automatic progress uses no cursor rewrite in CI or captured output.
- [ ] CLIINTF-CK-PRODUCT-ADAPT-04-03 — Automatic presentation changes no semantic result or exit meaning.
- [ ] CLIINTF-CK-PRODUCT-ADAPT-04-04 — An explicit supported control overrides the corresponding CI default.

### Product lifecycle > Interaction and failure > Non-interactive command lacks input > CLIINTF-SC-PRODUCT-INPUT-01

- [ ] CLIINTF-CK-PRODUCT-INPUT-01-01 — The expression does not prompt when stdin is non-interactive.
- [ ] CLIINTF-CK-PRODUCT-INPUT-01-02 — The expression does not prompt when no-input is active.
- [ ] CLIINTF-CK-PRODUCT-INPUT-01-03 — The diagnostic identifies the missing input.
- [ ] CLIINTF-CK-PRODUCT-INPUT-01-04 — The diagnostic identifies an accepted non-interactive supply route.

### Product lifecycle > Interaction and failure > Long-running command without redraw > CLIINTF-SC-PRODUCT-PROGRESS-01

- [ ] CLIINTF-CK-PRODUCT-PROGRESS-01-01 — Each append-only milestone identifies its subject and state.
- [ ] CLIINTF-CK-PRODUCT-PROGRESS-01-02 — Repeated milestones add information needed to understand current state.
- [ ] CLIINTF-CK-PRODUCT-PROGRESS-01-03 — Final success or failure appears as a distinct final expression.

### Product lifecycle > Interaction and failure > Failure after partial effect > CLIINTF-SC-PRODUCT-FAILURE-01

- [ ] CLIINTF-CK-PRODUCT-FAILURE-01-01 — The first diagnostic line identifies the failed subject.
- [ ] CLIINTF-CK-PRODUCT-FAILURE-01-02 — The diagnostic identifies the accepted stable error code.
- [ ] CLIINTF-CK-PRODUCT-FAILURE-01-03 — The diagnostic identifies current state.
- [ ] CLIINTF-CK-PRODUCT-FAILURE-01-04 — The diagnostic identifies each retained effect represented by the accepted semantic model.
- [ ] CLIINTF-CK-PRODUCT-FAILURE-01-05 — The diagnostic identifies one accepted safe recovery action.

### Product lifecycle > Interaction and failure > Output consumer closes > CLIINTF-SC-PRODUCT-PIPE-01

- [ ] CLIINTF-CK-PRODUCT-PIPE-01-01 — A closed stdout destination does not change the expression of the authoritative product state.
- [ ] CLIINTF-CK-PRODUCT-PIPE-01-02 — A mutating command does not express cancellation solely because stdout closed.
- [ ] CLIINTF-CK-PRODUCT-PIPE-01-03 — A read-only producer emits no redundant diagnostic when its accepted pipe-closure contract treats closure as a normal consumer stop.

### Product lifecycle > Visualization and comprehension > Ornamental table hides record identity > CLIINTF-SC-PRODUCT-QUALITY-01

- [ ] CLIINTF-CK-PRODUCT-QUALITY-01-01 — Each record remains identifiable without a border.
- [ ] CLIINTF-CK-PRODUCT-QUALITY-01-02 — Each field remains identifiable without alignment.
- [ ] CLIINTF-CK-PRODUCT-QUALITY-01-03 — Status remains identifiable without color or icon.
- [ ] CLIINTF-CK-PRODUCT-QUALITY-01-04 — The narrow and screen-reader forms preserve the same accepted records.

### Product lifecycle > Visualization and comprehension > Verbose output hides the failure > CLIINTF-SC-PRODUCT-QUALITY-02

- [ ] CLIINTF-CK-PRODUCT-QUALITY-02-01 — The failure summary appears before optional debug detail.
- [ ] CLIINTF-CK-PRODUCT-QUALITY-02-02 — Repeated context does not separate the failed subject from its cause.
- [ ] CLIINTF-CK-PRODUCT-QUALITY-02-03 — The recovery action remains adjacent to the current-state summary.

### Product lifecycle > Visualization and comprehension > Human summary omits requested data > CLIINTF-SC-PRODUCT-SUMMARY-01

- [ ] CLIINTF-CK-PRODUCT-SUMMARY-01-01 — A bounded summary labels itself as a summary.
- [ ] CLIINTF-CK-PRODUCT-SUMMARY-01-02 — A bounded summary states the omitted count or scope when known.
- [ ] CLIINTF-CK-PRODUCT-SUMMARY-01-03 — A bounded summary identifies one exact command or machine profile for the complete result.
- [ ] CLIINTF-CK-PRODUCT-SUMMARY-01-04 — Human output never silently truncates requested data.

### Product lifecycle > Accessibility and localization > Screen-reader use > CLIINTF-SC-PRODUCT-ACCESS-01

- [ ] CLIINTF-CK-PRODUCT-ACCESS-01-01 — Screen-reader help preserves heading order and canonical command identity.
- [ ] CLIINTF-CK-PRODUCT-ACCESS-01-02 — Screen-reader records preserve field labels next to values.
- [ ] CLIINTF-CK-PRODUCT-ACCESS-01-03 — Screen-reader progress is sparse and append-only.
- [ ] CLIINTF-CK-PRODUCT-ACCESS-01-04 — Screen-reader diagnostics expose the failed subject before detail.
- [ ] CLIINTF-CK-PRODUCT-ACCESS-01-05 — Screen-reader diagnostics expose the safe recovery action in sequential order.

### Product lifecycle > Accessibility and localization > Dynamic output with motion disabled > CLIINTF-SC-PRODUCT-ACCESS-02

- [ ] CLIINTF-CK-PRODUCT-ACCESS-02-01 — Disabling redraw removes no accepted progress state.
- [ ] CLIINTF-CK-PRODUCT-ACCESS-02-02 — Disabling animation removes no completion state.
- [ ] CLIINTF-CK-PRODUCT-ACCESS-02-03 — Cursor position is not required to associate a milestone with its subject.

### Product lifecycle > Accessibility and localization > Human locale changes > CLIINTF-SC-PRODUCT-LOCALE-01

- [ ] CLIINTF-CK-PRODUCT-LOCALE-01-01 — Human messages are complete contextual units rather than concatenated fragments.
- [ ] CLIINTF-CK-PRODUCT-LOCALE-01-02 — Human values use the accepted locale-aware number, date, unit, sort, and collation expression where applicable.
- [ ] CLIINTF-CK-PRODUCT-LOCALE-01-03 — Structured keys remain unchanged across locales.
- [ ] CLIINTF-CK-PRODUCT-LOCALE-01-04 — Structured codes remain unchanged across locales.
- [ ] CLIINTF-CK-PRODUCT-LOCALE-01-05 — Structured numeric and timestamp meanings remain unchanged across locales.

### Product lifecycle > Accessibility and localization > Bidirectional or invisible user data > CLIINTF-SC-PRODUCT-LOCALE-02

- [ ] CLIINTF-CK-PRODUCT-LOCALE-02-01 — Human expression makes the start and end of an untrusted value identifiable.
- [ ] CLIINTF-CK-PRODUCT-LOCALE-02-02 — Human expression makes Security-identified bidirectional controls or invisible separators apparent.
- [ ] CLIINTF-CK-PRODUCT-LOCALE-02-03 — Structured expression preserves exact user data according to the accepted schema.
- [ ] CLIINTF-CK-PRODUCT-LOCALE-02-04 — Human safety expression does not silently rewrite the underlying semantic value.

### Product lifecycle > Evolution > Built-in pager or full-screen behavior proposed > CLIINTF-SC-PRODUCT-SCOPE-01

- [ ] CLIINTF-CK-PRODUCT-SCOPE-01-01 — The expression contract does not launch or manage a pager.
- [ ] CLIINTF-CK-PRODUCT-SCOPE-01-02 — The expression contract does not use alternate-screen, persistent-focus, multi-pane, mouse, or widget behavior.
- [ ] CLIINTF-CK-PRODUCT-SCOPE-01-03 — User-selected external pager piping remains ordinary output composition rather than an Interface-owned process.

### Product lifecycle > Evolution > Accessibility fix changes semantic data > CLIINTF-SC-PRODUCT-CHANGE-01

- [ ] CLIINTF-CK-PRODUCT-CHANGE-01-01 — An accessibility change that alters semantic fields is returned to `cli-architecture`.
- [ ] CLIINTF-CK-PRODUCT-CHANGE-01-02 — An accessibility change that alters stream roles is returned to `cli-architecture`.
- [ ] CLIINTF-CK-PRODUCT-CHANGE-01-03 — A changed security constraint is returned to `cli-security`.
- [ ] CLIINTF-CK-PRODUCT-CHANGE-01-04 — Evidence tied to superseded expression is marked stale.
