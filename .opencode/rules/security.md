# Security & Compliance Rules

**Critical**: Violations are treated as blocking defects.

## 1. Backend (Java/Quarkus)
- **Mandatory Isolation**: Every query MUST be scoped by `user_id`. Use Hibernate `@Filter` to enforce this at the session level. Never rely on the client to provide the `user_id`.
- **Parameterization**: Use HQL/JPQL named parameters. Raw string concatenation in SQL is FORBIDDEN.
- **Validation**: All DTOs (Records) entering the system MUST use Jakarta Bean Validation (`@Valid`, `@NotBlank`, etc.).
- **Error Sanitization**: Never expose stack traces to the client. Use `ExceptionMapper` to return generic JSON error responses.

## 2. Frontend & Mobile (React/Capacitor)
- **Auth Token Hygiene**: 
  - **Web**: Access Tokens in memory; Refresh Tokens in `HttpOnly` Secure cookies. 
  - **Mobile**: Use `@capacitor/preferences` or Native Secure Storage. **NEVER** use `localStorage` for sensitive tokens.
- **XSS Prevention**: Avoid `dangerouslySetInnerHTML`. Sanitize all user-generated content before rendering.
- **Privacy**: Mask PII (Personally Identifiable Information) in logs. Never log passwords or tokens.

## 3. Infrastructure & API
- **Secret Management**: ZERO hardcoded secrets. Use environment variables injected via `docker-compose` or `devbox`.
- **CORS Lockdown**: In production, `Access-Control-Allow-Origin` MUST be restricted to the specific frontend domain. No wildcards (`*`).
- **Rate Limiting**: Public endpoints (`/login`, `/register`) MUST have rate limiting configured at the Ingress (HAProxy).

## ✅ Security Review Checklist
1. [ ] Is the data query filtered by the authenticated `user_id`?
2. [ ] Are all inputs validated before being processed?
3. [ ] Are secrets excluded from the code and commit history?
4. [ ] Is sensitive data encrypted at rest (Mobile) and in transit (HTTPS)?
