# 3. Spreadsheet-Fidelity UI and Modern Component Stack

Date: 2026-08-28

## Context

Users (Department Heads and Section Heads) are accustomed to the visual structure and workflow of the operational Google Sheets. To ensure zero cognitive friction, high readability, and rapid adoption, the web application must mirror the familiar styling of the Google Sheets layout while providing interactive advantages (filtering, responsive Gantt zoom, modal editors, handover flow).

## Decision

1. **Stack**: Next.js App Router, Tailwind CSS, Lucide icons, and shadcn-style UI components.
2. **Visual Design**: Replicate sheet visual cues (clean tabular borders, discipline header accents, color-coded status badges, structured summary info boxes, and daily/monthly Gantt bars matching sheet colors: blue for finished, orange for in-progress/pending).
3. **Workflow Integration**: Incorporate a dedicated "Discipline Handover" modal and quick-edit controls directly within the familiar tabular timeline layout.

## Consequences

- Instant familiarity for plant engineers and section heads.
- High data density and crisp readability on both desktop and tablet screens.
