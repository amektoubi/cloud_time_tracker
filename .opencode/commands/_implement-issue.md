---
description: Iteratively executes the plan, delegating tasks to generic specialists and verifying results via context-defined standards.
agent: orchestrator
---

# Command: Execute Implementation Loop

## 1. Initialization & Context Loading
1.  **Identify Context:**
    *   Get Issue ID from current branch (`git branch --show-current`).
    *   **CRITICAL:** Read `.opencode/project-context.md`. Extract:
        *   *Backend Tech Stack* (to know which agent personality to trigger).
        *   *Frontend Tech Stack* (to know which agent personality to trigger).
        *   *Testing Commands* (Look under "Coding Standards > Testing").
    *   Read `.opencode/issues/issue_[id].md` (to get the Technical Plan).
2.  **Safety Check:** Ensure the working tree is clean. If `git status --porcelain` returns output, abort and ask user to stash changes.

## 2. The Execution Loop
**DIRECTIVE:** Execute the following cycle for **every** unchecked task (`- [ ]`) in the "Technical Plan" section of the issue file.

### Step A: Task Selection
*   Find the **first** occurrence of `- [ ] [Task Description]`.
*   If no unchecked tasks remain, **EXIT LOOP** and proceed to "Finalization".
*   Announce: "🚀 Starting Task: [Task Description]"

### Step B: Dynamic Delegation
Analyze the task description and delegate to the correct specialist.
*   **IF** UI/Component/CSS/Client-State -> Call `frontend_specialist`.
*   **IF** API/DB/Service/DTO -> Call `backend_specialist`.
*   **IF** Docker/CI/Terraform/Config -> Call `devops_specialist`.

**Delegation Prompt:**
> "Task: [Task Description].
> Context: Read `.opencode/project-context.md` for architectural strictness.
> Action: Implement this specific task. Do not implement future tasks yet."

### Step C: Context-Aware Verification
Once the Specialist finishes:
1.  **Build/Lint:** Run the build command suitable for the stack modified (e.g., `npm run build` or `mvn compile` as found in Context).
2.  **Test:** Run the specific test associated with the change.
    *   *If tests pass:* Proceed.
    *   *If tests fail:* Trigger **ONE** self-correction attempt with the specialist: "Tests failed. Read the error log below and fix the code."
    *   *If tests fail again:* **STOP EXECUTION.** Notify the user: "❌ Task failed. Human intervention required."

### Step D: Atomic State Persistence
1.  **Git Check:** Run `git status --porcelain`.
    *   *If empty:* specific task required no code changes? (Skip commit).
    *   *If changes exist:* Run `git add .` and `git commit -m "feat(issue-[id]): [Task Description]"`.
2.  **Update Plan:** Edit `.opencode/issues/issue_[id].md`:
    *   Change the current task from `- [ ]` to `- [x]`.
    *   Add a timestamp or specific note if useful.

### Step E: Loop
*   Return to **Step A**.

## 3. Finalization
*   **Documentation Check:** Did we change the Database Schema or API?
    *   *If yes:* Reminder to run `_sync-docs` or update `DAD.md`.
*   **Report:**
    > "✅ All tasks in the plan have been implemented and verified.
    > 📅 Project History updated.
    > 💾 Changes committed locally.
    > Ready for Pull Request."
