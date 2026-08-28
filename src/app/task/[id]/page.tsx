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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-3 border-[#005B9A] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-slate-500 text-xs font-semibold">กำลังโหลดข้อมูลแผ่นงาน...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] p-12 text-center flex flex-col items-center justify-center">
        <div className="text-4xl mb-3">📁</div>
        <div className="text-[#0F2747] font-bold text-sm mb-4">ไม่พบข้อมูลงานที่ระบุ</div>
        <a
          href="/"
          className="px-5 py-2.5 bg-[#005B9A] text-white rounded-xl text-xs font-bold hover:bg-[#004A7D] transition-colors shadow-xs"
        >
          ← กลับหน้าหลัก
        </a>
      </div>
    )
  }

  const subtasks = task.subtasks || []
  const isDone = task.status === "เสร็จ"

  return (
    <div className="min-h-screen bg-[#F2F6FA] text-[#0F2747] flex flex-col font-sans antialiased">
      {/* Top Header Bar */}
      <header className="bg-[#0F2747] text-white px-6 py-3.5 shadow-sm sticky top-0 z-20 border-b border-slate-700">
        <div className="max-w-[1700px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 text-[#F0B323]" />
              <span>กลับตารางหลัก</span>
            </a>
            <div className="h-5 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-[#005B9A] text-white px-2 py-0.5 rounded-md">
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
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดใน Google Sheets</span>
              </a>
            )}
            <button
              onClick={() => setHandoverOpen(true)}
              className="px-4 py-2 bg-[#F0B323] hover:bg-[#D99C12] text-[#0F2747] rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <span>🤝 ส่งมอบงานให้หมวดถัดไป</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-[1700px] w-full mx-auto space-y-6">
        {/* Page Header Card with Mae Moh Amber Accent Border (Section 6.2) */}
        <div className="bg-white rounded-2xl border border-slate-200 border-b-[3px] border-b-[#F0B323] p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-extrabold bg-[#0F2747] text-white px-2.5 py-1 rounded-lg font-mono">
                  {task.taskNo || `งานที่${task.id}`}
                </span>
                <span className="text-xs font-mono font-bold bg-sky-50 text-[#005B9A] border border-sky-200 px-2.5 py-1 rounded-lg">
                  W/O: {task.wo || "-"}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    isDone
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-sky-50 text-[#005B9A] border-sky-200"
                  }`}
                >
                  {task.status} ({task.progress}%)
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#0F2747] tracking-tight leading-snug">
                {task.title}
              </h2>

              {/* Chips row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>เริ่ม: <strong>{task.report_date || "-"}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>กำหนดเสร็จ: <strong>{task.completion_date || "30 มี.ค. 2026"}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>ระยะเวลา: <strong>{task.total_days ? `${task.total_days} วัน` : "-"}</strong></span>
                </div>
                {task.equip && (
                  <div className="flex items-center gap-1.5 bg-slate-50 text-[#0F2747] border border-slate-200 px-3 py-1.5 rounded-xl font-semibold">
                    <Wrench className="w-3.5 h-3.5 text-[#005B9A]" />
                    <span>{task.equip}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Progress Circle Gauge */}
            <div className="flex items-center gap-5 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
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
                    className={isDone ? "text-[#1F7A4D]" : "text-[#005B9A]"}
                    strokeDasharray={`${task.progress}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-extrabold text-[#0F2747] font-mono">
                  {task.progress}%
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-[#0F2747]">ความคืบหน้ารวม</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  หมวดปัจจุบัน:{" "}
                  <strong className="text-[#005B9A] font-mono font-bold">
                    {task.current_discipline || "W12"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Handover Visual Flow */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
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
                            ? "bg-sky-50 text-[#005B9A] border-[#005B9A] ring-2 ring-sky-100 shadow-xs"
                            : isCompleted
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-slate-50 text-slate-500 border-slate-200 opacity-70"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-mono ${
                            isCompleted ? "bg-[#1F7A4D]" : isCurrent ? "bg-[#005B9A]" : "bg-slate-400"
                          }`}
                        >
                          {isCompleted ? "✓" : idx + 1}
                        </span>
                        <span>{conf?.fullName || w}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-[#005B9A] text-white px-1.5 py-0.2 rounded-md font-normal">
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

        {/* Subtasks Clean Breakdown Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-[#F8FAFC] border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#005B9A]"></span>
              <span className="text-xs font-bold text-[#0F2747]">
                รายการแผนงานย่อย (Subtasks Breakdown)
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                (คลิกที่แถวเพื่อแก้ไข % ความคืบหน้า หรือกดปุ่ม ⬆️/⬇️ ที่คอลัมน์จัดการเพื่อแทรกแถว)
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
              {subtasks.filter((s) => !s.isHeader).length} งานย่อย
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-slate-700">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-[#0F2747]">
                  <th className="py-3.5 px-5 border-r border-slate-200 min-w-[320px]">งานที่ต้องทำ</th>
                  <th className="py-3.5 px-3 border-r border-slate-200 w-36 text-center">วันที่เริ่มงาน</th>
                  <th className="py-3.5 px-3 border-r border-slate-200 w-28 text-center">วันที่ใช้ (วัน)</th>
                  <th className="py-3.5 px-3 border-r border-slate-200 w-36 text-center">วันที่เสร็จ</th>
                  <th className="py-3.5 px-4 border-r border-slate-200 w-44 text-center">ความคืบหน้า</th>
                  <th className="py-3.5 px-3 border-r border-slate-200 w-32 text-center">สถานะ</th>
                  <th className="py-3.5 px-3 w-32 text-center">แทรก / ลบแถว</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {subtasks.map((st) => {
                  const isHeader = st.isHeader
                  const conf = st.discipline ? DISCIPLINE_CONFIG[st.discipline] : null

                  return (
                    <tr
                      key={st.id}
                      onClick={() => !isHeader && handleOpenEditSubtask(st)}
                      className={`group transition-colors ${
                        isHeader
                          ? "bg-slate-100/90 font-bold border-t-2 border-slate-300"
                          : "hover:bg-slate-50/80 cursor-pointer bg-white"
                      }`}
                    >
                      {/* ชื่องานที่ต้องทำ */}
                      <td className="py-3 px-5 border-r border-slate-100">
                        <div className="flex items-center justify-between gap-2">
                          {isHeader ? (
                            <div className="flex items-center gap-2.5 text-[#0F2747] font-bold text-xs">
                              <span
                                className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] text-white font-extrabold ${
                                  conf?.barClass || "bg-slate-600"
                                }`}
                              >
                                {conf?.num}
                              </span>
                              <span>{st.category}</span>
                            </div>
                          ) : (
                            <span className="text-slate-700 pl-6 flex items-center gap-2">
                              <span className="text-slate-400">•</span>
                              <span className="font-semibold text-[#0F2747]">{st.category}</span>
                              <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* วันที่เริ่มงาน */}
                      <td
                        className={`py-3 px-3 border-r border-slate-100 text-center ${
                          isHeader ? "font-bold text-[#0F2747]" : "text-slate-600"
                        }`}
                      >
                        {st.start || "-"}
                      </td>

                      {/* วันที่ใช้ */}
                      <td
                        className={`py-3 px-3 border-r border-slate-100 text-center font-mono ${
                          isHeader ? "font-bold" : "text-slate-600"
                        }`}
                      >
                        {st.days ? `${st.days} วัน` : "-"}
                      </td>

                      {/* วันที่เสร็จ */}
                      <td
                        className={`py-3 px-3 border-r border-slate-100 text-center ${
                          isHeader ? "font-bold text-[#0F2747]" : "text-slate-600"
                        }`}
                      >
                        {st.end || "-"}
                      </td>

                      {/* ระยะการดำเนินการ% */}
                      <td className="py-3 px-4 border-r border-slate-100">
                        <div className="flex items-center gap-2.5 justify-center">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                st.progress === 100 ? "bg-[#1F7A4D]" : "bg-[#005B9A]"
                              }`}
                              style={{ width: `${st.progress}%` }}
                            ></div>
                          </div>
                          <span className="font-mono font-bold text-xs w-8 text-right text-[#0F2747]">
                            {st.progress}%
                          </span>
                        </div>
                      </td>

                      {/* สถานะ */}
                      <td className="py-3 px-3 border-r border-slate-100 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${
                            st.status === "เสร็จ"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : st.status === "ดำเนินการ"
                              ? "bg-sky-50 text-[#005B9A] border-sky-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          <span>{st.status === "เสร็จ" ? "✅" : st.status === "ดำเนินการ" ? "⚙️" : "⏳"}</span>
                          <span>{st.status}</span>
                        </span>
                      </td>

                      {/* จัดการแถว (ปุ่มแทรกด้านบน / ด้านล่าง / ลบ) */}
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleOpenInsertModal(st, "above", e)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#005B9A] hover:bg-sky-50 transition-colors border border-transparent hover:border-sky-200"
                            title="แทรกแถวด้านบน"
                          >
                            <ArrowUpToLine className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleOpenInsertModal(st, "below", e)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#005B9A] hover:bg-sky-50 transition-colors border border-transparent hover:border-sky-200"
                            title="แทรกแถวด้านล่าง"
                          >
                            <ArrowDownToLine className="w-4 h-4" />
                          </button>
                          {!isHeader && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSubtask(st.id, e)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="ลบแถวนี้"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Handover Audit Trail / Logs */}
        {task.handovers && task.handovers.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-[#0F2747] flex items-center gap-2 mb-3.5">
              <History className="w-4 h-4 text-[#D97706]" />
              <span>ประวัติการส่งมอบงานระหว่างหมวด (Handover History Logs)</span>
            </h3>
            <div className="space-y-2.5">
              {task.handovers.map((ho, idx) => (
                <div
                  key={ho.id || idx}
                  className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 text-xs flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-500">โอนงาน:</span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-bold text-purple-700">
                      {ho.fromDiscipline}
                    </span>
                    <span className="text-slate-400">➔</span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-bold text-[#005B9A]">
                      {ho.toDiscipline}
                    </span>
                    {ho.notes && (
                      <span className="text-slate-600 ml-2 italic">&quot;{ho.notes}&quot;</span>
                    )}
                  </div>
                  <div className="text-slate-400 font-mono text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-md">
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
          className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-100"
          onClick={(e) => {
            if (e.target === e.currentTarget) setInsertModalOpen(false)
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-[#0F2747]">
                  แทรกแถวงานย่อย ({insertPosition === "above" ? "ด้านบน" : "ด้านล่าง"})
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  อ้างอิงจากแถว: <span className="font-bold text-[#0F2747]">{targetSubtask.category}</span>
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
                <label className="block font-bold text-[#0F2747] mb-1.5">
                  ตำแหน่งการแทรกแถว:
                </label>
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
                    <span>แทรกด้านบนแถวนี้</span>
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
                    <span>แทรกด้านล่างแถวนี้</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F2747] mb-1">
                  ชื่องานที่ต้องทำ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={insertCategory}
                  onChange={(e) => setInsertCategory(e.target.value)}
                  placeholder="เช่น กลึงปาดผิวชิ้นงาน หรือ ตรวจสอบพิกัดความเผื่อ..."
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] focus:ring-2 focus:ring-[#F0B323]/30 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0F2747] mb-1">วันที่เริ่มงาน</label>
                  <input
                    type="text"
                    value={insertStart}
                    onChange={(e) => setInsertStart(e.target.value)}
                    placeholder="เช่น 1 ก.พ. 2026"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0F2747] mb-1">วันที่ใช้ (วัน)</label>
                  <input
                    type="number"
                    min={1}
                    value={insertDays}
                    onChange={(e) => setInsertDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs outline-none focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F2747] mb-1">วันที่เสร็จ (ถ้ามี)</label>
                <input
                  type="text"
                  value={insertEnd}
                  onChange={(e) => setInsertEnd(e.target.value)}
                  placeholder="เช่น 10 ก.พ. 2026"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs outline-none focus:bg-white"
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
                  className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
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
              className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => {
                if (e.target === e.currentTarget) setEditingSubtask(null)
              }}
            >
              <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-[#0F2747] mb-1">แก้ไขความคืบหน้างานย่อย</h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-1 font-medium">{editingSubtask.category}</p>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-[#0F2747]">ระบุความคืบหน้า (%):</label>
                      <div className="flex items-center gap-1 bg-sky-50 border border-sky-200 rounded-xl px-2.5 py-1 focus-within:ring-2 focus-within:ring-[#F0B323] focus-within:border-[#005B9A]">
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
                          className="w-14 text-right text-sm font-extrabold text-[#005B9A] bg-transparent outline-none font-mono"
                        />
                        <span className="text-xs font-bold text-[#005B9A]">%</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={editProgress}
                      onChange={(e) => setEditProgress(Number(e.target.value))}
                      className="w-full accent-[#005B9A] cursor-pointer"
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
                              ? "bg-[#005B9A] text-white border-[#005B9A]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {val}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auto Calculated Status Badge */}
                  <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-500">สถานะอัตโนมัติ:</div>
                    <div>
                      {derived === "เสร็จ" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <span>✅</span> เสร็จสมบูรณ์ (100%)
                        </span>
                      )}
                      {derived === "ดำเนินการ" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#005B9A] border-sky-200 inline-flex items-center gap-1">
                          <span>⚙️</span> ดำเนินการ ({editProgress}%)
                        </span>
                      )}
                      {derived === "รอดำเนินการ" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border-amber-200 inline-flex items-center gap-1">
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
                      className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-bold shadow-xs"
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
