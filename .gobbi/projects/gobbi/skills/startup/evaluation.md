# Startup — Evaluation Frame

Startup child doc loaded by the evaluator at Stage 0 when the evaluation target is `startup`. Provides
the per-perspective evaluation **procedure** for a completed startup baseline: each perspective's
**lens**, its **recommended verifications**, and its **perspective-specific anti-patterns**, plus the
**Overall (Stage 3)** anchors and the startup verdict routing. The concrete GOOD / BAD / adversarial
**scenario families** live in the sibling `scenario.md`, and their yes/no **checks** live in the
sibling `checklist.md` (whose heading tree mirrors `scenario.md`); each perspective below points to its
section in both. The shared four-stage review procedure, the finding schema, the confidence / severity
thresholds, and the nine-file output contract are owned by `evaluation/SKILL.md`; this file supplies
only the startup-specific frame and does not restate them.

The artifact under evaluation is **the completed startup baseline as a set**, not only promoted memory
and not only `outputs/startup-summary.md`:

- `startup/working/answer-ledger.md`, including answer IDs, the claim / evidence axes, all 46 branch
  closures, and the 11 confirmed Level-1 checkpoint markers;
- the evidence register and each ledger-linked `startup/working/research/{slug}.md` decision brief;
- the full `startup/staging/` draft set, including the project and feature living-index candidates;
- `startup/working/promotion-manifest.md`, including operations, exact destinations, preimages,
  supersession / archive plans, and per-destination verification results;
- the actual promoted memory delta plus the pre-existing memory each create / update / supersession
  overlaps;
- the P5 staged-set validation, P6 exact-path verification, secret-scan, and post-write standing-guard
  results; and
- the pre-P7 `startup/outputs/startup-summary.md` candidate, including promoted paths, unresolved
  questions, rerun triggers, and `baseline_valid` absent / false. P7 stamps the true completion state
  only after this gate passes.

This is the **P6.5 non-skippable dual-system gate**. It is not a productive-loop EVALUATION and does
not use a numbered `{N}-{loop}/evaluation/` path. After P6 promotion, exact-path verification, and the
standing guards, two fresh evaluators — one Claude and one Codex — independently run all seven
perspectives + Overall against the same frozen baseline set. Each writes nine record-level outputs
under `sessions/{date}-{session-id}/startup/working/evaluation/iter{n}/{system}/`. The manager then
reconciles both systems. `PASS` clears P7; `REVISE` returns to the earliest owning startup phase and
keeps P7 blocked; `FAIL` halts startup with `baseline_valid` false. No setting can skip this gate.

The startup scenario families already contain concrete adversarial probes (shallow answers,
architecture-before-users, guessed license, task-as-feature, status laundering, secret promotion,
cross-topic contradictions, README duplication, collision overwrite, and premature validity), so
Stage 2 walks each locked Frame once without a separate adversarial pass.

## Startup What / Why / How mapping

| Axis | Startup meaning |
|---|---|
| **What** | A current, durable project baseline covering identity, evidence, users, value, boundary, product shape, reference-informed system direction, guardrails, risks, and owned open questions — represented by the completed baseline set above. |
| **Why** | Later loops and later sessions need one coherent reference that prevents repeated discovery, unsupported assumptions, architecture-driven scope drift, and contradictory memory. |
| **How** | Evidence-led traversal of 11 topics / 46 branches → the study / recommend / user-decision micro-loop for design-bearing directions → atomic typed synthesis → whole-manifest validation and approval → bounded promotion with preimage checks → exact-path and standing-guard verification → this dual-system completeness / quality gate. |

At Stage 0, extract all three from the artifact set rather than inferring them from this mapping. A
missing or ambiguous What or Why triggers the canonical W/W/H halt and is also a startup `FAIL` floor.
A missing How stays a Critical `general` / `unevaluable` finding and prevents PASS.

---

## Check resolution — two gates

Each design-substance check resolves to exactly one of four states, and it spans two gates an
evaluator must keep separate:

- **PASS** — the applicable load-bearing claim meets the check's observable evidence predicate.
- **FAIL** — the claim is applicable but missing, contradicted, overstated, fabricated, or laundered
  to `n/a` without a genuine claim-specific reason.
- **n/a** — the branch is proven irrelevant with a specific, claim-specific reason.
- **recorded-open** — a valid *coverage* closure (the branch is accounted for, with an owner), but
  NOT an *acceptance* pass for an applicable load-bearing design claim.

