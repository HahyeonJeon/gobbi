# Stage 2 — Per-Scenario Checklist Walk (Claude Iter1)

Sequential walk; each item judged yes/no with evidence.

## S1 — Memory Access Matrix row

- [x] Row 31 names `session.json.git.worktreePath` as absolute root when set. Evidence: line 31 verbatim.
- [x] Row 31 covers null/direct-mode fallback. Evidence: "fall back to main tree when `worktreePath` is null (direct mode)".
- [x] Row 31 addresses transcripts. Evidence: trailing sentence "Transcript path … lives in user home (`~/.claude/projects/`) — not under either tree."
- [x] Critical rule paragraph line 33 echoes the same three concerns coherently.

S1 verdict: PASS.

## S2 — P2 procedure

- [x] P2 declares invocation at Configuration row 5.5. Evidence: line 155.
- [ ] **P2 body is consistent with new invocation site.** Evidence: line 157 ("For each task entering Execution"), line 163 ("Pass the absolute worktree path to every delegation prompt that operates on this task"). These still imply per-task creation. FAIL → finding F-01.
- [x] orchestration/SKILL.md Step 1 row 5.5 cross-link resolves. Evidence: orchestration/SKILL.md line 103 contains row 5.5 with full worktree-create spec (added by commit 14da700).
- [ ] No residual "one worktree per task" framing. FAIL → F-01.

S2 verdict: REVISE.

## S3 — Direct mode

- [x] Fallback path unambiguous in both row 31 + Critical rule line 33.
- [x] Transcript handling explicit and direct-mode-safe (transcripts always live in home regardless of mode).

S3 verdict: PASS.

## S4 — Plan-spec verifies

- [x] grep count = 3 ≥ 2.
- [x] symlink intact.
- [x] single-file scope (1 file changed, 4+/2-).

S4 verdict: PASS.

## S5 — Commit hygiene

- [x] `AI-Provenance-Record:` trailer present (1 line, correct form).
- [x] Commit message body cites T1-I-T1.b and T1-I-T1.c.
- [x] Commit grammar conforms.

S5 verdict: PASS.

## S6 — Future-reader patch path

- [ ] **Matrix cell parseable as role-permission only.** FAIL — embeds rev-parse implementation detail. → finding F-02.
- [ ] **Rule-inversion traceable.** PARTIAL — commit message captures it; skill body doesn't. → finding F-03.
- [x] No silent contradiction with orchestration row 5.5 / sibling skills.

S6 verdict: REVISE (Low severity).

## S7 — Diff-window-only adversarial check

- [x] Diff window self-contained for matrix row (lines 31+33 fully replaced).
- [ ] **Hidden contradictions outside diff window.** FAIL — P2 body at lines 157-163 (outside the +/- diff lines but adjacent to the inserted note at 155) contradicts the note. The diff-only reader sees only "Execution-start path retired"; the whole-file reader sees the contradiction. → finding F-01 (this is the headline finding the mistake-skill warned about).

S7 verdict: REVISE.

## New findings surfaced (not anticipated in Frame)

None. All defects fit one of the scenarios anticipated in `frame.md`.

