# Repository guard and skill checker

## Intent

Gobbi's own repository is checked by one guard, and the project-independent skill checks ship in the plugin so
any project can check its skills against Gobbi's skill-writing standard. The guard replaced the removed shell
scripts for syncing and proving the package (see [Session hooks](../feature/stop-reminder.md)).

## Shape

- `scripts/guard/guard.py` has three commands: `check`, `sync`, and `list`. It needs Python 3.11 or later and the
  standard library only. stdout carries one JSON envelope and stderr one summary line per finding. Exit codes are
  0 clean, 1 findings, 2 usage error, and 3 internal error.
- `sync` writes the package mirror under `plugins/gobbi/` (skills, agents, runtimes) and the generated Principles
  blocks. It also generates the Codex user-only policy file `agents/openai.yaml` inside each user-only skill, with
  `allow_implicit_invocation: false` for every user-only skill, and `check` reports a hand-written one in the
  canonical tree. Canonical sources stay under `.gobbi/projects/gobbi/`; the package is a projection.
- `check` runs 12 checks: frontmatter, phases (numbered, with `Done when` and Step size), references, sentences
  (a Rule or Step bullet has at most two sentences), links and anchors, mirror, generated blocks, roles
  (identical bodies across runtimes), versions, line length, ALL-CAPS words, and an advisory list of `MUST` and
  `NEVER` rule leads.
- `.githooks/pre-commit` (opt in with `git config core.hooksPath .githooks`) and
  `.github/workflows/guard.yml` (Python 3.11 and 3.13) run it; CI checks the committed tree and is the authority.
  Tests live in `tests/guard/` and `tests/skill_checks/`.

## Skill checker

`skills/gobbi-skill/scripts/check_skills.py` runs the eight project-independent checks (frontmatter, phases,
references, sentences, links, line length, ALL-CAPS, rule leads) on Python 3.9 or later over every
`.gobbi/projects/*/skills` directory by default; `--skills`, `--root`, `--max-line`, `--allow-caps`, and `--only`
adjust it. The guard imports the same code from the canonical copy. Gobbi Skill's Phase 3 tells authors to run
it, and a new check is run over the whole tree before its fix is estimated (see the
[work learning](../../learnings/work/tips.md)).

## Decisions to preserve

- The guard checks the working tree, not the index; a partly staged commit is checked as the tree stands.
- The skill checks stay project-independent and ship with the plugin; repository-only checks (mirror, generated,
  roles, versions) stay in the guard.
- Emphasis words are limited: Rules are a plain bold lead plus a reason, and `MUST` and `NEVER` remain only for
  safety, authority, and irreversible boundaries.
- Known follow-ups are in the [project backlog](../../backlogs/project.md).

## References

- [Role contracts](../process/identity-and-load-role-contracts.md) (identical role bodies)
- [Consumer project bootstrap](consumer-project-bootstrap.md)
