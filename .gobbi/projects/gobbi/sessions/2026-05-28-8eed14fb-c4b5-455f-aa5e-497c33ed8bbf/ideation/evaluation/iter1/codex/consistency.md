VERDICT: REVISE

## Artifact Summary + Memory reads
The artifact attempts to reconcile a user-ratified Chat shape with existing Gobbi contracts. Consistency review checks whether the Scope Contract, W/W/H, design sections, risks, current source files, and cited mistakes all agree.

### Memory reads
- Target draft read in full.
- Current `orchestration/SKILL.md`, `settings.default.json`, `state.template.json`, `session.template.json`, and backlogs read or checked.
- `discussion/SKILL.md`, `delegation/SKILL.md`, `memorization/SKILL.md`, `memorization/templates/notes.md`, `wrap-up/SKILL.md`, and project rule/mistake files read as consistency anchors.
- Applicable mistakes: `section-order-is-part-of-the-contract-not-just-the-set.md`, `skills-mirror-symlinks-not-copies.md`, `design-literal-retire-instruction-without-replacement.md`, `prose-reclassification-target-is-project-level-notes.md`.

## Locked Frame (Stage 1)
Scenario 1: The document uses one consistent Chat memorization model.
- Check: Locked input decision, HOW, diagram, notes, amendment delta, and risk table all say the same thing.
- Check: If memorization is narrowed, the narrowed steps are named without saying the whole sub-phase is skipped.
- Check: Known moment-of-capture mistakes remain preserved.

Scenario 2: File/path claims agree with the repository.
- Check: Claimed placeholder files and mirror symlinks exist.
- Check: `.agents` Codex entry path and `.claude` mirror semantics are not conflated.
- Check: CRUD rows do not contradict actual file state.

Scenario 3 (adversarial): Internal contradictions let different executors implement different systems from the same idea.
- Check: Settings defaults, state persistence, task-record lifecycle, and Wrap-up inputs have one owner each.
- Check: Risks table severity matches verified evidence.
- Check: "Closed" vs "open" backlog status is not contradictory.

Coverage notes:
- Privacy/data retention: no PII introduced; transcript/task-record retention is a memory-retention concern handled in Risk.
- Licensing/IP: no external borrowed code; not applicable.

## Per-scenario per-check results
Scenario 1:
- Consistent memorization model: no. Evidence: `draft-iter1.md:37` says "per-loop MEMORIZATION is skipped"; `:38` says mini loops include MEMORIZATION; `:88-89` says only mistake-stage moment-of-capture; `:134` says MEMORIZATION runs every loop, preserving transcript/session.json/artifacts but not typed-finding staging; `:256` says the manager never skips MEMORIZATION.
- Narrowed steps named: partial. R5 at `:419` says choose a mode-aware branch or skip steps 6-7, but the main design still uses conflicting labels.
- Moment-of-capture preserved: yes, repeatedly cited.

Scenario 2:
- Placeholder/mirror claims agree: no. File checks disprove the claims.
- `.agents` vs `.claude` conflation: partial/no. The draft mentions `.claude` symlinks but not `.agents`; AGENTS.md says Codex loads skills from `.agents/skills`.
- CRUD rows consistent: no.

Scenario 3:
- Owners single: partial/no. Task-record is simultaneously a session artifact, a notes-typed project artifact, and a Wrap-up input.
- Risk severity matches evidence: no for R12. The nonexistent mode files are marked Low/verify later despite being central deliverables.
- Backlog status consistent: no.

## Typed findings
- finding-id: codex-cons-5708c2f3
- Type: design_flaw
- Domain: process
- Disposition: open
- Confidence: 75
- Severity: High
- Evidence: `draft-iter1.md:37`, `:38`, `:88-89`, `:134`, and `:256` describe Chat MEMORIZATION as skipped, present in the mini loop, mistake-only, narrowed but running every loop, and never skipped.
  Finding: The draft has not settled the Chat MEMORIZATION contract. R5 recognizes part of the issue, but the main proposal still leaves multiple mutually incompatible readings. Use one authoritative phrase and one step list: for example, "Chat MEMORIZATION runs every loop with a narrowed PASS path: transcript/session.json/artifacts only; typed-finding staging is deferred to Wrap-up except moment-of-capture mistake candidates."

- finding-id: codex-cons-2e4a90bc
- Type: general
- Domain: docs-sync
- Disposition: open
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:361-362`, `:398-399`, and `:426` claim existing placeholders and `.claude` mirror symlinks; fresh file checks show all four mode doc/mirror paths are missing.
  Finding: The artifact contradicts the repository on a central CRUD fact. This must be revised before Planning because it changes task type and verification criteria.

- finding-id: codex-cons-8d66ab12
- Type: checklist_gap
- Domain: docs-sync
- Disposition: open
- Confidence: 75
- Severity: Medium
- Evidence: `draft-iter1.md:26` and `:431-443` conflict with backlog frontmatter showing active/open.
  Finding: Backlog status should be normalized throughout: current state is open/active; intended future terminal state is closed/addressed on ship.

## Low-confidence appendix
- finding-id: codex-cons-low-1
- Suppressed at confidence 25: The Auto-mode `evaluate.mode: skip` power-user override may conflict with "two retired setup questions stay retired"; this may be only a UI/setup distinction, so it is not scored.
