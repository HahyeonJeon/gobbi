# Risk Perspective — chat-mode.md (T1, iter1)

**Verdict:** PASS

**Scope:** What could go wrong downstream because of THIS doc? Failure modes if a reader misuses, misreads, or extends the spec. Adversarial scan for ambiguity, hidden assumptions, silent regression vectors, and irreversible drift.

## Risk inventory

### R1 — Drift on the R5 canonical statement (LOW)
Hazard: a future editor adds a second "Chat MEMORIZATION runs every loop with narrowed PASS" statement somewhere downstream (in `orchestration/SKILL.md`, `wrap-up/SKILL.md`, or a different sub-doc), causing two canonical statements to diverge over time.

Mitigation present: §4 L135-L136 explicitly says "no other section in any doc may state Chat MEMORIZATION otherwise" and L172-L174 says "any reference … is a short-form pointer to this section." This is the strongest form of mitigation a markdown doc can offer.

Confidence: 25. Severity: Low. Disposition: open (cannot be closed by this doc alone — needs downstream-doc discipline).

### R2 — Forward-reference to a non-existent annotation (LOW)
Hazard: §1 L22-L28 + §Cross-references L487-L490 forward-reference "the CORRECTION annotation in `orchestration/SKILL.md § Orchestration Mode`". If a downstream Plan task (T7 / T9 / T10 integration) doesn't write that annotation, this doc's framing is unmoored.

Out-of-T1-scope by design (Plan T1 `out-of-scope-files` excludes `.claude/skills/orchestration/SKILL.md` mirror via the symlink convention). Risk is real but not blocking.

Confidence: 50. Severity: Low. Type: `assumption_risk`. Domain: `docs-sync`. Open.

### R3 — User loops indefinitely without explicit wrap-up (LOW, designed-for)
Hazard: a user starts a chat session, never types "wrap up", and walks away. The doc explicitly addresses this at §7 L329-L333 (partial-session survival): every loop's MEMORIZATION runs per §4, transcript + session.json + per-loop artifacts persist, task-records persist, and a future session resumes via the 3-state worktree guard. **This is a feature, not a risk.**

Confidence: 100. Severity: N/A (intentional). Not a finding.

### R4 — Preparation mistakenly Aborted instead of Skipped (LOW)
Hazard: a future executor reads `preparation.maxIterations: 0` and interprets it as an Aborted verdict (since maxIter exhausted = Aborted in the state-transition table for other loops).

Mitigation present:
- §3 diagram L82-L86 spells out "no FAIL or Aborted verdict; persists `{state: "Skipped", iterations: []}`".
- §8.2 row L391 explicitly: "loop-entry guard reads `maxIterations: 0` → `preparation.state: Skipped`; R1 lock; no DISCUSSION/WORK/EVAL/MEMO rows run; stamps `{state: "Skipped", iterations: []}`".
- §9 R1 semantic note L464-L468 reinforces: "does not produce a FAIL or Aborted verdict… No DISCUSSION row runs, no WORK row runs. This is encoded at the state-machine layer (see §8.2)."

The triple-statement defense is intentional. ✓

Confidence: 25. Severity: Low. Not a finding given the mitigation.

### R5 — task-record frontmatter ambiguity (LOW)
Hazard: an executor / assistant writes task-record.md while frontmatter type is deferred, and picks something other than the (a) / (b) options.

Mitigation present: §6.2 L264-L266 says "Until Planning makes this choice, agents authoring a task-record should use the `artifacts/` frontmatter schema as a default (carrying `loop`, `iter`, `artifact_type: task-record`, `created_at`, `status`)." Concrete default with field list.

Mild concern: the default leans toward option (a). If Planning chooses (b), task-records written before Planning resolves will need rewriting. But the deferral is explicit and the default is small. Acceptable.

Confidence: 50. Severity: Low. Type: `assumption_risk`. Domain: `process`. Open.

### R6 — Term-lock drift on "per-task slice" downstream (LOW)
Hazard: a downstream doc author (auto-mode.md, status-display schema, settings doc) drifts to "slice", "task slice", "Chat task", etc.

Mitigation present: §2 L39-L41 lists non-canonical synonyms explicitly. Defenders a future grep audit. ✓

Confidence: 25. Severity: Low.

