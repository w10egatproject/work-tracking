# 04: Add New Task Dialog with Multidisciplinary Selection & Two-Way Sync

**What to build:**
A dialog modal on the main dashboard for adding new maintenance tasks, allowing users to enter Work Order, title, start date, equipment, and select collaborating disciplines (W11-W14) via checkboxes, automatically generating standard starter subtasks and persisting to the master sheet.

**Blocked by:** 02: Spreadsheet-Fidelity Master Table & Multi-Filter Search

**Status:** resolved

- [x] Build a modern dialog with form fields for Task Title, W/O Number, Start Date, Equipment name, and Google Sheet link.
- [x] Implement multi-select checkboxes for Disciplines (`W11 วิศวกรรม`, `W12 เครื่องกล`, `W13 ซ่อมเครื่องจักรกล`, `W14 ซ่อมอุปกรณ์เครื่องจักรกล`).
- [x] Implement API endpoint (`POST /api/tasks`) to append the new task row into the Google Sheet master tab `ลำดับงาน` and generate initial discipline subtasks.
- [x] Update frontend state optimistically and refresh table data upon successful submission.
