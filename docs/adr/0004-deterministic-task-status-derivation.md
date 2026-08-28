# 4. Deterministic Task Status Derivation from Master Sheet

Date: 2026-08-28

## Context

Task statuses (`เสร็จ`, `ดำเนินการ`, `รอดำเนินการ`) were previously assigned without a strict deterministic precedence rule across the Google Sheets sync pipeline, which could cause inconsistent KPI metrics and status filtering.

## Decision

We establish a deterministic 3-tier precedence rule for deriving task status from the Master Sheet (`ลำดับงาน`):
1. **Tier 1 (`เสร็จ` - Completed)**: If `completion_date` (วันที่สิ้นสุด) is present and non-empty, the task is marked `เสร็จ`.
2. **Tier 2 (`ดำเนินการ` - In Progress)**: If `completion_date` is empty but `link` (Link to Task Detail Sheet) is present and non-empty, the task is marked `ดำเนินการ`.
3. **Tier 3 (`รอดำเนินการ` - Pending)**: If neither `completion_date` nor `link` is present, the task is marked `รอดำเนินการ`.

## Consequences

- Full alignment with plant operational workflow: tasks in planning lack detail sheets (`รอดำเนินการ`), active tasks have detail sheets (`ดำเนินการ`), and finished tasks have recorded completion dates (`เสร็จ`).
- Consistent KPI summary card metrics (Total, In Progress, Completed, Pending) across all UI views (Table, Kanban) and APIs.