A branch is **accounted for** (the coverage-closure gate) when it is `confirmed`, `proven-irrelevant`
with a reason, or `recorded-open` with an owner — the unchanged `SKILL.md` closure Rule, where
`recorded-open` is valid. A design-substance check **passes** (the acceptance-pass gate) only when the
applicable load-bearing claim is *evidenced* — here `recorded-open` is NOT a pass: an applicable
load-bearing design claim left `recorded-open` still drives **REVISE** through the
`STARTUP-RISK-SCENARIO-06` teeth. A branch can be validly closed for coverage and still FAIL the
substance check; do not collapse the two gates into one.

The acceptance invariants these checks enforce — a positive claim is never stronger than its
evidence, each design-substance family carries one adversarial scenario and one canonical check, no
check depends on word count as a proxy for substance, and an applicable un-evidenced load-bearing
claim is never laundered to `n/a` — are encoded in the sibling `scenario.md` design-substance
families (`STARTUP-PROJ-SCENARIO-05` / `-06` / `-07`, `STARTUP-STRUCT-SCENARIO-05`) plus the
`STARTUP-RISK-SCENARIO-06` teeth, with the matching yes/no checks and the two-gate legend in the
sibling `checklist.md`.

---

## Project

**Lens**: Is this the **right project baseline** — grounded in a real problem, a clear first user and
job, and a sound product shape — with complete, substantive coverage and user-owned intent?

