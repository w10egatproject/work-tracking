# 2. Two-way Google Sheets Synchronization and Discipline Handover

Date: 2026-08-28

## Context

Department Heads and Section Heads need to create new maintenance tasks from the web interface, edit existing tasks and subtask progress, and transfer work sequentially between disciplines (W11 -> W12 -> W13 -> W14).

## Decision

1. **Two-Way API Operations**:
   - Reading: Next.js server route fetches and caches Google Sheets data with cache revalidation for near-instant client loads.
   - Writing: Adding new tasks appends rows to the Master Sheet (`ลำดับงาน`) and scaffolds/updates task detail tabs (`งานที่X`). Updating subtask progress or metadata writes directly back to Google Sheets cells.
2. **Discipline Handover Flow**:
   - When a discipline completes its work, the system facilitates explicit handover to the next collaborating discipline in the task's `W` sequence, updating discipline progress and status tags.

## Consequences

- Full read/write parity between Google Sheets and Web UI.
- Direct operational auditability for Section Heads as jobs progress through disciplines.
- Requires Google Service Account with write permissions (`https://www.googleapis.com/auth/spreadsheets`).
