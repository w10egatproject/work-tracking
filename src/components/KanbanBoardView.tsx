"use client"

import { useState } from "react"
import { Task, DISCIPLINE_CONFIG, TaskStatus, DisciplineCode } from "@/types"
import { ChevronRight, Wrench, Clock, CheckCircle2, PlayCircle, Layers } from "lucide-react"

interface Props {
  tasks: Task[]
}

export default function KanbanBoardView({ tasks }: Props) {
  const [groupBy, setGroupBy] = useState<"status" | "discipline">("status")

  const statusColumns: { key: TaskStatus; title: string; color: string; bg: string; border: string; icon: string }[] = [
    { key: "รอดำเนินการ", title: "รอดำเนินการ (Pending)", color: "text-[#B45309]", bg: "bg-[#FAF8F5]", border: "border-[#DDD6C8]", icon: "⏳" },
    { key: "ดำเนินการ", title: "กำลังดำเนินการ (In Progress)", color: "text-[#C05621]", bg: "bg-[#FAF8F5]", border: "border-[#DDD6C8]", icon: "⚙️" },
    { key: "เสร็จ", title: "เสร็จสมบูรณ์ (Completed)", color: "text-[#1B5E3B]", bg: "bg-[#FAF8F5]", border: "border-[#DDD6C8]", icon: "✅" },
  ]

  const disciplineColumns: { key: DisciplineCode; title: string; color: string; bg: string; border: string; num: string }[] = [
    { key: "W11", title: "W11 : วิศวกรรม", color: "text-[#1D4ED8]", bg: "bg-[#FAF8F5]", border: "border-[#DDD6C8]", num: "11" },
    { key: "W12", title: "W12 : เครื่องกล", color: "text-[#D97706]", bg: "bg-[#FAF8F5]", border: "border-[#DDD6C8]", num: "12" },
    { key: "W13", title: "W13 : ซ่อมเครื่องจักรกล", color: "text-[#059669]", bg: "bg-[#FAF8F5]", border: "border-[#DDD6C8]", num: "13" },
    { key: "W14", title: "W14 : ซ่อมอุปกรณ์", color: "text-[#7C3AED]", bg: "bg-[#FAF8F5]", border: "border-[#DDD6C8]", num: "14" },
  ]

  return (
    <div className="py-2">
      {/* View Switcher Header */}
      <div className="flex items-center justify-between mb-4 bg-[#FAF8F5] p-3 rounded-2xl border border-[#DDD6C8] shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#19211E]">จัดกลุ่มบอร์ดตาม:</span>
          <div className="flex bg-[#ECE7DC] p-0.5 rounded-xl border border-[#DDD6C8]">
            <button
              onClick={() => setGroupBy("status")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                groupBy === "status"
                  ? "bg-[#FAF8F5] text-[#19211E] shadow-2xs"
                  : "text-[#6B7771] hover:text-[#19211E]"
              }`}
            >
              📊 สถานะงาน (Status)
            </button>
            <button
              onClick={() => setGroupBy("discipline")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                groupBy === "discipline"
                  ? "bg-[#FAF8F5] text-[#19211E] shadow-2xs"
                  : "text-[#6B7771] hover:text-[#19211E]"
              }`}
            >
              🏷️ หมวดงาน (Discipline)
            </button>
          </div>
        </div>

        <div className="text-xs text-[#6B7771] font-medium hidden sm:block">
          แสดงทั้งหมด <strong className="text-[#19211E] font-mono">{tasks.length}</strong> รายการ
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
        {groupBy === "status"
          ? statusColumns.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.key)
              return (
                <div
                  key={col.key}
                  className={`rounded-2xl border ${col.border} ${col.bg} p-3.5 shadow-xs flex flex-col min-h-[500px] transition-all`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#DDD6C8]">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{col.icon}</span>
                      <h3 className={`text-xs font-bold ${col.color}`}>{col.title}</h3>
                    </div>
                    <span className="text-xs font-bold bg-[#ECE7DC] px-2 py-0.5 rounded-md text-[#19211E] border border-[#DDD6C8] font-mono">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-2.5 flex-1">
                    {colTasks.map((task) => (
                      <TaskKanbanCard key={task.id} task={task} />
                    ))}
                    {colTasks.length === 0 && (
                      <div className="py-16 text-center text-xs text-[#98A39E] italic">
                        ไม่มีงานในสถานะนี้
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          : disciplineColumns.map((col) => {
              const colTasks = tasks.filter(
                (t) => t.current_discipline === col.key || (t.w_codes && t.w_codes.includes(col.key))
              )
              return (
                <div
                  key={col.key}
                  className={`rounded-2xl border ${col.border} ${col.bg} p-3.5 shadow-xs flex flex-col min-h-[500px] transition-all`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#DDD6C8]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#ECE7DC] flex items-center justify-center font-mono text-[11px] font-bold border border-[#DDD6C8] text-[#19211E]">
                        {col.num}
                      </span>
                      <h3 className={`text-xs font-bold ${col.color}`}>{col.title}</h3>
                    </div>
                    <span className="text-xs font-bold bg-[#ECE7DC] px-2 py-0.5 rounded-md text-[#19211E] border border-[#DDD6C8] font-mono">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-2.5 flex-1">
                    {colTasks.map((task) => (
                      <TaskKanbanCard key={task.id} task={task} />
                    ))}
                    {colTasks.length === 0 && (
                      <div className="py-16 text-center text-xs text-[#98A39E] italic">
                        ไม่มีงานในหมวดนี้
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
      </div>
    </div>
  )
}

function TaskKanbanCard({ task }: { task: Task }) {
  const isDone = task.status === "เสร็จ"
  const isProg = task.status === "ดำเนินการ"

  return (
    <div className="bg-[#FFFFFF] rounded-xl p-3.5 border border-[#DDD6C8] shadow-2xs hover:border-[#19211E] hover:shadow-xs transition-all duration-200 group flex flex-col gap-2 relative">
      {/* Top row: Task No, W/O, Status */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#19211E] bg-[#ECE7DC] px-1.5 py-0.5 rounded font-mono border border-[#DDD6C8]">
            {task.taskNo || `#${task.id}`}
          </span>
          <span className="text-[11px] font-mono text-[#19211E] font-bold">
            {task.wo || "-"}
          </span>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isDone
              ? "bg-[#E8F4EC] text-[#1B5E3B] border-[#B8DCBD]"
              : isProg
              ? "bg-[#FDF2EC] text-[#C05621] border-[#F7CEB9]"
              : "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]"
          }`}
        >
          {task.status}
        </span>
      </div>

      {/* Task Title */}
      <a
        href={`/task/${task.id}`}
        className="text-xs font-bold text-[#19211E] group-hover:text-[#C05621] transition-colors line-clamp-2 leading-relaxed"
        title={task.title}
      >
        {task.title}
      </a>

      {/* Equipment (if any) */}
      {task.equip && (
        <div className="text-[11px] text-[#434E49] bg-[#FAF8F5] border border-[#DDD6C8] rounded-md px-2 py-1 flex items-center gap-1.5 truncate">
          <Wrench className="w-3 h-3 text-[#6B7771] shrink-0" />
          <span className="truncate">{task.equip}</span>
        </div>
      )}

      {/* Disciplines Chips */}
      <div className="flex items-center gap-1 flex-wrap pt-0.5">
        {task.w_codes &&
          task.w_codes.map((w) => {
            const conf = DISCIPLINE_CONFIG[w]
            const isCurrent = task.current_discipline === w
            return (
              <span
                key={w}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-all ${
                  isCurrent
                    ? `${conf?.badgeClass} ring-1 ring-[#C05621] font-extrabold shadow-2xs`
                    : "bg-[#FAF8F5] text-[#434E49] border-[#DDD6C8]"
                }`}
                title={conf?.fullName}
              >
                {conf?.num} {isCurrent && "📍"}
              </span>
            )
          })}
      </div>

      {/* Progress Bar */}
      <div className="pt-2 border-t border-[#DDD6C8]/60 flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-[#ECE7DC] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isDone ? "bg-[#1B5E3B]" : isProg ? "bg-[#C05621]" : "bg-[#B45309]"
              }`}
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
          <span className="text-[11px] font-bold text-[#19211E] font-mono w-7 text-right">
            {task.progress}%
          </span>
        </div>

        <a
          href={`/task/${task.id}`}
          className="p-1 rounded-md text-[#6B7771] hover:text-[#19211E] hover:bg-[#ECE7DC] transition-colors"
          title="ดูรายละเอียดงาน"
        >
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
