# 0010. Task Header Photo Display and Sheet-Fidelity Metadata Sync

Date: 2026-08-31
Status: Accepted

## Context
In Task 1 (งานที่ 1), two discrepancies with the Google Sheet were identified:
1. **Missing Completion Date & Default Values**: The task header card displayed `-` for completion date and 25% progress instead of `31 ส.ค. 2026` and `88%` progress with `W/O 4132222`.
2. **Missing Task Machinery Photo**: The Google Sheet features an on-site workshop machinery photo next to the task header metadata, which was absent in the web interface.

## Decisions
1. **Fidelity Metadata Sync**:
   - Synchronize Task 1 with accurate Google Sheets data: Title (`งานถอด Bearing Coupling Clutch Ball Mill 10`), W/O (`4132222`), Start (`27 พ.ค. 2026`), Completion (`31 ส.ค. 2026`), Duration (`97 วัน`), and Progress (`88%`).
   - Fix `fetchTaskDetail()` in `src/lib/google-sheets.ts` to prevent live master sheet blank values from overriding existing subtask-derived completion dates and progress metrics.
2. **Task Photo Display & Lightbox Modal**:
   - Add `imageUrl` property to `Task` interface and store.
   - Embed an on-site workshop machinery photo card in the Task Header Card.
   - Enable high-resolution Lightbox zoom modal upon clicking the photo, with options to edit/update image URLs.

## Consequences
- Task 1 displays identical metadata and visual context to the master Google Sheet.
- Users can view and update task reference photographs seamlessly within the web app.
