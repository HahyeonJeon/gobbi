# Gotcha: Security

Security vulnerabilities that agents can introduce when writing or reviewing code. Each entry describes a concrete scenario where the vulnerability manifests in agent work, what a reviewer would say, and how to avoid it.

---

### Injection (SQL, Command, Code)
---
priority: high
---

**Priority:** High

**What happened:** Agent implemented a search endpoint that built the SQL query using string concatenation: `"SELECT * FROM users WHERE name = '" + req.query.name + "'"`. A reviewer caught that passing `' OR '1'='1` as the name would return all rows, and a crafted input could drop tables. The same pattern appeared in a shell command that passed user-supplied filenames directly to `child_process.exec`.

**User feedback:** "This is a textbook injection vulnerability. Never build queries or commands from user input with string concatenation."

**Correct approach:** Use parameterized queries or prepared statements for all database access. Use `execFile` or argument arrays instead of shell string interpolation for system commands. Never pass user input to `eval` or equivalent. Validate and sanitize at system boundaries. Look for: string concatenation building SQL queries, `exec`/`eval`/`system` calls receiving unsanitized input, template literals constructing shell commands.

---

### Cross-Site Scripting (XSS)
---
priority: high
---

**Priority:** High

**What happened:** Agent added a "welcome back" message by setting `element.innerHTML = 'Hello, ' + username`. A reviewer noted that if the username contained `<script>alert(1)</script>`, the script would execute in every visitor's browser. A separate case: agent rendered a search results page by reflecting the `?q=` URL parameter directly into the HTML response without encoding.

**User feedback:** "Never insert user-controlled values into the DOM with innerHTML. Use textContent or a framework that auto-escapes."

**Correct approach:** Use framework auto-escaping (React JSX, Go `html/template`). When raw HTML insertion is unavoidable, sanitize with a dedicated library. Set `Content-Security-Policy` headers. Encode output contextually — HTML entities for HTML context, URL encoding for URLs, JavaScript encoding for script context. Look for: `innerHTML`, `dangerouslySetInnerHTML`, `document.write`, `v-html`, server-side templates that bypass auto-escape, URL parameters reflected into page output.

---

### Insecure Deserialization
---
priority: high
---

**Priority:** High

**What happened:** Agent wrote a caching layer that stored and retrieved objects using `pickle.dumps`/`pickle.loads` with data read from a Redis key that users could influence. A reviewer flagged that deserializing attacker-controlled pickle data can execute arbitrary Python. A second case: agent used `yaml.load(user_input)` without `SafeLoader`, which can instantiate arbitrary Python objects.

**User feedback:** "pickle and unsafe yaml.load on untrusted input is remote code execution waiting to happen. Use safe alternatives."

**Correct approach:** Validate deserialized data against a schema before use. Use safe loaders (`yaml.safe_load`, `JSON.parse` with Zod/Joi validation). Never deserialize with formats that reconstruct executable objects — avoid `pickle` for untrusted input, prefer JSON. Apply type narrowing after parsing. Look for: `pickle.loads`, `yaml.load` without SafeLoader, Java `ObjectInputStream.readObject`, PHP `unserialize`, or `JSON.parse` used without schema validation on untrusted input.

---

### Hardcoded Secrets
---
priority: high
---

**Priority:** High

**What happened:** Agent added a third-party API integration and hardcoded the API key as a string constant: `const API_KEY = "sk-prod-abc123..."`. The key was committed to the repository. A reviewer noted that even if the key is removed in a later commit, it persists in git history and is permanently exposed. A second case: agent committed a `.env` file containing database credentials while setting up a local dev environment.

**User feedback:** "Secrets in code are secrets in history. Rotate that key immediately and never do this again."

**Correct approach:** Use environment variables or a secrets manager. Reference secrets by name, never by value. Add `.env` and credential files to `.gitignore` before creating them. Rotate any secret that was ever committed. Look for: string literals matching API key patterns (long alphanumeric strings, base64 blocks), `password =`/`secret =`/`token =`/`key =` assignments with literal values, connection strings with embedded credentials, `.env` files or private keys in staged changes.

---

### Path Traversal
---
priority: high
---

**Priority:** High

**What happened:** Agent implemented a file download endpoint that served files from a `/uploads` directory: `fs.readFile('/uploads/' + req.params.filename)`. A reviewer demonstrated that requesting `../../../etc/passwd` as the filename would read the system password file. The `path.join` call did not resolve to an absolute path and did not verify the result stayed within `/uploads`.

**User feedback:** "path.join does not protect against traversal. You must resolve the full path and verify it stays within the intended directory."

**Correct approach:** Resolve the full path with `path.resolve` or equivalent, then verify it starts with the intended base directory. Reject inputs containing `..` segments. Use allowlists for filenames when possible rather than constructing paths from user input. Look for: `readFile`/`open`/`fopen`/`os.Open` where the path includes user-supplied segments, `path.join(base, userInput)` without subsequent boundary verification, `../` or `..%2f` in URL parameters used for file access.

---

### Broken Access Control
---
priority: high
---

**Priority:** High

**What happened:** Agent implemented a document edit endpoint that accepted `documentId` from the request body and looked up the document directly: `Document.findById(req.body.documentId)`. A reviewer noted that any authenticated user could edit any other user's documents by supplying a different ID — there was no check that the authenticated user owned the document. A separate case: agent added an admin-only delete action but only hid the button in the UI, with no server-side role check on the API endpoint.

**User feedback:** "Authorization must be enforced on the server. Hiding UI elements is not access control."

**Correct approach:** Enforce authorization at the server for every resource access. Verify ownership or role permission before returning data or performing mutations. Use indirect references (session-scoped handles) instead of exposing internal IDs when possible. Test with multiple user accounts to confirm isolation. Look for: endpoints accepting a resource ID without an ownership check, missing authorization middleware on routes, role checks that only appear in frontend code, direct object references in URLs without validation.
