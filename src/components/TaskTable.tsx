"use client"

import { useState, useEffect } from "react"
import { Task, DISCIPLINE_CONFIG } from "@/types"
import { ExternalLink, ChevronRight, Wrench, Calendar, Trash2, CheckCircle2 } from "lucide-react"
import DeleteTaskModal from "./DeleteTaskModal"

interface Props {
  tasks: Task[]
  onDeleteTask?: (taskId: string) => void
}

export default function TaskTable({ tasks, onDeleteTask }: Props) {
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const handleConfirmDelete = async () => {
    if (!deletingTask) return
    const targetId = deletingTask.id
    const taskTitle = deletingTask.title
    const taskNo = deletingTask.taskNo || `งานที่${deletingTask.id}`

    // Close modal and remove from table immediately
    setDeletingTask(null)
    onDeleteTask?.(targetId)
    setToastMessage(`ลบใบสั่งงาน "${taskNo}: ${taskTitle}" สำเร็จเรียบร้อย`)

    try {
      await fetch(`/api/tasks/${encodeURIComponent(targetId)}`, {
        method: "DELETE",
      })
    } catch (err) {
      console.error("Failed to delete task in backend:", err)
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="py-16 text-center bg-[#FAF8F5] rounded-2xl border border-[#DDD6C8] shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#ECE7DC] text-[#19211E] flex items-center justify-center mx-auto mb-3 text-lg border border-[#DDD6C8]">
          🔍
        </div>
        <div className="text-[#19211E] font-bold text-sm">ไม่พบงานที่ตรงกับเงื่อนไขการค้นหา/ตัวกรอง</div>
        <div className="text-[#6B7771] text-xs mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดงานอื่น</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* 📋 Prom Design Industrial Ledger Master Table */}
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#DDD6C8] shadow-[0_2px_12px_rgba(25,33,30,0.04)] overflow-hidden">
        {/* Table Subheader Bar */}
        <div className="bg-[#ECE7DC] border-b border-[#DDD6C8] px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#19211E]"></span>
            <span className="text-xs font-bold text-[#19211E] tracking-tight">
              ตารางรายการงานซ่อมบำรุง (Operational Master Ledger)
            </span>
            <span className="text-[11px] font-bold text-[#19211E] bg-[#FAF8F5] border border-[#DDD6C8] px-2.5 py-0.5 rounded-full font-mono">
              {tasks.length} รายการ
            </span>
          </div>
          <div className="text-xs text-[#6B7771] font-medium hidden sm:block">
            คลิกที่แถวหรือปุ่มเปิดดูเพื่อเข้าสู่บันทึกความคืบหน้า
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-[#19211E]">
            <thead>
              <tr className="bg-[#ECE7DC]/60 border-b border-[#DDD6C8] text-[11px] font-bold uppercase tracking-wider text-[#6B7771]">
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
            <tbody className="divide-y divide-[#DDD6C8]/60 text-xs font-normal">
              {tasks.map((task, index) => {
                const isEven = index % 2 === 0

                return (
                  <tr
                    key={task.id}
                    className={`transition-colors duration-150 hover:bg-[#ECE7DC]/80 group ${
                      isEven ? "bg-[#FAF8F5]" : "bg-[#F5F2EB]/50"
                    }`}
                  >
                    {/* ลำดับงาน */}
                    <td className="py-3 px-4 text-center font-bold">
                      <span className="inline-block bg-[#ECE7DC] text-[#19211E] border border-[#DDD6C8] px-2 py-0.5 rounded-md font-mono text-[11px] group-hover:bg-[#19211E] group-hover:text-[#FAF8F5] transition-colors">
                        {task.taskNo || `งานที่${task.id}`}
                      </span>
                    </td>

                    {/* ชื่องาน */}
                    <td className="py-3 px-4 font-semibold text-[#19211E]">
                      <a
                        href={`/task/${task.id}`}
                        className="text-[#19211E] group-hover:text-[#C05621] transition-colors line-clamp-1 hover:underline flex items-center gap-1.5"
                        title={task.title}
                      >
                        <span>{task.title}</span>
                      </a>
                    </td>

                    {/* W/O */}
                    <td className="py-3 px-3.5 text-center font-mono font-bold">
                      <span className="inline-block bg-[#FAF8F5] border border-[#DDD6C8] text-[#19211E] px-2 py-0.5 rounded-md text-[11px]">
                        {task.wo || "-"}
                      </span>
                    </td>

                    {/* วันที่เริ่มงาน */}
                    <td className="py-3 px-3.5 text-center text-[#6B7771] whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-[11px] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#DDD6C8]">
                        <Calendar className="w-3 h-3 text-[#6B7771]" />
                        <span>{task.report_date || "-"}</span>
                      </div>
                    </td>

                    {/* วันที่สิ้นสุด */}
                    <td className="py-3 px-3.5 text-center text-[#19211E] whitespace-nowrap font-medium">
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
                          <span className="text-[#6B7771] font-mono text-[11px]">
                            {task.completion_codes || "-"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* อุปกรณ์ (Equip) */}
                    <td className="py-3 px-4 text-[#434E49]">
                      {task.equip ? (
                        <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#DDD6C8] px-2.5 py-1 rounded-md max-w-[220px]">
                          <Wrench className="w-3 h-3 text-[#6B7771] shrink-0" />
                          <span className="truncate font-medium text-[11px]" title={task.equip}>
                            {task.equip}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#98A39E] font-mono">-</span>
                      )}
                    </td>

                    {/* ลิ้งค์ Google Sheets */}
                    <td className="py-3 px-3 text-center">
                      {task.link ? (
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#19211E] hover:text-[#C05621] bg-[#FAF8F5] hover:bg-[#ECE7DC] border border-[#DDD6C8] px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all shadow-2xs"
                          title="เปิดใน Google Sheets"
                        >
                          <span>เปิดชีท</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-[#98A39E]">-</span>
                      )}
                    </td>

                    {/* ปุ่มการจัดการ */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <a
                          href={`/task/${task.id}`}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-[#19211E] hover:bg-[#2C3732] text-[#FAF8F5] rounded-xl text-xs font-semibold transition-all duration-150 shadow-2xs group/btn active:scale-95 whitespace-nowrap shrink-0 border border-[#19211E]"
                          title="เปิดดูบันทึกความคืบหน้า"
                        >
                          <span>เปิดดู</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setDeletingTask(task)}
                          className="inline-flex items-center justify-center p-1.5 text-[#6B7771] hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-300 rounded-xl transition-all duration-150 cursor-pointer active:scale-95 shrink-0"
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
        <div className="bg-[#ECE7DC] border-t border-[#DDD6C8] px-4 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#434E49]">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#C05621]"></span> ดำเนินการ (
              {tasks.filter((t) => t.status === "ดำเนินการ").length})
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#1B5E3B]"></span> เสร็จสมบูรณ์ (
              {tasks.filter((t) => t.status === "เสร็จ").length})
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#B45309]"></span> รอดำเนินการ (
              {tasks.filter((t) => t.status === "รอดำเนินการ").length})
            </span>
          </div>
          <div className="font-mono text-[#6B7771] text-[11px]">
            กฟผ. แม่เมาะ W10 • EGAT Operations Ledger
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-6 z-50 bg-[#19211E] text-[#FAF8F5] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-[#DDD6C8] animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-6 h-6 rounded-lg bg-[#E8F4EC] text-[#1B5E3B] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}
    </div>
  )
}
