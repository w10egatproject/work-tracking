"use client"

import { useState } from "react"
import { Task, DisciplineCode, DISCIPLINE_CONFIG } from "@/types"
import { ArrowRight, CheckCircle2, Clock, X, AlertCircle, Send } from "lucide-react"

interface Props {
  task: Task
  open: boolean
  onClose: () => void
  onSuccess: (updatedTask: Task) => void
}

export default function DisciplineHandoverDialog({ task, open, onClose, onSuccess }: Props) {
  const initialCurrent = task.current_discipline || task.w_codes[0] || "W11"
  const [fromDiscipline, setFromDiscipline] = useState<DisciplineCode>(initialCurrent)
  const [toDiscipline, setToDiscipline] = useState<DisciplineCode>(
    task.w_codes.find((d) => d !== initialCurrent) || "W12"
  )
  const [byUser, setByUser] = useState("")
  const [handoverDate, setHandoverDate] = useState(
    new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
  )
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  const fromMeta = DISCIPLINE_CONFIG[fromDiscipline]
  const targetMeta = DISCIPLINE_CONFIG[toDiscipline]

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "handover",
          fromDiscipline,
          toDiscipline,
          handoverDate,
          notes,
          byUser: byUser.trim(),
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        onSuccess(updated)
      } else {
        onSuccess({
          ...task,
          current_discipline: toDiscipline,
          status: "ดำเนินการ",
        })
      }
    } catch (e) {
      onSuccess({
        ...task,
        current_discipline: toDiscipline,
        status: "ดำเนินการ",
      })
    } finally {
      setSubmitting(false)
      onClose()
    }
  }

  const allDisciplines: DisciplineCode[] = ["W11", "W12", "W13", "W14"]

  return (
    <div
      className="fixed inset-0 bg-[#19211E]/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-[#FAF8F5] rounded-2xl w-full max-w-lg shadow-2xl border border-[#DDD6C8] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#19211E] text-[#FAF8F5] px-6 py-4 flex items-center justify-between border-b border-[#2C3732]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2C3732] border border-[#DDD6C8]/30 flex items-center justify-center text-lg shadow-xs">
              🤝
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                <span>ส่งมอบงานให้หมวดถัดไป</span>
                <span className="text-[#C05621] text-xs font-normal">(Discipline Handover)</span>
              </h2>
              <p className="text-xs text-[#98A39E]">โอนย้ายงานและบันทึกประวัติการส่งมอบลงแผ่นงาน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#98A39E] hover:text-[#FAF8F5] p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="p-6 space-y-4 text-xs text-[#19211E]">
          {/* Handover Direction Graphic Box */}
          <div className="bg-white border border-[#DDD6C8] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
            {/* From */}
            <div className="flex-1 text-center">
              <span className="text-[10px] font-semibold text-[#6B7771] block mb-1">หมวดผู้ส่งมอบ (ปัจจุบัน)</span>
              <div className="inline-flex items-center gap-1.5 bg-[#ECE7DC] border border-[#DDD6C8] text-[#19211E] font-bold px-3 py-1.5 rounded-xl font-mono text-xs">
                <span>{fromMeta?.num || fromDiscipline}</span>
                <span className="font-sans font-medium text-[11px]">{fromMeta?.fullName?.replace(`หมวด `, "")}</span>
              </div>
            </div>

            <div className="flex flex-col items-center shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#19211E] text-[#FAF8F5] flex items-center justify-center shadow-xs">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* To */}
            <div className="flex-1 text-center">
              <span className="text-[10px] font-semibold text-[#6B7771] block mb-1">ส่งมอบให้หมวด (ปลายทาง)</span>
              <div className="inline-flex items-center gap-1.5 bg-[#FDF2EC] border border-[#F7CEB9] text-[#C05621] font-bold px-3 py-1.5 rounded-xl font-mono text-xs shadow-2xs">
                <span>{targetMeta?.num || toDiscipline}</span>
                <span className="font-sans font-medium text-[11px]">{targetMeta?.fullName?.replace(`หมวด `, "")}</span>
              </div>
            </div>
          </div>

          {/* Select From & To Disciplines */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-[#19211E] mb-1">
                หมวดผู้ส่งมอบงาน
              </label>
              <select
                value={fromDiscipline}
                onChange={(e) => setFromDiscipline(e.target.value as DisciplineCode)}
                className="w-full px-3 py-2 bg-white border border-[#DDD6C8] rounded-xl text-xs font-semibold text-[#19211E] focus:border-[#19211E] outline-none cursor-pointer"
              >
                {allDisciplines.map((code) => {
                  const conf = DISCIPLINE_CONFIG[code]
                  return (
                    <option key={code} value={code}>
                      {conf ? `${conf.num} (${conf.fullName})` : code}
                    </option>
                  )
                })}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#19211E] mb-1">
                หมวดผู้รับมอบงาน <span className="text-[#C05621]">*</span>
              </label>
              <select
                value={toDiscipline}
                onChange={(e) => setToDiscipline(e.target.value as DisciplineCode)}
                className="w-full px-3 py-2 bg-white border border-[#DDD6C8] rounded-xl text-xs font-bold text-[#C05621] focus:border-[#19211E] outline-none cursor-pointer"
              >
                {allDisciplines
                  .filter((d) => d !== fromDiscipline)
                  .map((code) => {
                    const conf = DISCIPLINE_CONFIG[code]
                    return (
                      <option key={code} value={code}>
                        {conf ? `${conf.num} (${conf.fullName})` : code}
                      </option>
                    )
                  })}
              </select>
            </div>
          </div>

          {/* Submitter Name & Date */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-[#19211E] mb-1">
                ชื่อผู้ส่งมอบงาน
              </label>
              <input
                type="text"
                value={byUser}
                onChange={(e) => setByUser(e.target.value)}
                placeholder="เช่น นายช่างสมศักดิ์"
                className="w-full px-3.5 py-2 bg-white border border-[#DDD6C8] rounded-xl text-xs text-[#19211E] focus:border-[#19211E] outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#19211E] mb-1">
                วันที่ส่งมอบ
              </label>
              <input
                type="text"
                value={handoverDate}
                onChange={(e) => setHandoverDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#DDD6C8] rounded-xl text-xs text-[#19211E] font-mono focus:border-[#19211E] outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-[#19211E] mb-1">
              บันทึกข้อความ / รายละเอียดการส่งมอบ
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ระบุความคืบหน้าที่ทำเสร็จ หรือสิ่งที่หมวดถัดไปต้องดำเนินการต่อ..."
              className="w-full px-3.5 py-2 bg-white border border-[#DDD6C8] rounded-xl text-xs text-[#19211E] focus:border-[#19211E] outline-none resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DDD6C8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ECE7DC] text-[#19211E] border border-[#DDD6C8] rounded-xl text-xs font-bold hover:bg-[#DDD6C8] transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-[#19211E] hover:bg-[#2C3732] text-[#FAF8F5] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer border border-[#19211E]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "กำลังส่งมอบ..." : "ยืนยันส่งมอบงาน"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
