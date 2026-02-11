---
description: Initializes a new development workspace for a specific issue.
agent: orchestrator
inputs:
  - issue_id (required)
---

# Command: Initialize Issue Workspace

## 1. Environment & Safety Checks
*   **Verify Tooling:** Check if the GitHub CLI (`gh`) is installed. If not, abort and tell the user to install it.
*   **Verify State:** Check `git status`. If there are uncommitted changes, ask the user to stash or commit them before proceeding.

## 2. Context Preparation
*   **Create Directory:** Ensure the directory `.opencode/issues/` exists.
    *   *Command:* `mkdir -p .opencode/issues`

## 3. Branch Management (Idempotent)
*   Attempt to create the branch `issue-[issue_id]`.
*   If the branch already exists, simply check it out.
    *   *Logic:* `git checkout -b issue-[issue_id] || git checkout issue-[issue_id]`

## 4. Data Fetching & formatting
*   **Fetch:** Execute the GitHub CLI command to get the raw data.
    *   *Command:* `gh issue view [issue_id] --json number,title,body`
*   **Transform:** Take the JSON output from the previous step and write a **clean Markdown file** to `.opencode/issues/issue_[issue_id].md`.
*   **Template (STRICT):** The file MUST use the following structure exactly:

    ```markdown
    # Issue #[number]: [title]

    ## Description
    [Insert Body from GitHub here]

    ## Context
    - **Created:** [Current Date]
    - **Status:** Initialized

    
    ```

## 5. Finalization
*   **Output:** Print a success message:
    > "✅ Workspace ready on branch 'issue-[issue_id]'. Issue details saved to .opencode/issues/issue_[issue_id].md."
*   **Constraint:** You are **FORBIDDEN** from generating a plan, writing code, or modifying any other files at this stage. Wait for the user to run the planning command.
