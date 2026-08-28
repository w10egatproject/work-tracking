"use client"

import { Task, DISCIPLINE_CONFIG } from "@/types"
import { ExternalLink, ChevronRight, Wrench, Calendar, FileText } from "lucide-react"

interface Props {
  tasks: Task[]
}

export default function TaskTable({ tasks }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="px-6 py-16 text-center bg-white border border-slate-200/90 rounded-2xl mx-6 my-2 shadow-xs">
        <div className="text-3xl mb-2">🔍</div>
        <div className="text-slate-700 font-bold text-sm">ไม่พบงานที่ตรงกับเงื่อนไขการค้นหา/ตัวกรอง</div>
        <div className="text-slate-400 text-xs mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดงานอื่น</div>
      </div>
    )
  }

  return (
    <div className="px-6 py-2">
      {/* Modern Workspace Table Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        {/* Table Subheader */}
        <div className="bg-slate-50/80 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              แผ่นงาน: ลำดับงาน (Master List)
            </span>
            <span className="text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
              {tasks.length} งาน
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            คลิกที่แถวหรือปุ่ม &quot;เปิดดู&quot; เพื่อเข้าสู่หน้ารายละเอียดและ Daily Gantt Chart
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-3.5 border-r border-slate-200/70 w-24 text-center">ลำดับงาน</th>
                <th className="py-3 px-4 border-r border-slate-200/70 min-w-[280px]">รายการ / ชื่องาน</th>
                <th className="py-3 px-3.5 border-r border-slate-200/70 w-28 text-center font-mono">W/O</th>
                <th className="py-3 px-3.5 border-r border-slate-200/70 w-32 text-center">วันที่เริ่มงาน</th>
                <th className="py-3 px-3.5 border-r border-slate-200/70 w-32 text-center">วันที่สิ้นสุด</th>
                <th className="py-3 px-3.5 border-r border-slate-200/70 w-36 text-center">หมวดที่ร่วมงาน</th>
                <th className="py-3 px-4 border-r border-slate-200/70 min-w-[220px]">อุปกรณ์ (Equip)</th>
                <th className="py-3 px-3 border-r border-slate-200/70 w-24 text-center">ชีท</th>
                <th className="py-3 px-3.5 w-28 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {tasks.map((task, index) => {
                const isEven = index % 2 === 0
                const isDone = task.status === "เสร็จ"

                return (
                  <tr
                    key={task.id}
                    className={`transition-all hover:bg-emerald-50/40 group ${
                      isEven ? "bg-white" : "bg-slate-50/30"
                    }`}
                  >
                    {/* ลำดับงาน */}
                    <td className="py-3 px-3.5 border-r border-slate-100 text-center font-bold text-slate-600 bg-slate-50/50">
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono text-[11px] shadow-2xs">
                        {task.taskNo || `งานที่${task.id}`}
                      </span>
                    </td>

                    {/* รายการ */}
                    <td className="py-3 px-4 border-r border-slate-100 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/task/${task.id}`}
                          className="hover:text-emerald-700 hover:underline transition-colors line-clamp-1"
                          title={task.title}
                        >
                          {task.title}
                        </a>
                      </div>
                    </td>

                    {/* W/O */}
                    <td className="py-3 px-3.5 border-r border-slate-100 text-center font-mono font-bold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {task.wo || "-"}
                      </span>
                    </td>

                    {/* วันที่เริ่มงาน */}
                    <td className="py-3 px-3.5 border-r border-slate-100 text-center text-slate-600 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{task.report_date || "-"}</span>
                      </div>
                    </td>

                    {/* วันที่สิ้นสุด */}
                    <td className="py-3 px-3.5 border-r border-slate-100 text-center text-slate-600 whitespace-nowrap">
                      <span className="text-[11px] font-medium">
                        {task.completion_date || "-"}
                      </span>
                    </td>

                    {/* Wที่ร่วมงาน */}
                    <td className="py-3 px-3.5 border-r border-slate-100 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {task.w_codes && task.w_codes.length > 0 ? (
                          task.w_codes.map((w) => {
                            const conf = DISCIPLINE_CONFIG[w]
                            if (!conf) return null
                            return (
                              <span
                                key={w}
                                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold border shadow-2xs ${conf.badgeClass}`}
                                title={conf.fullName}
                              >
                                {conf.num}
                              </span>
                            )
                          })
                        ) : (
                          <span className="text-slate-400 font-mono">
                            {task.completion_codes || "-"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Equip */}
                    <td className="py-3 px-4 border-r border-slate-100 text-slate-600">
                      {task.equip ? (
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-2 py-1 rounded-lg max-w-[220px]">
                          <Wrench className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate font-medium text-[11px]" title={task.equip}>
                            {task.equip}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300 font-mono">-</span>
                      )}
                    </td>

                    {/* ลิ้งค์ */}
                    <td className="py-3 px-3 border-r border-slate-100 text-center">
                      {task.link ? (
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors"
                          title="เปิดใน Google Sheets"
                        >
                          <span>เปิดชีท</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* การจัดการ */}
                    <td className="py-3 px-3.5 text-center">
                      <a
                        href={`/task/${task.id}`}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all shadow-xs group-hover:scale-105 active:scale-95"
                      >
                        <span>เปิดดู</span>
                        <ChevronRight className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Status Summary Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> ดำเนินการ (
              {tasks.filter((t) => t.status === "ดำเนินการ").length})
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> เสร็จสมบูรณ์ (
              {tasks.filter((t) => t.status === "เสร็จ").length})
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> รอดำเนินการ (
              {tasks.filter((t) => t.status === "รอดำเนินการ").length})
            </span>
          </div>
          <div className="font-mono text-slate-400 text-[11px]">
            Work Tracker Pro • Google Sheets Master Live
          </div>
        </div>
      </div>
    </div>
  )
}
