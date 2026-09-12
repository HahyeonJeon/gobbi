# Cowork Configuration

| Field | Value |
|---|---|
| Document role | Canonical ignored Cowork configuration and recovery record |
| Authority | Records identity, locations, settings, and creation evidence; current TODO, topic records, Git state, and user authority remain controlling |
| Recorded at | {exact UTC timestamp} |

## Identity

| Field | Value |
|---|---|
| Mode | Cowork |
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
| Publication intent | Local retention |
| Merge authority | Not authorized; requires a separate explicit request |
| Cleanup authority | Not authorized; requires a separate explicit request |

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
| Recovery owner | Cowork |
| Recovery binding | Continue only in the Absolute worktree and Session root above; never create a replacement for this UUID |
| Accepted topics | {each topic-NN-slug and record path, newest last, or None} |
| First safe recovery command | {exact command to re-enter the Absolute worktree} |
| Recovery limits | {exact ambiguity or blocked action, or None} |
