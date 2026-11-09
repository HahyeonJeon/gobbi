---
name: gobbi-skill
description: "Gobbi Skill guides designing and writing Gobbi-compatible skills and skill families. Use it when you create, substantially revise, migrate, or split a skill."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Gobbi Skill

Gobbi Skill guides authors when they create, substantively revise, migrate, or split a project skill. Use it to
classify the target as domain, operation, tool, or preference, write only what a capable agent needs, and route
the author to the matching type-writing skill.

## Principles

### State the goal and the evidence of done

A skill tells a capable agent what result to reach, how anyone can tell it is reached, and the few boundaries it
must keep; the agent chooses the method. Fix a method only where the order is fragile or irreversible, or where
another agent reads the result.

### Earn every line

Add guidance only when an agent would do worse without it, shown by an observed failure, a review finding, a
present requirement, or a boundary the user set. Remove a line when a fresh agent does the work well without it,
including after models improve.

### Improve through review, not up-front rules

Quality bars belong in the checks a reviewer applies to the result, because a reviewer can catch what a rule
written in advance cannot foresee. When the same failure repeats, prefer a check, a tool limit, or a structural
fix before adding a rule.

### Write for a cold reader in plain, exact language

A reader should not need the author's conversation or vocabulary to recover the skill. Use concrete actors,
actions, conditions, and evidence so the cold reader reaches the intended understanding directly.

## Rules

- **Write `description` as what the skill is and when to use it, in one or two short sentences.** The model
  picks a skill from this line alone, so it names the H1 title and the trigger and holds no policy or procedure.
- **Put the main point first in every paragraph, list item, and table description.** Readers act on the first
  sentence, so supporting sentences stay short and add only what is needed to apply it.
- **Treat section limits as ceilings, not targets.** Write at most four Principles and six Rules of up to two
  sentences each, and leave Rules out when nothing is binding rather than inventing one.
- **Give every Rule, constraint, and ordered Step a source and a one-line reason.** A source is the user, an
  accepted decision, a project rule, an external requirement such as an approval, an irreversible or external
  action, or safety, or a repeated observed failure; method and speculative risk are not sources.
- **Write each Rule as a plain bold lead followed by its reason.** Keep `MUST` and `NEVER` for safety, authority,
  and irreversible boundaries, and use no ALL-CAPS emphasis elsewhere, because emphasis makes agents over-apply
  rules.
- **Write `## References` as the two-column table `Name | Description` when the skill links internal documents.**
  A domain root and a skill that links none leave it out; cite external sources beside their claims.

## Procedure

### Phase 1 — Design the Skill with the User

Settle the design before writing. Done when the type, structure, and affected files are locked from a design
discussed with the user.

#### 1.1 Study the skill context

- Read the request, the current skill when one exists, its consumers, prior decisions and failures, and two or
  three related internal skills. Verify every claim about a behavior, command, path, schema, or permission
  against its live owner.
- Find what a capable agent already does well without the skill, from a fresh run on a representative case or
  from past results, and design the skill around what it gets wrong.

#### 1.2 Discuss the skill design with the user

- Discuss the evidence and proposed design with the user: actor, trigger, outcome, evidence of done, boundary,
  consumers, and necessary children.
- When meaningful alternatives exist, recommend a type and structure, explain the trade-offs, and let the user
  choose. Default to one `SKILL.md`; add a child only when it needs separate loading.

#### 1.3 Classify and lock the design

- Use the first matching row to select the skill type, then lock the structure and affected files.
- Attach a binding constraint to the operation, tool, or preference it governs. Do not create a standalone
  constraint-only skill.

| `skill-type` | Description |
|---|---|
| `domain` | A navigation-only root for one domain with at least two independently loadable direct children, each truthfully classified as operation, tool, or preference. |
| `operation` | Repeatable end-to-end work whose Phases each state a goal and the evidence that it is done, with ordered Steps only where order matters. |
| `tool` | The interface facts for one named tool, platform, or cohesive tool collection that an agent cannot reliably get elsewhere. |
| `preference` | The few defaults and conventions that keep a recurring agent choice consistent where variation has a real cost. |

