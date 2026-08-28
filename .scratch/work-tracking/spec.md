Status: ready-for-agent

# Work Tracking & Discipline Handover System Spec

## Problem Statement

Department Heads and Section Heads managing industrial maintenance tasks currently track complex multidisciplinary Work Orders (W/O) across Google Sheets. While spreadsheets provide flexible tabular and Gantt views, they suffer from lack of mobile responsiveness, cumbersome manual progress handovers between disciplines (W11 Engineering, W12 Mechanical, W13 Machinery Repair, W14 Machinery Equipment Repair), no unified cross-task Gantt view, and difficult multi-filter navigation across equipment and disciplines.

## Solution

A high-performance Next.js web application built with Tailwind CSS and shadcn components that mirrors the visual layout and familiarity of Google Sheets (Spreadsheet Fidelity) while providing two-way synchronization. It delivers an interactive master table, cross-project Gantt timeline, granular subtask and daily Gantt matrix grouped by discipline, and a structured Discipline Handover flow to seamlessly transition Work Orders across disciplines upon milestone completion.

---

## User Stories

1. As a Department Head, I want to see a master list of all maintenance tasks matching the Google Sheet layout, so that I can review Work Orders, equipment, start dates, and assigned disciplines without cognitive friction.
2. As a Section Head (W11-W14), I want to filter tasks by my specific discipline code, so that I can immediately focus on the jobs assigned to my section.
3. As a Department Head, I want to search tasks by Work Order (W/O) number, equipment name, or job title, so that I can quickly locate specific maintenance items.
4. As a Department Head, I want to switch between a tabular view and an overall Master Gantt Timeline view, so that I can visualize scheduling overlaps and project durations across all 24+ machines.
5. As a Section Head, I want to click into any task to view its detailed breakdown, top summary metadata, and daily/monthly Gantt schedule, so that I can understand every planned operational phase.
6. As a Section Head, I want subtasks in the detail view to be grouped under collapsible discipline headers (W11, W12, W13, W14), so that the structure matches our engineering work breakdown.
7. As a Section Head, I want to update subtask progress percentage and status directly from the web interface, so that operational progress is recorded without opening heavy spreadsheet applications.
8. As a Section Head of an active discipline (e.g. W12 Mechanical), I want to trigger a "Discipline Handover" action upon finishing our phase, selecting the recipient discipline (e.g. W13 Machinery Repair) with dates and handover notes, so that the next team is officially notified and activated.
9. As a Department Head, I want to view KPI summary cards showing total tasks, in-progress tasks, completed tasks, and discipline load distribution, so that I can allocate manpower effectively.
10. As a Department Head or Section Head, I want to add a new task from the main dashboard with Work Order, title, equipment, and multi-selected disciplines, so that standard starter subtasks are generated and appended to the master sheet.
11. As a user, I want the web application to cache Google Sheets data server-side and revalidate automatically, so that page navigation is instant and does not exceed API rate limits.
12. As a user, I want direct clickable links to the corresponding Google Sheet tabs in case advanced spreadsheet edits or raw formula checks are needed.

---

## Implementation Decisions

### Architectural Shape & Storage
- **Google Sheets as Master Data Source**: Google Sheets remains the authoritative source of truth. The application communicates with Google Sheets API via server routes and Server Actions.
- **Two-Way Synchronization**: Read operations leverage Next.js cached data fetching with background revalidation. Write operations (adding tasks, updating subtasks, recording handovers) mutate Google Sheets cells directly and invalidate the cache.
- **High-Fidelity Fallback Data**: When Google Service Account credentials are not configured in environment variables, the system falls back seamlessly to a high-fidelity dataset mirroring all 24 tasks and detail tabs.

### Domain Schema & State Shape
```typescript
interface Task {
  id: string
  taskNo: string
  title: string
  wo: string
  startDate: string
  endDate: string
  wCodes: string[]
  equip: string
  link: string
  totalDays: number
  expectedCompletionDate: string
  progress: number
  status: 'รอดำเนินการ' | 'ดำเนินการ' | 'เสร็จ'
  currentDiscipline: string
}

interface Subtask {
  id: string
  discipline: 'W11' | 'W12' | 'W13' | 'W14'
  disciplineName: string
  title: string
  startDate: string
  days: number
  endDate: string
  progress: number
  status: 'รอดำเนินการ' | 'ดำเนินการ' | 'เสร็จ'
}

interface DisciplineHandover {
  fromDiscipline: string
  toDiscipline: string
  handoverDate: string
  notes: string
  timestamp: string
}
```

### Visual & Interaction Design Tokens
- **Spreadsheet Aesthetic**: High-density clean borders, muted grey gridlines (`#e5e7eb`), pale yellow header accents (`#fef08a` / `#fef9c3`), Google Sheets green brand accent (`#0f9d58`).
- **Discipline Color Accents**:
  - `W11 (วิศวกรรม)`: Purple / Indigo accent
  - `W12 (เครื่องกล)`: Blue / Sky accent
  - `W13 (ซ่อมเครื่องจักรกล)`: Orange / Amber accent
  - `W14 (ซ่อมอุปกรณ์เครื่องจักรกล)`: Teal / Emerald accent
- **Status Indicators**:
  - `รอดำเนินการ`: Amber badge (`#fef3c7`, text `#b45309`)
  - `ดำเนินการ`: Blue badge (`#e0f2fe`, text `#0369a1`)
  - `เสร็จ`: Green badge (`#dcfce7`, text `#15803d`)
- **Gantt Matrix**: Aligned day and month columns with horizontal colored progress bars (blue for 100% completed, orange for in-progress/pending).

---

## Testing Decisions

### Seam Definition
- **Primary Seam**: Component and page-level integration tests verifying that state transitions (filtering, adding tasks, updating subtasks, and executing handovers) correctly update UI state and trigger data mutations.
- **Data Layer Seam**: Unit verification of Google Sheets parser and transformation functions ensuring accurate conversion between sheet 2D row arrays and typed domain entities.

### Test Criteria
- Behavior-oriented tests validating that selecting discipline filters isolates matching tasks.
- Verifying that submitting a Discipline Handover marks the source discipline as completed (100%) and transitions the target discipline to active status.
- Verification of Next.js production build (`npm run build`) without TypeScript or compilation errors.

---

## Out of Scope

- User authentication, role-based ACL, or SSO integration (deferred to future security phase).
- Direct cell formula editing within the web interface (users use Google Sheets directly for formula changes).
- Automated SMS/Push notification gateways outside web UI state updates.

---

## Further Notes

- Thai locale and date formatting (`ว. ด. ป.` and Thai Buddhist / CE year conversion) are supported natively across all date pickers and Gantt labels.
- The UI is designed to be fully responsive for tablet and desktop display in plant workshops and conference rooms.
