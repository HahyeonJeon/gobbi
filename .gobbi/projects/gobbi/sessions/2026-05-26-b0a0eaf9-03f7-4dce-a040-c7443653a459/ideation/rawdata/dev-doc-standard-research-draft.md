# Ideation research draft — development-document-level project-memory standard

> Pre-DISCUSSION research draft (Ideation Sub-steps A+C+D, iter1). NOT a locked artifact.
> The manager runs user discussion against the "Decisions for the user" list before any WORK persistence.
> Session: 2026-05-26-b0a0eaf9 · Feature: project-memory · builds on PR #272 (worktree chore/session-2026-05-25-a10c82d6).

## Framed Problem (Sub-step A)

**Root cause.** PR #272 fixed *where memory files live* (7-capability re-home) and *what they are named*
(naming standard + 29 renames + Principle 13). It did NOT define or enforce *how well each doc is written
as a development document* — there is no standard governing intra-doc prose quality, section structure,
abstraction level, or durable-vs-narrative content. Two concrete consequences, both with file-path evidence:
  1. **Frontmatter never retrofitted to the base schema.** Across ~147 feature+project content docs, the
     base schema (`name/description/type/scope/feature/status/created/session/tags`) appears on only ~14-25
     files (`name:` 14×, `description:` 14×, `created:` 24×), while the legacy/ad-hoc schema dominates
     (`date:` 95×, `slug:` 36×, `iter:` 23×, `loop:` 46×). 64 files still leak staging-only keys
     (`finding-id` 39×, `disposition` 52×, `confidence` 42×, `severity` 43×, `surfaced-by` 7×) that
     `memorization/rules.md` §2.3 mandates stripping on promotion. Key-spelling drift exists too:
     `promoted-from` (25) vs `promoted_from` (5); `addressed-in`/`addressed_in`/`addressed-by` (4 each);
     `finding-id`/`finding_id`/`finding-type`.
  2. **Cryptic session-internal references survive in doc BODIES.** #272 fixed filenames but the *content*
     still addresses a vanished session: `features/git-workflow/design/worktree-create-before-session-stamp.md`
     anchors insights as "T1-I-2, T1-E-1, T1-DQ-2; iter1 COD-PROJ-001" and sources as
     "rawdata/draft-iter3.md:308-313" — meaningless to a zero-context reader. This is the *same failure mode*
     the naming-standard mistake names, but in prose instead of filenames.

**Impact.** Who: every future agent that reads project memory at session start (the primary consumer) + the
user. Severity: degraded-knowledge-retrieval, not data loss — but it directly undercuts the reason memory
exists ("the next session can find them without restarting from zero", CLAUDE.md). Cost of inaction: the
inconsistency compounds every session; new docs are authored against templates while 147 legacy docs drift
further; the base-frontmatter promise (machine-addressable memory) is only ~15% realized.

**Success criteria (measurable).**
  1. A written dev-doc-quality standard exists that an evaluator can score a memory doc against (objective
     checklist, not vibes).
  2. Frontmatter base-schema conformance is measurable and the target is stated (e.g., 100% of live
     `features/` + project content docs carry base schema; 0 staging-key leaks outside `archive/`).
  3. Every doc TYPE has a required intra-doc section contract (what sections, in what order, what each holds).
  4. The standard leads with POSITIVE guidance + good/bad examples (per the naming-standard mistake), not
     prohibitions only.

**Prior attempts.** #272 (this worktree) shipped naming + frontmatter-schema + Principle 13 + type-boundary
rules — the *structural* half. `backlogs/feature-dir-frontmatter-full-normalization.md` already filed the
frontmatter retrofit as a known, deferred, bounded (~20-40 file) follow-up. The
`feature-dir-frontmatter-full-normalization` backlog + the two key mistakes are the on-record prior art.

**Counterfactual / steel-man.** "Memory docs change every session; a prose-quality standard plus a 147-file
rewrite is churn on a moving target, and #272 already shipped the standard that matters." Counter-evidence:
(a) the dominant doc types here (decisions, design, mistakes, learnings) are *evergreen* (bare-slug,
supersede-not-edit) — they do NOT change every session, so a one-time quality pass is durable; (b) #272's
standard is explicitly *naming + frontmatter + type-boundary* — it has a stated `Scope boundary` note that
it "governs memory files only" at the naming/frontmatter/structure level and says nothing about prose
quality or intra-doc sections; the gap is real, not imagined. The steel-man does correctly warn against a
big-bang 147-file rewrite — addressed by recommending wave-based, type-by-type retrofit (Design Fork 2).

