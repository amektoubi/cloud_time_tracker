# AI Context & Governance Standard

Standards for maintaining "Source of Truth" context files within the VitePress documentation structure.

## 🛠 Context Stack
- **Primary Source**: `.opencode/` directory (Agents, Rules, Skills)
- **Documentation**: `documentation/docs/specs/` (VitePress Source)
  - `DAD.md` (Design & Architecture)
  - `FRD.md` (Functional Requirements)
- **Operational Guide**: `AGENTS.md` (Root level)

## 🎯 Mandatory Patterns
1. **Documentation Sync**: If architecture changes, the agent MUST update files in `documentation/docs/specs/`.
2. **VitePress Awareness**: Documentation is served via VitePress. Maintain correct frontmatter and cross-links within the `documentation/` folder.
3. **Atomic Rules**: Use `.opencode/rules/security.md` as the ultimate logic gate for all code generation.

## 📝 Document Maintenance
- **Specs**: Keep `documentation/docs/specs/DAD.md` in sync with database migrations and API changes.
- **Context Loading**: When starting a task, agents should semantic-search the `documentation/docs/` folder using MCP.
