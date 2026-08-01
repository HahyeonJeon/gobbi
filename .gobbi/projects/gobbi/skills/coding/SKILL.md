---
name: coding
description: "MUST load before writing or reviewing code. The language-agnostic principles of good software — design, construction, and craftsmanship."
allowed-tools: Read, Grep, Glob, Bash
---

# Coding

Good code minimizes the complexity the next person must hold in their head to change it safely. Every principle below serves that one goal. They are ordered by where code is most often won or lost: **design first** — the interface, the decomposition, the names — because a design chosen well makes the rest cheap, and a design chosen badly makes everything after it expensive; then **construction** — how to build what you designed without drift; then **craftsmanship** — the legibility that lets the next reader change the result safely. The principles are guidelines, not laws: §Tensions names the cases where two of them pull apart and how to choose. For reviewing code against these principles, see `coding/evaluation.md`.

---

## Principle 1 — Study First, Then Design: Understand the Code and Prior Art Before You Write.

**Why** — A strong urge to start typing produces logic invented in the implementer's frame, which the next reader must reverse-engineer. Studying first is not overhead; it is what makes the design fit the codebase instead of fighting it. Understand what is being asked and why, read how this codebase and its neighbors already solve similar problems, and only then shape the solution. A few minutes of study saves a rewrite built on a wrong assumption.

**Practice**
- Make the requirement concrete first — what the code must do and why — before shaping it; if it is vague, resolve that before designing.
- Read the surrounding code: the patterns, naming, error-handling, and module layout already in use. New code should look like it belongs.
- Find prior art for this kind of problem — in this codebase first, then adjacent libraries, then the community — and note the shape that is proven.
- Map what the change will touch before designing anything new — the callers, the data, the tests.

**Anti-pattern**
- Starting to implement before the requirement is concrete or the surrounding code is read.
- Reinventing a solution the codebase already has a proven pattern for.
- Designing from the implementer's assumptions instead of from what the code actually does.
- Treating "study" as reading only the one file being edited, missing the patterns and callers around it.

## Principle 2 — Design the Contract First: Sketch the Interface, Then Implement Behind It.

**Why** — The interface is the part of a unit everyone else depends on and the part most expensive to change later, yet it tends to fall out of the implementation — whatever the body happens to need becomes the signature. Deciding the contract first, from the references gathered while studying, makes the interface a deliberate choice judged from the caller's point of view. A contract settled up front costs minutes; a wrong one discovered after the body is written costs a rewrite and breaks every caller.

**Practice**
- Sketch the contract before the body: the name, the inputs and outputs, the error cases, and the module it belongs in.
- Design from the references gathered in Principle 1 — shape the interface like the proven prior art unless there is a reason to deviate.
- Design it twice: consider a second shape before committing to the first that compiles.
- Run the interface-clarity check — can a caller use this from its signature alone, and can the implementation change without breaking callers? If not, redesign before implementing.

**Anti-pattern**
- Letting the implementation dictate the signature — the interface is whatever the body needed.
- Designing only the visible surface, leaving error cases and module placement to chance.
- Committing to the first shape that works with no second option weighed.
- An interface a caller cannot use without reading the implementation.

## Principle 3 — Build Deep Units: A Simple Interface Over a Substantial, Hidden Implementation.

**Why** — The most common structural mistake is the shallow unit — an interface nearly as complex as the work it does, or a wrapper that forwards a call while hiding nothing. Shallow units multiply the surface a reader must learn while buying no abstraction, so total complexity rises even as each piece looks "small". A deep unit is the opposite: a simple, stable interface over a substantial implementation callers never see — which is what lets the implementation change while callers stay still.

**Practice**
- Make the interface small and let the implementation carry the weight; judge a unit by how much complexity it hides, not by how few lines it has.
- Decide what callers must know and hide everything else — internal state, helper steps, data layout — behind the interface.
- Push special cases and configuration *down* into the unit so callers get a clean common path instead of exposed knobs.
- Wrap a third-party API behind your own interface only when its surface is broad, unstable, or leaks its shape into your code; a thin one-call pass-through that hides nothing is itself the shallow wrapper this principle warns against.

