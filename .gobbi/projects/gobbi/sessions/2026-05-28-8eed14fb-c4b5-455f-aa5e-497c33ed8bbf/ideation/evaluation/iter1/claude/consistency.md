# Evaluation — Consistency (Claude · ideation iter1)

**Verdict: FAIL**

## Artifact Summary + Memory reads

Same as `project.md`. Consistency focus: does the artifact's internal claims align across §1-§9? Does it match the existing project source-of-truth files it cites (line numbers, settings fields, model assignments, mistake names)? Does its proposed mode-divergent settings table actually conform to the on-disk default settings JSON?

## Locked Frame (Stage 1)

**Scenario C1 — Scope Contract, Framed Problem, and Design describe the same problem**
- C1.1 §2 (Scope Contract) and §3-§5 (Design) solve the same problem §1 (WHY) states

**Scenario C2 — Every cited file path / line number resolves and reads as cited**
- C2.1 SKILL.md line 241-242 quote matches the on-disk text
- C2.2 SKILL.md line ranges for the cascading edits (66-70, 72-76, 80-84, 234-242, 245-290, 338+, 387-405) match the actual sections
- C2.3 Mistake-file references (`design-literal-retire-instruction-without-replacement.md`, `section-order-is-part-of-the-contract-not-just-the-set.md`, `prose-reclassification-target-is-project-level-notes.md`) exist
- C2.4 Backlog references (`backlogs/chat-mode-tiki-taka-redesign.md`, `backlogs/auto-mode-silence-vs-always-ask.md`) exist with the framings cited

**Scenario C3 — Settings table (§5) values match on-disk `settings.default.json`**
- C3.1 The default values claimed for Auto Mode match the current default settings file
- C3.2 Model assignments cited in §5 notes match `settings.default.json` models block

**Scenario C4 — Internal claims are consistent across sections**
- C4.1 §3 Chat-shape and §6 SKILL amendment delta agree on the per-task slice structure
- C4.2 §3.4 task-record location and §7.1 CRUD path agree
- C4.3 §1 HOW.5 "schema unchanged" and §5 table "schemaVersion: 1 / 1" agree

**Scenario C5 — Internal vs external research findings conflict and conflict is not resolved (adversarial)**
- C5.1 Where Superpowers / GSD borrows are cited, they do not contradict the existing project pattern

**Scenario C6 — Claimed-existing-but-actually-not (adversarial)**
- C6.1 "Placeholder files… already exist" — verify on disk
- C6.2 "Mirror-symlinks already exist under `.claude/skills/orchestration/`" — verify

## Per-scenario per-check results

| Check | Result | Evidence |
|---|---|---|
| C1.1 | YES | §2/§3/§4/§5 all serve the redesign §1 frames. |
| C2.1 | YES | Verified: worktree SKILL.md line 241 reads "In both modes, the manager NEVER skips `EVALUATION`... Mode controls user gates; it does not relax the workflow." Artifact §6.1 quotes the second clause faithfully. |
| C2.2 | YES (mostly) | Verified line numbers against worktree SKILL.md: 62-76 "Orchestration Mode" + Chat/Auto blocks (cited as 64-74), 80-84 "Workflow" header (correct), 234-242 "Inter-loop transition" (verified 234-241), 245-290 "Workflow Status Display" (verified), 387-405 "Mode-specific gates" (verified). Cited "338+" for state machine is "## Workflow State Machine" at line 338 in main checkout and ~338 in worktree — verified. Minor: §6.1 line range "241-242" is two lines but the actual sentence is one line on line 241. Pedantic; recorded as Low. |
| C2.3 | YES | All three cited mistake files exist at `.gobbi/projects/gobbi/mistakes/`. |
| C2.4 | YES | Both backlog files exist; `status: active`, `disposition: open`; framings match. |
| C3.1 | YES | settings.default.json has `mode: auto`, ideation `discuss.mode: user / evaluate.mode: always / maxIterations: 3`, preparation same, planning `discuss.mode: agent / always / 3`, execution `agent / always / 3`, wrap-up `agent / always / 1`. Artifact §5 Auto column matches exactly. |
| C3.2 | NO | Critical inconsistency. settings.default.json (lines 32-37): `"manager": "opus", "leader": "opus", "executor": "opus", "evaluator": "sonnet", "assistant": "sonnet"` (claude models). Artifact §5 footnote: "Opus for manager / leader / evaluator; Sonnet for executor / assistant." The artifact INVERTS executor and evaluator: settings says executor=opus, evaluator=sonnet; artifact says evaluator=opus, executor=sonnet. Recorded as F-C1 below. |
| C4.1 | YES | §3.2 diagram and §6.2 state-machine description agree on the dispatch structure. |
| C4.2 | YES | §3.4 path `sessions/{date}-{session-id}/chat/tasks/{NN}-{slug}/task-record.md` and §7.1 CRUD agree. |
| C4.3 | YES | §5 keeps `schemaVersion: 1` both columns. |
| C5.1 | n/a | Insufficient detail on Superpowers/GSD borrows to evaluate conflict. (See F-P5.) |
| C6.1 | YES | Placeholder files exist (verified in worktree). |
| C6.2 | PARTIAL | Mirror-symlinks exist in worktree but I did not verify them as symlinks — the find command returned them as regular files. The Idea claims "mirror-symlink under `.claude/skills/orchestration/chat-mode.md` already exists" but does not state whether they are symlinks or copies. `mistakes/skills-mirror-symlinks-not-copies.md` exists in this project — symlinks-vs-copies is a known historical issue. Recorded as F-C2. |

