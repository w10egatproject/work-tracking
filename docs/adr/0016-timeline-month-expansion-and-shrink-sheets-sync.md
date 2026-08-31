# ADR 0016: Timeline Month Expansion & Shrink Google Sheets Synchronization

## Status
Accepted

## Context
When managing long maintenance and engineering schedules, users frequently need to expand or shrink the visible timeline window (e.g. extending from August to September, October, etc.). Previously, expanding or shrinking the month range only affected the web browser client view. Users requested that pressing "+ ขยายดูเพิ่ม +1 เดือน" or "- ย่อเดือน" should synchronize and modify the Google Sheet date columns in real time as well.

## Decision
1. **Expand Timeline Month (`expandTimelineMonthInGoogleSheet`)**:
   - Inspects the existing date columns on rows 6 (Month), 7 (Day number), and 8 (Weekday) starting at column H (`H6:ZZ8`) in Google Sheets.
   - Computes the next calendar month, days count, and days of the week.
   - Appends the new month date columns starting at the column immediately following the last existing column.
2. **Shrink Timeline Month (`shrinkTimelineMonthInGoogleSheet`)**:
   - Finds the last month columns in rows 6-8 and clears the range from row 6 to row 60, safely preserving the base schedule.
3. **Frontend Integration**:
   - `handleExpandTimelineMonth` and `handleShrinkTimelineMonth` trigger asynchronous background sync via `PATCH /api/tasks/[id]` without blocking UI reactivity.

## Consequences
- Expanding or shrinking months in the web UI dynamically updates Google Sheets timeline columns.
- Real-time two-way synchronization is maintained for both schedule subtasks and timeline calendar headers.
