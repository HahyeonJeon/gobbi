# Consistency Perspective — chat-mode.md (T1, iter1)

**Verdict:** PASS

**Scope:** Internal consistency (term lock, R5 single canonical statement, no contradictions), external consistency (alignment to Idea §3, Plan T1 pre-resolved decisions, the unmodified `memorization/SKILL.md` base, and the parent `orchestration/SKILL.md`).

## Internal consistency

### Term lock "per-task slice"
- Declared §2 L39-L41 (canonical term + listed non-canonical synonyms).
- Used 22 times throughout the doc.
- Synonym audit (grep `per-user-typed-task slice|task slice|Chat task`) returns ONLY the §2 declaration that lists them as non-canonical. **Zero drift.** ✓

### R5 — single canonical statement
- §4 is the single anchor at L133-L161 (29 lines).
- 14 short-form pointers elsewhere ("§4 narrowed PASS path", "see §4 canonical", "§4 narrowed PASS path runs") — these are pointers, not duplicate statements.
- The four-bullet skeleton ("Steps preserved:" / "Steps skipped:" / moment-of-capture exception / base-unmodified clause) appears exactly once each (lines 142 / 146 / 151-157 / 158-161). ✓

### Principle citation
- Principle 1 cited at L198 + explanatory note at L200 ("iter1's Principle 4 citation was a wrong-number reference, corrected per §8 L-P1/L-C2/L-U1").
- `grep 'Principle 4'` returns 0 hits on the file. **Principle 4 not cited as the law anywhere.** ✓
- The cross-reference in §5 L198-L201 also explicitly cites "delegation/SKILL.md § Inline-Paste Rule" alongside Principle 1, matching the Plan's pre-resolved-decisions block.

### D-A / D-B
- D-A appears at L217 (explicitly labeled "Decision D-A") and reinforced at L264 + L508.
- D-B appears at L234 (explicitly labeled "Decision D-B") and reinforced via the directory layout in the code fence L236-L245.
- Both decisions are letter-labeled (not just described), making them greppable. ✓

### Internal contradictions check
- L43-L51 says "Each per-task slice contains its own Ideation loop, its own Preparation loop (which resolves to `state: Skipped` at loop entry per R1), its own mini Planning loop, its own mini Execution loop". §8.2 state-transition table L391 matches: preparation.state: Skipped via maxIterations=0. Consistent. ✓
- L185 says "DISCUSSION is forced user-driven, regardless of the resolved `discuss.mode`". §9 settings table at L457/L459/L460 shows `discuss.mode: "user"` everywhere. §10 reinforces "even if a future settings change flips … to `"agent"`, the mode-level contract documented here still forces user-driven DISCUSSION". The three sections nest consistently: §10 is the mode-level lock, §9 is the settings layer, §5 documents the per-loop fact. ✓
- §3 diagram L70 ("DISCUSSION (forced user-driven, regardless of discuss.mode)") matches §5 L185-L187. ✓
- L131 + L168 reference §6 (task-record body shape) — §6.3 at L268 is the spec target. Match. ✓
- L488-L490 cross-reference back to `orchestration/SKILL.md § Orchestration Mode` (CORRECTION annotation) — this depends on the annotation existing in `orchestration/SKILL.md`. The annotation status is OUTSIDE T1 scope (Plan's `out-of-scope-files` excludes `.claude/` mirror and other `.claude/` docs, and Plan's traceability does not include `orchestration/SKILL.md` modifications). This doc accurately FORWARD-REFERENCES that annotation; whether it exists in the parent SKILL.md is a separate Plan task. **Not a contradiction within this doc**; flagging as out-of-scope assumption (see findings).

## External consistency

### vs Idea §3 (spec source, idea.md L136-L271)
| Spec item | Idea location | chat-mode.md location | Match |
|---|---|---|---|
| Mode posture + term lock | §3.1 L136-L142 | §2 L34-L41 | ✓ matches verbatim core |
| Per-task slice diagram | §3.2 L150-L209 | §3 L61-L120 | ✓ structurally identical |
| R5 four-bullet skeleton | §3.3 L222-L227 | §4 L138-L161 | ✓ four bullets in same order |
| Wrap-up's input narrative | §3.3 L229 | §4 L163-L170 | ✓ (a)/(b)/(c) sources match |
| Per-loop discipline | §3.4 L233-L243 | §5 L180-L207 | ✓ 6 bullets covered (forced user-driven + 3 gates + iter cap + eval always + memo every loop + fresh subagent + moment-of-capture) |
| task-record spec | §3.5 L245-L256 (table form) | §6 L210-L306 (split into 6.1-6.5) | ✓ richer rendering of same content |
| Wrap-up trigger | §3.6 L258-L268 | §7 L309-L334 | ✓ three signals + NOT-auto-trigger list |

