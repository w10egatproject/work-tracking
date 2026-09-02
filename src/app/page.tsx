"use client"

import { useState, useEffect, useMemo, useTransition } from "react"
import { Task, DisciplineCode, TaskStatus, DISCIPLINE_CONFIG } from "@/types"
import SummaryCards from "@/components/SummaryCards"
import TaskTable from "@/components/TaskTable"
import KanbanBoardView from "@/components/KanbanBoardView"
import AddTaskDialog from "@/components/AddTaskDialog"
import FloatingNavbar from "@/components/FloatingNavbar"
import MobileBottomNav from "@/components/MobileBottomNav"
import { Search } from "lucide-react"

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineCode | "ALL">("ALL")
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "ALL">("ALL")
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table")
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [, startTransition] = useTransition()

  const fetchTasks = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true)
    try {
      const res = await fetch("/api/tasks")
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault()
        document.getElementById("search-input")?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Discipline Count Map
  const disciplineCounts = useMemo(() => {
    const counts: Record<string, number> = { W11: 0, W12: 0, W13: 0, W14: 0 }
    tasks.forEach((t) => {
      t.w_codes?.forEach((code) => {
        if (counts[code] !== undefined) {
          counts[code]++
        }
      })
    })
    return counts
  }, [tasks])

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query Filter
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchTitle = task.title.toLowerCase().includes(q)
        const matchTaskNo = task.taskNo?.toLowerCase().includes(q)
        const matchWo = task.wo?.toLowerCase().includes(q)
        const matchEquip = task.equip?.toLowerCase().includes(q)
        if (!matchTitle && !matchTaskNo && !matchWo && !matchEquip) return false
      }

      // 2. Discipline Filter
      if (selectedDiscipline !== "ALL") {
        if (!task.w_codes?.includes(selectedDiscipline)) return false
      }

      // 3. Status Filter
      if (selectedStatus !== "ALL") {
        if (task.status !== selectedStatus) return false
      }

      return true
    })
  }, [tasks, search, selectedDiscipline, selectedStatus])

  const handleDeleteTaskFromState = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  // Thai Date Formatter
  const todayStr = useMemo(() => {
    const d = new Date()
    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
    return `วันพุธที่ ${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}`
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#0F172A] flex flex-col font-sans select-none antialiased text-[13px] pb-24 md:pb-16 selection:bg-[#005B9A] selection:text-white">
      {/* 1. EGAT Operations Floating Navbar */}
      <FloatingNavbar
        type="dashboard"
        todayStr={todayStr}
        refreshing={refreshing}
        onRefresh={() => fetchTasks(true)}
        onAddTask={() => setAddModalOpen(true)}
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 px-3 sm:px-6 max-w-[1600px] w-full mx-auto space-y-5 pt-4 sm:pt-6">
        {/* 2. KPI Summary Bento Cards */}
        <SummaryCards tasks={tasks} />

        {/* 3. Search & Filter Operational Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-input"
              type="text"
              value={search}
              onChange={(e) => startTransition(() => setSearch(e.target.value))}
              placeholder="ค้นหาตามชื่องาน, เลข W/O, หรืออุปกรณ์..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] text-[#0F172A] placeholder:text-slate-400 font-medium transition-all"
            />
            {/* Shortcut key indicator */}
            {!search && (
              <span className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
                /
              </span>
            )}
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Discipline Filters (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedDiscipline("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedDiscipline === "ALL"
                  ? "bg-[#005B9A] text-white border-[#005B9A] shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              ทั้งหมด <span className="text-[10px] ml-1 font-mono opacity-80">{tasks.length}</span>
            </button>

            {(["W11", "W12", "W13", "W14"] as DisciplineCode[]).map((code) => {
              const conf = DISCIPLINE_CONFIG[code]
              const count = disciplineCounts[code] || 0
              const isSelected = selectedDiscipline === code

              return (
                <button
                  key={code}
                  onClick={() => setSelectedDiscipline(isSelected ? "ALL" : code)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#005B9A] text-white border-[#005B9A] shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : conf.dotColor}`}></span>
                  <span>{conf.shortName}</span>
                  <span className="text-[10px] font-mono opacity-80">{count}</span>
                </button>
              )
            })}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TaskStatus | "ALL")}
              className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-[#0F172A] outline-none focus:bg-white focus:border-[#005B9A] cursor-pointer"
            >
              <option value="ALL">ทุกสถานะ</option>
              <option value="ดำเนินการ">⚙️ ดำเนินการ</option>
              <option value="เสร็จ">✅ เสร็จสิ้น</option>
              <option value="รอดำเนินการ">⏳ รอดำเนินการ</option>
              <option value="ยังไม่ดำเนินการ">⚪ ยังไม่เริ่ม</option>
            </select>
          </div>
        </div>

        {/* 4. Active Data View (Table or Kanban) */}
        {loading ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#005B9A] border-t-transparent rounded-full animate-spin"></div>
            <div className="text-slate-400 text-xs font-medium">กำลังโหลดข้อมูลงานซ่อมบำรุง...</div>
          </div>
        ) : viewMode === "table" ? (
          <TaskTable tasks={filteredTasks} onDeleteTask={handleDeleteTaskFromState} />
        ) : (
          <KanbanBoardView tasks={filteredTasks} onDeleteTask={handleDeleteTaskFromState} />
        )}
      </main>

      {/* 5. Mobile Bottom Navigation Bar & Drawer */}
      <MobileBottomNav
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode)}
        selectedDiscipline={selectedDiscipline}
        onSelectDiscipline={(code) => setSelectedDiscipline(code)}
        disciplineCounts={disciplineCounts}
        totalCount={tasks.length}
        onAddTask={() => setAddModalOpen(true)}
      />

      {/* 6. Create Task Dialog */}
      <AddTaskDialog
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => fetchTasks(true)}
      />
    </div>
  )
}
