"use client"

import { useState, useEffect, useMemo } from "react"
import { Task, DisciplineCode } from "@/types"
import SummaryCards from "@/components/SummaryCards"
import TaskTable from "@/components/TaskTable"
import KanbanBoardView from "@/components/KanbanBoardView"
import AddTaskDialog from "@/components/AddTaskDialog"
import { Search, Filter, Plus, Table as TableIcon, LayoutGrid, RefreshCw, Calendar, Sparkles } from "lucide-react"

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
    <div className="min-h-screen bg-[#F2F6FA] text-[#0F2747] flex flex-col font-sans antialiased">
      {/* EGAT Operations Console - Top Navigation Bar */}
      <header className="bg-[#0F2747] text-white px-6 py-3 shadow-sm sticky top-0 z-20 border-b border-slate-700">
        <div className="max-w-[1700px] w-full mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#005B9A] border border-sky-400/30 flex items-center justify-center text-xl font-bold shadow-xs">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>ระบบจัดการใบสั่งงานซ่อม (Shop Order & Work Tracker)</span>
                </h1>
                <span className="bg-[#1F7A4D]/20 text-emerald-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Google Sheets Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-300 font-normal mt-0.5">
                กฟผ. กองบำรุงรักษาโรงไฟฟ้าแม่เมาะ • W11 วิศวกรรม • W12 เครื่องกล • W13 ซ่อมเครื่องจักรกล • W14 ซ่อมอุปกรณ์
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-300 hidden lg:flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-[#F0B323]" />
              <span>{todayStr}</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="รีเฟรชข้อมูลจาก Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#F0B323]" : ""}`} />
              <span className="hidden sm:inline">รีเฟรชข้อมูล</span>
            </button>
            <button
              onClick={() => setAddDialogOpen(true)}
              className="px-4 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ สร้างรายการใหม่</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 max-w-[1700px] w-full mx-auto space-y-4 pt-4">
        {/* Page Header Card with Mae Moh Amber Accent Border (Section 6.2) */}
        <div className="mx-6 p-6 bg-white rounded-2xl border border-slate-200 border-b-[3px] border-b-[#F0B323] shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-[#0F2747]">
                ภาพรวมงานซ่อมบำรุงประจำแผนก (Operations Dashboard)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                พร้อมใช้งาน
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              กองบำรุงรักษาโรงไฟฟ้าแม่เมาะ • เชื่อมต่อข้อมูล 2 ทาง (Two-Way Sync) กับแผ่นงานหลัก Google Sheets
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">มุมมองข้อมูล:</span>
            {/* View Mode Toggle (Table / Kanban) */}
            <div className="flex items-center bg-[#EDF2F7] p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === "table"
                    ? "bg-white text-[#0F2747] shadow-2xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <TableIcon className="w-3.5 h-3.5 text-[#005B9A]" />
                <span>ตาราง (Table View)</span>
              </button>

              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === "kanban"
                    ? "bg-white text-[#0F2747] shadow-2xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#005B9A]" />
                <span>บอร์ด (Kanban View)</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI & Discipline Summary */}
        <SummaryCards
          tasks={tasks}
          activeDiscipline={selectedDiscipline}
          onSelectDiscipline={setSelectedDiscipline}
        />

        {/* Filter Toolbar */}
        <div className="px-6 py-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาตามชื่องาน, เลข W/O, หรือชื่ออุปกรณ์ (Equip)..."
                className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#005B9A] focus:ring-2 focus:ring-[#F0B323]/30 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F2747] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#005B9A]" /> สถานะ:
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-[#005B9A]"
              >
                <option value="ALL">ทุกสถานะ (All Status)</option>
                <option value="ดำเนินการ">⚙️ ดำเนินการ (In Progress)</option>
                <option value="เสร็จ">✅ เสร็จสมบูรณ์ (Completed)</option>
                <option value="รอดำเนินการ">⏳ รอดำเนินการ (Pending)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Views */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <div className="w-9 h-9 border-3 border-[#005B9A] border-t-transparent rounded-full animate-spin"></div>
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
