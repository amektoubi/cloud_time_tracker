---
description: Iteratively executes the plan, delegating tasks to specialists and verifying results.
agent: orchestrator
---

# Command: Execute Implementation Loop

## 1. Initialization
1.  **Identify Context:**
    *   Get Issue ID from current branch (`git branch --show-current`).
    *   Read `.opencode/project-context.md` (to know the Stack and Test commands).
    *   Read `.opencode/issues/issue_[id].md` (to get the Plan).
2.  **Safety Check:** Ensure the working tree is clean (no uncommitted changes) before starting the loop.

## 2. The Execution Loop
**DIRECTIVE:** Execute the following cycle for **every** unchecked task (`- [ ]`) in the "Technical Plan" section.

### Step A: Task Selection
*   Find the **first** occurrence of `- [ ] [Task Description]`.
*   If no unchecked tasks remain, **EXIT LOOP** and proceed to "Finalization".
*   Announce: "🚀 Starting Task: [Task Description]"

### Step B: Delegation (The Specialist Handoff)
Analyze the task description and delegate to the correct agent based on `project-context.md`:
*   **IF** UI/Component/CSS -> Call `frontend_specialist`.
*   **IF** API/DB/Service -> Call `backend_specialist`.
*   **IF** Docker/CI/Config -> Call `devops_specialist`.

**Instruction to Specialist:**
> "Implement [Task Description]. Adhere strictly to the patterns in `project-context.md`. Only modify files relevant to this specific task."

### Step C: Verification (The Quality Gate)
Once the Specialist finishes:
1.  **Build/Lint:** Run the build command defined in `project-context.md` (e.g., `npm run build` or `mvn compile`).
2.  **Test:** Run the specific test associated with the change.
    *   *If tests pass:* Proceed.
    *   *If tests fail:* Trigger **ONE** self-correction attempt. "Tests failed. Read the error log and fix the code."
    *   *If tests fail again:* **STOP EXECUTION.** Notify the user: "❌ Task failed. Intervention required."

### Step D: State Persistence (Atomic Commits)
1.  **Git Commit:** Run `git add .` and `git commit -m "feat(issue-[id]): [Task Description]"`.
2.  **Update Plan:** Edit `.opencode/issues/issue_[id].md` and change the current task from `- [ ]` to `- [x]`.

### Step E: Loop
*   Return to **Step A**.

## 3. Finalization
*   **Verify Completion:** Scan the plan one last time to ensure all items are `[x]`.
*   **Report:**
    > "✅ All tasks in the plan have been implemented and verified.
    > 📅 Project History updated.
    > 💾 Changes committed locally.
    > Ready for Pull Request."
