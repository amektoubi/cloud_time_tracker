# Skill: AI Context & Documentation Governance

## 🛠 Documentation Architecture (The "Source of Truth")

You are responsible for maintaining the synchronization between the **Code** (Implementation) and the **Documentation** (Specification).

### Core Artifacts

- **Project Config:** `.opencode/project-context.md` (Technical Stack & Rules)
- **Living Documentation:** Located in the directory defined in `project-context.md` (Default: `documentation/docs/specs/`).
  - `FRD.md` (Functional Requirements): The "What" (User Stories, Acceptance Criteria).
  - `DAD.md` (Design & Architecture): The "How" (Database Schema, API Contracts, Flowcharts).

## 🎯 Mandatory Synchronization Patterns

You MUST trigger a documentation update in the following scenarios:

1. **Schema Drift:** If a task involves a database migration (SQL/NoSQL) or a change in data models, you MUST update the "Data Structure" section in `DAD.md`.
2. **API Evolution:** If a new endpoint is added, modified, or deprecated, you MUST update the "API Specifications" in `DAD.md`.
3. **New Features:** When an issue is completed, verify that the feature is reflected in `FRD.md`.
4. **Architectural Decisions:** If you make a significant technical choice (e.g., choosing a library for Auth over building custom), record it in an `ADR` (Architecture Decision Record) section or file.

## 📝 Maintenance Standards

### 1. Frontmatter & Metadata

If the documentation system (e.g., VitePress, Docusaurus, MkDocs) requires YAML frontmatter, you MUST preserve or update it correctly:

```yaml
---
title: [Component Name]
last_updated: [Current Date]
status: [Draft/Stable/Deprecated]
---
```

### 2. Diagramming (Mermaid)

Whenever explaining a complex flow, database relationship, or state machine, use **Mermaid.js** syntax. This ensures diagrams are version-controlled and renderable in Markdown.

- _ERD:_ `erDiagram` for Database Schemas.
- _Sequence:_ `sequenceDiagram` for API flows.
- _Flowchart:_ `flowchart TD` for Logic/Decision trees.

### 3. Cross-Linking

Always link requirements to implementation.
_Example: "This feature implements Requirement [FR-01] defined in FRD.md."_

## 🔄 The "Sync-Check" Protocol

At the end of every `implement-issue` task, the Agent must perform this mental check:

1. "Did I change how the system works?" -> **Update DAD.md**
2. "Did I add a new capability?" -> **Update FRD.md**
3. "Did I change a project-wide rule?" -> **Update .opencode/project-context.md**

## 🔍 Context Loading (Search Strategy)

Before starting any high-level planning:

1. **Locate Docs:** List files in the documentation directory.
2. **Read FRD:** Understand the business intent.
3. **Read DAD:** Understand the technical constraints.
4. **NEVER** propose a solution that contradicts the established `DAD.md` without first proposing an update to the `DAD.md` itself.
