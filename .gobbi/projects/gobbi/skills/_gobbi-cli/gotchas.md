# Gotcha: _gobbi-cli

Common CLI usage mistakes that agents make when interacting with the gobbi CLI.



---

### Not running gobbi note collect after subagent completes
---
priority: critical
---

**Priority:** Critical

**What happened:** After subagents completed, the orchestrator moved on without running `gobbi note collect`. The `subtasks/` directories remained empty. Downstream agents (synthesis, evaluation) found nothing on disk.

**User feedback:** Subtask collection must happen after each subagent returns, before any downstream agent runs.

**Correct approach:** After each subagent completes, run `gobbi note collect <agent-id> <n> <slug> <note-dir> [--phase <phase>]` to extract the delegation prompt and final result from the JSONL transcript. Verify the JSON file exists before launching any downstream agent that depends on it. Directory existence proves nothing — only the collect command populates subtask files.

---

### Using mkdir instead of gobbi note init
---
priority: critical
---

**Priority:** Critical

**What happened:** Agent created note directories manually with `mkdir -p` instead of using `gobbi note init`. The resulting directory was missing `metadata.json`, had no session ID embedding, and lacked the full subdirectory structure (step directories with `subtasks/` subdirs).

**User feedback:** Always use `gobbi note init` to create note directories.

**Correct approach:** Run `gobbi note init <project-name> <task-slug>` to create the note directory. The command generates `metadata.json`, embeds the session ID in the directory name, and creates all step subdirectories (`ideation/`, `plan/`, `research/`, `execution/`, `review/`) with their `subtasks/` subdirs. Manual `mkdir` bypasses all of this.

---

### Checking directory existence instead of running gobbi note collect
---
priority: critical
---

**Priority:** Critical

**What happened:** The orchestrator checked whether step subdirectories existed (via `ls` or `glob`) and treated directory existence as proof that collection had happened. The directories were empty — they are created at init time by `gobbi note init`, not by `gobbi note collect`.

**User feedback:** The orchestrator just checks directory existence without real collecting.

**Correct approach:** After every subagent returns, run `gobbi note collect` and then verify the subtask JSON file was created by reading it. `gobbi note init` creates empty directories at workflow start. Only `gobbi note collect` populates them with extracted transcript content. The sequence is: subagent completes, run collect, verify JSON file exists, then proceed.

