# Startup Working Record

This file holds the current state of one Startup interview so it can be resumed. It is not a transcript, an
evaluated design, or an implementation plan. Summarize answers faithfully, leave sensitive values out, and
keep this file until `startup.md` is confirmed.

Two words qualify recorded statements here:

- **Kind** — what the statement is: `fact`, `user report`, `decision`, `plan`, or `open`. This word is used in
  the working record only.
- **Evidence strength** — how well the project's own evidence supports it: `verified`, `supported`,
  `unverified`, or `disputed`. `startup.md` uses this word with the same meaning and defines it again, so it
  stays readable after this file is removed.

## Interview state

- Project root: `{absolute-project-root}`
- Output directory: `{absolute-output-directory}`
- Status: `{in progress | paused}`
- Next question: `{not shaped, until the question list exists | [question-name], naming the feature when it is
  a per-feature question | features not recorded, until the Features table holds a row | none, once every
  question is asked or dropped and every recorded feature has its per-feature answers}`
- First recovery action: `{what a resuming agent does first}`

## Project evidence

### Verified facts

- `{fact}` — Source: `{file, command, or observation}`

### User-reported claims

- `{claim}` — Evidence strength: `{verified | supported | unverified | disputed}`

### Assumptions and open questions

- `{item}` — Owner: `{owner}` — Consequence: `{effect if it stays open}` — How it will be resolved:
  `{method}`

## Features

One row per feature. When `[feature-list]` was dropped, or the user names no feature separate from the
project's own outcome, that owned outcome is the single feature.

| Feature | What it does | How it was identified | Questions answered |
|---|---|---|---|
| `{feature}` | `{one sentence}` | `{named by the user, or found in project evidence}` | `{question names, or none}` |

## Topics

One row per topic, named from `topics.md`, in the order the topics will be asked. A topic that is not needed
or dropped records why.

| Order | Topic Phase | Topic | Status | Reason and evidence |
|---|---|---|---|---|
| `{ask order, 1 upward}` | `{1 to 4}` | `{topic name}` | `{open, answered, not needed, or dropped}` | `{reason and evidence, or none}` |

## Question list

The starting questions from `topics.md` after they were adapted to this project, in the order they will be
asked within their topic. A dropped question keeps its row and records why. A question added during the
interview or the review joins this table before it is asked.

| Question name | Topic | Scope | Question as adapted | Origin | Status | Reason |
|---|---|---|---|---|---|---|
| `{[question-name]}` | `{topic name}` | `{project, or per feature}` | `{the question in this project's own components, users, and terms}` | `{topics.md, or the step that added it}` | `{to ask, asked, or dropped}` | `{why it was dropped or added, or none}` |

## Answers

One row per material answer. Use the question's bracketed name. For a per-feature question, name the feature
in `Feature or project`; the same question name appears once for each feature.

| Question name | Topic | Feature or project | Question as asked | Answer | Kind | Evidence | Evidence strength |
|---|---|---|---|---|---|---|---|
| `{[question-name]}` | `{topic name}` | `{feature name, or project}` | `{question as it was asked}` | `{answer, summarized}` | `{fact, user report, decision, plan, or open}` | `{source, or none}` | `{verified, supported, unverified, or disputed}` |

## Corrections

One row each time an answer replaces an earlier one. The user decides which answer is current, or under which
condition each applies.

| What changed | Earlier answer | Current answer | User's resolution | What it affected |
|---|---|---|---|---|
| `{[question-name]}` | `{earlier claim}` | `{current claim}` | `{what the user decided}` | `{the questions it reopened, and any other feature or topic affected}` |

## Gaps found in review

| Gap | Evidence | Question added or changed | Consequence | Owner | How it will be resolved | Status |
|---|---|---|---|---|---|---|
| `{missing, vague, or conflicting concern}` | `{source or gap}` | `{[question-name]}` | `{effect if it stays open}` | `{owner}` | `{method}` | `{open, or resolved}` |
