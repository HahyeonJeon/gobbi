# Code Review

A code review protects the health of the codebase. It catches defects before they ship and keeps the code something the next person can change safely. This doc is the reviewer's playbook: the concrete points a reviewer checks, and the procedure by which a review is conducted. It is a sibling of `coding/SKILL.md` — where the skill states what good code *is*, this doc states what a reviewer *looks for* and *does*. It is usable in a normal pull-request review, in an executor's preflight self-review, and before or outside a formal gate. The detailed relationship to the other coding docs is stated in the next section, up front, so a reader knows which doc to open.

The taxonomy traces each point to a `coding/SKILL.md` principle by number — written `coding P8` and so on — so the review activity is grounded in the same principle set the author wrote against, never restating the principle body. The procedure reuses the general evaluation perspectives, causal finding content, and UPPERCASE verdicts rather than inventing a parallel review method. A Gobbi caller may add its own finding metadata, dispositions, and output shape.

---

## How this doc relates to the coding skill, evaluation.md, and gobbi evaluation

Three coding docs and one built-in command share the review space. They overlap in coverage; they differ in **framing and organization**, not in whether they are wired into a pipeline.

| Doc | Framing | Reader | Organization |
|---|---|---|---|
| `coding/SKILL.md` | **Write-side principles** — what good code *is* | the author, while writing | 17 principles, each Why / Practice / Anti-pattern |
| `coding/review.md` (this doc) | **Review-side playbook** — the points a reviewer *checks* and how a review is *conducted* | the reviewer (human or agent), standalone or as the substance behind `/code-review` | a taxonomy by review theme + a conduct-a-review procedure |
| `coding/evaluation.md` | **Evaluator's executable frame** — the per-perspective scenario/checklist machinery used to grade a change-set against the 17 principles | the gobbi evaluator agent, during the three evaluation phases | the 7 evaluation perspectives × seed scenarios + attached checklists, keyed to `(P1)…(P17)` |
| `evaluation/SKILL.md` | **The general evaluation method** — the 7 perspectives plus Overall, causal findings, completed checks, and declared verdict derivation | any independent evaluator | context + evidence + coverage + findings + verdict + handoff |

The `/code-review` built-in command is a generic review trigger with no gobbi-aware substance of its own; this playbook is the substance a reviewer applies when running it.

**Why the overlap is not redundancy.** This doc is **not** `coding/SKILL.md`: write-side versus review-side — it traces each point to a principle number and never restates the principle body. This doc is **not** `coding/evaluation.md`: playbook versus executable frame, distinguished by **organization and reader**, not by wiring. `coding/evaluation.md` is organized by the seven evaluation perspectives and the three-phase grading method, for the gobbi evaluator to grade a change-set. This doc is organized by review theme and a how-to-conduct procedure, for any reviewer anywhere.

**Authoritative-source rule.** This doc and `coding/evaluation.md` both derive their underlying rules from `coding/SKILL.md`'s numbered principles — the single source of truth. Neither doc restates the other. If the two ever diverge on a shared check, the **principle in `coding/SKILL.md` is authoritative**, and both docs are reconciled to it. The principle set, not either doc, owns the rule, so there is no orphaned sync owner.

**Cross-reference direction.** This doc cites `coding/evaluation.md` and `coding/SKILL.md` one-way. Adding reverse back-links from those docs, wiring this doc into the workflow's Load Directives and runtime mirrors, and integrating it into the evaluation phase are **deferred** (tracked in the backlog) — none of that is described here as already running. `coding/evaluation.md`'s own runtime load wiring is likewise deferred; this doc does not describe it as plugged into the pipeline.

---

## Review Outcomes

A review ends in one of three outcomes — the canonical gobbi verdicts, always UPPERCASE:

- **PASS** — the change improves the overall health of the codebase; only Medium or Low findings remain.
- **REVISE** — a High-severity finding with Confidence ≥ 50 stands; the change returns to its author with the findings that drove the verdict.
- **FAIL** — a Critical-severity finding with Confidence ≥ 75 stands; the change is blocked until the defect is repaired.

This playbook declares its exact thresholds and qualitative bar in Phase 5. A caller may impose a compatible formal scale before the review begins.

---

## Code-Review Taxonomy

Thirteen review points, broadest first. Each point uses one shape:

- **Check** — what the reviewer inspects.
- **Why** — why it matters, with the `coding/SKILL.md` principle it checks.
- **Signals** — a property-led table: the same review property illustrated across columns. Python and TypeScript appear only as illustrations of a general signal, never as a section of their own.
- **Finding mapping** — the likely gobbi finding Type + Domain, and when the point drives a verdict (a derived view of Severity and the threshold).
- **False positive to avoid** — the over-eager rejection this point invites.

