"use client"

import { useState, useEffect, use } from "react"
import { Task, Subtask, TaskStatus, DISCIPLINE_CONFIG, DisciplineCode } from "@/types"
import DisciplineHandoverDialog from "@/components/DisciplineHandoverDialog"
import {
  ArrowLeft,
  ExternalLink,
  Edit2,
  History,
  Trash2,
  X,
  ArrowUpToLine,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  Wrench,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
} from "lucide-react"

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const taskId = resolvedParams.id

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [handoverOpen, setHandoverOpen] = useState(false)

  // Subtask progress editing state
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null)
  const [editProgress, setEditProgress] = useState(0)
  const [isSavingSubtask, setIsSavingSubtask] = useState(false)

  // Insert row modal state
  const [insertModalOpen, setInsertModalOpen] = useState(false)
  const [targetSubtask, setTargetSubtask] = useState<Subtask | null>(null)
  const [insertPosition, setInsertPosition] = useState<"above" | "below">("below")
  const [insertCategory, setInsertCategory] = useState("")
  const [insertStart, setInsertStart] = useState("")
  const [insertDays, setInsertDays] = useState(5)
  const [insertEnd, setInsertEnd] = useState("")
  const [isInsertingSubtask, setIsInsertingSubtask] = useState(false)

  const getDerivedStatus = (p: number): TaskStatus => {
    if (p === 100) return "เสร็จ"
    if (p > 0) return "ดำเนินการ"
    return "รอดำเนินการ"
  }

  const loadTask = async () => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`)
      if (res.ok) {
        const data = await res.json()
        setTask(data)
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

  const handleOpenEditSubtask = (st: Subtask) => {
    setEditingSubtask(st)
    setEditProgress(st.progress || 0)
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
        const updatedSubtasks = task.subtasks?.map((st) =>
          st.id === editingSubtask.id ? { ...st, ...updates } : st
        )
        setTask({ ...task, subtasks: updatedSubtasks })
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
    setInsertDays(st.days || 5)
    setInsertEnd(st.end || "")
    setInsertModalOpen(true)
  }

  const handleSaveInsertSubtask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!insertCategory.trim() || !task || !targetSubtask) return
    setIsInsertingSubtask(true)

    const discipline = targetSubtask.discipline || "W12"

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "insertSubtask",
          discipline,
          newSubtask: {
            category: insertCategory.trim(),
            start: insertStart,
            days: Number(insertDays) || 1,
            end: insertEnd,
            progress: 0,
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
        body: JSON.stringify({
          action: "deleteSubtask",
          subtaskId,
        }),
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

  // Days list for timeline (Jan 1-31, Feb 1-7)
  const daysInJan = Array.from({ length: 31 }, (_, i) => i + 1)
  const daysInFeb = Array.from({ length: 7 }, (_, i) => i + 1)
  const weekdaysThai = ["พฤหัส", "ศุกร์", "เสาร์", "อาทิตย์", "จันทร์", "อังคาร", "พุธ"]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-slate-500 text-xs font-semibold">กำลังโหลดข้อมูลแผ่นงานและไทม์ไลน์...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-12 text-center flex flex-col items-center justify-center">
        <div className="text-4xl mb-3">📁</div>
        <div className="text-slate-700 font-bold text-sm mb-4">ไม่พบข้อมูลงานที่ระบุ</div>
        <a
          href="/"
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
        >
          ← กลับหน้าหลัก
        </a>
      </div>
    )
  }

  const subtasks = task.subtasks || []
  const isDone = task.status === "เสร็จ"

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased">
      {/* Modern Top Header Bar */}
      <header className="bg-slate-950 text-white px-6 py-3.5 shadow-md sticky top-0 z-20 border-b border-slate-800">
        <div className="max-w-[1700px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับตารางหลัก</span>
            </a>
            <div className="h-5 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                {task.taskNo || `งานที่${task.id}`}
              </span>
              <h1 className="text-sm font-bold text-white max-w-[500px] truncate" title={task.title}>
                {task.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {task.link && (
              <a
                href={task.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-800"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดใน Google Sheets</span>
              </a>
            )}
            <button
              onClick={() => setHandoverOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 rounded-xl text-xs font-extrabold hover:from-amber-400 hover:to-orange-500 transition-all shadow-md shadow-amber-900/20 flex items-center gap-1.5 active:scale-95"
            >
              <span>🤝 ส่งมอบงานให้หมวดถัดไป</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-[1700px] w-full mx-auto space-y-6">
        {/* Modern Hero Summary Card with Progress Gauge */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-extrabold bg-slate-900 text-white px-2.5 py-1 rounded-lg font-mono">
                  {task.taskNo || `งานที่${task.id}`}
                </span>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                  W/O: {task.wo || "-"}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    isDone
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {task.status} ({task.progress}%)
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {task.title}
              </h2>

              {/* Chips row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>เริ่ม: <strong>{task.report_date || "-"}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>กำหนดเสร็จ: <strong>{task.completion_date || "30 มี.ค. 2026"}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl font-medium">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>ระยะเวลา: <strong>{task.total_days ? `${task.total_days} วัน` : "-"}</strong></span>
                </div>
                {task.equip && (
                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold">
                    <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{task.equip}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Progress Circle Gauge */}
            <div className="flex items-center gap-5 bg-gradient-to-br from-slate-50 to-slate-100/60 p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="relative w-18 h-18 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={isDone ? "text-emerald-500" : "text-blue-600"}
                    strokeDasharray={`${task.progress}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-extrabold text-slate-900 font-mono">
                  {task.progress}%
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800">ความคืบหน้ารวม</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  หมวดปัจจุบัน:{" "}
                  <strong className="text-blue-700 font-mono font-bold">
                    {task.current_discipline || "W12"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Handover Visual Flow */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              ลำดับการดำเนินงานระหว่างหมวด (Discipline Workflow Stepper):
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {task.w_codes &&
                task.w_codes.map((w, idx) => {
                  const conf = DISCIPLINE_CONFIG[w]
                  const isCurrent = task.current_discipline === w
                  const isCompleted =
                    isDone ||
                    (task.w_codes.indexOf(task.current_discipline as DisciplineCode) > idx)

                  return (
                    <div key={w} className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          isCurrent
                            ? "bg-blue-50 text-blue-800 border-blue-400 ring-2 ring-blue-100 shadow-xs"
                            : isCompleted
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-slate-50 text-slate-500 border-slate-200 opacity-60"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-mono ${
                            isCompleted ? "bg-emerald-500" : isCurrent ? "bg-blue-600" : "bg-slate-400"
                          }`}
                        >
                          {isCompleted ? "✓" : idx + 1}
                        </span>
                        <span>{conf?.fullName || w}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-md font-normal">
                            กำลังทำ
                          </span>
                        )}
                      </div>
                      {idx < task.w_codes.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Subtasks and Daily Gantt Matrix Table */}
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
          <div className="bg-slate-50/90 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                แผนงานย่อยและไทม์ไลน์รายวัน (Subtasks & Daily Gantt)
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                (คลิกที่แถวงานย่อยเพื่อปรับ % หรือกดปุ่ม ⬆️/⬇️ เพื่อแทรกแถว)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  {/* Top Header: Months */}
                  <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 text-xs font-bold">
                    <th colSpan={7} className="py-2.5 px-4 border-r border-slate-200 bg-slate-100">
                      รายละเอียดงานย่อย
                    </th>
                    <th
                      colSpan={31}
                      className="py-1 px-1 text-center border-r border-slate-200 bg-blue-50/70 text-blue-900 font-bold"
                    >
                      มกราคม 2026 (ม.ค.)
                    </th>
                    <th colSpan={7} className="py-1 px-1 text-center bg-purple-50/70 text-purple-900 font-bold">
                      กุมภาพันธ์ 2026 (ก.พ.)
                    </th>
                  </tr>

                  {/* Secondary Header: Columns + Day Numbers & Weekdays */}
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold">
                    <th className="py-2.5 px-4 border-r border-slate-200 w-80">งานที่ต้องทำ</th>
                    <th className="py-2.5 px-2 border-r border-slate-200 w-24 text-center">วันที่เริ่มงาน</th>
                    <th className="py-2.5 px-2 border-r border-slate-200 w-16 text-center">วันที่ใช้</th>
                    <th className="py-2.5 px-2 border-r border-slate-200 w-24 text-center">วันที่เสร็จ</th>
                    <th className="py-2.5 px-2 border-r border-slate-200 w-24 text-center">ดำเนินการ%</th>
                    <th className="py-2.5 px-2 border-r border-slate-200 w-24 text-center">สถานะ</th>
                    <th className="py-2.5 px-1 border-r border-slate-200 w-24 text-center">แทรก/ลบ</th>

                    {/* Jan 1-31 Columns */}
                    {daysInJan.map((d, i) => (
                      <th
                        key={`jan-${d}`}
                        className="py-1 px-0.5 border-r border-slate-200/50 w-5 text-center font-normal"
                      >
                        <div className="font-bold text-[10px]">{d}</div>
                        <div className="text-[8px] text-slate-400 truncate">{weekdaysThai[i % 7]}</div>
                      </th>
                    ))}

                    {/* Feb 1-7 Columns */}
                    {daysInFeb.map((d, i) => (
                      <th
                        key={`feb-${d}`}
                        className="py-1 px-0.5 border-r border-slate-200/50 w-5 text-center font-normal"
                      >
                        <div className="font-bold text-[10px]">{d}</div>
                        <div className="text-[8px] text-slate-400 truncate">{weekdaysThai[(i + 3) % 7]}</div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {subtasks.map((st) => {
                    const isHeader = st.isHeader
                    const conf = st.discipline ? DISCIPLINE_CONFIG[st.discipline] : null

                    return (
                      <tr
                        key={st.id}
                        onClick={() => !isHeader && handleOpenEditSubtask(st)}
                        className={`group transition-all ${
                          isHeader
                            ? "bg-slate-100/80 font-bold border-t-2 border-slate-300"
                            : "hover:bg-blue-50/40 cursor-pointer bg-white"
                        }`}
                      >
                        {/* ชื่องานที่ต้องทำ */}
                        <td className="py-2.5 px-4 border-r border-slate-100">
                          <div className="flex items-center justify-between gap-1.5">
                            {isHeader ? (
                              <div className="flex items-center gap-2 text-slate-900 font-bold">
                                <span
                                  className={`w-3 h-3 rounded-md flex items-center justify-center font-mono text-[9px] text-white font-extrabold ${
                                    conf?.barClass || "bg-slate-600"
                                  }`}
                                >
                                  {conf?.num}
                                </span>
                                <span>{st.category}</span>
                              </div>
                            ) : (
                              <span className="text-slate-700 pl-5 flex items-center gap-1.5">
                                <span className="text-slate-400">•</span>
                                <span className="font-medium">{st.category}</span>
                                <Edit2 className="w-2.5 h-2.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </span>
                            )}
                          </div>
                        </td>

                        {/* วันที่เริ่มงาน */}
                        <td
                          className={`py-2 px-2 border-r border-slate-100 text-center ${
                            isHeader ? "font-bold text-slate-900" : "text-slate-500"
                          }`}
                        >
                          {st.start || "-"}
                        </td>

                        {/* วันที่ใช้ */}
                        <td
                          className={`py-2 px-2 border-r border-slate-100 text-center font-mono ${
                            isHeader ? "font-bold" : "text-slate-600"
                          }`}
                        >
                          {st.days || "-"}
                        </td>

                        {/* วันที่เสร็จ */}
                        <td
                          className={`py-2 px-2 border-r border-slate-100 text-center ${
                            isHeader ? "font-bold text-slate-900" : "text-slate-500"
                          }`}
                        >
                          {st.end || "-"}
                        </td>

                        {/* ระยะการดำเนินการ% */}
                        <td className="py-2 px-2 border-r border-slate-100">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  st.progress === 100 ? "bg-emerald-500" : "bg-blue-600"
                                }`}
                                style={{ width: `${st.progress}%` }}
                              ></div>
                            </div>
                            <span className="font-mono font-bold text-[11px] w-7 text-right">
                              {st.progress}%
                            </span>
                          </div>
                        </td>

                        {/* สถานะ */}
                        <td className="py-2 px-2 border-r border-slate-100 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              st.status === "เสร็จ"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : st.status === "ดำเนินการ"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {st.status}
                          </span>
                        </td>

                        {/* จัดการแถว (ปุ่มแทรกด้านบน / ด้านล่าง / ลบ) */}
                        <td className="py-1 px-1 border-r border-slate-100 text-center">
                          <div className="flex items-center justify-center gap-0.5">
                            <button
                              type="button"
                              onClick={(e) => handleOpenInsertModal(st, "above", e)}
                              className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title="แทรกแถวด้านบน"
                            >
                              <ArrowUpToLine className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleOpenInsertModal(st, "below", e)}
                              className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title="แทรกแถวด้านล่าง"
                            >
                              <ArrowDownToLine className="w-3.5 h-3.5" />
                            </button>
                            {!isHeader && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteSubtask(st.id, e)}
                                className="p-1 rounded-md text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="ลบแถวนี้"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* 31 Jan Cells Gantt Lane */}
                        {daysInJan.map((d) => {
                          const isHighlighted =
                            (st.discipline === "W12" &&
                              (d === 1 || (d >= 1 && d <= 30 && st.progress === 0))) ||
                            (st.discipline === "W13" && d >= 1 && d <= 30)

                          return (
                            <td
                              key={`jan-lane-${d}`}
                              className="p-0 border-r border-slate-100 text-center relative h-8"
                            >
                              {isHighlighted && (
                                <div
                                  className={`h-5 w-full mx-auto shadow-2xs ${
                                    st.progress === 100 && d === 1
                                      ? "bg-emerald-500 rounded-md"
                                      : isHeader
                                      ? "bg-amber-400/90 rounded-md"
                                      : "bg-blue-500 rounded-md"
                                  }`}
                                  title={`${st.category}: ${st.progress}%`}
                                ></div>
                              )}
                            </td>
                          )
                        })}

                        {/* 7 Feb Cells Gantt Lane */}
                        {daysInFeb.map((d) => {
                          const isHighlighted =
                            (st.discipline === "W12" && d <= 3) || (st.discipline === "W13" && d <= 3)
                          return (
                            <td
                              key={`feb-lane-${d}`}
                              className="p-0 border-r border-slate-100 text-center relative h-8"
                            >
                              {isHighlighted && (
                                <div className="h-5 w-full mx-auto bg-amber-400/80 rounded-md shadow-2xs"></div>
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
        </div>

        {/* Handover Audit Trail / Logs */}
        {task.handovers && task.handovers.length > 0 && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3.5">
              <History className="w-4 h-4 text-amber-600" />
              <span>ประวัติการส่งมอบงานระหว่างหมวด (Handover History Logs)</span>
            </h3>
            <div className="space-y-2.5">
              {task.handovers.map((ho, idx) => (
                <div
                  key={ho.id || idx}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs flex flex-wrap items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-500">โอนงาน:</span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-extrabold text-purple-700 shadow-2xs">
                      {ho.fromDiscipline}
                    </span>
                    <span className="text-slate-400">➔</span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-extrabold text-blue-700 shadow-2xs">
                      {ho.toDiscipline}
                    </span>
                    {ho.notes && (
                      <span className="text-slate-600 ml-2 italic">&quot;{ho.notes}&quot;</span>
                    )}
                  </div>
                  <div className="text-slate-400 font-mono text-[11px] bg-white border border-slate-200/60 px-2 py-0.5 rounded-md">
                    วันที่ส่งมอบ: {ho.handoverDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Handover Dialog */}
      <DisciplineHandoverDialog
        task={task}
        open={handoverOpen}
        onClose={() => setHandoverOpen(false)}
        onSuccess={(updated) => setTask(updated)}
      />

      {/* Insert Subtask Row Modal (Above / Below) */}
      {insertModalOpen && targetSubtask && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-100"
          onClick={(e) => {
            if (e.target === e.currentTarget) setInsertModalOpen(false)
          }}
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  แทรกแถวงานย่อย ({insertPosition === "above" ? "ด้านบน" : "ด้านล่าง"})
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  อ้างอิงจากแถว: <span className="font-bold text-slate-700">{targetSubtask.category}</span>
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

            <form onSubmit={handleSaveInsertSubtask} className="space-y-4 text-xs">
              {/* Position Toggle Buttons */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  ตำแหน่งการแทรกแถว:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInsertPosition("above")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      insertPosition === "above"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-200"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowUpToLine className="w-4 h-4 text-emerald-600" />
                    <span>แทรกด้านบนแถวนี้</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInsertPosition("below")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      insertPosition === "below"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-200"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowDownToLine className="w-4 h-4 text-emerald-600" />
                    <span>แทรกด้านล่างแถวนี้</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ชื่องานที่ต้องทำ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={insertCategory}
                  onChange={(e) => setInsertCategory(e.target.value)}
                  placeholder="เช่น กลึงปาดผิวชิ้นงาน หรือ ตรวจสอบพิกัดความเผื่อ..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">วันที่เริ่มงาน</label>
                  <input
                    type="text"
                    value={insertStart}
                    onChange={(e) => setInsertStart(e.target.value)}
                    placeholder="เช่น 1 ก.พ. 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">วันที่ใช้ (วัน)</label>
                  <input
                    type="number"
                    min={1}
                    value={insertDays}
                    onChange={(e) => setInsertDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">วันที่เสร็จ (ถ้ามี)</label>
                <input
                  type="text"
                  value={insertEnd}
                  onChange={(e) => setInsertEnd(e.target.value)}
                  placeholder="เช่น 10 ก.พ. 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
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
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl text-xs font-bold hover:from-emerald-500 hover:to-teal-600 shadow-xs flex items-center gap-1"
                >
                  {isInsertingSubtask ? "กำลังแทรก..." : `✓ แทรกแถว (${insertPosition === "above" ? "บน" : "ล่าง"})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subtask Edit Quick Modal */}
      {editingSubtask &&
        (() => {
          const derived = getDerivedStatus(editProgress)
          return (
            <div
              className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => {
                if (e.target === e.currentTarget) setEditingSubtask(null)
              }}
            >
              <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-1">แก้ไขความคืบหน้างานย่อย</h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-1 font-medium">{editingSubtask.category}</p>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">ระบุความคืบหน้า (%):</label>
                      <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-xl px-2.5 py-1 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500">
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
                          }}
                          className="w-14 text-right text-sm font-extrabold text-blue-700 bg-transparent outline-none font-mono"
                        />
                        <span className="text-xs font-bold text-blue-600">%</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={editProgress}
                      onChange={(e) => setEditProgress(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />

                    {/* Preset quick buttons */}
                    <div className="grid grid-cols-5 gap-1.5 mt-2.5">
                      {[0, 25, 50, 75, 100].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setEditProgress(val)}
                          className={`py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                            editProgress === val
                              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {val}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auto Calculated Status Badge */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-500">สถานะอัตโนมัติ:</div>
                    <div>
                      {derived === "เสร็จ" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1 shadow-2xs">
                          <span>✅</span> เสร็จสมบูรณ์ (100%)
                        </span>
                      )}
                      {derived === "ดำเนินการ" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1 shadow-2xs">
                          <span>⚙️</span> ดำเนินการ ({editProgress}%)
                        </span>
                      )}
                      {derived === "รอดำเนินการ" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1 shadow-2xs">
                          <span>⏳</span> รอดำเนินการ (0%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingSubtask(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      disabled={isSavingSubtask}
                      onClick={handleSaveSubtask}
                      className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-xs"
                    >
                      {isSavingSubtask ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
    </div>
  )
}
