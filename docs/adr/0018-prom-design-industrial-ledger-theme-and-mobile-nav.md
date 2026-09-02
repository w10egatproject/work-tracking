# ADR 0018: Adoption of Prom Design Industrial Ledger Theme and Mobile Navigation

## Status
Accepted

## Context
The Work Tracking dashboard previously utilized generic neutral-gray styling (`#F5F5F7`), standard Apple-like cards, and generic UI components. This aesthetic lacked the material identity and high-density legibility necessary for plant maintenance operations (EGAT Mae Moh, W10-W14).

Following the adoption of the `prom-design` skill and requirements settled via `grill-with-docs`:
1. **Instrument Register**: The interface serves Department Heads and Section Heads who need to monitor Work Orders, multi-discipline handovers, and execution progress rapidly.
2. **Industrial Ledger Aesthetic**: Grounded in engineering documentation—tinted paper ground (`#F5F2EB`), graphite ink (`#19211E`), ledger green (`#1B5E3B`), and fired-clay orange (`#C05621`).
3. **Mobile Density & Thumb-Zone Navigation**: Supervisors accessing the dashboard in the field require a bottom navigation bar with a quick slide drawer for discipline filtering (W11–W14) within a 3.5-screen scroll budget.

## Decision
1. **Design Tokens & Palette**:
   - Primary Ground: `#F5F2EB` (Warm Technical Ground)
   - Card Surface: `#FFFFFF` / `#FAF8F5` with `#DDD6C8` structural border
   - Primary Ink: `#19211E` (Warm Charcoal), Muted Ink: `#596560`
   - Status Tokens:
     - `เสร็จ` (Completed): `#1B5E3B` (Ledger Green), bg `#E8F4EC`, border `#B8DCBD`
     - `ดำเนินการ` (In Progress): `#C05621` (Furnace Clay), bg `#FDF2EC`, border `#F7CEB9`
     - `รอดำเนินการ` (Pending): `#B45309` (Amber Brass), bg `#FEF3C7`, border `#FDE68A`
     - `ยังไม่ดำเนินการ` (Not Started): `#4B5563` (Muted Slate), bg `#F3F4F6`, border `#E5E7EB`
   - Discipline Badges (W11 Engineering, W12 Mechanical, W13 Machinery Repair, W14 Equipment Repair).

2. **Typography System**:
   - `Sarabun` / `Prompt` / `IBM Plex Sans` for high-precision Thai and alphanumeric data.

3. **Component Refinements**:
   - **FloatingNavbar**: Refined into a crisp industrial console bar with live sync indicator and view switchers.
   - **SummaryCards**: Specific proof-driven KPI metrics with clear progress ratios and tactile containers.
   - **Toolbar & Filter Bar**: Facet buttons for W11–W14, search shortcut (`/`), and status filters.
   - **TaskTable**: High-density ledger table with tinted row hover states and explicit action affordances.
   - **KanbanBoardView**: Structured columns matching the four deterministic progress states.
   - **MobileBottomNav & Filter Drawer**: Bottom navigation bar for mobile viewports with quick drawer access for disciplines and view modes.

## Consequences
- Elevated visual quality that communicates industrial precision and operational trust.
- Significantly enhanced mobile usability for field engineers and section heads.
