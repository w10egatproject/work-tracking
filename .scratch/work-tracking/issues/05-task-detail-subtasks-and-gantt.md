# 05: Task Detail Page with Grouped Subtasks & Daily Gantt Chart Matrix

**What to build:**
A dedicated task detail page (`/task/[id]`) mirroring the exact structure of Google Sheet task tabs (e.g. `งานที่1`), including top summary metadata card, collapsible discipline section headers (W11-W14), subtask rows with duration and progress %, and an aligned daily/monthly Gantt Chart timeline matrix with colored bars.

**Blocked by:** 01: Core Domain Types, Google Sheets Data Layer & High-Fidelity Dataset

**Status:** resolved

- [x] Render top metadata card displaying Task No, Title, Start Date, W/O, Total Days, Expected Completion Date, Equip, and W Codes.
- [x] Implement grouped subtasks table with collapsible headers for each discipline (e.g. `W12 : เครื่องกล`, `W13 : ซ่อมเครื่องจักรกล`).
- [x] Build daily/monthly timeline matrix aligned with subtask rows, featuring month headers, day numbers, and weekday labels.
- [x] Render colored Gantt schedule bars (blue for 100% completed, orange for active/pending) spanning appropriate date columns.
- [x] Provide interactive controls to expand/collapse discipline groups and adjust timeline zoom/scroll.
