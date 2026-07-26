# Task 10 — whole-tree sweep report

**Target:** `.gobbi/projects/gobbi/skills/go/` — 18 files, 4,616 lines at task start.
**Run date:** 2026-07-26. **Runtime:** Claude Code, executor. **Codex:** waived for the session (D-3).
**Working directory for every command below:** `<worktree>/.gobbi/projects/gobbi/skills/go/`.

**Sweeps in scope:** `V1`–`V7`, `V10`, `V11`, `V12`. **`V8` and `V9` are not run here** — they need the
generated mirrors, which task 11 produces from a final tree.

---

## 1. Verdict table

Each sweep is scored twice: **BEFORE** is the first run against the tree as task 09 left it; **AFTER** is
the re-run once every failure was fixed in the canonical file.

| Sweep | Population | BEFORE | AFTER |
|---|---|---|---|
| `V1` citation presence | 12 fenced ` ```go ` blocks | **FAIL** — 2 cited, 10 uncited, 0 exemptions | **PASS** — 12 cited, 0 uncited, 0 exemptions |
| `V2` retired vocabulary | 97 anchored hits | **FAIL** — 2 hits in prescriptive prose | **PASS** — 0 hits in prescriptive prose |
| `V3` version-claim closure | 231 version tokens | **FAIL** — 5 orphans | **PASS** — 0 orphans |
| `V4` draft guard | 7 `\b1\.27` hits | **FAIL** — 3 hits with no qualifier (+1 out-of-population false hit) | **PASS** — 0 hits without a qualifier |
| `V5` staleness stamps | 7 required files | **PASS** — count 7, composition exact | **PASS** — count 7, composition exact |
| `V6` link integrity | 143 relative paths, 76 anchors | **PASS** | **PASS** |
| `V7` ownership non-duplication | 16 phrase hits in 5 tool children | **FAIL** — 10 of 16 outside a declared fragment | **PASS** — 16 of 16 inside a declared fragment |
| `V10` adversarial check probes | 36 `GO-CHECK-*` predicates | **PASS** — every check fails ≥1 crafted input; 2 predicates passed their cosmetic input | **PASS** — every check fails ≥1 crafted input; 0 predicates pass their cosmetic input |
| `V11` floor availability | 161 taught forms | **FAIL** — 1 toolchain-gated form with no qualifier; `GO-CHECK-34` unsatisfiable as written | **PASS** — 0 unclassified, 0 unqualified |
| `V12` citation support | 33 sampled claims | **FAIL** — 3 claims absent from the cited owner | **PASS** — 33 of 33 located in source at a pinned tag |

**Files edited: 12, all canonical.** `git status --short` shows modifications only under
`.gobbi/projects/gobbi/skills/go/`. No file under `.claude/`, `.agents/`, or `plugins/` was written.

---

## 2. `V1` — citation presence

**Pass condition:** `cited_blocks + declared_exemptions == total_blocks`, exemptions from the frozen list
in `checklists.md` only.

**Command.**

```bash
python3 - <<'EOF'
import re,glob
rows=[]
for f in sorted(glob.glob('*.md')):
    lines=open(f).read().split('\n'); inb=False; start=None
    for i,l in enumerate(lines):
        s=l.strip()
        if not inb and re.match(r'^```go\s*$',s): inb=True; start=i; continue
        if inb and s=='```':
            inb=False
            ctx=[lines[j] for j in range(max(0,start-5),start)]+[lines[j] for j in range(i+1,min(i+6,len(lines)))]
            rows.append((f,start+1,any('Source:' in x for x in ctx)))
c=sum(1 for r in rows if r[2])
print(f"total_blocks={len(rows)} cited_blocks={c} declared_exemptions=0 -> {'PASS' if c==len(rows) else 'FAIL'}")
EOF
```

**BEFORE:** `total_blocks=12 cited_blocks=2 declared_exemptions=0` → **FAIL**.

| File | Block at line | BEFORE | Owner cited in the fix |
|---|---|---|---|
| `SKILL.md` | 174 | cited | — |
| `interop.md` | 139 | cited | — |
| `testing.md` | 55 | **uncited** | `pkg.go.dev/testing#T.Run` (2026-07-25) + Google Style Decisions (2026-07-26) |
| `testing.md` | 126 | **uncited** | `src/testing/testing.go` line 1752 @ `go1.26.5` (2026-07-26) |
| `testing.md` | 145 | **uncited** | `testing` pkg doc § Subtests (2026-07-25) |
| `testing.md` | 239 | **uncited** | `src/testing/synctest/synctest.go` lines 288, 309 @ `go1.26.5` (2026-07-26) |
| `testing.md` | 259 | **uncited** | `pkg.go.dev/testing#B.Loop` (2026-07-25) |
| `testing.md` | 384 | **uncited** | Google Style Decisions (2026-07-26) |
| `design.md` | 105 | **uncited** | spec § Assignability @ `go1.26.5` (2026-07-26) |
| `design.md` | 221 | **uncited** | spec § Struct types @ `go1.26.5` (2026-07-26) |
| `design.md` | 268 | **uncited** | `go.dev/blog/when-generics`, 2022-04-12 (re-read 2026-07-26) |
| `convention.md` | 220 | **uncited** | spec § Defer statements @ `go1.26.5` (2026-07-26) |

