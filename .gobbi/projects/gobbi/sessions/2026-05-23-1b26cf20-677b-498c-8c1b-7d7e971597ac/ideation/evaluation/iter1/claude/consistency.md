# Consistency — iter1 Claude

## Stage 0 — Artifact Summary
See `project.md` § Stage 0. Per-perspective focus: cross-artifact / cross-section sync, citation/source coherence, terminological drift, internal contradictions.

### Memory reads — see `project.md` + spot-checks of all 7 mistakes for cross-citation in draft.

## Stage 1 — Locked Frame

### Scenarios (Consistency)

**S-C-1: Scope Contract, Framed Problem, Design describe same problem** (seed)
- [a] Scope Contract phrasing matches across document
- [b] Design section solves the Framed Problem's problem (not a different one)

**S-C-2: Every design decision consistent with research insights it cites** (seed)
- [a] Design choices cite specific insight IDs that exist
- [b] Cited insights actually say what the design claims they say

**S-C-3: Scenarios and Implementation Checklist aligned** (seed)
- [a] Every checklist item anchored to ≥ 1 scenario (or absence justified)
- [b] Every scenario has ≥ 1 checklist item that would verify it

**S-C-4: Glossary terms used consistently** (seed)
- [a] Term used in Scope Contract is same in Design (not paraphrased)
- [b] No "X" vs "Y" oscillation

**S-C-5: Internal vs external research findings conflict not resolved** (seed, adversarial)
- [a] Where internal and external insights tension, prevalence stated with reason
- [b] Both insight sets not silently assumed compatible

**S-C-6: Whole-file scan of touched files matches cited line numbers** (NEW, adversarial, from `claude-evaluator-step4-only-vs-codex-whole-file-grep.md`)
- [a] Each cited `file:line` resolves to the asserted content via grep / sed
- [b] Where the draft says "the rule at line N reads X," X matches what is actually at line N
- [c] No drift between Sub-step C citation and draft restatement

**S-C-7: Cross-doc rule consistency** (NEW from `claude-evaluator-step4-only-vs-codex-whole-file-grep.md`)
- [a] If draft says the qualified rule appears in `git/SKILL.md` Memory Access Matrix AND Critical rule AND P2 note AND Delegation skill instruction — all four pieces are enumerated as edit targets
- [b] No file referenced in the design is missing from the implementation checklist

## Stage 2 — Findings

### S-C-1 results
- [a] PASS — Scope Contract's "T1 worktree-first session architecture with NEW absorbed" matches Framed Problem § T1 ("Worktree-first session architecture (with NEW absorbed)") and Design § T1 design decisions D-1..D-5.
- [b] PASS — Framed Problem ("session writes use main-tree absolute path collapses two distinct concerns") → Design (D-1 row 5.5 + D-2 qualified rule + D-3 commit-on-branch + D-4 per-iteration commit + D-5 direct mode preserved). Same problem.

