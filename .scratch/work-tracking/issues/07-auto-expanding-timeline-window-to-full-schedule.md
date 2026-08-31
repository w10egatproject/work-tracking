---
title: "Auto-Expanding Timeline Calendar Window to Full Schedule Range"
status: "ready-for-agent"
---

## Problem Statement

When users open a task with a multi-month schedule (e.g. 27/5/69 - 31/8/69, spanning May through August across disciplines W12, W13, and W11), the daily timeline table initially defaulted to displaying only 2 months (May - June, 35 days). Subtasks scheduled in July and August were cut off horizontally, forcing users to click "+ ขยายดูเพิ่ม +1 เดือน" multiple times to view the complete Gantt bars.

## Solution

Automatically calculate the initial timeline month window based on the start date (`report_date` / `display_date`) and completion date (`completion_date` / latest subtask `end`). If a task spans May to August (4 months), the timeline automatically renders all 4 months (`พ.ค. - ส.ค.`, 97 days) immediately on page load, while retaining manual controls to add or remove months as needed.

## User Stories

1. As a project engineer, I want the Gantt timeline to open with the full task duration visible (e.g. May to August), so that I can see all subtask schedules across all disciplines without clicking extra buttons.
2. As a maintenance planner, I want to edit subtask start and end dates, so that changes immediately update the Gantt ribbon and dynamically adjust the timeline range.
3. As an operator, I want to click "+ ขยายดูเพิ่ม (+1 เดือน)" or "➖ ย่อเดือน" to expand or narrow the visible timeline range as needed.
4. As a supervisor, I want to see the total visible day count in the header badge (e.g. "ช่วงที่แสดง: พ.ค. - ส.ค. (97 วัน)"), so that I have instant visibility into the schedule scope.

## Implementation Decisions

- Compute required month span dynamically: `monthDiff = (endYear - startYear) * 12 + (endMonth - startMonth) + 1`.
- Initialize `visibleMonthsCount` state based on `Math.max(1, monthDiff)` whenever task data or subtasks update.
- Ensure the Gantt calendar table and column groups render seamlessly across all computed months.

## Testing Decisions

- Verify that opening Task 1 (May 27 - August 31, 2026) displays all 4 month groups (พ.ค., มิ.ย., ก.ค., ส.ค.) totaling 97 days immediately without user interaction.
- Verify that clicking "➖ ย่อเดือน" reduces visible months by 1 and "+ ขยายดูเพิ่ม (+1 เดือน)" adds 1 month.

## Out of Scope

- Infinite timeline scrolling beyond 365 days in a single viewport.

## Further Notes

- Aligns with ADR 0008 and ADR 0009.
