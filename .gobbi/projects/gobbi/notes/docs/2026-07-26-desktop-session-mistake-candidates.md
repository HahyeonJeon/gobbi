---
name: desktop-session-mistake-candidates
description: Twelve Execution-phase mistake candidates from the desktop-skill session, preserved from the gitignored session tree
type: notes
scope: project
feature: null
status: active
created: 2026-07-26
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [process]
keywords: [mistake-candidates, verification, single-owner, gates]
author: claude
steps_completed: [execution]
shipped: false
---

# Execution-phase mistake candidates

Twelve candidates produced during Execution that were **never written to typed staging**. They existed only
in the manager's runtime task list, which no agent can read, and would have been lost at session end. Written
here so promotion has a source. Each names its reporter.

Routing — skill-owned versus cross-cutting project tier — is an Always-Ask user decision at promotion, and is
not decided here.

---

## E1 — Generalising a source's named primitives is a union drop no structural gate sees
*Reported by the mechanics author, self-caught mid-task.*

**What happened.** A child document was written by generalising roughly forty named platform interfaces the
design required by name — writing "the archive integrity switches" where the design named them individually.

**Why it happens.** Generalising reads as good prose. The design's own reason for naming primitives is that a
rule naming no mechanism cannot be executed, and two rules had already been found unexecutable for exactly
this in an earlier iteration.

**How to recognise it.** Link, count, and anchor gates were all green across the defect. Only a
primitive-level self-diff against the source found it.

**Correct approach.** When a source names an interface, carry the name. Diff at primitive granularity, not at
condition granularity, before declaring a child complete.

## E2 — `tr -d 'ABC-D'` reads an embedded hyphen as a character range
*Reported by the mechanics author, caught before use.*

**What happened.** A gate used `tr -d 'DESK-G'` to strip an identifier prefix. `tr` read `K-G` as a reversed
range, returned empty, and would have false-**failed** every input.

**Correct approach.** Prove a new gate on a **known-good** input as well as a planted violation. A gate tested
only against a defect looks correct when it rejects everything.

## E3 — A design can mandate a section shape naming interfaces its own evidence register never researched
*Reported by the mechanics author.*

**What happened.** Two children's mandated shapes named platform interfaces with no corresponding evidence
row anywhere.

**Correct approach.** Write the obligations at full strength and mark the mechanisms with closing conditions.
Report the gap-register items upward rather than editing the parent, and never invent the mechanism to fill
the shape.

## E4 — Pointing at a single-owner value protects against a stale value, not a stale characterisation
*Reported by the mechanics author; the manager then violated it in the commit that stated it.*

**What happened.** A sibling restated what an owner's row *meant* alongside pointing at it. When the owner's
value was corrected, the neighbouring pure-pointer sentence self-healed and the restatement was left wrong.

**Correct approach.** State the property in terms that stay true whatever the value is, and let the pointer
carry the value. If a sentence would become false when the owner's value changes, it is restating rather than
pointing.

## E5 — Renaming a row in a single-owner table requires sweeping inbound row-label pointers
*Reported by the trace verifier.*

**What happened.** The manager renamed a row in the version owner and swept nothing. A sibling was left with a
correct sentence pointing at a row title that no longer existed.

**How to recognise it.** The link checker passes it — a row label is not a link.

**Correct approach.** Treat a row label as a reference class. Renaming one requires the same inbound sweep a
path rename does.

## E6 — A claim quantified over a support window is worse than a stale value
*Reported by the trace verifier.*

**What happened.** A correction replaced an asserted removal with "on every currently supported major the
access still exists" — true at the time, false once the support window reaches the removal version.

**Why it is worse than a stale value.** It names no version, so the owner's own re-verify trigger — *every
sibling statement naming a version* — is structurally unable to find it.

**Correct approach.** Name the version, or state the property in a form no window crossing can falsify.

## E7 — The discriminator for restatement defects in a single-owner family
*Reported by the trace verifier. The highest-value item here.*

A restatement is a defect **only when the sentence characterises the state of a versioned row**. A sentence
naming an **unversioned per-operating-system divergence** is the sanctioned form, not a restatement — the
delta matrix exists precisely so a sibling can state an obligation once and name the platform that changes it.

Twelve absence-claim candidates resolved as twelve false positives under this test, where a description-based
sweep would have produced twelve arguments. It is grounded in the owner's own published purpose rather than in
reviewer taste, which is what makes it a predicate instead of a heuristic.

## E8 — A verification script must fail with a named diagnosis, not a traceback
*Reported by the triad author.*

An unhandled exception that exits non-zero is technically fail-closed and useless as a gate. An exit code
without a named cause is half a gate.

## E9 — Author counts from a scan of the finished text, never from the drafting plan
*Reported by the triad author.*

A header stated case and cell counts taken from the drafting plan; the finished file held different numbers.
Caught by scanning before commit — but the header had already been written, which is the trap.

## E10 — An Evidence line that would detect a violation is not a Pass condition that forbids it
*Reported by the trace verifier, from a planted fixture.*

A planted fixture's evidence method would have caught the missing condition, so a reviewer reading the
evidence line alone would have passed it. The obligation test requires the **pass condition** to own the
primitive.

## E11 — A guard's own fixture suite passing is not evidence the guard passes on the real repository
*Reported by the wiring author.*

The sync mechanism's test suite exits zero **while proving that source topology rejects marketplace drift** —
and that exact drift is live in this repository, where the mechanism fails. A green test suite for a mechanism
and a green run of that mechanism are different claims.

## E12 — Manager: seven scan-form mismatches in one session
*The manager's own, reported by three separate agents.*

**What happened.** Seven times a scan returned zero or a wrong count against an artifact that was correct:
a fidelity sweep that omitted two nested bundles; three "discrepancies" that were the manager failing to
exclude ledger sections; a routing-instruction check that confirmed existence rather than location; scenario
headings read at three hashes when they carry four; a heading pattern that missed a live pointer.

**Why the recorded rule was not enough.** The subject-versus-scan-unit rule was written down mid-session and
the error recurred four more times after it. What the subagents did differently is the actionable part: their
extractors **parse structure and compare two independently-derived sets**, and they proved each against a
planted fixture before citing it. The manager's were single-pass pattern matches trusted on sight.

**Correct approach.** For any count or absence claim that will be acted on: derive it twice by different
means and compare, or prove the instrument against a known-bad input first. A passing check that would pass
equally on a known-broken input is not a check.
