# Startup Interview Working Record

This temporary record preserves the current Startup interview state for recovery. It is not a raw transcript,
evaluated design, implementation plan, staging candidate, or durable-memory record. Summarize answers
faithfully, omit sensitive values, and retain this file until the complete design-brief set is confirmed.

## Identity and recovery

- Project root: `{{absolute-project-root}}`
- Session root: `{{absolute-session-root}}`
- Ideation iteration: `{{n}}`
- Started: `{{timestamp}}`
- Updated: `{{timestamp}}`
- Interview status: `{{active | interrupted | finalizing}}`
- Current Topic Phase: `{{1 | 2 | 3 | 4}}`
- Current Topic Phase status: `{{draft | confirmed | corrected | reopened}}`
- Next unresolved alias: `{{[alias] | none}}`
- First safe recovery action: `{{action}}`

## Evidence posture

### Verified facts

- `{{fact}}` — Evidence: `{{source or observation}}`

### User-reported facts

- `{{claim}}` — Evidence status: `{{corroborated | user-asserted | unverified | contradicted}}`

### Assumptions and forecasts

- `{{claim}}` — Owner: `{{owner}}` — Resolution method: `{{method}}`

### Current contradictions

- `{{C001}}` — `{{short conflict summary}}`

## Evolving topic tree

Use seed IDs `S01`–`S13`. Keep an adapted seed's ID. Give an emergent topic the earliest owning seed plus a
sequence, such as `S06.E01`. Origin is `seed`, `adapted`, or `emergent`. Status is `open`, `resolved`,
`not-needed`, `merged`, `retired`, or `reopened`. A retired topic no longer owns material work and must retain
its retirement reason and evidence; this is distinct from retiring one question alias.

### Topic Phase 1 — Problem Definitions

| Topic ID | Topic | Origin | Basis, change reason, and evidence | Status | Dependencies | Answer IDs |
|---|---|---|---|---|---|---|
| `S01` | Existing Reality and Evidence | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S02` | Problems, Causes, Outcomes, and Success | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S03` | People, Jobs, Alternatives, and Adoption | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |

### Topic Phase 2 — Project Design

| Topic ID | Topic | Origin | Basis, change reason, and evidence | Status | Dependencies | Answer IDs |
|---|---|---|---|---|---|---|
| `S04` | Scope, Boundaries, External Contracts, and Non-goals | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S05` | Capabilities and Journeys | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S06` | Experience, Interfaces, and Accessibility | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S07` | System Context and Data Direction | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |

### Topic Phase 3 — Project Specification

| Topic ID | Topic | Origin | Basis, change reason, and evidence | Status | Dependencies | Answer IDs |
|---|---|---|---|---|---|---|
| `S08` | Architecture, Runtime, State, and Data Contracts | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S09` | Technology Stack, Dependencies, and Platform Compatibility | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S10` | Delivery, Operations, Quality, and Verification | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S11` | Security, Privacy, Safety, and Data Duties | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |

### Topic Phase 4 — Project Rules

| Topic ID | Topic | Origin | Basis, change reason, and evidence | Status | Dependencies | Answer IDs |
|---|---|---|---|---|---|---|
| `S12` | Authority, Governance, Constraints, and Engineering Conventions | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S13` | Ownership, Maintenance, Risk, and Continuity | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |

## Evolving question agenda

Add only instantiated questions. Aliases are globally unique lowercase kebab-case values such as
`[tech-stack]`. Origin is `seed`, `adapted`, `emergent`, `follow-up`, or `conflict-resolution`. Status is
`open`, `asked`, `answered`, `evidence-confirmed`, `not-needed`, `merged`, `reopened`, or `retired`. A retired
question status applies only to that alias; it does not retire its owning topic.

| Alias | Topic Phase / topic ID | Component or surface | Exact current question | Origin | Derived from | Basis or change reason | Status | Answer IDs |
|---|---|---|---|---|---|---|---|---|
| `[software-type]` | `1 / S01` | `project` | `What type of software, or combination of software types, will deliver the project's intended result?` | `seed` | `none` | `{{evidence or reason}}` | `open` | `{{IDs or none}}` |

## Structured answer events

Copy this block for each material answer. Use sequential IDs such as `A001` and keep superseded events.

### `{{A001}}` — `{{short answer label}}`

