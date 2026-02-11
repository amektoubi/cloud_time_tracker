# Security & Compliance Constitution

## 1. Secrets Management (CRITICAL)
**Goal:** Prevent credential leakage.

*   **NO HARDCODED SECRETS:** You **MUST NOT** hardcode API keys, passwords, tokens, or private keys in source code.
*   **Environment Variables:** All secrets **MUST** be loaded from environment variables (e.g., `process.env`, `System.getenv()`).
*   **Safe Defaults:** If a variable is missing, the application **MUST** fail fast (crash on startup) rather than defaulting to a insecure value (like "password123").
*   **Examples:** When adding a new environment variable, you **MUST** update `.env.example` with a dummy value.

## 2. Injection Prevention (OWASP A03:2021)
**Goal:** Prevent SQLi, XSS, and Command Injection.

*   **SQL/Database:**
    *   You **MUST** use Parameterized Queries or the project's ORM (Hibernate/Prisma/TypeORM).
    *   String concatenation for SQL queries is **STRICTLY FORBIDDEN**.
*   **Command Execution:**
    *   Avoid executing shell commands (`exec`, `system`) if possible.
    *   If unavoidable, you **MUST** validate and sanitize all user inputs against a strict allowlist (Regex) before passing them to the shell.
*   **Cross-Site Scripting (XSS):**
    *   **Frontend:** Do not use "dangerous" rendering methods (e.g., `dangerouslySetInnerHTML` in React, `v-html` in Vue) unless explicitly requested and sanitized with a library like DOMPurify.

## 3. Broken Access Control (OWASP A01:2021)
**Goal:** Enforce tenant isolation and authorization.

*   **Tenant Isolation:** Every database query involving user data **MUST** include a filter for the current `user_id` or `tenant_id`.
    *   *Bad:* `SELECT * FROM orders WHERE id = ?`
    *   *Good:* `SELECT * FROM orders WHERE id = ? AND user_id = ?`
*   **Backend Validation:** Never trust the Frontend. Just because a button is hidden doesn't mean the API endpoint is secure. You **MUST** re-verify permissions on every backend request.

## 4. Data Privacy & Logging
**Goal:** Protect PII (Personally Identifiable Information).

*   **Sanitized Logs:** You **MUST NOT** log sensitive data.
    *   *Forbidden:* `logger.info("User login attempt", userObject)` (If userObject contains password hash).
    *   *Required:* `logger.info("User login attempt", { id: user.id, email: user.email })`
*   **Error Messages:** Production error responses **MUST NOT** reveal stack traces or database internal structures to the client. Return generic error messages (e.g., "An unexpected error occurred").

## 5. Dependency Security
**Goal:** Prevent Supply Chain Attacks.

*   **No New Packages:** You **MUST NOT** install new dependencies without explicit instruction or user confirmation.
*   **Lockfiles:** You **MUST** ensure `package-lock.json`, `yarn.lock`, or `pom.xml` are updated consistently.

## 6. Authentication Standards
**Goal:** Secure identity management.

*   **Passwords:** You **MUST NOT** write custom password hashing logic. Use established libraries (e.g., `bcrypt`, `Argon2`, or the framework's built-in Auth provider).
*   **Tokens:** JWTs **MUST** be signed with a strong secret and have an expiration time (`exp` claim).

---

## Agent Compliance Checklist
Before submitting code, ask yourself:
1.  [ ] Did I remove all hardcoded secrets?
2.  [ ] Did I use the ORM/Parameters for that query?
4.  [ ] Did I sanitize the inputs?