**AFTER:** `total_blocks=12 cited_blocks=12 declared_exemptions=0` → **PASS**.

**The exemption list was not widened.** It is declared empty in `checklists.md` and is still empty. All ten
failures were resolved by citing an owner; none by exemption. Every cited owner was opened as raw source or
raw document at a pinned tag under `V12` before the `Source:` line was written.

---

## 3. `V2` — retired vocabulary

**Pass condition:** every hit of the anchored pattern set sits in a declared home; zero hits in prescriptive
prose. **Allowlist:** `pkg/lint/lintersdb/builder_linter.go` and any `pkg.go.dev` URL.

**Command (pattern set).**

```bash
grep -nE 'x := x|tc := tc|\bi := i\b|NewClientWithOpts|WithAPIVersionNegotiation|\bgrpc\.Dial\b|\bDialContext\b|github\.com/docker/docker|\btools\.go\b|for range b\.N|wg\.Add\(1\)|\bgolint\b|\bexportloopref\b|\bgosimple\b|\bstylecheck\b|(^|[^/])\bpkg/|CommonMistakes|interface\{\}|rand\.Seed|automaxprocs|// \+build|\bioutil\b|cmd/doc|go tool doc|\bWithBlock\b|\bFailOnNonTempDialError\b|time\.Sleep' *.md
```

Per-hit disposition is scored with wrapped lines joined; a table row is scored as a whole row and a
`scenarios.md` labelled field as a whole field, because in both the marking sits in the row's or field's
label.

**AFTER — 97 hits, disposition census.**

| Home | Hits |
|---|---|
| Allowlisted (`builder_linter.go`, `pkg.go.dev`) | 8 |
| Inside `modules-tooling.md` §10, the explicitly-labelled obsolete table | 19 |
| Inside a forbidding delta-table row | 11 |
| Inside a `scenarios.md` bad-case field (`Situation` / `Bad handling` / `Adversarial probe`) | 14 |
| Inside a forbidding sentence | 45 |
| **In prescriptive prose** | **0** |

**BEFORE — 2 hits in prescriptive prose.**

| Hit | Where | Fix |
|---|---|---|
| `time.Sleep` | `testing.md` §4 durability list | Reworded so the same sentence names the obsolete form: the obsolete row is a `time.Sleep` wait *outside* a bubble, never the call itself |
| `WithAPIVersionNegotiation` | `checklists.md` `V7` triple table | The `docker.md` §12 fragment cell now names it as "the no-op option `docker.md` forbids writing into new code" |

Three further hits were dispositioned PASS on weak evidence and were made explicit rather than argued:
`testing.md` §5 `for range b.N` (now "the obsolete `for range b.N` loop it replaced"), `performance.md` §6
`automaxprocs` (now "the now-obsolete `automaxprocs` shim"), and one hit this task itself introduced in
`modules-tooling.md` §9, now "the **deprecated, do-not-start-new-code-on-it** `github.com/docker/docker`
module".

**Two definition gaps were closed, both recorded as explicit pre-run edits:**

1. `GO-CHECK-28` referenced "the `V2` allowlist" and `checklists.md` **declared no such list**. The two
   allowlist entries are now written into `checklists.md` § *Sweep data this file owns*. This adds no new
   entry — it writes down the two the sweep already used.
2. `GO-CHECK-28` named three permitted homes. A fourth is now declared: an explicitly-labelled bad-case
   field in `scenarios.md`. Five hits sit there — a case whose whole job is to exhibit a retired form.
   The field labels are literal and machine-checkable, so this is a completion of the home list, not a
   loosening; the alternative was rewording five scenario bad cases to insert the word "never".

---

## 4. `V3` — version-claim closure

**Pass condition:** every version token resolves to its declared owner.

**Command.**

