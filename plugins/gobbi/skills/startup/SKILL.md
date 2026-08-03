---
name: startup
description: "Use when a caller needs one software-project design interview that turns project evidence and the user's answers into one confirmed `startup.md` design record."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
skill-type: operation
---

# Startup

Startup runs one software-project design interview and produces one confirmed `startup.md`. A caller supplies
the absolute project root and one absolute output directory. The user owns every design answer, every conflict
resolution, and the confirmation that ends the run.

The operating agent reads the project's own evidence first, then adapts the starting questions in
[`topics.md`](topics.md) to this project and to each feature the user names, and asks them one at a time. It
keeps the current state in `startup.tmp.md` inside the output directory, reviews the developing design for
gaps, writes `startup.md` from that record, and removes the working record once the user confirms the result.

`startup.md` holds the confirmed design only. It is not an evaluated design, an implementation plan, or
durable memory, and it names no memory destination. Startup returns its path and stops.

## Principles

### Let evidence lead the interview

Start each topic from verified project facts and concrete events rather than from the question list. Treat a
preference or a forecast as a gap in evidence, not as a fact.

### Fit every question to this project and to each feature

The starting questions are an editable list, not required coverage: reword each one in this project's own
components, users, and terms, drop what does not apply, and add what the project needs. Ask the per-feature
questions once for each named feature, wording each one for that feature.

### Never let a later answer silently replace an earlier one

Show both answers and their evidence, and let the user state which is current or under which condition each
applies. Then revisit every answer that depended on the replaced one.

### Write the result for a reader who was not in the interview

Organize `startup.md` by design subject rather than by the order the questions were asked. A reader must be
able to follow it without the working record.

## Rules

- **MUST validate the caller-supplied absolute output directory before the first write.** The directory must
  exist and resolve inside the working tree, with no symbolic link and no parent-traversal component on its
  path.
- **MUST ask one question at a time and record its answer, kind, evidence, and evidence strength in the
  working record.** Present a fact the project already proves for confirmation or correction instead of
  asking the user to rediscover it.
- **MUST ask the per-feature questions once for each feature the user named.** A project that names no
  separate feature records its one owned outcome as the single feature.
- **MUST resolve a conflicting answer with the user before treating either answer as current.** Record the
  correction and ask again every question whose answer depended on the replaced one.
- **MUST obtain the user's confirmation of the complete `startup.md` before removing the working record.**
  Reread both paths afterwards and confirm that `startup.md` is the only Startup artifact left.
- **NEVER record raw conversation, secrets, credentials, or user-marked sensitive values.** Startup writes no
  evaluation, no implementation plan, no durable memory, and no path outside the supplied output directory.

## Procedure

### Phase 1 — Prepare the Interview

#### 1.1 Validate the output directory and open the working record

- Take the absolute project root and the caller-supplied absolute output directory as the input.
- Apply the location requirement owned by [`../record/SKILL.md`](../record/SKILL.md) Step 1.1: the directory
  must be absolute, must exist, and must resolve inside the working tree, with no symbolic link and no
  parent-traversal component on its path.
- Read the directory. A `startup.md` is confirmed when its `Confirmation` section records the user's
  confirmation, and unconfirmed otherwise. The two artifacts give six states; take the one matching action.

| `startup.tmp.md` | `startup.md` | Action |
|---|---|---|
| absent | absent | Create `{output-directory}/startup.tmp.md` from [`templates/startup.tmp.md`](templates/startup.tmp.md), write the absolute project root, the resolved output directory, the status `in progress`, and the next question `not shaped` into its `Interview state`, and continue to Step 1.2. |
| absent | unconfirmed | Stop. A draft with no working record can be neither resumed nor proved to belong to this run. |
| absent | confirmed | Reread `startup.md`, confirm its `Confirmation` section records this project root and this output directory, and return its path without interviewing again. |
| present | absent | Resume the interview. |
| present | unconfirmed | Resume the interview. The draft is this run's own regenerable output, and Step 3.2 rewrites it from the working record. |
| present | confirmed | Finish the completion Step 3.3 left interrupted: confirm that `startup.md` records this project root and this output directory, then confirm that `startup.tmp.md` records the same pair, and only then remove `startup.tmp.md`, reread the directory, and return the confirmed path. Never interview again and never rewrite the file. |

- To resume, first confirm that the working record's `Interview state` records this project root and this
  output directory. `Next question` takes four forms: `not shaped`, a `[question-name]` that also names its
  feature when the question is per-feature, `features not recorded`, and `none`.
