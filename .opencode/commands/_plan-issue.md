---
description: Generates an execution plan for the current issue
agent: planner
---

# Plan Current Issue

1. Detect the current issue ID from the git branch name.
2. Read `.opencode/issues/issue_[id].md`.
3. Analyze the requirements against `back/` and `front/` structures.
4. plan a solution for the issue
5. We will iterate over the plan until we agree together on a final version. ask me any questions needed to ensure we have a solid plan.
6. Once we have the final plan Append a "## Technical Plan" section to the issue file and Append a "## Progress Tracking" section with a checkbox list of steps.