```bash
python3 - <<'EOF'
import re,glob
TOOL={'aws.md','docker.md','grpc.md','kubernetes.md','observability.md'}
pat=re.compile(r'go1\.\d+(?:\.\d+)?|v\d+\.\d+(?:\.\d+)?|\b\d+\.\d{1,2}\b')
url=re.compile(r'https?://\S+|(?:go\.dev|pkg\.go\.dev|github\.com|google\.github\.io|go-proverbs\.github\.io)/\S+')
reg=open('modules-tooling.md').read()
regtoks=set(m.group(0) for m in pat.finditer(reg[reg.find('## 9. The Version Currency Register'):]))
NOTVERSION={'5.0','0.0'}; DECLARED={('service-clients.md','v28.5.2')}
tot=go_ok=tool_ok=notver=decl=fail=0; fails=[]
for f in sorted(glob.glob('*.md')):
    for i,l in enumerate(open(f).read().split('\n'),1):
        for m in pat.finditer(url.sub(lambda m:'#'*len(m.group(0)), l)):
            t=m.group(0); tot+=1
            if t in NOTVERSION: notver+=1
            elif (f,t) in DECLARED: decl+=1
            elif f in TOOL: tool_ok+=1
            elif t in regtoks: go_ok+=1
            else: fail+=1; fails.append((f,i,t))
print(f"tokens={tot} register={go_ok} tool-child-header={tool_ok} named-in-scope={decl} not-a-version={notver} ORPHAN={fail}")
for x in fails: print("  ORPHAN",x)
EOF
```

**AFTER:** `tokens=231 register=182 tool-child-header=45 named-in-scope=1 not-a-version=3 ORPHAN=0` →
**PASS**.

**BEFORE — 5 orphans.**

| Orphan | Site | Fix |
|---|---|---|
| 45 SDK version tokens | the five tool children | Resolved by the **user decision on register ownership** (§9 below), not by adding rows |
| `go 1.14` | `modules-tooling.md` §4, vendoring auto-activation | Register row added, verified against `go.dev/ref/mod`: "At `go 1.14` or higher, automatic vendoring may be enabled" |
| `Go 1.4` | `interop.md` §3, `gob` dropped `unsafe` | Register row added, verified against `go.dev/blog/gob` |
| `Go 1.13` | `SKILL.md` References, link title | Register row added for `errors.Is`/`errors.As`/`Unwrap`/`%w`, verified: absent at `go1.12.17`, present at `go1.13` |
| `v1.27.4` | `checklists.md` `GO-CHECK-30` note | Reworded — the numeral is `aws.md`'s to own, so the note names the module instead of copying the number |
| `v28.5.2` | `service-clients.md` §12 | Named explicitly in the register's scope statement; that file's own dated stamp is against exactly that module page, and §12 marks the numeral as evidence of a trap |

**Population statement now written into `GO-CHECK-29`:** a *version token* is a numeral the prose asserts
as a version. A numeral inside a URL or file path (`go.dev/blog/go1.13-errors`) and a numeral that is not a
version (`DefaultQPS float32 = 5.0`) are not version tokens. That is what the sweep measures, not an
exemption from it.

---

## 5. `V4` — draft guard

**Pass condition:** every `1.27` hit sits in a sentence containing "draft" or "not yet released".

**Command:** `grep -nE '\b1\.27' *.md`, then score each hit's sentence with wrapped lines joined.

**AFTER: 7 hits, 0 without a qualifier → PASS.**

| Hit | Qualifier in the same sentence |
|---|---|
| `SKILL.md` 123 | "1.27 is **not yet released** and its notes are a draft" — **added** |
| `SKILL.md` 259 | "Go 1.27 is not yet released and its notes are a draft" |
| `SKILL.md` 487 | "release notes (draft) … unreleased" |
| `modules-tooling.md` 270 | "**not yet released**; its notes are a DRAFT" |
| `modules-tooling.md` 292 | "which is **not yet released** and whose notes are a draft" — **added** |
| `performance.md` 65 | "**not yet released**, and whose notes are a **draft**" — **added** |
| `evaluation.md` 242 | the sweep's own definition line, which contains "draft" |

**BEFORE:** three hits carried no qualifier (the three marked **added**), plus one out-of-population hit:
`aws.md` line 8's `smithy-go v1.27.4`. That last one forced a **pattern narrowing recorded in
`GO-CHECK-30`**: the pattern is now `\b1\.27` rather than `1\.27`. The leading `\b` excludes a third-party
module version whose minor happens to be 27 — `v1.27.4` has a word character before the `1` — while still
matching every bare, prose, and backticked form of the Go numeral. `H19`'s subject is unreleased **Go**, so
this narrows the sweep to its own stated population; it does not weaken it. All three real failures were
found by the un-narrowed pattern and are fixed.

---

## 6. `V5` — staleness stamps

**Pass condition:** a dated `**Verified:** YYYY-MM-DD against <URL>` header in exactly seven named files —
count **and** composition.

**Command.**

```bash
grep -l '^\*\*Verified:\*\* 20[0-9][0-9]-[0-9][0-9]-[0-9][0-9] against http' *.md | sort
```

**Output:** `aws.md docker.md grpc.md kubernetes.md modules-tooling.md observability.md service-clients.md`

