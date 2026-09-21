#!/usr/bin/env bash
# Claude Code setup writer and checker.

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/common.sh"

setup_parse_args "$@"
setup_resolve_project

if [[ "$check_only" == true ]]; then
  check_shared_layout
  check_claude
  finish
fi

append_shared_targets
targets+=(".claude" ".claude/CLAUDE.md" ".claude/settings.json")
guard_all_targets
print_setup_header claude
write_shared_layout
ensure_directory ".claude" "real directory"
create_empty_file ".claude/CLAUDE.md"
write_claude_settings
record ".claude/agents/" not-mine "plugin supplies Claude agents from flat agents/"
record ".claude/skills/" not-mine "plugin owns skills; never created"
record ".claude/settings.json hooks.Stop" not-mine "plugin delivers the hook; setup writes none"
print_setup_summary