- Then run Step 2.4 and continue from the value it derives: Step 1.2 for `not shaped`, Step 2.1 for a project
  question, Step 2.2 for a per-feature question and the feature that value names and for `features not
  recorded`, or Step 3.1 for `none`. Step 2.4 rewrites `Interview state` whenever the derived value differs
  from the recorded one, so a write interrupted mid-interview cannot misroute the resume.
- Treat `Next question` as unreadable when it is missing, still an unfilled template placeholder, or written
  in none of the four forms above; Step 2.4 derives its value from the working record in that case as well.
  Never read an unreadable field as `none`.
- Stop before any write, change nothing, and report the exact path and the failing requirement when the
  location check fails, when a recorded project root or output directory does not match this run, or when the
  directory holds a Startup artifact this skill does not own. Startup regenerates only the unconfirmed
  `startup.md` its own working record covers; it never overwrites a confirmed `startup.md` or an artifact it
  cannot prove it owns, and it never migrates one automatically.

#### 1.2 Read the project and shape the question list

- Take the open working record and the absolute project root as the input.
- Read the project's memory, documentation, source, configuration, tests, history, and conventions, and sort
  what is found into verified facts, user-reported claims, and open questions. Verify external material
  against its own source before recording it; material that cannot be verified becomes an open question with
  an owner, a consequence, and a resolution method instead of a stated fact.
- Write the sorted evidence into the working record's `Project evidence` section, giving each user-reported
  claim its evidence strength and each open item an owner, a consequence, and a resolution method.
- Take the starting questions from [`topics.md`](topics.md) and adapt them to this project: drop what does not
  apply, add what the project needs, and reword every remaining question so it names this project's own
  components, users, and terms. Order the topics by dependency, uncertainty, and consequence.
- Record one row per topic in the working record's `Topics` section and one row per question in its
  `Question list` section, both in that order. Each question row carries its adapted wording, whether it is
  asked once for the project or once per feature, and where it came from; a per-feature row is recorded after
  the question that names the features, and a dropped question keeps its row and records why.
- Run Step 2.4 and continue from the value it wrote. A material direction the project's own evidence does not
  settle becomes an open question carried into the interview.

### Phase 2 — Interview the User

#### 2.1 Ask and record one question at a time

- Take the working record's `Question list` and its recorded project evidence as the input.
- Ask one question about one subject, in plain words fitted to this project, under its lowercase hyphenated
  bracketed name. When the project already answers it, present that fact for confirmation or correction
  instead of asking. Seek a concrete event, behavior, alternative, cost, or constraint before accepting a
  preference or a forecast.
- Record one row in the working record's `Answers` table carrying the question name, its topic, `project` or
  the feature name, the question as asked, the answer, its kind, its evidence, and that evidence's strength,
  then mark the question asked in the `Question list`.
- Compare each new answer against every recorded answer it could contradict. Two recorded answers that cannot
  both be current go to Step 2.3 before either one is treated as current.
- An answer that raises a new material concern adds its row to the `Question list` before this step ends. Then
  run Step 2.4 and continue from the value it wrote, which returns here for the next project question, goes to
  Step 2.2 for the per-feature loop, or goes to Step 3.1 only when it wrote `none`.

#### 2.2 Ask the feature questions once for each feature

- Take the working record's `Features` table as the input, together with the answer to `[feature-list]` when
  that question was asked.
- Record one `Features` row for each feature the user named. When `[feature-list]` was dropped, or the user
  names no feature separate from the project's own outcome, record that owned outcome as the single feature
  and record in `How it was identified` where it came from. The table therefore always holds at least one
  feature, and this loop always runs at least once.
- Ask the per-feature questions in [`topics.md`](topics.md) Topic 5 once for each recorded feature, naming
  that feature in every question and wording each question for that feature. Record one `Answers` row for each
  feature and each per-feature question, scoped by the feature name, and add that question's name to that
  feature's `Questions answered` column in the same write. A per-feature row in the `Question list` is marked
  asked only once every recorded feature has its answer to it.
- After each answer, run Step 2.4 and continue from the value it wrote.
- A feature discovered later joins the `Features` table and, in that same write, sets every per-feature row in
  the `Question list` back to `to ask`, so it receives the same questions before the design can be reviewed.

#### 2.3 Resolve a conflicting answer with the user

- Take two recorded answers that cannot both be current as the input.
- Show both answers, their evidence, and what depends on them, and ask the user which one is current or under
  which condition each applies. Never replace an answer silently.
- Record the user's decision in the current `Answers` row and one row in the working record's `Corrections`
  table. In that same write, name in `What it affected` every question whose answer depended on the replaced
  one, set each of those rows in the `Question list` back to `to ask`, and clear each one's `Answers` rows and
  its name from every `Features` row's `Questions answered`, so no invalidated answer stays recorded.
- Then run Step 2.4 and continue from the value it wrote, which reaches those reopened questions before the
  design can be reviewed.

