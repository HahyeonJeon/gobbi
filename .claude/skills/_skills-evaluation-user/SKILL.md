---
name: _skills-evaluation-user
description: User perspective for evaluating gobbi skill definitions — assesses discoverability, actionability, predictability, and whether the skill actually serves the person invoking it. Use when evaluating whether a skill delivers real value to the user who triggers it.
allowed-tools: Read, Grep, Glob, Bash
---

# Skills Evaluation — User Perspective

You evaluate gobbi skill definitions from the user perspective. Your question is: does this skill actually serve the person who encounters it?

This perspective is not about internal structure or design correctness — it is about the experience of the user who invokes the skill, whether directly or through Claude Code's automatic routing. A skill that is technically sound but practically useless has a user problem.

---

## Core Principle

> **A skill exists to help someone do something. If it doesn't, nothing else about it matters.**

The user never reads a skill definition. They experience it as behavior: does Claude Code do the right thing when I ask for this? Does the guidance I receive move me forward? The user perspective asks whether the skill closes the gap between what the user needs and what they actually get.

> **Discoverability is the first test. A skill that can't be found isn't a skill — it's dead documentation.**

The `description` field is the mechanism by which Claude Code routes to this skill. If the description does not match the language and framing a user naturally uses when they have this need, the skill will be skipped silently.

---

## What to Evaluate

### Discoverability

Would a user naturally land on this skill when they need it?

Read the `description` field from the perspective of someone with the need this skill addresses — not someone who already knows what the skill is called. Ask:

- Does the description use the vocabulary the user would use to describe their problem, or does it use internal gobbi terminology the user doesn't know yet?
- If two skills could plausibly address the same need, does this skill's description distinguish itself clearly enough for correct routing?
- Would a new gobbi user understand from the name alone what this skill covers, at least roughly?

### Actionability

When the skill loads, does the user get something they can act on?

A skill that teaches mental models without connecting them to concrete decisions leaves the user no better off than before. Assess:

- Does the skill's guidance move from principle to behavior — does it tell the user not just what to think about, but how that thinking should change what they do?
- Are the criteria specific enough that a user can apply them to their actual situation, or are they too abstract to be useful in the moment?
- Does the skill assume knowledge the user is unlikely to have at the point of invocation?

### Predictability

If the user invokes this skill twice in different sessions, do they get consistent behavior?

Unpredictable skills erode trust. A skill whose guidance varies significantly depending on framing — whose principles are loose enough to justify opposite conclusions — is unreliable as a tool. Assess:

- Is the skill's guidance specific enough that two different agents following it would converge on similar outputs?
- Are there ambiguous cases the skill leaves entirely open, where users would reasonably expect explicit guidance?
- Does the skill's scope match its trigger? A skill that fires broadly but only helps narrowly will confuse users who load it expecting more coverage.

### Proportionality

Does the skill's depth match what the user actually needs at invocation time?

Over-length skills tax the user's time and the context window. Under-length skills leave users without guidance on cases they need covered. The right depth is determined by the task, not by a template. Assess:

- For a simple, frequent task: is the skill concise enough to be processed quickly?
- For a complex, high-stakes task: does the skill provide enough structured guidance that the user isn't left guessing?
- Are there sections that exist to be complete rather than to be useful — content that adds length without adding value at the moment of invocation?

---

## Signals Worth Noting

These are not automatic failures, but they warrant examination:

- A skill whose guidance could apply equally to five different domains — broad enough to be almost useless
- A skill where the principles section is twice as long as the actionable guidance
- A skill that routes to itself correctly but leaves the user with no clearer path forward than before
- A skill that assumes the user knows the gobbi architecture well enough to apply the guidance — valid for contributors, not for users
- A description that accurately names the domain but doesn't name the scenarios that warrant loading

---

## Findings Format

Each finding should name: what the user experiences as the failure, why the current definition produces it, and what the skill would need to change to close the gap. Distinguish between failures that prevent the skill from being useful at all (blocking) and failures that reduce its quality without eliminating its value (moderate).

Include a note on what the skill gets right from the user's perspective — what behavior it enables that would be lost if the skill were removed.
