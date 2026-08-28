# 01: Vertical Slice — Completed Task Closure (เสร็จ)

**What to build:** Tasks with a recorded completion date (`completion_date` / วันที่สิ้นสุด) are deterministically recognized as completed across Google Sheets data ingestion, internal storage, and the web interface. They display the green "เสร็จสมบูรณ์" badge, 100% progress, and increment the "เสร็จสมบูรณ์" KPI summary card.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Tasks with a non-empty completion date derive `status: "เสร็จ"` and `progress: 100` regardless of detail sheet links.
- [x] The "เสร็จสมบูรณ์" KPI card reflects the exact count of completed tasks from the Master Sheet.
- [x] Completed tasks render with the green checkmark badge in both Table and Kanban views.
- [x] Status filter dropdown option "เสร็จสมบูรณ์ (Completed)" isolates all completed tasks.

## Answer
Implemented `deriveTaskStatus` in `src/types/index.ts` prioritizing `completion_date`. Integrated into Google Sheets parser and tasks-data store.
