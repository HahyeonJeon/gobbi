# Coding — Code-Quality Review Frame

Child doc for the evaluator reviewing a code change-set against the `coding` skill's seventeen principles.
Intended to complement the [Execution operation](../execution/SKILL.md) (code-quality versus task completion);
the runtime load-both wiring is deferred. Execution covers whether the executor implemented the right task
completely, within scope, and with verification; this `coding` child doc covers whether the code itself is
well-designed, well-built, and well-crafted. It provides per-perspective seed scenarios with attached yes/no
checklists, recommended verifications, perspective-specific anti-patterns, and Overall anchors.

Every graded scenario cites the teaching principle it checks by number — `(P1)` … `(P17)` — keyed to the `coding/SKILL.md` principle of that number. Nothing is graded that the skill does not teach, and no citation exceeds 17. The principles are language-agnostic *properties* of good code; concrete language idioms (casing, type-system, test-framework, runtime-perf specifics) defer to the `python` / `typescript` skills, and platform idioms to the `electron` skill, so this frame grades the property, not the idiom.

The artifact under evaluation is the **actual code change-set** (modified source, new units, the executor's
notes). Scenarios include adversarial cases (premature abstractions, masked symptoms, silently-widened trust
boundaries), so Phase 2 investigates each perspective once without a separate adversarial pass.

---

## Project

**Lens**: Does the change solve the **right problem** — the actual requirement, designed before it was implemented, and no more than the requirement asked for?

### Seed scenarios with attached checklists

**The code solves the actual requirement, not an imagined more-general one (P8)**
- The change maps to the stated requirement, with no feature the requirement did not ask for.
- No configurability, plugin point, or abstraction the present use does not need is introduced.
- Generality, if present, is justified by a second real caller — not added on first sight of similarity.

**The code was designed before it was implemented (P1, P2)**
- There is a coherent contract — names, inputs, outputs, error cases, module placement — not a signature that fell out of the body.
- The approach follows an existing codebase pattern for this kind of problem, or the deviation is justified.
- The surrounding code was read first: the change reads as if it belongs, not as logic invented in the implementer's frame.

**Every in-scope path is finished (P8)**
- No `TODO`, `NotImplemented`, or empty branch stands in for behavior the requirement promised.
- No half-wired "for later" path is shipped as if it were done.

**A framework or plugin system is built for a single present use (adversarial) (P8)**
- New abstractions are checked for a second present caller; a one-use framework is flagged as speculative generality.
- An unused option is preferred deleted over kept "just in case".

### Recommended verifications

| Tool | Use for |
|---|---|
| Read the change against the stated requirement | Detect features the requirement did not ask for, and unfinished promised behavior |
| `grep` the diff for `TODO` / `NotImplemented` / empty branches | Catch half-done in-scope paths |
| Check each new abstraction for a second present caller | Detect speculative generality |
| Read the surrounding code's pattern for this problem | Confirm the design follows prior art or justifies deviation |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"While I was here" generality** | Configurability built for a single present use is pure cost. Build for the requirement in front of you; add generality only when a second real caller demands it |
| **A stub reported as done** | A `TODO` or empty branch standing in for promised behavior is unfinished work, not a complete task. Finish every in-scope path |
| **An interface reverse-engineered from the implementation** | A signature that fell out of the body is not a designed contract. The contract is sketched first, judged from the caller's point of view |

---

## Structure

**Lens**: Is the **design quality** of the code sound — deep units, decomposition by responsibility, controlled coupling, testable seams, evidence-backed abstractions?

### Seed scenarios with attached checklists

**Units are deep (P3)**
- Interfaces are small relative to the implementation they hide.
- No pass-through wrapper or "manager" that adds a name but hides no complexity.
- Special cases and configuration are pushed down into the unit, not exposed as knobs to every caller.

**Decomposition is by responsibility (P4)**
- Each unit's responsibility states in one sentence with no "and".
- No catch-all unit that accumulates unrelated responsibilities.
- No fragment-scatter where one change must touch many units in lockstep.

**Coupling is controlled (P3, P4)**
- Dependencies are one-directional; the change introduces no new import cycle.
- A third-party API is wrapped behind a local interface where its surface is broad, unstable, or leaks its shape into the code — and a thin one-call pass-through that hides nothing is flagged as the shallow wrapper itself, not credited as a wrap.

**The code is designed for verification (P6)**
- Decision logic is separable from I/O; the pure part can be exercised without the database, network, or disk.
- Dependencies are injectable, not self-constructed, so a test can insert a stand-in.
- Behavior at the seam is deterministic — no reliance on real time, randomness, or ambient execution order a test cannot control.

