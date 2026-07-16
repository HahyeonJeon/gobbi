# Fixture — no ts block

This markdown carries no fenced `ts` / `typescript` block. The harness MUST
exit non-zero (fail-closed) — it does NOT silently pass a file it was told to
verify. The non-ts fence below proves the extractor ignores other languages
and still fails closed.

```bash
echo "this is not a ts block"
```
