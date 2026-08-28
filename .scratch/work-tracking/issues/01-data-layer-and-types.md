# 01: Core Domain Types, Google Sheets Data Layer & High-Fidelity Dataset

**What to build:**
A robust data integration and typing layer for Work Tracking that supports reading and parsing Google Sheets master list (`ลำดับงาน`) and detail tabs (`งานที่X`), with a high-fidelity fallback dataset mirroring all 24 tasks from the production sheets so development and testing can proceed seamlessly even without API credentials.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Define comprehensive TypeScript models (`Task`, `Subtask`, `DisciplineGroup`, `DisciplineHandover`, `FilterState`) in `src/types/index.ts`.
- [x] Implement Google Sheets API reader in `src/lib/google-sheets.ts` to parse 2D row arrays from tab `ลำดับงาน` into typed `Task` objects.
- [x] Build a complete 24-task fallback dataset in `src/lib/tasks-data.ts` matching the exact tasks, W/O numbers, dates, disciplines (W11-W14), equipment, and links from the master Google Sheet.
- [x] Provide Next.js API route (`src/app/api/tasks/route.ts`) serving task data with server caching and graceful fallback.
