# Python Packaging Evaluation Checklist

## Distribution contract

- [ ] The packaging record identifies configured build metadata, distribution and import names, supported consumers, artifact kinds, and required installed behavior.
- [ ] The record distinguishes source-tree observations from installed-consumer observations.
- [ ] A general workspace-placement concern is routed to `python-project-structure` unless it changes package discovery, artifact contents, or installed behavior.
- [ ] A `src` or flat-layout choice states the installed behavior it affects without declaring either layout universally correct.

## Artifact construction

- [ ] Each build uses project-configured packaging inputs and records its source or configuration identity and bounded output path.
- [ ] Each artifact record includes kind, path, checksum or equivalent byte identity, distribution metadata, and relevant included-content inventory.
- [ ] An unexpected included file, missing package, incorrect import identity, or metadata mismatch is traced to the responsible packaging input or discovery rule.
- [ ] A failed or ambiguous artifact is retained as incomplete evidence rather than replaced by an unrecorded build.

## Installed consumer

- [ ] The consumer context installs the exact identified artifact without satisfying the target import through the source checkout or path configuration.
- [ ] The installed check identifies the environment, artifact identity, bound consumer behavior, observation, and evidence limit.
- [ ] A difference between source-tree and installed behavior remains explicit with its metadata, discovery, content, or environment explanation.
- [ ] Immutable artifact evidence is handed to `python-release` without a release-readiness claim.

## Authority and scope

- [ ] No packaging guidance grants publication, credential use, tagging, or external release authority.
- [ ] No packaging record takes ownership of unrelated workspace organization or an unconfigured universal build tool.