**Anti-pattern**
- A pass-through wrapper or "manager" that adds an interface but hides no complexity.
- An interface that exposes internals — callers must understand them to use it correctly.
- Splitting a coherent unit into many shallow pieces to make each "small", raising the total interface count.
- Configuration knobs pushed up to every caller instead of absorbed inside.

## Principle 4 — Decompose by Responsibility: Find the Seams Where Change Is Isolated.

**Why** — Code split by size or surface similarity, not by responsibility, produces either a catch-all unit that does everything or a scatter of fragments with no clear owner. The right seam is where responsibilities are genuinely separate, so one reason to change touches one place. The test is cohesion: code that changes together for the same reason belongs together; code that changes for different reasons belongs apart. A change that forces edits across many units is the signal the seams are wrong.

**Practice**
- Give each unit one responsibility you can state in a single sentence; if the sentence needs an "and", consider a split.
- Find the seam by reason-to-change: group what changes together, separate what changes for different reasons.
- Watch for a unit that reaches into another's data to do its work — the behavior probably belongs with the data.
- Let the decomposition emerge from cohesion, not from a target file or function length.

**Anti-pattern**
- A catch-all unit that accumulates unrelated responsibilities.
- Splitting purely to hit a size limit, producing fragments that must all change together.
- A change that requires touching many units in lockstep — a seam in the wrong place.
- Grouping by surface similarity (two things look alike) rather than shared reason-to-change.

## Principle 5 — Name for Intent: Define a Naming Convention and Make Every Name Tell the Truth.

**Why** — A name is the interface a reader meets first, and most of the work of design is choosing names that tell the truth. A vague, inaccurate, or inconsistent name forces every future reader to open the body to learn what the thing does — the exact cognitive cost good design exists to remove. Names also rot: when behavior changes and the name does not, the name becomes a lie that actively misleads.

**Practice**
- Make each name say what the thing is or does — intention-revealing, not a placeholder or an abbreviation the reader must expand.
- Follow one naming convention across the codebase; where none exists, establish one rather than letting each unit invent its own.
- Keep names true after change — when behavior changes, rename to match; a stale name is a defect.
- Prefer a precise name over a comment that explains a vague one.

**Anti-pattern**
- Vague or generic names (`data`, `handle`, `process`, `manager`) that reveal nothing.
- A name that no longer matches what the code does after a change — an inaccurate name that misleads the reader.
- Inconsistent conventions, so the same idea is named three ways.
- Leaning on a comment to explain a name that should simply have been clearer.

## Principle 6 — Design for Verification: Build Seams So Behavior Can Be Tested.

**Why** — Code that can only be exercised by standing up the whole system is code whose behavior is never really checked — so defects ride along undetected until production. Testability is a *design* property, not a phase that comes after: it is decided when you choose where the seams are, what depends on what, and whether the logic can be reached without its environment. Design for verification and the tests write themselves; ignore it and every test becomes an integration test that is slow, flaky, and rarely written.

**Practice**
- Separate decision logic from side effects: keep the part that computes pure, and push I/O, clocks, randomness, and network to the edges where they can be substituted.
- Make dependencies injectable rather than reached for — a unit that takes its collaborators can be tested with stand-ins; one that constructs them cannot.
- Choose seams a test can target: a unit small enough to set up and assert against, with a result worth asserting on, not a void that only mutates hidden state.
- Make behavior deterministic at the seam — no reliance on wall-clock time, ambient order, or shared mutable state that a test cannot control.

**Anti-pattern**
- Logic entangled with I/O so the only way to test it is to hit the database / network / disk.
- A unit that constructs its own dependencies, leaving no place to insert a test double.
- Behavior that depends on real time, real randomness, or execution order, so a test cannot pin it.
- "We'll add tests later" — deferring the seam means the code ossifies untestable and the tests never come.

## Principle 7 — Build Bottom-Up: Skeleton First, Then Grow in Minimal Verified Steps.

**Why** — Implementing a whole feature in one pass produces incoherent structure, and because later code imitates what already exists, that first rushed draft becomes the reference the rest is built against — dragging quality down recursively. Laying the structure first and growing it in small, verified steps keeps the whole coherent and surfaces problems while they are still cheap to fix.

