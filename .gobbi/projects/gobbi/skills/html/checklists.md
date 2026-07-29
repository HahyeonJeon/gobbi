# HTML checklist

This checklist exercises [the parent rules](SKILL.md#rules); it adds no policy.
Each item resolves to exactly one state: `PASS` with cited evidence, `FAIL`
with cited contradictory evidence, or `N/A` with a reason the trigger is
absent. `UNKNOWN`, blank, and prose without evidence remain unresolved.

Use two gates. The design gate must resolve before implementation is accepted;
the acceptance gate must resolve against final emitted bytes. One unresolved
or failed applicable item keeps its gate closed.

## Design gate

### H-C01 — Artifact, targets, and owners

- **Traces:** `HTML-1`, `HTML-3`, `HTML-4`; `H-S05`, `H-S09`.
- **Trigger:** every HTML task.
- **Evidence:** exact authored/generated source, emitted target, browser matrix,
  pinned Electron/Chromium if applicable, accessibility/AT inputs, and named
  generator/security/runtime/JavaScript/CSS owners.
- **Pass:** identities and owners are explicit; unknown material inputs are
  marked `UNDETERMINED`, not assumed.

### H-C02 — Correct child route and semantic skeleton

- **Traces:** `HTML-2`; `H-S01`, `H-S09`.
- **Trigger:** every HTML task.
- **Evidence:** selected direct child and pre-content shell/landmark/heading/
  controls/language/alternatives/resource skeleton.
- **Pass:** the smallest applicable child is selected and the skeleton exposes
  the intended meaning without requiring CSS, UI, UX, web, or the CSS skill.

### H-C03 — Feature maturity and fallback

- **Traces:** `HTML-1`; `H-S01`, `H-S05`, `H-S06`.
- **Trigger:** a material feature can vary by specification or target.
- **Evidence:** separate S class, first-match D class, primary specification,
  dated declared-target evidence, fallback/progressive enhancement, tests, and
  reopen/removal condition.
- **Pass:** all fields are present and D4 is used only for one complete pinned
  target with full support and no multi-engine claim.

### H-C04 — Native semantics and accessible relationships

- **Traces:** `HTML-2`; `H-S02`, `H-S04`.
- **Trigger:** content, controls, forms, landmarks, tables, or ARIA.
- **Evidence:** element/content-model choice and accessible name, label, group,
  role, state, description, instruction, error, and relationship inventory.
- **Pass:** native HTML is used where it fits; every ARIA use is permitted,
  non-conflicting, and backed by the promised behavior.

### H-C05 — Language, direction, and resilience

- **Traces:** `HTML-2`; `H-S08`.
- **Trigger:** every user-facing document; expanded cases for localized or
  user-generated content.
- **Evidence:** document and fragment `lang`/`dir`, bidi isolation/override
  decisions, plus planned zoom, reflow, text growth, locale, direction, and
  writing-mode observations.
- **Pass:** language/direction semantics are correct and no single sample
  locale or viewport is treated as acceptance.

### H-C06 — Alternatives, interaction, and state

- **Traces:** `HTML-2`; `H-S01`, `H-S02`, `H-S04`, `H-S05`.
- **Trigger:** non-text content, controls, media, embeds, or interactive state.
- **Evidence:** alternative-purpose decisions, keyboard/focus plan, native
  activation/dismissal, observable state beyond color, and CSS/JS owner seams.
- **Pass:** essential content and behavior remain available through declared
  failure/fallback paths.

## Acceptance gate

### H-C07 — Source and transform identity

- **Traces:** `HTML-3`, `HTML-4`; `H-S03`, `H-S07`, `H-S08`.
- **Trigger:** every final artifact.
- **Evidence:** exact source; explicit no-transform or exact tool/version/
  configuration/flags/plugins/order; emitted bytes/digest; observation identity.
- **Pass:** all four links exist for transformed output, or no-transform is
  explicit for direct source. No emitted-byte repair occurred.

### H-C08 — Parsed structure

- **Traces:** `HTML-2`, `HTML-4`; `H-S03`, `H-S08`.
- **Trigger:** every final artifact, with focused assertions for recovery-
  sensitive or transformed markup.
- **Evidence:** conformance result plus parsed DOM assertions for placement,
  content models, landmarks, headings, relationships, language, and attributes.
- **Pass:** parsed structure matches intent; checker limits are stated.

### H-C09 — Trust and runtime routing

- **Traces:** `HTML-3`; `H-S04`, `H-S05`, `H-S07`.
- **Trigger:** dynamic data, URLs, fragments, dangerous sinks, embeds, remote
  content, or Electron.
- **Evidence:** source-to-sink context inventory and named security/runtime
  decisions for sanitization, navigation, privilege, server validation, and
  Electron main/preload/IPC/native boundaries.
- **Pass:** HTML owns emitted semantics only; no trust or runtime decision is
  silently made by markup guidance.

### H-C10 — Artifact-bound verification

- **Traces:** `HTML-1`–`HTML-4`; all scenarios.
- **Trigger:** every completion claim.
- **Evidence:** commands/tools and versions, emitted digest, target matrix,
  parsed/native-operation results, keyboard/focus, alternatives, locale/
  direction, fallback/failure/recovery, and limitations.
- **Pass:** fresh evidence observes the exact accepted artifact and supports
  only the stated source/topology/language claim. It does not claim skill
  discovery/use, product WCAG, UI/UX quality, or end-to-end acceptance.

## Trace closure

| Parent rule | Detail children | Scenarios | Checklist items | Evaluation |
|---|---|---|---|---|
| `HTML-1` | [media/embeds](media-embeds.md), [interactive](interactive-content.md), [resources](resource-loading.md) | `H-S01`, `H-S05`, `H-S06`, `H-S09` | `H-C01`, `H-C03`, `H-C10` | maturity, target, fallback |
| `HTML-2` | [structure](document-structure.md), [semantics](semantics.md), [forms](forms.md), [media/embeds](media-embeds.md), [interactive](interactive-content.md) | `H-S01`–`H-S05`, `H-S08`, `H-S09` | `H-C02`, `H-C04`, `H-C05`, `H-C06`, `H-C08`, `H-C10` | conformance, semantics, accessibility floor |
| `HTML-3` | [structure](document-structure.md), [forms](forms.md), [media/embeds](media-embeds.md), [resources](resource-loading.md), [security](security-boundaries.md) | `H-S03`–`H-S05`, `H-S07`–`H-S09` | `H-C01`, `H-C07`, `H-C09`, `H-C10` | ownership, trust, transform/runtime seams |
| `HTML-4` | [structure](document-structure.md), [resources](resource-loading.md), [testing](testing.md) | `H-S01`–`H-S09` | `H-C01`, `H-C07`, `H-C08`, `H-C10` | artifact identity, parsed/native evidence, claim ceiling |
