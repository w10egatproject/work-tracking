"use client"

import { useState, useEffect, use, useMemo } from "react"
import { Task, Subtask, TaskStatus, DISCIPLINE_CONFIG, DisciplineCode } from "@/types"
import DisciplineHandoverDialog from "@/components/DisciplineHandoverDialog"
import {
  ArrowLeft,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  ArrowUpToLine,
  ArrowDownToLine,
  Plus,
  CheckCircle2,
  Clock,
  Wrench,
  Calendar as CalendarIcon,
  Layers,
  Sparkles,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Thai date parsing utilities
const THAI_MONTHS: Record<string, number> = {
  "ม.ค.": 0, "ก.พ.": 1, "มี.ค.": 2, "เม.ย.": 3, "พ.ค.": 4, "มิ.ย.": 5,
  "ก.ค.": 6, "ส.ค.": 7, "ก.ย.": 8, "ต.ค.": 9, "พ.ย.": 10, "ธ.ค.": 11,
}
const THAI_MONTH_NAMES = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
const THAI_MONTH_FULL = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
]
const THAI_DAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."]
const THAI_DAYS_FULL = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"]

interface DayColumn {
  date: Date
  dateStr: string
  dayNum: number
  monthName: string
  weekday: string
  weekdayFull: string
  isWeekend: boolean
}

function parseThaiDate(str?: string): Date | null {
  if (!str) return null
  const clean = str.trim()
  const parts = clean.split(/\s+/)
  if (parts.length < 3) return null
  const day = parseInt(parts[0], 10)
  const month = THAI_MONTHS[parts[1]]
  let year = parseInt(parts[2], 10)
  if (year > 2500) year -= 543
  if (isNaN(day) || month === undefined || isNaN(year)) return null
  return new Date(year, month, day)
}

function formatThaiDate(d: Date): string {
  const day = d.getDate()
  const month = THAI_MONTH_NAMES[d.getMonth()]
  const year = d.getFullYear() + (d.getFullYear() < 2500 ? 543 : 0)
  return `${day} ${month} ${year}`
}