**Practice**
- Lay the structure before behavior: the modules, the key signatures, the stubs — enough that the shape is concrete even if nothing runs end-to-end yet.
- Add the smallest correct increment, then keep the whole thing working before the next; never a full feature in one pass.
- Refine the skeleton as you learn — firm up a signature, settle a parameter, stub the next placeholder — so the structure keeps pace with the work.
- Verify at each step (compile, run, or test the slice you just added) so a break is caught while its cause is one step back.

**Anti-pattern**
- Writing a whole feature in one pass, then debugging the tangle.
- Building the next piece on a foundation that is not yet solid.
- A large first draft treated as the reference the rest of the codebase extends, locking its flaws in.
- Growing for many steps with no verification between them, so a failure has many possible causes.

## Principle 8 — Build Only What's Needed, and Finish It: No Speculative Generality, No Half-Done Stubs.

**Why** — Configurability, plugin points, and "future-proof" indirection the current requirement does not need are pure cost: more to read, test, and maintain, usually for a future that never arrives. The opposite failure is just as real — leaving the work half-done, a `TODO` stub or a half-wired path "for later" that the next session inherits as hidden debt. Build exactly what the requirement needs, and build all of it.

**Practice**
- Build for the requirement in front of you, not an imagined more-general one; add generality only when a second real caller demands it.
- Finish every in-scope path before calling the work done — no stub left standing in for behavior that was promised.
- When you notice an adjacent improvement outside scope, note it as a follow-up rather than building it now.
- Prefer deleting an unused option to keeping it "just in case"; unused flexibility is a liability, not an asset.

**Anti-pattern**
- A framework, plugin system, or config knob built for a single present use.
- A `TODO` / `NotImplemented` / empty branch shipped as if the path were done.
- Generalizing on the first sight of similar code, before a second caller proves the need.
- Stopping at the easy 80% and filing the hard in-scope 20% as "future work".

## Principle 9 — Fix the Root Cause: Repair the Defect, Never Mask the Symptom.

**Why** — The visible symptom of a bug is rarely its cause, and the first cause found is often a symptom of something deeper. Patching the surface — a special-case, a swallowed error, a retry that hides a race, a test loosened to pass — fixes the metric, not the defect, and the bug returns worse. Trace each cause to the one beneath it until you reach the thing that, once fixed, makes the whole failure disappear, then fix that.

**Practice**
- Keep asking why until fixing the cause would make the whole failure chain go away; stop only there.
- Reproduce the failure before the fix and confirm it is gone after — not just hidden.
- Change the thing at the bottom of the chain, not the symptom or an intermediate cause.
- If two or three fixes do not hold, stop patching — your understanding or the design is wrong; step back.

**Anti-pattern**
- Silencing an error, special-casing the input, or adding a retry instead of finding why it broke.
- Loosening or skipping a test to make a check pass.
- Shipping a fix you cannot explain.
- Treating the first proximate cause as the root without checking whether it is itself a symptom.

## Principle 10 — Make Failure Explicit, Guard the Trust Boundary: Surface Errors Loudly, Validate Untrusted Input, Keep Secrets and Third-Party Code Vetted.

**Why** — Silent failure and unvalidated input are how a small bug becomes an incident discovered far from its cause. An error that passes quietly leaves the program running on a false assumption; untrusted data used without a check is both a correctness and a security hole. The same trust boundary that fails open on input also fails open on secrets and on borrowed code: a credential committed or logged is a leak that outlives the commit, and a dependency pulled in without vetting hands an outsider a path into the build. Make failures visible where they can be handled, validate data at the trust boundary so the interior can assume it is clean, keep secrets out of the code and its history, and depend only on third-party code you have vetted and can account for.

**Practice**
- Surface errors where a caller can act on them, with a message that names the failure and a remedy — never an empty catch or an ignored return code.
- Validate and normalize data crossing a trust boundary (user input, network, files, environment) before any use; treat everything that crosses the boundary as untrusted until checked.
- Never build a command, query, or path by concatenating raw untrusted text.
- Never commit or log a secret or credential, and keep secret-bearing config out of version control.
- Depend only on vetted, known-good third-party code, and carry the license and attribution of anything you borrow or vendor.
- Fail fast on a broken invariant rather than limping forward in a corrupt state.