### vs Plan T1 pre-resolved decisions (plan.md L131-L137)
- R5: narrowed PASS path local to chat-mode.md — §4 frames it as local override at L138-L161. ✓
- D-A: session-local-only — §6.1 L217. ✓
- D-B: session layout `sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/{ideation,planning,execution}/{rawdata,staging,artifacts,evaluation}/` — §6.1 L236-L245 matches verbatim minus typography. ✓
- Term lock: "per-task slice" canonical — §2 L39-L41. ✓
- Principle citation: Principle 1 (not Principle 4) + delegation/SKILL.md § Inline-Paste Rule — §5 L198 + L499. ✓
- Frontmatter type deferred — §6.2 L251 + does not invent a type (just lists options a/b). ✓

### vs required mistake citations
- `skills-mirror-symlinks-not-copies.md` — referenced at §Cross-references L504. ✓
- `prose-reclassification-target-is-project-level-notes.md` — referenced at L256 (§6.2 inline rationale) + L304 (§6.5 Wrap-up role) + L507 (cross-refs). ✓
- `design-literal-retire-instruction-without-replacement.md` — not directly cited in the doc. This mistake is about NOT retiring an instruction without replacing it; the doc preserves R5's narrowed PASS path AS the replacement for the original SKILL.md 241-242 lock (§1 L22-L28 explicitly frames the doc as the replacement, supersedes the lock). Mistake is structurally satisfied without explicit citation. ✓ (acceptable)
- `section-order-is-part-of-the-contract-not-just-the-set.md` — not directly cited, but section ordering preserves the Idea-doc canonical order §3.1 → §3.6 mapped to §2 → §7. Mistake is structurally satisfied without explicit citation. ✓ (acceptable)

### vs memorization/SKILL.md base (R5 lock)
The doc claims at L158-L160 + L494 that `memorization/SKILL.md` is unmodified. This evaluation reads only chat-mode.md (T1's contract); the upstream R5 lock state is OUTSIDE T1's verification scope. The doc's framing is consistent and forward-pointing; verifying memorization/SKILL.md is untouched is a separate (project-wide) check.

## Findings

**No findings above Low severity.**

Low / observational:
- L22-L28 references "the CORRECTION annotation in `orchestration/SKILL.md § Orchestration Mode`" — assumes that annotation exists. T1 scope excludes editing `orchestration/SKILL.md`, so if the annotation hasn't been authored in a later Plan task, this forward-reference is dangling at the time chat-mode.md ships. Confidence: 50. Severity: Low. Type: `assumption_risk`. Domain: `docs-sync`. Worth flagging to the Plan-wide review (T7 / T9 integration tasks).
- §5 L188-L190 cites `orchestration/SKILL.md § Mode-specific gates within a loop` — same forward-reference dependence; the parent SKILL.md needs that section heading to exist for the cross-link to resolve. Confidence: 50. Severity: Low. Type: `assumption_risk`. Domain: `docs-sync`.
- §5 L196-L201 marks Principle 1 vs Principle 4 with prose explanation. The correction is correct, but the prose ("iter1's Principle 4 citation was a wrong-number reference") may be inscrutable to a reader without the session's idea-doc context. This is a leaked draft-process artefact, but harmless. Confidence: 25. Severity: Low. Type: `general`. Domain: `process`.
- L168 says "Wrap-up's procedure extension is `wrap-up/SKILL.md`-side and is separately tracked." — references a separately-tracked artifact (probably a Plan task) without a literal pointer. A future reader has to grep / hunt. Confidence: 25. Severity: Low. Type: `assumption_risk`. Domain: `docs-sync`.

## Must-preserve list

- The §1 L22-L28 framing: "originally stated … superseded by … See the CORRECTION annotation". This frames the doc's existence in the project history and explains the original-SKILL.md-241-242 mismatch.
- §6.1 letter-labeled decisions D-A and D-B — keep the letters; do NOT replace with prose-only labels.
- Principle 1 + delegation/SKILL.md § Inline-Paste Rule joint citation at L198 — keep both pointers; either alone is half the truth.
- L494 cross-reference language "the unmodified base MEMORIZATION procedure" — keep the word "unmodified"; this signals to a future editor that the base is locked.

## Overall verdict

**PASS.** Internal consistency is high (term lock 22/0, R5 single statement with 14 typed pointers, no contradictions). External consistency to Idea §3 + Plan T1 pre-resolved decisions is comprehensive. Forward-references to `orchestration/SKILL.md` annotations are flagged as Low-severity assumption risks but are out of T1 scope.
