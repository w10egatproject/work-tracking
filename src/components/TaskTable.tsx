"use client"

import { useState } from "react"
import { Task, DISCIPLINE_CONFIG } from "@/types"
import { ExternalLink, ChevronRight, Wrench, Calendar, Trash2 } from "lucide-react"
import DeleteTaskModal from "./DeleteTaskModal"

interface Props {
  tasks: Task[]
  onDeleteTask?: (taskId: string) => void
}

export default function TaskTable({ tasks, onDeleteTask }: Props) {
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    if (!deletingTask) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/tasks/${deletingTask.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        onDeleteTask?.(deletingTask.id)
        setDeletingTask(null)
      }
    } catch (err) {
      console.error("Failed to delete task:", err)
    } finally {
      setIsDeleting(false)
    }
  }
  if (tasks.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#005B9A] flex items-center justify-center mx-auto mb-3 text-xl">
          🔍
        </div>
        <div className="text-[#0F172A] font-bold text-sm">ไม่พบงานที่ตรงกับเงื่อนไขการค้นหา/ตัวกรอง</div>
        <div className="text-slate-400 text-xs mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดงานอื่น</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Sleek High-Density Operational Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] overflow-hidden">
        {/* Table Subheader Bar */}
        <div className="bg-gradient-to-r from-[#F8FAFC] to-white border-b border-slate-200/80 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#005B9A] ring-4 ring-sky-100"></span>
            <span className="text-xs font-bold text-[#0F172A] tracking-tight">
              ตารางรายการงานซ่อมบำรุง (Operational Master Data)
            </span>
            <span className="text-[11px] font-bold text-[#005B9A] bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-full font-mono">
              {tasks.length} รายการ
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            คลิกที่แถวหรือปุ่มเปิดดูเพื่อเข้าสู่บันทึกความคืบหน้า
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-slate-700">
            <thead>
              <tr className="bg-[#F8FAFC]/90 backdrop-blur-xs border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4 w-24 text-center font-mono">ลำดับ</th>
                <th className="py-3 px-4 min-w-[280px]">รายการ / ชื่องานซ่อมบำรุง</th>
                <th className="py-3 px-3.5 w-28 text-center font-mono">เลข W/O</th>
                <th className="py-3 px-3.5 w-28 text-center">วันที่เริ่ม</th>
                <th className="py-3 px-3.5 w-28 text-center">กำหนดเสร็จ</th>
                <th className="py-3 px-3.5 w-36 text-center">หมวดร่วมงาน</th>
                <th className="py-3 px-4 min-w-[180px]">อุปกรณ์ (Equip)</th>
                <th className="py-3 px-3 w-24 text-center">แผ่นงาน</th>
                <th className="py-3 px-4 w-36 min-w-[130px] text-right whitespace-nowrap">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90 text-xs font-normal">
              {tasks.map((task, index) => {
                const isEven = index % 2 === 0

                return (
                  <tr
                    key={task.id}
                    className={`transition-colors duration-150 hover:bg-sky-50/40 group ${
                      isEven ? "bg-white" : "bg-[#F8FAFC]/40"
                    }`}
                  >
                    {/* ลำดับงาน */}
                    <td className="py-3 px-4 text-center font-bold">
                      <span className="inline-block bg-slate-100/80 text-slate-600 border border-slate-200/80 px-2 py-0.5 rounded-md font-mono text-[11px] group-hover:bg-sky-100/70 group-hover:text-[#005B9A] group-hover:border-sky-200 transition-colors">
                        {task.taskNo || `งานที่${task.id}`}
                      </span>
                    </td>

                    {/* ชื่องาน */}
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">
                      <a
                        href={`/task/${task.id}`}
                        className="text-[#0F172A] group-hover:text-[#005B9A] transition-colors line-clamp-1 hover:underline flex items-center gap-1.5"
                        title={task.title}
                      >
                        <span>{task.title}</span>
                      </a>
                    </td>

                    {/* W/O */}
                    <td className="py-3 px-3.5 text-center font-mono font-bold">
                      <span className="inline-block bg-sky-50/80 border border-sky-200 text-[#005B9A] px-2 py-0.5 rounded-lg text-[11px]">
                        {task.wo || "-"}
                      </span>
                    </td>

                    {/* วันที่เริ่มงาน */}
                    <td className="py-3 px-3.5 text-center text-slate-500 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-[11px] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/70">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{task.report_date || "-"}</span>
                      </div>
                    </td>

                    {/* วันที่สิ้นสุด */}
                    <td className="py-3 px-3.5 text-center text-slate-600 whitespace-nowrap font-medium">
                      <span className="text-[11px]">{task.completion_date || "-"}</span>
                    </td>

                    {/* หมวดที่ร่วมงาน */}
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {task.w_codes && task.w_codes.length > 0 ? (
                          task.w_codes.map((w) => {
                            const conf = DISCIPLINE_CONFIG[w]
                            if (!conf) return null
                            return (
                              <span
                                key={w}
                                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border transition-transform hover:scale-105 ${conf.badgeClass}`}
                                title={conf.fullName}
                              >
                                {conf.num}
                              </span>
                            )
                          })
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">
                            {task.completion_codes || "-"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* อุปกรณ์ (Equip) */}
                    <td className="py-3 px-4 text-slate-600">
                      {task.equip ? (
                        <div className="flex items-center gap-1.5 bg-slate-50/80 border border-slate-200/70 px-2.5 py-1 rounded-lg max-w-[220px]">
                          <Wrench className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate font-medium text-[11px]" title={task.equip}>
                            {task.equip}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300 font-mono">-</span>
                      )}
                    </td>

                    {/* ลิ้งค์ Google Sheets */}
                    <td className="py-3 px-3 text-center">
                      {task.link ? (
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#005B9A] hover:text-[#004A7D] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all shadow-2xs"
                          title="เปิดใน Google Sheets"
                        >
                          <span>เปิดชีท</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* ปุ่มการจัดการ - Refined Actions with Delete */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <a
                          href={`/task/${task.id}`}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-sky-50 hover:bg-[#005B9A] text-[#005B9A] hover:text-white border border-sky-200/80 hover:border-transparent rounded-xl text-xs font-semibold transition-all duration-150 shadow-2xs group/btn active:scale-95 whitespace-nowrap shrink-0"
                          title="เปิดดูบันทึกความคืบหน้า"
                        >
                          <span>เปิดดู</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setDeletingTask(task)}
                          className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 shrink-0"
                          title="ลบใบสั่งงานนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Status Summary Bar */}
        <div className="bg-[#F8FAFC] border-t border-slate-200/80 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#005B9A]"></span> ดำเนินการ (
              {tasks.filter((t) => t.status === "ดำเนินการ").length})
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> เสร็จสมบูรณ์ (
              {tasks.filter((t) => t.status === "เสร็จ").length})
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> รอดำเนินการ (
              {tasks.filter((t) => t.status === "รอดำเนินการ").length})
            </span>
          </div>
          <div className="font-mono text-slate-400 text-[11px]">
            กฟผ. แม่เมาะ W10 • EGAT Operations Console Pro
          </div>
        </div>
      </div>

      {/* Delete Task Confirmation Modal */}
      <DeleteTaskModal
        isOpen={!!deletingTask}
        task={deletingTask}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingTask(null)}
      />
    </div>
  )
}