**Anti-pattern**
- A swallowed exception, empty catch, or ignored error return that hides a failure.
- A generic "error" / "something went wrong" message with no failure name and no remedy.
- Trusting input because "it comes from our own frontend / another service".
- A secret or credential committed to the repository or written to a log.
- An unvetted dependency pulled in for convenience, or borrowed code carried without its license and attribution.
- Continuing past a violated precondition instead of stopping at it.

## Principle 11 — Optimize for the Reader: Choose Clarity Over Cleverness.

**Why** — Code is read far more than it is written, and debugged by someone with less context than the author had. The clever, terse, or "impressive" form costs every future reader; the clear, obvious form pays them back. If an implementation is hard to explain, that is a signal the design is wrong, not that the reader is slow.

**Practice**
- Prefer the straightforward form over the clever one; write for the reader who has never seen this code.
- Use plain, accurate names and short, single-purpose units so the intent is visible without decoding.
- Make the common path obvious and the exceptional path clearly marked, rather than folding both into one dense expression.
- When a construct needs a comment to be understood, first ask whether a clearer construct would remove the need.

**Anti-pattern**
- A dense one-liner that takes longer to read than the three plain lines it replaced.
- Cleverness that shows off the language rather than serving the reader.
- Optimizing the source for fewer characters at the cost of comprehension.
- An implementation so intricate it cannot be explained simply — a sign to redesign.

## Principle 12 — Don't Repeat Knowledge: One Authoritative Home per Decision; Abstract on Evidence.

**Why** — Every rule, constant, or decision should have exactly one authoritative place, so a change is one edit instead of a hunt for divergent copies. But this is about duplicated *knowledge*, not duplicated *text*: two fragments that merely look alike but encode different decisions are not a violation, and merging them couples things that should move independently. The wrong abstraction costs more than the duplication it replaced, so abstract only when the pattern genuinely recurs and you understand the shared reason-to-change.

**Practice**
- Give each decision, rule, or constant one authoritative home; derive everything else from it.
- Distinguish same-text from same-knowledge — only merge code that encodes the same decision.
- Wait for the rule of three: let a pattern recur and prove its shared reason-to-change before extracting an abstraction.
- When two uses of a "shared" abstraction start needing different things, split it back apart.

**Anti-pattern**
- The same business rule or constant copied into several places that will drift.
- Merging look-alike code that encodes different decisions, coupling them by accident.
- Extracting an abstraction on the first sight of similarity, before the need is proven.
- Keeping a wrong abstraction alive with flags and special-cases because it already exists.

## Principle 13 — Comment the Why, Not the What: Keep Comments and Docs True to the Code.

**Why** — Comments and docs are memory for the next maintainer; they should carry the *why* a reader cannot infer from the code — the rationale, the constraint, the rejected alternative — never a restatement of what the line plainly does. A comment that narrates the obvious is noise; a comment that contradicts the code is worse than none, because it actively misleads. Stale comments are a defect at the same priority as stale code.

**Practice**
- Comment the non-obvious: why this approach, what constraint forces it, what was tried and rejected.
- Let the code say *what*; reserve comments for the *why* the code cannot express.
- Update or delete a comment in the same change that invalidates it — never leave it to drift.
- Keep public-facing docs (signatures, READMEs, design notes) in sync with the code they describe, in the same change.

**Anti-pattern**
- A comment that restates the code ("increment i by one" above an increment).
- A comment that no longer matches the code it sits above — a contradiction the reader must resolve.
- Leaving a stale doc or comment as a follow-up after the code changed.
- Using a comment to explain a name or structure that should simply have been clearer.

## Principle 14 — Make It Efficient Enough: Fit the Algorithm to the Data; Optimize on Evidence.

**Why** — Performance is a design property decided by the algorithm and the data structure, not a polish applied later — an accidental quadratic or an N+1 in a hot path will not be tuned away by micro-optimization. But effort spent optimizing a cold path, or trading clarity for an unmeasured gain, is waste. Choose an approach whose cost fits the expected input, keep the simple form until a measurement says otherwise, and then optimize the part the evidence points to.