## Typed findings

### F-C1 — Critical: Model assignments inverted vs settings.default.json

- **Type:** `general`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 100
- **Severity:** Critical
- **Evidence:** `.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json` lines 31-45 (claude block) sets `"executor": "opus", "evaluator": "sonnet"`. Artifact §5 footnote (line 242 of the Idea): "The `models.*` block stays mode-independent: the role decides the model (Opus for manager / leader / evaluator; Sonnet for executor / assistant), not the mode." The footnote inverts executor↔evaluator. Identical inversion in the Idea doc text would propagate to `chat-mode.md` and `auto-mode.md` Execution prose if §5 is the source. The doc's framing "per `delegation/SKILL.md § Model Selection`" suggests the leader cross-checked — but the cross-check fact-checks failed.
- **Why it matters:** Direct contradiction of an on-disk source-of-truth. If §5 is used as the basis for documenting per-mode defaults in the Execution-stage `chat-mode.md` / `auto-mode.md`, downstream readers would believe evaluator runs on Opus and executor on Sonnet — the opposite of the project's actual ratio. The `mistakes/section-order-is-part-of-the-contract-not-just-the-set.md` precedent shows what happens when an evaluator does not ground-truth claims by reading the cited source — this is the same pattern (in reverse: the leader cites a source they didn't ground-truth). **Critical because it is a verifiable factual error in a doc the user explicitly asked to be the input to Planning.**

### F-C2 — "Mirror-symlinks already exist" not verified

- **Type:** `assumption_risk`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** §7.1 + R12 claim mirror-symlinks exist. The project mistakes file `skills-mirror-symlinks-not-copies.md` exists (which means symlink-vs-copy is a historically active issue). The artifact does not run a verification command at Ideation; it defers verification to a "pre-flight check in Execution Planning" (R12). For an Ideation Loop this is acceptable but it elevates the claim to assumption rather than fact.
- **Why it matters:** If the files in `.claude/skills/orchestration/` are copies rather than symlinks, editing the canonical files will leave the mirrors stale — a known historical bug. R12 acknowledges this. The wording "already carry mirror-symlinks" is too strong without verification.

## Per-perspective verdict

**FAIL.**

F-C1 is Critical · 100 → FAIL per the Stage 2 verdict rule ("any Critical with confidence ≥ 75 → FAIL"). The model-assignment inversion is a direct, verifiable factual error in the Idea doc. It must be corrected before the doc advances to Planning. F-C2 is independently Low and does not change the verdict.

## Low-confidence appendix

- **L-C1:** §6.1 cites line range "241-242" but the actual sentence ends on line 241. Pedantic; confidence 25.
- **L-C2:** §1 HOW.8 cites Principle 4 — the SCOPE principle. The fresh-context-per-task discipline maps more naturally to Principle 1 (NO ACTION WITHOUT THINKING IT THROUGH) or to delegation/SKILL.md's Inline-Paste Rule. Mismatched citation; confidence 25.
