"use client"

import { useState } from "react"
import { Task, DISCIPLINE_STEPS, DisciplineCode } from "@/types"
import { Send, AlertCircle, CheckCircle2, X } from "lucide-react"

interface Props {
  task: Task
  open: boolean
  onClose: () => void
  onSuccess: (updatedTask: Task) => void
}

export default function DisciplineHandoverDialog({
  task,
  open,
  onClose,
  onSuccess,
}: Props) {
  const currentDiscipline = task.currentDiscipline || task.w_codes?.[0] || "W11"
  const [toDiscipline, setToDiscipline] = useState<DisciplineCode>("W12")
  const [byUser, setByUser] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!open) return null

  const handleHandover = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "handover",
          fromDiscipline: currentDiscipline,
          toDiscipline,
          byUser: byUser || "ผู้ประสานงาน",
          notes: notes || "",
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "ส่งมอบงานไม่สำเร็จ")
      }

      const updated = await res.json()
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onSuccess(updated)
        onClose()
      }, 1000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งมอบ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose()
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 animate-in zoom-in-95 duration-150 text-[#0F172A]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#005B9A] flex items-center justify-center font-bold border border-sky-100">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">
                ส่งมอบงานระหว่างหมวด (Handover)
              </h3>
              <p className="text-[11px] text-slate-500">
                โอนย้ายความรับผิดชอบและบันทึกประวัติ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs mb-3.5 border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs mb-3.5 border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>ส่งมอบงานเรียบร้อยแล้ว</span>
          </div>
        )}

        <form onSubmit={handleHandover} className="space-y-4 text-xs">
          {/* Handover Direction Visualizer */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">หมวดปัจจุบัน</span>
              <span className="px-3 py-1 bg-white border border-slate-200 text-[#005B9A] font-bold rounded-lg font-mono text-xs shadow-2xs">
                {currentDiscipline}
              </span>
            </div>

            <div className="text-slate-300 font-bold text-sm">➔</div>

            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">หมวดผู้รับมอบ</span>
              <select
                value={toDiscipline}
                onChange={(e) => setToDiscipline(e.target.value as DisciplineCode)}
                className="px-3 py-1 bg-white border border-[#005B9A] text-[#005B9A] font-bold rounded-lg font-mono text-xs shadow-2xs outline-none cursor-pointer"
              >
                {DISCIPLINE_STEPS.map((step) => (
                  <option key={step.code} value={step.code}>
                    {step.num} ({step.fullName.split(" ")[1] || step.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ผู้ส่งมอบ */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              ชื่อผู้ส่งมอบ / ผู้บันทึก <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={byUser}
              onChange={(e) => setByUser(e.target.value)}
              placeholder="เช่น นายช่างสมศักดิ์..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-medium"
            />
          </div>

          {/* หมายเหตุ */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              หมายเหตุ / รายละเอียดการส่งมอบ
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ระบุความเรียบร้อยของหน้างานหรือข้อควรระวัง..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-medium resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? "กำลังส่งมอบ..." : "ยืนยันส่งมอบงาน"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
