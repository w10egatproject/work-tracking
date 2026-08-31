"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Task, DisciplineCode } from "@/types"
import SummaryCards from "@/components/SummaryCards"
import TaskTable from "@/components/TaskTable"
import KanbanBoardView from "@/components/KanbanBoardView"
import AddTaskDialog from "@/components/AddTaskDialog"
import FloatingNavbar from "@/components/FloatingNavbar"
import { Search, Filter, Plus, Table as TableIcon, LayoutGrid, RefreshCw, Calendar, X, Sparkles, Command } from "lucide-react"

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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans antialiased selection:bg-[#005B9A] selection:text-white">
      {/* 1. Modern Floating Glassmorphic Navbar (shadcn + Magic UI style) */}
      <FloatingNavbar
        type="dashboard"
        todayStr={todayStr}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onAddTask={() => setAddDialogOpen(true)}
      />

      {/* Main Content Dashboard Area */}
      <main className="flex-1 pb-16 max-w-[1700px] w-full mx-auto space-y-4 pt-4">
        {/* Modern Bento Hero Card (Apple Clean + Linear Accent) */}
        <div className="mx-6 p-6 bg-white rounded-2xl border border-slate-200/80 border-b-[3px] border-b-[#F0B323] shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                ภาพรวมงานซ่อมบำรุงประจำแผนก (Shop Order Operations)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ระบบติดตามงานแบบเรียลไทม์ เชื่อมต่อข้อมูล 2 ทาง (Two-Way Sync) กับ Google Sheets
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">มุมมอง:</span>
            {/* View Mode Segmented Controls */}
            <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-150 ${
                  viewMode === "table"
                    ? "bg-white text-[#0F172A] shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <TableIcon className="w-3.5 h-3.5 text-[#005B9A]" />
                <span>ตาราง (Table)</span>
              </button>

              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-150 ${
                  viewMode === "kanban"
                    ? "bg-white text-[#0F172A] shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#005B9A]" />
                <span>บอร์ด (Kanban)</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Summary Bento Cards */}
        <SummaryCards
          tasks={tasks}
          activeDiscipline={selectedDiscipline}
          onSelectDiscipline={setSelectedDiscipline}
        />

        {/* Search & Filter Toolbar */}
        <div className="px-6 py-1">
          <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.02)] flex flex-wrap items-center justify-between gap-3">
            {/* Quick Search Input with Shortcut Badge */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาตามชื่องาน, เลข W/O, หรืออุปกรณ์..."
                className="w-full pl-10 pr-20 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:border-[#005B9A] focus:ring-2 focus:ring-sky-100 outline-none transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white rounded border border-slate-200 shadow-2xs">
                    /
                  </kbd>
                )}
              </div>
            </div>

            {/* Status Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#005B9A]" /> สถานะ:
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-semibold text-[#0F172A] outline-none focus:border-[#005B9A] focus:bg-white cursor-pointer"
              >
                <option value="ALL">ทุกสถานะ (All Status)</option>
                <option value="ดำเนินการ">⚙️ กำลังดำเนินการ (In Progress)</option>
                <option value="เสร็จ">✅ เสร็จสมบูรณ์ (Completed)</option>
                <option value="รอดำเนินการ">⏳ รอดำเนินการ (Pending)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Views (Table / Kanban) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <div className="w-9 h-9 border-3 border-[#005B9A] border-t-transparent rounded-full animate-spin"></div>
            <div className="text-slate-400 text-xs font-semibold">กำลังเชื่อมต่อข้อมูลจาก Google Sheets...</div>
          </div>
        ) : (
          <>
            {viewMode === "table" && <TaskTable tasks={filteredTasks} />}
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
