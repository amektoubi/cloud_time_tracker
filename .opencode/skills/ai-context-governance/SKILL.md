# Skill: Context & Documentation Governance

## 🛠 Documentation Architecture
You are responsible for maintaining the "Semantic Core" of the project.
- **Project Configuration:** `.opencode/project-context.md` (Technical Stack & Rules)
- **Living Documentation:** Located in the directory defined in `project-context.md` (Default: `documentation/docs/specs/`)
- **Key Artifacts:**
  - `FRD.md` (Functional Requirements Document): The "What" and "Why".
  - `DAD.md` (Design & Architecture Document): The "How" (Database, API, Flowcharts).

## 🎯 Mandatory Synchronization Patterns
You MUST trigger a documentation update in the following scenarios:

1.  **Schema Drift:** If a task involves a database migration or a change in data models, you MUST update the "Data Structure" section in `DAD.md`.
2.  **API Evolution:** If a new endpoint is added or an existing contract changes, you MUST update the "API Specifications" in `DAD.md`.
3.  **New Features:** When an issue is completed, you MUST ensure the feature is reflected in `FRD.md`.
4.  **Architectural Decisions:** If you make a choice between two libraries or patterns, record it in an `ADR` (Architecture Decision Record) section or file.

## 📝 Maintenance Standards
### 1. Frontmatter & Metadata
If the documentation system (e.g., VitePress, Docusaurus) requires YAML frontmatter, you MUST preserve or update it correctly:
```yaml
---
title: [Component Name]
last_updated: [Current Date]
status: [Draft/Stable/Deprecated]
---
