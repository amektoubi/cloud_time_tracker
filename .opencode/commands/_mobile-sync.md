---
description: Builds frontend and syncs to Android
agent: automation-scripter
---

# Mobile Sync & Run

1. Detect local LAN IP using the logic in `front/run-android.sh`.
2. Update the `.env.local` file with the correct `VITE_API_URL`.
3. Run `npm run build` in the `front/` directory.
4. Run `npx cap sync android`.
5. Execute `npx cap run android` and report any connection errors from the emulator.
