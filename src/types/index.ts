export type DisciplineCode = "W11" | "W12" | "W13" | "W14"

export type TaskStatus = "รอดำเนินการ" | "ดำเนินการ" | "เสร็จ" | "ยังไม่ดำเนินการ"

export interface DisciplineMeta {
  code: DisciplineCode
  num: string
  name: string
  fullName: string
  badgeClass: string
  borderClass: string
  barClass: string
  lightBg: string
}

export const DISCIPLINE_CONFIG: Record<DisciplineCode, DisciplineMeta> = {
  W11: {
    code: "W11",
    num: "11",
    name: "วิศวกรรม",
    fullName: "W11 : วิศวกรรม",
    badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
    borderClass: "border-purple-300",
    barClass: "bg-purple-500",
    lightBg: "bg-purple-50",
  },
  W12: {
    code: "W12",
    num: "12",
    name: "เครื่องกล",
    fullName: "W12 : เครื่องกล",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    borderClass: "border-blue-300",
    barClass: "bg-blue-500",
    lightBg: "bg-blue-50",
  },
  W13: {
    code: "W13",
    num: "13",
    name: "ซ่อมเครื่องจักรกล",
    fullName: "W13 : ซ่อมเครื่องจักรกล",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    borderClass: "border-amber-300",
    barClass: "bg-orange-500",
    lightBg: "bg-amber-50",
  },
  W14: {
    code: "W14",
    num: "14",
    name: "ซ่อมอุปกรณ์เครื่องจักรกล",
    fullName: "W14 : ซ่อมอุปกรณ์เครื่องจักรกล",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    borderClass: "border-emerald-300",
    barClass: "bg-emerald-500",
    lightBg: "bg-emerald-50",
  },
}

export function parseWCodes(raw: string): DisciplineCode[] {
  if (!raw) return []
  const codes: DisciplineCode[] = []
  const clean = raw.replace(/\s+/g, "")
  if (clean.includes("11") || clean.includes("W11")) codes.push("W11")
  if (clean.includes("12") || clean.includes("W12")) codes.push("W12")
  if (clean.includes("13") || clean.includes("W13")) codes.push("W13")
  if (clean.includes("14") || clean.includes("W14")) codes.push("W14")
  return codes
}

export function deriveTaskStatus(completionDate?: string, link?: string): TaskStatus {
  if (completionDate && completionDate.trim() !== "") {
    return "เสร็จ"
  }
  if (link && link.trim() !== "") {
    return "ดำเนินการ"
  }
  return "รอดำเนินการ"
}

export interface Subtask {
  id: string
  category: string
  discipline?: DisciplineCode
  start: string
  days: number
  end: string
  progress: number
  status: TaskStatus
  isHeader?: boolean
  highlightStart?: boolean
  highlightEnd?: boolean
}

export interface GanttBar {
  label: string
  startIdx: number
  width: number
  color: string
  progress: number
  discipline?: DisciplineCode
}

export interface GanttData {
  months: string[]
  bars: GanttBar[]
}

export interface Task {
  id: string
  taskNo: string
  title: string
  wo: string
  report_date: string
  display_date?: string
  completion_codes: string
  w_codes: DisciplineCode[]
  completion_date: string
  total_days: number
  progress: number
  equip: string
  link: string
  status: TaskStatus
  current_discipline?: DisciplineCode
  sheet_name?: string
  imageUrl?: string
  subtasks?: Subtask[]
  gantt?: GanttData
  handovers?: DisciplineHandover[]
}

export interface DisciplineHandover {
  id: string
  taskId: string
  fromDiscipline: DisciplineCode
  toDiscipline: DisciplineCode
  handoverDate: string
  notes: string
  byUser?: string
  timestamp: string
}
