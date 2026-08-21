# Local Gobbi v1.2.1 release prep completed

**Completed at:** 2026-08-20T15:28:00Z

## Changes

- Left unpublished prep commit `e08b6a533b373d800988cf46b375f572a70c9001` on
  `chore/v1-2-1-release`. Parent is `f96154cb5202fcdc77ac6e5a0428b771a60b36c6`.
  The commit changes seven files: `CHANGELOG.md`, `README.md`, and the five
  plugin and marketplace JSON version owners.
- Set the six version surfaces to `1.2.1`: marketplace, four runtime plugin
  manifests, and the README badge URL and alt text.
- Cut `CHANGELOG.md` to `## 1.2.1 - 2026-08-21` while keeping `## Unreleased`.
  Recorded a Semantic Versioning 2.0.0 rule 7 exception: this patch includes new
  public operations.
- Updated README Workflow wait and User Review Continue or Stop wording, and
  added a short `gobbi-setup` pointer.
- User granted dual-branch publication: fast-forward `develop` to that commit,
  ort-merge into `main`, push both, annotated tag `v1.2.1` on the main merge, and
  GitHub Release. Those Git actions had not run when this record was written.
  Cleanup was not granted.
