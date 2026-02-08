# Java Architecture: Quarkus & Panache Standard

Enterprise-grade patterns optimized for Quarkus 3.x and Java 21.

## 🛠 Tech Stack Standard
- **Framework**: Quarkus 3.30.8 (RESTEasy Classic)
- **Persistence**: Hibernate ORM with Panache Repository
- **Identity**: Strict UUID v4 (Client-generated preferred)
- **Data Flow**: JPA Entity <-> Java Record (DTO) <-> JSON

## 🎯 Mandatory Patterns
1. **Repository Pattern**: Inherit from `PanacheRepositoryBase<Entity, UUID>`. Do NOT use `PanacheEntity` (Active Record) to keep domain models clean.
2. **Stateless Resources**: Resources must be request-scoped. Use constructor injection for all dependencies.
3. **Transaction Management**: Use `@Transactional` on service or repository methods. Ensure transactions are as short as possible.
4. **DTO Transformation**: Use static mapper methods in Records (e.g., `toResponseDTO(Entity e)`) for simple mappings.
5. **Bean Validation**: Annotate DTOs with Jakarta Validation (`@NotBlank`, `@NotNull`, `@Min`).

## 🔐 Security Standards
1. **Row-Level Isolation**: Apply `@FilterDef` and `@Filter` to all user-owned entities.
2. **Context Injection**: Use `JsonWebToken` to extract the `sub` (Subject) and pass it to the filter parameters.
3. **Password Security**: Use Argon2 for hashing. Never log or store raw credentials.

## 🚫 Avoid
- Avoid `PanacheEntity` (Active Record).
- Avoid vendor-specific SQL; stick to HQL/JPQL for SQLite/Postgres portability.
- Avoid catching generic `Exception`; use specific domain exceptions.
