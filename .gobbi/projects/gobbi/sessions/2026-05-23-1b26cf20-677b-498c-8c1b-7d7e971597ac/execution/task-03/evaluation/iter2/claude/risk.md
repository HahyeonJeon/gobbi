## Artifact Summary

Iter2 risk surface: documentation-only fix that operationalizes the AI-provenance audit trail in the promote-now path. The risk concern from iter1 (R1) was that a manager following the literal command would create commits without the required provenance trailer — an audit-trail risk for every future generated-skill promotion.

## Memory reads

- Artifact: `preparation/SKILL.md` lines 64-82
- Iter1 codex `risk.md`: REVISE on Finding R1 (convergent)
- `git/conventions.md:110-138` (trailer requirement)
- Empirical scratch-repo test (see usage.md Memory reads)
- Mistake `codex-eval-session-write-path-nested-in-worktree.md` — write target audit (output dir under main-tree `.gobbi/projects/gobbi/sessions/...`, NOT under the worktree's nested sessions tree)

## Locked Frame (Stage 1)

Scenario: Provenance/audit risk is closed (inherits iter1 R1).
- Check: the documented command, executed literally, produces a commit with `AI-Provenance-Record:` as a body trailer.
- Check: the verification primitive can detect a missed trailer (so a future manager who somehow drops it isn't silent).

Scenario: The heredoc form itself is not a new risk surface.
- Check: single-quoted heredoc prevents shell variable expansion inside the body (the placeholders are doc-time, intentional).
- Check: balanced quotes — `commit -m "$(cat <<'EOF' ... EOF\n)"` — no obvious shell-injection / quote-mismatch failure mode.
- Check: no `--no-verify` / `--force` / safety bypass introduced in the new command.

Scenario: Rollback behavior unchanged.
- Check: line 82 still uses `git -C "$worktreePath" rm <copied-paths>`, still explicitly rejects `git checkout`, still names AskUserQuestion.

Scenario: A consumer running the documented command in a non-worktree (main-tree) session could accidentally apply it (adversarial).
- Check: the header "Commit-on-branch (worktree sessions only)" still scopes the procedure.
- Check: line 80 still says "This commit lands on the worktree branch and is absorbed into the PR at merge."

Scenario: Evaluator output written to the correct session path (audit per mistake).
- Check: iter2 evaluator output is written to `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/execution/task-03/evaluation/iter2/claude/` under the **main-tree** `.gobbi/projects/gobbi/sessions/` (NOT under the worktree's nested sessions).

Scenario: Privacy / license / security surface.
- not-applicable: no PII, no third-party code, no dependency, no auth/exec surface introduced. The provenance trailer URL form contains a session-id which is a non-secret workflow identifier.

## Per-scenario per-check results

Audit trail closed:
- yes: empirical scratch run shows `AI-Provenance-Record:` as a body trailer (Confidence 100, tool-verified).
- yes: line 78 documents `git -C "$worktreePath" log -1 --format=%B` as the verification primitive — a future manager can detect a missed trailer before proceeding.

Heredoc risk surface:
- yes: heredoc delimiter is `<<'EOF'` (single-quoted) — prevents shell expansion of `$worktreePath` or anything else inside the body. The placeholders `{slug}` / `{session-id}` / `{n}` are doc-time substitutions, not shell-time, so single-quoting is the right call.
- yes: `commit -m "$(cat <<'EOF' ... EOF\n)"` — outer double quotes balance, command substitution `$(...)` closes correctly, heredoc terminator is on its own line.
- yes: no `--no-verify`, `--force`, or `--skip-tests` introduced.

Rollback unchanged:
- yes: line 82 reads "the manager MUST run `git -C "$worktreePath" rm <copied-paths>` ... (not `git checkout` ...), then surface the failure to the user via AskUserQuestion (re-attempt or abort) before retrying" — byte-identical to iter1.

Adversarial non-worktree application:
- yes: section header "Commit-on-branch (worktree sessions only)" at line 64 still scopes the procedure.
- yes: line 80 still names the worktree branch as the landing point.

Evaluator output path audit:
- yes: this evaluator's writes target `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/execution/task-03/evaluation/iter2/claude/` — under the main-tree `.gobbi/`, not the worktree's nested sessions directory.

## Typed findings

### Inherited from iter1

Finding R1 (iter1 codex `risk.md`): promoted-skill commits can lose the required audit trailer if the displayed command is followed literally.
- Type: `assumption_risk`
- Domain: `process`
- Confidence: 75
- Severity: High
- Disposition: **addressed**
- Resolution evidence: same as U1/C1 — the heredoc form, executed literally, produces a commit body containing the trailer (scratch-repo verified + dogfooded in commit `012d9ec`'s own body). The audit assumption ("the manager will produce a trailer-bearing commit") is now structurally satisfied by the doc, not contingent on the manager inferring a body mechanism.

### New iter2 findings

(none)

## Verdict: PASS

The provenance/audit risk is closed. The heredoc itself introduces no new risk surface; rollback is unchanged; section scoping (worktree-only) is preserved.

## Low-confidence appendix

None.