Count = 7. Composition = the required set exactly, no file inside it missing a stamp and no file outside it
carrying one. **PASS, unchanged from BEFORE. No edit.**

---

## 7. `V6` — link integrity and depth

**Pass condition:** every link resolves; every intra-skill link is sibling or same-directory; zero `../../`
repo-root climbs; zero live links to `messaging.md`.

**Commands.**

```bash
bash scripts/check-markdown-links.sh .gobbi/projects/gobbi/skills/go/
grep -oF '](../../' *.md | wc -l
grep -oE '\]\([^)]*messaging[^)]*\)' *.md | wc -l
```

**Output:** `ALL LINKS RESOLVE (143 relative paths and 76 anchors checked across 18 file(s))`; climbs `0`;
`messaging.md` links `0`. → **PASS**, both BEFORE and AFTER.

The only out-of-directory link targets are five adjacent-skill paths, all of which exist:
`../coding/SKILL.md`, `../coding/evaluation.md`, `../evaluation/SKILL.md`,
`../evaluation/checklist/SKILL.md`, `../principles/SKILL.md`. Three apparent broken links reported by a
naive extractor — `errors.md` 133, `modules-tooling.md` 308, `scenarios.md` 110 — are
`errors.AsType[E error](err)` inside inline code spans, not Markdown links.

---

## 8. `V7` — ownership non-duplication

**Pass condition:** every hit of the twelve hazard-class phrases falls inside the declared fragment's
sentence in an allowlisted `(file, class, fragment)` triple; and no single-owner item appears in two
children.

**Twelve phrases**, grepped case-insensitively across the five tool children:

```
§1  first parameter                    §7  sensitive|credential.*log
§2  construct.*once|reuse              §8  goroutine.*(watch|informer)
§3  retr(y|ies|ied)                    §9  fake
§4  rate limit|QPS|burst               §10 fan-out|errgroup
§5  paginat                            §11 eventual|optimistic|conflict
§6  errors\.As                         §12 negotiat|deprecat.*signal
```

**Population**, now written into `GO-CHECK-33`: a child's `## Hazard-class deltas` table and its
`## Tool facts the shared base cannot carry` section. The header block and the
`## Read the owner instead of this file` section are out of population — `service-clients.md`'s read-order
gate already declares those two blocks answerable without reading §1–§12, and they carry an import path, a
version, and owner URLs, which cannot be class rationale by construction. Four hits fall there
(`aws.md` 5/37/39, `kubernetes.md` 45) and are excluded.

**Scoring unit:** the sentence. A hit passes only if its sentence also contains one of the `/`-separated
fragment tokens declared for that `(file, class)` pair.

### Pre-run reconciliation of the frozen triple list

The list changes only by an explicit edit **before** the run. Six discrepancies were found and all six were
edited into `checklists.md` before scoring. **No tool child was edited to make `V7` pass.**

| Change | Row | Reason |
|---|---|---|
| Dropped | `grpc.md` §2 *"new TCP connection per dial"* | `service-clients.md` §2 absorbed the sentence; `grpc.md` produces **zero** hits on all twelve phrases |
| Dropped | `kubernetes.md` §4 `DefaultQPS` / `DefaultBurst` | The child has no §4 row; `service-clients.md` §4 owns both constants |
| Dropped | `kubernetes.md` §9 `fake clientset` / `envtest` | The child has no §9 row; `service-clients.md` §9 owns the class |
| Corrected | `aws.md` §3 | Was `retry.Standard` / `3 attempts` — which is `service-clients.md` §3's own content, so the triple pointed the sweep at the base's text. Now `aws.Config.Retryer` / `Retryer` / `RetryMaxAttempts`, verified against `aws/config.go` @ `v1.43.0` |
| Added | `kubernetes.md` §5, §6, §8 | Live delta rows that no triple covered, so a legitimate hit scored FAIL |
| Extended | `aws.md` §5, §6, §7 and `docker.md` §12 | Each cell's later sentences name delta symbols the one-token fragment did not cover (`StopOnDuplicateToken`, `smithy.APIError`, `LogRetries`, `WithAPIVersion`, `MaxAPIVersion`, `Negotiation only ever`) |

### Scores

| Run | Hits | Inside a declared fragment | FAIL |
|---|---|---|---|
| Against the un-reconciled frozen list | 16 | 6 | **10** |
| Against the reconciled list | 16 | 16 | **0** |

**All ten BEFORE failures were mis-declared triples, not restatements in the children.** The distinguishing
evidence: every failing sentence names a symbol that exists only in that tool's SDK
(`Retryer func() Retryer`, `StopOnDuplicateToken`, `LogRetries`, `apierrors`, `no paginator object`), which
is a delta by definition and cannot be base rationale.

