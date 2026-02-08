---
description: Starts a new issue workflow
agent: automation-scripter
---

# Init Issue [issue_id]

1. Run `git checkout -b issue-[issue_id]`.
2. Create directory `.opencode/issues/` if it doesn't exist.
3. Use the GitHub CLI to fetch issue details: 
   `gh issue view [issue_id] --json title,body,number > .opencode/issues/issue_[issue_id].md`.
4. Clean the JSON into a readable Markdown format with sections: # Description, # Plan, # Progress.
5. Notify the user: "Branch created and issue downloaded. Run 'opencode run plan-issue' to begin."
