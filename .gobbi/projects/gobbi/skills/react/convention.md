# React — Naming and Layout Conventions

**Ownership** — what a React codebase's units are called and where they sit: component and hook naming,
what each file exports, where a definition may be declared, how files are grouped and when something is
promoted to shared, import ordering, and the JSX writing rules.

**Split criterion** — `skill-writing` P4, category *a long lookup reference*: it is opened to settle one
naming or placement question and closed again. P4's other three categories do not describe it — no
artifact set, no per-unit orchestration, not a sub-procedure another consumer loads.

This doc **deepens, and does not restate,** `SKILL.md` Rule `H3` and the `convention.md` row of the P2
router.

**Two boundaries this file is defined by.**

- **Against [`typing.md`](typing.md):** that file owns what a declaration *means* to the compiler; this
  one owns what it *looks like* once the meaning is settled. "Which of `interface` and `type` to declare
  props with" is a language question and belongs to `typescript/typing.md` §8, which `typing.md` points
  at; "props are declared above the component and the type is exported beside it" is here. If a sentence
  would change behavior or type-checking, it is not a convention.
- **Against [`design.md`](design.md):** that file decides whether a component or hook is *earned* and
  what its prop surface *is*; this one decides what the result is *called* and where it *lives*. Props
  therefore pass through three files in a fixed order — shape in `design.md` §3, type in `typing.md` §2,
  style here.

**Read the evidence labels in this file carefully.** React publishes naming and JSX rules, and it
deliberately publishes no directory structure. Every sourced claim below carries its quotation; every
structural claim is labelled *ecosystem convention* and is this skill's house default, never a React-team
position. A reader who wants only the enforced parts can read §1 through §3 and stop.

---

## 1. Naming — where it is enforcement, not taste

Two naming rules are load-bearing in React, and neither is a style preference.

- **A component's name starts with a capital letter.** *"React components are regular JavaScript
  functions, but their names must start with a capital letter or they won't work!"* — lowercase in JSX
  resolves to a DOM tag instead of your component. The failure is immediate and loud, which is why this
  is documented here rather than carried as a rule.
- **A hook's name starts with `use` followed by a capital letter.** That one *is* a rule — `H3` — because
  its enforcement is invisible rather than immediate: React's linter identifies a hook by its name, so a
  misnamed hook silently loses the checks that would have caught a conditional call. `H3` owns the
  obligation; this file owns only the casing and the file mechanics around it.

Beyond those two, react.dev states one naming expectation and one anti-pattern, both quotable:

*"Regardless of which coding style you prefer, always give meaningful names to your component functions
and the files that contain them. Components without names, like `export default () => {}`, are
discouraged because they make debugging harder."* An anonymous default export costs you the name in every
stack trace and profiler row.

*Ecosystem convention* from here on in this section: PascalCase for components, camelCase for hooks after
the `use` prefix, and a file named for its primary export so that the name in a stack trace and the name
in the file tree agree. No React-team position states these; they are this skill's house default.

## 2. What a file exports, and where a definition sits

**Definitions go at the top level, always.** *"Components can render other components, but you must never
nest their definitions"* — react.dev's own annotation on the bad shape is *"Never define a component
inside another component!"*, and its verdict is blunt: *"The snippet above is very slow and causes
bugs."* The reason belongs to [`rendering.md`](rendering.md) §4 — a nested definition is a different
component identity on every render of its parent, so its state cannot survive — and the instruction is
*"Instead, define every component at the top level"*, passing data down by props.

**Default and named exports.** The mechanics are JavaScript's: *"A file can have no more than one default
export, but it can have as many named exports as you like"*, and *"with named imports, the name has to
match on both sides."* react.dev also records the common practice rather than mandating one: *"People
often use default exports if the file exports only one component, and use named exports if it exports
multiple components and values."*

**More than one component per file is allowed** and sometimes right: *"Components are regular JavaScript
functions, so you can keep multiple components in the same file. This is convenient when components are
relatively small or tightly related to each other."* The split is a judgment about crowding, not a rule
about counts.

## 3. The JSX writing rules

These are syntax, so they are enforced by the compiler rather than by taste. react.dev states three:

1. **Return a single root element.** *"To return multiple elements from a component, wrap them with a
   single parent tag"* — or use a Fragment, `<>...</>`: *"Fragments let you group things without leaving
   any trace in the browser HTML tree."*