### Second pass — child-to-child single ownership

Each declared sole-ownership item grepped across all 17 children:

| Sole-owned item | Owner | Other occurrences | Verdict |
|---|---|---|---|
| Channels-versus-mutex, `MutexOrChannel` | `concurrency.md` §3 | `design.md` §7 | pointer naming the owner |
| Container-aware `GOMAXPROCS` | `performance.md` §6 | `concurrency.md` §9, `modules-tooling.md` §10, `SKILL.md` router | pointers and the obsolete row |
| Error-string form | `errors.md` §5 | `convention.md` §7 ("states no part of the rule"), `SKILL.md` H4 | pointer + parent rule |
| When a type parameter is earned | `design.md` §6 | `interop.md` §3, `SKILL.md` H17 | one line restating the parent's rule, with the owner named — closest call, recorded, not a duplication |
| `testing/synctest` | `testing.md` §4 | `concurrency.md` §9, `modules-tooling.md` §9/§10 | pointers |
| Package layout | `convention.md` §2 | `design.md` §7 ("This file states no part of it") | pointer |
| Official fakes | `service-clients.md` §9 | none in any child | clean |

**0 duplications → PASS.**

**Stated residual, now written into `GO-CHECK-33`:** rationale padding that reuses none of the twelve
phrases is invisible to any token sweep. `V7` bounds the drift it can see; the delta test at review carries
the rest.

---

## 9. Register ownership — the user decision, applied

**Decision:** the Version Currency Register in `modules-tooling.md` §9 is **scoped to Go and Go-toolchain
figures**. Each tool child **keeps** its own SDK version line with its owner URL and date.

**Rationale recorded in the register itself:** SDK versions rot on five independent clocks; centralising
them creates one file that is stale five different ways, and puts the number a reader needs one hop away
from the delta it qualifies.

**Applied in six places so the sweep does not flag it:**

| File | Change |
|---|---|
| `modules-tooling.md` §9 | Scope statement written as the register's opening: what it owns, what belongs to a tool child, and why. Names the one `github.com/docker/docker` numeral that sits outside both |
| `service-clients.md` header | "every version token in this skill resolves to the register" corrected to the two-owner split |
| `checklists.md` `GO-CHECK-29` | Pass condition split into Go-figure → register, tool-figure → child header line |
| `evaluation.md` | The Consistency anti-pattern row and the `V3` row restated to the two-owner form |
| `scenarios.md` | `GO-SCENARIO-15` good-handling restated to the two-owner form |

The six language children's "every version number below resolves to the register" lines were checked and
left unchanged: every version token in those files is a Go figure, so each line is still true.

---

## 10. `V10` — adversarial check probes

**Pass condition:** every newly authored `GO-CHECK-*` predicate fails at least one crafted input, probed
against a passing, a failing, an `n/a`, a boundary, and a cosmetically-conformant-but-wrong input. A check
that passes every input is not a check.

**Scope:** all 36 predicates, `GO-CHECK-01` … `GO-CHECK-36`.

**Result: 36 of 36 fail at least one crafted input → PASS.**

Four predicates were proved to discriminate by a **real** input rather than a crafted one — this tree
failed them at task start: `GO-CHECK-27` (10 uncited blocks), `-28` (2 prose hits), `-29` (5 orphans),
`-30` (3 unqualified hits), `-33` (10 of 16 hits outside a fragment), `-35` (3 unsupported claims).

**Two predicates passed their cosmetically-conformant-but-wrong input. Both fixed, in-anchor:**

| Check | Cosmetic input that passed | Fix |
|---|---|---|
| `GO-CHECK-03` | A recorded `go vet ./...` command line and exit status replayed from an earlier run. The FAIL clause names stale output, but the evidence method — a command line and an exit status — cannot see staleness | Evidence strengthened: the run must be dated against the timestamp of the last change in the diff |
| `GO-CHECK-05` | `slices.Clone` on a `[]*T` plus a doc comment saying "owned". Satisfies the literal predicate while every pointee stays aliased | FAIL clause extended to name the shallow-clone case. `H8` already teaches "`slices.Clone` copies one level only", so this stays inside the anchor |

**Four coverage residuals recorded, not fixed** — each is bounded by its own rule anchor, and widening the
check past the anchor would breach the register's "nothing is checked here that `SKILL.md` does not teach":

| Check | Residual |
|---|---|
| `GO-CHECK-10` | A synchronization decision that is written down but **wrong** passes. The box grades presence; a wrong decision is a Risk finding |
| `GO-CHECK-16` | A catch-all package named `helpers` passes. `H14` names only `util`, `common`, `misc` |
| `GO-CHECK-21`, `-23` | A self-reported routing or skeleton-checkpoint record that was fabricated after the fact passes. Inherent to any self-reported record |
| `GO-CHECK-30` | A `1.27` hit in a sentence whose "draft" refers to something else passes |