**Scenario source:** `scenario.md` § Project (`STARTUP-PROJ-SCENARIO-*`)
**Checklist source:** `checklist.md` § Project (`STARTUP-PROJ-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| `grep -n` / `rg -n` over `working/answer-ledger.md` | Enumerate the 11 checkpoint markers and the 46 branch IDs; prove every branch has one valid closure rather than trusting a summary count |
| Close-read the weakest closures | Inspect short answers and every `proven-irrelevant` / `recorded-open` entry for a reason, evidence, owner, and resolution method; detect one-word depth theatre |
| Compare the ledger event order + decision traces | Confirm Topics 2-5 constrained the later architecture / stack choices and that a conflicting later choice re-opened the earliest owning branch |
| Read Topic 1.4 against the repository's license / governance evidence and the authority record | Detect a missing, guessed, contradictory, or unauthorized license / distribution / governance claim |
| Resolve every design-decision brief and citation | Confirm each design-bearing branch has internal / external prior art, options, a recommendation, an evidence-to-change, the user's choice, rationale, and rejected alternatives |
| Read every load-bearing problem claim against the ledger's evidence tuple | Confirm each cites past behavior — a workaround built, effort / time / money already spent, or a recurring struggle — for a named user at a stated recurrence, not stated interest or a hypothetical (`STARTUP-PROJ-SCENARIO-05`) |
| Read the first-user and job records | Confirm one named user / segment with a concrete job (situation → motivation → outcome), the current alternative, and at least one switching force; reject "everyone" or a feature-list "job" (`STARTUP-PROJ-SCENARIO-06`) |
| Trace the shaped direction from user → job → value → boundary → capabilities → journeys | Confirm no orphan capability, no boundary / journey contradiction, direction altitude (no signatures, schemas, algorithms, or task breakdown), and each direction traces to a confirmed constraint plus a studied reference (`STARTUP-PROJ-SCENARIO-07`) |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Coverage count treated as understanding** | Count closures, then inspect the weakest three and every exceptional closure; 46/46 can still be shallow |
| **Architecture used to define the user after the fact** | Trace every system direction back to a confirmed product constraint; re-open the earliest product branch on conflict |
| **The manager records the first preference** | A design-bearing branch closes only after study, a recommendation, and a recorded user decision |
| **A common license guessed as a project fact** | Verify the repository and the authority evidence; otherwise keep the branch open or use the confirmed internal not-applicable form |
| **A fluent problem paragraph accepted as evidence** | A complete-reading paragraph that names zero past behavior FAILS the same as a one-word answer; require the evidence tuple (workaround / spend / recurring struggle for a named user), not fluency |
| **A named user with no switch treated as clear** | A user is clear only with a concrete job, a current alternative, and at least one switching force; a bare category ("developers", "everyone") or a feature-list "job" is not a user |
| **Internally-complete checkpoints mistaken for a sound shape** | Trace the whole shape end to end; a boundary that excludes a needed capability, an orphan feature, or a dive into mechanism defeats a per-topic "complete" read |

---

## Structure

**Lens**: Is the baseline decomposed into correct atomic types, scopes, areas, durable value-features, and sound dependency / operational directions — and is the shaped direction feasible to build and sustainable to run?

**Scenario source:** `scenario.md` § Structure (`STARTUP-STRUCT-SCENARIO-*`)
**Checklist source:** `checklist.md` § Structure (`STARTUP-STRUCT-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Run `validate-frontmatter.sh` in dry-run / non-mutating mode over the **entire staged typed set**, then validate the promoted set | Verify required fields, type extensions, allowed areas, per-file feature targets, and the staging-field strip |
| Diff the `staging/` inventory against `working/promotion-manifest.md` and the actual promoted paths | Prove one staged source → one manifest disposition → one deterministic destination |
| Close-read titles and bodies against the matching memory template | Detect a multi-concept "startup encyclopedia" hidden under an atomic-looking title |
| List every new `features/{feature-name}/` directory and trace it to the user-ratified value proposition | Detect a task, sprint, subsystem, mechanism, or speculative idea dressed as a durable feature |
| Read the Topic 7-9 direction records and the dependency evidence | Check dependency source / version / license / fallback, trust boundaries, graph impact, observability, and operational ownership |
| Check the shaped direction against the team's available skills, dependencies, and constraints, then against its operational life | Confirm it is buildable (each essential dependency names source / version / approval / failure-fallback) AND sustainable — capacity, ownership, failure-recovery, and upkeep named or proven irrelevant (`STARTUP-STRUCT-SCENARIO-05`) |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Atomicity judged from the filename only** | Read the whole body; unrelated binding choices under one slug are still bundled |
| **A plausible destination accepted because links resolve** | Apply the staging-to-destination contract mechanically; off-table but well-formed is still wrong |
| **An internal mechanism promoted as a feature** | Ask whether users receive enduring value from the named capability; if not, it has no feature directory |
| **A popular dependency treated as self-justifying** | Verify the source, constraint, license, failure fallback, and structural / operational implications |
| **An elegant shape assumed buildable** | Internal coherence is not feasibility; a direction that needs a skill or dependency the team cannot get, or an essential component with no owner / failure-recovery / upkeep, is un-buildable or un-sustainable and FAILS |

---

## Performance

**Lens**: Are interview depth, baseline size, recurring cost, scale, and error-budget commitments proportional without dropping mandatory coverage?

**Scenario source:** `scenario.md` § Performance (`STARTUP-PERF-SCENARIO-*`)
**Checklist source:** `checklist.md` § Performance (`STARTUP-PERF-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Compare the ledger question / probe counts by branch risk and evidence state | Confirm verified facts smart-skipped while uncertain, irreversible choices received deeper study — not a mechanical uniform interview |
| `wc -l` / `wc -w` on the staged and promoted records, grouped by type and concept | Detect transcript-like bundles, one-file-per-thought fragmentation, and aggregate bloat |
| Search promoted memory for text unique to the raw log, ledger, manifest, research notes, or summary | Confirm record-level audit material was not promoted as durable memory |
| Diff each README section against the typed-record body it links | Detect README-duplicating-memory; a living index summarizes and points rather than becoming a second authority |
| Read Topic 9.2 / 10.3 and the related risk records | Verify applicable scale, latency, capacity, recurring-cost, and error-budget bounds, or a proven-irrelevant reason |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Mandatory coverage used to justify uniform ceremony** | Coverage is fixed; depth is proportional to evidence, uncertainty, reversibility, and risk |
| **Small files assumed efficient** | Measure the aggregate set and concept count; many tiny files can cost more than one sound atomic record |
| **README duplication called a helpful summary** | Mentally change a typed-record fact; if the README must change as a second authority, it duplicates rather than indexes |
| **"No performance work in startup"** | Startup still sets the scale, cost, quality, and error-budget directions that later work will trust |

---

## Aesthetics

**Lens**: Is the durable baseline readable, template-conformant, self-evident, and free of record-level coordinates, placeholders, and filler?

**Scenario source:** `scenario.md` § Aesthetics (`STARTUP-AESTH-SCENARIO-*`)
**Checklist source:** `checklist.md` § Aesthetics (`STARTUP-AESTH-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Cold-read promoted memory with `sessions/.../startup/` unavailable | Test whether every record stands alone and the root README makes the project self-evident |
| Compare each typed document and README against its established section contract | Detect missing / empty sections and convention drift |
| `grep -n` for placeholders and session coordinates (`TBD`, `TODO`, `???`, `Topic [0-9]`, `checkpoint`, `ledger row`) | Detect unfinished prose and load-bearing record-level coordinates |
| Resolve every Markdown link and path pointer | Detect a clean-looking but unusable baseline |
| Read slugs and first headings without their bodies | Confirm names identify durable concepts rather than interview positions |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Polish mistaken for zero-context meaning** | Remove the startup record and read again; prose that needs the interview still fails |
| **Topic-coordinate names treated as harmless** | Rename by the durable subject; topic IDs are record coordinates, not memory concepts |
| **Aesthetics reduced to taste** | Placeholder text, broken pointers, template drift, and ambiguous naming are objective defects |
| **Cold-readability judged by a "sufficient context" feel** | Run the `STARTUP-AESTH-SCENARIO-01` cold-reader TASK: with no startup-record access, identify purpose, first user, problem evidence, scope, decided direction, validation status, risks, and next action; any answer that needs hidden transcript context FAILS — a "sufficient" feel is not the bar |

---

## Usage

**Lens**: Can later loops, later sessions, users, and operators act from the baseline without reconstructing the startup talk?

**Scenario source:** `scenario.md` § Usage (`STARTUP-USAGE-SCENARIO-*`)
**Checklist source:** `checklist.md` § Usage (`STARTUP-USAGE-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Cold-read the root README and the promoted typed records as a fresh Ideation / Preparation agent | Answer purpose, users, scope, features, directions, constraints, risks, evidence, and open questions without the ledger |
| Follow every recorded-open item | Confirm an owner, a resolution method, and a trigger / runnable next action exist |
| Simulate a resume from the ledger and confirmed checkpoint markers | Confirm regeneration is idempotent and resumes at the first unconfirmed checkpoint without replaying settled answers |
| Compare a rerun classification against the actual existing memory | Detect a blind append and confirm the unchanged / index-update / new / superseding / deferred-open handling |
| Read the Topic 6.3 and 8.4 outputs | Verify applicable accessibility, i18n, failure-recovery, observability, runbook, and operator-ownership directions — or a proven irrelevance |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"The next agent can ask"** | A required startup question that must be re-asked is a baseline Usage failure |
| **An open item without a pickup contract** | Require an owner + resolution method + trigger / next action; `TBD` is not usable |
| **A record-level summary treated as durable completion evidence** | Later-session completion is derived from durable memory; the summary is live-session evidence only |
| **Operator needs collapsed into prose readability** | A readable baseline still fails Usage if no logs, signals, runbook / pointer, ownership, or recovery path exists |

---

## Consistency

**Lens**: Do the topic answers, claim status, decisions, staged docs, manifest, actual memory, indexes, and summary tell one coherent and traceable story?

**Scenario source:** `scenario.md` § Consistency (`STARTUP-CONS-SCENARIO-*`)
**Checklist source:** `checklist.md` § Consistency (`STARTUP-CONS-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Run the explicit §7 contradiction pass | Compare vision vs scope, users vs journeys, non-goals vs roadmap, quality vs stack, data / privacy / retention vs architecture, risks vs capacity, and rules vs live examples |
| Trace sampled claims **memory → manifest → staged source → ledger → evidence / decision brief** | Detect unverified-claim promotion, evidence-strength inflation, unsupported license / IP statements, and orphaned memory claims |
| Diff the full staging inventory, manifest dispositions, actual memory delta, README pointers, and summary promoted paths | Detect silent drops, unlisted edits, stale indexes, and internally agreeing but incomplete records |
| Compare the existing overlapping memory against creates / updates / supersessions | Confirm unchanged files stayed unchanged and contradictions use paired supersession / archive semantics |
| Inspect staging filenames and collision handling | Verify one record per slug, stable subject names, and no silent overwrite of a distinct record |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **A contradiction pass asserted, not shown** | Record each named comparison and its resolution; a checkbox alone is not evidence |
| **User authority treated as fact verification** | Authority can settle intent; an external fact still needs evidence or qualification |
| **The manifest compared only to the summary** | Compare both to the on-disk staging set and the actual memory delta; two incomplete documents can agree |
| **Synthesis allowed to strengthen the prose** | The claim kind and evidence status must survive all the way into durable wording |

---

## Risk

**Lens**: What breaks if the baseline is wrong — leaked sensitive data, unsupported license / authority / binding rule, memory corruption, irrecoverable partial promotion, cost / error-risk, premature validity, or a load-bearing design claim promoted with no evidence?

**Scenario source:** `scenario.md` § Risk (`STARTUP-RISK-SCENARIO-*`)
**Checklist source:** `checklist.md` § Risk (`STARTUP-RISK-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Run a heuristic secret / sensitive-data scan over **all** staged typed drafts, the living-index candidates, the summary, the evaluation evidence, and the actual promoted delta | Detect credentials, tokens, private URLs, PII / customer data, and user-marked sensitive values; do not rely only on the ledger flags |
| Compare Topic 1.4, the authority entries, the binding-rule confirmations, the prior-art use, and the dependency records against the repository / source evidence | Verify license, IP, compliance, decision authority, the rule invariant / scope / reason / exception, trusted sources, and fallback claims |
| Diff the actual memory changes against the approved manifest and the recorded preimages | Detect pre-gate mutation, unlisted writes, collisions, stale-preimage overwrites, and out-of-scope source / skill / code edits |
| Inspect the per-row exact-path verification, supersession pairs, archive moves, living-index pointers, and standing-guard outputs | Prove promotion reached a complete, form-valid post-state |
| Inspect the partial-state / recovery evidence | Confirm the state is complete or fully rolled back and the narrow delete carve-out never touched pre-existing memory |
| Verify both P6.5 output sets and the reconciliation before reading `baseline_valid` | Confirm two fresh systems reviewed the same frozen set and P7 did not outrun the gate |
| Read the cost / error-budget / rollback / irreversibility records | Confirm bounds, warnings, mitigations, and recovery paths, or a proven-irrelevant reason |
| Sample the load-bearing design claims across problem reality, user clarity, product-shape soundness, and feasibility & sustainability | Confirm each is evidenced to its standard or `recorded-open` with an owner; an applicable un-evidenced, un-owned claim drives REVISE, and a fabricated citation, a silently-strengthened claim status, or a laundered `n/a` drives FAIL (`STARTUP-RISK-SCENARIO-06`) |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Only user-marked secrets scanned** | Scan every source and destination; users may not recognize every sensitive token or private identifier |
| **A preference hardened into a rule** | A binding rule promotes only with explicit user confirmation of its invariant, scope, reason, and exception |
| **P5 validation assumed current at P6** | Recheck each destination immediately before mutation; a stale preimage never authorizes an overwrite |
| **Green frontmatter treated as safe promotion** | Form guards do not prove content completeness, truth, privacy, authority, or bounded scope; P6.5 does |
| **One evaluator treated as enough** | Startup's anti-groupthink gate requires both fresh systems and a reconciliation |
| **Summary completion trusted over memory state** | Verify the exact destinations, guards, and evaluation outputs; the summary cannot make a partial state valid |
| **Process-perfect read as substance-sound** | A fully covered, atomic, secret-free, traceable baseline can still be substance-hollow; a load-bearing problem / user / product-shape / feasibility claim with no behavioral or verified evidence drives REVISE, not PASS |

---

## Overall (Stage 3) — startup-specific anchors

When the evaluator runs Stage 3 on a startup baseline, the Karpathy-4 check applies as follows:

| Karpathy mode | What it looks like in a startup baseline |
|---|---|
| **Wrong assumptions** | A ledger `assumption`, forecast, preference, or `unverified` claim is promoted as an unqualified fact — especially a load-bearing market, scale, security, license, privacy, or operational claim. |
| **Overcomplexity** | Startup creates a feature directory for a task or an internal mechanism, fragments one concept across many records, bundles unrelated concepts, or crosses from direction into detailed mechanism design. |
| **Orthogonal edits** | Startup changes repository code, skills, templates, agents, or unrelated memory outside the approved manifest. |
| **Imperative-over-declarative** | A README or typed baseline record prescribes build steps, interfaces, algorithms, or task sequencing instead of stating the current project reference, constraints, and verifiable outcomes. |

**Preserve-list anchors specific to startup**: well-supported user / problem evidence; sharp scope and
non-goals; reference-backed, user-decided directions; explicit distinctions among fact, intent,
forecast, preference, assumption, and open question; concise atomic records; owned open questions;
correct supersession / recovery evidence; and living-index pointers that avoid duplication.

---

## P6.5 verdict routing

Use the canonical confidence / severity thresholds from `evaluation/SKILL.md`:

- any contributing `Critical` finding with confidence ≥ 75 sets the perspective / Overall verdict to
  `FAIL`;
- any contributing `High` finding with confidence ≥ 50 sets it to at least `REVISE`; and
- otherwise the perspective / Overall verdict is `PASS`, with lower-severity findings recorded.

The manager reconciles the two systems pessimistically. A finding from either system stays in the union
unless it is disproved with stronger evidence; a material divergence is a user decision. Checklist
completion is mandatory: every box must resolve to `PASS:`, `FAIL: {finding-id}`, or `n/a: {reason}`,
and `n/a` is allowed only for a proven-irrelevant branch.

### PASS

`PASS` permits P7 only when both systems have produced all nine files, the reconciled result has no
FAIL / REVISE contributor, every required branch has a valid closure, all design-bearing choices are
reference-informed and user-decided, the contradiction pass is clean or explicitly owned, the manifest
and the actual delta match, the exact paths and standing guards pass, and the sensitive-data / license
/ authority checks pass. A non-blocking unknown may remain only as `recorded-open` with an owner, a
resolution method, and a trigger / next action.

### REVISE

`REVISE` blocks P7 and returns to the **earliest owning startup phase**, not automatically to P4:

| Finding owner | Return |
|---|---|
| Current-reality, evidence, or Topic 1 license / governance gap | P2 |
| Shallow / missing branch answer, dependency-order conflict, design-decision gap, or cross-topic contradiction | P3 (or the specific earlier branch P3 re-opens) |
| Atomicity, template, claim-status wording, secret-redaction-before-promotion, or README-index defect | P4 |
| Manifest trace, destination, area, collision, preimage, approval, or pre-write-validation defect | P5 |
| Exact-path, supersession / archive, index-order, standing-guard, or recoverable-promotion defect | P6 recovery / repair |

Before revisiting P2-P5 after memory has changed, the manager uses the P6 partial-state recovery
contract to complete-forward or roll back deterministically; evaluators never edit memory. After
repair, rerun the owning phase through P5, P6, and P6.5. Typical REVISE cases include a recoverable
shallow answer, a missing recommendation rationale, an atomicity defect, README duplication, a
resolvable contradiction, or a manifest / trace mismatch with a trustworthy preimage and recovery path.

### FAIL

`FAIL` halts startup, leaves `baseline_valid` false, and invokes the manager-owned recovery / user
gate. No aggregate score or strength elsewhere offsets any verified startup FAIL floor:

- **What or Why is missing or ambiguous**;
- **a required branch is absent, silently skipped, or recorded-open without an owner and resolution method**;
- **a secret or prohibited sensitive value reached durable memory or evaluation evidence**;
- **an unverified load-bearing claim was promoted as fact**;
- **memory changed before whole-set validation and final approval**;
- **an unlisted or colliding destination was overwritten** (including a changed preimage that P6 ignored);
- **promotion is partial with no trustworthy recovery state**; or
- **`baseline_valid: true` was set before exact verification, the standing guards, and the reconciled P6.5 PASS**.

A missing Topic 1.4 is the required-branch floor, not a minor coverage percentage. A baseline with
45/46 owned branches, or 99% valid destinations plus one overwritten collision, is not "complete
enough".

---

## Output reminder

Each fresh evaluator writes **nine** record-level files: the seven per-perspective files + one
`overall.md` + the filled `checklist.md`, all under the startup non-loop path
`sessions/{date}-{session-id}/startup/working/evaluation/iter{n}/{system}/`:

- Seven files at `startup/working/evaluation/iter{n}/{system}/{project,structure,performance,aesthetics,usage,consistency,risk}.md`
- One `startup/working/evaluation/iter{n}/{system}/overall.md`
- One filled `startup/working/evaluation/iter{n}/{system}/checklist.md` — the Stage 0 copy → Stage 1 `## Stage 1 Additions` → Stage 2 tick with `PASS:` / `FAIL: {finding-id}` / `n/a: {reason}`

Each per-perspective file uses the mandatory headers from `evaluation/SKILL.md`:
`## Artifact Summary + Memory reads` → `## Locked Frame (Stage 1)` → `## Per-scenario per-check results`
→ `## Typed findings` → `## Low-confidence appendix`, and records its perspective verdict. The Artifact
Summary's Memory reads register names every baseline-set path and every overlapping prior-memory path
the evaluator consumed. `overall.md` records the reconcilable Stage 3 verdict, the full-metadata
findings, the Karpathy checks, and the Preserve list. Evaluators write no source, memory, summary,
ledger, manifest, or other system's output.
