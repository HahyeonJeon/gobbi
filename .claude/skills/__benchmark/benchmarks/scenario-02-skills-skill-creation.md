# Scenario 02: _skills — Skill Creation from a Vague Prompt

Tests whether an agent loaded with _skills correctly handles a moderately vague skill creation request by discussing before writing, applying description craft principles, and producing a well-structured skill file.

---

## Context

The user is working in a project that already has several gobbi skills installed. The agent has been loaded with _skills and _discuss. No existing Slack notification skill exists in the project. The agent is asked to create a new skill. No prior context about trigger scenarios, integration points, or scope has been provided.

---

## Input

> "Create a skill for managing Slack notifications."

The agent should treat this as a task instruction. The prompt has a clear domain (Slack notifications) but is vague on scope: it does not specify whether the skill covers sending, receiving, or routing notifications; which trigger scenarios should load the skill; whether an existing notification system already handles some of this; or what other installed skills might overlap.

---

## Expected Behavior

The agent using _skills should:

- **Discuss before writing.** Recognize that the prompt is insufficiently specified to produce a well-targeted skill. Enter discussion mode before drafting anything. Ask about domain ownership, trigger scenarios, scope boundaries, and overlap with existing skills.

- **Apply description craft.** When drafting the SKILL.md description, demonstrate awareness of the loading model: the description is what an LLM uses to decide whether to load the skill. Frame the description around intent and trigger scenarios rather than listing the skill's contents. Calibrate precision and recall — specific enough to avoid misfiring on general Slack questions, broad enough to catch all notification management tasks.

- **Follow content writing principles.** Produce content that explains the why behind each guideline, not just what to do. Avoid constraint overload. Generalize beyond the immediate context so the skill remains useful as the notification system evolves.

- **Produce correct structure.** Valid SKILL.md with proper frontmatter (name, description, allowed-tools fields), under 200 lines, flat documentation structure (no subdirectories), core principles placed in the first ~50 lines after frontmatter.

---

## Scoring Rubric

Each criterion scored 0-10 by the evaluator agent.

### Discussion Quality (0-10)

Did the agent discuss before writing? Did it ask about the right dimensions — domain ownership, trigger scenarios, scope, and overlap with existing skills? Did it challenge the vague prompt rather than accepting it?

- **0-2:** Jumped straight to writing the skill without any discussion
- **3-5:** Asked some questions but missed key dimensions (e.g., asked about API credentials but not trigger scenarios or overlap)
- **6-8:** Asked about multiple dimensions, challenged assumptions, waited for answers before drafting
- **9-10:** Thorough discussion covering domain ownership, trigger scenarios, scope boundaries, overlap with existing skills, and what verification would look like — each question narrowed a specific unknown

### Description Quality (0-10)

Is the description intent-focused? Does it specify when to load the skill rather than what the skill contains? Is it precise enough to avoid misfiring on unrelated Slack questions while broad enough to catch all legitimate notification management tasks?

- **0-2:** Generic description that describes the file's contents ("This skill covers Slack notification settings and preferences") — would misfire on many prompts or fail to trigger for legitimate use cases
- **3-5:** Partially intent-focused but still describes features rather than trigger scenarios; precision or recall is off
- **6-8:** Intent-focused with clear trigger language, reasonable precision/recall balance; reads as "load me when..." rather than "I contain..."
- **9-10:** Sharp, distinctive description that reliably triggers for notification management tasks, stands out from adjacent skills (general Slack usage, alerting infrastructure), and would not trigger for unrelated prompts

### Content Principles (0-10)

Does the content teach mental models rather than enumerate procedures? Does it explain the why behind each guideline? Does it avoid constraint overload and remain useful beyond the immediate use case?

- **0-2:** Step-by-step procedures, configuration recipes, or code examples dominate the content
- **3-5:** Mix of principles and procedures; some guidelines lack reasoning; constraint list is long without prioritization
- **6-8:** Principles-based content that explains reasoning; most constraints carry a rationale; content is reasonably generalizable
- **9-10:** Every guideline explains why it exists; mental models are explicit; constraint count is low and each constraint is load-bearing; content would remain applicable as the notification system evolves

### Structure Correctness (0-10)

Valid SKILL.md with proper frontmatter? Within the 200-line budget? Flat documentation (no subdirectory references for a first-version skill)? Core principles in the first ~50 lines?

- **0-2:** Missing frontmatter, major structural issues, or no SKILL.md produced at all
- **3-5:** Frontmatter present but fields are incorrect, missing, or malformed; significantly over line budget
- **6-8:** Correct frontmatter with all required fields, within line budget, correct flat structure
- **9-10:** Perfect structure — all frontmatter fields correct, core principles within first 50 lines, constraints section present, within budget with room to spare

---

## Pass Threshold

Average score across all four criteria must be **7 or higher** to pass.

A score of 7+ indicates the agent reliably applies _skills principles when creating a skill from a moderately vague prompt. Scores below 7 indicate the skill's guidance is insufficient to prevent the agent from skipping discussion, producing poorly targeted descriptions, or delivering structurally incorrect output.
