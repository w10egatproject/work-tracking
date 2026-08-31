# 0009. Dynamic Timeline Calendar Window Auto-Expansion

Date: 2026-08-31
Status: Accepted

## Context
Previously, the timeline calendar view on the task detail page (`src/app/task/[id]/page.tsx`) defaulted to a static 2-month window (`visibleMonthsCount = 2`). For long-duration tasks (such as Task 1 spanning May 27th to August 31st — 4 months across disciplines W12, W13, W11), subtasks in July and August were cut off horizontally upon initial page load unless the user manually expanded the view.

## Decisions
1. **Dynamic Schedule Encompassing**:
   - On task load or date modification, compute the start date (`display_date` or `report_date` or earliest subtask start) and end date (`completion_date` or latest subtask end).
   - Automatically calculate `visibleMonthsCount = (endYear - startYear) * 12 + (endMonth - startMonth) + 1`.
   - Ensure the timeline displays all required months (e.g. May to August = 4 months) by default.
2. **Interactive Range Extensibility**:
   - Provide `+ ขยายดูเพิ่ม (+1 เดือน)` and `➖ ย่อเดือน` controls allowing flexible timeline panning and inspection.

## Consequences
- All Gantt ribbon bars across all disciplines render in full view immediately upon opening the task.
- Eliminates manual clicks previously required to view subtasks occurring in later months.
