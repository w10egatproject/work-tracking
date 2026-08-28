# 1. Google Sheets as Master Data Source

Date: 2026-08-28

## Context

The maintenance tracking data is continuously maintained by plant teams across Google Sheets tabs (`ลำดับงาน` as master summary, and `งานที่1`, `งานที่2`, etc. as individual task breakdowns). We evaluated whether to migrate to a PostgreSQL/Supabase primary database or read directly from Google Sheets.

## Decision

We use Google Sheets as the master data source of truth. The web application connects via Google Sheets API (or cached server routes) to fetch live sheets data (`ลำดับงาน` for master table, and task-specific sheets for subtask/Gantt timelines).

## Consequences

- No dual-entry or data sync discrepancy between spreadsheets and application.
- Changes made by engineers in Google Sheets reflect directly in the web application.
- API quota and caching must be managed efficiently to ensure fast page loads.
