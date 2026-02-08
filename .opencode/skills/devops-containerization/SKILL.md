# DevOps & Containerization Standard

Standards for hermetic development environments and resource-efficient production containers.

## 🛠 Environment Standard
- **Package Manager**: Devbox (Nix) is the source of truth for runtime versions.
- **Runtimes**: OpenJDK 21, Node.js 25, Playwright 1.57.
- **Shell**: Direnv must be used to auto-load the Devbox environment.

## 🐳 Docker Standards
1. **Multi-Stage Builds**: All Dockerfiles must use separate `builder` and `runner` stages to minimize image size.
2. **Quarkus Optimization**: 
   - Dev: Use JVM mode for fast reloads.
   - Prod: Prioritize **Native/GraalVM** builds for low-memory self-hosting.
3. **Base Images**: Use `alpine` or `ubi-micro` variants to reduce the attack surface.

## 🏗 Infrastructure (Docker Compose)
1. **Networks**: Use named bridges (e.g., `cloud_time_tracker_network`). Never use default host networking.
2. **Persistence**: Use named volumes for PostgreSQL data to prevent data loss on container restart.
3. **Healthchecks**: Every dependency (Postgres, API) must include a `healthcheck` definition using `pg_isready` or HTTP probes.
4. **Observability**: The Coroot node-agent must run as a privileged container with `/sys/kernel/debug` access to enable eBPF monitoring.

## 🚫 Avoid
- Avoid hardcoding secrets; use `.env` files and inject them via `environment:` in Compose.
- Avoid using `latest` tags in production; lock images to specific versions (e.g., `postgres:16-alpine`).
- Avoid running containers as `root`; use non-privileged users within the Dockerfile.