function calculateDayDifference(startStr: string, endStr: string): number {
  const s = parseThaiDate(startStr)
  const e = parseThaiDate(endStr)
  if (!s || !e) return 1
  const diffTime = e.getTime() - s.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays > 0 ? diffDays : 1
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const taskId = resolvedParams.id

  const [task, setTask] = useState<Task | null>(null)
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [handoverOpen, setHandoverOpen] = useState(false)

  // Edit Task Header Metadata State
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editReportDate, setEditReportDate] = useState("") // วันที่เริ่มงาน
  const [editDisplayDate, setEditDisplayDate] = useState("") // แสดงข้อมูลตั้งแต่วันที่
  const [editCompletionDate, setEditCompletionDate] = useState("") // วันที่แล้วเสร็จ
  const [editTotalDays, setEditTotalDays] = useState(11) // ระยะเวลาคำนวณอัตโนมัติ (ห้ามพิมพ์)
  const [editWo, setEditWo] = useState("")
  const [editEquip, setEditEquip] = useState("")
  const [isSavingTaskDetails, setIsSavingTaskDetails] = useState(false)

  // Calendar Modal Picker State
  const [calendarPickerOpen, setCalendarPickerOpen] = useState(false)
  const [calendarTargetField, setCalendarTargetField] = useState<"report_date" | "display_date" | "completion_date">("report_date")
  const [calendarPickerTitle, setCalendarPickerTitle] = useState("เลือกวันที่")
  const [calendarCurrentDate, setCalendarCurrentDate] = useState<Date>(new Date())

  // Subtask progress editing state
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null)
  const [editProgress, setEditProgress] = useState(0)
  const [editStatus, setEditStatus] = useState<TaskStatus>("ดำเนินการ")
  const [isSavingSubtask, setIsSavingSubtask] = useState(false)

  // Insert row modal state
  const [insertModalOpen, setInsertModalOpen] = useState(false)
  const [targetSubtask, setTargetSubtask] = useState<Subtask | null>(null)
  const [insertPosition, setInsertPosition] = useState<"above" | "below">("below")
  const [insertCategory, setInsertCategory] = useState("")
  const [insertStart, setInsertStart] = useState("")
  const [insertDays, setInsertDays] = useState(1)
  const [insertEnd, setInsertEnd] = useState("")
  const [isInsertingSubtask, setIsInsertingSubtask] = useState(false)

  const getDerivedStatus = (p: number): TaskStatus => {
    if (p === 100) return "เสร็จ"
    if (p > 0) return "ดำเนินการ"
    return "รอดำเนินการ"
  }

  const loadTask = async () => {
    try {
      const [taskRes, allRes] = await Promise.all([
        fetch(`/api/tasks/${taskId}`),
        fetch(`/api/tasks`),
      ])
      if (taskRes.ok) {
        const data = await taskRes.json()
        setTask(data)
      }
      if (allRes.ok) {
        const list = await allRes.json()
        setAllTasks(list)
      }
    } catch (e) {
      console.error("Failed to load task:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTask()
  }, [taskId])

  // Open Edit Task Header Metadata modal
  const handleOpenEditTaskModal = () => {
    if (!task) return
    setEditTitle(task.title || "")
    const repDate = task.report_date || "27 ส.ค. 2026"
    const dispDate = task.display_date || task.report_date || "27 ส.ค. 2026"
    const compDate = task.completion_date || "7 ก.ย. 2026"

    setEditReportDate(repDate)
    setEditDisplayDate(dispDate)
    setEditCompletionDate(compDate)
    setEditTotalDays(calculateDayDifference(repDate, compDate))
    setEditWo(task.wo || "")
    setEditEquip(task.equip || "")
    setEditTaskModalOpen(true)
  }

  // Open Calendar Picker Modal for a specific date field
  const handleOpenCalendarPicker = (
    field: "report_date" | "display_date" | "completion_date",
    title: string,
    currentVal: string
  ) => {
    setCalendarTargetField(field)
    setCalendarPickerTitle(title)
    const parsed = parseThaiDate(currentVal) || new Date()
    setCalendarCurrentDate(parsed)
    setCalendarPickerOpen(true)
  }

  // Handle selecting a date from the Calendar Picker
  const handleSelectCalendarDate = (selectedDate: Date) => {
    const formatted = formatThaiDate(selectedDate)
    if (calendarTargetField === "report_date") {
      setEditReportDate(formatted)
      const diff = calculateDayDifference(formatted, editCompletionDate)
      setEditTotalDays(diff)
    } else if (calendarTargetField === "display_date") {
      setEditDisplayDate(formatted)
    } else if (calendarTargetField === "completion_date") {
      setEditCompletionDate(formatted)
      const diff = calculateDayDifference(editReportDate, formatted)
      setEditTotalDays(diff)
    }
    setCalendarPickerOpen(false)
  }

  const handleSaveTaskDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return
    setIsSavingTaskDetails(true)

    const calculatedDays = calculateDayDifference(editReportDate, editCompletionDate)

    const updates = {
      title: editTitle.trim(),
      report_date: editReportDate.trim(),
      display_date: editDisplayDate.trim(),
      completion_date: editCompletionDate.trim(),
      total_days: calculatedDays,
      wo: editWo.trim(),
      equip: editEquip.trim(),
    }

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateTaskDetails",
          updates,
        }),
      })

      if (res.ok) {
        const updatedTask = await res.json()
        setTask(updatedTask)
      } else {
        setTask({ ...task, ...updates })
      }
    } catch (err) {
      console.error("Error saving task details:", err)
      setTask({ ...task, ...updates })
    } finally {
      setIsSavingTaskDetails(false)
      setEditTaskModalOpen(false)
    }
  }

  // Generate dynamic date timeline columns based on display_date (or report_date) and completion_date
  const { dayColumns, monthGroups } = useMemo(() => {
    if (!task) return { dayColumns: [], monthGroups: [] }

    let startDate = parseThaiDate(task.display_date) || parseThaiDate(task.report_date)
    let endDate = parseThaiDate(task.completion_date)

    if (task.subtasks && task.subtasks.length > 0) {
      for (const st of task.subtasks) {
        const s = parseThaiDate(st.start)
        const e = parseThaiDate(st.end)
        if (s && (!startDate || s < startDate)) startDate = s
        if (e && (!endDate || e > endDate)) endDate = e
      }
    }

    if (!startDate) startDate = new Date(2026, 7, 27)
    if (!endDate || endDate < startDate) {
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + (task.total_days ? task.total_days - 1 : 11))
    }

    const cols: DayColumn[] = []
    const cur = new Date(startDate)
    let count = 0
    while (cur <= endDate && count < 35) {
      const dayOfWeek = cur.getDay()
      cols.push({
        date: new Date(cur),
        dateStr: formatThaiDate(cur),
        dayNum: cur.getDate(),
        monthName: THAI_MONTH_NAMES[cur.getMonth()],
        weekday: THAI_DAYS[dayOfWeek],
        weekdayFull: THAI_DAYS_FULL[dayOfWeek],
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      })
      cur.setDate(cur.getDate() + 1)
      count++
    }

    const groups: { month: string; span: number }[] = []
    let currentMonth = ""
    let currentSpan = 0

    for (const c of cols) {
      if (c.monthName !== currentMonth) {
        if (currentSpan > 0) {
          groups.push({ month: currentMonth, span: currentSpan })
        }
        currentMonth = c.monthName
        currentSpan = 1
      } else {
        currentSpan++
      }
    }
    if (currentSpan > 0) {
      groups.push({ month: currentMonth, span: currentSpan })
    }

    return { dayColumns: cols, monthGroups: groups }
  }, [task])

  const handleOpenEditSubtask = (st: Subtask) => {
    setEditingSubtask(st)
    setEditProgress(st.progress || 0)
    setEditStatus(st.status || getDerivedStatus(st.progress || 0))
  }

  const handleSaveSubtask = async () => {
    if (!editingSubtask || !task) return
    setIsSavingSubtask(true)

    const progressNum = Number(editProgress)
    const autoStatus = getDerivedStatus(progressNum)

    const updates = {
      progress: progressNum,
      status: autoStatus,
    }

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateSubtask",
          subtaskId: editingSubtask.id,
          updates,
        }),
      })

      if (res.ok) {
        const updatedTask = await res.json()
        setTask(updatedTask)
      } else {
        loadTask()
      }
    } catch (err) {
      console.error("Error saving subtask:", err)
    } finally {
      setIsSavingSubtask(false)
      setEditingSubtask(null)
    }
  }

  const handleOpenInsertModal = (st: Subtask, pos: "above" | "below", e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setTargetSubtask(st)
    setInsertPosition(pos)
    setInsertCategory("")
    setInsertStart(st.start || task?.report_date || "")
    setInsertDays(st.days || 1)
    setInsertEnd(st.end || "")
    setInsertModalOpen(true)
  }

  const handleSaveInsertSubtask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!insertCategory.trim() || !task || !targetSubtask) return
    setIsInsertingSubtask(true)

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "insertSubtask",
          discipline: targetSubtask.discipline || "W13",
          newSubtask: {
            category: insertCategory.trim(),
            start: insertStart,
            days: Number(insertDays) || 1,
            end: insertEnd,
            progress: 0,
            status: "รอดำเนินการ",
          },
          targetSubtaskId: targetSubtask.id,
          position: insertPosition,
        }),
      })

      if (res.ok) {
        const updatedTask = await res.json()
        setTask(updatedTask)
      } else {
        loadTask()
      }
    } catch (err) {
      console.error("Error inserting subtask:", err)
    } finally {
      setIsInsertingSubtask(false)
      setInsertModalOpen(false)
    }
  }

  const handleDeleteSubtask = async (subtaskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("คุณต้องการลบแถวงานย่อยนี้ใช่หรือไม่?")) return
    try {
      const res = await fetch(`/api/tasks/${task!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteSubtask", subtaskId }),
      })
      if (res.ok) {
        const updatedTask = await res.json()
        setTask(updatedTask)
      } else {
        loadTask()
      }
    } catch (err) {
      console.error("Error deleting subtask:", err)
    }
  }

  const isSubtaskActiveOnDay = (st: Subtask, day: DayColumn) => {
    const s = parseThaiDate(st.start)
    const e = parseThaiDate(st.end)
    if (!s) return false
    const d = day.date
    if (e) return d >= s && d <= e
    return d.getTime() === s.getTime()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3 font-sans">
        <div className="w-9 h-9 border-3 border-[#005B9A] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-slate-400 text-xs font-semibold">กำลังโหลดข้อมูลแผ่นงาน...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-12 text-center flex flex-col items-center justify-center font-sans">
        <div className="text-4xl mb-3">📄</div>
        <div className="text-[#0F172A] font-bold text-sm mb-4">ไม่พบข้อมูลงานที่ระบุในแผ่นงาน</div>
        <a href="/" className="px-4 py-2 bg-[#005B9A] text-white rounded-xl text-xs font-semibold hover:bg-[#004A7D] transition-colors shadow-xs">
          ← กลับหน้ารวมงาน
        </a>
      </div>
    )
  }

  const subtasks = task.subtasks || []
  const currentTaskNum = task.taskNo?.replace("งานที่", "") || task.id

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans select-none antialiased text-[12px] pb-8 selection:bg-[#005B9A] selection:text-white">
      {/* 1. Modern Frosted Header Bar */}
      <header className="bg-[#0F172A] text-white px-5 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700/80 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#F0B323]" />
            <span>กลับตารางหลัก</span>
          </a>
          <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-[#005B9A] text-white px-2.5 py-0.5 rounded-lg shadow-2xs">
              {task.taskNo || `งานที่${task.id}`}
            </span>
            <div className="hidden md:block">
              <span className="text-xs font-bold text-white max-w-[400px] truncate block" title={task.title}>
                {task.title}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenEditTaskModal}
            className="px-3.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
            title="แก้ไขวันที่และรายละเอียดใบสั่งงาน"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#F0B323]" />
            <span>แก้ไขวันที่/ข้อมูลงาน</span>
          </button>

          <button
            onClick={() => setHandoverOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#F0B323] to-[#D99C12] hover:from-[#D99C12] text-[#0F172A] rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-[0_2px_8px_rgba(240,179,35,0.3)] active:scale-95"
          >
            <span>🤝 ส่งมอบงาน (Handover)</span>
          </button>

          {task.link && (
            <a
              href={task.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">เปิดชีทจริง</span>
            </a>
          )}
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 p-5 max-w-[1700px] w-full mx-auto space-y-4">
        {/* 2. Modern Minimalist Sheet Header Card (Clickable Metadata Boxes) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] overflow-hidden">
          {/* Card Top Accent Strip */}
          <div className="h-1 bg-gradient-to-r from-[#005B9A] via-[#F0B323] to-[#10B981]"></div>
          
          <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left: Job Title & W/O Details */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">งานที่</span>
                <span className="bg-slate-100 text-[#0F172A] font-extrabold px-2.5 py-0.5 rounded-lg font-mono text-sm border border-slate-200">
                  {currentTaskNum}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-bold text-slate-400">เลข W/O:</span>
                <button
                  onClick={handleOpenEditTaskModal}
                  className="bg-sky-50 hover:bg-sky-100 text-[#005B9A] font-extrabold px-2.5 py-0.5 rounded-lg font-mono text-xs border border-sky-200/80 transition-colors flex items-center gap-1 group"
                  title="คลิกเพื่อแก้ไข W/O"
                >
                  <span>{task.wo || "-"}</span>
                  <Edit2 className="w-3 h-3 text-[#005B9A] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-bold text-slate-400">หมวดร่วมงาน:</span>
                <span className="bg-amber-50 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-lg font-mono text-xs border border-amber-200/80">
                  {task.completion_codes || task.w_codes?.map((w) => w.replace("W", "")).join(",") || "11,13"}
                </span>
              </div>

              {/* Title Box with subtle peach glow (Clickable to Edit) */}
              <div
                onClick={handleOpenEditTaskModal}
                className="bg-amber-50/40 hover:bg-amber-50/70 border border-amber-200/70 rounded-xl p-3.5 cursor-pointer transition-all group"
                title="คลิกเพื่อแก้ไขชื่องานและวันที่"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-amber-800/80 uppercase tracking-wider">
                    ชื่องาน / รายละเอียดใบสั่งงาน (คลิกเพื่อแก้ไข):
                  </span>
                  <Edit2 className="w-3.5 h-3.5 text-amber-700 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <h2 className="text-sm font-bold text-[#0F172A] leading-relaxed group-hover:text-[#005B9A] transition-colors">
                  {task.title}
                </h2>
              </div>

              {/* Meta Grid Pills - 5 Separate Clear Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {/* 1. วันที่เริ่มงาน (Row 3) */}
                <button
                  type="button"
                  onClick={handleOpenEditTaskModal}
                  className="bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 p-2.5 rounded-xl text-left transition-all group"
                  title="คลิกเพื่อแก้ไขวันที่เริ่มงาน"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-[#005B9A]">
                    <span>วันที่เริ่มงาน</span>
                    <CalendarIcon className="w-3 h-3 text-[#005B9A]" />
                  </div>
                  <div className="font-bold text-[#0F172A] mt-0.5 font-mono group-hover:text-[#005B9A]">
                    {task.report_date || "-"}
                  </div>
                </button>

                {/* 2. แสดงข้อมูลตั้งแต่วันที่ (Row 6) */}
                <button
                  type="button"
                  onClick={handleOpenEditTaskModal}
                  className="bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 p-2.5 rounded-xl text-left transition-all group"
                  title="คลิกเพื่อแก้ไขวันที่เริ่มแสดงผลไทม์ไลน์"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-[#005B9A]">
                    <span>แสดงตั้งแต่วันที่</span>
                    <CalendarIcon className="w-3 h-3 text-[#005B9A]" />
                  </div>
                  <div className="font-bold text-[#005B9A] mt-0.5 font-mono">
                    {task.display_date || task.report_date || "-"}
                  </div>
                </button>

                {/* 3. ระยะเวลาการทำงาน (คำนวณอัตโนมัติ) */}
                <div
                  className="bg-slate-100/70 border border-slate-200/80 p-2.5 rounded-xl text-left"
                  title="ระยะเวลาคำนวณอัตโนมัติจากวันที่เริ่มงานและวันที่แล้วเสร็จ"
                >
                  <div className="text-[10px] font-bold text-slate-400">
                    ระยะเวลา (วัน)
                  </div>
                  <div className="font-bold text-[#0F172A] mt-0.5 font-mono">
                    {task.total_days || calculateDayDifference(task.report_date, task.completion_date)} วัน
                  </div>
                </div>

                {/* 4. วันที่แล้วเสร็จ (Row 5) */}
                <button
                  type="button"
                  onClick={handleOpenEditTaskModal}
                  className="bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 p-2.5 rounded-xl text-left transition-all group"
                  title="คลิกเพื่อแก้ไขวันที่แล้วเสร็จ"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-[#005B9A]">
                    <span>วันที่แล้วเสร็จ</span>
                    <CalendarIcon className="w-3 h-3 text-[#005B9A]" />
                  </div>
                  <div className="font-bold text-[#0F172A] mt-0.5 font-mono group-hover:text-[#005B9A]">
                    {task.completion_date || "-"}
                  </div>
                </button>

                {/* 5. อุปกรณ์ (Equip) */}
                <button
                  type="button"
                  onClick={handleOpenEditTaskModal}
                  className="bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 p-2.5 rounded-xl text-left transition-all truncate group"
                  title="คลิกเพื่อแก้ไขอุปกรณ์"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-[#005B9A]">
                    <span>อุปกรณ์ (Equip)</span>
                    <Wrench className="w-3 h-3 opacity-60" />
                  </div>
                  <div className="font-bold text-[#0F172A] mt-0.5 truncate group-hover:text-[#005B9A]">
                    {task.equip || "-"}
                  </div>
                </button>
              </div>
            </div>

            {/* Right: Progress & Stepper */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-50/90 to-white border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ความคืบหน้ารวม</span>
                  <div className="text-2xl font-extrabold text-[#005B9A] font-mono tracking-tight mt-0.5">
                    {task.progress}%
                  </div>
                </div>
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={task.progress === 100 ? "text-emerald-500" : "text-[#005B9A]"}
                      strokeDasharray={`${task.progress}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-extrabold text-[#0F172A] font-mono">
                    {task.progress}%
                  </span>
                </div>
              </div>

              {/* Handover Stepper Pipeline */}
              <div className="pt-2 border-t border-slate-200/70">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  ลำดับหมวดงาน:
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {task.w_codes &&
                    task.w_codes.map((w, idx) => {
                      const isCurrent = task.current_discipline === w
                      const conf = DISCIPLINE_CONFIG[w]
                      return (
                        <div key={w} className="flex items-center gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${
                              isCurrent
                                ? "bg-sky-50 text-[#005B9A] border-[#005B9A] ring-1 ring-sky-200 shadow-2xs font-extrabold"
                                : "bg-white text-slate-600 border-slate-200"
                            }`}
                          >
                            {conf?.num || w} {isCurrent && "📍"}
                          </span>
                          {idx < task.w_codes.length - 1 && (
                            <span className="text-slate-300 text-[10px]">➔</span>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Modern High-Density Spreadsheet & Timeline Matrix Grid */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] overflow-hidden">
          {/* Table Header Bar */}
          <div className="bg-gradient-to-r from-slate-50 to-white px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#005B9A] ring-4 ring-sky-100"></span>
              <span className="text-xs font-bold text-[#0F172A]">
                ตารางแผนงานย่อยและไทม์ไลน์รายวัน (Subtasks Breakdown & Daily Schedule)
              </span>
              <span className="text-[11px] font-bold text-[#005B9A] bg-sky-50 border border-sky-200/80 px-2 py-0.2 rounded-full font-mono">
                {subtasks.length} แถว
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              💡 คลิกที่แถวเพื่อแก้ % ความคืบหน้า • ชี้เมาส์ที่แถวเพื่อแทรก/ลบแถว
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] font-sans text-slate-700">
              <thead>
                {/* Month Group Headers Row */}
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-600 font-bold text-[10px]">
                  <th className="py-2 px-3 w-10 text-center border-r border-slate-200 bg-slate-200/60 font-mono">#</th>
                  <th className="py-2 px-4 min-w-[240px] text-left border-r border-slate-200">งานที่ต้องทำ</th>
                  <th className="py-2 px-3 w-28 text-center border-r border-slate-200">วันที่เริ่มงาน</th>
                  <th className="py-2 px-2 w-16 text-center border-r border-slate-200 font-mono">วันที่ใช้</th>
                  <th className="py-2 px-3 w-28 text-center border-r border-slate-200">วันที่เสร็จ</th>
                  <th className="py-2 px-3 w-32 text-center border-r border-slate-200">ความคืบหน้า%</th>
                  <th className="py-2 px-3 w-28 text-center border-r border-slate-200">สถานะ</th>
                  <th className="py-2 px-2 w-20 text-center border-r border-slate-300 bg-slate-200/60">จัดการ</th>
                  
                  {/* Month Spans on Right */}
                  {monthGroups.map((grp, gIdx) => (
                    <th
                      key={gIdx}
                      colSpan={grp.span}
                      className="py-1 px-1 text-center font-bold text-[#0F172A] border-r border-slate-200 bg-slate-100 uppercase tracking-wider"
                    >
                      {grp.month}
                    </th>
                  ))}
                </tr>

                {/* Day Header Row */}
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-[10px] text-slate-500 font-bold">
                  <th className="py-2 px-3 border-r border-slate-200 bg-slate-100 font-mono text-center"></th>
                  <th className="py-2 px-4 border-r border-slate-200 text-left">รายการย่อย</th>
                  <th className="py-2 px-3 border-r border-slate-200 text-center">เริ่ม</th>
                  <th className="py-2 px-2 border-r border-slate-200 text-center font-mono">(วัน)</th>
                  <th className="py-2 px-3 border-r border-slate-200 text-center">เสร็จ</th>
                  <th className="py-2 px-3 border-r border-slate-200 text-center">% ดำเนินการ</th>
                  <th className="py-2 px-3 border-r border-slate-200 text-center">สถานะ</th>
                  <th className="py-2 px-2 border-r border-slate-300 text-center">แถว</th>

                  {/* Day Columns */}
                  {dayColumns.map((col, idx) => (
                    <th
                      key={idx}
                      className={`py-1.5 px-0.5 w-8 text-center border-r border-slate-200 leading-tight ${
                        col.isWeekend ? "bg-amber-50/50 text-amber-900" : "bg-emerald-50/40 text-emerald-950"
                      }`}
                      title={`${col.weekdayFull} ${col.dateStr}`}
                    >
                      <div className="font-extrabold text-[10px]">{col.dayNum}</div>
                      <div className="text-[8px] font-normal text-slate-400">{col.weekday}</div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-[11px]">
                {subtasks.map((st, sIdx) => {
                  const isHeader = st.isHeader
                  const isDone = st.status === "เสร็จ"
                  const isInProgress = st.status === "ดำเนินการ"
                  const isPending = st.status === "รอดำเนินการ"
                  const isNotStarted = st.status === "ยังไม่ดำเนินการ"

                  return (
                    <tr
                      key={st.id}
                      onClick={() => !isHeader && handleOpenEditSubtask(st)}
                      className={`group transition-colors duration-150 ${
                        isHeader
                          ? "bg-sky-50/80 font-bold border-t border-b border-sky-200"
                          : "hover:bg-sky-50/40 cursor-pointer bg-white"
                      }`}
                    >
                      {/* Row Num */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-center font-mono text-[10px] text-slate-400 bg-slate-50/50">
                        {sIdx + 1}
                      </td>

                      {/* งานที่ต้องทำ */}
                      <td className="py-2.5 px-4 border-r border-slate-100 font-medium">
                        <div className="flex items-center justify-between gap-2">
                          {isHeader ? (
                            <span className="text-[#005B9A] font-extrabold flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#005B9A]"></span>
                              <span>{st.category}</span>
                            </span>
                          ) : (
                            <span className="text-slate-800 pl-3 flex items-center gap-1.5 group-hover:text-[#005B9A] transition-colors">
                              <span className="text-slate-300">•</span>
                              <span className="font-semibold">{st.category}</span>
                              <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* วันที่เริ่มงาน */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-center text-slate-600 whitespace-nowrap">
                        {st.start || "-"}
                      </td>

                      {/* วันที่ใช้ */}
                      <td className="py-2.5 px-2 border-r border-slate-100 text-center font-mono text-slate-600">
                        {st.days || 1}
                      </td>

                      {/* วันที่เสร็จ */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-center text-slate-600 whitespace-nowrap">
                        {st.end || "-"}
                      </td>

                      {/* ความคืบหน้า% */}
                      <td className="py-2.5 px-3 border-r border-slate-100">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isDone ? "bg-emerald-500" : "bg-[#005B9A]"
                              }`}
                              style={{ width: `${st.progress}%` }}
                            ></div>
                          </div>
                          <span className="font-mono font-bold text-[11px] w-7 text-right text-[#0F172A]">
                            {st.progress}%
                          </span>
                        </div>
                      </td>

                      {/* สถานะ */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                            isDone
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isInProgress
                              ? "bg-sky-50 text-[#005B9A] border-sky-200"
                              : isPending
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <span>{isDone ? "✅" : isInProgress ? "⚙️" : isPending ? "⏳" : "🔴"}</span>
                          <span>{st.status}</span>
                        </span>
                      </td>

                      {/* ปุ่มจัดการแถว (⬆️, ⬇️, 🗑️) */}
                      <td className="py-1.5 px-2 border-r border-slate-300 text-center bg-slate-50/30">
                        <div className="flex items-center justify-center gap-0.5">
                          <button
                            type="button"
                            onClick={(e) => handleOpenInsertModal(st, "above", e)}
                            className="p-1 rounded-md text-slate-400 hover:text-[#005B9A] hover:bg-sky-50 transition-colors"
                            title="แทรกแถวด้านบน"
                          >
                            <ArrowUpToLine className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleOpenInsertModal(st, "below", e)}
                            className="p-1 rounded-md text-slate-400 hover:text-[#005B9A] hover:bg-sky-50 transition-colors"
                            title="แทรกแถวด้านล่าง"
                          >
                            <ArrowDownToLine className="w-3.5 h-3.5" />
                          </button>
                          {!isHeader && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSubtask(st.id, e)}
                              className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="ลบแถวนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Timeline Day Matrix Cells (Sleek Modern Gantt Capsules) */}
                      {dayColumns.map((dayCol, dIdx) => {
                        const isActive = isSubtaskActiveOnDay(st, dayCol)

                        let capsuleColor = ""
                        if (isActive) {
                          if (isDone) capsuleColor = "bg-emerald-500 shadow-xs"
                          else if (isInProgress) capsuleColor = "bg-[#005B9A] shadow-xs"
                          else if (isPending) capsuleColor = "bg-amber-500 shadow-xs"
                          else if (isNotStarted) capsuleColor = "bg-rose-500 shadow-xs"
                          else capsuleColor = "bg-sky-400 shadow-xs"
                        }

                        return (
                          <td
                            key={dIdx}
                            className={`border-r border-slate-100 text-center p-0.5 h-7 relative ${
                              dayCol.isWeekend ? "bg-slate-50/50" : "bg-white"
                            }`}
                          >
                            {isActive && (
                              <div
                                className={`w-full h-4 rounded-md ${capsuleColor} transition-all duration-150 hover:scale-110`}
                                title={`${st.category} (${dayCol.dateStr}) - ${st.status}`}
                              ></div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Handover History Logs */}
        {task.handovers && task.handovers.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#0F172A] flex items-center gap-2 mb-3">
              <span>ประวัติการส่งมอบงานระหว่างหมวด (Handover Logs)</span>
            </h3>
            <div className="space-y-2">
              {task.handovers.map((ho, idx) => (
                <div
                  key={ho.id || idx}
                  className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 text-xs flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">โอนย้าย:</span>
                    <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 font-bold text-purple-700">
                      {ho.fromDiscipline}
                    </span>
                    <span className="text-slate-400">➔</span>
                    <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 font-bold text-[#005B9A]">
                      {ho.toDiscipline}
                    </span>
                    {ho.notes && (
                      <span className="text-slate-600 ml-2 italic">&quot;{ho.notes}&quot;</span>
                    )}
                  </div>
                  <div className="text-slate-400 font-mono text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    {ho.handoverDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 5. Handover Stepper Modal */}
      <DisciplineHandoverDialog
        task={task}
        open={handoverOpen}
        onClose={() => setHandoverOpen(false)}
        onSuccess={(updated) => setTask(updated)}
      />

      {/* 6. Edit Task Header Metadata Modal */}
      {editTaskModalOpen && (
        <div
          className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-100"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditTaskModalOpen(false)
          }}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/90 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#005B9A] flex items-center justify-center font-bold">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">แก้ไขวันที่และรายละเอียดใบสั่งงาน</h3>
                  <p className="text-[11px] text-slate-400">คลิกที่ช่องวันที่เพื่อเปิดปฏิทินเลือกวันได้สะดวกรวดเร็ว</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTaskDetails} className="space-y-4 text-xs">
              {/* ชื่องาน */}
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">
                  ชื่องาน / รายละเอียดใบสั่งงาน <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] focus:ring-2 focus:ring-sky-100 font-medium resize-none"
                />
              </div>

              {/* 1. วันที่เริ่มงาน & 2. แสดงข้อมูลตั้งแต่วันที่ (แยกช่องชัดเจน) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* วันที่เริ่มงาน */}
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1 flex items-center justify-between">
                    <span>วันที่เริ่มงาน <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-[#005B9A] font-semibold">คลิกเพื่อเลือกปฏิทิน</span>
                  </label>
                  <div
                    onClick={() => handleOpenCalendarPicker("report_date", "เลือกวันที่เริ่มงาน", editReportDate)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-sky-50 border border-slate-300 hover:border-[#005B9A] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
                  >
                    <span className="font-mono font-bold text-[#005B9A]">{editReportDate || "เลือกวันที่"}</span>
                    <CalendarIcon className="w-4 h-4 text-[#005B9A] group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* แสดงข้อมูลตั้งแต่วันที่ (แยกจากวันที่เริ่มงาน) */}
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1 flex items-center justify-between">
                    <span>แสดงข้อมูลตั้งแต่วันที่ <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-[#005B9A] font-semibold">คลิกเพื่อเลือกปฏิทิน</span>
                  </label>
                  <div
                    onClick={() => handleOpenCalendarPicker("display_date", "เลือกวันที่เริ่มต้นแสดงผลไทม์ไลน์", editDisplayDate)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-sky-50 border border-slate-300 hover:border-[#005B9A] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
                  >
                    <span className="font-mono font-bold text-[#005B9A]">{editDisplayDate || "เลือกวันที่"}</span>
                    <CalendarIcon className="w-4 h-4 text-[#005B9A] group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>

              {/* 3. วันที่แล้วเสร็จ & 4. ระยะเวลา (ห้ามพิมพ์ แสดงเฉพาะที่คำนวณแล้ว) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* วันที่แล้วเสร็จ */}
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1 flex items-center justify-between">
                    <span>วันที่แล้วเสร็จ <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-[#005B9A] font-semibold">คลิกเพื่อเลือกปฏิทิน</span>
                  </label>
                  <div
                    onClick={() => handleOpenCalendarPicker("completion_date", "เลือกวันที่แล้วเสร็จ", editCompletionDate)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-sky-50 border border-slate-300 hover:border-[#005B9A] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
                  >
                    <span className="font-mono font-bold text-[#005B9A]">{editCompletionDate || "เลือกวันที่"}</span>
                    <CalendarIcon className="w-4 h-4 text-[#005B9A] group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* ระยะเวลาการทำงาน (ห้ามพิมพ์ แสดงเฉพาะที่คำนวณแล้ว) */}
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1 flex items-center justify-between">
                    <span>ระยะเวลาการทำงาน (วัน)</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">🔒 คำนวณอัตโนมัติ</span>
                  </label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-extrabold text-[#0F172A] cursor-not-allowed flex items-center justify-between">
                    <span>{editTotalDays} วัน</span>
                    <span className="text-[10px] text-slate-400 font-normal">(คำนวณจากช่วงวันที่)</span>
                  </div>
                </div>
              </div>

              {/* เลข W/O และ อุปกรณ์ (Equip) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">
                    เลข Work Order (W/O)
                  </label>
                  <input
                    type="text"
                    value={editWo}
                    onChange={(e) => setEditWo(e.target.value)}
                    placeholder="เช่น 4132222"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-mono font-bold text-[#005B9A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">
                    อุปกรณ์ / เครื่องจักร (Equip)
                  </label>
                  <input
                    type="text"
                    value={editEquip}
                    onChange={(e) => setEditEquip(e.target.value)}
                    placeholder="เช่น Sump 2SW"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditTaskModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSavingTaskDetails}
                  className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingTaskDetails ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Modern Thai Calendar Picker Modal */}
      {calendarPickerOpen && (
        <ThaiCalendarPickerModal
          title={calendarPickerTitle}
          initialDate={calendarCurrentDate}
          onSelectDate={handleSelectCalendarDate}
          onClose={() => setCalendarPickerOpen(false)}
        />
      )}

      {/* 8. Quick Subtask Edit Modal (Presets + Slider + Direct typing) */}
      {editingSubtask && (
        <div
          className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-100"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingSubtask(null)
          }}
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200/90 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-xs text-[#0F172A]">แก้ไขความคืบหน้างานย่อย</h3>
              <button
                type="button"
                onClick={() => setEditingSubtask(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-500 text-[11px] font-semibold line-clamp-1">
                {editingSubtask.category}
              </p>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#0F172A]">ระบุความคืบหน้า (%):</label>
                  <div className="flex items-center gap-1 bg-sky-50 border border-sky-200 rounded-xl px-2.5 py-1 focus-within:ring-2 focus-within:ring-sky-200">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editProgress}
                      onChange={(e) => {
                        let val = Number(e.target.value)
                        if (isNaN(val)) val = 0
                        if (val > 100) val = 100
                        if (val < 0) val = 0
                        setEditProgress(val)
                        setEditStatus(getDerivedStatus(val))
                      }}
                      className="w-14 text-right text-sm font-extrabold text-[#005B9A] bg-transparent outline-none font-mono"
                    />
                    <span className="text-xs font-bold text-[#005B9A]">%</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={editProgress}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setEditProgress(val)
                    setEditStatus(getDerivedStatus(val))
                  }}
                  className="w-full accent-[#005B9A] cursor-pointer"
                />

                {/* Preset Pills (0%, 25%, 50%, 75%, 100%) */}
                <div className="grid grid-cols-5 gap-1.5 mt-2.5">
                  {[0, 25, 50, 75, 100].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setEditProgress(val)
                        setEditStatus(getDerivedStatus(val))
                      }}
                      className={`py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                        editProgress === val
                          ? "bg-[#005B9A] text-white border-[#005B9A] shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Badge */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-500">สถานะ:</div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${
                    editStatus === "เสร็จ"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : editStatus === "ดำเนินการ"
                      ? "bg-sky-50 text-[#005B9A] border-sky-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  <span>{editStatus === "เสร็จ" ? "✅" : editStatus === "ดำเนินการ" ? "⚙️" : "⏳"}</span>
                  <span>{editStatus} ({editProgress}%)</span>
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSubtask(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveSubtask}
                  disabled={isSavingSubtask}
                  className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {isSavingSubtask ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Insert Subtask Row Modal (Above / Below) */}
      {insertModalOpen && targetSubtask && (
        <div
          className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-100"
          onClick={(e) => {
            if (e.target === e.currentTarget) setInsertModalOpen(false)
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200/90 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-bold text-xs text-[#0F172A]">
                  แทรกแถวงานย่อย ({insertPosition === "above" ? "ด้านบน" : "ด้านล่าง"})
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  อ้างอิง: <span className="font-bold text-[#0F172A]">{targetSubtask.category}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInsertModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInsertSubtask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#0F172A] mb-1.5">ตำแหน่งการแทรกแถว:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInsertPosition("above")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      insertPosition === "above"
                        ? "bg-sky-50 text-[#005B9A] border-[#005B9A] ring-2 ring-sky-100"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowUpToLine className="w-4 h-4 text-[#005B9A]" />
                    <span>แทรกด้านบน</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInsertPosition("below")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      insertPosition === "below"
                        ? "bg-sky-50 text-[#005B9A] border-[#005B9A] ring-2 ring-sky-100"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowDownToLine className="w-4 h-4 text-[#005B9A]" />
                    <span>แทรกด้านล่าง</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">
                  ชื่องานที่ต้องทำ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={insertCategory}
                  onChange={(e) => setInsertCategory(e.target.value)}
                  placeholder="เช่น ตรวจสอบแนวเชื่อม NDT..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">วันที่เริ่ม</label>
                  <input
                    type="text"
                    value={insertStart}
                    onChange={(e) => setInsertStart(e.target.value)}
                    placeholder="เช่น 28 ส.ค. 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">วันที่ใช้ (วัน)</label>
                  <input
                    type="number"
                    min={1}
                    value={insertDays}
                    onChange={(e) => setInsertDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">วันที่เสร็จ</label>
                  <input
                    type="text"
                    value={insertEnd}
                    onChange={(e) => setInsertEnd(e.target.value)}
                    placeholder="เช่น 1 ก.ย. 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInsertModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isInsertingSubtask}
                  className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {isInsertingSubtask ? "กำลังเพิ่ม..." : "✓ บันทึกแทรกแถว"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// 7. Modern Thai Calendar Picker Modal Component
function ThaiCalendarPickerModal({
  title,
  initialDate,
  onSelectDate,
  onClose,
}: {
  title: string
  initialDate: Date
  onSelectDate: (date: Date) => void
  onClose: () => void
}) {
  const [viewDate, setViewDate] = useState<Date>(new Date(initialDate))
  const [selectedDay, setSelectedDay] = useState<Date>(new Date(initialDate))

  const currentYear = viewDate.getFullYear()
  const currentMonth = viewDate.getMonth()
  const thaiYear = currentYear + 543

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Calculate calendar grid (42 cells: 6 weeks)
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

    const cells: { date: Date; isCurrentMonth: boolean; dayNum: number }[] = []

    // Prev month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, daysInPrevMonth - i)
      cells.push({ date: d, isCurrentMonth: false, dayNum: d.getDate() })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth, i)
      cells.push({ date: d, isCurrentMonth: true, dayNum: i })
    }

    // Next month days
    const remaining = 42 - cells.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(currentYear, currentMonth + 1, i)
      cells.push({ date: d, isCurrentMonth: false, dayNum: i })
    }

    return cells
  }, [currentYear, currentMonth])

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    )
  }

  return (
    <div
      className="fixed inset-0 bg-slate-950/40 z-60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200/90 animate-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#005B9A] flex items-center justify-center font-bold">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-[#0F172A]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Month & Year Navigation Bar */}
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200/80 mb-3">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-lg text-slate-600 hover:bg-white hover:text-[#005B9A] shadow-2xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="font-extrabold text-xs text-[#0F172A]">
            <span>{THAI_MONTH_FULL[currentMonth]}</span>{" "}
            <span className="font-mono text-[#005B9A]">{currentYear}</span>{" "}
            <span className="text-[10px] text-slate-400 font-normal">({thaiYear})</span>
          </div>

          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-lg text-slate-600 hover:bg-white hover:text-[#005B9A] shadow-2xs transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-slate-400 mb-1">
          {THAI_DAYS.map((day, idx) => (
            <div key={idx} className={idx === 0 || idx === 6 ? "text-amber-600" : ""}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Day Cells Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {calendarCells.map((cell, idx) => {
            const isSelected = isSameDay(cell.date, selectedDay)
            const isToday = isSameDay(cell.date, new Date())

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDay(cell.date)}
                className={`py-2 rounded-xl font-bold transition-all text-xs flex flex-col items-center justify-center relative ${
                  isSelected
                    ? "bg-[#005B9A] text-white shadow-xs scale-105"
                    : cell.isCurrentMonth
                    ? "text-[#0F172A] hover:bg-sky-50 hover:text-[#005B9A]"
                    : "text-slate-300 hover:bg-slate-50"
                } ${isToday && !isSelected ? "ring-1 ring-[#005B9A]" : ""}`}
              >
                <span>{cell.dayNum}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Date Summary & Quick Presets */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-[11px] font-bold text-slate-500">
            วันที่เลือก: <span className="font-mono text-[#005B9A] font-extrabold">{formatThaiDate(selectedDay)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedDay(new Date())}
              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              วันนี้
            </button>
            <button
              type="button"
              onClick={() => onSelectDate(selectedDay)}
              className="px-3.5 py-1 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
