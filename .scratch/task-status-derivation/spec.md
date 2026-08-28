# Spec: Deterministic Task Status Derivation from Google Sheets

Status: ready-for-agent

## Problem Statement

Previously, the Progress Status (`สถานะการดำเนินงาน`) of tasks in the EGAT Maintenance Tracking system was either statically assigned or ambiguously derived, leading to potential discrepancies between the Master Sheet (`ลำดับงาน`), the Dashboard KPI summary cards, and the operational status of maintenance jobs across participating disciplines (W11–W14). Plant managers and Section Heads require accurate, deterministic status calculation based directly on live Google Sheets column values.

## Solution

Implement deterministic, 3-tier precedence logic for deriving task status from the Master Sheet:
1. **เสร็จสมบูรณ์ (`เสร็จ`)**: Tasks with a recorded completion date (`completion_date` / วันที่สิ้นสุด).
2. **กำลังดำเนินการ (`ดำเนินการ`)**: Tasks without a completion date that possess a linked Task Detail Sheet (`link` / ลิ้งค์แผ่นงานย่อย).
3. **รอดำเนินการ (`รอดำเนินการ`)**: Tasks without a completion date and without a linked Task Detail Sheet.

This rule is applied seamlessly across Google Sheets API synchronization, in-memory data store operations, KPI calculation in summary cards, and status filter selectors.

## User Stories

1. As a Department Head, I want the summary KPI cards to accurately show the count of completed tasks based on whether a completion date is recorded, so that I can report accurate job closure metrics to executive management.
2. As a Section Head, I want tasks that have a linked Task Detail Sheet to automatically show as "กำลังดำเนินการ", so that I know which jobs have detailed work breakdowns and active discipline execution.
3. As a Planning Engineer, I want newly logged Work Orders without detail sheets or completion dates to appear as "รอดำเนินการ", so that my team can identify pending jobs that require planning and sheet preparation.
4. As a Maintenance Engineer, I want the system to automatically transition a task from "รอดำเนินการ" to "กำลังดำเนินการ" as soon as a Task Detail Sheet link is added, so that I don't have to manually update status flags in multiple places.
5. As a Plant Supervisor, I want the Table View and Kanban View to group and filter tasks deterministically according to these three states, so that daily stand-ups and progress monitoring reflect real-world plant status.
6. As a Maintenance Manager, I want tasks with a recorded completion date to display 100% progress and the "เสร็จ" badge even if a legacy detail sheet link remains attached, so that historical records remain closed and unambiguous.
7. As a Web App User, I want the status filter dropdown on the dashboard to accurately filter tasks matching "กำลังดำเนินการ", "เสร็จสมบูรณ์", and "รอดำเนินการ" according to the unified logic, so that I can quickly drill down into specific job phases.

## Implementation Decisions

- **Deterministic Derivation Helper**: A centralized helper function `deriveTaskStatus(completionDate?: string, link?: string): TaskStatus` will be created in `src/types/index.ts` or `src/lib/tasks-data.ts`.
- **Google Sheets Ingestion Pipeline**: In `src/lib/google-sheets.ts`, the `fetchAllTasks()` parser will apply `deriveTaskStatus(row[4], row[7])` to every parsed row from the Master Sheet (`ลำดับงาน`).
- **Store Mutation Synchronization**: In `src/lib/tasks-data.ts`, `addTaskToStore`, `updateTaskInStore`, and fallback `INITIAL_TASKS` will follow the exact same status derivation rules.
- **KPI Metrics Consistency**: `SummaryCards.tsx` and `TaskTable.tsx` summary footers will compute counts matching the derived status.
- **Domain Glossary Alignment**: The domain glossary in `CONTEXT.md` and ADR `docs/adr/0004-deterministic-task-status-derivation.md` define and enforce these canonical definitions.

## Testing Decisions

- **Seam**: The single high-level seam for status verification is `deriveTaskStatus` and end-to-end task mapping from raw sheet row tuples to `Task` objects.
- **Good Test Criteria**: Test observable input/output behavior (empty string, whitespace, valid date, valid URL, missing fields) without testing internal parser implementation details.
- **Prior Art**: Aligns with existing TypeScript unit and utility test patterns in the repository.

## Out of Scope

- Changing Google Sheets column positions or header names in the master spreadsheet.
- Modifying subtask-level status calculations inside individual Task Detail Sheets (`งานที่X`).
- Automatic deletion of detail sheets when tasks are marked complete.

## Further Notes

- Sourced from alignment interview in Round 1 of `grill-with-docs`.
- Referenced in ADR-0004.
