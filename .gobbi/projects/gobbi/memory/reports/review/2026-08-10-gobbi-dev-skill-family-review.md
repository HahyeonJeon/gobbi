# Gobbi development lifecycle skill family review

## Subject and result

This review records the completed compatibility, implementation, static verification, and evaluation of the
repository-local `gobbi-dev` family. The accepted task head is
`9f6ea2f6db4c197f5f109756801242d7be747dd3`, with tree
`539692d6dbab2d95aa8a7de1015c34262eda7de9`. The current intent is recorded in
[Gobbi development lifecycle skill family](../../design/feature/gobbi-dev-skill-family.md).

The formal Task 2 evaluation returned PASS within the accepted static-only boundary. Production Claude and
Codex PASS remains user-assumed. The latest real runtime observations exited `1` and were not relabeled.

## Delivered change

Task 1 established bidirectional domain activation compatibility in commits
`cbe5eb65a8d0bced08ba2d42a666c39fd17e8b33` and
`50e7e83a4fd6892aa55618e300880035e57cb33b`. It preserved exact canonical and plugin hash pairs:

| Owner | SHA-256 |
|---|---|
| Domain Skill SOP | `37da20822e63f1917c186ddfe5d79d7ffbf46f6a3e6ef5abcc927c5b65d8677f` |
| CLI root | `acb1c484fc930b8031d029aeccba43ff6a9f55281a36c9ddb9263b127eac84df` |
| Desktop root | `2b4532c748bd38fa5bedfd1ea4e434cfaae55ef1535884c28eaeae39dfc2c33c` |
| React root | `06dce66aa472bd17391ff390763838b698b75ce40d2e2a9eac6d449121452899` |

Each value applies to both the canonical and plugin copy.

Task 2 first added the local lifecycle family and projection controls in
`8b4d9a17205b697840cfb4346450e002304e3fc6`. That commit contains exactly 35 paths. The repair commit
`9f6ea2f6db4c197f5f109756801242d7be747dd3` contains exactly ten approved paths and hardens the smoke policy,
family pins, and bilateral fail-before-mutation validators.

The final family has one navigation-only root and seven direct children: conventions preference; deployment,
development, release, review, and testing operations; and toolchain tool. Repository-local Claude and Codex
discovery is complete. The plugin package excludes exactly the top-level `gobbi-dev` family and contains no
family path.

## Smoke and validator result

The smoke audit keeps three policies separate: exact source probes, strict helper denial, and bounded
production semantic no-effect classification. Only a fixed wrapper and closed stage list can select the
production policy. A tolerated record must be complete, anchored, denied with exact injected `EACCES`, create
no descriptor or effect, and belong to a zero-status child.

The implementation authenticates each nonempty private current-stage trace, requires per-PID terminal
closure, and proves successful local Unix IPC through exact descriptor provenance. Both synchronizers pin the
family contract before mutation. Their negative fixtures compare the whole owned surface and prove no effect
after rejected input. Runtime receipts preserve the stage, syscall, address family, and blocked-probe count.

## Accepted verification

The accepted current checks passed:

- Exact Task 1 canonical and plugin hashes matched the table above.
- Task 2 commit and path scopes matched 35 original paths and ten repair paths.
- Bash syntax passed for both smoke scripts, both synchronizers, and the fixture suite.
- Both smoke helper self-tests passed.
- Runtime-entrypoint and plugin-package synchronizer checks passed.
- The complete local family inventory, child links, generated discovery links, and native entrypoint equality
  passed.
- The package inventory omitted the whole `gobbi-dev` family while preserving included content.
- `git diff --check` passed.
- The fresh fixture suite ended with `PASS: 202 sync reconciliation tests completed`.

## Evaluation and dispositions

The formal Task 2 report returned PASS at SHA-256
`e4bc34ef1ad3902f874c27d9646b25de8da12779101b958e4b5bc86c9e34e0ea`. Supplemental cross-check A returned
PASS at `e799e3f7c744858573372c17d115a4c820f9b13c1b7db73942a3d6af3103c7ef`.

Supplemental cross-check B remains preserved as the historical REVISE result at
`9b2f5b3603b071f8a2fcd0e679c35869cbd53f04bf4c3fc38d4ea3680ff3adcd`. Its blocking evidence-consistency
finding `T02-E2-B-001` was later rechecked and closed by a file-backed PASS at
`eab6405dfae87187a51bf74f20bcedcd7cdae6113b0cbaed1fee2399dbf6ec32`.

Six historical precommit and postcommit review declarations remain response-only and `UNVERIFIED`. They were
excluded from verdict evidence. The PASS result instead rests on the formal report and durable file-backed
cross-checks.

## Limits and prohibited actions

- Production Claude and Codex PASS is user-assumed only. Their latest real observations remain exit `1`.
- Marketplace, installation, installed-cache, and later production stages were not observed after the repair.
- No production smoke was rerun. No plugin was installed into a production target.
- No network, credential, deployment, release, publication, push, merge, tag, retained-target cleanup, branch
  removal, or worktree removal occurred.
- The static tests prove the selected parser, validator, and policy wiring. They do not replace a separately
  authorized production runtime observation.