**Re-framing conclusion.** A more ambitious framing hides inside the literal ask: the real deliverable is a
**"memory doc quality bar + conformance pass"** = (standard) + (retrofit the 147 legacy docs) + (optionally
encode into a Principle-13 quality facet / evaluation seed so it self-enforces). The literal "rewrite docs"
ask is the middle third; the standard is the front third; self-enforcement is the back third. Recommend
surfacing all three to the user as scope tiers (matches the brief's primary/secondary/tertiary).

## Internal insights (Sub-step C)

- **INT-1 — The existing standard's own scope note proves the gap.** `skills/memorization/rules.md` opens
  with "This standard governs memory files only … the naming convention, the frontmatter standard, and the
  structure rules" and §3 structure rules are directory-as-category / atomicity / scope — none address prose
  quality or section contracts. Source: `skills/memorization/rules.md` §intro + §3. Why: confirms the new
  standard is an *extension* of an existing doc, not a competitor — it should land as a new section in
  `rules.md` (+ optionally per-type "required sections" in the templates), not a new top-level doc.
- **INT-2 — Templates already encode per-type section contracts for STAGING, but promoted docs don't obey
  them.** The 17 `memorization/templates/*.md` (e.g., `decisions.md`, `design.md`, `feature-readme.md`)
  define section shapes; freshly authored docs (the two feature READMEs, the learnings, the changelog, the
  note) follow them and read well, while migrated sprint docs do not. Source: `templates/feature-readme.md`
  + contrast `features/project-memory/README.md` (clean) vs `features/git-workflow/design/worktree-create-
  before-session-stamp.md` (cryptic body). Why: the quality bar is partly *already written as templates* —
  the standard can largely promote template section-contracts into a doc-quality rule + extend them with a
  "no session-internal references in promoted bodies" clause.
- **INT-3 — The project already learned "a standard must teach GOOD, not just forbid."**
  `mistakes/naming-standard-needs-positive-guidance-not-just-blocklist.md` (priority high, this is a
  project-memory-scoped mistake). Why: the dev-doc standard MUST lead with a positive quality definition +
  real before/after examples drawn from this tree, or it will repeat the exact mistake #272 already made.
- **INT-4 — "Retire/remove without a named replacement" is a recorded trap.**
  `mistakes/design-literal-retire-instruction-without-replacement.md`. Why: directly governs how we handle
  session-narrative content (Fork 4) — we never *delete* narrative; we either keep journals as-is (they are
  a legitimate `notes/` type) or supersede-with-replacement, never strip-without-home.
- **INT-5 — The frontmatter retrofit is already scoped and de-risked.**
  `backlogs/feature-dir-frontmatter-full-normalization.md` estimates ~20-40 files, "no logic changes, low
  risk," and even specifies the grep + the Final-Gate extension. Why: the content-quality session can
  *absorb* this backlog as one of its retrofit waves rather than re-discovering it.

## External insights (Sub-step C)

- **EXT-1 — Diátaxis: four types, two axes, "don't mix types in one doc."** A doc serves action-vs-cognition
  and study-vs-work; "crossing or blurring the boundaries … is at the heart of a vast number of problems."
  Source: https://diataxis.fr/start-here/ . Why it applies: gobbi already HAS a type system (decisions /
  design / mistakes / learnings / notes / references), but Diátaxis gives the *positive prose rule* the
  current standard lacks — each type has a single job and must not bleed (a decision is not a journal; a
  design doc is not a changelog). Maps cleanly onto Principle 13's existing "must NOT bleed into adjacent
  types" clause, extending it from frontmatter-type to prose-content.
- **EXT-2 — ADR (Nygard): Title/Status/Context/Decision/Consequences is the canonical decision-doc shape.**
  Source: https://github.com/joelparkerhenderson/architecture-decision-record (Nygard template) +
  https://adr.github.io/ . Why: gobbi's `decisions/` + `design/` docs already approximate this
  (Context/Decision/Rationale/Consequences/Validation) — ADR validates keeping that section contract and
  names the one section gobbi docs under-use: **Consequences "including the negative ones, not just
  positive."** The standard should require a Consequences/Trade-offs section on every decision+design doc.
- **EXT-3 — Frontmatter as type signatures; `lastUpdated` enables staleness detection without reading.**
  Source: https://understandingdata.com/posts/frontmatter-as-document-schema/ . Why: validates gobbi's
  base-frontmatter bet (machine-addressable memory) and argues the *conformance* matters as much as the
  schema — an agent should filter on frontmatter before loading bodies. Justifies success-criterion #2
  (100% base-schema conformance, 0 staging-key leaks) as a real retrieval win, not pedantry.
- **EXT-4 — Karpathy/A-Mem markdown-wiki memory + Zettelkasten atomicity: human-readable atomic markdown
  pages + an index outperform vector DBs for agent memory.** Sources:
  https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an ,
  https://arxiv.org/html/2502.12110v11 (A-Mem). Why: confirms gobbi's "plain markdown trees, one record one
  concept, README index" architecture is the right shape for agent memory — so the session's job is to
  *raise quality within that shape*, not re-architect. Atomicity (already rule §3) is validated; the missing
  piece is per-page writing quality + an index/navigation layer (the tertiary scope).
