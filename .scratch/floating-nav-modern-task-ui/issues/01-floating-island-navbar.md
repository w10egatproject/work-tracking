# 01: Floating Island Navbar with Glassmorphic Command Pill

**What to build:**
A modern floating island navigation header (`FloatingNavbar`) with glassmorphic backdrop blur, subtle ambient border glow, and sticky positioning. It serves as the primary command center on both the Dashboard and Task Detail pages, providing instant access to Google Sheets live sync status, search shortcut (`/`), quick action buttons, and page-specific navigation.

**Blocked by:** None

**Status:** resolved

## Acceptance criteria
- [x] Floating pill container with sticky top positioning (`sticky top-3.5 z-40 mx-auto max-w-[1700px]`), frosted backdrop blur (`backdrop-blur-xl bg-slate-900/90`), and refined borders (`border-slate-700/70`).
- [x] Animated Google Sheets live synchronization status indicator.
- [x] Keyboard accessible search trigger (`/` shortcut) and responsive action buttons.
- [x] Task Detail variant showing "Back to Master Sheet", task number badge, truncated title, and action buttons (Edit Metadata, Handover, Open Real Sheet).

## Answer
Implemented [`src/components/FloatingNavbar.tsx`](file:///d:/work-tracking/src/components/FloatingNavbar.tsx) with support for both `dashboard` and `task-detail` variants, integrated into both main pages.
