# Modern UI/UX Overhaul Specification (EGAT Operations Console 2026)

Status: ready-for-agent

## Problem Statement

The Task Detail Page (`/task/[id]`) currently renders in an outdated, raw spreadsheet cell-grid format (resembling a legacy Excel/Google Sheets formula bar with harsh borders and retro color cells). It lacks the modern visual fidelity, clear visual hierarchy, and polished interactions of a 2026-era enterprise operations console.

## Solution

Transform `/task/[id]` into a **Modern Operational Work Order Console**:
- **Hero Bento Card:** Clean brand bar, W/O chip, Equipment badge, large circular SVG progress ring, and real-time discipline workflow stepper.
- **High-Density Subtasks Table:** Clean, border-refined subtasks table with tabular numbers, animated progress bars, auto-calculated status badges, and inline row action buttons (`⬆️` Insert Above, `⬇️` Insert Below, `🗑️` Delete).
- **Fast Interactive Modals:** Glassmorphic modal with number typing + slider + presets (`[0%]`, `[25%]`, `[50%]`, `[75%]`, `[100%]`), and smooth insert-row modal.
- **Handover Workflow Dialog:** Stepper modal showing from-to discipline transitions with clear status badges and audit history logs.

## User Stories

1. As a maintenance technician, I want to view the work order details cleanly without confusing raw Excel formula bars, so that I can focus on actual maintenance execution.
2. As a discipline supervisor, I want to update subtask progress with slider presets and direct typing, so that progress entry is instant and auto-determines status.
3. As an operator, I want to insert subtask rows above or below any existing row directly from the table, so that additional steps are logged easily.
4. As a section head, I want to see the discipline handover stepper (W11 ➔ W12 ➔ W13 ➔ W14) with active indicators, so that I know exactly who currently owns the job.
5. As an engineer, I want to view the handover history logs with timestamps and notes, so that accountability is clear across departments.

## Implementation Decisions

- Remove legacy formula bar (`fx`) and raw spreadsheet table grid from `src/app/task/[id]/page.tsx`.
- Implement high-density Modern Bento Hero Card + Subtasks Table following the Linear/Apple Clean design system.
- Preserve full Google Sheets live synchronization and data contracts.

## Testing Decisions

- Verify subtask updates (PATCH `/api/tasks/[id]`) update progress and auto-derive status accurately.
- Verify subtask insertion (above/below) and deletion seamlessly modify the store.
- Verify discipline handover properly updates `current_discipline` and logs audit records.
- Run `npm run build` to ensure zero compilation or type errors.

## Out of Scope

- Modifying underlying backend Google Sheets API schema.
