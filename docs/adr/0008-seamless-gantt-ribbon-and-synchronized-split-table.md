# 0008. Seamless Gantt Ribbon and Synchronized Split-Table Architecture

Date: 2026-08-31
Status: Accepted

## Context
In the subtask management view (`src/app/task/[id]/page.tsx`), two critical visual issues were identified:
1. **Segmented Day Capsules**: Active timeline days were rendered as isolated square blocks (`[■] [■] [■]`) in each date column instead of a continuous horizontal Gantt ribbon.
2. **Left-Right Table Row Drift**: The Left Subtask Operational Table and Right Gantt Calendar Table used two independent table DOM nodes with relative heights, causing cumulative vertical misalignment across rows as the list grows.

## Decisions

### 1. Seamless Continuous Gantt Ribbon Bar
- Compute active adjacency (`prevActive`, `nextActive`) for every date cell:
  - **Start of Span**: `rounded-l-md rounded-r-none` extending into adjacent right cell.
  - **Middle of Span**: `rounded-none -mx-[1px] w-[calc(100%+2px)]` spanning edge-to-edge seamlessly over column gridlines.
  - **End of Span**: `rounded-r-md rounded-l-none` continuing from previous left cell.
  - **Single Day Task**: `rounded-md` standalone capsule.
- Use Google Sheets fidelity color palette (`#70AD47` Operations Green, `#8EA9DB` Header/Handover Blue).

### 2. Strict Synchronized Row Height Budget
- Lock exact header heights (`h-[65px]` for Left Header matching dual-tier Right Headers `h-[32px] + h-[32px] + 1px border`).
- Enforce strict `h-[48px]` and `py-1` on all Left and Right `<tr>` and `<td>` elements with text clipping and vertical centering to eliminate cumulative vertical drift.

## Consequences
- Timeline schedules appear as solid, unbroken Gantt ribbons matching high-end project management software and Google Sheets fidelity.
- Left subtask metadata and right calendar rows remain 100% horizontally aligned across all rows.
