# Gobbi v1.3.2

**Completed at:** 2026-09-25T18:00:36Z

Final account of the v1.3.2 release. Net session change:
[Gobbi v1.3.2 published](../../history/2026-09-25-gobbi-v1-3-2.md).

## Completed work

The session reviewed, corrected, and published Gobbi 1.3.2 from branch `chore/release-v1-3-2` at base
`4670edff`. The release carries the six earlier local commits `cd5fa7df`..`4670edff`: the
`coding-object-oriented-programming` child, [Coding Principles](../../../skills/coding/principles.md), and the
Coding Ideation redesign.

User decisions:

- Keep 1.3.2 as a patch with a one-line intro note, as 1.3.1 did. Semantic Versioning would call the added
  skills a minor.
- Mark no `**Breaking:**` for the Coding Ideation three-level design, which replaced the v1.3.1 four-level
  ladder.
- Run an independent review before cutting the release. Fix the blocking changelog findings, small consistency
  findings, and the Workflow draft-location gap. Backlog the rest.
- Pin every Claude role contract to the full id `claude-opus-5-5` at `effort: high`, not the `opus`
  alias.
- Publish with the v1.3.1 pattern.

| Commit | Change |
|---|---|
| `4018f7c7` | Fixed review-01 P3, P5, P7, and P8. The Coding Ideation checklist now uses learning depth and allows framework-required classes and directories. Sibling skills are named by slug, and Coding Review gathers each `by-owning-stage` baseline. |
| `1c3781b7` | Workflow now passes Coding Ideation a draft location under `{session-root}/tmp/`. |
| `139c8c3f` | Pinned the five Claude role contracts to `claude-opus-5-5` with `effort: high`. The assistant had no effort before. |
| `a03cede1` | Release prep: CHANGELOG 1.3.2 section, README, and manifests at 1.3.2. Unreleased stays open. |
| `c712d1b3` | Main merge `merge(main): integrate develop for v1.3.2`. First parent `45d41193` (v1.3.1 main), second parent the prep, tree equal to the prep. |

On 2026-09-26, after the release, 23 stale local branches and 4 stale origin branches were deleted. Origin now
has only `main` and `develop`.

## Durable result

- Public identity is 1.3.2 on `origin/develop` (the prep), `origin/main` (the merge), tag `v1.3.2`, and
  the GitHub Release.
- Claude role pins are current in [Role model pins](../../design/process/role-model-pins.md).
- Deferred review findings are in the [Coding skill family backlog](../../backlogs/coding-skill-family.md) and
  the [Project backlog](../../backlogs/project.md).

## Evidence

| Claim | Object |
|---|---|
| Prep | `a03cede18dde27ca3781e9f68c30b3b46eb19b3a` (`chore(release): prepare gobbi v1.3.2`) |
| Merge | `c712d1b33c64e29d1f7f53b0258916e6ed95aadd`; parents `45d411931be6f6e0a2d3ff274c326f7ec1eed44d` and the prep; tree `801ac29798c7233b3d6da2cb2d400971cdda5580` equals the prep tree |
| Tag | annotated `v1.3.2` ("Gobbi v1.3.2"), object `f31dc2d061c3cec2cc572031de391096934e051c`, peels to the merge; tagger HahyeonJeon <jeonhh0061@gmail.com> |
| Release | https://github.com/HahyeonJeon/gobbi/releases/tag/v1.3.2 Latest, `--target main`, not draft, not prerelease, `publishedAt` 2026-09-25T18:00:36Z |
| Reviews | review-01 **REVISE** (P1 High and P2 Medium, both changelog truth) → corrections → review-02 **PASS** → prep → review-03 **PASS** → two Low style fixes → review-04 **PASS** with 0 Problems. One Claude reviewer per round; no Partner. |

Deleted branch tips, recorded before deletion:

