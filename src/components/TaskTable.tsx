"use client"

import { Task, DISCIPLINE_CONFIG } from "@/types"
import { ExternalLink, ChevronRight, Wrench, Calendar, CheckCircle2, Clock, PlayCircle } from "lucide-react"

interface Props {
  tasks: Task[]
}

export default function TaskTable({ tasks }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="px-6 py-16 text-center bg-white border border-slate-200 rounded-2xl mx-6 my-2 shadow-xs">
        <div className="text-3xl mb-2">🔍</div>
        <div className="text-[#0F2747] font-bold text-sm">ไม่พบงานที่ตรงกับเงื่อนไขการค้นหา/ตัวกรอง</div>
        <div className="text-slate-500 text-xs mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดงานอื่น</div>
      </div>
    )
  }

  return (
    <div className="px-6 py-2">
      {/* EGAT Operations Console Data Table (Section 6.5) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Table Subheader */}
        <div className="bg-[#F8FAFC] border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#005B9A]"></span>
            <span className="text-xs font-bold text-[#0F2747]">
              ตารางรายการงานซ่อมบำรุง (Operational Master List)
            </span>
            <span className="text-xs font-bold text-[#005B9A] bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
              {tasks.length} รายการ
            </span>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            คลิกที่แถวหรือปุ่ม &quot;เปิดดู&quot; เพื่อเข้าสู่หน้ารายละเอียดและปรับปรุงความคืบหน้า
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-slate-700">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-[#0F2747]">
                <th className="py-3.5 px-4 border-r border-slate-200 w-28 text-center">ลำดับงาน</th>
                <th className="py-3.5 px-4 border-r border-slate-200 min-w-[300px]">รายการ / ชื่องานซ่อมบำรุง</th>
                <th className="py-3.5 px-3.5 border-r border-slate-200 w-32 text-center font-mono">เลข W/O</th>
                <th className="py-3.5 px-3.5 border-r border-slate-200 w-32 text-center">วันที่เริ่มงาน</th>
                <th className="py-3.5 px-3.5 border-r border-slate-200 w-32 text-center">วันที่สิ้นสุด</th>
                <th className="py-3.5 px-3.5 border-r border-slate-200 w-36 text-center">หมวดที่ร่วมงาน</th>
                <th className="py-3.5 px-4 border-r border-slate-200 min-w-[220px]">อุปกรณ์ (Equip)</th>
                <th className="py-3.5 px-3 border-r border-slate-200 w-24 text-center">ชีท</th>
                <th className="py-3.5 px-4 w-32 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {tasks.map((task, index) => {
                const isEven = index % 2 === 0
                const isDone = task.status === "เสร็จ"

                return (
                  <tr
                    key={task.id}
                    className={`transition-colors hover:bg-slate-50/90 group ${
                      isEven ? "bg-white" : "bg-[#F8FAFC]/50"
                    }`}
                  >
                    {/* ลำดับงาน */}
                    <td className="py-3 px-4 border-r border-slate-100 text-center font-bold text-slate-600">
                      <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-mono text-[11px]">
                        {task.taskNo || `งานที่${task.id}`}
                      </span>
                    </td>

                    {/* รายการ */}
                    <td className="py-3 px-4 border-r border-slate-100 font-bold text-[#0F2747]">
                      <a
                        href={`/task/${task.id}`}
                        className="text-[#0F2747] hover:text-[#005B9A] hover:underline transition-colors line-clamp-1"
                        title={task.title}
                      >
                        {task.title}
                      </a>
                    </td>

                    {/* W/O */}
                    <td className="py-3 px-3.5 border-r border-slate-100 text-center font-mono font-bold text-[#005B9A]">
                      <span className="bg-sky-50 border border-sky-200 text-[#005B9A] px-2 py-0.5 rounded text-[11px]">
                        {task.wo || "-"}
                      </span>
                    </td>

                    {/* วันที่เริ่มงาน */}
                    <td className="py-3 px-3.5 border-r border-slate-100 text-center text-slate-600 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{task.report_date || "-"}</span>
                      </div>
                    </td>

                    {/* วันที่สิ้นสุด */}
                    <td className="py-3 px-3.5 border-r border-slate-100 text-center text-slate-600 whitespace-nowrap font-medium">
                      <span className="text-[11px]">
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
                                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${conf.badgeClass}`}
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
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg max-w-[220px]">
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
                          className="inline-flex items-center gap-1 text-[#005B9A] hover:text-[#004A7D] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors"
                          title="เปิดใน Google Sheets"
                        >
                          <span>เปิดชีท</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* การจัดการ (Section 6.5) */}
                    <td className="py-3 px-4 text-right">
                      <a
                        href={`/task/${task.id}`}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
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
        <div className="bg-[#F8FAFC] border-t border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#005B9A]"></span> ดำเนินการ (
              {tasks.filter((t) => t.status === "ดำเนินการ").length})
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F7A4D]"></span> เสร็จสมบูรณ์ (
              {tasks.filter((t) => t.status === "เสร็จ").length})
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span> รอดำเนินการ (
              {tasks.filter((t) => t.status === "รอดำเนินการ").length})
            </span>
          </div>
          <div className="font-mono text-slate-400 text-[11px]">
            EGAT Operations Console • W10 Maintenance System
          </div>
        </div>
      </div>
    </div>
  )
}
