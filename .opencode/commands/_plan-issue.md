---
description: Collaboratively drafts, iterates, or modifies the Technical Plan. Writes to disk ONLY upon explicit user approval.
agent: orchestrator
---

# Command: Interactive Plan Architect

## 1. Context & State Loading
1.  **Identify Issue:** Run `git branch --show-current` to get `[issue_id]`.
2.  **Load Rules:** Read `.opencode/project-context.md` (Stack & Standards).
3.  **Load Issue:** Read `.opencode/issues/issue_[issue_id].md`.
4.  **Check Existing State:**
    *   Look for the header `## Technical Plan` in the issue file.
    *   **IF FOUND:** Announce: "⚠️ An existing plan was found. Do you want to **(M)odify** it, or **(O)verwrite** it entirely?"
    *   **IF NOT FOUND:** Proceed to "Analysis".
5.  **Targeted Scan:** Run `ls -R` or `tree -L 3` on relevant source folders defined in `project-context.md` to understand the current codebase state.

## 2. The Planning Loop (Safe Mode)
**PROTOCOL:** You are in **Consultant Mode**. You hold the "Draft Plan" in your temporary memory.
**CONSTRAINT:** Do **NOT** write to any file during this loop.

**Step A: Analysis & Drafting**
*   Based on the Issue Description (and existing plan if 'Modify' was chosen), draft a solution.
*   Check against `project-context.md`: Are we adding allowed dependencies? Are we following the folder structure?

**Step B: Presentation**
*   Output the **Draft Plan** in the chat using this format:
    ```markdown
    [DRAFT PLAN - NOT SAVED]
    ### Architecture
    ...
    ### Frontend Tasks
    - [ ] ...
    ### Backend Tasks
    - [ ] ...
    ```

**Step C: User Feedback**
*   Ask: *"Does this look correct? You can ask me to **Add feature X**, **Remove step Y**, **Redo completely**, or type **SAVE** to finish."*

**Step D: Iteration**
*   **IF User requests changes:**
    *   Update your in-memory draft.
    *   *Crucial:* If the user adds a feature, ensure you also add the corresponding Verification/Test step.
    *   **GOTO Step B** (Present the new draft).
*   **IF User says "SAVE" / "APPROVE":**
    *   **EXIT LOOP** and proceed to Section 3.

## 3. Plan Finalization (Write to Disk)
**TRIGGER:** Execute this ONLY after the user explicitly types "SAVE" or "APPROVE".

1.  **Format:** Finalize the plan using the strict schema:
    ```markdown
    ## Technical Plan
    ### Architecture
    [Summary]

    ### Frontend Tasks
    - [ ] [Task]
    
    ### Backend Tasks
    - [ ] [Task]

    ### Verification
    - [ ] [Manual/Automated Checks]
    ```
2.  **Persist:**
    *   Read `.opencode/issues/issue_[issue_id].md`.
    *   **Logic:**
        *   If `## Technical Plan` exists: **Replace** the text from that header downwards with the new plan.
        *   If it does not exist: **Append** the plan to the end of the file.
3.  **Notify:** "💾 Plan saved to disk. Run 'opencode run implement-issue' to start execution."
