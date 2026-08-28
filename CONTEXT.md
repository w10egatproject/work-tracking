# Work Tracking

A maintenance task tracking and timeline management system for industrial equipment and plant machinery, used by Department Heads and Section Heads to monitor Work Orders, multidisciplinary progress (W11-W14), and Gantt schedules.

## Language

### Work & Equipment

**Work Order (W/O)**:
A maintenance order number identifying a specific repair or fabrication task.
_Avoid_: Ticket, job number, task number

**Task (งาน)**:
A top-level maintenance project corresponding to a row in the master sheet and associated with a specific Work Order.
_Avoid_: Issue, item, project

**Equipment (Equip)**:
The specific machinery, plant unit, or vehicle being repaired or serviced (e.g. Crusher, Reclaimer, Truck).
_Avoid_: Asset, machine id, device

### Disciplines & Workflow

**Discipline (หมวดงาน / รหัส W)**:
A specialized technical work section assigned to execute parts of a Work Order.
- **W11 (วิศวกรรม)**: Engineering discipline.
- **W12 (เครื่องกล)**: Mechanical discipline.
- **W13 (ซ่อมเครื่องจักรกล)**: Machinery Repair discipline.
- **W14 (ซ่อมอุปกรณ์เครื่องจักรกล)**: Machinery Equipment Repair discipline.
_Avoid_: Department, group, role

**Subtask (งานย่อย / งานที่ต้องทำ)**:
An individual operational step or phase nested under a specific Discipline within a Task.
_Avoid_: Step, child task, activity

**Discipline Handover (การส่งมอบงานระหว่างหมวด)**:
The operational transfer of a task from a completed discipline (e.g. W12 finishing fabrication) to the next participating discipline (e.g. W13 commencing assembly/welding).
_Avoid_: Task assignment, routing, forwarding

**Progress Status (สถานะการดำเนินงาน)**:
The operational state of a task or subtask: `รอดำเนินการ` (Pending), `ดำเนินการ` (In Progress), `เสร็จ` (Completed).
_Avoid_: State, phase, stage

**Timeline / Gantt (ตารางเวลาการดำเนินงาน)**:
Day-by-day and month-by-month schedule showing planned vs actual duration for each discipline and subtask.
_Avoid_: Calendar, roadmap, schedule

### Sheets & Storage

**Master Sheet (แผ่นงานลำดับงาน)**:
The central index tab in Google Sheets containing high-level metadata for all tasks.
_Avoid_: Summary sheet, index tab, home sheet

**Task Detail Sheet (แผ่นงานรายละเอียดงานย่อย)**:
A dedicated tab for an individual task (e.g., `งานที่1`, `งานที่2`) containing discipline breakdowns, subtask rows, and the daily Gantt matrix.
_Avoid_: Detail tab, child sheet
