# Wayfinder Map: Floating Navbar & Modern Split-Table Task UI

Label: `wayfinder:map`

## Destination

A production-ready modern UI overhaul for the Work Tracking application featuring a floating glassmorphic navbar, bento-style metadata cards, and a split-table task workspace (left operational subtasks table, right dynamic Gantt calendar matrix) matching shadcn/ui and Magic UI aesthetics with zero bloated dependencies.

## Notes

- Domain: Maintenance Work Order tracking (W11-W14) synced two-way with Google Sheets.
- Skills: `gridgeist`, `ponytail`, `domain-modeling`, `implement`.
- Standing preferences: Native Tailwind CSS v4, Lucide icons, high information density, clean typography.

## Decisions so far

- [01: Floating Island Navbar with Glassmorphic Command Pill](file:///d:/work-tracking/.scratch/floating-nav-modern-task-ui/issues/01-floating-island-navbar.md): Created unified `FloatingNavbar` component supporting both Dashboard and Task Detail modes with backdrop-blur, live sync badge, and shortcuts.
- [02: Modern Bento Metadata Card & Stepper on Task Detail Page](file:///d:/work-tracking/.scratch/floating-nav-modern-task-ui/issues/02-task-header-bento-metadata.md): Modernized Task Detail metadata card with clickable interactive pills, circular progress ring, and discipline handover pipeline stepper.
- [03: Split-Table Architecture with Synchronized Row Hover](file:///d:/work-tracking/.scratch/floating-nav-modern-task-ui/issues/03-split-table-task-workspace.md): Built split table workspace with synchronized `hoveredRowId` state and strict row height matching (`h-11`) between left subtasks and right daily Gantt matrix.
- [04: Dynamic Timeline Windowing with On-Demand Month Extension](file:///d:/work-tracking/.scratch/floating-nav-modern-task-ui/issues/04-gantt-timeline-window-controls.md): Dynamic timeline starting strictly from `display_date` with 2-month initial window, Thai month groupings, and `+1 เดือน` / `-1 เดือน` / reset buttons.
- [05: shadcn & Magic UI Visual Polish, Badges, and Micro-Interactions](file:///d:/work-tracking/.scratch/floating-nav-modern-task-ui/issues/05-shadcn-magicui-visual-polish.md): Polished frosted modal overlays, status/discipline badges with subtle ambient glow, and verified Next.js 16 build.

## Frontier (All Resolved)

- None (All 5 tickets resolved and verified)

## Blocked Tickets

- None

## Not yet specified

- Advanced keyboard navigation between split-table cells.
- Export split-table view to PDF / PNG summary report.

## Out of scope

- Direct drag-and-drop subtask date alteration on the calendar canvas.
- Heavy WebGL canvas 3D visualizers.