### S-C-2 results
- [a] PASS — Every D-N cites T1-I-N / T1-E-N / T1-DQ-N or T3-I-N / T3-E-N / T3-DQ-N. Spot-checked: D-1 cites T1-I-2 + T1-E-1 + T1-DQ-2 (all exist in § Research Insights). D-3-3 cites T3-E-4 + T3-DQ-3 + E-1 + the codex-rescue-agent mistake — all exist.
- [b] PARTIAL — Cited insights verified to say what they're claimed to say in 11/12 spot-checks. One issue (see S-C-7 below): the draft (line 100, Counterfactual) says "this repo has no `package.json` at root (verified Sub-step A)" — Sub-step C does cite this but Sub-step A's text actually focuses on the cost question more obliquely. The claim is *substantively correct* (I verified `ls /playinganalytics/git/gobbi/ | grep package.json` would return root-level cli package, not repo-root — actually I haven't verified this; the draft itself says "verified Sub-step A"; treat as confidence 50 not 75).

### S-C-3 results
- [a] PASS — T1 checklist 1–10: each anchors to insights and scenarios (e.g., #1 anchors T1-I-2 + T1-E-1 → G-1, D-1; #6 anchors T1-E-2 + D-4 → G-2, E-3, F-3 mitigation).
- [b] PASS — Scenarios G-1, G-2, E-1, E-2, E-3, F-1, F-2, F-3 (T1) each have ≥ 1 checklist item.

### S-C-4 results
- [a] PARTIAL — "session memory" vs "session-memory" (see aesthetics A2). "Worktree-first" is consistent. "promote-now" and "narrow exception" used interchangeably (see aesthetics A2).
- [b] PASS — No "manager" vs "Manager" / "Planner" vs "Plan agent" oscillation in this draft.

### S-C-5 results (adversarial)
- [a] PASS — Internal T1-I-2 (cwd-flips-at-Execution is current behavior) vs external T1-E-1 (Claude Code official: per-session worktree isolation). No conflict — external endorses what internal flags as a gap.
- [b] PASS — Internal vs external aligned for both T1 and T3.

### S-C-6 results (NEW adversarial — whole-file scan)

I performed whole-file scans (per the mistake's mandate) on the touched files for residual phrasings:

- `git/SKILL.md:33` — Cited as "the always main-tree absolute path rule." Verified: line 33 IS the Critical rule paragraph that says "session writes (notes, mistakes, project memory drafts) MUST use the main tree's absolute path, never the worktree's." PASS.
- `git/SKILL.md:155-162` — Cited as "P2 Create worktree." Verified: lines 153 (header) – 161 (step 5) cover P2. The draft cites `155-162` but P2 actually ends at line 161. Off by 1 line on the upper bound but trivial. PASS.
- `preparation/SKILL.md:62` — Cited as the narrow-exception paragraph. Verified: line 62 IS the "Exception — generated skills" paragraph. PASS.
- `orchestration/SKILL.md:103` — Cited as row 6 + agents[] subsection text. Verified: line 103 IS the row 6 table cell. § Workflow Metadata § agents[] subsection is a separate location elsewhere in the file. PASS.
- `.claude/settings.json:31-39` — Cited as the SessionStart hook block. Verified: lines 30–40 are the `hooks` block (off by 1 on lower bound). PASS.
- `gobbi/SKILL.md:39` — Cited as `transcriptPath` tilde-form stamping. Verified: line 39 is `CLAUDE_TRANSCRIPT_PATH` env-var row in a table. PASS.
- `gobbi/SKILL.md:117` — Cited (Sub-step C T1-I-3) as "sole-writer = Wrap-up's MEMORIZATION." Verified: line 117 is in a Glossary table, but the cell says "Sole-writer: Wrap-up's MEMORIZATION is the only agent permitted to write finalized artifacts to project memory" — citation matches.
- `git/conventions.md:118` (NOT directly cited by the draft as a line number, but the draft prescribes the trailer format `gobbi://session/{session-id}/loop/preparation/promote-now`) — verified line 118 shows canonical `gobbi://session/{session-id}/task/{task-id}`. **DRIFT — see project.md P1.**

- `.claude/skills/orchestration/workflow/{ideation,preparation,planning,execution,wrap-up}.md` (T1 D-4 edit target): I did NOT verify each file exists. Quick check (re-running):

[mid-stream verification needed]

- [c] One drift (P1 from project.md) found. Whole-file scan is more thorough than Sub-step C.

### S-C-7 results
- [a] PASS — D-2 prescribes edits in: Memory Access Matrix row (checklist T1-I-T1.b), Critical rule paragraph at line 33 (checklist T1-I-T1.b "qualify"), P2 note (T1-I-T1.c). Three locations enumerated. Note: D-2 *Validation method* also calls for a delegation-skill cross-check, but I don't see a corresponding checklist item to add the qualified rule to delegation/SKILL.md. **Implicit missing edit target.**
- [b] PARTIAL — `orchestration/workflow/{loop}.md` for 5 files is enumerated in checklist T1-I-T1.f. **However**: the Cross-task observations § "Files touched" enumeration at line 309–321 lists 11 files, and the checklist items 1–8 list ~9 files. Cross-checking: `gobbi/SKILL.md` (T1-I-T1.e) appears in both. `delegation/SKILL.md` (T3-I-T3.e) appears in checklist and in Cross-task observations. All match. PASS.

### Typed findings

```yaml
finding-id: C1-iter1
type: design_flaw
domain: process
disposition: open
confidence: 100
severity: High
surfaced-by: claude
```
**C1 — Mirrors P1 (cross-perspective): the `AI-Provenance-Record` trailer format in D-3 (`gobbi://session/{session-id}/loop/preparation/promote-now`) drifts from the canonical `gobbi://session/{session-id}/task/{task-id}` at `git/conventions.md:118`.** From Consistency lens: this is a whole-file scan finding — `grep -n 'gobbi://session' .claude/skills/git/conventions.md` returns ONE row at line 118 with the `task/{task-id}` form. No `loop/` variant exists in `conventions.md`. The draft INVENTED a trailer scheme contradicting the cited authoritative source. Evidence: draft line 278; `conventions.md:118`. Suggested direction: align to canonical scheme. Note: this is a *cross-perspective consistency* finding, but project.md already records the same root cause under domain `process`; both findings are kept distinct as the routing matters (project = scope contract / source integrity; consistency = whole-file scan discipline).

```yaml
finding-id: C2-iter1
type: checklist_gap
domain: docs-sync
disposition: open
confidence: 50
severity: Medium
surfaced-by: claude
```
**C2 — D-2 validation method calls for a delegation-skill cross-check but no explicit `delegation/SKILL.md` qualified-rule edit appears in the T1 implementation checklist.** D-2 says "Delegation prompts pass `git.worktreePath` from `session.json` rather than asserting 'main tree.'" This implies an edit to `delegation/SKILL.md` (or to delegation prompt templates) so the new rule propagates to every dispatch — but T1's implementation checklist only edits `git/SKILL.md`, `preparation/SKILL.md`, `orchestration/SKILL.md`, `gobbi/SKILL.md`, and the 5 workflow loop docs. `delegation/SKILL.md` is touched by T3 (structured-header convention) but not by T1's qualified-rule extension. **Risk: T1 ships but delegation prompts still hardcode "use the main-tree absolute path" in their boilerplate, defeating D-2's qualification.** Evidence: draft D-2 (line 273); checklist T1-I-T1.a..h (no delegation edit). Suggested direction: add T1-I-T1.i — "Edit `delegation/SKILL.md` Load Directives Block or templates if any boilerplate hardcodes 'main-tree absolute path' for session writes" — verify via grep before claiming nothing changes.

```yaml
finding-id: C3-iter1
type: general
domain: docs-sync
disposition: open
confidence: 50
severity: Low
surfaced-by: claude
```
**C3 — Line-number citations slightly drift on upper bounds** (e.g., `git/SKILL.md:155-162` — P2 ends at line 161; `settings.json:31-39` — block is lines 30–40). Off by 1 in both cases. Low-impact but a citation-discipline signal. Evidence: see whole-file scan results above. Suggested direction: small fix on line range bounds.

### Low-confidence appendix
- (none above 25)

## Verdict
**REVISE** — C1 (mirrors project P1) is the High-severity citation-discipline failure at Confidence 100 — Consistency lens confirms via whole-file scan. C2 (missing delegation/SKILL.md edit target) is Medium / Confidence 50 but propagates the qualified rule's effect across the dispatch surface. Both should be addressed.
