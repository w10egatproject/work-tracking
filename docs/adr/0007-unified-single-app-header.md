# ADR 0007: Unified Single App Header & Redundancy Elimination

## Status

Accepted

## Context

Following the initial layout harmonization, user review identified vertical overcrowding and visual redundancy between the top floating navigation bar and the secondary Bento Hero card ("navbar ติด header เกินไปไม่มีช่องว่างเลยหรือเอารวมกันจะสวยกว่า"):
1. The floating pill navbar and the secondary hero card acted as two stacked headers occupying over 180px of vertical height.
2. The view switcher (Table vs. Kanban), live sync indicator, and title labels were fragmented across two adjacent floating containers.

## Decision

Consolidate the top navigation bar and hero header into a **Single Unified App Header (`FloatingNavbar`)**:
1. **Unified Identity & Live Sync:** Position the EGAT/W10 brand identity, title (`W10 Operations | ภาพรวมงานซ่อมบำรุงประจำแผนก`), pulsing `Live Sync` badge, and multidisciplinary subtitle in the left wing.
2. **Integrated Controls & Actions:** Position the view mode toggle (Table / Kanban), Thai calendar date, sync refresh trigger, and `+ สร้างงานใหม่` CTA in the right wing.
3. **Elimination of Secondary Hero Card:** Completely remove the secondary Bento hero box from `page.tsx`, bringing the 4 KPI Summary Cards directly below the header with clean vertical breathing room (`space-y-3.5`).

## Consequences

- Saves ~100px of vertical screen real estate, bringing primary operational tasks and KPI metrics immediately above the fold.
- Eliminates "Double Header" cognitive overhead and visual redundancy.
- Retains 100% of interactive capabilities (view switching, two-way sync refresh, quick task creation).
