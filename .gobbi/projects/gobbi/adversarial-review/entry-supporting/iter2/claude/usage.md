# Usage Perspective — Batch 4 iter2 (Claude)

## Stage 0 — Fix verification

- **Fix 7 (two-layer mistake-promotion)** — gobbi/SKILL.md lines 176-179 clearly separate Layer 1 (in-session staging to `sessions/.../staging/decisions/` with `mistake-candidate: true` frontmatter, promoted at Wrap-up) from Layer 2 (cross-session `gobbi mistake promote` to workspace skill storage). Closes iter1 U-U-01 "Wrap-up" overload concern by giving the reader an explicit Layer 1 vs Layer 2 mental model.
- **Fix 4 (worktree remove --force in Forbidden Operations)** — git/SKILL.md line 121 adds a row with explicit Why (silent discard) + Use Instead (clean tree + standard remove, escalate via AskUserQuestion if unclean). Closes iter1 U-U-02 partially — the stash rule's scope is now contextualized by the worktree-removal rule that sits adjacent.
- **Fix 8 (Glossary)** — gives the reader vocabulary anchors before the procedure starts. Directly addresses iter1 U-U-01 "Wrap-up overloaded" — Glossary disambiguates Loop / Sub-phase / Sole-writer.

## Inheritance from iter1

iter1 Usage verdict was PASS with 3 findings (2 Medium, 1 Low):

| Finding | iter1 severity | iter2 disposition |
|---|---|---|
| U-U-01 "Wrap-up" overloaded | Medium | **Addressed** by Fix 7 (Layer 1/2 split) + Fix 8 (Glossary). Reader can now distinguish Wrap-up Loop / Wrap-up's MEMORIZATION / Wrap-up's promotion pass. |
| U-U-02 stash rule scope (worktree-only) | Medium | **Partially addressed** by Fix 4 — adjacent context for worktree-removal forbidden ops makes the stash rule's scope clearer in situ. The stash rule itself still doesn't explicitly say "applies only to git-workflow mode" — but the Forbidden Operations table is now clearly worktree-mode-scoped. Re-asserted at Low. |
| U-U-03 "Skip evaluation" mid-session behavior | Low | **Persists** — iter2 did not target. Re-asserted at Low. |

## New findings (iter2-introduced)

None.

## Typed findings (iter2)

### U-U-02 (carryover, downgraded) — Stash rule scope still implicit

- **Type**: usability_ambiguity
- **Domain**: process
- **Disposition**: open (persisted from iter1, downgraded Medium → Low)
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: git/SKILL.md Forbidden Operations table line 118 lists `git stash inside a worktree` with "never use stash to defer work across delegation boundaries." But the Direct-commit mode (Bootstrap question 2 option 1) has no worktree at all — what does the rule mean for that mode? Fix 4 added the worktree-removal row which makes the table's worktree-mode scope obvious in context, but the stash rule still doesn't explicitly say "applies only when git-workflow mode is selected."
- **Remediation**: Add a one-line note at the top of the Forbidden Operations table: "All rows apply when git-workflow mode is selected; Direct-commit mode rows are noted explicitly." Closes the ambiguity.

### U-U-03 (carryover) — Skip-evaluation mid-session behavior unspecified

- **Type**: usability_ambiguity
- **Domain**: process
- **Disposition**: open (persisted from iter1)
- **Confidence**: 40
- **Severity**: Low
- **Evidence**: gobbi/SKILL.md setup question 1 offers "Skip evaluation" as an option but the body never describes what happens if the user later wants to enable evaluation in the same session.
- **Remediation**: Add one sentence to question 1's options: "Settings can be reconfigured per loop via the in-session reconfigure flow — see orchestration/SKILL.md."

## Low-confidence appendix

- **L-U-01 (confidence 30)** — Glossary's "Iter" row says "iter1, iter2, …" but does not link to evaluation/SKILL.md where iter naming is canonical. Cross-link would be nice but not load-bearing.
- **L-U-02 (confidence 25)** — Fix 7's Layer 2 description references `gobbi mistake promote` — assumes the reader knows this CLI command exists. A brief "(run from project root outside an active session)" is already present. Fine.

## Verdict

**PASS** — Both iter1 Mediums effectively closed. U-U-01 cleanly closed by Fix 7 + Fix 8. U-U-02 downgraded to Low after Fix 4 contextualization. One iter1 Low persists. Usage converges PASS.
