# Usage — Ideation Idea: Harden Auto-mode evaluation discipline

## Artifact Summary + Memory reads
(See project.md for Stage-0 summary + memory reads.)

## Locked Frame (Stage 1)

**S1 — The Planner can produce a task list without going back to the user**
- [ ] Each design edit is specific enough to start (target file + section + operation + sketch text)
- [ ] No "we'll decide later" on an in-scope decision

**S2 — The Executor knows exactly which file/section/line to change**
- [ ] Canonical edit paths are named (symlink discipline)
- [ ] Each U cites the section/line being updated

**S3 — A future maintainer at 3am understands what was hardened and why**
- [ ] The 3 problems → 3 fixes mapping is explicit
- [ ] Failure modes the docs now prevent are named

**S4 (adversarial) — A consumer forms the wrong mental model and executes the wrong placement**
- [ ] The doc's stated design matches the locked decision the consumer was told to follow

## Per-scenario per-check results

**S1** — REVISE (see F6). Most edits are Planner-ready, BUT the single most consequential decision — section placement — is left as an open "[Always-Ask: Design/structure decision]" in the implementation checklist (line 197), contradicting the brief's statement that placement is already LOCKED. A Planner reading this doc would (a) think the decision is still open, then (b) potentially pick the §4-insert the design body recommends as primary. This is the "the Planner will ask if unclear" anti-pattern: the artifact's job was to carry the locked decision, and it instead re-opens it.

**S2** — PASS. Canonical edit paths are correct and well-handled: the Canonical-home verification (lines 69-79) correctly establishes `.claude/CLAUDE.md` is a real file (I verified: regular file, `find` returns only `./.claude/CLAUDE.md`) and the two skill files are mirror symlinks (verified: both are symlinks into `.gobbi/.../skills/`). The "edit canonical `.gobbi` paths, do not double-edit" discipline matches `skills-mirror-symlinks-not-copies`. (verified)

**S3** — PASS. The 3-problem → 3-fix → §X mapping is explicit (lines 154-163, Decisions Log D1-D6). A maintainer can reconstruct intent. (verified)

**S4** — FAIL (see F6). The doc's primary stated design (§4-insert) does not match the locked decision (trailing-append) the consumer was told to follow. A consumer trusting the design body forms the wrong model.

## Typed findings

### F6 — The locked placement is presented to the consumer as an open decision (Planner will mis-execute)
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** Implementation checklist item 1 (line 197): "Decide section placement in `auto-mode.md`: **trailing-append as new §7** (recommended ...) vs insert-as-§4 (forces out-of-scope edit — surface to user). [Always-Ask: Design/structure decision]." D5 (line 214): "RECOMMENDATION, user to confirm at Planning." The brief states this was already resolved (trailing-append locked). The artifact hands the Planner an open decision plus a primary design body (line 92) that picks the rejected option.
- **Why it matters:** Usage is about consumability. The downstream consumer (Planner) is the audience; the artifact's purpose is to carry decisions forward. Re-opening a locked decision and leading with the rejected option is exactly the failure that produces a wrong-placement implementation and the out-of-scope `orchestration/SKILL.md` edit the design itself warns about (line 173). Same root cause as project.md F1; surfaced here from the consumer's POV with distinct remediation impact.
- **Suggested direction:** Rewrite the design body + checklist + D5 to state trailing-append as the single, resolved placement; drop the "[Always-Ask]" tag.

## Low-confidence appendix
(none)

## Verdict: REVISE