**State is controlled and side effects are isolated (P16)**
- Mutable state is kept small, owned, and local; data is preferred immutable over mutated in place.
- A pure computational core is separable from its side effects — I/O, mutation, time, and randomness sit at the edges, not woven through the logic.
- No function mutates its inputs or reaches out to mutate shared state as a hidden side effect the signature does not reveal.

**Abstractions are evidence-backed (P12)**
- No abstraction has a single caller; no generality is extracted before the pattern recurs.
- Two look-alike fragments that encode different decisions are not merged into a coupling.

**Built incrementally — skeleton first, minimal verified steps (P7)**
- Where the executor's notes or the commit history are available, the change shows skeleton-first, minimal-verified-step construction, not a single big-bang pass.
- Graded only when that process evidence is present; absent it, this scenario is noted not-applicable rather than failed.

**A premature abstraction with one caller, or a unit grown to do everything (adversarial) (P3, P12)**
- Each new exported unit's caller count is checked; a one-caller abstraction is inlined unless it was named in the design.
- A unit that has accreted unrelated responsibilities is flagged for a responsibility split.

### Recommended verifications

| Tool | Use for |
|---|---|
| `grep` for circular import patterns | Detect coupling regressions |
| Check each new exported unit's caller count | Detect premature abstraction |
| Trace whether the logic can be exercised without its environment | Confirm testable seams (P6) |
| Read the dependency direction across the change-set | Confirm coupling stays one-directional |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Size-driven splitting** | Splitting to hit a line target produces shallow fragments that must all change together. Let the seam follow responsibility, not length |
| **A God-unit** | A catch-all unit that does everything has no clear reason-to-change. Decompose by responsibility |
| **Logic welded to I/O** | Logic reachable only by hitting the database / network / disk can be exercised only as an integration test. Separate decision logic from side effects so it is testable (P6) |

---

## Performance

**Lens**: Is the change **efficient enough** — an algorithm and data structure fit to the data, no wasted or repeated work, optimization driven by measurement?

### Seed scenarios with attached checklists

**Algorithmic complexity fits the expected input size (P14)**
- The hot path's big-O matches realistic data volume.
- No accidental quadratic — a nested scan over the same data — on data that can grow.

**No wasted or repeated work (P14)**
- A value recomputed inside a loop is hoisted or memoized.
- Large structures are not needlessly copied on a path that runs often.

**No N+1 / per-iteration external calls (P14)**
- A loop does not issue one query, request, or disk read per item where a batch would serve.

**The data structure fits the access pattern (P14)**
- Membership tests use a set or map, not a linear scan.
- Ordered access uses an ordered structure, not a repeated sort or scan.

**Optimization is evidence-driven (P14, P11)**
- Any optimization that complicates the code cites a measurement.
- The simple, clear form stands until a profile identifies a real hot path; clarity is not traded for an unmeasured gain.

**Resource use is bounded (P14)**
- No unbounded accumulation; no cache without an eviction policy.
- Handles, streams, and connections are released.

**An "optimized" path that is unreadable and unmeasured, or a cold path optimized while a quadratic hot path is missed (adversarial) (P14, P11)**
- Any complexity added in the name of speed is checked against a measurement; an unmeasured "optimization" is reverted to the clear form.
- The genuine hot path is identified first; effort is not spent on a cold path while a hot-path cost goes unmeasured.

### Recommended verifications

| Tool | Use for |
|---|---|
| Trace the worst-case input through the hot path and state its big-O | Detect an accidental quadratic on growable data |
| `grep` loops for per-iteration I/O and for list scans that should be set lookups | Detect N+1 and wrong-structure patterns |
| Check for unbounded accumulation / unevicted caches / unreleased handles | Confirm bounded resource use |
| Confirm each code-complicating optimization cites a measurement | Detect optimization-without-evidence |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Probably fast enough" with no estimate** | Performance is a design property, not a guess. State the hot path's big-O against realistic input |
| **Structure chosen for authoring convenience** | A list used for membership where a set fits is a cost the access pattern did not have to pay. Pick the structure that fits the access pattern |
| **Clarity traded for an unmeasured gain** | A clever micro-optimization that complicates the code for a gain no measurement confirms is waste. Keep the clear form until a profile justifies the complex one |

---

## Aesthetics

**Lens**: Is the **code itself** readable — names that tell the truth, clarity over cleverness, comments that carry the why, formatting that matches the project?

### Seed scenarios with attached checklists

**Names tell the truth (P5)**
- Names are intention-revealing and convention-following — not placeholders or abbreviations the reader must expand.
- No name is left inaccurate after a behavior change; a stale name that lies is renamed.

