# Spec: Dynamic Timeline Windowing & On-Demand Month Extension

Status: ready-for-agent

## Problem Statement

When viewing a task's subtask breakdown on the Task Detail Page, the daily calendar timeline on the right side needs to start strictly from the configured "แสดงข้อมูลตั้งแต่วันที่" (Display Date) or fall back to "วันที่เริ่มงาน" (Start Date). Furthermore, displaying all days for long-duration tasks at once can overwhelm the screen, causing excessive horizontal scrolling. Users need an initial compact window of 2 months with the ability to dynamically expand the timeline (+1 month) on demand without reloading.

## Solution

1. **Strict Anchor Date Resolution**:
   - The timeline columns dynamically start from `display_date` if configured; otherwise, they start from `report_date` (Start Date).
2. **Initial 2-Month Window with Extend Control**:
   - The daily matrix displays an initial 2-month window (~60 days) from the anchor date.
   - A dedicated control button `[➕ ขยายดูเพิ่ม +1 เดือน]` on the timeline header allows users to dynamically append subsequent calendar months.
   - A `[➖ ย่อเดือน]` button allows collapsing back when expanded.
3. **Continuous Subtask Capsule Rendering**:
   - Subtask schedule bars (capsules) dynamically render on all active days within the currently visible month columns, colored by their execution status (Green = Done, Blue = In Progress, Amber = Pending, Red = Not Started).

## User Stories

1. As a project manager, I want the timeline matrix to begin precisely on the "แสดงข้อมูลตั้งแต่วันที่" date I specified, so that I only see the calendar relevant to my current inspection window.
2. As a field engineer, I want the timeline to default to starting from "วันที่เริ่มงาน" when no separate display date is set, so that I don't have to manually configure display dates for standard jobs.
3. As a technician, I want to see an initial 2-month timeline window, so that the table fits comfortably on standard desktop and tablet screens without endless scrolling.
4. As a supervisor, I want to click a button to extend the timeline by 1 month at a time, so that I can inspect longer-term subtask schedules when needed.
5. As a user, I want the ability to collapse expanded months back to the initial view, so that I can quickly regain a concise overview.
6. As a team leader, I want subtask schedule capsules to correctly span across month boundaries when months are expanded, so that multi-month operations remain seamless.

## Implementation Decisions

- **State Management**: Introduce `visibleMonthsCount` state initialized to `2`.
- **Timeline Generator**: Compute `startDate = parseThaiDate(task.display_date) || parseThaiDate(task.report_date) || fallbackDate`.
- **Calendar Matrix Construction**: Calculate the end date by adding `visibleMonthsCount` months to `startDate` (or respecting minimum completion date if requested), generating `dayColumns` and grouping by Thai month name in `monthGroups`.
- **Interactive Controls**: Embed `[➕ ขยายไทม์ไลน์ (+1 เดือน)]` and `[➖ ย่อเดือน]` in the matrix header bar.

## Testing Decisions

- Test timeline generation with both `display_date` provided and omitted.
- Test extending months from 2 to 3, 4, etc., verifying day count and month group spans.
- Test subtask capsule alignment on multi-month spans.

## Out of Scope

- Infinite scrolling virtualization beyond browser memory limits.
- Drag-and-drop subtask rescheduling (date changes occur via metadata edit modals).

## Further Notes

- Maintains 100% compatibility with Google Sheets data sync and Next.js 16 App Router.
