# ADR 0014: Clean Handover Discipline Selection and Sender Identity Capture

## Status
Accepted

## Context
In the Discipline Handover dialog (`DisciplineHandoverDialog.tsx`), the discipline select dropdown previously appended parenthetical annotations `(หมวดร่วมงานเดิม)` and `(หมวดใหม่)`. User feedback indicated that these parenthetical texts cluttered the interface and were unnecessary.

Additionally, the handover workflow needed accountability by capturing the identity of the person initiating the handover (**"ผู้ส่งมอบ"** / `byUser`), saving it with the handover record, and displaying it in the Handover History Logs on the task detail page.

## Decision
1. **Clean Discipline Select Dropdown**: Remove all parenthetical annotations `(หมวดร่วมงานเดิม)` and `(หมวดใหม่)` from dropdown options, rendering clean labels such as:
   - `W11 : วิศวกรรม - หมวดปัจจุบัน`
   - `W12 : เครื่องกล`
   - `W13 : ซ่อมเครื่องจักรกล`
   - `W14 : ซ่อมอุปกรณ์เครื่องจักรกล`
2. **Sender Identity Capture (`byUser`)**: Add an input field for "ผู้ส่งมอบงาน (Handover By)" in `DisciplineHandoverDialog.tsx`.
3. **End-to-End Propagation**: Pass `byUser` through `PATCH /api/tasks/[id]`, save to `DisciplineHandover` in `tasks-data.ts`, and render the sender badge in the Handover History Logs on the task detail view.

## Consequences
- Streamlined, clean dropdown UI matching the operational clarity expected by plant engineers.
- Full traceability of handovers with timestamp, from-discipline, to-discipline, sender name, and notes.
- Production build verified with 0 TypeScript errors.
