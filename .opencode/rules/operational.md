# Operational Excellence & Agent Behavior

## 1. Communication Protocol
**Goal:** Maximum signal, minimum noise.

*   **Conciseness:** Do NOT apologize, do NOT use pleasantries (e.g., "I hope this helps"), and do NOT explain common knowledge.
*   **Action-First:** If a command is given, perform the action or provide the code immediately. 
*   **Status Updates:** Use clear emojis for status:
    *   🚀 = Starting task
    *   ✅ = Success/Passed
    *   ❌ = Error/Failed
    *   ⚠️ = Warning/Potential Risk
    *   🔍 = Investigation/Analysis

## 2. File Surgery (Precision Editing)
**Goal:** Keep Git diffs clean and readable.

*   **Surgical Changes:** Modify only the specific lines required for the task. Do NOT rewrite entire files to change a single function.
*   **Imports:** Only add new imports if they are used. Do NOT remove existing imports unless they are strictly causing errors or are unused.
*   **Formatting:** Follow the project's existing indentation and style. Do NOT perform "Global Reformatting" unless explicitly asked.
*   **Verify Before Read:** Before attempting to read a file, you MUST verify its path using `ls` or `tree` if you are not 100% certain of its location.

## 3. Truth & Hallucination Prevention
**Goal:** Reliability over speed.

*   **"I Don't Know" Policy:** If you cannot find a file, a variable, or a documentation entry, you **MUST** state "I cannot find [X]" and stop. Do NOT guess or hallucinate paths/APIs.
*   **Verify Assumptions:** If the `project-context.md` is ambiguous, you **MUST** ask the user for clarification before proceeding with a plan.
*   **Dependency Check:** Before suggesting a library, check the `package.json`, `pom.xml`, or `requirements.txt` to see if a similar library is already installed.

## 4. Execution & Tool Safety
**Goal:** Prevent environment corruption.

*   **Non-Destructive Commands:** Prefer commands that do not delete data. (e.g., use `cp` instead of `mv` for backups).
*   **Test Before Commit:** You **SHOULD** run the local build or test command before updating a task to `[x]` in the issue file.
*   **Process Persistence:** If a task requires a long-running process (like a dev server), start it in a background mode and check its health via logs.

## 5. State Management
**Goal:** Keep the `.opencode/` directory as the "Source of Truth".

*   **Issue Tracking:** You **MUST** update the `.opencode/issues/issue_[id].md` file immediately after completing a step.
*   **Progress Log:** Every significant code change **MUST** be accompanied by a 1-line entry in the "Progress Log" section of the issue file.
*   **Context Sync:** If you discover a project-wide pattern that isn't in `project-context.md` (e.g., "All components use this specific wrapper"), suggest an update to the user.

## 6. Git Discipline
**Goal:** Traceable history.

*   **Atomic Commits:** One task = One commit. 
*   **Meaningful Messages:** Follow Conventional Commits:
    *   `feat(scope): ...`
    *   `fix(scope): ...`
    *   `docs(scope): ...`
*   **Branch Integrity:** Never commit directly to `main` or `master` unless specifically instructed. Work only on the `issue-[id]` branch.

---

## The "Golden Rule"
**When in doubt: Analyze, Ask, then Act.**
*   **Analyze:** Read the context.
*   **Ask:** If instructions are unclear or risky.
*   **Act:** Implement the most robust, cleanest solution possible.
