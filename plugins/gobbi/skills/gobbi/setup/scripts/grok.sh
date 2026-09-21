#!/usr/bin/env bash
# Grok setup writer and checker.

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/common.sh"

setup_parse_args "$@"
setup_resolve_project

if [[ "$check_only" == true ]]; then
  check_shared_layout
  check_grok
  finish
fi

append_shared_targets
guard_all_targets
print_setup_header grok
write_shared_layout
record ".grok/" not-mine "plugin supplies Grok agents and hooks"
record "~/.grok/hooks/hooks.json" not-mine "outside project root; removal command printed"
printf '\ngobbi setup: actions outside the project root, which only the user runs\n'
if [[ -z "${HOME:-}" ]]; then
  printf '  HOME is unset, so no user-level path was inspected\n'
elif [[ -e "$HOME/.grok/hooks/hooks.json" ]]; then
  printf '  %s exists and duplicates the plugin hook when both load; remove it with:\n' \
    "$HOME/.grok/hooks/hooks.json"
  printf '    rm -f %s\n' "$HOME/.grok/hooks/hooks.json"
else
  printf '  none; %s is absent\n' "$HOME/.grok/hooks/hooks.json"
fi
print_setup_summary
