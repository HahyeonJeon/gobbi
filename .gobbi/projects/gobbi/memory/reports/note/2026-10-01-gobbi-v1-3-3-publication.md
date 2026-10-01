# Gobbi v1.3.3 publication

**Completed at:** 2026-10-01T17:41:09Z

## Result

[Gobbi v1.3.3](https://github.com/HahyeonJeon/gobbi/releases/tag/v1.3.3) is the latest stable GitHub Release.
The user explicitly authorized publication after the completed
[release preparation](2026-10-01-gobbi-v1-3-3-release.md).

| Item | Verified result |
|---|---|
| Tag | Annotated `v1.3.3`, object `4782e4d76610d49ad30b7fb14e69058adc6d308f` |
| Release commit | `718b156f2a8d912aa977ccbd5d85ec6b5d6b96e7`, the reviewed main integration commit |
| Release tree | `057a6c7a1116eebaa0e984ef4b98937052cd8232` |
| Published at | `2026-10-01T17:41:09Z` |
| GitHub state | Latest; draft false; prerelease false; target `main` |
| Notes | Exact dated 1.3.3 changelog section from the release commit |

## Verification

- Local tag type is `tag`; its peeled target and tree match the reviewed release commit and tree.
- Origin reports the same tag object and peeled target.
- GitHub reports a published stable release, and its latest-release endpoint returns `v1.3.3`.
- The published body exactly matches the reviewed changelog section, including the role migration and the
  user's explicit Semantic Versioning exception.

The preparation account retains the package checks and runtime testing limits. Publication added no product
changes and required no repeated proof suites. The release tag remains fixed when later Memory records are
integrated into the branches.

Net change: [Gobbi v1.3.3 published](../../history/2026-10-01-gobbi-v1-3-3-published.md).
