---
description: Scaffolds a new Backend Entity (Entity, Record, Repo, Resource)
agent: java-architect
---

# Scaffold Backend Entity: [name]

1. Create a JPA Entity in `back/src/main/java/.../domain/[name].java` with UUID ID.
2. Create a Panache Repository in `.../repository/[name]Repository.java`.
3. Create a Response Record (DTO) in `.../dto/[name]ResponseDTO.java`.
4. Create a JAX-RS Resource in `.../resource/[name]Resource.java` with CRUD endpoints.
5. Create a Flyway migration file in `back/src/main/resources/db/migration/postgresql/`.
6. Ensure the entity includes `user_id` and the `@Filter` defined in security rules.