Points 3 and 6 each carry two first-class sub-checks, both at full depth.

**Craft findings and the Domain rule.** Some points below — naming, imports, file and directory placement, and other style craft — have no dedicated Domain in this playbook's Gobbi-compatible set. When a craft issue actively misleads a reader or caller, record it as `design_flaw` or `assumption_risk` with Domain `general`. Do not use both Type `general` and Domain `general`. When the issue is only cosmetic preference or something the linter already catches, do not manufacture a finding: drop it under the Style-preference or Linter-catchable false-positive category, or surface the taxonomy gap to the caller.

### 1. Scope & requirement fit

**Check** — the change implements the stated requirement and only that requirement; every in-scope path is finished, with no stub standing in for promised behavior, and no feature the requirement did not ask for.

**Why** — coding P8 (Build Only What's Needed, and Finish It). Unrequested generality is pure cost — more to read, test, and maintain for a future that rarely arrives — and a half-wired path is hidden debt the next session inherits. A review confirms the change matches its contract on both edges: nothing extra, nothing missing.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| A promised in-scope path left as a stub | `raise NotImplementedError` on a shipped branch | `throw new Error("TODO")` or a `// TODO` in a live path |
| Generality with one present caller | a `**kwargs` passthrough no caller uses | a generic `<T>` fixed to one type at every call site |
| A feature the requirement did not ask for | a config flag added "for later" | an exported option no caller sets |
| The code fits the test fixture, not the requirement | a validator that accepts the sample string but rejects equivalent valid inputs | a parser that matches one sample payload but ignores documented alternate fields |

**Finding mapping** — Type `design_flaw` (unfinished path) or `scenario_gap`; Domain `process`. Drives FAIL when a promised in-scope path is unfinished (Critical, Confidence ≥ 75); REVISE when speculative generality ships (High, Confidence ≥ 50).

**False positive to avoid** — generality that a second real caller already uses is justified, not speculative; do not reject it.

### 2. Public API & caller ergonomics

**Check** — exported names, parameter order, defaults, return shape, and error behavior are designed from the caller's point of view: easy to use right, hard to use wrong. Benchmark the surface against the dominant libraries in the same domain.

**Why** — coding P2 (Design the Contract First) and coding P3 (Build Deep Units). The interface is the part every caller depends on and the part most expensive to change later. Bloch: as small as possible, easy to use, hard to misuse, least astonishment.

**Benchmark-against-established-libraries procedure** (the sharp mechanism this point requires):
1. Name the two or three dominant libraries in the change's domain (for example NumPy / PyTorch for array work, the standard collection APIs for data structures).
2. Find how each names the same operation, orders its parameters, and shapes its return and its errors.
3. Converge on that consensus — adopt the established name, order, and shape.
4. Treat a deviation from the consensus **without a stated reason in the diff** as a finding. A documented, deliberate deviation for a real reason is fine.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| Parameter order breaks the domain convention | `resize(img, width, height)` where the ecosystem uses `(height, width)` | `slice(end, start)` reversed from `Array.prototype.slice` |
| A wide options object where named params would read clearer | a function taking a dict of nine optional keys | an options bag where three named params communicate intent at the call site |
| An unstable or surprising return shape | a function returning a tuple or a dict depending on a flag | a function returning `Promise<any>` or a union with no discriminator |
| A surprising default | a mutable default argument `def f(x=[])` | a default that silently swallows errors |

**Finding mapping** — Type `design_flaw`; Domain `general`. REVISE when a public signature is hard to use correctly, or diverges from ecosystem consensus with no stated reason (High, Confidence ≥ 50).

**False positive to avoid** — a deliberate, documented deviation from convention for a concrete reason is a design choice, not a defect.

### 3. Naming & vocabulary

Two first-class sub-checks: naming **consistency** (3a) and naming **quality** (3b). Both are full checks with their own signals and false positive.

#### 3a. Naming consistency

**Check** — the same concept gets the same name everywhere in the change; no single name is overloaded for two different concepts.

**Why** — coding P5 (Name for Intent): follow one naming convention across the codebase. An inconsistent name forces the reader to re-learn the vocabulary file by file.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| One concept, several names | `user_id` here, `uid` there, `account` elsewhere | `customerId` vs `clientId` vs `id` for one entity |
| One name, two meanings | `count` is a number in one method, a callable in another | `handler` means a callback in one place, a class in another |

**Finding mapping** — Type `design_flaw` when an inconsistent name hides a distinction a caller needs; Domain `general` (a frontmatter tag — see the craft-findings rule above). A cosmetic-only inconsistency is a non-blocking nit, not a `general`/`general` finding. REVISE when the inconsistency hides a behavior or interface distinction.

**False positive to avoid** — two genuinely different concepts that share an English word are not an inconsistency.

#### 3b. Naming quality and industry-consensus terms

**Check** — each name is intention-revealing and uses the domain's established term; it follows the principle of least astonishment.

**Why** — coding P5 (Name for Intent): a precise name removes the need to open the body. Bloch: names matter — prefer the term a practitioner in the domain already knows.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| A placeholder or vague name | `data`, `tmp`, `do_it()` | `obj`, `handleThing`, `value2` |
| A coined term where a standard one exists | `fetch_and_parse` for what the domain calls `deserialize` | `makeReady` for what the framework calls `initialize` |

**Finding mapping** — Type `design_flaw` when a vague or non-standard name misleads about the unit's job; Domain `general` (a frontmatter tag — see the craft-findings rule above). A purely cosmetic naming nit is non-blocking, not a `general`/`general` finding. Nit to REVISE.

**False positive to avoid** — a domain term the reviewer simply does not know is not a bad name. Check the ecosystem's vocabulary before flagging it.

### 4. Necessity & simplicity

**Check** — every new construct (class, wrapper, layer, abstraction) earns its place; nothing is added only to look organized.

**Why** — coding P3 (Build Deep Units): a wrapper that hides nothing is a shallow unit that raises total complexity. coding P8 (Build Only What's Needed): no speculative structure. coding P12 (Don't Repeat Knowledge): abstract on evidence — wait for the pattern to recur and prove its shared reason-to-change before extracting it.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| A forwarding layer that hides nothing | a `Manager` class wrapping one function call | a `Service` that only forwards to a repository |
| An abstraction with a single caller | a base class with one subclass | a generic interface implemented once |
| A premature factory or strategy point | a `Factory` for one product type | a strategy map with one strategy |

**Finding mapping** — Type `design_flaw`; Domain `general`. REVISE when a one-use abstraction or a hide-nothing wrapper ships.

**False positive to avoid** — a deep unit with a small interface over real complexity is not over-structure, even when it is new. Judge by the complexity hidden, not by the line count.

### 5. Architecture, classes & methods

**Check** — each class or module has one cohesive responsibility statable in a single sentence; method contracts are stable; deep units sit behind small interfaces.

**Why** — coding P4 (Decompose by Responsibility): the right seam is where one reason-to-change touches one place. coding P3 (Build Deep Units). scikit-learn's API lesson: a small, consistent method vocabulary, and non-proliferation of classes.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| A god-unit whose job needs an "and" | a class that parses AND caches AND renders | a service doing auth AND billing AND email |
| An inconsistent method vocabulary | `get_x` / `fetch_y` / `load_z` for one kind of operation | `getUser` vs `retrieveOrder` vs `loadCart` |
| A unit reaching into another's data | a method using another object's internals | feature-envy on another class's fields |

**Finding mapping** — Type `design_flaw`; Domain `general`. REVISE when a single change forces edits across many units in lockstep — the signal the seam is in the wrong place.

**False positive to avoid** — a class with several methods is not a god-unit when they all serve one responsibility.

### 6. File, directory & import structure

Two first-class sub-checks: import structure (6a) and file/directory structure (6b). Both are full checks.

#### 6a. Import consistency

**Check** — imports are grouped and ordered at the module top; no wildcard imports; type-only imports are separated where the language distinguishes them.

**Why** — coding P5 (Name for Intent: follow the convention), coding P4 (Decompose by Responsibility: imports express module boundaries), and coding P15 (Change With Blast-Radius Awareness: an import change moves with its callers). PEP 8: imports at the top, grouped standard-library / third-party / local, one per line, absolute preferred, no wildcards.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| A wildcard import hiding the surface | `from module import *` | `import * as everything from "./mod"` used as a grab-bag |
| Ungrouped or unordered imports | standard-library mixed with local, no blank-line groups | a runtime import and `import type` mixed in one statement |
| A new import direction creating a cycle | a domain module importing a CLI adapter that already imports it | a UI component importing a server-only module through a convenience barrel |
| A mid-file import with no stated reason | an `import` inside a function body | a `require()` buried in a method |

**Finding mapping** — Type `design_flaw` when an import hides the surface or creates a cycle; Domain `dependency` for a cycle or a dependency-direction problem, else `general` (a frontmatter tag — see the craft-findings rule above). A pure ordering nit is linter-catchable — drop it under that false-positive category rather than emit a `general`/`general` finding.

**False positive to avoid** — a deliberate lazy import to break a cycle or defer a heavy load is justified. Check for the reason before flagging.

#### 6b. File & directory structure

**Check** — new files live where a reader would look for them; entry points follow the project's convention.

**Why** — coding P4 (Decompose by Responsibility: files grouped by what changes together) and coding P5 (Name for Intent: a conventional, findable structure).

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| A file in a surprising place | a domain model dropped under `utils/` | a React hook outside the `hooks/` directory |
| A non-conventional entry point | logic hidden in `__init__.py` a reader will not expect | named exports bypassing the package's barrel `index.ts` |

**Finding mapping** — Type `design_flaw` when placement hides ownership or leaves an export stale; Domain `docs-sync` for a stale export or reference, else `general` (a frontmatter tag — see the craft-findings rule above). A subjective placement preference is a non-blocking nit, not a `general`/`general` finding. Nit to REVISE.

**False positive to avoid** — an existing project layout the reviewer dislikes, but which is the established convention, is not a defect.

### 7. Data flow, state & side effects

**Check** — pure decision logic is separated from I/O; mutable state is small, owned, and local; any shared mutable state has a stated owner and synchronization decision.

**Why** — coding P16 (Control State and Side Effects): shared mutable state is where the hard bugs live, because behavior then depends on an order of events nowhere written down. coding P6 (Design for Verification): the same isolation that controls state is what makes the logic testable.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| Logic welded to I/O | a function that computes AND writes the database | a calculation that also calls `fetch()` inline |
| A hidden input mutation | a function mutating a passed-in list | a method mutating its argument object |
| Shared mutable state with no owner | a module-level dict written from many places | a singleton mutated by several callers with no lock or queue |

**Finding mapping** — Type `design_flaw`, or `assumption_risk` for an unstated single-writer assumption; Domain `general` — escalate to `security` when a race crosses a trust boundary. REVISE or FAIL by impact.

**False positive to avoid** — a small, locally-owned mutation inside one function is fine. The point is to minimize *shared* state, not all state.

### 8. Error handling, trust boundaries & dependencies

**Check** — failures surface loudly with no swallowed exceptions; untrusted input is validated and normalized at the boundary; no command, query, or path is built from raw untrusted text; secrets are neither committed nor logged; any new dependency is vetted, version-pinned, and license-checked.

**Why** — coding P10 (Make Failure Explicit, Guard the Trust Boundary). Silent failure and unvalidated input are how a small bug becomes an incident discovered far from its cause, and the same boundary that fails open on input also fails open on secrets and on borrowed code.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| A swallowed failure | `except: pass` | an empty `catch (e) {}` block |
| Untrusted input used unchecked | a filesystem path built by concatenating user input | a network payload `as User`-cast with no validation |
| An injection surface | `os.system(f"... {user}")` | a SQL string built by template literal |
| An unvetted dependency | a new PyPI dep, unpinned, unknown license | a new npm dep from a typo-squat-looking name |

**Finding mapping** — Type `design_flaw` or `assumption_risk`; Domain `security` (boundary, injection, secrets) or `dependency` (new deps). Drives FAIL when an unvalidated trust boundary or an injection surface ships (Critical, Confidence ≥ 75).

**False positive to avoid** — input already validated at an outer boundary need not be re-validated at every inner call. Confirm where the trust boundary actually sits before flagging.

### 9. Tests & verifiability

**Check** — the change adds or updates tests; the tests prove behavior, not implementation detail; a verification command is citable and was run.

**Why** — coding P6 (Design for Verification). Untested behavior rides along undetected until production, and a test pinned to internals breaks on every refactor without catching a real defect.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| Behavior shipped with no covering test | a new branch with no test exercising it | a new exported function left untested |
| A test pinned to implementation | asserting on a private attribute | asserting on internal call order via a spy |
| A disabled test on a real change | `@pytest.mark.skip` left on changed behavior | a disabled `xit` on a changed path |
| A verification claim with nothing runnable behind it | notes say the tests are green but cite no command or result | the review cannot find the command that proves the typecheck or build |

**Finding mapping** — Type `checklist_gap`; Domain `test`. REVISE when behavior ships without a covering test (High, Confidence ≥ 50).

**False positive to avoid** — a pure rename or a comment-only change needs no new test. Match the test ask to the behavior change.

### 10. Performance & resource use

**Check** — algorithmic cost fits the realistic input; no accidental quadratic, no N+1 per-iteration external call, no unbounded accumulation; any optimization that complicates the code cites a measurement.

**Why** — coding P14 (Make It Efficient Enough): performance is a design property of the algorithm and the data structure, not a polish applied later. coding P11 (Optimize for the Reader): do not trade clarity for an unmeasured gain.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| An accidental quadratic | a nested loop over the same list | `arr.find()` inside a `.map()` over the same array |
| An N+1 external call | a query per loop item | an `await fetch()` per array element in a loop |
| The wrong structure for the access pattern | a membership test by `in list` | `includes()` on an array used as a set |
| Unbounded growth | a cache with no eviction policy | an array that only ever grows |

**Finding mapping** — Type `design_flaw`; Domain `performance`. REVISE or FAIL when a hot path carries a cost that will not scale with realistic input.

**False positive to avoid** — a quadratic over a provably tiny, bounded input is not a defect. Clarity wins on a cold path.

### 11. Comments, docstrings & public docs

**Check** — comments explain the why (the rationale, the constraint, the rejected alternative), not the what; docstrings on public surfaces are compact but complete; co-located docs move with the code.

**Why** — coding P13 (Comment the Why, Not the What). PEP 257: a summary line first, imperative mood, no restatement of the signature. Bloch: document every exported element.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| A comment restating the code | `# increment i` above `i += 1` | `// set the name` above `this.name = name` |
| A docstring restating the signature | a docstring repeating param types already annotated | a TSDoc re-listing params with no added meaning |
| A stale doc after a change | a docstring describing removed behavior | a TSDoc `@returns` that no longer matches |
| A missing doc on a public surface | an exported function with no docstring | an exported API with no TSDoc |

**Finding mapping** — Type `general`; Domain `docs-sync`. Nit to REVISE; REVISE when a public doc contradicts the code, because a contradicting doc misleads worse than none.

**False positive to avoid** — a short, well-named private helper does not need a docstring. Reserve the ask for public surfaces and for the non-obvious why.

### 12. Consistency & blast radius

**Check** — everything that must move with the change moved with it: callers, tests, docs, comments, generated artifacts, exports; and no business rule or constant is duplicated into a second home that will drift.

**Why** — coding P15 (Change With Blast-Radius Awareness): the unit of a change is the interface plus everything that depends on it, not the one file in front of you. coding P12 (Don't Repeat Knowledge): one authoritative home per decision.

**Signals**

| General signal | Python | TypeScript |
|---|---|---|
| A stale caller after a rename | an old function name still imported somewhere | an old export still referenced in a test |
| A doc or test not updated with the code | code changed, docstring or README left stale | code changed, a `.d.ts` or a snapshot left stale |
| A generated or derived artifact left stale | a schema file or fixture snapshot still reflecting old behavior | generated types or a lockfile out of sync with the source |
| A duplicated rule | a constant copied into two modules | a magic number repeated in client and server |

**Finding mapping** — Type `design_flaw`; Domain `docs-sync` (drift) or `regression` (a prior iteration introduced it). REVISE when a caller, doc, or test is left stale.

**False positive to avoid** — two look-alike constants that encode *different* decisions are not a duplication. Merging them couples things that should move apart — coding P12's same-text-versus-same-knowledge distinction.

### 13. Review communication

**Check** — each finding is line-specific, evidence-backed, and actionable; comments distinguish a blocker from a suggestion, a question, a nit, and praise; the why is stated, not just the what.

**Why** — this point traces the behavioral plain-writing principle, `principles/SKILL.md` P7 (Say/Write Plainly, Briefly, and Literally) — **not** coding P7 (Build Bottom-Up). A review comment is meant to be read and acted on; a vague or harsh one wastes the author's time or starts a fight. Google's review-comments guidance: be courteous, be specific, explain the why, and distinguish a required fix from a suggestion.

**Signals** (this point governs the reviewer's own writing, so the columns contrast a weak comment with a strong one; it is language-neutral)

| Property | Weak comment | Strong comment |
|---|---|---|
| Located and specific | "this is confusing" | "`parse()` at line 42: the empty-string case returns `None`, but the caller expects `''` — see the failing test" |
| Preference marked, not mandated | "don't write it this way" | "nit (non-blocking): a comprehension reads clearer here; optional" |
| The why is stated | "rename this" | "rename `d` to `delay_ms`: the unit is load-bearing at the three call sites" |

**Finding mapping** — none, by design. Point #13 is a meta point: it governs how every *other* finding is phrased, so it is not itself a code-finding and carries no Type or Domain. A review that produces vague, unlocatable, or hostile comments is low-quality regardless of its verdict — fix the comment, do not file a finding against the code.

**False positive to avoid** — a terse comment on an obvious issue is fine. Do not pad every nit into a paragraph.

---

## Review Procedure

### Who runs review

| Role | What they do | What they must not do |
|---|---|---|
| **Executor (preflight self-review)** | applies this taxonomy to its own change before handing it off; catches the obvious issues early | is **never** the final reviewer of its own work — the creator never evaluates its own output |
| **Reviewer (human or agent)** | runs the procedure, writes findings, sets the verdict | never edits the artifact under review; re-delegates fixes to the author |
| **Manager** | re-delegates fixes; owns every user-facing decision through the runtime's user-decision primitive | does not collapse the two independent reviews into one |
| **Two independent evaluators (Claude + Codex)** | a formal agentic review runs both systems in parallel; cross-system divergence is the anti-groupthink signal | never share state; never continued or reused across the pair |

> **Availability now versus deferred.** Manual, standalone, and executor-preflight self-review use of this doc is available **now** — a reviewer can apply the taxonomy and procedure today. Using this doc **automatically as part of** the formal gobbi EVALUATION sub-phase is **deferred until the wiring ships** (see the backlog). The procedure below describes what a reviewer does, not an automated pipeline.

### Phase 0 — Preflight

Confirm the review target and its scope contract. Identify the public API surfaces first — they are where review attention pays off most. Load the relevant project conventions and prior failure evidence. Confirm the change is **small and self-contained**; a large, multi-purpose change is reviewed worse, and a reviewer may return it for size alone, asking the author to split it. List the safe verification commands — the type checks, the test subset, the build — and confirm they are side-effect-free before running them.

### Phase 1 — Understand the change

Read in this order: the requirement or plan, then the diff summary, then the public API changes, then the tests, then the implementation, then the docs and examples. Read the implementation **after** the tests and the contract, not first — reading it first biases the reviewer toward the author's chosen shape instead of the requirement.

### Phase 2 — Build the review frame

Use the taxonomy to build a per-change checklist. Prioritize by the surface the change actually touches — a new public API leads with point 2, a parsing fix leads with points 8 and 9. Every frame includes at least one adversarial scenario: the edge case, the failure mode, or the attack vector the change invites.

### Phase 3 — Review in priority order (broadest-first)

Walk the change broadest concern first, so a design-level problem is found before time is spent on style:

1. Correctness & requirement fit (point 1)
2. Public API & caller ergonomics (point 2)
3. Risk — error handling, trust boundaries, dependencies (point 8)
4. Architecture & state (points 4, 5, 7)
5. Tests & verifiability (point 9)
6. Performance (point 10)
7. Naming, comments, docstrings, imports, structure, style (points 3, 6, 11, 12)

A defect found at the top of this list often dissolves the items below it — there is no point polishing the naming of a function that should not exist.

### Phase 4 — Write findings

For standalone use, record the same causal content in readable prose. For a formal Gobbi handoff, use this
Gobbi-compatible finding record; the active workflow adapter owns its machine serialization and may require
additional provenance fields:

- `finding-id` — the stable idempotency key, set on first creation.
- **Type** — one of `scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` / `general`.
- **Domain** — the subject-area label (`security`, `performance`, `test`, `docs-sync`, `dependency`, `process`, and the rest of the canonical set).
- **Severity** — Critical / High / Medium / Low.
- **Confidence** — 0 / 25 / 50 / 75 / 100.
- **Disposition** — open / addressed / disputed / deferred / superseded.
- **location** — the file and line.
- The body: Issue / Evidence / Why-it-matters / Change-needed.

This playbook does not add a `blocking` field. Inline review comments may use Conventional-Comments labels and
a decoration, and the decoration maps onto Severity and Disposition rather than being stored:

| Conventional-Comments element | Maps onto |
|---|---|
| `issue:` label | Type `design_flaw` / `assumption_risk` |
| `suggestion:` / `nitpick:` label | Type `general` |
| `question:` label | a clarification, recorded as `assumption_risk` if it reveals a risk |
| `todo:` label | Type `checklist_gap` |
| `praise:` label | feeds the Preserve-list |
| `(blocking)` decoration | Severity High or Critical, Disposition `open` — must be resolved before PASS |
| `(non-blocking)` decoration | Severity Medium or Low, recorded but not a verdict gate |
| `(if-minor)` decoration | Severity Low — address only if the fix is cheap |

Keep each finding distinct: one issue, one finding, with its own evidence and its own remediation. Splitting one issue into many to look thorough is finding-batching.

### Phase 5 — Verdict & handoff

Compute the verdict from the mechanical thresholds, using the canonical UPPERCASE verdicts:

- **FAIL** — a Critical-severity finding with Confidence ≥ 75.
- **REVISE** — a High-severity finding with Confidence ≥ 50.
- **PASS** — otherwise; only Medium or Low findings remain.

Only open, disputed, or newly surfaced findings drive this playbook's verdict. A finding already addressed in
the reviewed version does not count against it.

Apply the qualitative bar on top of the thresholds: approve once the change **improves the overall health of the codebase**, even when it is not perfect; decide by principle and data, not by personal preference; and do not hold a change hostage for days over nits — mark a non-required polish item non-blocking and let it ship. The handoff package is the verdict, the findings that drove it, the lower-severity findings recorded for context, and a **Preserve-list** — what the change got right, so a REVISE iteration does not undo it.

---

## Gobbi Integration

A review run under this playbook is expressible in the general Evaluation method's seven perspectives plus
Overall, causal findings, and UPPERCASE verdicts. A Gobbi workflow adapter can add its formal metadata and
output shape without changing the substantive review. The taxonomy points map onto the perspectives like this:

| Taxonomy point | Owning evaluation perspective(s) |
|---|---|
| 1 Scope & requirement fit | Project |
| 2 Public API & caller ergonomics | Usage, Structure |
| 3 Naming & vocabulary | Aesthetics |
| 4 Necessity & simplicity | Structure |
| 5 Architecture, classes & methods | Structure |
| 6 File, directory & import structure | Structure, Consistency |
| 7 Data flow, state & side effects | Structure, Risk |
| 8 Error handling, trust boundaries & dependencies | Risk |
| 9 Tests & verifiability | Structure, Risk |
| 10 Performance & resource use | Performance |
| 11 Comments, docstrings & public docs | Aesthetics, Consistency |
| 12 Consistency & blast radius | Consistency |
| 13 Review communication | (meta — governs how findings are written) |

Every formal Gobbi finding this playbook produces uses its compatible Type, Domain, Disposition, Confidence,
and Severity record. Standalone findings may express the same content narratively.

**This integration is described as intent, not as wiring that already runs.** Standalone, manual, and preflight use is available now. Automatic use inside the formal EVALUATION sub-phase — and the RECORD-phase capture of review findings into the session record — is **deferred until the wiring ships**: the Load Directives entry, the runtime mirrors (`.claude/`, `.codex/`, `plugins/gobbi/`), the evaluation-phase integration, and the reverse back-links from `coding/evaluation.md` and `coding/SKILL.md`. That wiring is tracked in the backlog and is not part of this doc's current contract.

If that wiring is built later, it must preserve these invariants:

- the causal finding content and perspective ownership from `evaluation/SKILL.md`;
- the active Gobbi workflow's required finding metadata and output contract;
- the UPPERCASE verdicts PASS / REVISE / FAIL;
- the REVISE trigger as a High-severity finding with Confidence ≥ 50;
- no `blocking` finding field;
- language advice kept property-led — examples inside the signal tables, never a language-siloed section.

---

## Scope — language-agnostic, with language idioms routed to their owners

This doc states the language-agnostic *property* of each review point. Python and TypeScript appear only as illustrations inside the property-led signal tables — never as a section of their own. The rule of thumb mirrors `coding/SKILL.md` § Scope: if the check changes when you switch languages, it is an idiom, not a review point. The points here check the property ("the same concept gets the same name", "untrusted input is validated at the boundary"); the concrete idiom ("in this language, that boundary is this type, that test is this framework") defers to the `go` domain family or the `python` and `typescript` skills, and the platform idiom to the `electron` skill.

Because the points are properties, they apply to any language. A reviewer reading Go applies the same thirteen points and also loads every applicable child from `go/SKILL.md`; a reviewer reading another language uses its idiom owner when one exists. The Python and TypeScript columns are examples to reason by, not gates the change must match.

---

## Scenarios this doc must serve

Six common change types, with the taxonomy points each one leads with and the outcome a clean fixture should produce.

- **A1 — A new public API.** A function exported from a Python package or a TypeScript library. Lead with point 2 (benchmark the names, parameter order, return shape, and errors against ecosystem convention), then points 9 and 11. A diff with a bad parameter name, an over-broad options object, stale docs, and a missing call-site example should produce at least one API finding, one docs-sync finding, and one test finding.
- **A2 — An over-structured small change.** A bug fix that adds an unneeded class, or a refactor adding a one-caller generic helper. Lead with point 4. The wrapper that hides a real invariant reaches PASS; the wrapper that only forwards fields earns a REVISE.
- **A3 — A bug fix.** A parsing, validation, or state-update fix. Lead with point 8 (root cause, not masked symptom) and point 9 (a regression test that breaks before the fix and is green after). A fix that special-cases the sample input but misses the root cause is a `design_flaw` or `assumption_risk` that drives REVISE or FAIL.
- **A4 — A structural refactor.** Moving files, changing imports, renaming classes, reorganizing directories. Lead with point 12 (blast radius) and point 6. One stale export, one stale doc example, and one import cycle should all surface without relying on a single grep.
- **A5 — A trust-boundary change.** Parsing external JSON, shelling out, reading a user-input path, adding a dependency. Lead with point 8. A network payload cast without validation and a path concatenated from raw input are both Risk findings — classified by property, with no language-specific section.
- **A6 — Docs, comments, docstrings.** A new docstring or TSDoc. Lead with point 11. An overlong docstring is trimmed, a stale param description blocks until fixed, and a necessary rationale comment is preserved.

---

## Validation Method

A reviewer self-check, run on a completed review before handing off the verdict:

- Every changed surface was checked against the taxonomy points that apply to it — the broadest-first order was walked, not skipped.
- Every finding carries the complete causal content plus the active caller's required metadata, and this
  playbook adds no `blocking` field.
- The verdict follows the mechanical thresholds, and a PASS is defensible — the review actively tried to break the change, not merely confirm it.
- The Preserve-list is non-empty, or it states explicitly that nothing should be preserved.
- Each comment is located, evidence-backed, and marks a preference as non-blocking rather than as a mandate.

---

## Sources

Internal gobbi docs this playbook builds on:

- `coding/SKILL.md` — the 17 language-agnostic principles; the single authoritative source every taxonomy trace resolves to.
- `coding/evaluation.md` — the evaluator's executable frame; the framing-distinct sibling this doc cites one-way.
- `evaluation/SKILL.md` — the general perspectives, causal finding content, checklist completion, and declared
  verdict derivation the procedure reuses.
- `principles/SKILL.md` — the 10 behavioral principles; point 13 traces `principles/SKILL.md` P7 (Say/Write Plainly).

External references the taxonomy and procedure fuse:

- Google, "What to look for in a code review" — broadest-first priority order. https://google.github.io/eng-practices/review/reviewer/looking-for.html
- Google, "The Standard of Code Review" — approve once the change improves overall code health; principle and data over preference; mark a nit non-blocking. https://google.github.io/eng-practices/review/reviewer/standard.html
- Google, "Code review comments" — courteous, specific, explain the why, distinguish required fixes from suggestions (point 13). https://google.github.io/eng-practices/review/reviewer/comments.html
- Google, "Small CLs" — small, self-contained changes are reviewed faster and more thoroughly; a reviewer may return for size alone (Phase 0). https://google.github.io/eng-practices/review/developer/small-cls.html
- Joshua Bloch, "How to Design a Good API and Why it Matters" — as small as possible, easy to use, hard to misuse, least astonishment, names matter, document every exported element (points 2, 3, 11). https://research.google.com/pubs/archive/32713.pdf
- scikit-learn, "API design for machine learning software" — consistency, non-proliferation of classes, sensible defaults, a small consistent method vocabulary (points 4, 5). https://arxiv.org/abs/1309.0238
- Cross-library API consensus — NumPy / PyTorch / the Array API standard — consistent argument naming and a convergent operation surface (point 2's benchmark mechanism). https://numpy.org/neps/nep-0056-array-api-main-namespace.html
- PEP 8 — imports at the top, grouped, one per line, absolute preferred, no wildcards (point 6a). https://peps.python.org/pep-0008/
- PEP 257 — docstring conventions: summary line first, imperative, no signature restatement (point 11). https://peps.python.org/pep-0257/
- Conventional Comments — label every review comment and add a `(blocking)` / `(non-blocking)` / `(if-minor)` decoration that maps onto Severity and Disposition (points 13, Phase 4). https://conventionalcomments.org/
- TypeScript API and module conventions — options-bag params, named exports, a barrel entry point, type-only imports (points 2, 6). https://azure.github.io/azure-sdk/typescript_design.html