### Phase 2 — Write the Skill

Write the canonical target under its type's guidance. Done when the canonical target has its frontmatter and
every section the matching type-writing skill requires.

#### 2.1 Load the type-writing guidance

- Load only the `{skill-type}-skill` child matching Step 1.3 and apply it. Return to Phase 1 if it exposes an
  incorrect type or an unresolved design.
- For a domain root, use only `domain-skill`, then write each child through a fresh Gobbi Skill pass.

#### 2.2 Write the canonical target

- Edit only the canonical project skill directory; generated, plugin, and runtime copies follow it. Do not link
  project skills into `.cursor/skills`, `.claude/skills`, `.grok/skills`, or `.agents/skills`, because Grok
  scans `.cursor/skills` and those links become a second Gobbi skill source beside the plugin.
- Write the type's core first (Procedure for an operation, Preferences for a preference, Manual for a tool, or
  the Child Skills table for a domain root), beginning the file with this frontmatter:

```yaml
---
name: {skill-directory-name}
description: "{what the skill is, with its H1 title, and when to use it, in one or two short sentences}"
allowed-tools: {smallest surface the skill's own work needs}
skill-type: domain|operation|tool|preference
---
```

- When only the user may start the skill, such as a session entry, add `disable-model-invocation: true` to the
  frontmatter, and for Codex an `agents/openai.yaml` beside `SKILL.md` holding `policy:` /
  `allow_implicit_invocation: false`. In Gobbi's own repository, `guard.py sync` generates that file in the
  package from the frontmatter, so the canonical skill holds only the frontmatter. The model then never loads
  the skill on its own, and other skills can still link to it by path.

### Phase 3 — Review and Improve the Skill

Make every remaining line earn its place. Done when every child and internal reference resolves, every
remaining line has a source, and an agent would do worse without it.

#### 3.1 Improve the structure

- Reshape the skill instead of only marking problems. Remove empty, repeated, or one-use sections, merge
  sections with one owner, and split sections with mixed owners.
- Trace every child and internal reference. Move each policy to one owner and remove copied guidance.

#### 3.2 Remove unneeded constraints

- Sort every Rule, constraint, Step, and Preference with Delegation's
  [sort table](../delegation/SKILL.md#sort-each-line-before-you-write-it). Delete method the agent can choose
  and lines without a source, and move quality bars into the checks a reviewer applies.
- Replace a rule that `allowed-tools`, a permission, a hook, or the project's tooling can enforce with that
  mechanism. In Gobbi's own repository, a skill-writing failure that review keeps finding becomes a check in
  this skill's `scripts/skill_checks/checks.py`; another project adds its checks to its own tooling.
- From the project root, run `python3 <this skill's directory>/scripts/check_skills.py` and fix every `ERROR`.
  A `NOTE` lists a `MUST` or `NEVER` lead to confirm it guards safety, authority, or an irreversible action.

#### 3.3 Improve sentences and vocabulary

- Put the main point first, split mixed claims, and remove filler, generic advice, speculative cases, and
  examples that change no decision. Keep each constraint's one-line reason.
- Use familiar, precise terms, one term per concept, and name actors, actions, and conditions directly.
- Read the result as a cold agent. Stop when every remaining line has a source and an agent would do worse
  without it.

## References

| Name | Description |
|---|---|
| [`domain-skill`](domain-skill/SKILL.md) | Guidance for writing a navigation-only domain skill and its child family. |
| [`operation-skill`](operation-skill/SKILL.md) | Guidance for writing repeatable work as goal-led Phases with evidence of done. |
| [`tool-skill`](tool-skill/SKILL.md) | Guidance for writing the interface facts of a named tool, platform, or tool collection. |
| [`preference-skill`](preference-skill/SKILL.md) | Guidance for writing the few defaults and conventions that keep agent results consistent. |
| [Delegation](../delegation/SKILL.md) | Owns the sort table that decides whether a line is a Goal, a Constraint, a Taste, or the agent's choice. |
