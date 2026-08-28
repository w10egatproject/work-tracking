# 02: Vertical Slice — In-Progress vs Pending Dispatch (ดำเนินการ & รอดำเนินการ)

**What to build:** Uncompleted tasks without completion dates are automatically partitioned: tasks with a linked Task Detail Sheet (`link`) are marked as "กำลังดำเนินการ" with active discipline tracking and contribute to the "กำลังดำเนินการ" KPI card; tasks without a detail sheet link are marked as "รอดำเนินการ" (Pending) and contribute to the "รอดำเนินการ" KPI card. Adding or removing a detail sheet link dynamically transitions the task state.

**Blocked by:** 01: Vertical Slice — Completed Task Closure (เสร็จ)

**Status:** resolved

- [x] Tasks without completion date but with a valid detail sheet link derive `status: "ดำเนินการ"`.
- [x] Tasks without completion date and without a detail sheet link derive `status: "รอดำเนินการ"`.
- [x] Adding a Task Detail Sheet link dynamically transitions a task from "รอดำเนินการ" to "ดำเนินการ".
- [x] KPI cards for "กำลังดำเนินการ" and "รอดำเนินการ" reflect accurate counts matching Master Sheet rows.

## Answer
Partitioned in-progress vs pending tasks based on presence of `link`. Linked tasks automatically receive "ดำเนินการ" and unlinked receive "รอดำเนินการ".
