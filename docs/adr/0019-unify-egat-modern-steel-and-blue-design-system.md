# ADR 0019: Unify Design System under EGAT Modern Steel & Blue Palette

## Status
Accepted

## Context
In previous iterations, the application had two conflicting design directions:
1. **Dashboard Overview (`/`)**: Used an experimental warm paper "Industrial Ledger" theme (`#F5F2EB` background, `#19211E` ink, `#DDD6C8` borders).
2. **Task Detail & Gantt (`/task/[id]`)**: Used the official **EGAT Operations** theme (`#F5F5F7` background, `#005B9A` EGAT Navy Blue, Mae Moh Amber `#F0B323`, and clean slate borders).

This caused a visual disconnect and brand inconsistency across the application.

## Decision
Following user decision **Q1 = Option 1**, the entire system (all pages, split-table Gantt matrix, navigation bars, bento cards, and operational dialogs) is unified under the **EGAT Modern Steel & Blue** design system:

1. **Ground & Surfaces**:
   - Page Ground: `#F5F5F7` (Clean technical slate/steel background)
   - Cards & Surfaces: `#FFFFFF` (Pure white) with `#E2E8F0` / `#E5E7EB` borders
   - Sub-surfaces / Table headers: `#F8FAFC` / `#F1F5F9`

2. **Brand & Accent Colors**:
   - Primary: **EGAT Navy Blue (`#005B9A`)**
   - Accent: **Mae Moh Amber (`#F0B323`)**
   - Success: **Emerald (`#10B981`)**

3. **Status Semantics**:
   - `เสร็จ`: Emerald (`#10B981`)
   - `ดำเนินการ`: EGAT Blue (`#005B9A`)
   - `รอดำเนินการ`: Amber (`#F59E0B`)
   - `ยังไม่ดำเนินการ`: Slate (`#64748B`)

## Consequences
- 100% visual consistency and cohesive identity across all routes (`/` and `/task/[id]`).
- Clean, high-contrast, professional appearance adhering to EGAT corporate brand standards.
- Preserves responsive bottom navigation, mobile drawers, keyboard shortcuts, and two-pane split Gantt architecture.
