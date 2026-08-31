# ADR 0013: Code Review Audit Refactoring, Component Decoupling, and Status Fidelity

## Status
Accepted

## Context
Following the implementation of direct image upload, 40px spacious Gantt columns, seamless ribbon rendering, and auto-expanding timeline windows, a comprehensive dual-axis Code Review (Standards & Spec) was conducted across commits `c1f3df0` to `HEAD`.

The audit identified key areas for improvement:
1. **Status Fidelity**: Clarification from domain requirements confirmed that `"ยังไม่ดำเนินการ"` (Not Started) is a valid, active status from Google Sheets representing future scheduled tasks. It must be preserved in `TaskStatus` and `CONTEXT.md`.
2. **Timeline Boundary & Fallback Indices**: The JavaScript `Date` constructor is 0-indexed (May = 4, August = 7). The fallback starting date needed to be `new Date(2026, 4, 27)` and `useMemo` needed to consider the earliest subtask start date.
3. **Timeline Month Range Header Badge**: Header badge text was concatenating all long month names. It was streamlined into a concise range string e.g. `พ.ค. - ส.ค. 2569 (97 วัน)`.
4. **Theme Design System Consistency**: Focus ring outline was aligned to Mae Moh Amber (`var(--egat-amber)` `#f0b323`) per `THEME_DESIGN_SYSTEM.md`, and unused CSS classes were cleaned up.
5. **Component Decoupling & Modular Architecture**: `src/app/task/[id]/page.tsx` was modularized by extracting self-contained components into `src/components/task/`:
   - `TaskHeaderCard.tsx`
   - `TaskEditDetailsModal.tsx`
   - `SubtaskEditModal.tsx`
   - `InsertSubtaskModal.tsx`
   - `TaskPhotoLightboxModal.tsx`
   - `ThaiCalendarPickerModal.tsx`

## Decision
1. **Preserve `"ยังไม่ดำเนินการ"`**: Retain all 4 statuses (`"เสร็จ"`, `"ดำเนินการ"`, `"รอดำเนินการ"`, `"ยังไม่ดำเนินการ"`) in `TaskStatus` and document in `CONTEXT.md`.
2. **Modular Architecture in `src/components/task/`**: Decouple modals, header card, lightbox, and calendar picker into modular client components with typed props and callbacks.
3. **Accurate Date Computation**: Ensure dynamic timeline column generation computes the lower date bound across `display_date`, `report_date`, and all subtask `start` dates, using correct 0-indexed month arithmetic.
4. **Design System Adherence**: Enforce EGAT Mae Moh Amber focus rings across interactive controls.

## Consequences
- Single-responsibility principle adhered to with clear separation between page layout, timeline rendering, metadata management, and subtask manipulation.
- Production build succeeds cleanly with 0 TypeScript errors and optimized bundle sizes.
- Full fidelity with Google Sheets data schema and workflow semantics maintained.
