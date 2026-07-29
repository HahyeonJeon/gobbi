# HTML evaluation

This entrypoint evaluates the operation defined in
[the HTML parent](SKILL.md). It adds no policy.
Every selection evaluates `HTML-1`, `HTML-2`, `HTML-3`, and `HTML-4` through
their applicable scenario and checklist evidence.

## Entry

Read the complete parent, the direct child routes relevant to the artifact,
[scenarios](scenarios.md), and the resolved [checklist](checklists.md). Bind the
review to exact source/emitted identities, declared targets, and fresh results.

Reject the evaluation as incomplete when either checklist gate is open, an
applicable scenario is omitted, the evidence targets different bytes, or a
material feature/owner is `UNDETERMINED` without an explicit blocked outcome.

## Selection

Always evaluate:

1. exact scope and source/transform/emitted identities;
2. selected-child fit and the semantic skeleton (`H-C02`);
3. document conformance and parsed structure;
4. parent/child ownership and independent use;
5. language-level accessibility floor;
6. trust, generator, and Electron/runtime routing;
7. failures, fallback, recovery, and evidence limitations.

Select additional evidence by trigger:

| Trigger | Required scenarios | Required checks | Required observation |
|---|---|---|---|
| Material new/proprietary feature | `H-S01`, `H-S06` | `H-C03`, `H-C10` | S/D, target, fallback, current behavior |
| Custom/native interaction or ARIA | `H-S02` | `H-C04`, `H-C06`, `H-C10` | name/role/state, keyboard/focus, native operation |
| Generated markup | `H-S03`, `H-S07` | `H-C07`, `H-C08`, `H-C10` | four links, parsed tree, regeneration |
| Forms | `H-S04` | `H-C04`, `H-C06`, `H-C09`, `H-C10` | names/errors/states/submission boundary |
| Media, iframe, or remote content | `H-S05` | `H-C06`, `H-C09`, `H-C10` | alternatives, failure, trust/runtime routing |
| Localized or bidi content | `H-S08` | `H-C05`, `H-C08`, `H-C10` | lang/dir, locale, bidi, resilience |
| Browser plus Electron renderer | `H-S01`, `H-S05`, `H-S09` | `H-C01`, `H-C03`, `H-C09`, `H-C10` | union target or isolated exact-target branch |

For each finding, cite the rule/check, exact artifact and target, observed
evidence, consequence, owner, and smallest root-cause repair. A cosmetic
counterfeit—valid-looking markup, a role without behavior, a Baseline label
without targets, a preload without measurement, or a static checker presented
as product acceptance—is a substantive failure.

## Acceptance

The HTML operation is accepted only when:

- every applicable checklist item is `PASS` or evidence-backed `N/A`;
- parent → child → scenario → checklist → evaluation traces close in both
  directions;
- all material features have separate S and first-match D outcomes;
- conforming parsed semantics, native-first behavior, language/direction,
  alternatives, keyboard/focus contribution, and fallback are evidenced;
- trust, generator, JavaScript/CSS, and Electron/runtime seams are explicit;
- transformed output has all four links and defects were repaired at source;
- failure and recovery were exercised where risk exists; and
- the completion statement stays within the actual language/source/topology
  evidence ceiling.

Any failed or unresolved applicable item returns to the owning source,
generator/configuration, security, CSS, JavaScript, Electron/runtime, or
project-acceptance owner. After repair, regenerate when applicable, rebind the
artifact identity, and repeat the complete affected selection—not only the
previously failing check.
