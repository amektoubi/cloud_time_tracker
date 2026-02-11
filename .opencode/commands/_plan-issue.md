---
description: Analyzes the issue and collaborates with the user to generate a finalized Technical Plan.
agent: orchestrator
---

# Command: Plan Issue Strategy

## 1. Context Loading
1.  **Identify Issue:** Run `git branch --show-current` to extract the `[issue_id]` from the branch name (format: `issue-[id]`).
2.  **Read Project Rules:** Read `.opencode/project-context.md` to understand the current Tech Stack, Architecture, and Directory Structure.
3.  **Read Issue Data:** Read the content of `.opencode/issues/issue_[issue_id].md`.
4.  **Scan Environment:** Run `tree -L 2 -I 'node_modules|target|dist|.git'` to understand the current high-level file structure without reading every file.

## 2. Analysis & Draft Strategy (Internal Monologue)
*   Compare the Issue Requirements against the Tech Stack defined in `project-context.md`.
*   Identify required changes:
    *   **Frontend:** Which components/pages need creation or modification?
    *   **Backend:** Do we need new Endpoints, DTOs, or Services?
    *   **Database:** Does the Schema change? (If yes, flag for migration).
    *   **Dependencies:** Do we need new packages? (Check if allowed).

## 3. The Planning Dialogue (Iterative Loop)
**PROTOCOL: INTERACTIVE MODE**
You will now enter a conversation loop with the user. Do **NOT** finalize the plan immediately.

1.  **Propose:** Output a "Draft Technical Plan" covering:
    *   *Proposed Architecture Changes*
    *   *List of files to create/modify*
    *   *Potential risks or edge cases*
2.  **Ask:** Ask specific clarifying questions to the user (e.g., "Should this be a modal or a new page?", "What is the validation logic for X?").
3.  **Refine:** Wait for user input. Update your mental model based on their answers.
4.  **Repeat:** Continue this loop until the user explicitly types: **"Approved"** or **"Go"**.

## 4. Plan Finalization (Write to File)
**TRIGGER:** Only execute this step after receiving User Approval.

1.  **Format:** Construct a structured plan using the following schema:
    ```markdown
    ## Technical Plan
    ### Architecture
    [High-level summary of the approach]

    ### Frontend Tasks
    - [ ] Create Component X
    - [ ] Update Store Y

    ### Backend Tasks
    - [ ] Create Entity Z
    - [ ] Add API Endpoint /api/v1/z

    ### Verification
    - [ ] Manual Check: [What to click/test]
    - [ ] Automated Tests: [Unit/Integration tests to run]
    ```
2.  **Append:** Append this content to the end of `.opencode/issues/issue_[issue_id].md`.
3.  **Notify:** "Plan finalized and saved. Run 'opencode run implement-issue' to start coding."
