# Workflow Configuration

| Field | Value |
|---|---|
| Document role | Canonical ignored Workflow configuration and recovery record |
| Authority | Records identity, locations, settings, and creation evidence; current TODO, handoff.md, Git state, and accepted user authority remain controlling |
| Recorded at | {exact UTC timestamp} |

## Identity

| Field | Value |
|---|---|
| Mode | Workflow |
| Original UTC session-start date | {YYYY-MM-DD} |
| Normalized slug | {slug} |
| Full UUID | {lowercase hyphenated UUID} |
| Partner policy | {disabled or sorted comma set} |
| Runtime | {runtime and version} |
| Gobbi skills root | {absolute validated path} |
| Gobbi agents root | {absolute validated path} |

## Locations

| Field | Value |
|---|---|
| Project key | {project key} |
| Git common directory | {absolute path} |
| Base branch | {observed `git branch --show-current` on the start checkout} |
| Base checkout | {absolute path of the checkout Gobbi started in} |
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
| User decision boundary | Design questions close at completed `P1 · User Review`; later User Review is continue-only; after Configuration the route idle-waits until delivered work |
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
| Tracked worktree | {status observation at Configuration} |
| Base checkout preservation | {preimage and status at Configuration} |

## Recovery

| Field | Value |
|---|---|
| Configuration state | {fresh or recovered} |
| Identity source | {fresh observations or prior configuration path and hash} |
| Recovery owner | Workflow |
| Recovery binding | Recover only in the Absolute worktree and Session root above; never create a replacement for this UUID |
| Latest handoff | {exact handoff path, or None} |
| First safe recovery command | {exact command to re-enter the Absolute worktree} |
| Recovery limits | {exact ambiguity or blocked action, or None} |
