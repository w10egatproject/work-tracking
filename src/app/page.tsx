"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Task, DisciplineCode } from "@/types"
import SummaryCards from "@/components/SummaryCards"
import TaskTable from "@/components/TaskTable"
import KanbanBoardView from "@/components/KanbanBoardView"
import AddTaskDialog from "@/components/AddTaskDialog"
import FloatingNavbar from "@/components/FloatingNavbar"
import { Search, Filter, Table as TableIcon, LayoutGrid, X } from "lucide-react"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL")
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table")

  const searchInputRef = useRef<HTMLInputElement>(null)

  const loadData = async () => {
    try {
      const res = await fetch("/api/tasks")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setTasks(data)
        }
      }
    } catch (e) {
      console.error("Failed to load tasks:", e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current && !addDialogOpen) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [addDialogOpen])

  const handleRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev])
  }

  const handleTaskDeleted = (deletedId: string) => {
    setTasks((prev) =>
      prev.filter(
        (t) =>
          t.id !== deletedId &&
          t.taskNo !== deletedId &&
          t.taskNo !== `งานที่${deletedId}` &&
          t.id.replace(/\D/g, "") !== deletedId.replace(/\D/g, "")
      )
    )
  }

  // Discipline counts
  const countW11 = useMemo(() => tasks.filter((t) => t.completion_codes.includes("11") || (t.w_codes && t.w_codes.includes("W11"))).length, [tasks])
  const countW12 = useMemo(() => tasks.filter((t) => t.completion_codes.includes("12") || (t.w_codes && t.w_codes.includes("W12"))).length, [tasks])
  const countW13 = useMemo(() => tasks.filter((t) => t.completion_codes.includes("13") || (t.w_codes && t.w_codes.includes("W13"))).length, [tasks])
  const countW14 = useMemo(() => tasks.filter((t) => t.completion_codes.includes("14") || (t.w_codes && t.w_codes.includes("W14"))).length, [tasks])

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch =
        !searchQuery.trim() ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.wo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.equip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.taskNo && task.taskNo.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchDiscipline =
        selectedDiscipline === "ALL" ||
        (task.w_codes && task.w_codes.includes(selectedDiscipline as DisciplineCode)) ||
        task.completion_codes.includes(selectedDiscipline.replace("W", ""))

      const matchStatus =
        selectedStatus === "ALL" || task.status === selectedStatus

      return matchSearch && matchDiscipline && matchStatus
    })
  }, [tasks, searchQuery, selectedDiscipline, selectedStatus])

  const todayStr = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col font-sans antialiased selection:bg-[#005B9A] selection:text-white">
      {/* 1. Unified Single App Header */}
      <FloatingNavbar
        type="dashboard"
        todayStr={todayStr}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onAddTask={() => setAddDialogOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content Dashboard Area */}
      <main className="flex-1 pb-16 max-w-[1600px] w-full mx-auto space-y-4 sm:space-y-5 pt-6 sm:pt-7 px-4 sm:px-6">
        {/* Symmetrical KPI Summary Bento Cards */}
        <SummaryCards tasks={tasks} />

        {/* Unified Action & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          {/* Quick Search Input */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาตามชื่องาน, เลข W/O, หรืออุปกรณ์..."
              className="w-full pl-10 pr-16 py-2 bg-[#F5F5F7] border border-black/[0.05] rounded-xl text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:bg-white focus:border-[#005B9A] focus:ring-2 focus:ring-sky-100 outline-none transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-[#86868B] hover:text-[#1D1D1F] rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#86868B] bg-white rounded border border-black/[0.08] shadow-2xs">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Right Group: Discipline Filter Pills + Status Dropdown */}
          <div className="flex flex-wrap items-center justify-between xl:justify-end gap-2.5">
            {/* Discipline Pills */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => setSelectedDiscipline("ALL")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  selectedDiscipline === "ALL"
                    ? "bg-[#005B9A] text-white shadow-xs"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                <span>ทั้งหมด</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedDiscipline === "ALL" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tasks.length}
                </span>
              </button>

              {/* W11 */}
              <button
                onClick={() => setSelectedDiscipline("W11")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  selectedDiscipline === "W11"
                    ? "bg-purple-700 text-white shadow-xs"
                    : "bg-purple-50/80 text-purple-700 hover:bg-purple-100/90 border border-purple-200/50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>W11</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedDiscipline === "W11" ? "bg-white/20 text-white" : "bg-purple-200/80 text-purple-800"
                  }`}
                >
                  {countW11}
                </span>
              </button>

              {/* W12 */}
              <button
                onClick={() => setSelectedDiscipline("W12")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  selectedDiscipline === "W12"
                    ? "bg-[#005B9A] text-white shadow-xs"
                    : "bg-sky-50/80 text-[#005B9A] hover:bg-sky-100/90 border border-sky-200/50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#005B9A]"></span>
                <span>W12</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedDiscipline === "W12" ? "bg-white/20 text-white" : "bg-sky-200/80 text-[#005B9A]"
                  }`}
                >
                  {countW12}
                </span>
              </button>

              {/* W13 */}
              <button
                onClick={() => setSelectedDiscipline("W13")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  selectedDiscipline === "W13"
                    ? "bg-[#D97706] text-white shadow-xs"
                    : "bg-amber-50/80 text-amber-800 hover:bg-amber-100/90 border border-amber-200/50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#F0B323]"></span>
                <span>W13</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedDiscipline === "W13" ? "bg-white/20 text-white" : "bg-amber-200/80 text-amber-900"
                  }`}
                >
                  {countW13}
                </span>
              </button>

              {/* W14 */}
              <button
                onClick={() => setSelectedDiscipline("W14")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  selectedDiscipline === "W14"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/90 border border-emerald-200/50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>W14</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedDiscipline === "W14" ? "bg-white/20 text-white" : "bg-emerald-200/80 text-emerald-900"
                  }`}
                >
                  {countW14}
                </span>
              </button>
            </div>

            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 bg-[#F5F5F7] border border-black/[0.06] rounded-xl text-xs font-medium text-[#1D1D1F] outline-none focus:border-[#005B9A] focus:bg-white cursor-pointer"
              >
                <option value="ALL">ทุกสถานะ</option>
                <option value="ดำเนินการ">⚙️ กำลังดำเนินการ</option>
                <option value="เสร็จ">✅ เสร็จสมบูรณ์</option>
                <option value="รอดำเนินการ">⏳ รอดำเนินการ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Views (Table / Kanban) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 border-2 border-[#005B9A] border-t-transparent rounded-full animate-spin"></div>
            <div className="text-[#86868B] text-xs font-medium">กำลังเชื่อมต่อข้อมูลจาก Google Sheets...</div>
          </div>
        ) : (
          <>
            {viewMode === "table" && <TaskTable tasks={filteredTasks} onDeleteTask={handleTaskDeleted} />}
            {viewMode === "kanban" && <KanbanBoardView tasks={filteredTasks} />}
          </>
        )}
      </main>

      {/* Add Task Dialog */}
      <AddTaskDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleTaskAdded}
      />
    </div>
  )
}