### R7 — User Review Gate ignored by manager implementation (LOW)
Hazard: the manager runs to next task without presenting AskUserQuestion options after task-record write.

Mitigation present:
- §3 diagram L106-L109 explicit USER REVIEW GATE.
- §6.4 L296-L297 "manager verifies presence of the task-record at the user review gate before presenting `AskUserQuestion` options."
- §8.2 state-transition rows L402-L405 ("`taskRecord: written` | user selects … |") encode three branches: Next task / Revise this task / Wrap up.

Triple-locked. ✓

Confidence: 25. Severity: Low.

### R8 — Mistake moment-of-capture lost in narrowed PASS path (LOW)
Hazard: an assistant reads "Steps 6-7 skipped" in §4 and skips mistake-candidate staging too.

Mitigation present: §4 third bullet L151-L157 explicitly carves out the exception ("**Moment-of-capture preserved.** The `mistake/SKILL.md § P2` discipline … is **NOT** part of Steps 6-7's deferred typed-finding staging."). §5 L202-L206 reinforces it. ✓

Confidence: 25. Severity: Low.

### R9 — Status display data backing path stale (MEDIUM possibility, LOW severity)
Hazard: §8.1 L343 cites `state.json.workflow.chat.tasks[currentIndex]` — if the actual session.json schema in the project uses a different path, this doc would be stale.

This evaluation cannot verify the session.json schema (out of T1 scope). The "R3 lock from the workflow.chat.tasks[] array-of-slices schema" parenthetical at L344-L345 cites the source-of-truth as a `workflow.chat.tasks[]` schema lock — meaning if R3 holds, the path holds. The doc's claim is self-consistent and traceable.

Confidence: 50. Severity: Low. Type: `assumption_risk`. Domain: `data` (state schema). Open — flag for T2 / T3 integration testing.

### R10 — Privacy / secrets in `## What the user asked` body section (LOW)
Hazard: a verbatim copy of the user's ask leaks secrets / PII into the task-record.

Mitigation present: §6.3 L274 ("verbatim or paraphrased ask; prefer paraphrase if the ask contains secrets or PII"). Explicit guidance, matches the Idea doc's privacy note (cf. codex-risk-79f7e024).

Confidence: 25. Severity: Low.

## Karpathy-4 failure-mode scan (Stage 3-relevant, but flagged here too)

- **Over-engineering** — Is the doc over-built for its purpose? At 509 lines for a sub-doc that owns one mode's spec + R5 + D-A + D-B + state machine + status display + settings table, the density is justified. No padding detected.
- **Premature abstraction** — Does the doc introduce abstractions the project doesn't need? "per-task slice" is the central abstraction; the doc carries the term lock for exactly this reason. Acceptable.
- **Speculative generality** — Any "in the future…" hooks that have no consumer? §10 mode-level discuss-first lock is justified by the §9 settings table delta (settings could be flipped); §6.2 frontmatter deferral has a known consumer (Planning). No speculation.
- **Coupling without contract** — Does the doc bind to other docs without a contract? Yes, mildly: `orchestration/SKILL.md § Orchestration Mode` CORRECTION annotation (R2 above), `wrap-up/SKILL.md` procedure extension (L168). Both flagged as Low-severity open assumption risks.

## Findings

**No findings above Low severity.**

Aggregated low findings: R1 (drift defense), R2 (forward-reference), R5 (frontmatter deferral default), R9 (state schema path). None block ship; all are open / deferred / mitigated.

## Must-preserve list

- §4 hard-locking language ("no other section in any doc may state Chat MEMORIZATION otherwise") — removing this opens the drift door.
- §8.2 state-transition table guard cells citing R1 + R5 + the SKILL.md cross-refs — these are the auditability hooks.
- §6.2 default-while-deferred recommendation (using `artifacts/` schema) — without this, task-records authored pre-Planning are formless.
- §7 negative-list ("no auto-trigger on idle / N tasks / no more tasks") — this is the explicit Don't, not just the implicit Do.
- §3 diagram + §8.2 + §9 triple-statement defense of preparation Skipped semantics — removing any one weakens the protection against FAIL/Aborted misinterpretation.

## Overall verdict

**PASS.** No critical or high risk findings. Multiple low-severity open assumption risks are flagged for the manager / planner; they are all out-of-T1-scope and properly forward-referenced.
