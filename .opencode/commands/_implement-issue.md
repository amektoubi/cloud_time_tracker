---
description: Automatically executes the next step in the current issue plan
agent: orchestrator
---

# Implement Next Issue Step

1. Detect current issue from branch name.
2. Read `.opencode/issues/issue_[id].md`.
3. Find the first task marked `[ ]`.
4. **Action**: 
   - If task is Backend: Delegate to `java-architect`.
   - If task is Frontend: Delegate to `react-expert`.
   - If task is Infrastructure: Delegate to `devops-engineer`.
5. Upon successful completion of the code changes:
   - Run relevant tests (JUnit or Vitest).
   - If tests pass, update the task to `[x]` in the issue file.
6. Report summary to user: "Step [Name] completed and progress updated."
