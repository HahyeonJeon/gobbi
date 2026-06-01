# Evaluation — Consistency / Preservation (CORE)

**Perspective:** consistency
**System:** Claude
**Target:** `.gobbi/projects/gobbi/skills/principles/SKILL.md` @ `a629bf8` vs `develop` (`bb967fb`)
**Method:** `git show develop:...` → `/tmp/principles_develop.md`; `git show HEAD:...` → `/tmp/principles_new.md`. Per-principle literal-string grep of every normative statement; full content-word multiset comparison; close-read of every reformatted clause. **I diffed old-vs-new — I did not trust the preservation map.**

**Verdict: PASS**

## What I verified (old body → new four fields, principle by principle)

Every high-risk normative survival confirmed PRESENT in the new file:

- **P1** — four dimensions (Execution approach / Critical considerations / User perspective / Best practices) all present in How (`:19-22`); "investigation establishes the terrain, planning fixes the path" (`:9`); 3-strike rule full text incl. "wrong architecture or wrong understanding" + "Escalate with what you tried and observed" (`:23`); Enforcement = hard gates + Ideation/Preparation/Planning roles + Research-is-sub-activity + 6-step list `Configuration / Ideation / Preparation / Planning / Execution / Wrap-up` + `orchestration` `workflow/` pointer (`:24`). Only change: clause-initial casing ("After"→"after") — cosmetic.
- **P2** — producer/evaluator separation ("creator never evaluates" + "constructed context, never author's session history") (`:49`); category split + examples `backend + frontend, feature + refactor, design + implementation` + "sequential delegations" (`:50`); discuss-findings/no-auto-apply (`:51`); ≥2 evaluators Project+Overall minimum (`:52`); modes-explicit clause (`:53`); the full spawn-topology Clarification verbatim incl. (1)/(2), "does NOT mean one spawned agent per perspective", "two agents in parallel — one per system: Claude + Codex", "Per-perspective evaluator spawning" anti-pattern name, and the `[delegation/SKILL.md § Anti-Patterns](../delegation/SKILL.md#anti-patterns)` link (`:54`). Link target byte-identical to develop.
- **P3** — all three work-kind bullets (new features / modifications / refactors) verbatim (`:73-75`); mechanism "every plan decomposes into steps…user can intervene" (`:76`).
- **P4** — all four boundary bullets (adjacent follow-ups / subagent context never inherited / prompt completeness / divergence signal-not-mandate) (`:96-99`); scope-drift mechanism "mechanically diff…against the plan items" (`:100`). Only change: "Note"→"note" casing.
- **P5** — prior-art three-question (codebase/adjacent/community) (`:122`); visual: rate-on-scale + show-before-describe (`:125`); code-shape interface-clarity checkpoint with BOTH questions (consumer-understands-without-internals / internals-change-without-breaking) + "If either answer is no…Redesign before implementing" (`:126`); mechanism prior-art search + clarity checkpoint (`:127`). Questions re-cased to (a)/(b) inline — content intact. **P5 Anti-pattern is the locked single derived sentence (`:129`) — confirmed develop P5 had ZERO anti-rationalizations list, so this is intended, not loss.**
- **P6** — take-positions ("no interesting/many-ways/false-neutrality") (`:143`); recommendation-first "(Recommended)" (`:144`); ease-is-a-signal (`:145`); NEEDS_CONTEXT mechanism + "Refuse to proceed when input is too vague" (`:146`).
- **P7** — full 5-step procedure IDENTIFY/RUN/READ/VERIFY/ONLY THEN verbatim (`:165-169`); re-verify-preconditions-at-point-of-use "state can drift" (`:170`).
- **P8** — all four discipline bullets (per-PR / no-split / outdated-is-defect / resolve-divergence) (`:192-195`); mechanism "implementation diffs lacking matching doc update rejected at review" (`:196`).
- **P9** — the "P5 governs before / P9 governs during-after" note (`:208`); user-facing-surface / internal-interfaces ("same checkpoint as Principle 5") / errors-and-failures / completion-check (`:217-220`); walk-through mechanism + "When the user does X, they see Y, they then do Z" (`:221`).
- **P10** — trigger list (both Why `:232` and How `:240`); the not-a-trigger speculations list verbatim (`:241`); when-uncertain-defer (`:242`); commit-trailer mechanism (`:243`).
- **P11** — bypass-token list `// @ts-ignore`/`// eslint-disable`/`it.skip()`/`as any`/mocked-not-tested/`.skip` (`:266`); Goodhart sentence "when a measure becomes a target, it stops being a good measure" (`:257`); move-the-property (`:265`); uncomfortable-metric (`:267`); tracking-item mechanism with bypass list (`:268`).
- **P12** — full three-questions text (What noun-example `f(x)`, Why terminate-at-real-cause + Principle-10 link, How first-step-unambiguous) (`:292-294`); write-it-out (`:295`); raise-gaps with NEEDS_CONTEXT + precise phrasing example (`:296`); no-size-exemption + front-load (`:297`); delegation rule (`:298`); mechanism with "Planning Loop's EVALUATION sub-phase (Project + Consistency perspectives)" (`:299`).
- **P13** — full 4-step procedure (SPEC 2-5 lines + memory-map/rules refs; CRUD with all four ops incl. "never a physical delete…supersede + move-on-terminal"; blast-radius with all three co-update examples incl. principle→Iron-Law-table, memory-convention, mirror-symlink + gobbi-hook-authoring exception; then-edit+verify) (`:323-335`); naming paragraph with all bad examples `task-01`/`d-1`/`tasks-07-08`/`row-5-5`/`1-3`/`t1g`/`main` + `memorization/rules.md` §1.3 (`:336`); "Delineation from Principle 8" full text incl. when/whether vs what/how-scoped (`:337`); mechanism (`:338`).
- **P14** — all four discipline bullets (state-the-thing with "refuse to transact in vagueness" example / concrete-words "a witness" / define-shorthand / headings-are-surfaces) (`:359-362`); the `discussion`-skill complementarity note (`:364`); self-check-before-sending clause (`:363`); rubric mechanism "the rubric the Principle 1-13 clarity rewrite…is judged against" (`:364`). Old single Mechanism paragraph split into *Enforcement:* + *Cross-reference:* — every clause preserved verbatim.

## Content-word multiset check
Stripped both files to lowercase word multisets. Every content word in develop appears in the new file at EQUAL OR HIGHER count (e.g. idiosyncratic 1→2, preconditions 1→3, recommendation 1→3). Zero words lost. Higher counts are the intended What-list summary keys duplicating How sub-labels — the documented non-loss restructure, not bloat that changes meaning.

## Findings
None. No normative statement, procedure, enforcement clause, cross-reference, or excuse-list item was dropped or meaning-changed. The only textual deltas are (a) clause-initial lowercasing when standalone sentences became `*sub-label:* clause` list items, and (b) reflow of two interface-clarity questions into inline (a)/(b) — neither alters meaning.

## Verdict: PASS
