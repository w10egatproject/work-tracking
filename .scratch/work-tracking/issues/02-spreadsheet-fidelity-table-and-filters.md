# 02: Spreadsheet-Fidelity Master Table & Multi-Filter Search

**What to build:**
A high-density master table on the main dashboard (`/`) styled to closely mirror Google Sheets visual design (distinct green/yellow header styling, clean grid borders, colored discipline badges for W11-W14, and progress status tags), with interactive search by W/O or title, filtering by discipline (W11-W14), equipment, and status, along with KPI summary cards.

**Blocked by:** 01: Core Domain Types, Google Sheets Data Layer & High-Fidelity Dataset

**Status:** resolved

- [x] Build spreadsheet-styled table header matching the Google Sheet columns (`ลำดับงาน`, `รายการ`, `W/O`, `วันที่เริ่มงาน`, `วันที่สิ้นสุด`, `Wที่ร่วมงาน`, `Equip`, `ลิ้งค์`, `การกระทำ`).
- [x] Implement filter toolbar supporting Discipline selection (W11, W12, W13, W14, All), Equip selector, Status selector, and real-time text search.
- [x] Render color-coded discipline badges (W11 purple, W12 blue, W13 orange, W14 teal) and status badges (รอดำเนินการ, ดำเนินการ, เสร็จ).
- [x] Update KPI summary cards showing total tasks, in-progress count, completed count, and discipline workload breakdown.
- [x] Provide direct links to Google Sheet tabs and navigation to task detail pages (`/task/[id]`).
