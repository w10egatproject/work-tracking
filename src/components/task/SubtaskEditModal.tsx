"use client"

import React from "react"
import { Subtask, TaskStatus } from "@/types"
import { Edit2, X, Calendar as CalendarIcon, Save } from "lucide-react"

interface SubtaskEditModalProps {
  editingSubtask: Subtask | null
  subtaskCategory: string
  setSubtaskCategory: (val: string) => void
  subtaskStart: string
  subtaskEnd: string
  subtaskDays: number
  editProgress: number
  setEditProgress: (val: number) => void
  editStatus: TaskStatus
  setEditStatus: (val: TaskStatus) => void
  isSavingSubtask: boolean
  calculateDayDifference: (startStr?: string, endStr?: string) => number
  getDerivedStatus: (progress: number) => TaskStatus
  onOpenCalendarPicker: (field: "subtask_start" | "subtask_end", title: string, currentVal?: string) => void
  onSave: (e: React.FormEvent) => void
  onClose: () => void
}

export default function SubtaskEditModal({
  editingSubtask,
  subtaskCategory,
  setSubtaskCategory,
  subtaskStart,
  subtaskEnd,
  editProgress,
  setEditProgress,
  editStatus,
  setEditStatus,
  isSavingSubtask,
  calculateDayDifference,
  getDerivedStatus,
  onOpenCalendarPicker,
  onSave,
  onClose,
}: SubtaskEditModalProps) {
  if (!editingSubtask) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-black/[0.08] animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-50 text-[#005B9A] flex items-center justify-center font-bold">
              <Edit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#1D1D1F]">แก้ไขรายละเอียดงานย่อย</h3>
              <p className="text-[11px] text-[#86868B]">ปรับเปลี่ยนชื่อ, วันที่เริ่ม-เสร็จ และความคืบหน้า</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#86868B] hover:text-[#1D1D1F] p-1.5 rounded-full hover:bg-[#F5F5F7] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3.5 text-xs">
          {/* ชื่องานย่อย */}
          <div>
            <label className="block font-semibold text-[#1D1D1F] mb-1">
              ชื่องานย่อย (Subtask Name) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subtaskCategory}
              onChange={(e) => setSubtaskCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-2xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-medium"
            />
          </div>

          {/* วันที่เริ่มงาน & วันที่แล้วเสร็จ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* วันที่เริ่ม */}
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                <span>วันที่เริ่มงาน <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-[#005B9A] font-medium">ปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("subtask_start", "เลือกวันที่เริ่มงานย่อย", subtaskStart)}
                className="w-full px-3 py-2 bg-[#F5F5F7] hover:bg-sky-50 border border-black/[0.06] hover:border-[#005B9A] rounded-2xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-semibold text-[#005B9A] truncate">{subtaskStart || "เลือกวันที่"}</span>
                <CalendarIcon className="w-3.5 h-3.5 text-[#005B9A] group-hover:scale-110 transition-transform shrink-0" />
              </div>
            </div>

            {/* วันที่แล้วเสร็จ */}
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                <span>วันที่แล้วเสร็จ <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-[#005B9A] font-medium">ปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("subtask_end", "เลือกวันที่แล้วเสร็จงานย่อย", subtaskEnd)}
                className="w-full px-3 py-2 bg-[#F5F5F7] hover:bg-sky-50 border border-black/[0.06] hover:border-[#005B9A] rounded-2xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-semibold text-[#005B9A] truncate">{subtaskEnd || "เลือกวันที่"}</span>
                <CalendarIcon className="w-3.5 h-3.5 text-[#005B9A] group-hover:scale-110 transition-transform shrink-0" />
              </div>
            </div>
          </div>

          {/* ระยะเวลาคำนวณอัตโนมัติ */}
          <div className="bg-[#FAFAFC] border border-black/[0.05] rounded-2xl p-2.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#1D1D1F]">จำนวนวันที่ใช้:</span>
            <span className="font-mono font-bold text-xs text-[#005B9A] bg-white border border-black/[0.06] px-3 py-0.5 rounded-xl shadow-2xs">
              {calculateDayDifference(subtaskStart, subtaskEnd)} วัน
            </span>
          </div>

          {/* ความคืบหน้า (%) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#1D1D1F]">ระบุความคืบหน้า (%):</label>
              <div className="flex items-center gap-1 bg-sky-50 border border-sky-200 rounded-full px-2.5 py-0.5 focus-within:ring-2 focus-within:ring-sky-200">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editProgress}
                  onChange={(e) => {
                    let val = Number(e.target.value)
                    if (isNaN(val)) val = 0
                    if (val > 100) val = 100
                    if (val < 0) val = 0
                    setEditProgress(val)
                    setEditStatus(getDerivedStatus(val))
                  }}
                  className="w-12 text-right text-xs font-bold text-[#005B9A] bg-transparent outline-none font-mono"
                />
                <span className="text-xs font-bold text-[#005B9A]">%</span>
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={editProgress}
              onChange={(e) => {
                const val = Number(e.target.value)
                setEditProgress(val)
                setEditStatus(getDerivedStatus(val))
              }}
              className="w-full accent-[#005B9A] cursor-pointer"
            />

            {/* Preset Pills */}
            <div className="grid grid-cols-5 gap-1 mt-1.5">
              {[0, 25, 50, 75, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setEditProgress(val)
                    setEditStatus(getDerivedStatus(val))
                  }}
                  className={`py-1 rounded-full text-[10px] font-medium border transition-colors cursor-pointer ${
                    editProgress === val
                      ? "bg-[#005B9A] text-white border-[#005B9A] shadow-xs"
                      : "bg-[#F5F5F7] text-[#1D1D1F] border-black/[0.05] hover:bg-[#E8E8ED]"
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* สถานะ Badge */}
          <div className="bg-[#FAFAFC] border border-black/[0.05] rounded-2xl p-2.5 flex items-center justify-between">
            <div className="text-[11px] font-medium text-[#86868B]">สถานะ:</div>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1 shadow-2xs ${
                editStatus === "เสร็จ"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : editStatus === "ดำเนินการ"
                  ? "bg-sky-50 text-[#005B9A] border-sky-200"
                  : editStatus === "รอดำเนินการ"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              <span>{editStatus === "เสร็จ" ? "✅" : editStatus === "ดำเนินการ" ? "⚙️" : editStatus === "รอดำเนินการ" ? "⏳" : "⚪"}</span>
              <span>{editStatus} ({editProgress}%)</span>
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#F5F5F7] text-[#1D1D1F] rounded-full text-xs font-medium hover:bg-[#E8E8ED] transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSavingSubtask}
              className="px-5 py-1.5 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-full text-xs font-medium shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingSubtask ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
