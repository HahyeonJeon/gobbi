# Gobbi v1.4.0 release

**Completed at:** 2026-11-12T13:38:19Z

## Result

[Gobbi v1.4.0](https://github.com/HahyeonJeon/gobbi/releases/tag/v1.4.0) is the latest stable GitHub Release.
The marketplace, four runtime manifests, README badge, and dated changelog agree on 1.4.0. The user chose 1.4.0
over the recommended 2.0.0, and the README and changelog state the minor version as the user's explicit Semantic
Versioning exception. The README and the four setup guides give manual setup steps in place of the removed setup
scripts and hooks, and the upgrade text replaces all seven Codex role files.

| Item | Verified result |
|---|---|
| Release commit | `a8ffb000425e62f932fb194ad7e48d0d3da81dfa` on `develop` |
| Main integration | `6db24ac45f36bf4b5b9a227705bee826b2471d34`, tree equal to the release commit |
| Tag | Annotated `v1.4.0`, object `14beb57f6f884f75ba6864ff9cd1a814568a7566`, at the main integration commit |
| Notes | The dated 1.4.0 changelog section |

## Evidence

- Before publication: guard check 0 errors (12 checks), check_skills 0 errors, `tests/guard` 48 OK,
  `tests/skill_checks` 56 OK; the Claude layout block from `setup/claude.md` ran twice in a scratch repository.
- Release review: a Claude reviewer and Codex returned REVISE (superseded Delegation bullets, a Codex upgrade that
  kept the 1.3.3 manager and assistant files, Workflow receipts named as Ontology units, a removal that never
  shipped, reminder claims in two manifests, role counts). After one fix round a fresh reviewer confirmed all
  resolved.
- Origin reports `develop` at the release commit, `main` at the integration commit, and the same tag object;
  GitHub reports the release as latest, not draft, not prerelease, target `main`.

## Remaining limits

No live install was run in Claude Code, Codex, Cursor, or Grok. The Cursor guide still lacks a consumer install
path, an issue inherited from 1.3.3. The setup scripts and the settings check are planned for a later release.

Net change: [Gobbi v1.4.0 published](../../history/2026-11-12-gobbi-v1-4-0-published.md).