| Where | Branch | Tip |
|---|---|---|
| local | `chore/muse-test` | `15c6d6cb59ad34c4ad9e72f1569a93f39cc495a5` |
| local | `chore/release-v1-4-0` | `3ff600ed7416cc48b2d3c603cc3191e01992522f` |
| local | `feat/gobbi-muse` | `15c6d6cb59ad34c4ad9e72f1569a93f39cc495a5` |
| local | `feat/agent-runtime-folders` | `42c9a63acc41288776de925d7c3eb1b0a8e8aca6` |
| local | `fix/fix-ideation` | `4dcad896369235ff7583f2fe00577717c600ad41` |
| local | `claude-2026-08-01-65316aa8-3d2a-4347-accc-3aba82c16024` | `b375c1ebd403a4898f8cf4f32482b49d1372566a` |
| local | `codex-2026-08-05-go-skil-review-5c31306a-97a9-475a-87a1-1e45bf2ba927` | `5dd33b592108ac560a9418a99df0907506a81249` |
| local | `codex-2026-08-05-gobbi-v1-1-0-main-publish` | `b482a79ca8aa319a56a1df45ccad15a211068441` |
| local | `codex-2026-08-08-fix-codex-plugin-a5c821a4-68c9-4e0e-92a5-6c68bead8722` | `1706bf40e669cc6d6fc3c4278308a61389d30784` |
| local | `codex-2026-08-09-python-skill-570f6b7a-fe5c-4501-938e-054b93fc1edd` | `dca0c3c5979d13d8872523dee26972bf7fd9c442` |
| local | `codex-2026-08-10-gobbi-dev-ef01dac6-a6a5-497c-a751-f657d715b985` | `b62d69590120b05327454abfd528171a61b78fb9` |
| local | `codex-2026-08-10-gobbi-review-09fd6500-d8c0-4c7b-bac0-4df3dd9bac28` | `4424f880e0582394033a81a85ebac9cb6969a12e` |
| local | `claude-2026-07-25-2f9595bb-307f-4260-bdd8-8bdb5b6df9ff` | `44622ed9d247539b322d8724edaf0171d4b5dd88` |
| local | `claude-2026-07-25-375b7373-c297-431c-b14a-1868ff477124` | `9ca8505bc81dad18464f433d1f52685be5735bf2` |
| local | `claude-2026-07-25-a72e00db-3085-45ba-85cc-a9d9e5c7e273` | `0762a8645b5b47860a8d5a6129fab5e78e1ecc8c` |
| local | `claude-2026-07-25-b8bc5439-e39e-497c-bba5-29237b7a66ce` | `53c321c7e3890f956ee29fe2afac8db9520627dc` |
| local | `claude-2026-08-01-00280b9a-bfbf-4e1a-b7fc-84161867fcc1` | `eded2eb5a9ed3a555c7ecbb3b46380967b2860b8` |
| local | `codex-2026-07-31-098e6b04-4ddb-4d1d-9794-dce01872a706` | `be32ddcd049b8111b77db60d2bb9a008660dc72f` |
| local | `codex-2026-08-03-bc4876c0-4812-4ab1-ad2a-2b70ad53f040` | `044ec33ccdc80ed73d79a3076ffd0ce3827f2103` |
| local | `codex-2026-08-11-session-start-hook-2c42c75f-577f-4f8c-b63d-73c3f33e6969` | `68e6759e720f058364762b59874a077f0446262c` |
| local | `codex-2026-08-12-improve-skills-b846af0c-d864-4ba8-901b-f85e1dacad0d` | `73f4f25f79b8c03396a13a97f92047c4f7fc91ce` |
| local | `feat/vision-skill` | `640421c16e2fead97fe19c46899cd5cedb191314` |
| local | `recovery/develop-af03846f-20260727` | `af03846f322295c15841984df76904a088f108d5` |
| origin | `claude-2026-07-25-2f9595bb-307f-4260-bdd8-8bdb5b6df9ff` | `2e166726d24ce2e9ea610bddd793d712943ce1b0` |
| origin | `codex-2026-08-03-bc4876c0-4812-4ab1-ad2a-2b70ad53f040` | `3788211c471225e01609f7065f4c93171f9ba5e2` |
| origin | `codex-2026-08-05-gobbi-v1-1-0-b7877072-b969-4276-95c6-06a4ffb36060` | `d249dfc2cdc8f90cf849a630339cedbdeae42177` |
| origin | `codex-2026-08-09-gobbi-v1-1-3-2cf622f0-2a24-46d1-9f89-8e73c4cf8366` | `37721997ae1aec2817afa1ef9df4fece7f942d9e` |

## Verification

- `sync-plugin-package.sh --check` passed.
- All five JSON manifests parse and read 1.3.2.
- `claude -p --agent assistant` was served by `claude-opus-5-5`.
- `origin/develop` equals the prep, `origin/main` equals the merge, and `v1.3.2^{}` equals the merge.
- `gh release list` shows Gobbi v1.3.2 as Latest.

## Remaining limits

- Each review round used one Claude reviewer. No second runtime reviewed the release.
- Review-03 did not show that Claude honors `effort: high`; it showed only the model id.
- CHANGELOG claims Semantic Versioning while 1.3.2 adds features as a patch (user decision).
