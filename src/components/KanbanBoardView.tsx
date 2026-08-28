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
    { key: "รอดำเนินการ", title: "รอดำเนินการ (Pending)", color: "text-amber-700", bg: "bg-amber-50/40", border: "border-amber-200/80", icon: "⏳" },
    { key: "ดำเนินการ", title: "กำลังดำเนินการ (In Progress)", color: "text-[#005B9A]", bg: "bg-sky-50/40", border: "border-sky-200/80", icon: "⚙️" },
    { key: "เสร็จ", title: "เสร็จสมบูรณ์ (Completed)", color: "text-emerald-700", bg: "bg-emerald-50/40", border: "border-emerald-200/80", icon: "✅" },
  ]

  const disciplineColumns: { key: DisciplineCode; title: string; color: string; bg: string; border: string; num: string }[] = [
    { key: "W11", title: "W11 : วิศวกรรม", color: "text-purple-700", bg: "bg-purple-50/40", border: "border-purple-200/80", num: "11" },
    { key: "W12", title: "W12 : เครื่องกล", color: "text-[#005B9A]", bg: "bg-sky-50/40", border: "border-sky-200/80", num: "12" },
    { key: "W13", title: "W13 : ซ่อมเครื่องจักรกล", color: "text-amber-700", bg: "bg-amber-50/40", border: "border-amber-200/80", num: "13" },
    { key: "W14", title: "W14 : ซ่อมอุปกรณ์", color: "text-emerald-700", bg: "bg-emerald-50/40", border: "border-emerald-200/80", num: "14" },
  ]

  return (
    <div className="px-6 py-2">
      {/* View Switcher Header */}
      <div className="flex items-center justify-between mb-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0F172A]">จัดกลุ่มบอร์ดตาม:</span>
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setGroupBy("status")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 ${
                groupBy === "status"
                  ? "bg-white text-[#0F172A] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              📊 สถานะงาน (Status)
            </button>
            <button
              onClick={() => setGroupBy("discipline")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 ${
                groupBy === "discipline"
                  ? "bg-white text-[#005B9A] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              🏷️ หมวดงาน (Discipline)
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          แสดงทั้งหมด <strong className="text-[#0F172A]">{tasks.length}</strong> รายการ
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
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{col.icon}</span>
                      <h3 className={`text-xs font-bold ${col.color}`}>{col.title}</h3>
                    </div>
                    <span className="text-xs font-bold bg-white/90 px-2 py-0.5 rounded-full text-slate-700 shadow-2xs border border-slate-200/80 font-mono">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-2.5 flex-1">
                    {colTasks.map((task) => (
                      <TaskKanbanCard key={task.id} task={task} />
                    ))}
                    {colTasks.length === 0 && (
                      <div className="py-16 text-center text-xs text-slate-400 italic">
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
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-white flex items-center justify-center font-mono text-[11px] font-bold shadow-2xs border border-slate-200 text-[#0F172A]">
                        {col.num}
                      </span>
                      <h3 className={`text-xs font-bold ${col.color}`}>{col.title}</h3>
                    </div>
                    <span className="text-xs font-bold bg-white/90 px-2 py-0.5 rounded-full text-slate-700 shadow-2xs border border-slate-200/80 font-mono">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-2.5 flex-1">
                    {colTasks.map((task) => (
                      <TaskKanbanCard key={task.id} task={task} />
                    ))}
                    {colTasks.length === 0 && (
                      <div className="py-16 text-center text-xs text-slate-400 italic">
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

  return (
    <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-sky-300 hover:shadow-[0_4px_12px_rgba(0,91,154,0.08)] hover:-translate-y-0.5 transition-all duration-200 group flex flex-col gap-2 relative">
      {/* Top row: Task No, W/O, Status */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100/80 px-1.5 py-0.5 rounded font-mono">
            {task.taskNo || `#${task.id}`}
          </span>
          <span className="text-[11px] font-mono text-[#005B9A] font-bold">
            {task.wo || "-"}
          </span>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isDone
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : task.status === "ดำเนินการ"
              ? "bg-sky-50 text-[#005B9A] border-sky-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
        >
          {task.status}
        </span>
      </div>

      {/* Task Title */}
      <a
        href={`/task/${task.id}`}
        className="text-xs font-bold text-[#0F172A] group-hover:text-[#005B9A] transition-colors line-clamp-2 leading-relaxed"
        title={task.title}
      >
        {task.title}
      </a>

      {/* Equipment (if any) */}
      {task.equip && (
        <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200/70 rounded-md px-2 py-1 flex items-center gap-1.5 truncate">
          <Wrench className="w-3 h-3 text-slate-400 flex-shrink-0" />
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
                    ? `${conf?.badgeClass} ring-1 ring-[#F0B323] font-extrabold shadow-2xs`
                    : "bg-slate-50 text-slate-600 border-slate-200/70"
                }`}
                title={conf?.fullName}
              >
                {conf?.num} {isCurrent && "📍"}
              </span>
            )
          })}
      </div>

      {/* Progress Bar */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isDone ? "bg-emerald-500" : "bg-[#005B9A]"
              }`}
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
          <span className="text-[11px] font-bold text-[#0F172A] font-mono w-7 text-right">
            {task.progress}%
          </span>
        </div>

        <a
          href={`/task/${task.id}`}
          className="p-1 rounded-md text-slate-400 hover:text-[#005B9A] hover:bg-sky-50 transition-colors"
          title="ดูรายละเอียดงาน"
        >
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
