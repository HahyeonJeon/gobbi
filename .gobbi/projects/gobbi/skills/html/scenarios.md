# HTML scenarios

These cases exercise policy in [the HTML parent](SKILL.md). They add no policy.
Use the smallest applicable set, plus every case whose risk is present.

## Scenario matrix

| ID | Kind | Parent rules | Primary child | Checks | Evaluation selection |
|---|---|---|---|---|---|
| `H-S01` | boundary/pass | `HTML-1`, `HTML-2`, `HTML-4` | [interactive content](interactive-content.md) | `H-C02`, `H-C03`, `H-C06`, `H-C10` | feature, accessibility, target behavior |
| `H-S02` | fail/recovery | `HTML-2`, `HTML-4` | [semantics](semantics.md) | `H-C04`, `H-C06`, `H-C10` | semantics, accessibility, keyboard |
| `H-S03` | fail/recovery | `HTML-2`, `HTML-3`, `HTML-4` | [document structure](document-structure.md) | `H-C07`, `H-C08`, `H-C10` | source, transform, parsed tree |
| `H-S04` | pass/fail | `HTML-2`, `HTML-3`, `HTML-4` | [forms](forms.md) | `H-C04`, `H-C06`, `H-C09`, `H-C10` | form semantics, errors, trust |
| `H-S05` | boundary/fail | `HTML-1`, `HTML-2`, `HTML-3`, `HTML-4` | [media and embeds](media-embeds.md) | `H-C03`, `H-C06`, `H-C09`, `H-C10` | alternatives, target, runtime risk |
| `H-S06` | cosmetic false pass | `HTML-1`, `HTML-4` | [resource loading](resource-loading.md) | `H-C03`, `H-C10` | loading evidence, performance |
| `H-S07` | fail/recovery | `HTML-3`, `HTML-4` | [security boundaries](security-boundaries.md) | `H-C07`, `H-C09`, `H-C10` | trust, sink, regeneration |
| `H-S08` | pass/boundary | `HTML-2`, `HTML-3`, `HTML-4` | [document structure](document-structure.md) | `H-C05`, `H-C07`, `H-C08`, `H-C10` | direct source, locale, parsed tree |
| `H-S09` | independence | `HTML-1`–`HTML-4` | [testing](testing.md) | `H-C01`–`H-C10` | ownership and completion ceiling |

## H-S01 — Target-gated native popover

**Setup:** A shared browser/Electron renderer surface proposes popover plus a
new invoker subfeature. The browser matrix is multi-engine; the pinned Electron
Chromium supports both, but one browser lacks the newer subfeature.

**Passing response:** Classify the two subfeatures separately. The complete
multi-target outcome cannot take D4 and the unsupported subfeature is D3.
Preserve essential invocation through an established control, test naming,
focus, dismissal, and target behavior, and state the reopen condition.

**Failure:** Call the umbrella “modern and Baseline,” take D4 from Electron
support despite the multi-engine target, or omit the fallback.

**Boundary:** If the complete declared target changes to exactly the pinned
Electron renderer, full support is proven, and no browser claim remains, D4
may be the first match.

## H-S02 — Role-only custom button

**Setup:** A clickable `div` has `role="button"` and attractive focus styling.

**Failure signal:** It has no native activation, disabled, or form behavior;
Space does nothing. The role promises behavior the element does not supply.
Visual polish and a correct role do not pass.

**Recovery:** Replace it with the native button when its behavior fits. If a
genuinely custom widget remains necessary, route its state machine to the
JavaScript owner and verify the complete keyboard/name/role/state contract.

## H-S03 — Generated invalid table recovery

**Setup:** A template transform emits table markup that a browser reparents.
Source snapshots look plausible and a consumer proposes editing emitted HTML.

**Failure signal:** The four-link chain is incomplete or the parsed tree does
not match intended header/data relationships.

**Recovery:** Preserve the failing emitted digest and parsed observation. Fix
the template or generator configuration, regenerate, record the new digest,
rebind the parsed-tree observation, and rerun conformance and relationships.
Never patch emitted bytes.

## H-S04 — Form error and state

**Setup:** A checkout field uses placeholder-only naming. On failure, its
border changes red and a transient message appears elsewhere. A disabled
coupon field is expected to submit its value.

**Passing response:** Supply a persistent label, associate instructions and
errors, expose required/invalid state when applicable, add non-color error
identification, and choose readonly instead of disabled if the value must
submit. Keep server validation/security explicit.

**Failure:** An automated checker reports no syntax error, so the form is
called accessible and secure.

## H-S05 — Remote embed boundary

**Setup:** An Electron renderer embeds remote account content in an iframe.

**Passing response:** HTML supplies a purposeful name, fallback, and accurate
attributes. The Electron/security owner decides remote-content trust,
sandbox/permissions/referrer/navigation and privilege boundaries. Exact
renderer targets and failure behavior are tested.

**Failure:** The HTML skill prescribes preload exposure or sandbox policy, or
assumes an iframe sandbox token alone makes the remote content trusted.

## H-S06 — Cosmetic preload optimization

**Setup:** A stylesheet adds preload tags for every font and hero candidate.
The markup validates and a synthetic score once improved.

**Failure signal:** No exact request-to-preload match, current target waterfall,
or duplicate-request check is bound to the accepted bytes.

**Passing response:** Keep only measured critical hints, match destination and
CORS/credentials to the eventual request, test cold/warm/failure states, and
remove hints whose current evidence does not justify them.

## H-S07 — Unsafe generated fragment recovery

**Setup:** User text is interpolated into an HTML fragment and inserted with a
dangerous sink. The template escapes quotes in one attribute example.

**Failure signal:** One example does not cover text, attribute, URL, script,
style, and fragment contexts; no sanitizer/security owner or emitted identity
exists.

**Recovery:** Route the source-to-sink contexts to security/framework owners,
prefer data-preserving APIs, apply the reviewed contextual handling, regenerate
the artifact, and repeat sink search, parsed observation, and behavior checks.

## H-S08 — Direct-source document

**Setup:** A hand-authored multilingual document has no generator. It uses
correct document language, language changes, `dir="auto"` on user content, and
semantic headings.

**Passing response:** Record “no transform,” inspect conformance and the parsed
tree, then test locale expansion, RTL/bidi isolation, zoom/reflow/text growth,
and declared targets. Do not invent transform metadata.

**Boundary:** HTML evidence proves markup semantics and attributes; CSS/runtime
evidence is still needed for rendered writing-mode and reflow acceptance.

## H-S09 — Independent browser and Electron renderer review

**Setup:** A reviewer receives only `coding`, this HTML bundle, an emitted
document, and its declared browser/Electron renderer targets.

**Passing response:** The reviewer can classify features, choose a direct
child, preserve security/generator/Electron boundaries, and construct static
source/parsed/target evidence without loading CSS, UI, UX, or web.

**Failure:** The procedure requires a sibling/higher-level skill to define HTML
policy, or it claims static review proves runtime use or product acceptance.
