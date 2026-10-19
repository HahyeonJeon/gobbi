# Session records

A session record is an ignored file under `sessions/`. The mode that owns the session names the path. Durable
knowledge goes to `memory/`, whose directories are in [Memory directories](memory.md).

## sessions/

| Path | Definition | Naming | Writing |
|---|---|---|---|
| `sessions/` | Ignored recovery files for Gobbi sessions. | `sessions/<YYYY-MM-DD>-<slug>-<uuid>/` | Do not track this tree in Git. Do not delete a session root from Memory. Cleanup is a separately authorized worktree action. |
| `sessions/<session>/tmp/` | Drafts and scratch for that session. | Caller-named files. | Keep drafts here until the caller accepts a result into its phase directory. |
| `sessions/<session>/<phase>/` | Accepted session records for one phase. | The caller names the phase directory. | Write an accepted session record here. |
| `sessions/<session>/README.md` | Common matters every agent in the session must read. | `README.md` at the session root. | The mode creates this file when it creates the session. Write only those common matters. |
| `sessions/<session>/configuration.md` | The session configuration. | `configuration.md` at the session root. | The mode that owns the session writes it. |
