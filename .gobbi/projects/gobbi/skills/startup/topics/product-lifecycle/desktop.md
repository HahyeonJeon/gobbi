# Desktop Product Lifecycle Overlay

Select this overlay only from accepted installed-desktop Product evidence. It owns actor-visible desktop
promises; Development packaging, signing, updater, and installed-artifact proof stay in the Development
Lifecycle desktop overlay.

## Project

## Product

- [desktop-install-first-run] From install through first usable launch, what trust, permission, failure, and repair behavior does the consumer observe?
  - **Owner:** Desktop acquisition-promise owner
  - **Purpose:** Exercise install through first usable launch
  - **Oracle:** The consumer reaches supported first launch or explicit safe repair
  - **Activation evidence:** Accepted evidence establishes an installed Desktop target, installer, store, or package
  - **Source aliases:** desktop-install,NEW

- [desktop-entry-lifecycle] Across alternate entry, close, quit, background, second instance, and restart, which input and state remain correct?
  - **Owner:** Desktop session-continuity owner
  - **Purpose:** Exercise supported Desktop entry and exit transitions
  - **Oracle:** Each supported transition preserves named input or state invariants or discloses safe loss
  - **Activation evidence:** Accepted evidence establishes alternate-entry or application-lifecycle behavior
  - **Source aliases:** desktop-restart-state,NEW

- [desktop-local-state-recovery] When local state is absent, corrupt, locked, incompatible, or left by a crash, what safe state opens and what recovery is offered?
  - **Owner:** Desktop local-data continuity owner
  - **Purpose:** Define recovery from unusable persisted local state
  - **Oracle:** The Product opens the nearest safe state, preserves recoverable data, and names recovery or refusal
  - **Activation evidence:** Accepted evidence establishes persisted local Desktop state
  - **Source aliases:** NEW

- [desktop-update-support] During an installed Desktop update, what remains usable, how is interruption recovered, and which support path applies?
  - **Owner:** Desktop installed-population evolution owner
  - **Purpose:** Define installed update usability, compatibility, recovery, and support
  - **Oracle:** A supported installed release reaches compatible state or explicit recovery or forward fix
  - **Activation evidence:** Accepted evidence establishes an updater, channel, or installed predecessor
  - **Source aliases:** desktop-update,NEW

- [desktop-uninstall-retention] After uninstall or retirement, which local data is removed, retained, exportable, or recoverable?
  - **Owner:** Desktop data-disposition owner
  - **Purpose:** Define local-data disposition after uninstall or retirement
  - **Oracle:** Observed local-data disposition matches the accepted retention or deletion promise
  - **Activation evidence:** Accepted evidence establishes uninstall or local-data behavior
  - **Source aliases:** NEW

## Implementation
