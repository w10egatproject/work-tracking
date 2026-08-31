# 04: Dynamic Timeline Windowing with On-Demand Month Extension

**What to build:**
Dynamic timeline matrix generator that starts strictly from `display_date` (or `report_date`), defaults to an initial 2-month window, groups columns by Thai month name, and provides intuitive `[➕ ขยายดูเพิ่ม +1 เดือน]`, `[➖ ย่อเดือน]`, and `[รีเซ็ต]` controls. Renders subtask schedule capsules matching exact execution dates with hover tooltips.

**Blocked by:** 03: Split-Table Architecture with Synchronized Row Hover

**Status:** resolved

## Acceptance criteria
- [x] Timeline columns start dynamically from `display_date` (or `report_date`).
- [x] Month headers automatically group days into Thai month spans (e.g., ส.ค. 2569, ก.ย. 2569).
- [x] Weekend days (เสาร์-อาทิตย์) have subtle amber tint distinct from working days.
- [x] `[➕ ขยายดูเพิ่ม +1 เดือน]` button expands visible days without page refresh.
- [x] Subtask schedule capsules properly render and align across multi-month extensions.

## Answer
Implemented in [`src/app/task/[id]/page.tsx`](file:///d:/work-tracking/src/app/task/[id]/page.tsx).
