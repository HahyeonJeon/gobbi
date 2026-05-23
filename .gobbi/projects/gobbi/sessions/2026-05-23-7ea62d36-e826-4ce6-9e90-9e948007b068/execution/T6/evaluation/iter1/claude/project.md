# Project — T06 codex skill content

## Artifact Summary

- **What**: Content-complete fill of the 8 H2 codex SKILL.md at `.gobbi/projects/gobbi/skills/codex/SKILL.md` (386 lines) + 1-row Skill Map addition in `gobbi/SKILL.md` cross-cutting table. Commit `bcfaab2`.
- **Why**: Close gobbi-orchestration-workflow-improvements item A — give every agent that touches Codex a single load-target documenting `codex exec`, sandbox+CWD discipline, hang/timeout, dual-system evaluator topology, and ≥8 anti-patterns.
- **How**: Executor authored the body of each pre-stubbed H2 plus the Constraints body block; preserved the locked 8-H2 contract; followed Idea Design A subsection priority (exec / rescue / adv-review) and appended the assistant-wrapper subsection per the locked Planning decision-record.

## Memory reads
- `planning/artifacts/plan.md:346-405` (Task 06 brief + 5 brief-discipline items)
- `ideation/artifacts/idea.md:240-330` (Design A + Implementation Checklist items 1, 3, 14, 15 + Cross-Link Manifest #8, #9, #10)
- `planning/staging/decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md` (locked content requirements 1-7)
- `mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `.claude/agents/{manager,leader,executor,evaluator,assistant}.md` (`tools:` lines for Section 3 verification)

## Locked Frame (Stage 1)

Project lens — does the artifact solve the right problem and stay inside the locked Scope Contract (Task 06 brief + Idea Design A)?

- **S-P-1** Brief deliverables landed (8 H2 contract; length 350-450; Skill Map row; frontmatter shape; mistake cited).
  - C-P-1.1 H2 count == 8.
  - C-P-1.2 Each H2 name matches the locked spec verbatim.
  - C-P-1.3 Length within 300-500 envelope.
  - C-P-1.4 Frontmatter has `name`, `description`, `allowed-tools`; no `when-to-load:` key.
  - C-P-1.5 Section 4 cites `codex-eval-session-write-path-nested-in-worktree.md` and quotes the mistake's "corrected approach" verbatim.
  - C-P-1.6 Section 3 cites actual `tools:` lines from `.claude/agents/*.md`.
- **S-P-2** Idea Design A Implementation Checklist coverage (items 1, 3, 14, 15).
  - C-P-2.1 Item 14: Use cases section cites both spawn patterns AND post-eval `find` sanity check AND mistake (≥3 hits).
  - C-P-2.2 Item 15: Anti-patterns section has ≥ 8 entries INCLUDING subagent-cannot-spawn-plugin-agent AND missing-agents-symlink entries (Idea text is explicit on the two named entries).
- **S-P-3** Cross-Link Manifest #8, #9, #10 wired (idea.md:323-325).
  - C-P-3.1 #8: Section 4 → `mistakes/codex-eval-session-write-path-nested-in-worktree.md` (wired).
  - C-P-3.2 #9: Section 5 → `git/SKILL.md` background-mode guidance (wired).
  - C-P-3.3 #10: Cross-Link Manifest target #10 (not visible above 325 — out-of-scope for Project if not in Design A).
- **S-P-4** Brief discipline items 1-5 (plan.md:399-403).
  - C-P-4.1 Item 3: "Re-state both finding-Type vocabularies (the 5 Types) explicitly so anti-patterns and use-cases reference them correctly."
  - C-P-4.2 Item 5: Constraints body block annotation references "body block per locked Idea Design A (8 H2 section contract)".
- **S-P-5 (adversarial)** Brief-traceable omissions — did the executor silently drop any explicit requirement?

## Stage 2 — Per-check evidence

- C-P-1.1 ✓ `grep -c '^## ' SKILL.md` returns 8.
- C-P-1.2 ✓ All 8 H2 names verbatim against plan.md:350.
- C-P-1.3 ✓ 386 lines.
- C-P-1.4 ✓ Frontmatter shape verified (lines 1-5); no `when-to-load:` key.
- C-P-1.5 ✓ Section 4 quotes the mistake's "Every evaluator delegation prompt … main-tree absolute path … pwd-derived" passage verbatim (lines 149-155).
- C-P-1.6 ✓ Section 3 table at lines 99-105 matches actual `tools:` lines I confirmed via `grep -E '^tools:' .claude/agents/*.md`.
- C-P-2.1 ✓ Section 6(a) has both patterns + post-eval find at line 287 + mistake referenced via Section 4 cross-link.
- C-P-2.2 ✗ Anti-patterns: 8 entries present (meets ≥8 floor) AND subagent-cannot-spawn-plugin-agent entry present ✓; BUT **the missing-agents-symlink anti-pattern (explicitly named in Idea checklist 15 AND pre-listed in the stub) is ABSENT.** `grep -n 'symlink\|\.agents/skills' SKILL.md` returns zero hits anywhere in the file. The stub had pre-listed this as the 4th anti-pattern: "Codex skill ships only `.claude/skills/codex/SKILL.md` and forgets `.agents/skills/codex` symlink — codex itself cannot load its own skill. Both symlinks MUST exist." Dropped.
- C-P-3.1 ✓ Section 4 (lines 149-155) cites the mistake by file name.
- C-P-3.2 ✗ Section 5 does NOT cross-link `git/SKILL.md`. `grep -n 'git/SKILL\|git skill' SKILL.md` returns zero hits. Idea Cross-Link Manifest #9 (idea.md:324) is explicit: `codex/SKILL.md § Hang + timeout discipline` → `git/SKILL.md` background-mode guidance. Unwired.
- C-P-4.1 ✗ Plan brief discipline #3 required re-stating the 5 Types vocab so anti-patterns + use-cases reference them. The file mentions "5-Type vocabulary" once (line 77) without enumeration; anti-patterns + use cases do not name any Type.
- C-P-4.2 ✓ Constraints annotation (line 370) reads "body block per locked Idea Design A (8 H2 section contract)" verbatim.
- S-P-5 ✗ Empirical witness IDs I1-I14 / E1-E5 from Idea Design A (idea.md:271 Design A header anchors them; plan.md:350 task body says "Cite empirical witnesses I1-I14 + E1-E5 inline") — `grep -n 'I1\|I13\|E1\|E5' SKILL.md` shows no I*/E* IDs. The executor opted for descriptive citations ("empirical witness, this session's Planning iter1 attempt 1") instead. The brief is unambiguous: "Cite empirical witnesses I1-I14 + E1-E5 inline."

## Findings

### F-P-01 — Anti-pattern roster missing the "missing-agents-symlink" entry explicitly required by Idea checklist 15
- Type: `checklist_gap` | Domain: `docs-sync` | Disposition: `open` | Confidence: 100 | Severity: High
- Evidence: `grep -n 'symlink\|\.agents/skills' .gobbi/projects/gobbi/skills/codex/SKILL.md` returns 0 hits. Idea checklist 15 (idea.md:261) names two required entries by topic; stub pre-listed this as anti-pattern #4 (codex SKILL.md original stub lines 122-123). Executor dropped it during fill.
- Why it matters: The dogfood requirement — codex MUST load its own skill — is exactly the kind of failure mode an anti-pattern entry was supposed to prevent. Idea Design A:274 spells out "both symlinks (file-level .claude/skills/codex/SKILL.md + directory-level .agents/skills/codex) mandatory — dogfood requires codex to load its own skill". An anti-pattern roster that omits this is the failure-mode roster minus its primary failure mode.
- Suggested direction: Add a 9th anti-pattern bullet under Section 8 citing `.claude/skills/codex/SKILL.md` + `.agents/skills/codex` joint requirement.

### F-P-02 — Cross-Link Manifest #9 (`codex/SKILL.md § Hang + timeout discipline` → `git/SKILL.md`) unwired
- Type: `checklist_gap` | Domain: `docs-sync` | Disposition: `open` | Confidence: 100 | Severity: High
- Evidence: `grep -n 'git/SKILL\|git skill' .gobbi/projects/gobbi/skills/codex/SKILL.md` returns 0 hits. Idea Cross-Link Manifest #9 (idea.md:324) is unambiguous on the wiring direction.
- Why it matters: Cross-Link Manifest items are the wiring contract between skills; an unwired link is documentation drift between two adjacent skills (codex + git) on the same topic (background-mode job control). Iron Law 8 (every implementation change must be reflected in documentation) — and the inverse: every documentation contract must be wired.
- Suggested direction: Add explicit "see `git/SKILL.md` § background-mode" link inside Section 5 (likely under the foreground/background tradeoff or companion-plugin-controls block).

### F-P-03 — Empirical witness IDs (I1-I14 / E1-E5) not cited inline
- Type: `general` | Domain: `docs-sync` | Disposition: `open` | Confidence: 100 | Severity: Medium
- Evidence: `grep -n 'I1\|I13\|E1\|E5' SKILL.md` shows no inline I*/E* citations. Plan.md:350 task body explicitly states "Cite empirical witnesses I1-I14 + E1-E5 inline."
- Why it matters: The IDs are the join key back to `idea.md` evidence; descriptive citations ("this session's Planning iter1 attempt 1") are less precise than the structured IDs the Idea + Plan adopted. A future evaluator or reviewer cannot triangulate from the codex skill back to the specific insight without those IDs.
- Suggested direction: Add (Iₙ) / (Eₙ) tags at sentence-end in each H2's witness mentions — Section 2 (a/b/c) → I1, I2, I13; Section 3 → I13; Section 4 → I3, I4, E2; Section 5 → I5; Section 7 → E3, E4, E5.

### F-P-04 — 5-Type finding vocabulary not re-stated; anti-patterns / use-cases do not reference the Types
- Type: `general` | Domain: `process` | Disposition: `open` | Confidence: 75 | Severity: Medium
- Evidence: `grep -n 'scenario_gap\|checklist_gap\|design_flaw\|assumption_risk' SKILL.md` returns 0 hits. "5-Type vocabulary" appears once at line 77 as a noun phrase without enumeration. Plan brief discipline #3 (plan.md:401): "Re-state both finding-Type vocabularies (the 5 Types) explicitly so anti-patterns and use-cases reference them correctly."
- Why it matters: Brief item 3 was added precisely because section-name + vocabulary drift is the strongest failure mode history in this campaign (per the brief's own preamble). Silent omission of the re-statement reintroduces the failure mode the brief tried to guard against.
- Suggested direction: Add a short body block under Section 2(d) or Section 6(a) that names the 5 finding Types (`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`) when describing what the wrapper assistant must grep for.

## Verdict
- Critical/≥75: 0 → no `FAIL` floor hit
- High/≥50: 2 (F-P-01 ≥50, F-P-02 ≥50) → **REVISE**

**Project verdict: REVISE.**
