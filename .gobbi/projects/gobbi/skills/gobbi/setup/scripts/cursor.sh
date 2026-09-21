#!/usr/bin/env bash
# Cursor setup writer and checker.

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/common.sh"

setup_parse_args "$@"
setup_resolve_project

if [[ "$check_only" == true ]]; then
  check_shared_layout
  check_cursor
  finish
fi

append_shared_targets
guard_all_targets
print_setup_header cursor
write_shared_layout
record ".cursor/" not-mine "plugin supplies Cursor agents via its declared agents key"
print_setup_summary
