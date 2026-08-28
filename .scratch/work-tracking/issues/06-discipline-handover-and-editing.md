# 06: Discipline Handover Flow (W11-W14) & Subtask In-Place Editing

**What to build:**
Interactive editing and handover features on the task detail page (`/task/[id]`), allowing Section Heads to edit subtask progress percentages, dates, and status, and to execute a formal "Discipline Handover" modal transferring the active task from a completed discipline (e.g. W12) to the next collaborating discipline (e.g. W13).

**Blocked by:** 05: Task Detail Page with Grouped Subtasks & Daily Gantt Chart Matrix

**Status:** resolved

- [x] Implement inline or modal editing for subtask progress (%), start/end dates, duration (days), and status (`รอดำเนินการ`, `ดำเนินการ`, `เสร็จ`).
- [x] Build a "🤝 ส่งมอบงานให้หมวดถัดไป (Handover)" action button and modal.
- [x] In the Handover modal, allow selecting the recipient discipline from the task's collaborating W list, inputting handover date, and recording handover notes.
- [x] Upon handover confirmation, update the current discipline to 100% / `เสร็จ` and transition the target discipline to `ดำเนินการ` with an operational audit badge.
- [x] Persist updates back to the Google Sheet tab / API and update UI state immediately.
