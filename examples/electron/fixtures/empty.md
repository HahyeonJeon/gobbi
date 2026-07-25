# Fixture — no ts block

This markdown carries no fenced `ts` block. The harness MUST exit non-zero
(fail-closed) — it does NOT silently pass a file it was told to verify. The
`sh` fence below is on the non-code allowlist, so it proves the extractor
ignores an allowlisted language and still fails closed rather than counting it
as coverage.

```sh
echo "this is not a ts block"
```
