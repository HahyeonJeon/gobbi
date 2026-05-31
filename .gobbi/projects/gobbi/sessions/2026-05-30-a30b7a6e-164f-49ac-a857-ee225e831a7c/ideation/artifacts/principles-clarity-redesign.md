---
name: principles-clarity-redesign
description: Ideation design — new Principle 14 (clear/direct/literal instruction-doc language) plus a surgical clarity-rewrite audit of Principles 1-13 and the full blast-radius CRUD plan.
type: design
scope: project
feature: null
status: active
created: 2026-05-30
session: a30b7a6e-164f-49ac-a857-ee225e831a7c
tags: [principles, instruction-clarity, anti-abstraction, audit, blast-radius]
---

# Principles Clarity Redesign — Principle 14 + Surgical Rewrite Audit of P1-13

This is the Ideation design artifact for two coupled changes to the `principles` skill:

1. A **new Principle 14** that mandates clear, direct, literal language in instruction documents.
2. A **surgical clarity rewrite** of Principles 1-13 — fixing only the expressions whose metaphor or abstraction obscures the instruction, keeping (with justification) figurative shorthand the body already defines.

The artifact is design only. It hands the executor exact current strings, exact proposed strings, a file/line CRUD plan, and the open decisions the user must settle first. No principle is renumbered or reordered; no behavioral meaning changes.

---

## 1. Frame — the problem, stated literally

The `principles` skill is the behavioral floor every agent loads at session start. Its job is to tell an agent exactly what to do. When a principle states its instruction through a metaphor instead of the action itself, the agent has to *decode* the metaphor before it can act — and a wrong decode produces wrong execution. The failure chain is: abstract wording in an instruction doc → agent infers the intended action → infers wrong → does the wrong thing, while believing it followed the principle.

Concrete examples in the current file:
- The title **"Specificity Is the Only Currency"** (P6) and its Iron Law **"REFUSE TO TRANSACT IN VAGUENESS"** name the instruction through a money metaphor. The actual instruction is "refine a vague requirement until it is concrete enough to act on, then act." A reader has to translate "transact in vagueness" into "act on under-specified input."
- The title **"Witness-bound Work"** (P10) packs the whole instruction into a coined adjective. The body *does* define "witness" precisely, but the title alone is opaque to a first-time reader.
- The body line **"Comfort is a warning sign"** (P6) states a heuristic as an aphorism; the literal instruction ("if the discussion feels easy you probably have not pushed the requirement hard enough") is one clause longer and unambiguous.

The fix has two locked parameters from the user:
- **Calibration = SURGICAL.** Rewrite only what obscures. Do not flatten every vivid phrase. A metaphor the body already defines precisely may stay — but each KEEP must be justified.
- **Reach of Principle 14 = INSTRUCTION DOCUMENTS ONLY** — principles, skills, `agents/*.md`, and rules. It does NOT govern user-facing chat or code comments.

Self-consistency requirement: Principle 14 governs the principles file itself, so the P1-13 rewrite is the first thing P14 is measured against.

---

## 2. Research — prior art and cross-reference safety

### 2.1 In-codebase prior art for "clear and direct"

The `discussion` skill (`skills/discussion/SKILL.md`) already encodes a clear-language standard for a *different* surface (user-facing chat): its **Anti-Sycophancy → Banned phrases** table (lines 184-194) and its **"Banned in question text → AI vocabulary"** list (line 119: `delve`, `crucial`, `robust`, `comprehensive`, `nuanced`, `multifaceted`, `leverages`, `streamlines`) forbid empty, compression-signaling words and demand a stated position over hedging. This is the right tonal sibling for P14, but P14's surface (instruction docs) and failure mode (misexecution from a misread instruction) are distinct, so P14 references the spirit without importing the chat-specific banned-word list. P14's discipline is "state the action literally," not "avoid these eight words."

The `memorization/rules.md` §1.3 / §4 "name the subject, not its position" and "zero-context reader" standard is the structural cousin: it demands that a memory doc be legible to a reader who lacks the originating context. P14 is the instruction-doc analogue — legible to an agent who lacks the author's mental decode of the metaphor.

### 2.2 Cross-reference safety — the REAL co-update targets (grep-verified)

Grep across all live docs (`.claude`, `skills/`, `agents/`, `rules/`, project-memory `backlogs/`), excluding `principles/SKILL.md` itself and excluding frozen `sessions/` + `archive/`. Two live-doc inbound references to a metaphor TITLE exist — both must be co-updated if the matching title is rewritten:

