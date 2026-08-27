"use client"

import { useState, useEffect } from "react"
import { Task } from "@/types"
import SummaryCards from "@/components/SummaryCards"
import TaskTable from "@/components/TaskTable"
import AddTaskDialog from "@/components/AddTaskDialog"
import { TASKS_DATA } from "@/lib/tasks-data"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  useEffect(() => {
    fetch("/api/sheets")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTasks(data)
        } else {
          setTasks(TASKS_DATA)
        }
        setLoading(false)
      })
      .catch(() => {
        setTasks(TASKS_DATA)
        setLoading(false)
      })
  }, [])

  const today = new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <span>📋</span> ตารางงานซ่อมบำรุง
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">📅 {today}</span>
          <button onClick={() => setAddDialogOpen(true)} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            + เพิ่มงานใหม่
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400 text-sm">กำลังโหลดข้อมูล...</div>
        </div>
      ) : (
        <>
          {/* Summary */}
          <SummaryCards tasks={tasks} />

          {/* Table */}
          <TaskTable tasks={tasks} />
        </>
      )}

      {/* Dialogs */}
      <AddTaskDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={(t) => {}}
      />
    </div>
  )
}