**Clarity over cleverness (P11)**
- No dense construct reads slower than the plain form it replaced.
- The common path is obvious and the exceptional path clearly marked, not folded into one dense expression.

**Comments carry the why (P13)**
- Comments explain the non-obvious — the rationale, the constraint, the rejected alternative.
- No what-narration restating what the line plainly does; no commented-out code; no stale comment that contradicts the code it sits above.

**Formatting matches the project convention (P5, P11)**
- The diff passes the project's format / lint convention.
- No formatter-vs-author churn is left mixed into the behavior diff.

**A neat-looking diff hides a logic change in reformatting noise (adversarial) (P11)**
- Pure-formatting changes are isolated from behavior changes so a reviewer can tell a re-flow from a changed conditional.
- The diff is read for a logic shift buried under whitespace movement.

### Recommended verifications

| Tool | Use for |
|---|---|
| Read names at call sites for accuracy | Detect vague or post-refactor stale names |
| `grep` for debug-print patterns and commented-out blocks | Catch leftover debug / dead code |
| Check each comment against the code it sits above | Detect what-narration and contradicted comments |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Comments narrating the code** | A comment restating the obvious is noise. Reserve comments for the why the code cannot express; delete the narration |
| **Naming drift after a refactor** | A unit whose body changed but whose name did not is a name that lies. Rename to match the new behavior |
| **Cleverness over clarity** | A terse construct that costs every future reader is not a virtue. Prefer the straightforward form |

---

## Usage

**Lens**: For the **next consumer** — the next caller of the changed unit, the next maintainer, the future-self debugging at 3am — is the code usable from the outside?

### Seed scenarios with attached checklists

**Public signatures are self-explanatory (P3)**
- A fresh caller can use each exported unit from its signature and doc alone, without reading the body.
- Parameter names communicate intent at the call site.

**The input interface demands only what the unit uses (P17)**
- The unit takes the specific values it reads, not a whole aggregate or config object passed opaquely so the body can pull a few fields out of it — stamp coupling that makes the caller build more than the call needs.
- No boundary parameter is a deeply nested or elaborate type the caller must decode before they can construct a valid argument.
- A fresh caller can tell what to pass, and assemble it, from the unit's signature and doc alone, without opening the body to learn which fields matter.

**Error messages are actionable (P10)**
- Each error names the failure and a remediation path.
- No bare "error" / "something went wrong" message with no failure name and no remedy.

**Failure paths are discoverable (P10, P11)**
- The happy path is obvious and the failure paths are visible, not hidden in side effects.
- A caller can see how a unit can fail without reading its internals.

**Correct use depends on undocumented call-order or hidden global state (adversarial) (P3)**
- For each new exported unit, a first-time caller is simulated from the signature and doc alone; if correct use requires a hidden call-order or ambient global, the interface is flagged incomplete.
- No required setup is left implicit in the implementation.

### Recommended verifications

| Tool | Use for |
|---|---|
| Simulate a first-time caller from each new signature + doc | Detect call-site fragility and hidden-precondition reliance |
| `grep` error-raising paths for message quality | Audit that errors name the failure and a remedy |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"The caller will figure it out"** | If the caller has to read the implementation to know what to do, the signature is incomplete. Make the contract usable from the outside |
| **A generic error message** | "Error" is a debugging dead-end. Name the failure and the remediation path |
| **A unit usable only by reading its internals** | Hidden call-order or global state makes the unit a trap. Surface the requirement in the interface |

---

## Consistency

**Lens**: Did **everything that should change together, change together** — surrounding code, callers, comments, docs, tests, and any duplicated knowledge?

### Seed scenarios with attached checklists

**New code matches the surrounding code (P1, P5)**
- Patterns, idioms, and naming match the neighbors; the change reads as one author.
- No novel pattern is introduced where an existing one fits.

**Renames and signature changes propagate (P15)**
- The old name has no remaining production or test callers.
- Every call site of a changed signature is updated, or the change is explicitly overload-compatible.

**Comments, docs, and tests reflect the change (P13, P15)**
- Co-located comments and public docs are updated in the same change, not deferred.
- Tests reflect the new behavior; no orphan test pins removed behavior; no skipped, pending, or disabled test left on a real behavior change.

**No duplicated knowledge is introduced (P12)**
- A rule or constant is not copied into a second place that will drift.
- A single decision keeps one authoritative home.

**Two now-divergent copies of the same business rule (adversarial) (P12, P15)**
- The diff is scanned for a rule or constant duplicated across files that will drift apart.
- A duplication that encodes the same decision is consolidated to one authoritative home.

### Recommended verifications

