"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Task, DisciplineCode } from "@/types"
import SummaryCards from "@/components/SummaryCards"
import TaskTable from "@/components/TaskTable"
import KanbanBoardView from "@/components/KanbanBoardView"
import AddTaskDialog from "@/components/AddTaskDialog"
import FloatingNavbar from "@/components/FloatingNavbar"
import MobileBottomNav from "@/components/MobileBottomNav"
import { Search, X } from "lucide-react"

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
          const sorted = [...data].sort((a, b) => {
            const numA = parseInt(a.id.replace(/\D/g, "") || (a.taskNo || "").replace(/\D/g, "") || "0", 10)
            const numB = parseInt(b.id.replace(/\D/g, "") || (b.taskNo || "").replace(/\D/g, "") || "0", 10)
            return numB - numA
          })
          setTasks(sorted)
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
    setTasks((prev) =>
      [newTask, ...prev].sort((a, b) => {
        const numA = parseInt(a.id.replace(/\D/g, "") || (a.taskNo || "").replace(/\D/g, "") || "0", 10)
        const numB = parseInt(b.id.replace(/\D/g, "") || (b.taskNo || "").replace(/\D/g, "") || "0", 10)
        return numB - numA
      })
    )
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

  // Filter tasks - Sorted descending (latest task on top)
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
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
      .sort((a, b) => {
        const numA = parseInt(a.id.replace(/\D/g, "") || (a.taskNo || "").replace(/\D/g, "") || "0", 10)
        const numB = parseInt(b.id.replace(/\D/g, "") || (b.taskNo || "").replace(/\D/g, "") || "0", 10)
        return numB - numA
      })
  }, [tasks, searchQuery, selectedDiscipline, selectedStatus])

  const todayStr = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#19211E] flex flex-col font-sans antialiased selection:bg-[#19211E] selection:text-[#FAF8F5]">
      {/* 1. Unified Industrial Console Header */}
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
      <main className="flex-1 pb-24 md:pb-16 max-w-[1600px] w-full mx-auto space-y-4 sm:space-y-5 pt-5 sm:pt-6 px-3 sm:px-6">
        {/* Symmetrical KPI Summary Cards (Proof over promise) */}
        <SummaryCards tasks={tasks} />

        {/* Industrial Action & Filter Toolbar */}
        <div className="bg-[#FAF8F5] rounded-2xl p-3 border border-[#DDD6C8] shadow-[0_2px_8px_rgba(25,33,30,0.03)] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          {/* Quick Search Input with Shortcut */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-[#6B7771] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาตามชื่องาน, เลข W/O, หรืออุปกรณ์..."
              className="w-full pl-10 pr-16 py-2 bg-[#ECE7DC]/60 border border-[#DDD6C8] rounded-xl text-xs text-[#19211E] placeholder:text-[#6B7771] focus:bg-[#FFFFFF] focus:border-[#19211E] focus:ring-1 focus:ring-[#19211E] outline-none transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-[#6B7771] hover:text-[#19211E] rounded-full"
                  title="ล้างคำค้นหา"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#6B7771] bg-[#FAF8F5] rounded border border-[#DDD6C8] shadow-2xs">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Right Group: Discipline Facet Pills + Status Selector */}
          <div className="flex flex-wrap items-center justify-between xl:justify-end gap-2">
            {/* Discipline Facet Buttons */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => setSelectedDiscipline("ALL")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer border ${
                  selectedDiscipline === "ALL"
                    ? "bg-[#19211E] text-[#FAF8F5] border-[#19211E] shadow-2xs"
                    : "bg-[#ECE7DC] text-[#434E49] border-[#DDD6C8] hover:bg-[#DDD6C8] hover:text-[#19211E]"
                }`}
              >
                <span>ทั้งหมด</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedDiscipline === "ALL" ? "bg-white/20 text-[#FAF8F5]" : "bg-[#FAF8F5] text-[#19211E] border border-[#DDD6C8]"
                  }`}
                >
                  {tasks.length}
                </span>
              </button>

              {/* W11 */}
              <button
                onClick={() => setSelectedDiscipline("W11")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer border ${
                  selectedDiscipline === "W11"
                    ? "bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-2xs"
                    : "bg-[#ECE7DC] text-[#434E49] border-[#DDD6C8] hover:bg-[#DDD6C8]"
                }`}
                title="W11 วิศวกรรม"
              >
                <span className="w-2 h-2 rounded-full bg-[#1D4ED8]"></span>
                <span>W11</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedDiscipline === "W11" ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#19211E] border border-[#DDD6C8]"
                  }`}
                >
                  {countW11}
                </span>
              </button>

              {/* W12 */}
              <button
                onClick={() => setSelectedDiscipline("W12")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer border ${
                  selectedDiscipline === "W12"
                    ? "bg-[#D97706] text-white border-[#D97706] shadow-2xs"
                    : "bg-[#ECE7DC] text-[#434E49] border-[#DDD6C8] hover:bg-[#DDD6C8]"
                }`}
                title="W12 เครื่องกล"
              >
                <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
                <span>W12</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedDiscipline === "W12" ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#19211E] border border-[#DDD6C8]"
                  }`}
                >
                  {countW12}
                </span>
              </button>

              {/* W13 */}
              <button
                onClick={() => setSelectedDiscipline("W13")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer border ${
                  selectedDiscipline === "W13"
                    ? "bg-[#059669] text-white border-[#059669] shadow-2xs"
                    : "bg-[#ECE7DC] text-[#434E49] border-[#DDD6C8] hover:bg-[#DDD6C8]"
                }`}
                title="W13 ซ่อมเครื่องจักรกล"
              >
                <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                <span>W13</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedDiscipline === "W13" ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#19211E] border border-[#DDD6C8]"
                  }`}
                >
                  {countW13}
                </span>
              </button>

              {/* W14 */}
              <button
                onClick={() => setSelectedDiscipline("W14")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer border ${
                  selectedDiscipline === "W14"
                    ? "bg-[#7C3AED] text-white border-[#7C3AED] shadow-2xs"
                    : "bg-[#ECE7DC] text-[#434E49] border-[#DDD6C8] hover:bg-[#DDD6C8]"
                }`}
                title="W14 ซ่อมอุปกรณ์เครื่องจักรกล"
              >
                <span className="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
                <span>W14</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedDiscipline === "W14" ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#19211E] border border-[#DDD6C8]"
                  }`}
                >
                  {countW14}
                </span>
              </button>
            </div>

            <div className="h-5 w-px bg-[#DDD6C8] hidden sm:block"></div>

            {/* Status Selector */}
            <div className="flex items-center gap-1.5">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 bg-[#ECE7DC] border border-[#DDD6C8] rounded-xl text-xs font-semibold text-[#19211E] outline-none focus:border-[#19211E] focus:bg-[#FAF8F5] cursor-pointer"
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
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#FAF8F5] rounded-2xl border border-[#DDD6C8] shadow-xs">
            <div className="w-7 h-7 border-2 border-[#19211E] border-t-transparent rounded-full animate-spin"></div>
            <div className="text-[#6B7771] text-xs font-medium">กำลังโหลดข้อมูลงานซ่อมบำรุง...</div>
          </div>
        ) : (
          <>
            {viewMode === "table" && <TaskTable tasks={filteredTasks} onDeleteTask={handleTaskDeleted} />}
            {viewMode === "kanban" && <KanbanBoardView tasks={filteredTasks} />}
          </>
        )}
      </main>

      {/* 📱 Mobile Bottom Navigation & Slide Drawer */}
      <MobileBottomNav
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedDiscipline={selectedDiscipline}
        onSelectDiscipline={setSelectedDiscipline}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        counts={{
          all: tasks.length,
          w11: countW11,
          w12: countW12,
          w13: countW13,
          w14: countW14,
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onAddTask={() => setAddDialogOpen(true)}
      />

      {/* Add Task Dialog */}
      <AddTaskDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleTaskAdded}
      />
    </div>
  )
}
