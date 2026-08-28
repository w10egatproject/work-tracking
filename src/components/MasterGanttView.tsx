"use client"

import { Task, DISCIPLINE_CONFIG } from "@/types"
import { ExternalLink, ChevronRight, Calendar, Layers } from "lucide-react"

interface Props {
  tasks: Task[]
}

export default function MasterGanttView({ tasks }: Props) {
  const months = [
    "ส.ค. 24", "ก.ย. 24", "ต.ค. 24", "พ.ย. 24", "ธ.ค. 24",
    "ม.ค. 25", "ก.พ. 25", "มี.ค. 25", "เม.ย. 25", "พ.ค. 25", "มิ.ย. 25",
    "ก.ค. 25", "ส.ค. 25", "ก.ย. 25", "ต.ค. 25", "พ.ย. 25", "ธ.ค. 25",
    "ม.ค. 26", "ก.พ. 26", "มี.ค. 26", "เม.ย. 26", "พ.ค. 26", "มิ.ย. 26", "ก.ค. 26", "ส.ค. 26"
  ]

  // Approximate today index (e.g. around mid 2025/2026)
  const todayIdx = 19 // ~ มี.ค. 26

  return (
    <div className="px-6 py-2">
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        {/* Header toolbar */}
        <div className="bg-slate-50/90 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">
                ไทม์ไลน์ภาพรวมทุกโครงการ (Master Gantt Timeline)
              </h3>
              <p className="text-[11px] text-slate-400">
                แสดงแผนงานต่อเนื่องของทั้ง {tasks.length} เครื่องจักร
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> เสร็จสิ้น 100%
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> กำลังดำเนินการ
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> วางแผน/รอดำเนินการ
            </span>
            <span className="flex items-center gap-1 text-red-500 font-bold bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> วันนี้ (Today)
            </span>
          </div>
        </div>

        {/* Timeline Matrix */}
        <div className="overflow-x-auto">
          <div className="min-w-[1300px]">
            {/* Months Header Bar */}
            <div className="flex bg-slate-100/90 border-b border-slate-200 text-slate-700 text-xs font-bold sticky top-0 z-10">
              <div className="w-80 flex-shrink-0 py-2.5 px-4 border-r border-slate-200">
                รายการงาน / W/O
              </div>
              <div className="w-28 flex-shrink-0 py-2.5 px-2 text-center border-r border-slate-200">
                หมวดที่ร่วมงาน
              </div>
              <div className="flex-1 flex relative">
                {months.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 py-2.5 text-center text-[11px] font-bold border-r border-slate-200/60 ${
                      idx === todayIdx ? "bg-red-50 text-red-700" : ""
                    }`}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Task Rows */}
            <div className="divide-y divide-slate-100">
              {tasks.map((task, idx) => {
                let startMonthIdx = (idx * 2) % (months.length - 6)
                let spanMonths = Math.max(3, task.total_days ? Math.ceil(task.total_days / 60) : 4)
                if (startMonthIdx + spanMonths > months.length) {
                  spanMonths = months.length - startMonthIdx
                }

                const isDone = task.status === "เสร็จ"
                const barGradient = isDone
                  ? "from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20"
                  : task.progress > 0
                  ? "from-blue-600 to-indigo-600 text-white shadow-blue-500/20"
                  : "from-amber-400 to-orange-500 text-slate-900 shadow-amber-500/20"

                return (
                  <div
                    key={task.id}
                    className="flex items-center hover:bg-slate-50/80 transition-colors text-xs text-slate-700 h-12"
                  >
                    {/* Left Task Title & WO */}
                    <div className="w-80 flex-shrink-0 px-4 py-2 border-r border-slate-100 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="font-mono font-bold text-slate-400 mr-1.5">
                          {task.taskNo || `#${task.id}`}
                        </span>
                        <a
                          href={`/task/${task.id}`}
                          className="font-bold text-slate-800 hover:text-emerald-700 hover:underline transition-colors"
                          title={task.title}
                        >
                          {task.title}
                        </a>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">
                        {task.wo || "-"}
                      </span>
                    </div>

                    {/* Disciplines Badges */}
                    <div className="w-28 flex-shrink-0 px-2 py-2 border-r border-slate-100 flex items-center justify-center gap-1">
                      {task.w_codes &&
                        task.w_codes.map((w) => {
                          const conf = DISCIPLINE_CONFIG[w]
                          if (!conf) return null
                          return (
                            <span
                              key={w}
                              className={`px-1 py-0.5 rounded text-[10px] font-extrabold border ${conf.badgeClass}`}
                            >
                              {conf.num}
                            </span>
                          )
                        })}
                    </div>

                    {/* Gantt Bar Lane */}
                    <div className="flex-1 flex h-full items-center relative px-2">
                      {/* Grid background lines */}
                      <div className="absolute inset-0 flex pointer-events-none">
                        {months.map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 border-r border-slate-100 h-full ${
                              i === todayIdx ? "bg-red-500/5" : ""
                            }`}
                          ></div>
                        ))}
                      </div>

                      {/* Today Red Line Indicator */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-400/70 z-5 pointer-events-none"
                        style={{ left: `${((todayIdx + 0.5) / months.length) * 100}%` }}
                      ></div>

                      {/* Modern Capsule Bar */}
                      <div
                        className={`relative h-7 rounded-xl shadow-xs bg-gradient-to-r ${barGradient} flex items-center justify-between px-3 font-bold text-[11px] truncate transition-all hover:scale-[1.01] cursor-pointer`}
                        style={{
                          left: `${(startMonthIdx / months.length) * 100}%`,
                          width: `${Math.max((spanMonths / months.length) * 100, 6)}%`,
                        }}
                        title={`${task.title} (${task.progress}%)`}
                      >
                        <span className="truncate flex items-center gap-1 font-mono">
                          <span>{task.progress}%</span>
                        </span>
                        {task.current_discipline && (
                          <span className="bg-black/20 text-white px-1.5 py-0.2 rounded text-[10px] font-mono">
                            {task.current_discipline}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
