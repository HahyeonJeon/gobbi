# Desktop Outcome Projection — Release Trust, Updates, and Recovery

This is a subordinate Desktop outcome projection. It describes the product promise and release authority; it
cannot replace the Electron release or test skills and defines no signing, notarization, certificate, feed,
channel, updater, installer, platform, version, or rollback mechanism.

Before using it, **MUST load [`electron`](../electron/SKILL.md)**,
[`electron-release`](../electron/electron-release/SKILL.md), and
[`electron-test`](../electron/electron-test/SKILL.md). Load every other Electron child whose root trigger
applies.

## Desktop projection

An installed release affects machines the team may never reach again. Desktop therefore owns the human and
product consequences of the release decision:

- who receives each release and what they are told;
- when the application may check, download, interrupt, restart, or defer;
- how a person foresees and refuses material bandwidth, interruption, data, or workflow consequences;
- how live work, local data, migrations, and downgrade behavior remain recoverable;
- what old-version window the product supports and what happens outside it;
- what observable signal stops a rollout or other distribution action;
- what forward recovery the product promises when already-installed software cannot be withdrawn;
- which per-operating-system user and accessibility claims require a signed or installed artifact; and
- who has authority to build, sign, distribute, publish, halt, or supersede a release.

Give all Electron support, packaging, hardening, identity, notarization, updater, feed, channel, rollout,
compatibility, rehearsal, and artifact mechanics to `electron-release`. Give the exact install, first-launch,
update, restart, recovery, rejection, platform, and packaged evidence to `electron-test`. Do not infer one
claim from another: artifact creation, installation, identity, update compatibility, and product acceptance
remain separate.

The Desktop safety floor applies to every release clause. A decision owner, waiver, planned fix, or green
pipeline cannot accept an unforeseeable, unrefusable, or unrecoverable consequence. Publication and other
irreversible external actions require explicit user authority at the point of action.

This projection is complete when the product’s supported-version and recovery promises are explicit, the
applicable Electron release and test evidence is attached per target, every product floor passes in the
relevant delivery state, and the authority boundary is visible.