| Inbound reference | File:line | Exact current text | Type | Co-update needed if… |
|---|---|---|---|---|
| P6 title | `skills/orchestration/SKILL.md:44` | `- Eliciting the user's actual intent (Principle 6 — Specificity Is the Only Currency).` | LIVE instruction doc | P6 title is rewritten (D1) → YES |
| P10 title + concept | `backlogs/hooks-domain-mistakes-watchlist.md:29` | `Mistakes are witness-bound (per Principle 10 — "Witness-bound Work"). … would be Principle 10 violation …` | LIVE project-memory backlog | P10 title is rewritten (D2) → YES (see note) |

Other observations from the same scan:
- **`skills/orchestration/workflow/execution.md:37`** paraphrases several titles descriptively ("Think Before Acting, Bottom-Up Construction, Scope = Contract, Fresh Verification") — all of these are KEEP titles, and the line uses paraphrase not verbatim title quoting, so **no co-update** is needed there regardless.
- **Principles are referenced by NUMBER** ("Principle 6", "P9", etc.) in `.claude/CLAUDE.md`, `orchestration/*`, `discussion/SKILL.md`, and the `agents/*.md` specs. Because we are **not renumbering**, every numeric citation stays valid — **no co-update for numbers.**
- **Iron Law one-liners are mirrored only in `.claude/CLAUDE.md`** (the Iron Law table, rows 1-13). No other live doc copies an Iron Law one-liner verbatim. The only co-update target for an Iron Law wording change is that table.
- **"Metrics Are Signals" (P11 title) has zero inbound references** anywhere — rewriting it is free of external co-updates.

Net blast radius: **four files** — `principles/SKILL.md`, `.claude/CLAUDE.md`, `orchestration/SKILL.md` (only if P6 title changes), and `backlogs/hooks-domain-mistakes-watchlist.md` (only if P10 title changes) — plus the count/cross-ref strings inside the first two.

> **Correction note (P13 self-consistency).** An earlier pass of this audit asserted "titles are referenced nowhere outside the principles file." That was wrong — the grep above found two inbound title citations. The lesson maps directly onto the existing mistake `manager-mispec-grep-c` (grep counts must be inspected, not assumed) and is exactly the blast-radius miss P13's Iron Law guards against. The CRUD plan in §6 reflects the corrected, verified targets.

### 2.3 Special handling — the `backlogs/` reference (D7)

`backlogs/hooks-domain-mistakes-watchlist.md:29` is **project memory**, not an instruction doc, so P14's own scope does not reach it. But P13 (blast radius) and basic correctness DO require keeping its cross-reference accurate: if P10's title changes from "Witness-bound Work" to something else, that quoted title becomes stale. Two sub-options exist — see D7. This is the one place where the instruction-doc scope of P14 and the memory-correctness duty of P13 must be reconciled explicitly.

### 2.4 Current file state (audited live, not assumed)

Task 01 of this session already removed the `## Iron Law Index` quick-reference table from `principles/SKILL.md` and updated P13's blast-radius example from "three places" to "two places (`principles/SKILL.md` body + the CLAUDE.md Iron Law table)". Confirmed by grep: no `## Iron Law Index` heading remains, and the P13 example reads "two places, one change". **This audit does not re-add the index, and leaves the P13 blast-radius example as Task 01 set it.** Line numbers in §6 reference the current 384-line file (post-Task-01), not the 406-line pre-Task-01 file.

---

## 3. The new Principle 14 (full draft, existing format)

Append AFTER Principle 13's closing `---` and BEFORE the closing paragraph ("This skill is the single source of behavioral discipline…").

