# Desktop — Filesystem and Local Data

Own user-data locations, durable local writes, schema migration including downgrade, and secret handling at
rest. Policy lives in [`SKILL.md`](SKILL.md); this child owns the mechanics.

Local data is where a desktop application differs most sharply from a page. There is no server holding the
authoritative copy, no session that ends and discards the mess, and no deploy that migrates everyone at once.
The data sits on a machine this run will never see again, written by a version that may be older than the one
reading it.

Three of `DESK-FLOOR-02`'s safety members live here — the interrupted write, the schema migration including
its downgrade path, and the at-rest secret store's failure. Each is a place where a person can reach a
consequence they cannot foresee, refuse, or recover from, by doing something entirely ordinary.

> **Where this file states an obligation and not a mechanism, that is deliberate.** This skill's evidence
> register carries no owner document for the platform's own data interfaces — not for the user-data path
> interface, not for the at-rest secret store. **Those mechanisms are therefore marked as unread rather than
> described**, each with what would close it. The obligations below do not depend on them and are stated at
> full strength. `DESK-R26` requires exactly this split: verify a mechanism at its owner, or mark it.

## User-data locations per operating system

**Resolve the application's data directory through the platform's own interface. Never compose the path by
hand.** The three operating systems put per-user application data in different places, under different
conventions, and a hand-composed path is wrong on at least two of them and breaks on the third the moment a
person's account is configured unusually.

**UNVERIFIED here — the platform's own path interface and the per-system directory conventions were not read
for this skill.** No owner document for them appears in this skill's claim register, so none is named and no
directory layout is taught. *Closing condition:* read the platform's own application-path reference, record
the interface and the per-system result in the run's design record, and treat that record as the run's
authority.

What holds regardless of the mechanism, and what a run decides at `P5`:

- **One owned directory, and everything the application writes lives under it** — except what the person
  explicitly chooses a location for. A file the person picked belongs where the person picked it.
- **Separate the data by what its loss costs.** Configuration a person set by hand, work the person created,
  a cache that can be rebuilt, and diagnostic logs have different durability requirements and different
  privacy exposure. Storing them together forces the strictest requirement onto all of them, or — more
  commonly — the loosest.
- **A path that came from outside is untrusted input.** A dropped file, a deep link, a second-instance
  argument, and a configuration value are all reachable by someone other than the person using the
  application. Validate before the path reaches a file interface, per `DESK-R15`'s standard for any
  privileged effect.

## Durable write and corruption behavior

**Every local write is durable or detectably incomplete.** That is `DESK-FLOOR-02` member 3, and both halves
are permitted outcomes. What is not permitted is a third state: a file that reads as valid and is not.

Interruption is ordinary, not exceptional. A person forces the application to quit; the machine loses power;
an update installs while a write is in flight; the process is killed for using too much memory. A run that
treats interruption as an edge case has chosen the state it cannot recover from.

Two properties make the difference:

1. **A reader never observes a partially written file.** Write to a temporary file in the same directory,
   then replace the target with it. The replacement is the point: a reader sees either the whole old content
   or the whole new content.
2. **A reader can tell truncation from completeness.** A length, a checksum, or a terminal marker lets the
   reader reject a file rather than parse half of one into a plausible-looking value. Detectably incomplete
   is a fine outcome; silently incomplete is the failure.

**Parse persisted data at the boundary, into a domain type.** A file written by an older version of this
application is external input in exactly the sense a network payload is, and the compiler cannot check what a
previous release wrote. [`typescript/typing.md`](../typescript/typing.md) owns the
declaration-versus-verification distinction that makes a boundary parse work.

> **Never do file work synchronously in the privileged process.** It owns windows, interaction, and the
> interface thread **across every window at once**, so one synchronous read or one large parse freezes the
> entire application — every window, simultaneously. This is a documented performance property of the process
> model and a bug class with no analogue on the web, where a blocked script blocks one tab.
> [`process-model.md`](process-model.md) owns the context split this follows from.

## Schema versioning and migration, including the downgrade path

**Every persisted structure carries an explicit version.** Not an implicit one inferred from which fields are
present — a written version the reader checks first.

Forward migration is the half everyone builds: a newer version reads an older structure and upgrades it.

**The downgrade path is the half that gets skipped, and it is a floor member.** A person who installs an
older version after a newer one **must not lose or corrupt data**. This is not a hypothetical:

- release is irreversible and old versions persist on machines indefinitely (`DESK-R24`), so there is always
  an older version available to install;
- a person who hits a bug in a new release reinstalls the previous one — that is the normal human response,
  not a misuse;
