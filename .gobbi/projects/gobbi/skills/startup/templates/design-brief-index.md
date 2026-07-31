# Startup Design Brief Index

This index identifies the complete Startup design-brief set prepared for ordinary Ideation. It becomes the
confirmed evidence-input set only after its confirmation checks pass. It is session evidence, not an
evaluated design, implementation plan, staging candidate, or durable-memory index.

## Set identity

- Project root: `{{absolute-project-root}}`
- Session root: `{{absolute-session-root}}`
- Ideation iteration: `{{n}}`
- Index status: `{{unconfirmed | confirmed}}`
- Rendered: `{{timestamp}}`
- User confirmation: `{{pending | timestamp and confirmation summary}}`

## Design brief register

| Startup brief | Dominant subject | Category | Intended `memory/design/` destination | Existing canonical destination | Owning aliases |
|---|---|---|---|---|---|
| `{{startup-design-category-subject.md}}` | `{{subject}}` | `{{architecture | feature | process | roadmap}}` | `memory/design/{{category}}/{{descriptive-kebab-case-subject}}.md` | `{{same path | none}}` | `{{aliases}}` |

Later memorization must create or update `memory/design/README.md` navigation for each resulting canonical
design document.

## Final topic register

Topic status `retired` means the topic no longer owns material work. It is distinct from a retired question
alias, and it requires a retirement reason and evidence.

| Topic Phase | Topic ID | Current topic | Origin | Final status | Basis, change reason, and evidence | Owning briefs |
|---|---|---|---|---|---|---|
| `{{1–4}}` | `{{S01 or S06.E01}}` | `{{topic}}` | `{{seed | adapted | emergent}}` | `{{resolved | not-needed | merged | retired | open}}` | `{{basis, reason, and evidence}}` | `{{briefs or none}}` |

## Question and answer coverage

Include every instantiated seed, adapted, emergent, follow-up, and conflict-resolution question. Preserve
items that ended `open`, `not-needed`, `merged`, or `retired`; do not add uninstantiated seed prompts.

| Question alias | Topic ID | Component or surface | Exact final question or axis | Final status | Current answer ID | Owning brief | Open owner / method |
|---|---|---|---|---|---|---|---|
| `{{[alias]}}` | `{{topic ID}}` | `{{scope}}` | `{{question or axis}}` | `{{answered | evidence-confirmed | open | not-needed | merged | retired}}` | `{{A001 or none}}` | `{{brief or none}}` | `{{owner and method, or none}}` |

## Material corrections

| Correction ID | Question aliases | Superseded Answer IDs and claims | Current Answer ID and claim | User resolution and evidence | Affected briefs and checkpoints |
|---|---|---|---|---|---|
| `{{C001}}` | `{{aliases}}` | `{{answer IDs and concise superseded claims}}` | `{{answer ID and current claim}}` | `{{user resolution and supporting evidence}}` | `{{briefs and Topic Phases}}` |

## Excluded and unresolved items

| Item | Disposition | Reason and evidence | Consequence | Owner and resolution method |
|---|---|---|---|---|
| `{{topic, alias, or design concern}}` | `{{not-needed | merged | retired | open}}` | `{{details}}` | `{{effect}}` | `{{owner and method, or none}}` |

## Completion checks

- [ ] The index lists at least one Startup design brief.
- [ ] Every listed brief exists, identifies this index, and declares the same subject, category, and destination.
- [ ] Every current material answer appears in exactly one brief and is reachable as `alias → current Answer ID → exact question, current answer, and evidence`.
- [ ] Every topic and instantiated alias has a final disposition; each retired topic records its reason and evidence separately from any retired question alias.
- [ ] Every material correction records its superseded Answer IDs and claims, current Answer ID and claim, user resolution, and affected brief.
- [ ] Every open question has an owner, consequence, and resolution method.
- [ ] Related designs use links instead of duplicated design content.
- [ ] Intended destinations follow `memory/design/{architecture|feature|process|roadmap}/{descriptive-kebab-case-subject}.md`.
- [ ] Raw conversation, sensitive values, detailed implementation tasks, and unsupported readiness claims are absent.
- [ ] User confirmation is recorded and Index status is `confirmed`.