#### 2.4 Derive and write the next question and feature

- Take the working record as the input. Every step that changes the `Question list`, the `Features` table, the
  `Answers` table, or the `Corrections` table runs this step before it ends, and Step 1.1 runs it on every
  resume. The one exception is Step 1.1's create row, which writes `not shaped` before any `Question list`
  exists. No other step writes `Interview state`'s `Next question`.
- Derive from the reopened state, never from the state before it. A step that adds a feature or records a
  correction sets the affected `Question list` rows back to `to ask` in the same write that records the
  change, so those rows are already open here.
- Derive the successor from the `Question list` in its recorded order: a `Question list` holding no row
  derives `not shaped`; otherwise take the first row marked `to ask`; otherwise take the first row that is
  scoped per feature, is not dropped, and lacks an `Answers` row for some recorded feature; otherwise derive
  `none`.
- Resolve the derived row's scope into a pair. A row scoped `project` derives that question alone. A row
  scoped per feature derives that question together with the first feature in the `Features` table that has no
  `Answers` row for it.
- Derive `features not recorded` instead whenever the derivation selects a per-feature row while the `Features`
  table holds no row, and whenever it reaches `none` while that table holds no row. Step 2.2 then records the
  feature set, and this step runs again.
- Write the derived value into `Interview state`'s `Next question`, naming the feature for a per-feature pair,
  before the calling step ends. The field is then current after any interruption, not only after a pause.
- Continue from the value just written: Step 1.2 for `not shaped`, Step 2.1 for a project question, Step 2.2
  for a per-feature question with the feature it names and for `features not recorded`, or Step 3.1 for
  `none`.

### Phase 3 — Confirm and Complete the Design

#### 3.1 Review the design for gaps

- Take the complete working record as the input.
- Read it as a whole against this project and mark every material design concern with no clear owner, every
  vague answer, every contradiction, and every unsupported direction.
- Record each one in the working record's `Gaps found in review` table with its evidence, the question it
  produced, its consequence, its owner, how it will be resolved, and its status.
- Each gap joins the `Question list` as a new or reworded row; then run Step 2.4 and continue from the value
  it wrote. An item may stay open only with an owner, a consequence, and a resolution method.
- Before continuing to Step 3.2, confirm that every row in the `Topics` table carries a status, that a topic
  recorded as not needed or dropped records why, that every row in the `Question list` is marked asked or
  records why it was dropped, and that every recorded feature has an answer to every per-feature question that
  was not dropped. Record a missing topic status here; any other failure runs Step 2.4 and continues from the
  value it wrote. Continue when no gap is unowned.

#### 3.2 Write `startup.md` and confirm it with the user

- Take the reviewed working record as the input.
- Write `{output-directory}/startup.md` from [`templates/startup.md`](templates/startup.md), organized by
  design subject rather than by the order the questions were asked, readable without the working record, and
  keeping every heading so a reader can tell an empty answer from a question that was never asked. Present the
  file to the user.
- Write the confirmed design only. `startup.md` carries no evaluation of that design, no implementation plan,
  and no ordered task list; whoever evaluates or plans the design does that work outside Startup.
- The written `startup.md` and the user's response are the evidence.
- A correction returns to Step 2.3 or Step 2.1, then repeats Step 3.1 and this step. A confirmation continues
  to Step 3.3.

#### 3.3 Complete, pause, or stop

- Take the user's confirmation, or the reason the interview cannot continue, as the input.
- On confirmation, record it in the `Confirmation` section of `startup.md` together with the absolute project
  root and the output directory, reread the file, remove `startup.tmp.md`, then reread the directory. Startup
  is complete when `startup.md` exists at the validated path, records the confirmation with this project
  root, and the working record is gone.
- On a pause, keep the working record current, set its status to `paused`, confirm that its next question is
  the one Step 2.4 last wrote, and name its first recovery action; the run resumes at Step 1.1. On a state
  Startup cannot safely change, write nothing further and report the exact blocker and the path it refused to
  use.
- Return the absolute path of the confirmed `startup.md`, the path of the current working record, or the
  blocker, and stop.
- The caller records the confirmed `startup.md` as session evidence through
  [`../record/SKILL.md`](../record/SKILL.md), and the design it holds is later reorganized and memorized
  through [`../memory/SKILL.md`](../memory/SKILL.md). Startup performs neither and names no memory
  destination.

## References

- [`topics.md`](topics.md) — the starting questions, grouped into four Topic Phases and thirteen topics.
- [`templates/startup.tmp.md`](templates/startup.tmp.md) — the working record's shape, held during the
  interview and removed at completion.
- [`templates/startup.md`](templates/startup.md) — the confirmed design record's shape.
