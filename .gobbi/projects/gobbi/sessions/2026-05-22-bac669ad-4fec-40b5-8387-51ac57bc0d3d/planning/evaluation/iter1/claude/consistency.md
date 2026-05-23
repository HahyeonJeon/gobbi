# Consistency Perspective — Planning Evaluation iter1

## Artifact Summary + Memory reads

Same as project.md. Evaluating: hand-off name matching, traces-to field presence, field schema uniformity, tooling consistency, plan ↔ Ideation coherence.

**Memory reads:** same as project.md. Additionally: verified line numbers in all 13 P1 files and all 9 P7 lines via live grep.

---

## Locked Frame (Stage 1)

### Scenario 1: Task inputs/outputs name-match across hand-offs
Checklist:
- [ ] T3 output ("renamed gobbi/SKILL.md") is named consistently with T4's exclusion clause
- [ ] T5 output ("transcriptPath field canonical") is named consistently with T6's dependency justification

### Scenario 2: Every traces-to reference points to a real Ideation item
Checklist:
- [ ] T1 Why → "Idea § How → Hook contract (P2 + P3) + FIX 1 + FIX 5 + FIX C" — verifiable?
- [ ] T3 Why → "P4 + P5; FIXes 2/4/5/6" — verifiable?
- [ ] T4 Why → "P1 + FIX 1" — verifiable?
- [ ] T5 Why → "P6; FIXes 3/7/8/A/B" — verifiable?
- [ ] T6 Why → "P7" — verifiable?

### Scenario 3: Field schema uniform across tasks
Checklist:
- [ ] Same fields present in T1-T7 and M1

### Scenario 4: Tooling consistent across tasks
Checklist:
- [ ] All use `rg` (ripgrep) for search — consistent?
- [ ] All use `jq` for JSON — consistent?
- [ ] Edit tool discipline: `Edit` (not `Write`) mandated for T3/T4/T6

### Scenario 5: Plan ↔ Ideation coherence (naming, counts, line numbers)
Checklist:
- [ ] T4 lists 11 files — matches Idea P1 rows 3-13 (13 total - 2 in gobbi/SKILL.md = 11)?
- [ ] T6 lists 6 files / 9 lines — matches Idea P7 table?
- [ ] T5 mentions orchestration/SKILL.md line 371 — matches Idea P6 FIX 7?

### Scenario 6 (adversarial): A task implicitly relies on shape introduced by a later task
Checklist:
- [ ] T6 cites `session.json.transcriptPath` as canonical — T5 must land first (dependency enforced)
- [ ] T3 cites the "installed hook" — T1+T2 must land first (dependency enforced)

---

## Per-scenario per-check results

### Scenario 1: Input/output name matching
**T3 → T4:** T4 Files out-of-scope: `gobbi/SKILL.md (already done in T3)`. Matches T3's Files in-scope. PASS.
**T5 → T6:** T6 dependency justification says "T6 cites `session.json.transcriptPath` as the canonical source; that field is only documented as canonical after T5 lands." The field name `transcriptPath` is used consistently in T5 (success criteria, How steps) and T6 (success criteria). PASS.

### Scenario 2: Ideation traces
**T1 → P2+P3+FIX 1+FIX 5+FIX C:** All verified against Idea artifact.
- P2: hook script — YES, in Idea § P2 Decisions Log.
- FIX 1: no CLAUDE_SESSION_ID export — YES, in Idea § Iter2 Changelog.
- FIX 5: CLAUDE_HOOK_SOURCE — YES, in Idea § Iter2 Changelog.
- FIX C: jq @sh — YES, in Idea § Iter3 Changelog.
PASS.

**T4 → P1+FIX 1:** P1 is the rename decision; FIX 1 removes CLAUDE_SESSION_ID from hook export. Both verified in Idea. PASS.

**T5 → P6+FIX 3+FIX 7+FIX 8+FIX A+FIX B:** All verified in Idea § P6 Decisions Log and iter2/iter3 changelogs. PASS.

**T6 → P7:** Verified. 6 files, 9 line numbers match exactly between plan T6 Files in-scope and Idea § P7 Decisions Log table. PASS.

### Scenario 3: Field schema uniformity
All 7 executor tasks have: What, Why, How, Files in-scope, Files out-of-scope, Agent assignment, Skills to load, Dependencies, Success criteria, Verification commands.
M1 uses same structure but "Skills referenced" instead of "Skills to load" — minor naming drift, meaning is clear.

**Finding F-CONS-01:**
- Type: `checklist_gap`
- Domain: `process`
- Disposition: open
- Confidence: 100
- Severity: Low
- Evidence: T1-T7 use "Skills to load:" field label; M1 uses "Skills referenced:" field label. plan.md lines 46, 80, 111, 155, 192, 228, 256 (T1-T7) vs line 306 (M1).
- Why it matters: Low — M1 is a manager action, not an executor task, so the different label is arguably intentional. But if a parser or future template check looks for "Skills to load:" it would miss M1's entry.
- Suggested direction: Standardize to "Skills to load:" across all tasks including M1, or add a note in the plan that M1 uses a different field convention.

### Scenario 4: Tooling consistency
**Search tool:** All tasks use `rg` (ripgrep). T2 and T5 use `jq -e` for JSON verification. T1 uses `grep -F` in one check alongside `grep -E` in another (both standard). PASS.
**Edit discipline:** T3 How step 2: "Use `Edit` (per-section anchored replacements), NOT `Write`." T6 How step 2: "apply `Edit` per line." T4 How step 2: "apply `Edit` with `replace_all=true`." Consistent. PASS.
**Test runner:** Not applicable (no test files modified). PASS.

### Scenario 5: Plan ↔ Ideation count/line-number coherence
**T4 — 11 files:** Idea P1 table has 13 rows (rows 1+2 are gobbi/SKILL.md; rows 3-13 are 11 files). 13 - 2 = 11. Matches. PASS.
Verified by grep: 11 files outside gobbi/SKILL.md contain CLAUDE_SESSION_ID. EXACT MATCH.

**T6 — 6 files / 9 lines:** Idea P7 table lists exactly 6 files with 9 line references (wrap-up:280, planning:417, execution:208, ideation:407+415, memorization:20+146+155, preparation:330). Count = 1+1+1+2+3+1 = 9. EXACT MATCH. PASS.

**T5 — line 371:** Idea P6 FIX 7 says "orchestration/SKILL.md around line 371." T5's success criteria cites "around line 371." Verified: `grep -n 'Top-level fields'` hits line 371 in the actual file. EXACT MATCH. PASS.

### Scenario 6: Forward-dependency implicit reliance (adversarial)
**T3 cites "actual installed hook":** T3 depends on T1+T2 (listed explicitly). PASS.
**T6 cites `session.json.transcriptPath`:** T6 depends on T5 (listed explicitly). PASS.
**T4 assumes gobbi/SKILL.md already done:** T4 depends on T3 (listed explicitly). PASS.

No implicit forward dependencies detected.

---

## Typed findings

| ID | Type | Domain | Disposition | Confidence | Severity |
|----|------|--------|-------------|------------|----------|
| F-CONS-01 | `checklist_gap` | `process` | open | 100 | Low |

## Low-confidence appendix

(none)

**Consistency perspective verdict: PASS** (one Low finding — field label drift on M1 only)
