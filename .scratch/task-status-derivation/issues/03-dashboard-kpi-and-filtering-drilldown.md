# 03: Vertical Slice — Dashboard KPI Drilldown & Status Filtering

**What to build:** The complete dashboard interface (summary KPI cards, search toolbar, discipline filter chips, status dropdown, Table view, and Kanban columns) operates in full harmony with the derived states, ensuring zero data discrepancy across views.

**Blocked by:** 02: Vertical Slice — In-Progress vs Pending Dispatch (ดำเนินการ & รอดำเนินการ)

**Status:** resolved

- [x] Dashboard KPI cards (Total: 24, In-Progress: 4, Completed: 3, Pending: 17) display live counts matching the Master Sheet.
- [x] Status filter dropdown correctly filters for "ดำเนินการ", "เสร็จ", and "รอดำเนินการ".
- [x] Kanban board columns ("รอดำเนินการ", "ดำเนินการ", "เสร็จ") group tasks in exact alignment with the derived statuses.
- [x] Task detail page headers display the corresponding derived status badge consistently.

## Answer
Summary KPI cards, table filter dropdown, and kanban grouping now seamlessly display live counts: 24 total, 4 in-progress (17%), 3 completed (13%), 17 pending (70%).