```markdown
## Principle 14 — Write Instructions in Plain, Literal Language

**Iron Law:** STATE THE REQUIRED ACTION LITERALLY; DO NOT HIDE IT BEHIND A METAPHOR.

**Why:** An instruction document — a principle, a skill, an `agents/*.md` spec, a rule — exists to tell an agent exactly what to do. When the instruction is written as a metaphor or an abstraction instead of the action itself, the agent must first decode the figure of speech, and a wrong decode produces wrong execution: the agent does something other than what the instruction required while believing it complied. Plain literal wording removes the decode step, so the instruction and the action are the same thing. This principle governs **instruction documents only** — principles, skills, agent specs, and rules. It does NOT govern user-facing chat (the `discussion` skill's anti-sycophancy voice covers that surface) or code comments.

**Discipline — how to write a clear instruction:**
- **State the action, not a figure of speech for it.** Write "refine the requirement until it is concrete enough to act on" — not "refuse to transact in vagueness." The literal clause is the instruction; the metaphor is a translation the reader should not have to perform.
- **Prefer concrete nouns and verbs over figurative ones.** "A real trigger — a session, a logged error, a user request, a mistake entry, or a tracked follow-up" beats "a witness" unless the shorthand is defined.
- **Define any unavoidable shorthand in-body on first use.** A coined term is allowed only when the same passage states, in plain words, exactly what it means. After it is defined, the shorthand may be reused.
- **A section title is an instruction surface too.** The `## Principle N — <title>` line is the first thing a reader sees and is read alone in summaries and indexes; it must name the principle's subject directly, not gesture at it metaphorically.

**Anti-rationalizations:**
- "The metaphor is punchier." (Punch is not the job; an unambiguous instruction is. A reader who has to decode the punch can decode it wrong.)
- "Everyone knows what this means." (If it were truly unambiguous, the literal phrasing would cost nothing; the wish to keep the figure is the warning sign.)
- "It's just a title — the body explains it." (The title is read first and on its own in summaries and indexes; an opaque title misdirects before the body is reached.)
- "Removing the metaphor makes it dry." (Clear is not dry; a concrete verb is more vivid than an abstraction, not less.)

**Mechanism:** Instruction-document language is checked at Planning and Execution EVALUATION (Project + Consistency perspectives). A principle, skill, agent spec, or rule that ships an instruction encoded as an undefined metaphor or abstraction is flagged for rewrite. This principle is the rubric the P1-13 clarity rewrite — and every future instruction-doc edit, including this principle's own wording — is judged against.
```

**Title and Iron Law wording: see Decision D5 (two candidates each).**

---

## 4. Surgical rewrite audit — Principles 1-13

Legend: **Verdict** is REWRITE (metaphor/abstraction obscures the instruction) or KEEP-justified (figurative but the body defines it precisely, or it is already literal). Current strings are verbatim from the worktree `principles/SKILL.md` (post-Task-01). Proposed strings are drop-in replacements.

### 4.1 Titles

| Principle | Current title | Verdict | Proposed direct rewrite | Note |
|---|---|---|---|---|
| 1 | `Think Before Acting` | KEEP-justified | — | Literal imperative; no metaphor. |
| 2 | `Single Perspective per Agent` | KEEP-justified | — | Literal. |
| 3 | `Bottom-Up Construction with the User in the Loop` | KEEP-justified | — | "Bottom-up" is a standard, body-defined engineering term, not an obscuring metaphor. |
| 4 | `Scope Is a Contract; the User Is the Client` | KEEP-justified | — | "Contract"/"client" are defined in the Why and ARE the literal frame (scope = agreement). Borderline — see D4. |
| 5 | `Reference-First Design (visual and code-shape)` | KEEP-justified | — | Literal. |
| 6 | `Specificity Is the Only Currency` | **REWRITE** | `Refine Vague Requirements Before Acting` | "Currency" is a pure metaphor; the instruction is refine-then-act. (D1) |
| 7 | `Verification Is a Hard Gate` | KEEP-justified | — | "Hard gate" is body-defined and literal enough (a mandatory checkpoint). |
| 8 | `Documentation Is a Deliverable, Not a Side Effect` | KEEP-justified | — | Literal contrast; states the instruction (treat docs as a deliverable). |
| 9 | `Design and Implement from the User's Point of View` | KEEP-justified | — | Literal. |
| 10 | `Witness-bound Work` | **REWRITE** | `Every Change Needs a Real Trigger` | Coined adjective opaque in the title; "real trigger" is the body's own plain gloss of "witness". (D2) |
| 11 | `Metrics Are Signals, Not Targets` | **REWRITE** | `Improve the Property, Not the Metric` | Title states a maxim, not the action; the action is "move the underlying property, not the number." (D2) |
| 12 | `Every Task Has Clear What / Why / How` | KEEP-justified | — | Literal. |
| 13 | `Spec + CRUD-Think for Documentation Work` | KEEP-justified | — | "CRUD" is a standard term, defined in the body; "CRUD-Think" is borderline shorthand — see D3. |

### 4.2 Iron Laws (ALL-CAPS one-liners)

| Principle | Current Iron Law | Verdict | Proposed direct rewrite | Note |
|---|---|---|---|---|
| 1 | `NO ACTION WITHOUT THINKING IT THROUGH FIRST.` | KEEP-justified | — | Literal. |
| 2 | `ONE AGENT, ONE PERSPECTIVE, ONE CATEGORY.` | KEEP-justified | — | Literal. |
| 3 | `BUILD FROM THE BASE UP, ONE STEP AT A TIME, WITH THE USER IN THE LOOP.` | KEEP-justified | — | Literal. |
| 4 | `SCOPE IS BOUNDED BY THE CONTRACT WITH THE USER.` | KEEP-justified | — | "Contract" = the agreed scope, stated literally in the same line. |
| 5 | `NO DESIGN WITHOUT PRIOR ART AND USER ALIGNMENT.` | KEEP-justified | — | Literal. |
| 6 | `REFUSE TO TRANSACT IN VAGUENESS.` | **REWRITE** | `DO NOT ACT ON A VAGUE REQUIREMENT — MAKE IT CONCRETE FIRST.` | "Transact" is the money metaphor; the rewrite states the action. |
| 7 | `NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.` | KEEP-justified | — | Literal. |
| 8 | `EVERY IMPLEMENTATION CHANGE MUST BE REFLECTED IN DOCUMENTATION.` | KEEP-justified | — | Literal. |
| 9 | `EVERY DESIGN AND IMPLEMENTATION DECISION IS JUDGED FROM THE USER'S POINT OF VIEW.` | KEEP-justified | — | Literal. |
| 10 | `NO CHANGE WITHOUT A REAL MOTIVATOR.` | **REWRITE** | `NO CHANGE WITHOUT A REAL TRIGGER.` | "Motivator" is abstract and drifts from the body's term; "trigger" matches the body's "concrete trigger" and the proposed title. One-word change preserves meaning. (D2) |
| 11 | `NO IMPROVEMENT THAT GAMES THE TOOL.` | KEEP-justified | — | "Games the tool" is body-defined (changing input so the metric improves while the property does not); idiomatic and unambiguous. Borderline — see D2. |
| 12 | `NO TASK STARTS WITHOUT CLEAR WHAT / WHY / HOW.` | KEEP-justified | — | Literal. |
| 13 | `NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN.` | KEEP-justified | — | Literal; "CRUD plan" defined in body. |

### 4.3 Body prose (Why / Discipline / Anti-rationalizations / Mechanism)

Only obscuring expressions are listed; unlisted body lines are already literal and stay unchanged.

| Principle | Layer | Current text | Verdict | Proposed direct rewrite | Note |
|---|---|---|---|---|---|
| 1 | body (Why) | `both activities produce confident misdirection.` | KEEP-justified | — | "Confident misdirection" is a precise compound (acting wrongly while sure you are right); not obscuring. |
| 6 | body (Discipline) | `Comfort is a warning sign. If the conversation feels easy, you probably have not pushed hard enough.` | **REWRITE** | `If the discussion feels easy, you probably have not pushed the requirement to be concrete enough — treat that ease as a signal to push harder, not as agreement.` | Replaces the aphorism "Comfort is a warning sign" with the literal heuristic. |
| 6 | body (Discipline) | `Take positions, not hedges. No "interesting," "many ways to think about this," or false neutrality.` | KEEP-justified | — | Already literal; aligns with `discussion` anti-sycophancy. |
| 10 | body (Why) | `Every change must be tied to a witness: a real session, a logged error, a user request, a documented mistake, or a tracked follow-up. Without a witness, the change is speculation — it does not ship.` | KEEP-justified | — | "Witness" IS defined inline here (the colon-list IS the definition). Under SURGICAL calibration this is a legitimate KEEP — but only because the body defines it. The title (4.1) is rewritten because the title carries no definition. (D2) |
| 10 | body (Discipline / Anti-rat. / Mechanism) | repeated use of `witness` after the in-body definition | KEEP-justified | — | Reuse-after-definition is exactly what P14 permits. |
| 11 | body (Why) | `This is Goodhart's law made operational: when a measure becomes a target, it stops being a good measure.` | KEEP-justified | — | Names the law AND states it literally in the same sentence — self-defining. |
| 11 | body (Why) | `the metric is a *signal* of an underlying quality ... not the target itself` | KEEP-justified | — | Already the literal statement of the instruction. |
| 13 | body | `a *change with a blast radius*` | KEEP-justified | — | "Blast radius" is defined two clauses later ("every file the same change must co-touch"); standard term, self-defining. |

**Summary of verdicts:** REWRITE — titles: 3 (P6, P10, P11); Iron Laws: 2 (P6, P10); body lines: 1 (P6 "Comfort is a warning sign"). KEEP-justified: everything else, including P4 (contract/client), P11 (Goodhart / games-the-tool), P13 (CRUD / blast-radius), and P10's in-body "witness" — each justified above by an in-body definition or standard-term status.

---

## 5. Intro / closing co-updates inside `principles/SKILL.md`

| Location | Current text | Proposed | Reason |
|---|---|---|---|
| Line 9 (intro) | `Thirteen principles plus their named anti-rationalizations.` | `Fourteen principles plus their named anti-rationalizations.` | Count bump for P14. |
| Line 384 (closing paragraph) | `...more than the Iron Law summary in CLAUDE.md. Future work: a Red Flags table per principle...` | unchanged | The closing paragraph references the CLAUDE.md summary generically, not by count — no edit needed. |

---

## 6. Blast-radius CRUD plan (file + line/section granularity)

### File 1 — `.gobbi/projects/gobbi/skills/principles/SKILL.md` (canonical; `.claude/skills/principles/SKILL.md` is a symlink that reflects it automatically — NO second physical edit)

| Op | Target | Detail |
|---|---|---|
| Update | Line 9 (intro) | `Thirteen` → `Fourteen`. |
| Update | P6 title (`## Principle 6 — …`) | `Specificity Is the Only Currency` → `Refine Vague Requirements Before Acting` (pending D1). |
| Update | P6 Iron Law | `REFUSE TO TRANSACT IN VAGUENESS.` → `DO NOT ACT ON A VAGUE REQUIREMENT — MAKE IT CONCRETE FIRST.` |
| Update | P6 Discipline bullet | `Comfort is a warning sign…` → literal heuristic (§4.3). |
| Update | P10 title | `Witness-bound Work` → `Every Change Needs a Real Trigger` (pending D2). |
| Update | P10 Iron Law | `NO CHANGE WITHOUT A REAL MOTIVATOR.` → `NO CHANGE WITHOUT A REAL TRIGGER.` (pending D2). |
| Update | P11 title | `Metrics Are Signals, Not Targets` → `Improve the Property, Not the Metric` (pending D2). |
| Create | New `## Principle 14 — …` section | Inserted after P13's `---`, before the closing paragraph (full text §3). |
| Read | Whole file | Consistency pass — confirm no other line restates a changed Iron Law / title; confirm P13 blast-radius example still reads correctly. |

### File 2 — `.claude/CLAUDE.md` (canonical; the always-visible Iron Law table mirrors every Iron Law one-liner)

| Op | Target | Detail |
|---|---|---|
| Update | Iron Law table row 6 | `\| 6 \| REFUSE TO TRANSACT IN VAGUENESS. \|` → `\| 6 \| DO NOT ACT ON A VAGUE REQUIREMENT — MAKE IT CONCRETE FIRST. \|` |
| Update | Iron Law table row 10 | `\| 10 \| NO CHANGE WITHOUT A REAL MOTIVATOR. \|` → `\| 10 \| NO CHANGE WITHOUT A REAL TRIGGER. \|` (pending D2). |
| Create | Iron Law table row 14 | append `\| 14 \| STATE THE REQUIRED ACTION LITERALLY; DO NOT HIDE IT BEHIND A METAPHOR. \|` (pending D5). |
| Update | Line 27 prose | `The 13 principles below…` → `The 14 principles below…` |
| Read | Surrounding prose | Confirm no other "13"/"thirteen" count string elsewhere in CLAUDE.md (grep found only line 27). |

Note: row 11's Iron Law (`NO IMPROVEMENT THAT GAMES THE TOOL.`) is KEEP-justified, so table row 11 is unchanged. If D2 elects to also rewrite row 11, add a row-11 Update here.

### File 3 — `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (co-update ONLY if P6 title is rewritten — D1)

| Op | Target | Detail |
|---|---|---|
| Update | Line 44 | `(Principle 6 — Specificity Is the Only Currency)` → `(Principle 6 — Refine Vague Requirements Before Acting)`. |

### File 4 — `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` (co-update ONLY if P10 title is rewritten — D2/D7)

| Op | Target | Detail |
|---|---|---|
| Update | Line 29 | `(per Principle 10 — "Witness-bound Work")` → `(per Principle 10 — "Every Change Needs a Real Trigger")`; optionally rephrase the lowercase concept word "witness-bound" → "trigger-bound" / "requires a real trigger" per D7. This is project memory, not an instruction doc, so the edit is a cross-reference-correctness fix (P13), not a P14-scope rewrite. |

### Files NOT touched (confirmed by §2.2 grep)
- `orchestration/workflow/execution.md:37` paraphrases KEEP titles descriptively — no verbatim title, no change.
- No `agents/*.md`, no other `orchestration/*`, no `discussion/SKILL.md`, no `rules/*` edit — they cite principles by number only, and numbers are unchanged.
- No frozen `sessions/` or `archive/` edits (out of scope per the historical-record mistake).
- The absent `claude` skill is not relied on.

---

## 7. Open decisions for the user (highest-leverage first)

### D1 — P6 title rewrite (two good options)
The metaphor "Specificity Is the Only Currency" goes (REWRITE is locked by SURGICAL calibration applied to a pure metaphor). Two literal candidates:
- **(Recommended) `Refine Vague Requirements Before Acting`** — names the full action (refine, then act); pairs cleanly with the rewritten Iron Law.
- `Make Requirements Concrete Before Acting` — slightly shorter, "concrete" echoes the Iron Law's last word.
Recommendation: the first — "refine" captures the iterative push the body describes ("refine the requirement until it is concrete enough"), which "make concrete" understates. Either choice forces the `orchestration/SKILL.md:44` co-update (File 3).

### D2 — How far to push the P10 / P11 figurative cluster
These carry figurative language the body *defines*; SURGICAL calibration permits keeping a defined metaphor. Proposal:
- **P10:** rewrite the title (`Every Change Needs a Real Trigger`) and the Iron Law (`MOTIVATOR` → `TRIGGER`) for title-level clarity; **KEEP "witness" in the body** (defined inline).
- **P11:** **KEEP the Iron Law** (`NO IMPROVEMENT THAT GAMES THE TOOL`) and the Goodhart sentence (self-defining); rewrite only the **title** (`Improve the Property, Not the Metric`).
Recommendation: adopt as proposed. The alternative — also rewriting P11's Iron Law and stripping "witness"/"Goodhart" from bodies — over-applies the surgical rule and loses precise, defined shorthand. **Confirm this KEEP boundary, or push further?**

### D3 — P13 title "CRUD-Think" — keep or literalize?
`Spec + CRUD-Think for Documentation Work`: "CRUD" is standard and body-defined; "-Think" is a coined suffix.
- **(Recommended) KEEP** — "CRUD" is industry-standard, the body defines the full procedure, and "CRUD-Think" reads as "think in CRUD terms."
- Literalize to `Spec + Create/Read/Update/Delete Plan for Documentation Work` — fully explicit but clunky and longer than the Iron Law it heads.
Recommendation: KEEP (justified). **Confirm.**

### D4 — P4 title "Scope Is a Contract; the User Is the Client" — keep?
Borderline metaphor, but "contract" and "client" are defined in the Why and ARE the literal frame the principle operates in.
Recommendation: **KEEP-justified** (no rewrite). **Confirm, or do you read "contract/client" as obscuring?**

### D5 — Exact wording of Principle 14's title and Iron Law
- Title: **(Recommended) `Write Instructions in Plain, Literal Language`** vs. `State Instructions Literally`.
- Iron Law: **(Recommended) `STATE THE REQUIRED ACTION LITERALLY; DO NOT HIDE IT BEHIND A METAPHOR.`** vs. shorter `WRITE THE INSTRUCTION, NOT A METAPHOR FOR IT.`
Recommendation: the longer forms — they name both halves (state literally / do not hide). **Pick title + Iron Law.**

### D7 — The `backlogs/` cross-reference to P10 (scope reconciliation)
`backlogs/hooks-domain-mistakes-watchlist.md:29` quotes the P10 title and uses the concept "witness-bound." It is project memory, outside P14's instruction-doc scope, but P13 (blast radius) requires the quoted title not go stale.
- **(Recommended) Fix the quoted title only** — update `"Witness-bound Work"` → the new P10 title; leave the lowercase concept prose alone (it is the author's own usage in a memory note).
- Fix title AND rephrase the concept word ("witness-bound" → "trigger-bound").
- Leave it entirely (accept a stale title quote in a backlog).
Recommendation: the first — minimal, keeps the cross-reference correct without re-prosing memory. **Confirm, or prefer one of the alternatives?**

---

## 8. Self-check against Principle 14 (this artifact's own standard)
This artifact states each finding as the literal change (exact current string → exact proposed string), defines every term it uses, and avoids encoding any instruction behind a metaphor. The one figurative term it uses — "blast radius" — is the codebase's own defined term (P13) and is used in that defined sense.
