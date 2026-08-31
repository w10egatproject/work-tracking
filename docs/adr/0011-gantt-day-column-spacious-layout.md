# 0011. Gantt Timeline Spacious Day Column & Full Month Typography

Date: 2026-08-31
Status: Accepted

## Context
Previously, day columns in the Gantt timeline table (`src/app/task/[id]/page.tsx`) were 32px wide (`w-8`) with 10px day numbers, 8px weekdays, and short month abbreviations (`พ.ค.`, `มิ.ย.`). This produced cramped visual spacing that was strenuous to scan across multi-month project schedules.

## Decisions
1. **Comfortable Column Dimension**:
   - Expand day column widths from 32px to 40px (`w-10 min-w-[40px]`).
   - Increase day numbers to 12px bold font (`text-xs font-bold font-mono text-[#1D1D1F]`).
   - Increase weekday names to 9.5px semibold (`text-[9.5px] font-semibold text-[#86868B]`).
2. **Full Thai Month with Buddhist Year Header**:
   - Format month headers as full month and year (e.g. `พฤษภาคม 2569`, `มิถุนายน 2569`, `กรกฎาคม 2569`, `สิงหาคม 2569`).
   - Style with primary blue accent (`text-[#005B9A] bg-sky-50/80 font-bold text-xs`).
3. **Thicker Ribbon Gantt Bar**:
   - Increase ribbon bar height from 22px to 26px (`h-6.5`), providing strong contrast and clear schedule boundaries.

## Consequences
- The timeline calendar is significantly more readable and comfortable to scan without horizontal visual strain.
- Full month names and Buddhist years provide immediate temporal orientation.
