# Bash Automation: Secure Scripting Standard

Standards for portable, secure, and idempotent utility scripts within the project.

## 🛠 Scripting Standard
- **Environment**: Must assume execution within a `devbox` or Nix shell.
- **Pathing**: Always use relative paths based on the repository root.
- **Portability**: Use POSIX-compliant syntax where possible; avoid "Bash-isms" that break on Alpine Linux (Busybox).

## 🎯 Mandatory Patterns
1. **The Security Header**: Every `.sh` file must start with:
   ```bash
   set -euo pipefail
   IFS=$'\n\t'
2. **Idempotency**: Scripts should be re-runnable without side effects (e.g., use `mkdir -p` and `rm -rf`).
3. **Network Detection**: Logic for local development must detect the host's LAN IP to update API endpoints for mobile devices.
4. **Validation**: Check for mandatory environment variables or dependencies (like `mvn` or `npm`) before executing logic.
5. **Output**: Use `echo` for progress and `printf` for formatted data. Send errors to `stderr`.

## 🛡 Fault Tolerance
- **Traps**: Use `trap 'cleanup_function' EXIT` to remove temporary files even if the script crashes.
- **Explicit Exits**: Always return non-zero exit codes on failure.
- **Help Menus**: Provide a `-h` or `--help` flag for any script with parameters.

## 🚫 Avoid
- Avoid `sudo`: Use local permissions or container contexts.
- Avoid hardcoded paths like `/home/user/...`.
- Avoid silent failures; every major action should be logged to the console.
```
*Finally, we have: `ai-context-governance`. Proceed to the last one?**