- **EXT-5 — Docs-as-code: lint + CI gate doc quality; tie "last updated" to git, reserve human review for
  content judgment.** Sources: https://www.netlify.com/blog/a-key-to-high-quality-documentation-docs-
  linting-in-ci-cd/ , https://buildwithfern.com/post/docs-linting-guide , https://fiberplane.com/blog/
  drift-documentation-linter/ . Why: informs the *self-enforcement* tier — a mechanical frontmatter/section
  conformance check (extend the existing Final Gate grep) catches schema/staging-key violations, while the
  prose-quality bar stays an evaluation-perspective (human/agent judgment) seed. Directly shapes Design Fork 3.

## Proposed standard (Sub-step D — direction)

A **"development-document-level" memory doc** = a doc that a zero-context developer (human or agent) can read
top-to-bottom and understand the subject, the decision/knowledge, and the reasoning, WITHOUT access to the
session that produced it. Anchored elements:

- **Type-purity (Diátaxis EXT-1 + Principle 13 type-bleed clause).** Each doc serves exactly one type's job;
  no narrative bleeds into a decision, no changelog content in a design doc. Extend Principle 13's existing
  "must NOT bleed into adjacent types" from a frontmatter-type rule to a prose-content rule.
- **Per-type required section contract (INT-2 + EXT-2).** Promote the template section shapes into a binding
  "required sections" list per type. Decisions/design: Context → Decision → Rationale → Consequences/Trade-offs
  → Validation (ADR-shaped). Mistakes: What/Why/Recognize/Corrected (already enforced by mistake skill).
  Learnings: Insight/Context/Why-it-matters/How-to-apply/Counter-cases (the existing learnings already do
  this well). Notes (journal): What-happened/What-shipped/Deferred/Decisions-to-respect.
- **Self-contained prose / no session-internal references (INT-1 diagnosis + naming mistake INT-3).** A
  promoted doc body must not cite vanished-session coordinates as load-bearing content (`T1-I-2`,
  `COD-PROJ-001`, `draft-iter3.md:308-313`). Provenance lives in frontmatter (`session`, `created`) + a
  single optional "Source/Provenance" footer line, never inline as the doc's substance.
- **Frontmatter conformance (EXT-3 + INT-5).** 100% base schema on live docs; 0 staging-key leaks outside
  `archive/`; one spelling per key. This absorbs the existing normalization backlog.
- **Quality bar (positive, with examples — INT-3).** Lead with "here is what a good <type> doc looks like"
  + a real before/after table drawn from THIS tree (clean README vs cryptic design doc). Never ship a
  prohibition-only standard.
- **Navigation/index layer (EXT-4, tertiary).** Feature READMEs already index subdirs; extend to a memory
  quality where each README's "Subdirectories" lines stay accurate and a top-level index points into the 7
  features + project-tier dirs.

## Design forks (Sub-step D — for the user to rule)

See the report's "Design forks" + "Decisions for the user" sections for the full option sets and recommended
defaults. Summary: (F1) extend `rules.md` vs adopt Diátaxis taxonomy wholesale — REC extend; (F2) big-bang
vs wave-based retrofit — REC waves; (F3) skills/principles depth none/pointer/full-encode — REC light
pointer + mechanical gate; (F4) session-narrative handling — REC keep journals as `notes/`, strip inline
session-coords from evergreen types, never delete.

## Scenarios the standard must handle

- **Golden:** a new `decisions/` doc authored next session — passes type-purity + ADR section contract +
  base frontmatter + self-contained-prose checks with zero rework.
- **Edge (half-narrative/half-knowledge):** a migrated design doc with a real decision buried under
  `T1-I-2`/`draft-iter3.md:308` references — retrofit keeps the decision prose, lifts provenance to a
  footer, drops the inline coordinates; body becomes self-contained.
- **Failure (no clear home):** a doc that is genuinely a session journal mislabeled as a `design/` doc —
  resolution: reclassify to `notes/` (its real type), never force it into a quality it can't meet, never
  delete (INT-4).

## Validation methods per decision

- Standard exists & is scorable → an evaluator can run the section/frontmatter checklist on a sample doc and
  produce pass/fail per item (manual demo on 3 docs).
- Frontmatter conformance → mechanical grep gate (extend Final Gate to `features/` + `archive/features/`);
  target counts (base-schema 100%, staging-leak 0 outside archive).
- Prose quality / type-purity → evaluation-perspective seed (Project + Consistency) reviewing retrofit
  output; the "no session-internal references" check is grep-assistable (`grep -nE 'T[0-9]+-|iter[0-9]|
  draft-iter|COD-|row-[0-9]'` on promoted bodies).
- Self-enforcement → next-session smoke: a freshly authored doc passes the gate with no manual fix.
