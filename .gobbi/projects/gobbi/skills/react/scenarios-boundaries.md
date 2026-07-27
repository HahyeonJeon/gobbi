# React scenarios — Boundaries and hosts

This bounded set covers server/client value boundaries and presentation/producer host boundaries. Enter
through the [`scenarios.md`](scenarios.md) parent.

## Set frame

- **Purpose:** fail changes that merge directional value contracts, presentation surfaces, producer classes,
  or renderer privilege.
- **Target and consumers:** one React change-set; executors and evaluators selected by the parent.
- **Lifecycle:** evaluation mode, with design-mode use at architecture classification.
- **Scope:** server/client values, browser/Electron presentation, producers, and renderer privilege.
- **Threshold:** at most 12 families and 50 cells. This set has 2 families and 24 cells.
- **Stable IDs:** families 06 and 10 retain their published identities.

## Scenario Rule 1 coverage register

| # | Category | Disposition | Carrier or ledger |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | `selected` | `REACT-SCENARIO-06`, `REACT-SCENARIO-10` |
| 2 | Actors / stakeholders / use-context | `selected` | `REACT-SCENARIO-06`, `REACT-SCENARIO-10` |
| 3 | Behavior / state / data | `selected` | `REACT-SCENARIO-06` |
| 4 | Interfaces / dependencies / structure | `selected` | `REACT-SCENARIO-06`, `REACT-SCENARIO-10` |
| 5 | Quality attributes / resource economics | `selected` | `REACT-SCENARIO-10` |
| 6 | Failure / recovery / operations | `selected` | `REACT-SCENARIO-06`, `REACT-SCENARIO-10` |
| 7 | Trust / harm / governance | `selected` | `REACT-SCENARIO-06`, `REACT-SCENARIO-10` |
| 8 | Inclusion / locale | `covered-elsewhere`: [rendered access mechanics](scenarios-components.md#react-scenario-09--the-rendered-markup-as-a-contract-semantics-aria-and-focus) | `SR7-8` |
| 9 | Change / compatibility / reversibility | `covered-elsewhere`: [compiler adoption](scenarios-components.md#react-scenario-07--the-compiler-baseline-the-named-escape-hatch-and-legacy-memoization) | `SR7-9` |
| 10 | Evidence / traceability / clarity | `selected` | both families through matrix/source/obligation evidence |

### Category carriers

| Category | In-child families |
|---|---|
| 1 | `REACT-SCENARIO-06`, `REACT-SCENARIO-10` |
| 2 | `REACT-SCENARIO-06`, `REACT-SCENARIO-10` |
| 3 | `REACT-SCENARIO-06` |
| 4 | `REACT-SCENARIO-06`, `REACT-SCENARIO-10` |
| 5 | `REACT-SCENARIO-10` |
| 6 | `REACT-SCENARIO-06`, `REACT-SCENARIO-10` |
| 7 | `REACT-SCENARIO-06`, `REACT-SCENARIO-10` |
| 10 | `REACT-SCENARIO-06`, `REACT-SCENARIO-10` |

### Scenario Rule 7 covered-elsewhere ledger

| Ledger | Applicable families | Risk-triggered case types | Failure oracles | Actors | Exact target clause |
|---|---|---|---|---|---|
| SR7-8 | host-rendered controls and failure surfaces that users must operate without a mouse | boundary, adversarial | focus or keyboard operation is lost at open/close | keyboard and assistive-technology user | [`REACT-SCENARIO-09`](scenarios-components.md#react-scenario-09--the-rendered-markup-as-a-contract-semantics-aria-and-focus), especially its boundary, adversarial probe, oracle, and obligation |
| SR7-9 | a producer or boundary affected by a React Compiler adoption event | change/regression, counterfactual | behavior or identity changes across the adoption commit | maintainer and downstream component consumer | [`REACT-SCENARIO-07`](scenarios-components.md#react-scenario-07--the-compiler-baseline-the-named-escape-hatch-and-legacy-memoization), especially its change, counterfactual, oracle, and obligation |

## Source register and trace closure

Sources are `SKILL.md` H7, H16–H18, P1, P6, Procedure P1/P3; `server-client.md`; and `runtime.md`.
Every family below names a source and ends in an obligation. Family 06 carries the directional value seam;
family 10 carries the accepted six-row presentation/producer and finite-renderer-API seam.

## Families

### REACT-SCENARIO-06 — What crosses the server and client boundary, in the direction it crosses
- **Axis:** Hard invariant.
- **Primary category:** 4 Interfaces / dependencies / structure — the defining discrimination is the
  contract of a module boundary. **Secondary:** 3, 6, 7.
- **Situation:** Given a server-rendered component passing data to a client component, and client code
  calling a server function with a value taken from a form or an event. When a value is designed once and
  assumed to travel both ways.
- **Good handling:** the direction is established before the value is designed, the value is checked
  against the set for that direction, and anything that cannot cross is replaced by an identifier that is
  re-read on the other side.
- **Bad handling:** one merged notion of "serializable" applied to both directions; a class instance, a
  function, or an event object handed across; a value legal in one direction assumed legal in the other.
- **Boundary:** exactly at the boundary module, with a value that is legal in one direction and not the
  other — the case where a single merged list gives the wrong answer.
- **Failure/recovery:** the non-serializable value fails on the network hop rather than at the call site;
  the design must state where that surfaces and what the user sees.
- **Adversarial probe:** the value serializes in development because the fixture is a plain object and
  arrives as a class instance in production; and the Server Function is called directly, with arguments no
  component would produce, by a caller that never rendered the form — the validation and the authority
  check have to be inside the function to survive that. **Cosmetic form:** the error is silenced by
  marking the module as client code, which moves the boundary instead of fixing the value.
- **Minimums:** boundary see above · failure/recovery see above · adversarial see above · change `n/a: no
  version or lifecycle event` · counterfactual covered by family 10's no-server-tier inversion.
- **Oracle:** pass the value across the real boundary in both directions and observe which direction
  rejects it and where the error surfaces.
- **Obligation:** every value crossing the boundary must have its direction and its legality recorded at
  design time, and every Server Function must validate its arguments and authorize its mutation in its own
  body.
- **Exercises:** H7, H18, P6, Procedure P1, Procedure P3.
- **Checklist IDs:** `REACT-CHECK-11`, `REACT-CHECK-12`.

### REACT-SCENARIO-10 — Producer assumptions across browser and renderer presentation
- **Axis:** Hard invariant.
- **Primary category:** 7 Trust / harm / governance — the defining discrimination is what page content can
  reach. **Secondary:** 4, 6.
- **Situation:** Given one browser presentation and one Electron renderer presentation. When each is
  paired in turn with a client-only, build-time, or request-time/remote producer.
- **Good handling:** Procedure P1 records both axes independently. Each of the six combinations names the
  producer, output, production timing, hydration behavior, and security boundary. Server-dependent
  behavior has an identified framework or bundler; a client-only bundle uses client-side data access.
  The Electron renderer reaches privileged local capability only through a finite named API, with Node
  integration off, context isolation on and the sandbox on, and every message validated on arrival.
- **Bad handling:** the word browser or Electron is used to decide whether producer output is legal; a
  server function or streaming render is assumed where nothing implements it; any bundler is credited as
  an RSC implementation; producer output is treated as Node privilege; a raw bridge is handed to page
  content; context isolation or the sandbox is disabled.
- **Failure/recovery:** the privileged call rejects or the channel drops; the renderer surfaces the
  failure instead of hanging on a promise that never settles.
- **Counterfactual:** hold the presentation surface constant and swap only the producer architecture.
  The client-only case must lose its server-dependent behavior without changing presentation or security.
- **Adversarial probe:** injected page content calls the exposed surface directly; a narrow API bounds
  what it reaches, a raw bridge does not. **Cosmetic form:** the API is "narrowed" to a single generic
  invoke-by-channel function, which re-exposes the whole surface under one name.
- **Minimums:** failure/recovery see above · counterfactual see above · adversarial see above · boundary
  `n/a: no quantity, ordering, or time-window property` · change `n/a: no version or lifecycle event`.
- **Oracle:** inspect the six-row presentation/producer matrix; then call the exposed Electron surface
  from page-context code and enumerate what it can reach, reading the shipped Node-integration,
  context-isolation, and sandbox settings rather than development defaults.
- **Obligation:** the design must name both axes and the output, timing, hydration, and security boundary
  for all six combinations; every privileged capability the renderer can reach must remain enumerable.
- **Exercises:** H16, H17, P1, P6, Procedure P1.
- **Checklist IDs:** `REACT-CHECK-19`, `REACT-CHECK-20`.

---

## Design judgment
