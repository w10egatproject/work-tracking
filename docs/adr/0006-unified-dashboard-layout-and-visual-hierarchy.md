# ADR 0006: Unified Dashboard Layout & Symmetrical Visual Hierarchy

## Status

Accepted

## Context

Following the initial layout modernization, user review observed visual asymmetry and fragmentation across the main dashboard ("uiดูแปลกไม่และไม่เท่ากันด้วยดูล้นๆเกินๆ"):
1. Nested horizontal paddings in child components (`SummaryCards` and `TaskTable`) caused misalignment relative to the Hero card and Search bar.
2. The 4 KPI cards lacked structural symmetry — Card 1 (Total) differed in height and content from Cards 2–4 (In Progress, Completed, Pending) which included progress bars.
3. Multiple disconnected floating pods (Hero header, KPI cards, Discipline filter strip, Search bar, Master Table) resulted in vertical clutter and bloated screen space.
4. Heavy solid blue action buttons in table rows dominated the visual weight.

## Decision

Harmonize dashboard layout alignment and streamline component hierarchy:
1. **Container & Grid Alignment:** Remove all nested `px-6` wrappers from child components. Standardize the root container width (`max-w-[1600px] w-full mx-auto px-4 sm:px-6`) with uniform `space-y-3.5` and `rounded-2xl` micro-borders across all cards.
2. **Symmetrical KPI Cards:** Unify all 4 summary cards to share identical layout geometry, typography, and progress indicators (Card 1 displays total tasks alongside an overall completion rate bar).
3. **Unified Action Toolbar:** Merge the Quick Search input (`/` shortcut), Discipline filter pills (`ทั้งหมด`, `W11`, `W12`, `W13`, `W14`), and Status dropdown into a single compact responsive toolbar.
4. **Balanced Table Density & Soft Actions:** Transition table row actions from solid high-contrast buttons to modern Ghost/Soft pill buttons (`bg-sky-50 text-[#005B9A] hover:bg-[#005B9A] hover:text-white`) with hover state transitions and proportional column widths.

## Consequences

- Eliminates visual overflow and ensures flush 100% vertical and horizontal edge alignment.
- Decreases vertical screen consumption, providing immediate above-the-fold visibility of critical operational tasks.
- Preserves all real-time filtering, search shortcuts, and discipline metadata.