- Topic Phase and topic: `{{number}} / {{topic ID}}`
- Question alias: `{{[semantic-alias]}}`
- Component or surface: `{{project | named component or surface}}`
- Origin and derived aliases: `{{origin; aliases or none}}`
- Exact question: `{{question as asked}}`
- Faithful non-sensitive answer: `{{summary, not a transcript}}`
- Claim kind: `{{fact | user-report | intent | preference | forecast | decision | open-question}}`
- Evidence status and source: `{{status and source or none}}`
- Interpretation and confidence gap: `{{current interpretation and uncertainty}}`
- Decision or open owner / method: `{{decision | owner and method}}`
- Rejected alternatives and evidence-to-change: `{{details or not applicable}}`
- Dependencies and topic effects: `{{IDs and effects, or none}}`
- Supersedes / superseded by: `{{answer IDs or none}}`
- Conflicts with: `{{answer or conflict IDs, or none}}`

## Topic Phase checkpoints

Use one row per Topic Phase. Record each retired topic with its reason and evidence separately from retired
question aliases. Update a row when a correction reopens that Phase.

| Topic Phase | Status | Topic and alias dispositions | Current answers and evidence | Decisions and alternatives | Open owners and methods | Conflicts and effects | User confirmation |
|---|---|---|---|---|---|---|---|
| `1 — Problem Definitions` | `{{draft | confirmed | corrected | reopened}}` | `{{details}}` | `{{details}}` | `{{details}}` | `{{details}}` | `{{details}}` | `{{timestamp and summary}}` |
| `2 — Project Design` | `{{draft | confirmed | corrected | reopened}}` | `{{details}}` | `{{details}}` | `{{details}}` | `{{details}}` | `{{details}}` | `{{timestamp and summary}}` |
| `3 — Project Specification` | `{{draft | confirmed | corrected | reopened}}` | `{{details}}` | `{{details}}` | `{{details}}` | `{{details}}` | `{{details}}` | `{{timestamp and summary}}` |
| `4 — Project Rules` | `{{draft | confirmed | corrected | reopened}}` | `{{details}}` | `{{details}}` | `{{details}}` | `{{details}}` | `{{details}}` | `{{timestamp and summary}}` |

## Conflicts and corrections

Use sequential conflict IDs such as `C001`. The user decides which claim is current or whether the claims
apply under different conditions.

### `{{C001}}` — `{{short conflict label}}`

- Question aliases: `{{aliases}}`
- Previous answer and incompatible claim: `{{answer ID and claim}}`
- Later answer and incompatible claim: `{{answer ID and claim}}`
- Evidence and consequence: `{{details}}`
- User resolution: `{{current claim or conditions}}`
- Current answer and superseded answers: `{{answer ID; answer IDs or none}}`
- Affected topics and earliest reopened Topic Phase: `{{topic IDs; Phase or none}}`
- Checkpoint effects and reconfirmation: `{{details}}`

## Self-review findings

| Finding ID | Missing, weak, or conflicting design concern | Evidence | Added or changed topic / alias | Owner | Resolution status |
|---|---|---|---|---|---|
| `SR001` | `{{concern}}` | `{{source or gap}}` | `{{topic ID and alias}}` | `{{owner}}` | `{{open | resolved}}` |

## Planned design briefs

| Brief working path | Dominant subject | Category | Intended `memory/design/` destination | Owning aliases | Status |
|---|---|---|---|---|---|
| `startup-design-{{category}}-{{subject}}.md` | `{{subject}}` | `{{architecture | feature | process | roadmap}}` | `memory/design/{{category}}/{{descriptive-kebab-case-subject}}.md` | `{{aliases}}` | `{{planned | rendered | confirmed}}` |

## Finalization checks

- [ ] Every current topic is `resolved`, `not-needed` with reason and evidence, `merged`, `retired` with reason and evidence, or `open` with an owner and method.
- [ ] Every instantiated alias is valid, unique, scoped, and linked to a current answer or owned open item.
- [ ] No question remains `asked` or `reopened`.
- [ ] Every material contradiction has a user resolution, correction links, and current checkpoints.
- [ ] Self-review found no unowned material design concern.
- [ ] Every current material answer has exactly one planned owning brief.
- [ ] The brief index and all listed briefs agree with this record.
- [ ] Raw conversation, secrets, credentials, and user-marked sensitive values are absent.
- [ ] The complete brief set is ready for user confirmation.
