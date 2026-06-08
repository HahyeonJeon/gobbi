# Structure — Ideation Idea: Harden Auto-mode evaluation discipline

## Artifact Summary + Memory reads
(See project.md for the full Stage-0 summary + memory reads register. W/W/H clear; no Stage-0 gate.)

## Locked Frame (Stage 1)

**S1 — The new auto-mode.md evaluation section coheres — one home for the eval contract**
- [ ] The four sub-blocks (§X.1-§X.4) each own one concern, no overlap
- [ ] The section maps 1:1 to the three problems + a scannable guard

**S2 — The CRUD plan is complete and traces each edit to a file + operation**
- [ ] Each in-scope file has explicit C/U/D operations
- [ ] No orphaned "Update" with no target line

**S3 — Boring-by-default: the design reuses existing doc patterns, no novel structure**
- [ ] The guard-table pattern matches an existing project doc pattern
- [ ] Cross-reference style matches the existing Cross-references blocks

**S4 — Testability: the success criteria are checkable from the artifacts alone**
- [ ] Each of the 3 success criteria is observation-level

**S5 (adversarial) — The restructure introduces an anchor/numbering dependency that breaks downstream pointers**
- [ ] Section numbering choice does not orphan existing internal/external § references

## Per-scenario per-check results

**S1** — PASS. The §X.1 (mandatory/never-a-question) / §X.2 (never-evaluate/spawn-2) / §X.3 (auto-iterate/no-triage) / §X.4 (scannable table) decomposition is clean; each block owns one of the three problems plus a reinforcing table. No concern overlap. (verified against lines 96-113)

**S2** — PASS with note. The CRUD plan (lines 86-150) is complete per file: File 1 has C (new section) + four U entries + explicit "D — none"; File 2 has two U + "C/D — none"; File 3 has one U + "C/D — none". The "D — none" entries correctly cite `design-literal-retire-instruction-without-replacement` (nothing retired). Good discipline. (verified)

**S3** — PASS. The guard-table (line 108-113) and cross-reference rows mirror existing patterns in `auto-mode.md` (§3.3 category table, Cross-references block) and `chat-mode.md`. No novel structure; no innovation token spent. (verified)

**S4** — PASS. The three success criteria (lines 60-64) are observation-level: "Never emits an evaluate-mode question," "always spawns exactly 2," "On REVISE auto-iterates." Each is checkable by reading the resulting docs. (verified)

**S5** — REVISE (see F3). The primary placement decision (insert-as-§4 + renumber) is exactly the structural choice that orphans downstream § pointers. I confirmed `orchestration/SKILL.md:266` points at "`auto-mode.md §3 — Always-Ask codification`" and "`auto-mode.md §6 — maxIterations exhaustion`." A renumber §4→§5/§5→§6/§6→§7 would shift §6 (maxIterations) to §7, breaking the SKILL.md:266 "§6" pointer AND the internal §X.3 cross-link to "§6." The trailing-append option avoids this entirely. The design carries the breaking option as primary.

## Typed findings

### F3 — Insert-as-§4 renumber breaks the orchestration/SKILL.md cross-reference and internal § anchors
- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:** `orchestration/SKILL.md:266` (verified by grep): "[`auto-mode.md §3 — Always-Ask codification`](auto-mode.md) and [`auto-mode.md §6 — maxIterations exhaustion`](auto-mode.md)." The Idea's primary placement (line 92) renumbers §4→§5, §5→§6, §6→§7, which moves the maxIterations section from §6 to §7 and breaks this pointer plus the §X.3 internal "§6" cross-link. The Idea's §X.2/§X.3 reference "§3" and "§6"/"§1" which would all shift.
- **Why it matters:** A docs-sync drift: stale § pointers after the renumber. The trailing-append (locked) option appends as the last numbered section and renumbers nothing, so all existing §1-§6 anchors and the SKILL.md:266 pointer stay valid. The design's primary choice is the one that creates the drift.
- **Suggested direction:** Adopt trailing-append (the locked decision) as the single placement; no renumber needed; all anchors preserved.

### F4 — Idea cites the wrong line for the SKILL.md pointer (247 vs 266)
- **Type:** general
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Low
- **Evidence:** Idea lines 92, 173, 203 cite "`orchestration/SKILL.md:247`" / "SKILL.md:247" as the pointer that would break. Verified: line 247 is mid-way through the state-machine loop-phase table (a `DISCUSSION` row), NOT a pointer to auto-mode.md sections. The actual auto-mode §3/§6 pointer is at `orchestration/SKILL.md:266`.
- **Why it matters:** A Planner trusting the cited line number would edit/inspect the wrong location. Minor, but the root-cause/consistency claims should cite the correct anchor.
- **Suggested direction:** Correct the citation to line 266 (or, under trailing-append, drop the citation since no SKILL.md edit is needed).

## Low-confidence appendix
(none)

## Verdict: REVISE
