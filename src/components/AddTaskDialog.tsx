"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddTaskDialog({ isOpen, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("")
  const [wo, setWo] = useState("")
  const [reportDate, setReportDate] = useState(
    new Date().toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  )
  const [equip, setEquip] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          wo,
          report_date: reportDate,
          equip,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create task")
      }

      onSuccess()
      onClose()
      setTitle("")
      setWo("")
      setEquip("")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
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
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">
                สร้างใบสั่งงานใหม่
              </h3>
              <p className="text-[11px] text-slate-500">
                เพิ่มแผ่นงานใหม่ในระบบและ Google Sheets
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
          <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs mb-3.5 border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* ชื่องาน */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              ชื่องาน / รายละเอียด <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น งานตรวจเช็ค Sump 2SW..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] text-[#0F172A] font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* เลข W/O */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                เลข Work Order (W/O)
              </label>
              <input
                type="text"
                value={wo}
                onChange={(e) => setWo(e.target.value)}
                placeholder="เช่น 4132222"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-mono text-[#005B9A] font-bold"
              />
            </div>

            {/* วันที่เริ่มงาน */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                วันที่เริ่มงาน
              </label>
              <input
                type="text"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                placeholder="เช่น 2 ก.ย. 2569"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-medium"
              />
            </div>
          </div>

          {/* อุปกรณ์ */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              อุปกรณ์ / เครื่องจักร (Equip)
            </label>
            <input
              type="text"
              value={equip}
              onChange={(e) => setEquip(e.target.value)}
              placeholder="เช่น Sump 2SW, Motor 3.3kV"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-medium"
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
              disabled={loading}
              className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{loading ? "กำลังบันทึก..." : "สร้างแผ่นงาน"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
