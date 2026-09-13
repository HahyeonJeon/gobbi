#!/usr/bin/env bash
# Codex setup writer and checker.

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/common.sh"

setup_parse_args "$@"
setup_resolve_project

if [[ "$check_only" == true ]]; then
  check_shared_layout
  check_codex
  finish
fi

append_shared_targets
targets+=(".codex" ".codex/AGENTS.md" ".codex/agents")
for role in "${roles[@]}"; do
  targets+=(".codex/agents/$role.toml")
done
guard_all_targets
if [[ -n "$codex_source" ]]; then
  printf 'gobbi setup: Codex role source %s\n' "$codex_source"
else
  printf 'gobbi setup: Codex role source unresolved, which indicates a mis-packaged plugin\n'
fi
print_setup_header codex
write_shared_layout
ensure_directory ".codex" "real directory"
create_empty_file ".codex/AGENTS.md"
write_codex_roles
record ".codex/config.toml" not-mine "measured inert; backlog-deferred"
print_setup_summary
