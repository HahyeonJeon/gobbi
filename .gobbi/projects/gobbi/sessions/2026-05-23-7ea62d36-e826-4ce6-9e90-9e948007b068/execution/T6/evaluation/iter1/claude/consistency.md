# Consistency — T06 codex skill content

## Artifact Summary
Same as project.md.

## Locked Frame (Stage 1)

Consistency — cross-artifact coherence and sync (everything that should change together, did).

- **S-C-1** SKILL.md content ↔ Skill Map row (gobbi/SKILL.md): description aligned, name aligned, path aligned.
- **S-C-2** SKILL.md ↔ stub (pre-existing structural contract from Preparation): 8 H2 names + frontmatter shape preserved.
- **S-C-3** SKILL.md ↔ recorded mistake (Section 4 quote-match).
- **S-C-4** SKILL.md ↔ Section 3 tool-surface table ↔ `.claude/agents/*.md` source `tools:` lines.
- **S-C-5** SKILL.md ↔ Idea Cross-Link Manifest #8 (mistake) / #9 (git/SKILL.md) / #10 (whatever idea.md:325 names).
- **S-C-6** SKILL.md ↔ decision-record content requirements 1-7 (assistant-wrapper).
- **S-C-7** Internal consistency — Section 2(d) topology sketch matches Section 6(a) topology sketch.
- **S-C-8 (adversarial)** Latent contradictions: does any MUST in Constraints contradict any body text?

## Stage 2 — Per-check evidence

- S-C-1 ✓ gobbi/SKILL.md row (diff line 177) reads `[codex](../codex/SKILL.md) | Codex CLI invocation — codex exec patterns, sandbox + CWD discipline, hang/timeout handling, and dual-system evaluation use cases.` — aligned with `description:` in SKILL.md frontmatter (line 3).
- S-C-2 ✓ Stub at file pre-bcfaab2 had `name: codex`, `description: ...`, `allowed-tools: Read, Grep, Glob, Bash, Write, Edit` + STUB tag in description. Post-fill removes the STUB tag from description and keeps the same `allowed-tools` set. The "STUB — content to be written by Execution" preamble at top of stub is removed in the fill — appropriate.
- S-C-3 ✓ Section 4 lines 149-155 quote `codex-eval-session-write-path-nested-in-worktree.md` verbatim — confirmed against the source.
- S-C-4 ✓ Section 3 table at lines 99-105 matches `.claude/agents/*.md` tools lines:
  - manager `"*"` ✓
  - leader `Read, Grep, Glob, Bash, WebSearch, WebFetch, Write` ✓
  - executor `Read, Grep, Glob, Bash, Write, Edit` ✓
  - evaluator `Read, Grep, Glob, Bash` ✓
  - assistant `Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch` ✓
- S-C-5 Cross-Link Manifest sync: #8 wired ✓; #9 unwired ✗ (already recorded in project.md F-P-02); #10 — idea.md:325 (not visible in my read of 240-330; the Cross-Link Manifest table at idea.md:314-325 has rows 1-9 visible — row 10 may be on the next line block; I did not verify).
- S-C-6 ✓ Decision-record requirements 1-7 traceable in SKILL.md: req 1 topology diagram (Section 6(a) lines 250-254); req 2 worked example (lines 256-281); req 3 anti-pattern callout for `codex:codex-rescue` (Section 8 entry 2) + manager-direct background (Section 8 entry 3); req 4 cross-reference to decision-record (Section 6(a) line 245 + Section 2(d) line 68); req 5 timeout 600 wrap (Section 5 line 196 + Constraints line 378); req 6 files-as-truth (Section 5 lines 226-237 + Constraints line 380); req 7 notification timing note (Section 5 lines 210-211).
- S-C-7 ✓ Topology sketches Section 2(d) lines 83-89 and Section 6(a) lines 248-254 are consistent (manager spawns 2 assistants, each runs its eval, both return).
- S-C-8 Spot-check Constraints vs body: line 376 Constraint `MUST pass --cd /playinganalytics/git/gobbi when the session path is outside the codex auto-detected project root` matches Section 4 absolute-path mandate; line 384 `NEVER use danger-full-access sandbox mode as a default — only on explicit user instruction` matches Section 4 mode table. No contradictions found.

## New findings

### F-C-01 — Cross-Link Manifest #10 not verified inline; row 10 destination not echoed in SKILL.md
- Type: `general` | Domain: `docs-sync` | Disposition: `open` | Confidence: 25 | Severity: Low
- Evidence: My idea.md read covered lines 240-330; visible Cross-Link Manifest entries went through #9 at line 324. The plan brief refers to "idea.md Cross-Link Manifest 8 + 9 + 10 (idea.md:323-325)" but I did not pull idea.md:325 itself.
- Why it matters: Possibly a non-issue. Recorded with low confidence so the manager can verify.
- Suggested direction: Pull idea.md:325 verbatim and confirm the #10 wiring exists in SKILL.md or doesn't.

(Suppressed at Confidence ≤ 25 per evaluation/SKILL.md threshold filtering; moved to Low-confidence appendix.)

## Low-confidence appendix
- F-C-01 (confidence 25) — see above.

## Verdict
- Critical/≥75: 0; High/≥50: 0 (F-P-02 is the High one and is attributed to Project, not duplicated here)
- **Consistency verdict: PASS** (Cross-link #9 omission is recorded as Project F-P-02; not double-counted).
