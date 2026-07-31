# Startup Interview Working Record

This is a structured, noncanonical Ideation research record. It is not a raw transcript, evaluated
artifact, durable-memory record, or independent source of truth. Summarize answers faithfully, omit
secrets and user-marked sensitive values, and retain the file while the interview is incomplete.

## Interview identity

- Project root: `{{absolute-project-root}}`
- Session root: `{{absolute-session-root}}`
- Ideation iteration: `{{n}}`
- Trigger: `{{fresh-project | sparse-baseline | explicit-reset}}`
- Classifier: `{{sparse | absent | contradictory}}`
- Classifier evidence: `{{ordered source citations and named gaps}}`
- Started: `{{timestamp}}`
- Updated: `{{timestamp}}`
- Current Phase: `{{1 | 2 | 3 | 4}}`
- Current Phase status: `{{draft | confirmed | corrected | reopened}}`
- Interview status: `{{active | interrupted | finalizing}}`

## Evidence posture

### Verified facts

- `{{fact}}` — Evidence: `{{source or observation}}`

### User-reported facts

- `{{claim}}` — Evidence status: `{{corroborated | user-asserted | unverified | contradicted}}`

### Assumptions and forecasts

- `{{claim}}` — Owner: `{{owner}}` — Resolution method: `{{method}}`

### Current contradictions

- `{{C001}}` — `{{short conflict summary}}`

### Riskiest current assumption

- Claim: `{{claim}}`
- Why it is load-bearing: `{{reason}}`
- Cheapest reliable test: `{{method}}`

## Evolving topic tree

Use seed IDs `S01`–`S13`. Keep an adapted seed's ID. Give an emergent topic the earliest owning seed
plus a sequence, such as `S06.E01`.

Topic origin is `seed`, `adapted`, or `emergent`. Topic status is `open`, `resolved`, `not-needed`,
`merged`, or `reopened`.

### Phase 1 — Problem Definitions

| Topic ID | Topic | Origin | Basis or adaptation reason | Status | Dependencies | Answer IDs |
|---|---|---|---|---|---|---|
| `S01` | Existing Reality and Evidence | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S02` | Problems, Causes, Outcomes, and Success | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S03` | People, Jobs, Alternatives, and Adoption | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |

### Phase 2 — Project Design

| Topic ID | Topic | Origin | Basis or adaptation reason | Status | Dependencies | Answer IDs |
|---|---|---|---|---|---|---|
| `S04` | Scope, Boundaries, External Contracts, and Non-goals | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S05` | Capabilities and Journeys | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S06` | Experience, Interfaces, and Accessibility | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S07` | System Context and Data Direction | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |

### Phase 3 — Project Specification

| Topic ID | Topic | Origin | Basis or adaptation reason | Status | Dependencies | Answer IDs |
|---|---|---|---|---|---|---|
| `S08` | Architecture, Runtime, State, and Data Contracts | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S09` | Technology Stack, Dependencies, and Platform Compatibility | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S10` | Delivery, Operations, Quality, and Verification | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S11` | Security, Privacy, Safety, and Data Duties | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |

### Phase 4 — Project Rules

| Topic ID | Topic | Origin | Basis or adaptation reason | Status | Dependencies | Answer IDs |
|---|---|---|---|---|---|---|
| `S12` | Authority, Governance, Constraints, and Engineering Conventions | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |
| `S13` | Ownership, Maintenance, Risk, and Continuity | `seed` | `{{basis}}` | `open` | `{{IDs or none}}` | `{{IDs or none}}` |

## Evolving question agenda

Add only instantiated questions. Do not copy every seed or conditional prompt into this table.

Question aliases are globally unique lowercase kebab-case values such as `[tech-stack]`. Scope each
question to one component or surface; derive distinct aliases when sibling components can answer
differently. Question origin is `seed`, `adapted`, `emergent`, `follow-up`, or `conflict-resolution`.
Question status is `open`, `asked`, `answered`, `evidence-confirmed`, `not-needed`, `merged`, `reopened`,
or `retired`.

| Question alias | Phase / topic ID | Applies to component or surface | Current wording or axis | Origin | Derived from | Basis or adaptation reason | Status | Answer IDs |
|---|---|---|---|---|---|---|---|---|
| `[software-type]` | `1 / S01` | `project` | `Which software type or mixed set owns the outcome?` | `seed` | `none` | `{{evidence or reason}}` | `open` | `{{IDs or none}}` |

## Structured answer events

Copy this block for each material answer. Use sequential answer IDs such as `A001`.

### `{{A001}}` — `{{short answer label}}`

- Phase and topic: `{{Phase number}}` / `{{topic ID}}`
- Question alias: `{{[semantic-alias]}}`
- Applies to component or surface: `{{project | named component or surface}}`
- Question origin: `{{seed | adapted | emergent | follow-up | conflict-resolution}}`
- Derived from question aliases: `{{aliases or none}}`
- Exact question: `{{question as asked}}`
- Faithful non-sensitive answer summary: `{{summary, not a transcript}}`
- Claim kind: `{{fact | user-report | intent | preference | forecast | decision | open-question}}`
- Evidence status: `{{verified | corroborated | user-asserted | unverified | contradicted}}`
- Evidence: `{{source, observation, or none}}`
- Interpretation and confidence gap: `{{read and uncertainty}}`
- Decision or current open question: `{{decision | question}}`
- Recommendation: `{{recommendation or not applicable}}`
- Rejected alternatives and evidence-to-change: `{{details or not applicable}}`
- Dependencies: `{{topic or answer IDs, or none}}`
- Topic effects: `{{added, adapted, merged, not-needed, reopened, or none; include reason}}`
- Supersedes: `{{answer IDs or none}}`
- Superseded by: `{{answer ID or none}}`
- Conflicts with: `{{answer or conflict IDs, or none}}`
- Follow-up owner and method: `{{owner and method, or none}}`