**Practice**
- Choose an algorithm whose complexity fits the realistic input size; avoid an accidental quadratic (a nested scan over the same data) on data that can grow.
- Pick the data structure that fits the access pattern — a set/map for membership, an ordered structure for ordered access — not what is convenient to author.
- Avoid wasted and repeated work: hoist or memoize a value recomputed in a loop; batch what would otherwise be a per-item query or request (no N+1).
- Keep resource use bounded (no unbounded accumulation, release handles/connections) and let the clear form stand until a profile identifies a real hot path.

**Anti-pattern**
- A nested loop over the same collection where a single set lookup would do.
- One database query / network call / disk read per loop iteration where a batch would serve.
- A clever micro-optimization that complicates the code for a gain no measurement confirms.
- Optimizing a cold path on a hunch while a genuine hot-path cost goes unmeasured.

## Principle 15 — Change With Blast-Radius Awareness: Update Every Caller, Doc, and Test Together.

**Why** — Editing the target in isolation leaves the project inconsistent: a renamed symbol with stale callers, an updated function whose docs still describe the old behavior, a new field no reader handles. The unit of a change is the interface plus everything that depends on it — callers, tests, docs, comments — not the one file in front of you. Everything that must change together, changes together, in the same change.

**Practice**
- Before changing a shared interface, find everything that depends on it — callers, tests, docs, comments — and decide the migration or the deliberate break.
- Run the change across the whole affected set, not just the target file; update each consumer in the same change.
- For a public interface, choose deliberately between a backward-compatible path and a declared break — never an accidental one.
- After the change, check that nothing is left contradicting it — no stale caller, no out-of-date doc, no orphaned test.

**Anti-pattern**
- Renaming or changing a signature and leaving callers, tests, or docs stale.
- Treating the diff to the target file as the whole change when its reach is project-wide.
- Declaring a change "internal" without grepping for the callers that prove otherwise.
- A breaking change to a public interface shipped with no migration note and no deliberate-break declaration.

## Principle 16 — Control State and Side Effects: Minimize Mutable State, and Make Sharing and Synchronization Explicit.

**Why** — State is where the hard bugs live. Mutable data that many parts of the program can change is a fact no reader can hold in their head: any caller might have altered it, so behavior depends on an order of events that is nowhere written down. The cure is to keep most data immutable and most logic pure — a computational core that takes inputs and returns outputs, with I/O, mutation, the clock, and randomness pushed to the edges. That isolation is the same property that makes code testable (Principle 6), reached from the other direction. The remaining danger is *shared* mutable state: the moment two paths — especially two concurrent ones — can touch the same data, an unstated assumption about who writes when becomes a race, a torn read, or a spooky-action bug that reproduces once a week. So minimize what is shared, and where state genuinely must be shared, make the access, ownership, and synchronization decision explicit instead of leaving it to luck.

**Practice**
- Prefer immutable data; let most values be computed and returned, not mutated in place. Keep mutable state small, owned, and local.
- Isolate side effects: keep a pure computational core and push I/O, mutation, time, and randomness to the edges where they are visible and substitutable.
- Minimize shared mutable state — the less data two paths can both change, the fewer the ways they can interfere.
- Where state IS shared, make the ownership and synchronization decision explicit and stated, especially across concurrent access; never leave it to an unwritten "only one writer" assumption.

**Anti-pattern**
- Pervasive mutable global state that any part of the program can read or write.
- A function that mutates its inputs, or reaches out to mutate shared state, as a hidden side effect the signature does not reveal.
- Shared mutable state carried by an unstated "only one writer" assumption that nothing structurally guarantees.
- A tangled core where pure logic and side effects are inseparable, so neither can be reasoned about or tested alone.

## Principle 17 — Narrow the Input Surface: Require Only What the Unit Uses, in a Form the Caller Can Read Without Study.

**Why** — Principle 2 asks whether a caller can use a unit from its signature alone, and Principle 3 keeps the interface simple over a deep implementation — both judged mostly from what the unit returns and hides. The input side carries its own cost, and it is the cost callers pay on every call: to invoke the unit they must first understand, and then assemble, whatever the signature demands. When that demand is wider or more tangled than the work needs — a whole record passed so the body can read two of its fields, a deeply nested type the caller must decode — the caller has to study a complex thing just to make a simple call, and the API reference stops being self-documenting. Narrow the input surface: require only the values the unit actually uses, in the plainest form that still tells the truth, so the caller reads the call from the signature instead of reverse-engineering it.