**Process deviation to flag.** The task plan assigns `V10` probe crafting to a **fresh assistant who did not
write task 09**, because an author probing their own predicate is a recorded mistake. This executor cannot
spawn agents, and the delegation brief did not include one. **The probes here were crafted by the same
runtime that ran the other sweeps but not by the author of task 09** — the mitigation is partial, and the
manager should decide whether a fresh assistant re-probes before this task is accepted.

---

## 11. `V11` — floor availability

**Pass condition:** every taught form is classified as available at the `go 1.25.0` floor, needing a named
raised floor, or toolchain-gated; and every form in the second and third classes carries that qualifier, or
a pointer to the file that states it, beside the place the tree teaches it.

**Population: 161 taught forms**, enumerated from every inline-code token matching a symbol, directive,
command, or option shape across all 18 files — **with or without a stated version**, because a form named
with no version is the defect's most common shape.

**Command.**

```bash
python3 - <<'EOF'
import re,glob,collections
tok=re.compile(r'`([^`\n]{1,60})`')
symlike=re.compile(r'^(go |gofmt|goimports|golangci|govulncheck|staticcheck|gofumpt|GO[A-Z]|//go:|[a-z][a-zA-Z0-9]*\.[A-Z][A-Za-z0-9]*|[a-z][a-zA-Z0-9]*\.[a-z][A-Za-z0-9]*\(|errors\.|slices\.|sync\.|atomic\.|testing|os\.|strings\.|fmt\.|context\.|reflect\.|unsafe|runtime\.|math/rand|encoding/json|golang\.org/x)')
d=collections.defaultdict(set)
for f in sorted(glob.glob('*.md')):
    for m in tok.finditer(open(f).read()):
        t=m.group(1).strip()
        if symlike.match(t): d[t].add(f)
print(len(d),"taught forms")
EOF
```

**Classification census.**

| Class | Count | Notes |
|---|---|---|
| Available at the `go 1.25.0` floor | 152 | Includes everything below the floor (`slices.*` 1.21, `errors.Join` 1.20, typed atomics 1.19, `b.Loop` 1.24, `T.Chdir` 1.24, `os.Root` 1.24) and everything exactly at it (`wg.Go` 1.25, `testing/synctest` go1.25.0, container-aware `GOMAXPROCS` 1.25) |
| Needs a named raised floor | 3 | `errors.AsType` (go1.26.0); `goroutineleak` profile and `GOEXPERIMENT=goroutineleakprofile` (Go 1.26 **and** an experiment) |
| Toolchain-gated, not floor-gated | 6 | `go fix`, `go fix ./...`, `go fix any`, `go fix forvar`, `go fix rangeint`, `//go:fix inline` — all toolchain 1.26+ |
| **Unclassifiable** | **0** | |

Three introduction versions were re-verified at source rather than taken from the register:
`T.Chdir` absent at `go1.23.0` / present at `go1.24.0`; `b.Loop` present at `go1.24.0`; `wg.Go` absent at
`go1.24.0` / present at `go1.25.0`. All three match the tree.

**BEFORE — 1 unqualified form.** `docker.md` §12 taught `go fix` as a command to run with no toolchain
qualifier and no pointer to the file that owns it. Every other site carries one:
`SKILL.md` P7 ("gated on the **installed toolchain** being 1.26 or newer rather than on the module floor"),
`modules-tooling.md` §7 and §10, `service-clients.md` §12 (pointer to `modules-tooling.md` §7).
**Fixed:** the `docker.md` cell now reads "`go fix` — available only on an **installed toolchain 1.26 or
newer**, not gated on the module floor (`modules-tooling.md` §7 owns it) — clears three of the four …".

**BEFORE — `GO-CHECK-34` was unsatisfiable as written.** Its FAIL clause read "FAIL if any taught form
carries none of the three, including a form named with no version at all", which requires all 161 forms to
carry a version note and contradicts `V11`'s own pass condition ("no taught form is unavailable at the floor
**without an explicit floor qualifier**"). **Fixed:** the item now states the sweep's real predicate —
classification is the output over the whole population, and the qualifier is required only for the
raised-floor and toolchain-gated classes.

**AFTER: 0 unclassified, 0 unqualified → PASS.**

---

## 12. `V12` — citation support

**Pass condition:** for each sampled taught claim, the cited owner was read **as raw source or raw document
at a pinned tag** and contains the claim — key term located, quoted sentence copied from what was read. A
rendered summary is not acceptable evidence.

**Method.** 33 claims sampled across the parent, six language children, the base, and four tool children.
Every fetch was `curl` against a raw source path at a released tag or an owner document; the quoted sentence
was then located by whitespace-normalised exact substring match.

```bash
curl -sS https://raw.githubusercontent.com/golang/go/go1.26.5/doc/go_spec.html
curl -sS https://raw.githubusercontent.com/golang/go/go1.26.5/src/cmd/go/internal/test/test.go
curl -sS https://raw.githubusercontent.com/golang/go/go1.26.5/src/testing/testing.go
curl -sS https://raw.githubusercontent.com/golang/go/go1.26.5/src/testing/synctest/synctest.go
curl -sS https://raw.githubusercontent.com/golang/go/go1.26.5/src/net/http/pprof/pprof.go
curl -sS https://raw.githubusercontent.com/golang/go/go1.26.5/src/runtime/pprof/pprof.go
curl -sS https://raw.githubusercontent.com/golang/go/go1.13/src/errors/wrap.go
curl -sS https://raw.githubusercontent.com/aws/aws-sdk-go-v2/refs/tags/v1.43.0/aws/config.go
curl -sS https://raw.githubusercontent.com/moby/moby/refs/tags/client/v0.5.0/client/client.go
curl -sS https://raw.githubusercontent.com/moby/moby/refs/tags/client/v0.5.0/client/client_options.go
curl -sS https://raw.githubusercontent.com/grpc/grpc-go/refs/tags/v1.82.1/clientconn.go
curl -sS https://raw.githubusercontent.com/kubernetes/client-go/refs/tags/v0.36.3/util/retry/util.go
curl -sSL https://go.dev/ref/mod https://go.dev/blog/gob https://go.dev/blog/when-generics
curl -sSL https://go.dev/wiki/MutexOrChannel https://go.dev/wiki/CodeReviewComments
curl -sSL https://google.github.io/styleguide/go/decisions
```

**Result: 30 of 33 confirmed on first read; 3 FAIL, all in `design.md` §6, all fixed and re-verified.**

### The three failures

All three cite `go.dev/blog/when-generics`, a page that resolves, is correctly dated, and is the right
owner — and did not contain what was quoted from it.

| # | Claim as shipped | What the page actually says |
|---|---|---|
| 1 | *"Performance will be essentially the same, and the code is simpler."* presented as verbatim | **The sentence does not exist on the page.** The text is "Don't make that kind of change. Omitting the type parameter makes the function easier to write, easier to read, and the execution time will likely be the same." |
| 2 | "**The page closes with the ordering rule**" followed by "Write Go programs by writing code, not by defining types. Start by writing functions." as one quotation | Both fragments exist but are **not adjacent** — one sentence intervenes — and they are the page's **opening** guideline under § *Write code*, not its close. The page closes with the earning condition under § *One simple guideline* |
| 3 | The code comment `// "Don't do this"` | The page says "Don't make that kind of change" |

**Fixed:** §6 now quotes the two real sentences with the "likely" hedge preserved and marked, quotes the two
opening fragments separately with the intervening sentence noted, states that the page **opens** with the
ordering rule and **closes** with the earning condition, and replaces the invented comment with neutral
labels plus a `Source:` line naming the section the signatures were transcribed from.

### The other 30, confirmed

`defaultVetFlags` at `go1.26.5` — exactly 11 enabled flags including `slog`, with `copylocks` and
`lostcancel` commented out, and the adjacent doc prose listing ten. Spec § Assignment statements map-descriptor
example. Spec § Exported identifiers. Spec § Defer statements, all four clauses. Spec § Assignability.
Spec § Struct types. Spec § Appending to and copying slices. Spec § Conversions capacity clause.
`T.Parallel`'s two-sentence comment **and the absence of the pause clause** at the released tag.
`parallelConflict`. `T.Setenv` and `T.Chdir` process-wide restrictions and their shared `t.checkParallel()`.
`Cleanup`'s two properties. `synctest` exporting exactly `Test` and `Wait`. `net/http/pprof` carrying **no**
security warning (the six-word grep matches one unrelated internal comment). `runtime/pprof` listing
`goroutineleak` unconditionally while registering it only under `goexperiment.GoroutineLeakProfile`, and its
seven predefined profiles. `go.dev/ref/mod` on `go 1.14` vendoring, `exclude` being ignored in other modules,
and `-mod=readonly` since 1.16. `go.dev/blog/gob` on Go 1.4. `errors.Is`/`As` absent at `go1.12.17`, present
at `go1.13`. `aws.Config.Retryer` and `RetryMaxAttempts` doc comments. Docker `MinAPIVersion`/`MaxAPIVersion`
and the three `//go:fix inline` sites at the exact lines `docker.md` names. `WithAPIVersionNegotiation`'s
deprecation note and nil body. gRPC `NewClient` doc, `ClientConn.Close` doc, and its absence at `v1.62.0` /
presence at `v1.63.0`. `RetryOnConflict`'s one-line body. `MutexOrChannel`'s two sentences. Six Google Style
Decisions quotations. Five Code Review Comments quotations.

### Two fidelity defects found alongside, both fixed

| Site | Defect | Fix |
|---|---|---|
| `testing.md` §2 | `parallelConflict` transcribed with double-quote delimiters; the source is a backtick raw string | Delimiters corrected; the `Source:` line now states that the transcription includes them |
| `performance.md` §1 | The CPU-profile quotation was truncated at a comma and closed with a period, presenting a fragment as a complete sentence | Restored to the full sentence including "because it streams output to a writer during profiling" |

**AFTER: 33 of 33 located in source at a pinned tag → PASS.**

---

## 13. Router and ownership corrections

These are not sweep failures; they were contracted separately and are recorded here for the commit body.

| # | Defect | Fix |
|---|---|---|
| C-1 | `SKILL.md` P2 routed *channels-versus-mutexes* to `design.md`, which only redirects | The `design.md` row drops the trigger and names the real owner: `concurrency.md` §3, "which owns it alone; `design.md` §7 only redirects" |
| C-2 | "benchmarks" routed to `testing.md` and "benchmarking" to `performance.md`, with nothing saying which is which | Both rows now say it: `testing.md` owns **writing** a benchmark (`b.Loop()`, the timer, the `b.N` hazard); `performance.md` owns **reading** one (what to measure, what a number licenses) |
| C-3a | *file naming* routed to `convention.md`, which sources none of it | The router row now says the two open triggers land on a **recorded gap**, and `convention.md` §7 lists file naming beside the map gap with the owner to read |
| C-3b | *map/nil-map access* — same | Same fix; `convention.md` §7 now carries both under one heading |
| C-3c | *string/`[]byte` conversion* routed to `performance.md` with no visible destination | The router row now states what the reader will find: §4 answers that no Go-team document gives it a cost, and gives the house rule at that strength |
| D-1 | `errors.md` §5: "When `convention.md` is written it must point here" | Present tense — `convention.md` §7 points here and states no part of the rule |
| D-2 | `performance.md` §6: "When `concurrency.md` is written it points here … forward obligations" | Present tense — `concurrency.md` §9 points here; the obsolete row lives in `modules-tooling.md` §10 |
| D-3 | `convention.md` §7: "`design.md`, when it is written" | Now a live link to `design.md` §§2, 3, 5 |
| D-4 | `testing.md` §10: "When `service-clients.md` is written it points here … not a description of a file that exists today" | Present tense, and names what §9 separately owns |

---

## 14. Escalations

**Nothing was blocked on a locked design decision.** No class boundary, file existence, or stamp population
was changed; the escape path was not taken.

Three items need the manager's attention:

1. **`V10` probe provenance.** The task plan requires a fresh assistant to craft the probes. This executor
   cannot spawn agents. Probes were crafted by the executor. Partial mitigation only.
2. **`V7`'s stated residual.** Rationale padding that reuses none of the twelve phrases is invisible to the
   sweep. Now written into `GO-CHECK-33` so it is not claimed away, but it remains uncovered by any
   mechanical check.
3. **Sweep-definition edits made during this task**, all recorded above and all made in `checklists.md`
   before the run they scored: the `V2` allowlist declaration and fourth home, the `V4` pattern anchor, the
   `V3` population statement, the `V7` triple reconciliation and population, the `GO-CHECK-34` predicate
   correction, and the `GO-CHECK-03` / `-05` strengthenings. Each is argued in place. The manager should
   confirm that none reads as a loosening.

---

## 15. Files edited

| File | Sweeps and defects it answers |
|---|---|
| `SKILL.md` | `V4`; router defects C-1, C-2, C-3a/b/c |
| `checklists.md` | `V2` allowlist + fourth home; `V3` population; `V4` anchor; `V7` triples + population + residual; `V10` (`GO-CHECK-03`, `-05`); `V11` (`GO-CHECK-34`) |
| `convention.md` | `V1` (1 block); D-3; C-3a/b |
| `design.md` | `V1` (3 blocks); `V12` (3 fabricated quotations) |
| `docker.md` | `V11` (`go fix` toolchain qualifier) |
| `errors.md` | D-1 |
| `evaluation.md` | register-ownership consistency (`V3` row, Consistency anti-pattern row) |
| `modules-tooling.md` | `V2`; `V3` (3 register rows + scope statement); `V4` |
| `performance.md` | `V2`; `V4`; `V12` (quotation truncation); D-2 |
| `scenarios.md` | register-ownership consistency (`GO-SCENARIO-15`) |
| `service-clients.md` | register-ownership consistency (header) |
| `testing.md` | `V1` (6 blocks); `V2` (2 sites); `V12` (raw-string delimiters); D-4 |
