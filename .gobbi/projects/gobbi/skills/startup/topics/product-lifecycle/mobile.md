# Mobile Product Lifecycle Overlay

Select this overlay only from accepted mobile Product evidence. It owns actor-visible mobile operating-system,
permission, background, update, and device-state promises.

## Project

## Product

- [mobile-form-state-continuity] Across accepted size, orientation, scene, or form changes, which in-progress task state and outcome remain correct?
  - **Owner:** Mobile form-transition owner
  - **Purpose:** Exercise accepted Mobile form transitions
  - **Oracle:** The named task preserves correct state and outcome or discloses safe recovery
  - **Activation evidence:** Accepted mobile-form-factor evidence
  - **Source aliases:** NEW

- [mobile-interruption] After the mobile operating system backgrounds, suspends, or terminates the Product, which in-progress work is restored, and what loss or recovery is visible?
  - **Owner:** Mobile OS-lifecycle continuity owner
  - **Purpose:** Preserve or recover work across background, suspend, termination, and relaunch
  - **Oracle:** Supported work is restored to the nearest safe state and any loss is explicit
  - **Activation evidence:** Accepted Mobile Product plus OS pause, background, or process-death evidence
  - **Source aliases:** mobile-interruption

- [mobile-permission-transition] When a required permission is denied, revoked, or auto-reset, what remains usable and how is safe access restored?
  - **Owner:** Mobile permission-lifecycle owner
  - **Purpose:** Define Product behavior across permission loss and recovery
  - **Oracle:** Unauthorized access never occurs, residual named capabilities work, and recovery is actionable
  - **Activation evidence:** Accepted sensitive Mobile permission contract
  - **Source aliases:** NEW

- [mobile-update-continuity] During a platform-mediated Mobile update, what remains usable and how does the consumer reach compatible state or safe recovery?
  - **Owner:** Mobile installed-population evolution owner
  - **Purpose:** Define Mobile update, defer, restart, and interruption behavior
  - **Oracle:** Supported state reaches a compatible version or explicit safe recovery
  - **Activation evidence:** Accepted Mobile distribution or update channel
  - **Source aliases:** NEW

## Implementation
