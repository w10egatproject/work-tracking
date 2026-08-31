# 03: Split-Table Architecture with Synchronized Row Hover

**What to build:**
A coordinated dual-pane split table layout on the Task Detail page:
- Left pane: Subtask operational list with item numbering, task description, dates, progress bar, status badges (เสร็จ / ดำเนินการ / รอดำเนินการ), and row actions (insert above/below, edit progress, delete).
- Right pane: Daily Gantt matrix.
Both panes maintain exact row-height alignment (`h-11`) and share synchronous row hover highlighting.

**Blocked by:** 02: Modern Bento Metadata Card & Stepper on Task Detail Page

**Status:** resolved

## Acceptance criteria
- [x] Left operational table displays clean subtask breakdown with click-to-edit progress cells.
- [x] Left and right table rows share a synchronous `hoveredRowId` state for instant visual alignment across the split screen.
- [x] Row insertion modal ("แทรกบน", "แทรกล่าง") and delete actions are seamlessly accessible per row.
- [x] Clean responsive behavior across various desktop and laptop display widths.

## Answer
Implemented in [`src/app/task/[id]/page.tsx`](file:///d:/work-tracking/src/app/task/[id]/page.tsx) with a unified split-table matrix and shared `hoveredRowId` state.
