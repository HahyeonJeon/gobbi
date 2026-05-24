## Artifact Summary

Iter2 changes the documented commit command so the next consumer — a manager (or proxied executor) executing the promote-now path — produces a commit whose body actually contains `AI-Provenance-Record:`. This is the central iter1 REVISE finding (U1).

## Memory reads

- Artifact: `preparation/SKILL.md` lines 64-82
- Iter1 codex `usage.md`: REVISE on Finding U1 (convergent)
- Phase child doc § Usage
- Git conventions: `git/conventions.md:110-138`
- Empirical scratch test: `/tmp/gobbi-trailer-test` — ran the documented heredoc literally; `git log -1 --format=%B | grep -c "^AI-Provenance-Record:"` returned 1
- Iter2 fix commit body: `git log -1 --format=%B 012d9ec` — last line is `AI-Provenance-Record: gobbi://session/1b26cf20-677b-498c-8c1b-7d7e971597ac/task/execution-task-03-iter2` (same heredoc form used dogfood-style)

## Locked Frame (Stage 1)

Scenario: A future manager can copy the heredoc literally and produce a commit with the trailer (inherits Codex iter1 U1).
- Check: the heredoc form includes either a second `-m` or an equally concrete body-writing mechanism that puts `AI-Provenance-Record:` into the commit body.
- Check: empirical execution of the documented command in a scratch repo produces `git log -1 --format=%B` output containing `AI-Provenance-Record:` as a standalone line.
- Check: the form is shell-correct (single-quoted heredoc, command substitution, balanced quotes).

Scenario: The documented verification primitive surfaces failure.
- Check: line 78's `git -C "$worktreePath" log -1 --format=%B` shows the trailer text on success, no trailer on failure.
- Check: prose names the verification ("Verify the trailer landed with...") at the right moment ("before proceeding").

Scenario: A consumer could still produce a commit without the trailer (adversarial).
- Check: if a consumer types only the subject `-m` (forgetting the heredoc), is the doc structured so the omission is obvious? (i.e., is there still a single-`-m` snippet anywhere in the section that could be copied by mistake?)
- Check: iter1's prose-only trailer sentence is fully removed.

Scenario: Iter1 backlog item F-USAGE-1 (symlink-creation procedure missing from broader procedure).
- Per iter2 brief: explicitly out-of-scope.

Scenario: Accessibility / I18n coverage.
- not-applicable: agent-facing Markdown, no UI surface, no user-facing localizable strings. The fenced code block + numbered list remain scan-friendly.

## Per-scenario per-check results

Inherited U1 (heredoc operationalizes the trailer):
- yes: heredoc body (lines 70-75) contains `AI-Provenance-Record: gobbi://session/{session-id}/task/preparation-promote-now-iter{n}` as a standalone line after a blank line — the canonical trailer placement git recognizes.
- yes: empirical scratch-repo execution (cd /tmp/gobbi-trailer-test, `git init`, single staged file, ran the documented heredoc verbatim with placeholders filled) — `git log -1 --format=%B | grep -c "^AI-Provenance-Record:"` returned `1`. Confidence: 100 (tool-verified).
- yes: dogfooding evidence — commit `012d9ec` itself was created with the same heredoc form and `git log -1 --format=%B 012d9ec` shows the trailer as the last line of the body.
- yes: form is shell-correct — `"$(cat <<'EOF' ... EOF\n)"`; single-quoted heredoc prevents `$worktreePath`-style expansion inside the body (correct — the placeholders are doc-time, not shell-time); closing `)"` balances `commit -m "$(...)"`.

Verification primitive:
- yes: `git log -1 --format=%B` is the standard idiom for inspecting just the most recent commit's body; on success it shows the subject + trailer, on failure (e.g., if a consumer used the iter1 wrong form) the trailer would be absent.
- yes: placement is logical — line 78 says "Verify ... before proceeding".

Adversarial scan for residual single-`-m` snippet:
- yes: `grep -nE 'git .* commit -m' "$WORKTREE/.gobbi/projects/gobbi/skills/preparation/SKILL.md"` returns only the heredoc-bearing line — no orphan single-`-m` example remains.
- yes: iter1's prose-trailer sentence ("with the required trailer in the commit body: AI-Provenance-Record: ...") is fully replaced.

F-USAGE-1:
- deferred per iter2 brief.

## Typed findings

### Inherited from iter1

Finding U1 (iter1 codex `usage.md`): commit command can be copied without writing the trailer body.
- Type: `design_flaw`
- Domain: `docs-sync`
- Confidence: 100
- Severity: High
- Disposition: **addressed**
- Resolution evidence: iter2 commit `012d9ec` rewrote the documented commit command as a `git commit -m "$(cat <<'EOF' ... EOF\n)"` heredoc that places `AI-Provenance-Record:` inside the body after a blank line. Empirical scratch-test execution produced a commit whose `git log -1 --format=%B` output contains `AI-Provenance-Record:` as a standalone trailer line. Commit `012d9ec` itself uses the same heredoc form and its body contains the trailer.

### Inherited from Claude iter1 (reported inline)

Finding F-USAGE-1: symlink-creation procedure missing from the broader generate-now / promote-now procedure.
- Type: `checklist_gap`
- Domain: `process`
- Confidence: 50
- Severity: Medium
- Disposition: **deferred** (per iter2 brief — explicitly out of scope)

### New iter2 findings

(none)

## Verdict: PASS

The convergent iter1 REVISE finding is addressed with tool-verified evidence; no new Usage findings surfaced.

## Low-confidence appendix

None.
