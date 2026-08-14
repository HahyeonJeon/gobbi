# Workflow Configuration

| Field | Value |
|---|---|
| Document role | Canonical ignored Workflow configuration and recovery record |
| Authority | Records the last accepted Configuration observation; current TODO, work evidence, handoff evidence, Git state, and accepted user authority remain controlling |
| Recorded at | {exact UTC timestamp} |

## Identity

| Field | Value |
|---|---|
| Mode | Workflow |
| Original UTC session-start date | {YYYY-MM-DD} |
| Normalized slug | {slug} |
| Full UUID | {lowercase hyphenated UUID} |
| Partner policy | {enabled or disabled} |
| Runtime | {runtime and version} |
| Gobbi skills root | {absolute validated path} |
| Gobbi agents root | {absolute validated path} |

## Locations

| Field | Value |
|---|---|
| Project key | {project key} |
| Git common directory | {absolute path} |
| Base branch | {branch} |
| Base checkout | {absolute path} |
| Immutable base commit | {full revision} |
| Work branch | {branch} |
| Worktree leaf | {YYYY-MM-DD-slug-full-uuid} |
| Session leaf | {YYYY-MM-DD-slug-full-uuid} |
| Absolute worktree | {absolute path} |
| Session root | {absolute-worktree}/.gobbi/projects/{project-key}/sessions/{session-leaf}/ |
| Project Memory root | {absolute-worktree}/.gobbi/projects/{project-key}/memory/ |

## Settings

| Field | Value |
|---|---|
| Execution pass cap | {total passes per Execution task; default 3} |
| Ideation, Planning, and Wrap-up pass cap | 2 total passes per productive unit |
| User decision boundary | Phase 1 only; closed by a Complete Phase 1 handoff |
| Publication intent | {local, push, or pull request} |
| Merge authority | {exact current authority} |
| Cleanup authority | {exact current authority} |
| Protected work | {exact paths or state, or None} |

### Systems and Roles

| System or role | Required scope | Availability | Evidence | Waiver |
|---|---|---|---|---|
| {name} | {productive step or role boundary} | {available or unavailable} | {direct evidence} | {exact accepted waiver or None} |

## Evidence

| Claim | Direct evidence |
|---|---|
| Entry contract | {mode, slug, partner policy, and source} |
| Mode settings | {accepted settings and authority} |
| Gobbi root pair | {validation observations} |
| Required layout | {paths, states, and exact checks} |
| Repository and immutable base | {repository and revision observations} |
| Worktree registration | {command and observed registration} |
| Session identity and containment | {path and identity checks} |
| Ignored session record | {ignore check} |
| Tracked worktree | {status observation} |
| Base checkout preservation | {preimage and current status} |
| Native TODO route | {fixed titles and current statuses} |

## Recovery

| Field | Value |
|---|---|
| Configuration state | {fresh or recovered} |
| Identity source | {fresh observations or prior configuration path and hash} |
| Recovery owner | Workflow |
| Recovery binding | Continue only in the Absolute worktree and Session root above; never create a replacement for this UUID |
| Verified route point | {evidence-backed route at Recorded at} |
| Latest handoff | {exact handoff path and hash, or None before Phase 1 completion} |
| Progress evidence | {result locator and hash, report, gate, receipt, handoff, check, commit, or None} |
| First safe recovery command | {exact command} |
| Recovery limits | {exact ambiguity or blocked action, or None} |
