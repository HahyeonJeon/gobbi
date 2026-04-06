---
name: _project-evaluation-user
description: User perspective for deliverable evaluation. Load when evaluating deliverables for real-world user impact.
allowed-tools: Read, Grep, Glob, Bash
---

# Project Evaluation — User Perspective

This perspective answers one question: does this deliverable actually work for the person who will use it?

Load this skill when evaluating project output — implementations, documentation, configuration, interfaces — from the viewpoint of the person who encounters it. The user perspective does not care how clean the internals are. It cares whether the deliverable reduces friction, behaves predictably, and gives the user what they came for.



---

## Core Principle

> **Internal quality that the user never experiences is not enough. Visible improvement is the measure.**

A refactoring that makes the code cleaner but leaves the user's workflow identical has delivered internal value, not user value. This is not a failure — internal improvements matter — but the user perspective must honestly assess whether this particular deliverable improves anything the user can experience. If it doesn't, that should be named.

> **Friction is the enemy. Every extra step, confusing option, or unclear behavior is a tax the user pays.**

Users do not experience a system's design. They experience the gap between what they expected to happen and what actually happened. The user perspective hunts for gaps.

---

## Evaluation Lenses

### Immediate Usability

Can the user use this right now, without reading a manual?

Assess the deliverable as someone encountering it for the first time with a real task in mind. Ask:

- Is the entry point obvious — where do they start, what do they invoke, what is the first thing they see?
- If something goes wrong in the first five steps, does the error message tell them what happened and how to recover?
- Are there configuration requirements or prerequisites that the user must satisfy before the deliverable works, and are those requirements surfaced clearly?

### Friction Audit

Does this deliverable introduce steps, decisions, or confusion that weren't there before?

New features often add capability while also adding complexity. The user perspective evaluates whether that trade-off is worth it — or whether the new complexity is accidental and fixable. Assess:

- Does the user now need to make a choice they didn't have to make before? Is that choice justified by real user needs, or is it an artifact of the implementation?
- Are there new concepts the user must understand to use this correctly? Are those concepts explained where the user will encounter them, or only in documentation they are unlikely to read?
- Does the deliverable behave differently in edge cases that users will hit — and does it behave in a way the user would recognize as correct?

### Understandability of Outputs

When the deliverable produces output — errors, responses, results, documentation — is that output readable by someone who didn't write the code?

Internal terminology, stack traces, and implementation details that leak into user-facing output are a user experience failure. Assess:

- Are error messages written for the user or for the developer who wrote the code?
- Does documentation or inline help use vocabulary the user already has, or vocabulary they'd need to learn?
- When something unexpected happens, does the deliverable tell the user what to do, or just what went wrong?

### Workflow Impact

Does this change improve the user's workflow, or only the code's internal quality?

This lens asks for an honest assessment of real-world impact. Some deliverables improve user experience meaningfully — fewer steps, fewer errors, faster results. Others improve internal structure without changing what the user experiences. Name which is true here. Assess:

- Would a user who didn't read the changelog notice this change in their daily work?
- If they did notice it, would they notice it as an improvement or as something different that they must now adapt to?
- Does the change reduce the number of things the user must remember, or does it add to that number?

---

## Signals Worth Investigating

These patterns are not automatic failures, but each warrants examination:

- A deliverable that improves correctness under conditions the user rarely encounters, while adding configuration the user must always maintain
- Error handling that logs internally but gives the user no actionable path forward
- New options or flags with names that would only make sense to someone who read the implementation
- Documentation that describes the system's behavior accurately but doesn't answer the question a new user is likely to ask
- A change that makes the common case harder in order to support an edge case the user may never hit

---

## Output Expectations

Report findings as specific user-facing observations: what the user experiences, under what conditions, and why the current deliverable produces that experience. Distinguish between failures that prevent use (blocking), failures that create ongoing friction without preventing use (significant), and improvements that would help but aren't necessary for the deliverable to work (minor).

Name at least one thing the deliverable gets right from the user's perspective. Evaluation that produces only a defect list gives no anchor to whoever acts on the findings.