2. **Close all the tags.** *"JSX requires tags to be explicitly closed: self-closing tags like `<img>`
   must become `<img />`, and wrapping tags like `<li>oranges` must be written as `<li>oranges</li>`."*
3. **camelCase most attribute names.** *"JSX turns into JavaScript and attributes written in JSX become
   keys of JavaScript objects"*, and *"JavaScript has limitations on variable names. For example, their
   names can't contain dashes or be reserved words like `class`. This is why, in React, many HTML and SVG
   attributes are written in camelCase."*

The exception to rule 3 is the one that matters for `H9`: `aria-*` and `data-*` attributes keep their
dashes and are written exactly as in HTML.

## 4. File layout — all of this is ecosystem convention

**react.dev deliberately prescribes no directory structure.** Nothing in this section is a React-team
position; it is this skill's house default, and a project with a different working convention is not in
violation of anything React says. It is stated because a skill that says nothing here leaves every reader
to invent it, and because the alternatives differ in a way that is worth naming.

**Group by feature, not by kind.** A `components/`, `hooks/`, `utils/` layout scatters one feature across
three directories, so every change touches all of them and no directory tells you what the application
does. Grouping by feature keeps a change inside one directory and makes the tree describe the product.

**Colocate what belongs to the unit.** A component's test, its styles, and its narrow helpers sit beside
it. The signal that colocation is right is that deleting the feature directory should delete everything
that only that feature used.

**Promote to shared on the second use, not the first.** A helper used once belongs to the feature that
uses it. When a second feature needs it, move it up to a shared location — the second use is the evidence
that the abstraction is real, and moving on the first is how a shared directory fills with things nobody
else ever wanted.

**Do not import across features.** A feature reaches down into shared code, never sideways into a sibling
feature's internals. A sideways import is the thing that turns two features into one, silently. When two
features genuinely need the same thing, that is the promotion signal above.

## 5. Import ordering — ecosystem convention

Also unstated by React, and worth a house default because a consistent order removes a class of diff
noise. Group imports, with a blank line between groups, in this order:

1. external packages;
2. internal shared modules;
3. modules from this feature;
4. relative siblings;
5. styles and assets.

Sort alphabetically within a group. **This is exactly the kind of rule a formatter or lint rule should
enforce rather than a reviewer** — but this skill names no tool and pins no version, because which tool
is current is a faster-moving question than this file can carry. Configure whatever your project already
uses; the ordering above is the convention, not the tool.

## 6. JSX formatting — ecosystem convention, with one caveat

Formatting is a settled question in most codebases because a formatter settles it. The house default is
therefore short: adopt the project's formatter and stop arguing. Where no formatter exists, the
conventions that matter for review are one attribute per line once a tag exceeds a line, closing brackets
aligned with the opening tag, and no logic in JSX beyond a conditional or a map.

The caveat is the one place formatting meets behavior: a `key` on a mapped element is not formatting, and
neither is the choice between `&&` and a ternary when the left operand can be `0` — a falsy number renders
as `0` rather than nothing. Those are `H4` and an ordinary JavaScript hazard respectively, not style.

## 7. Sources and evidence classes

Read on 2026-07-26; every quoted sentence located on that date. `SKILL.md`'s References register owns the
rule-level citations.

| Source | What it supports here |
|---|---|
| [Your First Component](https://react.dev/learn/your-first-component) | §1 — component names must start with a capital letter · §2 — never nest component definitions, define them at the top level, and multiple components per file |
| [Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components) | §1 — meaningful names for functions and files, and why anonymous default exports are discouraged · §2 — one default export per file, named imports matching on both sides, and the common default-versus-named practice |
| [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx) | §3 — the three Rules of JSX: single root element and Fragments, closing every tag, and camelCase attributes |

**Ecosystem convention in this file**, named where it appears and never as a React-team position: every
claim in §4 and §5 in full; PascalCase, hook camelCase, and file-named-for-its-export in §1; and the
formatting defaults in §6. That is a lot of convention for one file, and it is honest rather than
incidental — **react.dev deliberately prescribes no directory structure**, so a file about layout is
mostly house default by construction. §1 through §3 are where the sourced material is.

**Deliberately absent.** No formatter, linter, lint rule, plugin, or bundler is named anywhere in this
file, and no version is pinned. Which tool enforces an ordering is a question whose answer changes without
React changing, so it does not belong here.
