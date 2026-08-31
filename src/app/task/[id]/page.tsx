"use client"

import { useState, useEffect, use, useMemo } from "react"
import { Task, Subtask, TaskStatus, DISCIPLINE_CONFIG, DisciplineCode } from "@/types"
import DisciplineHandoverDialog from "@/components/DisciplineHandoverDialog"
import FloatingNavbar from "@/components/FloatingNavbar"
import TaskHeaderCard from "@/components/task/TaskHeaderCard"
import TaskEditDetailsModal from "@/components/task/TaskEditDetailsModal"
import SubtaskEditModal from "@/components/task/SubtaskEditModal"
import InsertSubtaskModal from "@/components/task/InsertSubtaskModal"
import TaskPhotoLightboxModal from "@/components/task/TaskPhotoLightboxModal"
import ThaiCalendarPickerModal from "@/components/task/ThaiCalendarPickerModal"
import { Plus, Edit2, Trash2 } from "lucide-react"

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

function calculateDayDifference(startStr?: string, endStr?: string): number {
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
    setEditImageUrl(task.imageUrl || "")
    setEditTaskModalOpen(true)
  }

  // Handle uploading image directly from file input or drag-and-drop
  const handleFileUpload = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพ (.jpg, .png, .webp)")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("ไฟล์รูปภาพมีขนาดใหญ่เกิน 5MB กรุณาเลือกไฟล์ที่เล็กลง")
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      if (base64) {
        setEditImageUrl(base64)
        if (task) {
          try {
            const res = await fetch(`/api/tasks/${task.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "updateTaskDetails",
                updates: { imageUrl: base64 },
              }),
            })
            if (res.ok) {
              const updated = await res.json()
              setTask(updated)
            } else {
              setTask({ ...task, imageUrl: base64 })
            }
          } catch (err) {
            setTask({ ...task, imageUrl: base64 })
          }
        }
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle removing the image and reverting to the placeholder
  const handleRemoveImage = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setEditImageUrl("")
    if (task) {
      try {
        const res = await fetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateTaskDetails",
            updates: { imageUrl: "" },
          }),
        })
        if (res.ok) {
          const updated = await res.json()
          setTask(updated)
        } else {
          setTask({ ...task, imageUrl: "" })
        }
      } catch (err) {
        setTask({ ...task, imageUrl: "" })
      }
    }
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

  // Generate dynamic date timeline columns starting from display_date (or report_date or earliest subtask) for visibleMonthsCount months
  const { dayColumns, monthGroups } = useMemo(() => {
    if (!task) return { dayColumns: [], monthGroups: [] }

    let startDate = parseThaiDate(task.display_date) || parseThaiDate(task.report_date)
    if (task.subtasks && task.subtasks.length > 0) {
      for (const st of task.subtasks) {
        const stStart = parseThaiDate(st.start)
        if (stStart && (!startDate || stStart < startDate)) {
          startDate = stStart
        }
      }
    }
    if (!startDate) startDate = new Date(2026, 4, 27)

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
        {/* 2. Apple-Clean Bento Metadata Card (Modular Component) */}
        <TaskHeaderCard
          task={task}
          currentTaskNum={currentTaskNum}
          calculateDayDifference={calculateDayDifference}
          onOpenEditModal={handleOpenEditTaskModal}
          onOpenImagePreview={() => setImagePreviewOpen(true)}
          onFileUpload={handleFileUpload}
          onRemoveImage={handleRemoveImage}
        />

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
                <span className="text-[#005B9A] font-semibold">
                  {monthGroups.length > 0
                    ? `${monthGroups[0].month.split(" ")[0]} - ${monthGroups[monthGroups.length - 1].month.split(" ")[0]} ${monthGroups[0].month.split(" ")[1] || ""}`
                    : ""}
                </span>
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

      {/* 6. Edit Task Header Metadata Modal (Modular Component) */}
      <TaskEditDetailsModal
        isOpen={editTaskModalOpen}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editReportDate={editReportDate}
        editDisplayDate={editDisplayDate}
        editCompletionDate={editCompletionDate}
        editTotalDays={editTotalDays}
        editWo={editWo}
        setEditWo={setEditWo}
        editEquip={editEquip}
        setEditEquip={setEditEquip}
        editImageUrl={editImageUrl}
        setEditImageUrl={setEditImageUrl}
        isSavingTaskDetails={isSavingTaskDetails}
        onOpenCalendarPicker={handleOpenCalendarPicker}
        onSave={handleSaveTaskDetails}
        onClose={() => setEditTaskModalOpen(false)}
      />

      {/* 7. Lightbox Image Preview Modal (Modular Component) */}
      <TaskPhotoLightboxModal
        isOpen={imagePreviewOpen}
        title={task.title}
        imageUrl={task.imageUrl}
        onClose={() => setImagePreviewOpen(false)}
      />

      {/* 8. Full Subtask Edit Modal (Modular Component) */}
      <SubtaskEditModal
        editingSubtask={editingSubtask}
        subtaskCategory={subtaskCategory}
        setSubtaskCategory={setSubtaskCategory}
        subtaskStart={subtaskStart}
        subtaskEnd={subtaskEnd}
        subtaskDays={subtaskDays}
        editProgress={editProgress}
        setEditProgress={setEditProgress}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        isSavingSubtask={isSavingSubtask}
        calculateDayDifference={calculateDayDifference}
        getDerivedStatus={getDerivedStatus}
        onOpenCalendarPicker={handleOpenCalendarPicker}
        onSave={handleSaveSubtask}
        onClose={() => setEditingSubtask(null)}
      />

      {/* 9. Insert Subtask Row Modal (Modular Component) */}
      <InsertSubtaskModal
        isOpen={insertModalOpen}
        targetSubtask={targetSubtask}
        insertPosition={insertPosition}
        setInsertPosition={setInsertPosition}
        insertCategory={insertCategory}
        setInsertCategory={setInsertCategory}
        insertStart={insertStart}
        insertEnd={insertEnd}
        isInsertingSubtask={isInsertingSubtask}
        calculateDayDifference={calculateDayDifference}
        onOpenCalendarPicker={handleOpenCalendarPicker}
        onSave={handleSaveInsertSubtask}
        onClose={() => setInsertModalOpen(false)}
      />

      {/* 10. Modern Thai Calendar Picker Modal */}
      {calendarPickerOpen && (
        <ThaiCalendarPickerModal
          title={calendarPickerTitle}
          initialDate={calendarCurrentDate}
          onSelectDate={handleSelectCalendarDate}
          onClose={() => setCalendarPickerOpen(false)}
        />
      )}
    </div>
  )
}
