"use client"

import { useState, useEffect, use, useMemo } from "react"
import { Task, Subtask, TaskStatus, DISCIPLINE_CONFIG, DisciplineCode } from "@/types"
import DisciplineHandoverDialog from "@/components/DisciplineHandoverDialog"
import FloatingNavbar from "@/components/FloatingNavbar"
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
  RotateCcw,
  Image as ImageIcon,
  Maximize2,
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

  // Handle slash format like 20/06/2025 or 20/6/2568
  if (clean.includes("/")) {
    const p = clean.split("/")
    if (p.length === 3) {
      const d = parseInt(p[0], 10)
      const m = parseInt(p[1], 10) - 1
      let y = parseInt(p[2], 10)
      if (y > 2500) y -= 543
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
        return new Date(y, m, d)
      }
    }
  }

  const parts = clean.split(/\s+/)
  if (parts.length < 3) return null
  const day = parseInt(parts[0], 10)
  const monthKey = parts[1].endsWith(".") ? parts[1] : parts[1] + "."
  const month = THAI_MONTHS[monthKey] !== undefined ? THAI_MONTHS[monthKey] : THAI_MONTHS[parts[1]]
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

  // Synchronized row hover across left/right tables
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)

  // Timeline Window Extension State (Default 2 months)
  const [visibleMonthsCount, setVisibleMonthsCount] = useState(2)

  // Edit Task Header Metadata State
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editReportDate, setEditReportDate] = useState("") // วันที่เริ่มงาน
  const [editDisplayDate, setEditDisplayDate] = useState("") // แสดงข้อมูลตั้งแต่วันที่
  const [editCompletionDate, setEditCompletionDate] = useState("") // วันที่แล้วเสร็จ
  const [editTotalDays, setEditTotalDays] = useState(97) // ระยะเวลาคำนวณอัตโนมัติ
  const [editWo, setEditWo] = useState("")
  const [editEquip, setEditEquip] = useState("")
  const [editImageUrl, setEditImageUrl] = useState("")
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const [isSavingTaskDetails, setIsSavingTaskDetails] = useState(false)

  // Calendar Modal Picker State
  const [calendarPickerOpen, setCalendarPickerOpen] = useState(false)
  const [calendarTargetField, setCalendarTargetField] = useState<
    "report_date" | "display_date" | "completion_date" | "subtask_start" | "subtask_end" | "insert_start" | "insert_end"
  >("report_date")
  const [calendarPickerTitle, setCalendarPickerTitle] = useState("เลือกวันที่")
  const [calendarCurrentDate, setCalendarCurrentDate] = useState<Date>(new Date())

  // Subtask editing state
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null)
  const [subtaskCategory, setSubtaskCategory] = useState("")
  const [subtaskStart, setSubtaskStart] = useState("")
  const [subtaskEnd, setSubtaskEnd] = useState("")
  const [subtaskDays, setSubtaskDays] = useState(1)
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

  // Auto-calculate initial visible months to encompass the entire task schedule and all subtasks
  useEffect(() => {
    if (!task) return

    let s = parseThaiDate(task.display_date) || parseThaiDate(task.report_date)
    let e = parseThaiDate(task.completion_date)

    if (task.subtasks && task.subtasks.length > 0) {
      for (const st of task.subtasks) {
        const stStart = parseThaiDate(st.start)
        const stEnd = parseThaiDate(st.end)
        if (stStart && (!s || stStart < s)) s = stStart
        if (stEnd && (!e || stEnd > e)) e = stEnd
      }
    }

    if (s && e && e >= s) {
      const monthDiff = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1
      setVisibleMonthsCount(Math.max(1, monthDiff))
    }
  }, [task?.id, task?.report_date, task?.completion_date, task?.display_date, task?.subtasks])

  // Open Edit Task Header Metadata modal
  const handleOpenEditTaskModal = () => {
    if (!task) return
    setEditTitle(task.title || "")
    const repDate = task.report_date || "27 พ.ค. 2026"
    const dispDate = task.display_date || task.report_date || "27 พ.ค. 2026"
    const compDate = task.completion_date || "31 ส.ค. 2026"

    setEditReportDate(repDate)
    setEditDisplayDate(dispDate)
    setEditCompletionDate(compDate)
    setEditTotalDays(task.total_days || calculateDayDifference(repDate, compDate))
    setEditWo(task.wo || "4132222")
    setEditEquip(task.equip || "")
    setEditImageUrl(task.imageUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop")
    setEditTaskModalOpen(true)
  }

  // Open Calendar Picker Modal for a specific date field
  const handleOpenCalendarPicker = (
    field: "report_date" | "display_date" | "completion_date" | "subtask_start" | "subtask_end" | "insert_start" | "insert_end",
    title: string,
    currentVal?: string
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
    } else if (calendarTargetField === "subtask_start") {
      setSubtaskStart(formatted)
      const diff = calculateDayDifference(formatted, subtaskEnd || formatted)
      setSubtaskDays(diff)
    } else if (calendarTargetField === "subtask_end") {
      setSubtaskEnd(formatted)
      const diff = calculateDayDifference(subtaskStart || formatted, formatted)
      setSubtaskDays(diff)
    } else if (calendarTargetField === "insert_start") {
      setInsertStart(formatted)
      const diff = calculateDayDifference(formatted, insertEnd || formatted)
      setInsertDays(diff)
    } else if (calendarTargetField === "insert_end") {
      setInsertEnd(formatted)
      const diff = calculateDayDifference(insertStart || formatted, formatted)
      setInsertDays(diff)
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
      total_days: calculatedDays > 0 ? calculatedDays : 97,
      wo: editWo.trim(),
      equip: editEquip.trim(),
      imageUrl: editImageUrl.trim(),
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

  // Generate dynamic date timeline columns starting from display_date (or report_date) for visibleMonthsCount months
  const { dayColumns, monthGroups } = useMemo(() => {
    if (!task) return { dayColumns: [], monthGroups: [] }

    let startDate = parseThaiDate(task.display_date) || parseThaiDate(task.report_date)
    if (!startDate) startDate = new Date(2026, 7, 27)

    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth()

    const targetEndMonth = startMonth + visibleMonthsCount
    const targetEndDate = new Date(startYear, targetEndMonth, 0)

    const cols: DayColumn[] = []
    const cur = new Date(startDate)
    let count = 0
    while (cur <= targetEndDate && count < 365) {
      const dayOfWeek = cur.getDay()
      cols.push({
        date: new Date(cur),
        dateStr: formatThaiDate(cur),
        dayNum: cur.getDate(),
        monthName: `${THAI_MONTH_FULL[cur.getMonth()]} ${cur.getFullYear() + 543}`,
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
  }, [task, visibleMonthsCount])

  const handleOpenEditSubtask = (st: Subtask, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setEditingSubtask(st)
    setSubtaskCategory(st.category || "")
    setSubtaskStart(st.start || task?.report_date || "")
    setSubtaskEnd(st.end || st.start || task?.completion_date || "")
    setSubtaskDays(st.days || (st.start && st.end ? calculateDayDifference(st.start, st.end) : 1))
    setEditProgress(st.progress || 0)
    setEditStatus(st.status || getDerivedStatus(st.progress || 0))
  }

  const handleSaveSubtask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!editingSubtask || !task) return
    setIsSavingSubtask(true)

    const progressNum = Number(editProgress)
    const autoStatus = getDerivedStatus(progressNum)
    const calculatedDays = calculateDayDifference(subtaskStart, subtaskEnd)

    const updates = {
      category: subtaskCategory.trim() || editingSubtask.category,
      start: subtaskStart.trim(),
      end: subtaskEnd.trim(),
      days: calculatedDays > 0 ? calculatedDays : Number(subtaskDays) || 1,
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
    
    const dTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
    const sTime = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime()
    
    if (e) {
      const eTime = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime()
      return dTime >= sTime && dTime <= eTime
    }
    return dTime === sTime
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center gap-3 font-sans">
        <div className="w-8 h-8 border-2 border-[#005B9A] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-[#86868B] text-xs font-medium">กำลังโหลดข้อมูลแผ่นงาน...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] p-12 text-center flex flex-col items-center justify-center font-sans">
        <div className="text-4xl mb-3">📄</div>
        <div className="text-[#1D1D1F] font-semibold text-sm mb-4">ไม่พบข้อมูลงานที่ระบุในแผ่นงาน</div>
        <a href="/" className="px-4 py-2 bg-[#005B9A] text-white rounded-full text-xs font-medium hover:bg-[#004A7D] transition-colors shadow-xs">
          ← กลับหน้ารวมงาน
        </a>
      </div>
    )
  }

  const subtasks = task.subtasks || []
  const currentTaskNum = task.taskNo?.replace("งานที่", "") || task.id

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col font-sans select-none antialiased text-[12px] pb-16 selection:bg-[#005B9A] selection:text-white">
      {/* 1. Apple-Clean Floating Glassmorphic Navbar */}
      <FloatingNavbar
        type="task-detail"
        taskNo={task.taskNo || `งานที่${task.id}`}
        title={task.title}
        sheetLink={task.link}
        onEditTask={handleOpenEditTaskModal}
        onHandover={() => setHandoverOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 px-4 sm:px-6 max-w-[1600px] w-full mx-auto space-y-4 pt-4">
        {/* 2. Apple-Clean Bento Metadata Card */}
        <div className="bg-white rounded-3xl border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Job Title & W/O Details */}
            <div className="lg:col-span-6 space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  <span className="text-xs font-semibold text-[#86868B]">งานที่</span>
                  <span className="bg-[#F5F5F7] text-[#1D1D1F] font-bold px-2.5 py-0.5 rounded-lg font-mono text-xs border border-black/[0.05]">
                    {currentTaskNum}
                  </span>
                  <span className="text-[#D2D2D7]">|</span>
                  <span className="text-xs font-semibold text-[#86868B]">เลข W/O:</span>
                  <button
                    onClick={handleOpenEditTaskModal}
                    className="bg-sky-50 hover:bg-sky-100 text-[#005B9A] font-bold px-2.5 py-0.5 rounded-lg font-mono text-xs border border-sky-200/80 transition-colors flex items-center gap-1 group cursor-pointer"
                    title="คลิกเพื่อแก้ไข W/O"
                  >
                    <span>{task.wo || "4132222"}</span>
                    <Edit2 className="w-3 h-3 text-[#005B9A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <span className="text-[#D2D2D7]">|</span>
                  <span className="text-xs font-semibold text-[#86868B]">หมวดร่วมงาน:</span>
                  <span className="bg-amber-50 text-amber-900 font-bold px-2.5 py-0.5 rounded-lg font-mono text-xs border border-amber-200/80">
                    {task.completion_codes || task.w_codes?.map((w) => w.replace("W", "")).join(",") || "11,12,13"}
                  </span>
                </div>

                {/* Title Box (Clickable to Edit) */}
                <div
                  onClick={handleOpenEditTaskModal}
                  className="bg-[#FAFAFC] hover:bg-[#F2F2F7] border border-black/[0.06] rounded-2xl p-3.5 cursor-pointer transition-all group"
                  title="คลิกเพื่อแก้ไขชื่องานและวันที่"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-[#86868B] flex items-center gap-1.5">
                      <span>ชื่องาน / รายละเอียดใบสั่งงาน:</span>
                      <span className="text-[10px] text-[#005B9A] font-normal">(คลิกเพื่อแก้ไข)</span>
                    </span>
                    <Edit2 className="w-3.5 h-3.5 text-[#005B9A] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h2 className="text-sm font-semibold text-[#1D1D1F] leading-snug group-hover:text-[#005B9A] transition-colors">
                    {task.title}
                  </h2>
                </div>
              </div>

              {/* Meta Grid Pills - 5 Clear Interactive Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {/* 1. วันที่เริ่มงาน */}
                <button
                  type="button"
                  onClick={handleOpenEditTaskModal}
                  className="bg-[#FAFAFC] hover:bg-sky-50/50 border border-black/[0.06] hover:border-sky-300/80 p-2.5 rounded-2xl text-left transition-all group cursor-pointer"
                  title="คลิกเพื่อแก้ไขวันที่เริ่มงาน"
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#86868B] group-hover:text-[#005B9A]">
                    <span>เริ่มงาน</span>
                    <CalendarIcon className="w-3 h-3 text-[#005B9A]" />
                  </div>
                  <div className="font-semibold text-[#1D1D1F] mt-1 font-mono text-[11px] group-hover:text-[#005B9A]">
                    {task.report_date || "27 พ.ค. 2026"}
                  </div>
                </button>

                {/* 2. แสดงข้อมูลตั้งแต่วันที่ */}
                <button
                  type="button"
                  onClick={handleOpenEditTaskModal}
                  className="bg-[#FAFAFC] hover:bg-sky-50/50 border border-black/[0.06] hover:border-sky-300/80 p-2.5 rounded-2xl text-left transition-all group cursor-pointer"
                  title="คลิกเพื่อแก้ไขวันที่เริ่มแสดงผลไทม์ไลน์"
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#86868B] group-hover:text-[#005B9A]">
                    <span>แสดงตั้งแต่</span>
                    <CalendarIcon className="w-3 h-3 text-[#005B9A]" />
                  </div>
                  <div className="font-semibold text-[#005B9A] mt-1 font-mono text-[11px]">
                    {task.display_date || task.report_date || "27 พ.ค. 2026"}
                  </div>
                </button>

                {/* 3. ระยะเวลาการทำงาน (คำนวณอัตโนมัติ) */}
                <div
                  className="bg-[#F5F5F7] border border-black/[0.04] p-2.5 rounded-2xl text-left"
                  title="ระยะเวลาคำนวณอัตโนมัติจากวันที่เริ่มงานและวันที่แล้วเสร็จ"
                >
                  <div className="text-[10px] font-semibold text-[#86868B]">
                    ระยะเวลา
                  </div>
                  <div className="font-semibold text-[#1D1D1F] mt-1 font-mono text-[11px]">
                    {task.total_days || calculateDayDifference(task.report_date, task.completion_date || "31 ส.ค. 2026")} วัน
                  </div>
                </div>

                {/* 4. วันที่แล้วเสร็จ */}
                <button
                  type="button"
                  onClick={handleOpenEditTaskModal}
                  className="bg-[#FAFAFC] hover:bg-sky-50/50 border border-black/[0.06] hover:border-sky-300/80 p-2.5 rounded-2xl text-left transition-all group cursor-pointer"
                  title="คลิกเพื่อแก้ไขวันที่แล้วเสร็จ"
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#86868B] group-hover:text-[#005B9A]">
                    <span>แล้วเสร็จ</span>
                    <CalendarIcon className="w-3 h-3 text-[#005B9A]" />
                  </div>
                  <div className="font-semibold text-[#1D1D1F] mt-1 font-mono text-[11px] group-hover:text-[#005B9A]">
                    {task.completion_date || "31 ส.ค. 2026"}
                  </div>
                </button>

                {/* 5. อุปกรณ์ (Equip) */}
                <button
                  type="button"
                  onClick={handleOpenEditTaskModal}
                  className="bg-[#FAFAFC] hover:bg-sky-50/50 border border-black/[0.06] hover:border-sky-300/80 p-2.5 rounded-2xl text-left transition-all truncate group cursor-pointer"
                  title="คลิกเพื่อแก้ไขอุปกรณ์"
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#86868B] group-hover:text-[#005B9A]">
                    <span>อุปกรณ์</span>
                    <Wrench className="w-3 h-3 opacity-60" />
                  </div>
                  <div className="font-semibold text-[#1D1D1F] mt-1 truncate text-[11px] group-hover:text-[#005B9A]">
                    {task.equip || "-"}
                  </div>
                </button>
              </div>
            </div>

            {/* Center: Task Photo Card */}
            <div className="lg:col-span-3 bg-[#FAFAFC] border border-black/[0.06] rounded-2xl p-3 flex flex-col justify-between h-full group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-[#86868B] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#005B9A]" />
                  <span>รูปภาพประกอบงาน (Task Photo)</span>
                </span>
                <button
                  type="button"
                  onClick={handleOpenEditTaskModal}
                  className="text-[10px] text-[#005B9A] hover:underline font-semibold cursor-pointer"
                >
                  เปลี่ยนรูป
                </button>
              </div>

              <div
                onClick={() => setImagePreviewOpen(true)}
                className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 border border-black/[0.08] cursor-pointer group shadow-2xs"
                title="คลิกเพื่อดูรูปขยายใหญ่"
              >
                <img
                  src={task.imageUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop"}
                  alt={task.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[1px]">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>ดูรูปขยาย</span>
                </div>
              </div>
            </div>

            {/* Right: Progress & Stepper */}
            <div className="lg:col-span-3 bg-[#FAFAFC] border border-black/[0.06] rounded-2xl p-4 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#86868B]">ความคืบหน้ารวม</span>
                  <div className="text-2xl font-bold text-[#1D1D1F] font-mono tracking-tight mt-0.5">
                    {task.progress}%
                  </div>
                </div>
                <div className="relative w-13 h-13 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#E5E5EA]"
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
                  <span className="absolute text-[10px] font-bold text-[#1D1D1F] font-mono">
                    {task.progress}%
                  </span>
                </div>
              </div>

              {/* Handover Stepper Pipeline */}
              <div className="pt-2.5 border-t border-black/[0.05]">
                <div className="text-[10px] font-semibold text-[#86868B] mb-1.5">
                  ลำดับหมวดงาน (Discipline Pipeline):
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {task.w_codes &&
                    task.w_codes.map((w, idx) => {
                      const isCurrent = task.current_discipline === w
                      const conf = DISCIPLINE_CONFIG[w]
                      return (
                        <div key={w} className="flex items-center gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all ${
                              isCurrent
                                ? "bg-sky-50 text-[#005B9A] border-sky-300 shadow-2xs font-bold"
                                : "bg-white text-[#6E6E73] border-black/[0.06]"
                            }`}
                          >
                            {conf?.num || w} {isCurrent && "📍"}
                          </span>
                          {idx < task.w_codes.length - 1 && (
                            <span className="text-[#D2D2D7] text-[9px]">➔</span>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. True Two-Pane Split-Table Architecture (Left Subtasks Pinned | Right Timeline Scrollable) */}
        <div className="bg-white rounded-3xl border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Table Header Bar with Dynamic Timeline Controls */}
          <div className="bg-[#FAFAFC] px-6 py-3.5 border-b border-black/[0.06] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#005B9A]"></span>
              <span className="text-xs font-semibold text-[#1D1D1F]">
                ตารางแผนงานย่อยและไทม์ไลน์รายวัน (Subtasks Breakdown & Daily Schedule)
              </span>
              <span className="text-[11px] font-medium text-[#005B9A] bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full font-mono">
                {subtasks.length} แถว
              </span>
            </div>

            {/* Timeline Window Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-[11px] font-medium text-[#1D1D1F] bg-white border border-black/[0.06] px-3 py-1 rounded-full font-mono flex items-center gap-1.5 shadow-2xs">
                <span className="text-[#86868B]">ช่วงที่แสดง:</span>
                <span className="text-[#005B9A] font-semibold">{monthGroups.map((g) => g.month).join(" - ")}</span>
                <span className="text-[#86868B]">({dayColumns.length} วัน)</span>
              </div>

              {visibleMonthsCount > 1 && (
                <button
                  type="button"
                  onClick={() => setVisibleMonthsCount((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08] rounded-full text-[11px] font-medium transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                  title="ย่อลด 1 เดือน"
                >
                  <span>➖ ย่อเดือน</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setVisibleMonthsCount((prev) => prev + 1)}
                className="px-3.5 py-1 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-full text-[11px] font-medium transition-all shadow-xs flex items-center gap-1 active:scale-95 cursor-pointer"
                title="ขยายแสดงไทม์ไลน์เพิ่มอีก 1 เดือน"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>ขยายดูเพิ่ม +1 เดือน</span>
              </button>
            </div>
          </div>

          {/* Side-by-Side Dual-Pane Split Workspace */}
          <div className="flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* PANE 1: Left Pinned Subtasks Operational Table */}
            <div className="w-full lg:w-[680px] shrink-0 bg-white overflow-x-auto">
              <table className="w-full border-collapse text-[11px] text-left">
                <thead>
                  {/* Header Row (Two tiers merged into h-[65px] for exact alignment) */}
                  <tr className="bg-[#F5F5F7] border-b border-slate-200 text-[#86868B] font-semibold text-[10px] h-[65px] max-h-[65px]">
                    <th className="py-2 px-3 w-10 text-center border-r border-slate-200 font-mono">#</th>
                    <th className="py-2 px-3 min-w-[200px] border-r border-slate-200">งานที่ต้องทำ (Subtask)</th>
                    <th className="py-2 px-2.5 w-24 text-center border-r border-slate-200">เริ่ม - เสร็จ</th>
                    <th className="py-2 px-2 w-12 text-center border-r border-slate-200 font-mono">วัน</th>
                    <th className="py-2 px-3 w-28 text-center border-r border-slate-200">ความคืบหน้า</th>
                    <th className="py-2 px-2.5 w-24 text-center border-r border-slate-200">สถานะ</th>
                    <th className="py-2 px-2 w-24 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {subtasks.map((st, sIdx) => {
                    const isHeader = st.isHeader
                    const isDone = st.status === "เสร็จ"
                    const isInProgress = st.status === "ดำเนินการ"
                    const isPending = st.status === "รอดำเนินการ"
                    const isHovered = hoveredRowId === st.id

                    return (
                      <tr
                        key={st.id}
                        onMouseEnter={() => setHoveredRowId(st.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        onClick={() => !isHeader && handleOpenEditSubtask(st)}
                        className={`transition-all duration-150 h-[50px] min-h-[50px] max-h-[50px] box-border ${
                          isHeader
                            ? "bg-sky-50/80 font-bold border-t border-b border-sky-200"
                            : isHovered
                            ? "bg-sky-50/80 cursor-pointer"
                            : "hover:bg-sky-50/40 cursor-pointer bg-white"
                        }`}
                      >
                        {/* 1. Row Num */}
                        <td className="py-1 px-3 border-r border-slate-100 text-center font-mono text-[10px] text-[#86868B] bg-[#FAFAFC] h-[50px]">
                          {sIdx + 1}
                        </td>

                        {/* 2. งานที่ต้องทำ */}
                        <td className="py-1 px-3 border-r border-slate-100 font-medium h-[50px]">
                          <div className="flex items-center justify-between gap-1.5">
                            {isHeader ? (
                              <span className="text-[#005B9A] font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#005B9A]"></span>
                                <span>{st.category}</span>
                              </span>
                            ) : (
                              <span className="text-[#1D1D1F] pl-1.5 flex items-center gap-1.5 group-hover:text-[#005B9A] transition-colors">
                                <span className="text-[#D2D2D7]">•</span>
                                <span className="font-medium line-clamp-1">{st.category}</span>
                              </span>
                            )}
                            <Edit2 className="w-3 h-3 text-[#005B9A] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </div>
                        </td>

                        {/* 3. วันที่เริ่ม - เสร็จ */}
                        <td className="py-1 px-2 border-r border-slate-100 text-center text-[#6E6E73] text-[10px] whitespace-nowrap h-[50px]">
                          <div className="leading-tight">{st.start || "-"}</div>
                          <div className="text-[9px] text-[#86868B] leading-tight">{st.end || "-"}</div>
                        </td>

                        {/* 4. วันที่ใช้ */}
                        <td className="py-1 px-2 border-r border-slate-100 text-center font-mono text-[#1D1D1F] font-semibold text-[10px] h-[50px]">
                          {st.days || 1}
                        </td>

                        {/* 5. ความคืบหน้า% */}
                        <td className="py-1 px-3 border-r border-slate-100 h-[50px]">
                          <div className="flex items-center gap-1.5 justify-center">
                            <div className="flex-1 h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isDone ? "bg-emerald-500" : "bg-[#005B9A]"
                                }`}
                                style={{ width: `${st.progress}%` }}
                              ></div>
                            </div>
                            <span className="font-mono font-semibold text-[10px] w-6 text-right text-[#1D1D1F]">
                              {st.progress}%
                            </span>
                          </div>
                        </td>

                        {/* 6. สถานะ */}
                        <td className="py-1 px-2.5 border-r border-slate-100 text-center h-[50px]">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border inline-flex items-center gap-1 ${
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

                        {/* 7. ปุ่มจัดการแถว */}
                        <td className={`py-1 px-2 text-center whitespace-nowrap h-[50px] ${isHeader ? "bg-sky-50/40" : "bg-[#FAFAFC]"}`}>
                          {!isHeader ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => handleOpenInsertModal(st, "below", e)}
                                className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 text-[#005B9A] hover:text-[#004A7D] border border-slate-200 hover:border-sky-300 text-[10px] font-semibold inline-flex items-center gap-1 transition-all shadow-2xs hover:scale-105 cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
                                title="แทรกแถวงานย่อย"
                              >
                                <Plus className="w-3 h-3 stroke-[2.5]" />
                                <span>แทรกแถว</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteSubtask(st.id, e)}
                                className="p-1.5 rounded-lg text-[#86868B] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                                title="ลบแถวนี้"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#86868B] font-normal">-</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* PANE 2: Right Independently Horizontally Scrollable Calendar Gantt Timeline */}
            <div className="flex-1 min-w-0 overflow-x-auto bg-[#FAFAFC]">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  {/* Top Tier: Month Spans */}
                  <tr className="bg-[#F5F5F7] border-b border-slate-200 text-[#1D1D1F] font-bold text-xs h-[32px]">
                    {monthGroups.map((grp, gIdx) => (
                      <th
                        key={gIdx}
                        colSpan={grp.span}
                        className="py-1 px-2 text-center font-bold text-[#005B9A] bg-sky-50/80 border-r border-slate-200 text-xs tracking-wide h-[32px] shadow-2xs whitespace-nowrap"
                      >
                        {grp.month}
                      </th>
                    ))}
                  </tr>

                  {/* Bottom Tier: Day Columns */}
                  <tr className="bg-[#FAFAFC] border-b border-slate-200 text-[10px] text-[#86868B] font-medium h-[32px]">
                    {dayColumns.map((col, idx) => (
                      <th
                        key={idx}
                        className={`py-0.5 px-0.5 w-10 min-w-[40px] text-center border-r border-slate-200 leading-tight h-[32px] ${
                          col.isWeekend ? "bg-amber-50/60 text-amber-900" : "text-[#1D1D1F]"
                        }`}
                        title={`${col.weekdayFull} ${col.dateStr}`}
                      >
                        <div className="font-bold text-xs text-[#1D1D1F] font-mono">{col.dayNum}</div>
                        <div className="text-[9.5px] font-semibold text-[#86868B]">{col.weekday}</div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {subtasks.map((st) => {
                    const isDone = st.status === "เสร็จ"
                    const isInProgress = st.status === "ดำเนินการ"
                    const isPending = st.status === "รอดำเนินการ"
                    const isNotStarted = st.status === "ยังไม่ดำเนินการ"
                    const isHovered = hoveredRowId === st.id

                    return (
                      <tr
                        key={st.id}
                        onMouseEnter={() => setHoveredRowId(st.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        onClick={() => !st.isHeader && handleOpenEditSubtask(st)}
                        className={`transition-all duration-150 h-[50px] min-h-[50px] max-h-[50px] box-border ${
                          st.isHeader
                            ? "bg-sky-50/80 border-t border-b border-sky-200"
                            : isHovered
                            ? "bg-sky-50/80 cursor-pointer"
                            : "hover:bg-sky-50/40 cursor-pointer bg-white"
                        }`}
                      >
                        {dayColumns.map((dayCol, dIdx) => {
                          const isActive = isSubtaskActiveOnDay(st, dayCol)
                          const prevActive = isActive && dIdx > 0 && isSubtaskActiveOnDay(st, dayColumns[dIdx - 1])
                          const nextActive = isActive && dIdx < dayColumns.length - 1 && isSubtaskActiveOnDay(st, dayColumns[dIdx + 1])

                          let capsuleColor = ""
                          if (isActive) {
                            if (st.isHeader || st.category.includes("ส่งมอบ")) {
                              capsuleColor = "bg-[#8EA9DB]" // Google Sheets Light Blue for Headers & Handover
                            } else {
                              capsuleColor = "bg-[#70AD47]" // Google Sheets Green for Operations
                            }
                          }

                          let barRounding = "rounded-md mx-0.5"
                          if (isActive) {
                            if (prevActive && nextActive) {
                              barRounding = "rounded-none -mx-[1px] w-[calc(100%+2px)]"
                            } else if (!prevActive && nextActive) {
                              barRounding = "rounded-l-md rounded-r-none ml-0.5 -mr-[1px] w-[calc(100%+1px)]"
                            } else if (prevActive && !nextActive) {
                              barRounding = "rounded-r-md rounded-l-none -ml-[1px] mr-0.5 w-[calc(100%+1px)]"
                            } else {
                              barRounding = "rounded-md mx-0.5 w-[calc(100%-4px)]"
                            }
                          }

                          return (
                            <td
                              key={dIdx}
                              className={`border-r border-slate-100 text-center p-0 h-[50px] w-10 min-w-[40px] relative overflow-visible ${
                                isHovered ? "bg-sky-50/80" : dayCol.isWeekend ? "bg-amber-50/20" : "bg-white"
                              }`}
                            >
                              {isActive && (
                                <div
                                  className={`h-6.5 ${barRounding} ${capsuleColor} transition-all duration-150 relative z-10`}
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

          {/* Bottom Table Bar with Extend Month Shortcut */}
          <div className="bg-[#FAFAFC] border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="text-[11px] text-[#86868B]">
              💡 ช่วงเวลาที่แสดง: <span className="font-mono font-semibold text-[#005B9A]">{dayColumns[0]?.dateStr || "-"}</span> ถึง <span className="font-mono font-semibold text-[#005B9A]">{dayColumns[dayColumns.length - 1]?.dateStr || "-"}</span> (รวม {dayColumns.length} วัน)
            </div>
            <button
              type="button"
              onClick={() => setVisibleMonthsCount((prev) => prev + 1)}
              className="px-4 py-1.5 bg-white hover:bg-sky-50 text-[#005B9A] border border-sky-200 rounded-full text-[11px] font-semibold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>กดดูวันเพิ่ม (+1 เดือน)</span>
            </button>
          </div>
        </div>

        {/* 4. Handover History Logs */}
        {task.handovers && task.handovers.length > 0 && (
          <div className="bg-white rounded-3xl border border-black/[0.08] p-6 shadow-xs">
            <h3 className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-2 mb-3">
              <span>ประวัติการส่งมอบงานระหว่างหมวด (Handover Logs)</span>
            </h3>
            <div className="space-y-2">
              {task.handovers.map((ho, idx) => (
                <div
                  key={ho.id || idx}
                  className="bg-[#FAFAFC] border border-black/[0.05] rounded-2xl p-3.5 text-xs flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#86868B]">โอนย้าย:</span>
                    <span className="px-2.5 py-0.5 bg-white rounded-lg border border-black/[0.05] font-semibold text-purple-700">
                      {ho.fromDiscipline}
                    </span>
                    <span className="text-[#D2D2D7]">➔</span>
                    <span className="px-2.5 py-0.5 bg-white rounded-lg border border-black/[0.05] font-semibold text-[#005B9A]">
                      {ho.toDiscipline}
                    </span>
                    {ho.notes && (
                      <span className="text-[#6E6E73] ml-2 italic">&quot;{ho.notes}&quot;</span>
                    )}
                  </div>
                  <div className="text-[#86868B] font-mono text-[11px] bg-white border border-black/[0.05] px-2.5 py-0.5 rounded-lg">
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
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditTaskModalOpen(false)
          }}
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-black/[0.08] animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-50 text-[#005B9A] flex items-center justify-center font-bold">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#1D1D1F]">แก้ไขวันที่และรายละเอียดใบสั่งงาน</h3>
                  <p className="text-[11px] text-[#86868B]">คลิกที่ช่องวันที่เพื่อเปิดปฏิทินเลือกวันได้สะดวกรวดเร็ว</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditTaskModalOpen(false)}
                className="text-[#86868B] hover:text-[#1D1D1F] p-1.5 rounded-full hover:bg-[#F5F5F7] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTaskDetails} className="space-y-4 text-xs">
              {/* ชื่องาน */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  ชื่องาน / รายละเอียดใบสั่งงาน <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-2xl text-xs outline-none focus:bg-white focus:border-[#005B9A] focus:ring-2 focus:ring-sky-100 font-medium resize-none"
                />
              </div>

              {/* 1. วันที่เริ่มงาน & 2. แสดงข้อมูลตั้งแต่วันที่ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* วันที่เริ่มงาน */}
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                    <span>วันที่เริ่มงาน <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-[#005B9A] font-medium">เลือกปฏิทิน</span>
                  </label>
                  <div
                    onClick={() => handleOpenCalendarPicker("report_date", "เลือกวันที่เริ่มงาน", editReportDate)}
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] hover:bg-sky-50 border border-black/[0.06] hover:border-[#005B9A] rounded-2xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
                  >
                    <span className="font-mono font-semibold text-[#005B9A]">{editReportDate || "เลือกวันที่"}</span>
                    <CalendarIcon className="w-4 h-4 text-[#005B9A] group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* แสดงข้อมูลตั้งแต่วันที่ */}
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                    <span>แสดงข้อมูลตั้งแต่วันที่ <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-[#005B9A] font-medium">เลือกปฏิทิน</span>
                  </label>
                  <div
                    onClick={() => handleOpenCalendarPicker("display_date", "เลือกวันที่เริ่มต้นแสดงผลไทม์ไลน์", editDisplayDate)}
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] hover:bg-sky-50 border border-black/[0.06] hover:border-[#005B9A] rounded-2xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
                  >
                    <span className="font-mono font-semibold text-[#005B9A]">{editDisplayDate || "เลือกวันที่"}</span>
                    <CalendarIcon className="w-4 h-4 text-[#005B9A] group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>

              {/* 3. วันที่แล้วเสร็จ & 4. ระยะเวลา */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* วันที่แล้วเสร็จ */}
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                    <span>วันที่แล้วเสร็จ <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-[#005B9A] font-medium">เลือกปฏิทิน</span>
                  </label>
                  <div
                    onClick={() => handleOpenCalendarPicker("completion_date", "เลือกวันที่แล้วเสร็จ", editCompletionDate)}
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] hover:bg-sky-50 border border-black/[0.06] hover:border-[#005B9A] rounded-2xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
                  >
                    <span className="font-mono font-semibold text-[#005B9A]">{editCompletionDate || "เลือกวันที่"}</span>
                    <CalendarIcon className="w-4 h-4 text-[#005B9A] group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* ระยะเวลาการทำงาน */}
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                    <span>ระยะเวลาการทำงาน (วัน)</span>
                    <span className="text-[10px] text-emerald-600 font-medium">🔒 คำนวณอัตโนมัติ</span>
                  </label>
                  <div className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-black/[0.05] rounded-2xl text-xs font-mono font-bold text-[#1D1D1F] cursor-not-allowed flex items-center justify-between">
                    <span>{editTotalDays} วัน</span>
                    <span className="text-[10px] text-[#86868B] font-normal">(จากช่วงวันที่)</span>
                  </div>
                </div>
              </div>

              {/* เลข W/O และ อุปกรณ์ (Equip) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    เลข Work Order (W/O)
                  </label>
                  <input
                    type="text"
                    value={editWo}
                    onChange={(e) => setEditWo(e.target.value)}
                    placeholder="เช่น 4132222"
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-2xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-mono font-bold text-[#005B9A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    อุปกรณ์ / เครื่องจักร (Equip)
                  </label>
                  <input
                    type="text"
                    value={editEquip}
                    onChange={(e) => setEditEquip(e.target.value)}
                    placeholder="เช่น Sump 2SW"
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-2xl text-xs outline-none focus:bg-white focus:border-[#005B9A]"
                  />
                </div>
              </div>

              {/* URL รูปภาพหน้างาน */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                  <span>ลิงก์รูปภาพประกอบงาน (Task Photo URL)</span>
                  <span className="text-[10px] text-[#005B9A]">แสดงในการ์ดข้อมูลงาน</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="เช่น https://... หรือ /images/..."
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-2xl text-xs outline-none focus:bg-white focus:border-[#005B9A]"
                  />
                  {editImageUrl && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-black/[0.08] shrink-0 bg-slate-100 shadow-2xs">
                      <img src={editImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditTaskModalOpen(false)}
                  className="px-4 py-2 bg-[#F5F5F7] text-[#1D1D1F] rounded-full text-xs font-medium hover:bg-[#E8E8ED] transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSavingTaskDetails}
                  className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-full text-xs font-medium shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingTaskDetails ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Image Preview Modal */}
      {imagePreviewOpen && task && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setImagePreviewOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-xs text-slate-200 line-clamp-1">{task.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setImagePreviewOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-black/40">
              <img
                src={task.imageUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop"}
                alt={task.title}
                className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl"
              />
            </div>
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

      {/* 8. Full Subtask Edit Modal (Category, Start/End Dates, Days, Progress, Status) */}
      {editingSubtask && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingSubtask(null)
          }}
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-black/[0.08] animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-50 text-[#005B9A] flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#1D1D1F]">แก้ไขรายละเอียดงานย่อย</h3>
                  <p className="text-[11px] text-[#86868B]">ปรับเปลี่ยนชื่อ, วันที่เริ่ม-เสร็จ และความคืบหน้า</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingSubtask(null)}
                className="text-[#86868B] hover:text-[#1D1D1F] p-1.5 rounded-full hover:bg-[#F5F5F7] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubtask} className="space-y-3.5 text-xs">
              {/* ชื่องานย่อย */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  ชื่องานย่อย (Subtask Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subtaskCategory}
                  onChange={(e) => setSubtaskCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-2xl text-xs outline-none focus:bg-white focus:border-[#005B9A] focus:ring-2 focus:ring-sky-100 font-medium"
                />
              </div>

              {/* วันที่เริ่มงาน & วันที่แล้วเสร็จ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* วันที่เริ่ม */}
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                    <span>วันที่เริ่มงาน <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-[#005B9A] font-medium">ปฏิทิน</span>
                  </label>
                  <div
                    onClick={() => handleOpenCalendarPicker("subtask_start", "เลือกวันที่เริ่มงานย่อย", subtaskStart)}
                    className="w-full px-3 py-2 bg-[#F5F5F7] hover:bg-sky-50 border border-black/[0.06] hover:border-[#005B9A] rounded-2xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
                  >
                    <span className="font-mono font-semibold text-[#005B9A] truncate">{subtaskStart || "เลือกวันที่"}</span>
                    <CalendarIcon className="w-3.5 h-3.5 text-[#005B9A] group-hover:scale-110 transition-transform shrink-0" />
                  </div>
                </div>

                {/* วันที่แล้วเสร็จ */}
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                    <span>วันที่แล้วเสร็จ <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-[#005B9A] font-medium">ปฏิทิน</span>
                  </label>
                  <div
                    onClick={() => handleOpenCalendarPicker("subtask_end", "เลือกวันที่แล้วเสร็จงานย่อย", subtaskEnd)}
                    className="w-full px-3 py-2 bg-[#F5F5F7] hover:bg-sky-50 border border-black/[0.06] hover:border-[#005B9A] rounded-2xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
                  >
                    <span className="font-mono font-semibold text-[#005B9A] truncate">{subtaskEnd || "เลือกวันที่"}</span>
                    <CalendarIcon className="w-3.5 h-3.5 text-[#005B9A] group-hover:scale-110 transition-transform shrink-0" />
                  </div>
                </div>
              </div>

              {/* ระยะเวลาคำนวณอัตโนมัติ */}
              <div className="bg-[#FAFAFC] border border-black/[0.05] rounded-2xl p-2.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#1D1D1F]">จำนวนวันที่ใช้:</span>
                <span className="font-mono font-bold text-xs text-[#005B9A] bg-white border border-black/[0.06] px-3 py-0.5 rounded-xl shadow-2xs">
                  {calculateDayDifference(subtaskStart, subtaskEnd)} วัน
                </span>
              </div>

              {/* ความคืบหน้า (%) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#1D1D1F]">ระบุความคืบหน้า (%):</label>
                  <div className="flex items-center gap-1 bg-sky-50 border border-sky-200 rounded-full px-2.5 py-0.5 focus-within:ring-2 focus-within:ring-sky-200">
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
                      className="w-12 text-right text-xs font-bold text-[#005B9A] bg-transparent outline-none font-mono"
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

                {/* Preset Pills */}
                <div className="grid grid-cols-5 gap-1 mt-1.5">
                  {[0, 25, 50, 75, 100].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setEditProgress(val)
                        setEditStatus(getDerivedStatus(val))
                      }}
                      className={`py-1 rounded-full text-[10px] font-medium border transition-colors cursor-pointer ${
                        editProgress === val
                          ? "bg-[#005B9A] text-white border-[#005B9A] shadow-xs"
                          : "bg-[#F5F5F7] text-[#1D1D1F] border-black/[0.05] hover:bg-[#E8E8ED]"
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* สถานะ Badge */}
              <div className="bg-[#FAFAFC] border border-black/[0.05] rounded-2xl p-2.5 flex items-center justify-between">
                <div className="text-[11px] font-medium text-[#86868B]">สถานะ:</div>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1 shadow-2xs ${
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

              <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSubtask(null)}
                  className="px-4 py-1.5 bg-[#F5F5F7] text-[#1D1D1F] rounded-full text-xs font-medium hover:bg-[#E8E8ED] transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSavingSubtask}
                  className="px-5 py-1.5 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-full text-xs font-medium shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingSubtask ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Insert Subtask Row Modal (Above / Below) */}
      {insertModalOpen && targetSubtask && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setInsertModalOpen(false)
          }}
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-black/[0.08] animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-semibold text-xs text-[#1D1D1F]">
                  แทรกแถวงานย่อย ({insertPosition === "above" ? "ด้านบน" : "ด้านล่าง"})
                </h3>
                <p className="text-[11px] text-[#86868B] mt-0.5 line-clamp-1">
                  อ้างอิง: <span className="font-semibold text-[#1D1D1F]">{targetSubtask.category}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInsertModalOpen(false)}
                className="text-[#86868B] hover:text-[#1D1D1F] p-1 rounded-full hover:bg-[#F5F5F7] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInsertSubtask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1.5">ตำแหน่งการแทรกแถว:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInsertPosition("above")}
                    className={`py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      insertPosition === "above"
                        ? "bg-sky-50 text-[#005B9A] border-[#005B9A] ring-2 ring-sky-100"
                        : "bg-[#F5F5F7] text-[#6E6E73] border-black/[0.06] hover:bg-[#E8E8ED]"
                    }`}
                  >
                    <ArrowUpToLine className="w-4 h-4 text-[#005B9A]" />
                    <span>แทรกด้านบน</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInsertPosition("below")}
                    className={`py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      insertPosition === "below"
                        ? "bg-sky-50 text-[#005B9A] border-[#005B9A] ring-2 ring-sky-100"
                        : "bg-[#F5F5F7] text-[#6E6E73] border-black/[0.06] hover:bg-[#E8E8ED]"
                    }`}
                  >
                    <ArrowDownToLine className="w-4 h-4 text-[#005B9A]" />
                    <span>แทรกด้านล่าง</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  ชื่องานที่ต้องทำ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={insertCategory}
                  onChange={(e) => setInsertCategory(e.target.value)}
                  placeholder="เช่น ตรวจสอบแนวเชื่อม NDT..."
                  className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-2xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                    <span>วันที่เริ่ม</span>
                    <span className="text-[10px] text-[#005B9A] font-medium">ปฏิทิน</span>
                  </label>
                  <div
                    onClick={() => handleOpenCalendarPicker("insert_start", "เลือกวันที่เริ่มงาน", insertStart)}
                    className="w-full px-3 py-2 bg-[#F5F5F7] hover:bg-sky-50 border border-black/[0.06] hover:border-[#005B9A] rounded-2xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
                  >
                    <span className="font-mono font-semibold text-[#005B9A] truncate">{insertStart || "เลือกวันที่"}</span>
                    <CalendarIcon className="w-3.5 h-3.5 text-[#005B9A] group-hover:scale-110 transition-transform shrink-0" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                    <span>วันที่เสร็จ</span>
                    <span className="text-[10px] text-[#005B9A] font-medium">ปฏิทิน</span>
                  </label>
                  <div
                    onClick={() => handleOpenCalendarPicker("insert_end", "เลือกวันที่แล้วเสร็จ", insertEnd)}
                    className="w-full px-3 py-2 bg-[#F5F5F7] hover:bg-sky-50 border border-black/[0.06] hover:border-[#005B9A] rounded-2xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
                  >
                    <span className="font-mono font-semibold text-[#005B9A] truncate">{insertEnd || "เลือกวันที่"}</span>
                    <CalendarIcon className="w-3.5 h-3.5 text-[#005B9A] group-hover:scale-110 transition-transform shrink-0" />
                  </div>
                </div>
              </div>

              <div className="bg-[#FAFAFC] border border-black/[0.05] rounded-2xl p-2.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#1D1D1F]">จำนวนวันที่ใช้:</span>
                <span className="font-mono font-bold text-xs text-[#005B9A] bg-white border border-black/[0.06] px-3 py-0.5 rounded-xl shadow-2xs">
                  {calculateDayDifference(insertStart, insertEnd)} วัน
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInsertModalOpen(false)}
                  className="px-4 py-2 bg-[#F5F5F7] text-[#1D1D1F] rounded-full text-xs font-medium hover:bg-[#E8E8ED] transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isInsertingSubtask}
                  className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-full text-xs font-medium shadow-xs cursor-pointer"
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
      className="fixed inset-0 bg-black/40 z-60 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-black/[0.08] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sky-50 text-[#005B9A] flex items-center justify-center font-bold">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-xs text-[#1D1D1F]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#86868B] hover:text-[#1D1D1F] p-1 rounded-full hover:bg-[#F5F5F7] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Month & Year Navigation Bar */}
        <div className="flex items-center justify-between bg-[#F5F5F7] p-2 rounded-2xl border border-black/[0.04] mb-3">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-full text-[#6E6E73] hover:bg-white hover:text-[#005B9A] shadow-2xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="font-bold text-xs text-[#1D1D1F]">
            <span>{THAI_MONTH_FULL[currentMonth]}</span>{" "}
            <span className="font-mono text-[#005B9A]">{currentYear}</span>{" "}
            <span className="text-[10px] text-[#86868B] font-normal">({thaiYear})</span>
          </div>

          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-full text-[#6E6E73] hover:bg-white hover:text-[#005B9A] shadow-2xs transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[10px] text-[#86868B] mb-1">
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
                className={`py-2 rounded-xl font-semibold transition-all text-xs flex flex-col items-center justify-center relative cursor-pointer ${
                  isSelected
                    ? "bg-[#005B9A] text-white shadow-xs scale-105"
                    : cell.isCurrentMonth
                    ? "text-[#1D1D1F] hover:bg-sky-50 hover:text-[#005B9A]"
                    : "text-[#D2D2D7] hover:bg-[#FAFAFC]"
                } ${isToday && !isSelected ? "ring-1 ring-[#005B9A]" : ""}`}
              >
                <span>{cell.dayNum}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Date Summary */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-[11px] font-medium text-[#86868B]">
            วันที่เลือก: <span className="font-mono text-[#005B9A] font-bold">{formatThaiDate(selectedDay)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedDay(new Date())}
              className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED] transition-colors cursor-pointer"
            >
              วันนี้
            </button>
            <button
              type="button"
              onClick={() => onSelectDate(selectedDay)}
              className="px-4 py-1 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-full text-xs font-medium transition-all shadow-xs cursor-pointer"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