**Practice**
- Pass only what the unit uses: when the body needs a few fields of a larger record, take those fields as parameters rather than the whole record — data coupling, not stamp coupling.
- Keep boundary types shallow enough to read at a glance; name an intermediate concept rather than forcing the caller to decode a nested structure before they can call.
- Judge the input from the caller's side — can they tell what to pass, and assemble it, from the signature alone? If satisfying the call means reading the body, the surface is too wide or too opaque; narrow it before the implementation is written.
- Keep a cohesive aggregate intact when the unit genuinely operates on it as one concept: narrowness removes unrelated knowledge, not meaningful structure.

**Anti-pattern**
- A whole aggregate, record, or config object passed as one opaque parameter when the unit reads only a couple of its fields — stamp coupling that hides the real dependency and makes the caller build more than the call needs.
- A deeply nested or elaborate boundary type the caller must study and decode before they can construct a valid argument.
- A generic context, options, or configuration object that hides the unit's real dependencies and quietly grows as more fields are read from it.
- Exploding one cohesive concept into a long list of loose parameters just to make every input individually explicit, when the unit genuinely uses that concept as one whole.

---

## Scope — Language-Agnostic

These principles state the language-agnostic *property* of good code; language-specific *idioms* live in the [HTML](../html/SKILL.md), [CSS](../css/SKILL.md), [Go](../go/SKILL.md), [Python](../python/SKILL.md), and [TypeScript](../typescript/SKILL.md) skills. Select each language skill independently when that language enters scope. For Go, load every applicable child from its domain routing table.

For any Electron work, **MUST load [`electron`](../electron/SKILL.md) and every child whose root trigger applies**: [`electron-design`](../electron/electron-design/SKILL.md) for security, IPC, and window-ownership design, [`electron-development`](../electron/electron-development/SKILL.md) for implementation or review, [`electron-runtime`](../electron/electron-runtime/SKILL.md) for runtime lookup, [`electron-testing`](../electron/electron-testing/SKILL.md) for Electron-specific evidence, and [`electron-release`](../electron/electron-release/SKILL.md) for release work. Load several children when several triggers apply; `coding` remains only the language-agnostic construction layer and defines no Electron platform policy.

The rule of thumb: if the advice changes when you switch languages, it is not a `coding` principle. This skill says "pick the data structure that fits the access pattern" and "design a seam that can be tested"; the language skill says "in this language, that is this concrete type / this test framework". So concrete naming conventions, type-system idioms, language error idioms, runtime performance specifics, and tooling all defer to the per-language skills — `coding` carries only the property they all share.

---

## Tensions

The principles are guidelines, not laws; a few pull against each other. Name the conflict, then choose:

- **Don't Repeat Knowledge (12) ⇄ abstract-on-evidence:** when unsure whether two fragments share a reason-to-change, keep them separate — duplication is cheaper than the wrong abstraction.
- **Decompose by Responsibility (4) ⇄ Build Deep Units (3):** decomposition helps only while each piece stays deep; splitting into shallow pass-throughs makes things worse, not better.
- **Optimize for the Reader (11) ⇄ brevity:** prefer the clearer form; brevity that costs a reader is not a virtue.
- **Build Only What's Needed (8) ⇄ Design the Contract First (2):** design the *shape* up front, but do not build speculative *behavior* — a clean contract is not the same as unused features.
- **Make It Efficient Enough (14) ⇄ Optimize for the Reader (11):** keep the clear form until a measurement justifies the complex one; trade clarity for speed only on evidence.
- **Narrow the Input Surface (17) ⇄ parameter-object grouping:** group inputs into one object only when they form a cohesive concept the unit uses as a whole; narrowness removes unrelated knowledge, not a genuine structure, so neither pass a wide aggregate to read a few fields nor fragment a real concept just to look narrow.

To review code against these principles, see `coding/evaluation.md`.

---

## Appendix A — Design Traceability (internal; not part of the skill-facing prose)

Preserved for maintainers: how each coding principle projects gobbi's 10 behavioral `principles`. This lineage justifies the set's coverage; it is deliberately kept out of the skill prose above so the skill reads as software-engineering principles in their own right.

