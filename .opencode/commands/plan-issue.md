---
description: Generates an execution plan for the current issue
agent: planner
---

# Plan Current Issue

1. Detect the current issue ID from the git branch name.
2. Read `.opencode/issues/issue_[id].md`.
3. Analyze the requirements against `back/` and `front/` structures.
4. Append a "## Technical Plan" section to the issue file.
5. Append a "## Progress Tracking" section with a checkbox list of steps.