| Tool | Use for |
|---|---|
| `grep` the old name / old signature across the repo | Detect un-updated callers and stale references |
| Diff changed file extensions (`.md` vs source vs test) | Detect "code changed, docs/tests did not" |
| Read co-located comments against the changed code | Detect stale comments left behind |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Docs are a separate task"** | Doc sync goes with the change that breaks it. A "fix docs later" attitude produces a stale-doc backlog that never gets done |
| **"Tests still pass, so docs are fine"** | Tests passing while docs are stale is a Consistency failure, not a green light. Check docs and comments explicitly |
| **A rename declared "internal" without a grep** | Internal renames still break internal callers, docs, and comments. Grep for callers before declaring "internal" |

---

## Risk

**Lens**: **What breaks** — error handling and input trust, root-cause vs masked symptom, concurrency, blast radius, dependency trust, secrets, and licensing of borrowed code?

### Seed scenarios with attached checklists

**Errors and input trust are handled (P10)**
- No swallowed exception, empty catch, or silent failure that hides a defect.
- Untrusted input (user, network, file, environment) is validated and normalized at the boundary before use.
- No command, query, or path is built by concatenating raw untrusted text; no injection or eval-on-input surface.

**The root cause was fixed, not masked (P9)**
- The change repairs the defect rather than silencing its symptom with a special-case, a swallowed error, or a loosened test.
- The failure is reproduced before the fix and confirmed gone after — not just hidden.

**Concurrency is explicit (P16)**
- Shared mutable state has a stated synchronization decision (mutex / actor / queue / "not shared").
- No silent reliance on "only one writer" where that is not structurally guaranteed.

**Blast radius matches expectation (P15)**
- Public-interface changes are deliberate, with a migration path or a declared break — never an accidental one.
- Callers of any changed exported unit are updated or explicitly tolerated.

**Dependency / supply-chain trust (P10, P8, P15)**
- Any new dependency is justified by a present need, not added speculatively.
- New deps come from a recognized source — not a typo-squat or a fork-of-fork — and are version-pinned.
- New deps carry a known license that matches project policy and have no known critical vulnerability.

**Secrets handling (P10)**
- No secret or credential is committed or logged.
- New local-config paths that may hold secrets are git-ignored.

**Licensing / IP of borrowed code (P10, P15)**
- Copied, vendored, or wrapped third-party code carries its license and attribution.
- Borrowed code is license-compatible with the project — no incompatible license introduced.

**A "small cleanup" silently widens a trust or input boundary (adversarial) (P10, P15)**
- Any change touching auth, input parsing, or an external boundary is reviewed against the prior trust surface, even when it looks like cleanup.
- A boundary that newly accepts wider or less-validated input is flagged.

**not-applicable / deferred — observability/telemetry, cost/budget, and error-budget/SLO**
- These are operational concerns owned by deployment and service-ops, not by the language-agnostic code artifact this skill governs; they are deferred here with that rationale. (The execution child doc grades them at the workflow level where the change touches a running service.)

### Recommended verifications

| Tool | Use for |
|---|---|
| `grep` for swallowed errors, empty catches, `eval` / `exec` on input | Audit error handling and injection surface |
| `grep` for secret patterns and `--no-verify` / `--force` in committed scripts | Catch committed secrets and safety bypasses |
| Check new imports against the manifest for declared, pinned, licensed deps | Detect undeclared or untrusted dependencies |
| `grep` for callers of any changed exported unit | Quantify blast radius |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Internal API, breaking is fine"** | Internal does not mean callers do not exist. Grep for callers before declaring a break safe |
| **An unvalidated trust boundary** | Input trusted because "it comes from our own frontend" is both a correctness and a security hole. Validate at the boundary |
| **An undeclared or unlicensed new dependency** | A dep added without justification, pinning, a known license, or a recognized source is a supply-chain risk. Declare, pin, and license-check it |

---

## Overall — phase-specific anchors

Step back from the per-perspective passes and check the change-set holistically against Karpathy's four failure modes, stated in code terms.

| Karpathy mode | What it looks like in a code change-set |
|---|---|
| **Wrong assumptions** | The code is correct only under an unstated precondition — a hidden assumption about input, ordering, or environment that nothing enforces |
| **Overcomplexity** | A simpler design meets the requirement — a deep unit instead of a wrapper chain, or no abstraction instead of a one-use one (P3, P8) |
| **Orthogonal edits** | The change bundles unrelated concerns that should be separate changes (P15) |
| **Imperative-over-declarative** | The code prescribes mechanism where a clearer declarative form expresses the same intent |

**Preserve-list anchors specific to code quality**: deep units with simple interfaces over substantial implementations; responsibility-clean decomposition; clear, truthful names; verifiable seams that separate logic from I/O; behavior-pinning tests. These are what the creator got right — REVISE iterations must not undo them.
