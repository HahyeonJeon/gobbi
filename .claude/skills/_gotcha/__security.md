# Gotcha: Security

Security patterns evaluators should check during code review. Each entry names a vulnerability class with concrete signals to look for. These complement the OWASP top 10 checklist in __execution_evaluation — that skill says *what* to check, this file says *how* to spot it.

---

### Injection (SQL, Command, Code)
---
priority: high
---

**Priority:** High

**What to look for:** String concatenation or template literals building SQL queries, shell commands, or code strings from user input. Functions like `exec`, `eval`, `system`, `child_process.exec`, `os.system`, `subprocess.shell`, `Runtime.exec`, or any database query method receiving unsanitized strings. Dynamic SQL built with string formatting rather than parameterized queries.

**Why it matters:** Injection is consistently the highest-impact web vulnerability. A single unsanitized input can yield full database access, arbitrary command execution, or code injection.

**Correct approach:** Use parameterized queries or prepared statements for all database access. Use `execFile` or argument arrays instead of shell string interpolation for system commands. Never pass user input to `eval` or equivalent. Validate and sanitize at system boundaries.

---

### Cross-Site Scripting (XSS)
---
priority: high
---

**Priority:** High

**What to look for:** User-supplied values inserted into HTML without encoding — look for `innerHTML`, `dangerouslySetInnerHTML`, `document.write`, `v-html`, or server-side template rendering that does not auto-escape. URL parameters reflected directly into page output. Event handler attributes built from user input.

**Why it matters:** XSS allows attackers to execute scripts in other users' browsers, steal session tokens, and impersonate users. Stored XSS persists across sessions.

**Correct approach:** Use framework auto-escaping (React JSX, Go `html/template`). When raw HTML insertion is unavoidable, sanitize with a dedicated library. Set `Content-Security-Policy` headers. Encode output contextually — HTML entities for HTML context, URL encoding for URLs, JavaScript encoding for script context.

---

### Insecure Deserialization
---
priority: high
---

**Priority:** High

**What to look for:** `JSON.parse` of untrusted input used directly without schema validation. `pickle.loads`, `yaml.load` (without `SafeLoader`), Java `ObjectInputStream.readObject`, or `unserialize` in PHP applied to user-controlled data. Any deserialization that reconstructs objects with methods or side effects from external input.

**Why it matters:** Deserialization of untrusted data can lead to remote code execution, privilege escalation, or denial of service. The object graph reconstructed may trigger unexpected code paths.

**Correct approach:** Validate deserialized data against a schema before use. Use safe loaders (`yaml.safe_load`, `JSON.parse` with Zod/Joi validation). Never deserialize with formats that reconstruct executable objects (avoid `pickle` for untrusted input, prefer JSON). Apply type narrowing after parsing.

---

### Hardcoded Secrets
---
priority: high
---

**Priority:** High

**What to look for:** Strings matching API key patterns (long alphanumeric strings, base64 blocks), `password =`, `secret =`, `token =`, or `key =` assignments with literal values. Connection strings with embedded credentials. Files named `.env` committed to the repository. Private keys or certificates in source code.

**Why it matters:** Secrets in code are secrets in version history — even if removed later, they persist in git. Leaked credentials enable lateral movement, data exfiltration, and account takeover.

**Correct approach:** Use environment variables or a secrets manager. Reference secrets by name, never by value. Add `.env` and credential files to `.gitignore`. Rotate any secret that was ever committed.

---

### Path Traversal
---
priority: high
---

**Priority:** High

**What to look for:** File system operations (`readFile`, `open`, `fopen`, `os.Open`) where the path includes user-supplied segments without normalization. Patterns like `path.join(base, userInput)` without verifying the resolved path stays within the intended directory. Presence of `../` or `..%2f` in URL parameters used for file access.

**Why it matters:** Path traversal lets attackers read arbitrary files (configuration, credentials, source code) or write to unexpected locations. Combined with upload functionality, it can enable code execution.

**Correct approach:** Resolve the full path with `path.resolve` or equivalent, then verify it starts with the intended base directory. Reject inputs containing `..` segments. Use allowlists for filenames when possible rather than constructing paths from user input.

---

### Broken Access Control
---
priority: high
---

**Priority:** High

**What to look for:** API endpoints that accept a resource ID (user ID, document ID, order ID) from the request without verifying the authenticated user owns or has permission to access that resource. Missing authorization middleware on routes. Role checks that only happen in the UI but not on the server. Direct object references in URLs without ownership validation.

**Why it matters:** Broken access control lets authenticated users access other users' data or perform actions beyond their role. It is the most common category in OWASP 2021 and often the easiest to exploit — just change an ID in the URL.

**Correct approach:** Enforce authorization at the server for every resource access. Verify ownership or role permission before returning data or performing mutations. Use indirect references (session-scoped handles) instead of exposing internal IDs when possible. Test with multiple user accounts to confirm isolation.
