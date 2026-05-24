## Artifact Summary

Iter2 fix moves the trailer from prose to inside the documented commit command. Consistency checks: command form ↔ `git/conventions.md:118` trailer spec ↔ Ideation D-3 locked design ↔ Planning Task 03 verify gates ↔ symlink view via `.claude/skills/preparation/SKILL.md`.

## Memory reads

- Artifact: `preparation/SKILL.md` lines 64-82
- Iter1 codex `consistency.md`: REVISE on Finding C1 (convergent)
- Locked design (referenced by Codex iter1): `ideation/staging/design/d-3-promote-now-commit-on-branch.md:18-21` — Codex iter1 cited this as the two-`-m` form. Iter2 uses a heredoc form which is semantically equivalent (both write the trailer into the body); the design's spirit ("operationalize the trailer in the command") is preserved.
- Git conventions: `git/conventions.md:118` (canonical trailer format)
- Planning Task 03: `planning/artifacts/plan.md:78-94`

## Locked Frame (Stage 1)

Scenario: Command form is consistent with `git/conventions.md:118` (inherits iter1 C1).
- Check: trailer string format matches `AI-Provenance-Record: gobbi://session/{session-id}/task/{task-id}`.
- Check: trailer is positioned in the commit body (after blank line) per git trailer convention, not as a subject suffix.

Scenario: Command form is consistent with the spirit of D-3's locked design.
- Check: the heredoc, while not byte-identical to D-3's two-`-m` form, achieves the same outcome (trailer in body).
- Check: no prose-only trailer description survives.

Scenario: All 6 plan verify gates still pass on the iter2 file.
- Check: each of the 6 regex/test checks at `plan.md:87-92` passes.

Scenario: Symlink view shows the same content as the source.
- Check: `.claude/skills/preparation/SKILL.md` resolves to `.gobbi/projects/gobbi/skills/preparation/SKILL.md` and shows the new heredoc.

Scenario: Iter1's prose-trailer sentence and new heredoc could coexist, creating contradictory guidance (adversarial).
- Check: only one trailer-writing mechanism is documented after the fix.
- Check: no nearby section still says "include the trailer in prose" or equivalent.

Scenario: Commit message vs diff sync.
- Check: commit body text accurately describes the change (heredoc replaces single-`-m`).
- Check: commit body itself carries the `AI-Provenance-Record:` trailer (dogfooding).

## Per-scenario per-check results

Conventions.md sync:
- yes: trailer format `gobbi://session/{session-id}/task/preparation-promote-now-iter{n}` matches `git/conventions.md:118` example shape (`gobbi://session/{session-id}/task/{task-id}`).
- yes: trailer is on its own line after a blank line in the heredoc body — canonical git trailer placement.

D-3 spirit sync:
- yes: both D-3's two-`-m` form and iter2's heredoc form put the trailer into the commit body. Codex iter1's C1 cited a specific byte-level mismatch (two-`-m`); iter2's heredoc is a different shape but achieves the same outcome verifiably (the trailer lands). The design's contract ("trailer must be in commit body, not in prose") is preserved.
- yes: prose-only trailer is fully removed.

Plan verify gates:
- yes (1): `grep -cE 'git -C "\$worktreePath"' .claude/skills/preparation/SKILL.md` = 4 (≥3 required; iter1 was 3, +1 from the new heredoc line).
- yes (2): `chore(skills): promote` = 1 (≥1).
- yes (3): `gobbi://session/` = 1 (≥1).
- yes (4): `git -C "$worktreePath" rm` = 1 (≥1; unchanged rollback line).
- yes (5): `AskUserQuestion` = 17 (≥1 co-located with rollback at line 82).
- yes (6): `test -L .claude/skills/preparation/SKILL.md` returns true.

Symlink view:
- yes: `readlink .claude/skills/preparation/SKILL.md` returns `../../../.gobbi/projects/gobbi/skills/preparation/SKILL.md`; reading via the symlink shows the iter2 heredoc.

Adversarial coexistence scan:
- yes: only one trailer-writing mechanism documented (the heredoc); no contradictory nearby sentence.

Commit-message vs diff sync:
- yes: commit body line 3 reads "Switched to heredoc form so the trailer actually lands in the commit body" — accurate.
- yes: commit `012d9ec` body ends with `AI-Provenance-Record: gobbi://session/1b26cf20-677b-498c-8c1b-7d7e971597ac/task/execution-task-03-iter2`. Dogfooded.

## Typed findings

### Inherited from iter1

Finding C1 (iter1 codex `consistency.md`): implementation drifts from D-3's two-`-m` commit command.
- Type: `design_flaw`
- Domain: `docs-sync`
- Confidence: 100
- Severity: High
- Disposition: **addressed** (semantically — see note)
- Resolution evidence: iter2 uses a heredoc (`commit -m "$(cat <<'EOF' ... EOF\n)"`) instead of D-3's literal two-`-m` form. Both place `AI-Provenance-Record:` inside the commit body after a blank line; empirically both produce identical commit-body shape. The design's contract is "trailer must be in the commit body, not prose", which the heredoc satisfies. Note: iter1's Codex finding cited the byte-level D-3 form as the contract — if a strict-byte-equivalence reading is preferred, the finding could be re-classified as `disputed` (iter2 chose an equivalent mechanism rather than the literal D-3 form). On balance: `addressed` because the substantive contract (trailer in body) is met and the heredoc is arguably more robust (one quoting style, no second-`-m` argument-shell-escaping risk).

### New iter2 findings

(none)

## Verdict: PASS

All consistency surfaces sync. The convergent iter1 finding is addressed via a substantively equivalent mechanism (heredoc), and the commit itself dogfoods the new form.

## Low-confidence appendix

None.