| Coding principle | Projects behavioral principle(s) | External best-practice fused |
|---|---|---|
| 1 Study First, Then Design | P1 (study first), P4 (concrete task) | Google design-first; Ousterhout "design it twice" |
| 2 Design the Contract First | P3 (design from references), P2 (structure before fill) | Google design-first; Pragmatic tracer-bullet |
| 3 Build Deep Units | P3 (interface design) | Ousterhout deep modules + information hiding |
| 4 Decompose by Responsibility | P2 (structure), P9 (seam limits blast radius) | Pragmatic orthogonality; Fowler smells |
| 5 Name for Intent | P3 (naming conventions), P7 (clear = plain) | Clean Code residue; Google; Ousterhout |
| 6 Design for Verification | P2 (structure for test seams) | Google (tests well-designed); testability-as-design |
| 7 Build Bottom-Up | P2 (bottom-up construction) | Pragmatic tracer-bullets |
| 8 Build Only What's Needed, and Finish It | P5 (scope ceiling), P10 (scope floor) | YAGNI; Google anti-over-engineering; AHA |
| 9 Fix the Root Cause | P8 (root cause) | Zen "errors never pass silently"; Ousterhout |
| 10 Make Failure Explicit | P8 (masked error = no diagnosable cause) | Google edge-cases+security; Pragmatic crash-early |
| 11 Optimize for the Reader | P7 (plainness) | Kernighan & Pike; Zen readability |
| 12 Don't Repeat Knowledge | (code-specific; loosely P6 single-source) | Pragmatic DRY-as-knowledge; AHA / rule-of-three |
| 13 Comment the Why | P6 (docs/comments as memory, kept current) | Clean Code (comment the why); Google |
| 14 Make It Efficient Enough | (code-specific) | Ousterhout complexity; algorithm/data-structure fit |
| 15 Change With Blast-Radius Awareness | P9 (CRUD + 5W1H before editing) | Fowler Shotgun Surgery; Pragmatic decoupling |
| 16 Control State and Side Effects | — (code-specific; no direct behavioral analogue) | Functional-core/imperative-shell; immutability + minimize shared mutable state |
| 17 Narrow the Input Surface | P3 (interface-clarity checkpoint; caller POV) | ISP (SOLID); stamp-vs-data coupling (Constantine/Yourdon); Ousterhout narrow interfaces; McConnell Code Complete §7 |

Coverage check: all 10 behavioral principles have a code-craft home — P1→1, P2→2/4/7, P3→1/2/3/5/17, P4→1, P5→8, P6→13, P7→5/11, P8→9/10, P9→4/15, P10→8.

### Sources

External references the principle set fuses:

- Ousterhout, *A Philosophy of Software Design* — https://blog.pragmaticengineer.com/a-philosophy-of-software-design-review/ , https://bagerbach.com/books/a-philosophy-of-software-design/
- *The Pragmatic Programmer* — https://github.com/HugoMatilla/The-Pragmatic-Programmer
- Google engineering practices — https://google.github.io/eng-practices/review/reviewer/looking-for.html , https://google.github.io/eng-practices/review/reviewer/standard.html
- Clean Code critiques — https://qntm.org/clean , https://gerlacdt.github.io/blog/posts/clean_code/
- SOLID / DRY / AHA — https://www.baeldung.com/cs/solid-principles-avoid , https://medium.com/@iamprovidence/solid-kiss-dry-and-other-principles-suck-55c6758322a2
- Constantine & Yourdon, *Structured Design* — stamp coupling (pass a whole record) vs data coupling (pass only the fields used): https://en.wikipedia.org/wiki/Coupling_(computer_programming)
- McConnell, *Code Complete* (2nd ed.), Ch. 7 — high-quality routines: pass a routine only the parameters it genuinely uses, in a form the caller can read
- Fowler code smells — https://refactoring.guru/refactoring/catalog , https://luzkan.github.io/smells/ , https://martinfowler.com/bliki/CodeSmell.html
- Kernighan & Pike (community-canonical readability guidance)
- Structure references — Zen of Python (https://peps.python.org/pep-0020/), Effective Java item format (https://www.sglavoie.com/posts/2023/06/11/book-summary-effective-java/), Google style guides (https://google.github.io/styleguide/)
- Internal: gobbi behavioral `principles` (`skills/principles/SKILL.md`)
