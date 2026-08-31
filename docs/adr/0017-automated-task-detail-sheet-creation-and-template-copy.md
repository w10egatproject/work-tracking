# ADR 0017: Automated Task Detail Sheet Creation and Template Copy in Google Sheets

## Status
Accepted

## Context
When a new maintenance Task is created from the main dashboard dialog (`AddTaskDialog`), previously only a row was appended to the Master Sheet (`ลำดับงาน`). A dedicated Task Detail Sheet (`งานที่{N}`) tab containing the subtask breakdown, Gantt matrix, and discipline headers was not created, requiring manual tab creation and linking.

Users requested that creating a new task automatically:
1. Derives the next sequential task number (`MAX + 1`).
2. Duplicates an existing Task Detail Sheet tab (the latest task tab or `งานที่1`) in Google Sheets.
3. Renames the duplicated tab to `งานที่{nextNum}`.
4. Initializes the header fields (`B2` title, `B3` report date, `F3` W/O, `B4` total days, `F4` equip, `B5` completion date) and resets subtask rows to 0% progress.
5. Appends the new task row to the Master Sheet (`ลำดับงาน!A:H`) with a direct URL linking to the newly created tab (`#gid={sheetId}`).

## Decision
1. **Next Task Number Derivation**:
   - Query all rows in Master Sheet `ลำดับงาน!A:H` and parse `งานที่(\d+)` to compute `maxNum`.
   - The new task number is guaranteed to be `nextNum = maxNum + 1`.
2. **Template Duplication via Google Sheets API**:
   - Locate the most recent task tab (`งานที่{maxNum}`) or fallback to `งานที่1` to obtain its `sheetId`.
   - Call `sheets.spreadsheets.sheets.copyTo` to copy the template tab to the same spreadsheet.
   - Use `spreadsheets.batchUpdate` with `updateSheetProperties` to rename the new sheet to `งานที่{nextNum}`.
3. **Tab Initialization & Two-Way Sync**:
   - Update header cells in the newly created tab using `batchUpdate`.
   - Write initial subtask rows (matching selected disciplines W11-W14) with progress at 0% and status at `รอดำเนินการ`.
4. **Master Sheet Direct Linking**:
   - Construct the direct link `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit?gid={newSheetId}#gid={newSheetId}`.
   - Append `[taskNo, title, wo, report_date, completion_date, completion_codes, directLink, equip]` to `ลำดับงาน!A:H`.
5. **In-Memory Store Synchronization**:
   - Ensure local tasks store (`tasks-data.ts`) reflects the new task, subtasks, and direct link seamlessly.

## Consequences
- Every new task created in the application automatically generates a fully formatted Task Detail Sheet in Google Sheets with instant direct linking.
- Template formatting, column structures, and month timelines are preserved consistently across new tasks.
