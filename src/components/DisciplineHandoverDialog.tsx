"use client"

import { useState } from "react"
import { Task, DisciplineCode, DISCIPLINE_CONFIG } from "@/types"
import { ArrowRight, CheckCircle2, Clock, X, AlertCircle, Sparkles, Send } from "lucide-react"

interface Props {
  task: Task
  open: boolean
  onClose: () => void
  onSuccess: (updatedTask: Task) => void
}

export default function DisciplineHandoverDialog({ task, open, onClose, onSuccess }: Props) {
  const currentDiscipline = task.current_discipline || task.w_codes[0] || "W12"

  // Available next disciplines
  const remainingDisciplines = task.w_codes.filter((d) => d !== currentDiscipline)
  const [toDiscipline, setToDiscipline] = useState<DisciplineCode>(
    remainingDisciplines[0] || "W13"
  )
  const [handoverDate, setHandoverDate] = useState(
    new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
  )
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  const currentMeta = DISCIPLINE_CONFIG[currentDiscipline]
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
          fromDiscipline: currentDiscipline,
          toDiscipline,
          handoverDate,
          notes,
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

  return (
    <div
      className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-xl shadow-xs">
              🤝
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                <span>ส่งมอบงานให้หมวดถัดไป</span>
                <span className="text-amber-400 text-xs font-normal">(Discipline Handover)</span>
              </h2>
              <p className="text-xs text-slate-400">โอนย้ายความรับผิดชอบและเปลี่ยนสถานะระหว่างหมวดงาน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          {/* Stepper Handover Visual Flow */}
          <div className="bg-gradient-to-br from-slate-50 to-amber-50/40 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
            {/* From */}
            <div className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">หมวดผู้ส่งมอบ</div>
              <div className="text-xs font-bold text-slate-900 mt-1 flex items-center justify-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${currentMeta.barClass}`}></span>
                <span>{currentMeta.fullName}</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>เสร็จ 100%</span>
              </div>
            </div>

            <div className="p-2.5 rounded-full bg-amber-100 text-amber-900 flex-shrink-0 shadow-2xs">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* To */}
            <div className="flex-1 bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs text-center ring-2 ring-amber-400/20">
              <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">หมวดผู้รับมอบ</div>
              <div className="text-xs font-bold text-slate-900 mt-1 flex items-center justify-center gap-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    targetMeta ? targetMeta.barClass : "bg-slate-400"
                  }`}
                ></span>
                <span>{targetMeta ? targetMeta.fullName : toDiscipline}</span>
              </div>
              <div className="text-[11px] text-blue-600 font-bold mt-1 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                <span>เริ่มดำเนินการ</span>
              </div>
            </div>
          </div>

          {/* Select Target Discipline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              เลือกหมวดผู้รับมอบงาน <span className="text-red-500">*</span>
            </label>
            <select
              value={toDiscipline}
              onChange={(e) => setToDiscipline(e.target.value as DisciplineCode)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none"
            >
              {(["W11", "W12", "W13", "W14"] as DisciplineCode[]).map((code) => {
                const conf = DISCIPLINE_CONFIG[code]
                const isParticipating = task.w_codes.includes(code)
                return (
                  <option key={code} value={code} disabled={code === currentDiscipline}>
                    {conf.fullName} {isParticipating ? "(หมวดร่วมงานเดิม)" : "(หมวดใหม่)"}{" "}
                    {code === currentDiscipline ? "- หมวดปัจจุบัน" : ""}
                  </option>
                )
              })}
            </select>
          </div>

          {/* Handover Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              วันที่ส่งมอบงาน
            </label>
            <input
              type="text"
              value={handoverDate}
              onChange={(e) => setHandoverDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-amber-600 outline-none"
              placeholder="เช่น 1 ก.พ. 2026"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              หมายเหตุ / รายละเอียดการส่งมอบ
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น งานกลึงและตรวจสอบขนาดเสร็จสมบูรณ์แล้ว ส่งมอบชิ้นงานให้หมวดเชื่อมประกอบโครงสร้างต่อ..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-amber-600 outline-none resize-none"
            />
          </div>

          {/* Notice Card */}
          <div className="flex items-start gap-2.5 bg-blue-50/80 border border-blue-200 text-blue-900 p-3.5 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              เมื่อยืนยัน ระบบจะปรับสถานะหมวด <strong>{currentMeta.name}</strong> เป็น <strong>&quot;เสร็จ&quot; (100%)</strong> และส่งต่องานให้หมวด <strong>{targetMeta ? targetMeta.name : toDiscipline}</strong> เปลี่ยนเป็น <strong>&quot;ดำเนินการ&quot;</strong> ทันที
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 rounded-xl text-xs font-extrabold hover:from-amber-400 hover:to-orange-500 transition-all shadow-md shadow-amber-900/20 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "กำลังส่งมอบ..." : "✓ ยืนยันการส่งมอบงาน"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
