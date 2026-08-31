# Spec: Modern Floating Navbar & Split-Table Task Workspace (shadcn + Magic UI + React Bits Aesthetic)

Status: ready-for-agent

## Problem Statement

The current Work Tracking application provides essential maintenance order tracking across disciplines (W11–W14) and master/subtask sheets. However:
1. The navigation header is currently a standard pinned block header rather than a modern floating command bar (floating island / pill navbar with glassmorphic backdrop blur and sleek border glow).
2. The Task Detail page needs an ultra-refined, modern split-table workspace (left: structured subtask operational table with actions, metadata, and status badges; right: daily calendar Gantt matrix with sticky month headers, date capsules, and month extension controls) that feels modern, responsive, and spacious while maintaining high information density.
3. The visual design across the dashboard and task detail page should align with the modern shadcn/ui, Magic UI (subtle gradients, frosted surfaces, ambient accents), and React Bits interaction aesthetic without introducing heavy or fragile third-party dependencies.

## Solution

1. **Floating Island Navbar (Global & Task View)**:
   - Implement a floating frosted glass header (`backdrop-blur-md bg-slate-900/80 border border-slate-700/60 shadow-xl rounded-2xl mx-auto mt-3 sticky top-3 z-50 transition-all`) across the Home dashboard and Task Detail pages.
   - Include floating action pills, animated live sync indicator, quick search trigger (`/`), discipline filter shortcuts, and quick task creation modal trigger.

2. **Split-Table Task Detail Architecture**:
   - Preserve and elevate the left-right dual table layout on the Task Detail page:
     - **Left Pane (Operational Subtasks Breakdown)**: High-clarity table displaying item number, subtask title, start date, duration days, finish date, progress percentage bar, status badge (เสร็จ / ดำเนินการ / รอดำเนินการ), and row actions (insert above/below, edit progress, delete).
     - **Right Pane (Daily Timeline Matrix)**: Horizontally scrollable Gantt matrix strictly synchronized by row height with the left table, starting dynamically from `display_date` (or `report_date`), displaying grouped Thai month headers, weekend indicators, and interactive status capsules with hover tooltips and dynamic `[+1 เดือน]` extension controls.
   - Support synchronized row hover and responsive wrapping for smaller viewports.

3. **Modern shadcn + Magic UI + React Bits Design Language**:
   - Clean tokens with neutral dark slate (`#0F172A`), EGAT blue (`#005B9A`), EGAT amber/gold (`#F0B323`), emerald success (`#10B981`), and soft surface glass backgrounds.
   - Bento-box metadata cards with subtle border gradients, micro-glows, and interactive ripple/hover states.
   - Accessible keyboard shortcuts and smooth transitions.

## User Stories

1. As a maintenance supervisor, I want a modern floating navbar that stays accessible as I scroll through large work orders, so that I can quickly access filters, search, and actions without losing context.
2. As a department head, I want the floating navbar to display a live sync indicator with Google Sheets, so that I know my operations data is up to date in real time.
3. As a technician inspecting a Task Detail sheet, I want to clearly view the subtask list on the left and the day-by-day Gantt timeline on the right, so that I can evaluate schedule alignment at a glance.
4. As a planner managing Work Orders, I want the left subtask table and right timeline grid rows to highlight synchronously on hover, so that I can track long rows across the screen without visual misalignment.
5. As an engineer in discipline W12, I want to click any subtask progress cell to quickly update completion percentage and status, so that progress is recorded instantly.
6. As a team leader in discipline W13, I want to insert new subtask rows above or below existing subtasks with a clean dialog, so that newly discovered repair steps are sequenced properly.
7. As a project manager, I want the timeline matrix to begin precisely on the "แสดงข้อมูลตั้งแต่วันที่" date, so that the calendar aligns with the active maintenance window.
8. As a shop operator, I want to click "+1 เดือน" to dynamically extend the visible schedule window, so that I can inspect multi-month repair plans without reloading the page.
9. As a mobile or tablet user, I want the floating navbar and split workspace to adapt gracefully without broken layouts or cut-off content.
10. As a keyboard power user, I want to press "/" from anywhere to immediately focus the global search bar in the floating navbar, so that I can find Work Orders rapidly.
11. As a section head, I want distinct status badges for "เสร็จ" (Completed), "ดำเนินการ" (In Progress), and "รอดำเนินการ" (Pending) that follow the design language, so that task health is instantly recognizable.
12. As an administrator, I want to edit Task metadata (W/O, Equipment, Title, Start Date, Completion Date) directly from a clickable bento card, so that header details stay accurate.

## Implementation Decisions

1. **Floating Navigation Component (`FloatingNavbar`)**:
   - Construct a reusable floating island container with `sticky top-3 z-40 mx-4 max-w-7xl` (or container max-width), utilizing Tailwind backdrop blur, subtle inner borders (`border-white/10` or `border-slate-800/80`), and rounded pill geometry.
   - Support variants for the Dashboard page (Logo, Sheet Live Sync, Search shortcut, Quick Create) and the Task Detail page (Back to Master Sheet, Task # pill, Title, Quick Edit, Handover trigger, Open Real Sheet).

2. **Split-Table Layout Construction in `TaskDetailPage`**:
   - Construct a unified container with side-by-side coordinated tables or a CSS grid/flex layout where the left column houses subtask metadata and the right column houses the scrollable Gantt matrix.
   - Maintain fixed row height classes (`h-10` / `h-11`) across both left and right table bodies so rows align across the split boundary.
   - Implement synchronized row hover state (`hoveredRowId`) to give instant visual linkage between a subtask row on the left and its timeline capsule on the right.

3. **Design System & Micro-Interactions (Magic UI / React Bits style)**:
   - Bento-style summary cards with ambient corner gradients and metric counters.
   - Modal dialogs with smooth scale/fade animations and backdrop filters.
   - Subtle glowing badges for Discipline codes (W11, W12, W13, W14) and status indicators.
   - Adhere to the Ponytail principle: zero bloated npm dependencies—achieve the sleek Magic UI / React Bits look using clean Tailwind CSS v4 utilities, custom keyframes, and React state.

## Testing Decisions

- Test floating navbar responsiveness, sticky positioning, backdrop blur, and z-index layering against underlying content.
- Test keyboard shortcut (`/`) focusing search input across browser viewports.
- Test split-table alignment: verify left subtask rows and right timeline matrix rows match height across different zoom levels and content lengths.
- Test timeline extension (+1 month, -1 month, reset) maintaining correct date computations and capsule placements.
- Test metadata edit modal, subtask progress modal, and row insertion modals against API PATCH endpoints.

## Out of Scope

- Full 3D canvas backgrounds or WebGL animations that degrade tablet/field device performance.
- Drag-and-drop subtask date reordering (date changes continue through standard modal inputs).

## Further Notes

- Maintains 100% two-way sync compatibility with Google Sheets backend and Next.js 16 App Router.
