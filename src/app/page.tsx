"use client"

import { useState, useEffect, useMemo } from "react"
import { Task, DisciplineCode } from "@/types"
import SummaryCards from "@/components/SummaryCards"
import TaskTable from "@/components/TaskTable"
import KanbanBoardView from "@/components/KanbanBoardView"
import AddTaskDialog from "@/components/AddTaskDialog"
import { Search, Filter, Plus, Table as TableIcon, LayoutGrid, RefreshCw, Calendar } from "lucide-react"

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
      // Search query matches title, wo, or equip
      const matchSearch =
        !searchQuery.trim() ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.wo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.equip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.taskNo && task.taskNo.toLowerCase().includes(searchQuery.toLowerCase()))

      // Discipline filter
      const matchDiscipline =
        selectedDiscipline === "ALL" ||
        (task.w_codes && task.w_codes.includes(selectedDiscipline as DisciplineCode)) ||
        task.completion_codes.includes(selectedDiscipline.replace("W", ""))

      // Status filter
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased">
      {/* Modern Top Header Bar */}
      <header className="bg-slate-950 text-white px-6 py-3.5 shadow-md sticky top-0 z-20 border-b border-slate-800">
        <div className="max-w-[1700px] w-full mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  <span>Work Tracker Pro</span>
                  <span className="text-emerald-400 text-xs font-normal">v2.5</span>
                </h1>
                <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-800/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Google Sheets Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                ศูนย์ติดตามงานซ่อมบำรุงเครื่องจักรหนัก • W11 วิศวกรรม • W12 เครื่องกล • W13 ซ่อมเครื่องจักรกล • W14 ซ่อมอุปกรณ์
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 hidden lg:flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{todayStr}</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="รีเฟรชข้อมูลจาก Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">รีเฟรชชีท</span>
            </button>
            <button
              onClick={() => setAddDialogOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-bold hover:from-emerald-400 hover:to-teal-500 transition-all shadow-md shadow-emerald-900/30 flex items-center gap-1.5 active:scale-95 border border-emerald-400/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ เพิ่มงานใหม่</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 max-w-[1700px] w-full mx-auto space-y-3">
        {/* KPI & Discipline Summary */}
        <SummaryCards
          tasks={tasks}
          activeDiscipline={selectedDiscipline}
          onSelectDiscipline={setSelectedDiscipline}
        />

        {/* Filter and View Switch Toolbar */}
        <div className="px-6 py-1">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาตามชื่องาน, เลข W/O, หรือชื่ออุปกรณ์ (Equip)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> สถานะ:
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-emerald-600"
              >
                <option value="ALL">ทุกสถานะ (All Status)</option>
                <option value="ดำเนินการ">⚙️ ดำเนินการ (In Progress)</option>
                <option value="เสร็จ">✅ เสร็จสมบูรณ์ (Completed)</option>
                <option value="รอดำเนินการ">⏳ รอดำเนินการ (Pending)</option>
              </select>
            </div>

            {/* View Mode Toggle (Table / Kanban) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>ตาราง (Table View)</span>
              </button>

              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === "kanban"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-purple-600" />
                <span>บอร์ด (Kanban View)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Views */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-slate-500 text-xs font-semibold">กำลังเชื่อมต่อและโหลดข้อมูลจาก Google Sheets...</div>
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
