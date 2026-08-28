# Modern UI/UX Overhaul Specification (EGAT Operations Console 2026)

Status: ready-for-agent

## Problem Statement

Users need the ability to edit critical task header metadata — specifically **"แสดงข้อมูลตั้งแต่วันที่" (Display / Start Date)** and **"วันที่แล้วเสร็จ" (Target Completion Date)** — directly from the Task Detail Page (`/task/[id]`), and have the daily timeline calendar columns and total duration dynamically update and persist.

## Solution

1. **Interactive Header Metadata Editing:**
   - Make the "วันที่เริ่มงาน / แสดงข้อมูลตั้งแต่วันที่" and "วันที่แล้วเสร็จ" fields (as well as W/O, Equip, and Duration) interactive and clickable with hover indicators (`✏️`).
   - Clicking opens a sleek, modern **Edit Task Metadata Modal** with intuitive date picker / text inputs.
2. **Dynamic Timeline Matrix & Duration Calculation:**
   - When the start or completion date is updated, the frontend dynamically recalculates `total_days` and re-generates the daily calendar columns (`dayColumns` and `monthGroups`) to match the new date span.
3. **Backend Persistence & Two-Way Sync:**
   - Added `action: "updateTaskDetails"` to `PATCH /api/tasks/[id]`, persisting updates in `tasks-data.ts` (and syncing to Google Sheets cells B3, B4, B5, B6).

## User Stories

1. As a project manager, I want to click on "แสดงข้อมูลตั้งแต่วันที่" or "วันที่แล้วเสร็จ" to change task dates, so that the schedule reflects the latest plan.
2. As a technician, I want the daily timeline matrix on the right to automatically expand or shift when dates are updated, so that all subtask bars align with actual calendar days.
3. As an engineer, I want the total work days to automatically recalculate based on the new start and end dates, so that I don't have to count days manually.

## Implementation Decisions

- **API Route:** Extend `PATCH /api/tasks/[id]` to handle `action: "updateTaskDetails"`.
- **Store Functions:** Add `updateTaskDetailsInStore(taskId, updates)` to `src/lib/tasks-data.ts` and `updateTaskDetails(taskId, updates)` to `src/lib/google-sheets.ts`.
- **UI Component:** Add `EditTaskDetailsModal` to `src/app/task/[id]/page.tsx` with date parsing and auto-duration calculation.
