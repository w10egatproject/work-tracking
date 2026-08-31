# 02: Modern Bento Metadata Card & Stepper on Task Detail Page

**What to build:**
A sleek Bento-style metadata header card on the Task Detail page presenting essential Work Order attributes in distinct clickable glass pills (Work Order #, Equipment, Start Date, Display Date, Duration Days, Completion Date), along with an animated radial progress indicator and discipline handover pipeline stepper (W11 -> W12 -> W13 -> W14).

**Blocked by:** 01: Floating Island Navbar with Glassmorphic Command Pill

**Status:** resolved

## Acceptance criteria
- [x] Bento header card with subtle top gradient accent and soft border highlights.
- [x] Five dedicated metadata pills (Start Date, Display Date, Duration, Completion Date, Equipment) that open the edit modal on click.
- [x] Radial progress ring visualizing total task completion percentage with status colors.
- [x] Handover stepper pipeline showing discipline progression with current active discipline highlighted.

## Answer
Implemented in [`src/app/task/[id]/page.tsx`](file:///d:/work-tracking/src/app/task/[id]/page.tsx).