## Phase checkpoints

At each checkpoint, record the current topic tree and current answers rather than a conversation
history. A topic may be resolved, not needed with evidence and reason, or open with an owner and method.

### Phase 1 checkpoint — Problem Definitions

- Status: `{{draft | confirmed | corrected | reopened}}`
- Current topics and dispositions: `{{IDs, adaptations, and statuses}}`
- Current questions and dispositions: `{{aliases, component scopes, statuses, and adaptation reasons}}`
- Current answers: `{{alias-to-answer mappings and summaries}}`
- Facts and evidence: `{{facts and sources}}`
- Assumptions: `{{claims and resolution methods}}`
- Decisions, rejected alternatives, and evidence-to-change: `{{details}}`
- Open questions, owners, and methods: `{{details}}`
- Conflicts and corrections: `{{conflict IDs or none}}`
- Downstream or reopened effects: `{{details or none}}`
- User confirmation: `{{timestamp and confirmation summary}}`

### Phase 2 checkpoint — Project Design

- Status: `{{draft | confirmed | corrected | reopened}}`
- Current topics and dispositions: `{{IDs, adaptations, and statuses}}`
- Current questions and dispositions: `{{aliases, component scopes, statuses, and adaptation reasons}}`
- Current answers: `{{alias-to-answer mappings and summaries}}`
- Facts and evidence: `{{facts and sources}}`
- Assumptions: `{{claims and resolution methods}}`
- Decisions, rejected alternatives, and evidence-to-change: `{{details}}`
- Open questions, owners, and methods: `{{details}}`
- Conflicts and corrections: `{{conflict IDs or none}}`
- Downstream or reopened effects: `{{details or none}}`
- User confirmation: `{{timestamp and confirmation summary}}`

### Phase 3 checkpoint — Project Specification

- Status: `{{draft | confirmed | corrected | reopened}}`
- Current topics and dispositions: `{{IDs, adaptations, and statuses}}`
- Current questions and dispositions: `{{aliases, component scopes, statuses, and adaptation reasons}}`
- Current answers: `{{alias-to-answer mappings and summaries}}`
- Facts and evidence: `{{facts and sources}}`
- Assumptions: `{{claims and resolution methods}}`
- Decisions, rejected alternatives, and evidence-to-change: `{{details}}`
- Open questions, owners, and methods: `{{details}}`
- Conflicts and corrections: `{{conflict IDs or none}}`
- Downstream or reopened effects: `{{details or none}}`
- User confirmation: `{{timestamp and confirmation summary}}`

### Phase 4 checkpoint — Project Rules

- Status: `{{draft | confirmed | corrected | reopened}}`
- Current topics and dispositions: `{{IDs, adaptations, and statuses}}`
- Current questions and dispositions: `{{aliases, component scopes, statuses, and adaptation reasons}}`
- Current answers: `{{alias-to-answer mappings and summaries}}`
- Facts and evidence: `{{facts and sources}}`
- Assumptions: `{{claims and resolution methods}}`
- Decisions, rejected alternatives, and evidence-to-change: `{{details}}`
- Open questions, owners, and methods: `{{details}}`
- Conflicts and corrections: `{{conflict IDs or none}}`
- Downstream or reopened effects: `{{details or none}}`
- User confirmation: `{{timestamp and confirmation summary}}`

## Conflicts and corrections

Use sequential conflict IDs such as `C001`. The user decides which answer is current or whether the
answers apply under different conditions.

### `{{C001}}` — `{{short conflict label}}`

- Question aliases: `{{aliases}}`
- Previous answer: `{{answer ID and incompatible claim}}`
- Later answer: `{{answer ID and incompatible claim}}`
- Evidence and downstream consequence: `{{details}}`
- User resolution: `{{current claim or conditions}}`
- Current answer: `{{answer ID}}`
- Superseded answers: `{{answer IDs or none}}`
- Affected topics: `{{topic IDs}}`
- Earliest reopened Phase: `{{Phase number or none}}`
- Dependent checkpoint effects: `{{details}}`
- Reconfirmation: `{{affected Phase statuses and confirmation}}`

## Finalization checks

- [ ] Every current topic is `resolved`, `not-needed` with reason and evidence, `merged`, or `open` with an owner and method.
- [ ] Every topic change records its context and reason.
- [ ] Every instantiated question has one valid, globally unique semantic alias and a current disposition.
- [ ] Every instantiated question records the component or surface to which it applies.
- [ ] Contextual rewording retains an alias only when its semantic axis is unchanged.
- [ ] Semantic splits, changed axes, and conflict-resolution axes receive new aliases with derived-from aliases.
- [ ] Every current answer is reachable through its question alias.
- [ ] No question remains `asked` or `reopened`; each has a finalizable disposition.
- [ ] Every material contradiction has the user's resolution and correction links.
- [ ] Every reopened Phase and affected downstream checkpoint is current.
- [ ] Current answers, evidence, uncertainty, decisions, and open questions agree across sections.
- [ ] Secrets, credentials, and user-marked sensitive values are absent.
- [ ] The final topic tree matches the structured answer events.
- [ ] The final interview report is ready for user confirmation.
