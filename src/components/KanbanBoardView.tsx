"use client"

import { Task, TaskStatus, DISCIPLINE_CONFIG } from "@/types"
import { ExternalLink, ChevronRight, Wrench, Calendar, Trash2 } from "lucide-react"

interface Props {
  tasks: Task[]
  onDeleteTask?: (taskId: string) => void
}

const COLUMNS: { status: TaskStatus; title: string; color: string; countColor: string; dotColor: string }[] = [
  { status: "ยังไม่ดำเนินการ", title: "ยังไม่เริ่ม", color: "bg-slate-50 border-slate-200/80 text-slate-700", countColor: "bg-slate-200 text-slate-700", dotColor: "bg-slate-400" },
  { status: "รอดำเนินการ", title: "รอดำเนินการ", color: "bg-amber-50/60 border-amber-200/80 text-amber-900", countColor: "bg-amber-100 text-amber-800", dotColor: "bg-amber-500" },
  { status: "ดำเนินการ", title: "กำลังดำเนินการ", color: "bg-sky-50/60 border-sky-200/80 text-sky-950", countColor: "bg-sky-100 text-[#005B9A]", dotColor: "bg-[#005B9A]" },
  { status: "เสร็จ", title: "เสร็จสิ้น", color: "bg-emerald-50/60 border-emerald-200/80 text-emerald-950", countColor: "bg-emerald-100 text-emerald-800", dotColor: "bg-emerald-500" },
]

export default function KanbanBoardView({ tasks, onDeleteTask }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => (t.status || "ยังไม่ดำเนินการ") === col.status)

        return (
          <div
            key={col.status}
            className={`rounded-2xl border p-3.5 flex flex-col gap-3 min-h-[500px] shadow-xs ${col.color}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`}></span>
                <span className="font-bold text-xs tracking-tight">{col.title}</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-mono ${col.countColor}`}>
                {colTasks.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="space-y-2.5 flex-1">
              {colTasks.length === 0 ? (
                <div className="h-28 border border-dashed border-slate-300/80 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                  ไม่มีงานในสถานะนี้
                </div>
              ) : (
                colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-sky-300 transition-all group flex flex-col gap-2.5"
                  >
                    {/* Card Top: W/O and Task No */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#005B9A] bg-sky-50 px-2 py-0.5 rounded-md font-mono border border-sky-200/80">
                        {task.taskNo || `งานที่${task.id}`}
                      </span>
                      {task.wo && (
                        <span className="text-[10px] font-mono text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                          W/O: {task.wo}
                        </span>
                      )}
                    </div>

                    {/* Card Title */}
                    <a
                      href={`/task/${task.id}`}
                      className="text-xs font-bold text-[#0F172A] group-hover:text-[#005B9A] transition-colors line-clamp-2 leading-snug"
                    >
                      {task.title}
                    </a>

                    {/* Equip if available */}
                    {task.equip && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <Wrench className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{task.equip}</span>
                      </div>
                    )}

                    {/* Dates & Disciplines */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{task.report_date || "-"}</span>
                      </div>

                      {/* Discipline Badges */}
                      <div className="flex items-center gap-1">
                        {task.w_codes && task.w_codes.map((w) => {
                          const conf = DISCIPLINE_CONFIG[w]
                          if (!conf) return null
                          return (
                            <span
                              key={w}
                              className={`px-1 py-0.2 rounded text-[9px] font-bold border ${conf.badgeClass}`}
                            >
                              {conf.num}
                            </span>
                          )
                        })}
                      </div>
                    </div>

                    {/* Card Bottom Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      {task.link ? (
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#005B9A] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>ชีท</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span></span>
                      )}

                      <div className="flex items-center gap-1">
                        {onDeleteTask && (
                          <button
                            type="button"
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="ลบงาน"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        <a
                          href={`/task/${task.id}`}
                          className="px-2.5 py-1 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-all"
                        >
                          <span>เปิดดู</span>
                          <ChevronRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
