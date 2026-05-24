# Stage 1 — Scenario+Checklist Frame (Claude Iter1)

Locked Frame for Task 02 (overall perspective). Built before walking the diff, used as the lens for Stage 2.

## Scenarios

### S1 — Reader follows the new Memory Access Matrix row for a worktree-first session

Checklist:
- [ ] Row 31 names `session.json.git.worktreePath` as the absolute root when set.
- [ ] Row 31 says what to do when worktreePath is null (direct-mode fallback to main tree).
- [ ] Row 31 addresses transcripts (ext.: ~/.claude/projects).
- [ ] Critical rule paragraph at line 33 echoes (a)+(b)+(c) coherently with the matrix cell.

### S2 — Reader hits P2 procedure to create the worktree

Checklist:
- [ ] P2 declares its invocation site (Configuration row 5.5, NOT Execution start).
- [ ] P2 body's surrounding language is consistent with the new invocation site.
- [ ] Cross-link to orchestration/SKILL.md Step 1 is real and resolves.
- [ ] No residual "one worktree per task" framing in P2 steps.

### S3 — Subagent in direct mode (no worktree) reads the same skill

Checklist:
- [ ] Fallback path is unambiguous.
- [ ] Transcript handling does not break in direct mode.

### S4 — Plan-spec verifies (raw)

Checklist:
- [ ] `grep -E 'worktreePath' .claude/skills/git/SKILL.md` returns ≥2 matches.
- [ ] `test -L .claude/skills/git/SKILL.md`.
- [ ] Single-file diff scope.

### S5 — Commit hygiene (Iron Law 7+8)

Checklist:
- [ ] `AI-Provenance-Record:` trailer present, exactly one line, correct gobbi:// URL with active session + plan task id.
- [ ] Commit message references ideation anchors T1-I-T1.b + T1-I-T1.c.
- [ ] Commit grammar follows `git/conventions.md` (type+scope+imperative).

### S6 (adversarial) — Future reader 6 weeks from now patches the matrix

Checklist:
- [ ] Matrix cell is parseable as role-permission only (or implementation prose is clearly demarcated).
- [ ] Rule-inversion (was "never worktree", now "worktree when set") is traceable to ideation/commit.
- [ ] No silent contradiction with sibling skills (orchestration row 5.5, delegation, preparation).

### S7 (adversarial) — Reader uses only the diff window, doesn't read surrounding context

Checklist:
- [ ] Diff window is self-contained enough to convey intent.
- [ ] Hidden contradictions outside the diff window are surfaced (per mistake `claude-evaluator-step4-only-vs-codex-whole-file-grep`).

## Applicable mistakes loaded

- `claude-evaluator-step4-only-vs-codex-whole-file-grep` — read the whole file, not just the diff window. Triggered S7.
- `leader-iter2-verification-claim-without-evidence` — re-run every verify from scratch; no transitive trust. Triggered the empirical re-run.

## Applicable rules + principles

- Iron Law 7: no completion claims without fresh verification evidence → all six verifies re-run.
- Iron Law 8: every implementation change reflected in documentation — *coherently*, not just literally. Anchor for F-01.
- Iron Law 4: scope bounded by contract — checks single-file diff + plan task spec match.
- Iron Law 11: no improvement that games the tool — checks grep-count satisfaction is substantive (not e.g. mention in a comment), not nominal.

