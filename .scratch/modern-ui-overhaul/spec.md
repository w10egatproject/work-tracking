# Modern UI/UX Overhaul Specification (EGAT Operations Console 2026)

Status: ready-for-agent

## Problem Statement

The current user interface for the W10 Work Tracker looks dated, rigid, and reminiscent of legacy enterprise forms rather than a sleek, modern, 2026-era high-productivity workspace (such as Linear, Raycast, or Modern Notion). Users find the visual density, default dropdowns, basic borders, and standard color styling outdated.

## Solution

Revamp the frontend architecture and visual presentation into a **Modern Enterprise Workspace Pro (2026 Industrial Edition)**:
- Ultra-refined typography with dynamic tracking and tabular numeric fonts.
- Crisp micro-borders (`border-slate-200/80` or `ring-1 ring-slate-900/5`), subtle ambient elevation, and polished backdrop blur.
- Modern Segmented Switchers, interactive pill chips, glowing status pips (`animate-pulse`).
- Interactive KPI Bento Cards with mini progress rings and delta indicators.
- Sleek Quick Search with keyboard shortcut indicators (`⌘K` / `/`) and instant filtering.
- High-density modern data grid with hover micro-actions and smooth transitions.
- Polished Modal Dialogs with smooth spring-like entrance and intuitive quick controls.

## User Stories

1. As an operational engineer, I want a sleek, modern dashboard interface so that tracking maintenance tasks feels intuitive, clean, and fast.
2. As a department head, I want high-density KPI cards with visual progress rings so that I can see the health of all work orders at a single glance.
3. As a technician, I want quick-search with keyboard focus (`/` or `Ctrl+K`) so that I can find a specific Work Order or Equipment without taking my hands off the keyboard.
4. As a section manager, I want smooth view-switching between High-Density Table and Modern Kanban Board with subtle active transitions.
5. As a discipline supervisor, I want to quickly update subtask progress with slider presets and direct typing in a sleek modern modal.
6. As an operator, I want to insert or delete subtask rows seamlessly with clear visual cues and instant feedback.
7. As an engineer handing over a job, I want a modern visual workflow stepper showing from-to discipline transitions with clear status badges.
8. As a mobile/tablet user, I want the responsive layout to gracefully collapse into readable cards without horizontal scroll issues.

## Implementation Decisions

- **Aesthetic Direction:** Modern Minimalist Pro + Linear/Raycast inspiration, retaining EGAT Brand Identity (`#005B9A` primary, `#F0B323` amber accents, `#0F2747` deep console navy).
- **Surface & Elevation:** Replace harsh solid borders with refined layered cards (`bg-white/80 backdrop-blur-md border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)]`).
- **Typography:** Refined font hierarchy using `Prompt` & `Inter` with optical sizing, tabular numerals for dates/IDs/percentages.
- **Component Polish:**
  - Header: Floating/sticky sleek frosted navigation bar.
  - KPI Cards: Modern bento layout with subtle gradient backgrounds and circular mini gauges.
  - Table Grid: Modern header styling, interactive row states with floating action pills.
  - Kanban Board: Column headers with count badges, sleek cards with status pill indicators and progress micro-bars.
  - Modals: Centered floating card with smooth backdrop-filter and crisp form controls.

## Testing Decisions

- Test all interactive state transitions (view mode switches, filters, search debounce, modal openings).
- Verify zero regression on Google Sheets sync, task mutations, subtask insertions/deletions, and discipline handovers.
- Test responsive breakpoints on mobile (375px), tablet (768px), and desktop (1440px+).

## Out of Scope

- Modifying underlying backend Google Sheets API contract.
- Changing domain W-code definitions (W11-W14).

## Further Notes

Follows the `/ponytail` philosophy: zero extra bloated external packages, utilizing Tailwind CSS v4, Lucide icons, and React 19 native optimizations.