- the older version then opens data written by a structure it has never seen.

Three behaviors are acceptable, and the run picks one per structure:

| Behavior | What the older version does | When it fits |
|---|---|---|
| Forward-compatible read | reads what it understands and **preserves** what it does not, writing the unknown parts back untouched | additive changes, which is most of them |
| Explicit refusal | detects the newer version, declines to open it, and says so — leaving the data intact | a structural change too large to read safely |
| Copy on upgrade | the newer version migrates a **copy** and leaves the older structure in place | a one-way migration that cannot be made reversible |

**What is never acceptable: silently rewriting a newer structure into an older shape.** That is the data-loss
path, and it is invisible until the person opens the newer version again and finds their work gone.

**Prove it by test, in this order:** install the newer version, create real data, install the older version
over it, open the data, then reinstall the newer version and confirm the data survived the round trip. A
migration proved only in the forward direction has proved half the obligation. This test needs packaged
artifacts, so it belongs with the install gate `DESK-R23` adds rather than with the unit suite.

## `safeStorage` and its failure mode

The obligation, which is `DESK-FLOOR-02` member 5:

> **An at-rest secret store fails closed. It never silently stores in the clear.**

When the platform cannot provide encryption at rest, the correct outcome is a failed write and a decision
routed to the run — never a quiet degradation to plaintext that leaves the caller believing the value is
protected. A caller that cannot tell the difference between an encrypted write and a plaintext one has no
security property at all, only the belief in one.

**UNVERIFIED here — the named store's own documented failure mode was not read for this skill.** Its owner
document does not appear in this skill's claim register, so no failure behavior is described and no
availability claim is made. *Closing condition:* read that interface's own reference, and record what it
actually does when the backing store is unavailable.

**The rule is written so it does not depend on the answer**, which is what `DESK-R26` requires of an
unverified mechanism:

1. **Treat availability as per-system and unknown until tested.** Verify on **each claimed operating system**
   what the store does when its backing service is missing — encrypt, fail, or degrade. Whichever it does is
   a fact about that system, and `DESK-FLOOR-04` member 6 already says evidence from one system supports no
   claim about another.
2. **Wrap it so the caller cannot proceed on an ambiguous result.** If the underlying interface can return
   something the caller might read as success when it stored plaintext, the wrapper is what turns that into a
   failure. Do not leave the fail-closed property depending on a behavior nobody has confirmed.
3. **Decide in advance what happens when it fails**, and make that a `DESK-G7`-class decision rather than a
   default: hold the secret only in memory for the session, ask the person each time, or decline the feature
   on that system. Silently continuing is the one option the floor forecloses.

**A secret the application must hold at rest is a design question before it is a storage question.** The
cheapest secret to protect is the one the application never holds — a short-lived token it can re-obtain
costs nothing when the store is unavailable, and a long-lived credential costs everything.

## What must never be written

Six entries. Each is a write that is reachable by ordinary means and hard to reverse once it has shipped.

1. **A secret in the shipped bundle.** Not in the archive, not minified, not encoded, not split across
   files. [`security.md`](security.md) owns this rule and the reason the packaging format supplies no
   protection; it is listed here because the temptation appears while writing the data layer, not while
   writing the security posture.
2. **A credential in the clear on disk** — including "temporarily," including in a file the application
   intends to delete, and including as a field inside an otherwise ordinary configuration structure. The
   fail-closed store above is the alternative, and declining to hold the secret at all is the better one.
3. **Anything outside the application's own data directory without an explicit user choice.** A person's
   file system is not the application's scratch space. A file the person picked goes where they picked it;
   everything else stays under the owned directory.
4. **Personal data the outcome does not need.** `DESK-FLOOR-03` requires minimization for participant data,
   and the same discipline applies to what the shipped application collects: data never written cannot leak,
   cannot be subpoenaed, and needs no retention policy.
5. **A secret or personal data in a log or a crash report.** Diagnostic output is the most-copied,
   least-guarded file the application produces — people paste it into issue trackers and support chats. Treat
   its contents as public by default and redact at the point of writing rather than at the point of sharing.
6. **A path composed from untrusted input without validation.** A deep link, a second-instance argument, a
   dropped file, and a value read from a configuration file can all carry a path that escapes the intended
   directory. Validate before the value reaches a file interface — this is `DESK-R15`'s standard applied to
   the file system as the privileged sink.

**The test that catches most of these is a read, not a run:** after an ordinary session, list every file the
application created and open each one. A run that has never looked at its own written output does not know
what is in it.
