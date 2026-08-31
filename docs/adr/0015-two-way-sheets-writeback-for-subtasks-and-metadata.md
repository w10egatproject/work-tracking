# ADR 0015: Two-Way Google Sheets Writeback for Subtasks and Metadata

## Status
Accepted

## Context
Previously, subtask insertions, edits, deletions, and metadata changes made on the web application were only stored in runtime server memory and did not automatically sync back to Google Sheets. Users needed two-way synchronization so that when a subtask is added, modified, or deleted on the web UI, the corresponding tab in Google Sheets (`งานที่1`, `งานที่2`, etc.) is updated in real time.

## Decision
1. **Direct Google Sheets Tab Writeback (`syncTaskSubtasksToGoogleSheet`)**:
   - Every time `insertSubtask`, `updateSubtask`, `deleteSubtask`, or `executeHandover` is called, the system formats the subtask list into Google Sheets row schema starting from row 9 (`A9:G...`).
   - Uses `spreadsheets.values.clear` and `spreadsheets.values.update` to replace the subtasks in the individual task tab.
2. **Metadata Header Writeback (`syncTaskHeaderToGoogleSheet`)**:
   - When task details (title, W/O, equip, dates) are edited, `spreadsheets.values.batchUpdate` updates cells `B2`, `B3`, `F3`, `B4`, `F4`, `B5`, and `B6` in the task tab.

## Consequences
- Operations performed in the web UI (inserting subtask, updating progress, editing dates, deleting rows) are reflected in Google Sheets immediately.
- Real-time two-way synchronization between Google Sheets and the Web Tracking App is established.
