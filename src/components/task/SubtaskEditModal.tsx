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
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 animate-in zoom-in-95 duration-150 text-[#0F172A]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#005B9A] flex items-center justify-center font-bold border border-sky-100">
              <Edit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">แก้ไขรายละเอียดงานย่อย</h3>
              <p className="text-[11px] text-slate-500">ปรับเปลี่ยนชื่อ, วันที่เริ่ม-เสร็จ และความคืบหน้า</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3.5 text-xs text-[#0F172A]">
          {/* ชื่องานย่อย */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              ชื่องานย่อย (Subtask Name) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subtaskCategory}
              onChange={(e) => setSubtaskCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-medium"
            />
          </div>

          {/* วันที่เริ่มงาน & วันที่แล้วเสร็จ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* วันที่เริ่ม */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>วันที่เริ่มงาน <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-[#005B9A] font-bold">ปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("subtask_start", "เลือกวันที่เริ่มงานย่อย", subtaskStart)}
                className="w-full px-3 py-2 bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-[#005B9A] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-bold text-[#005B9A] truncate">{subtaskStart || "เลือกวันที่"}</span>
                <CalendarIcon className="w-3.5 h-3.5 text-[#005B9A] group-hover:scale-110 transition-transform shrink-0" />
              </div>
            </div>

            {/* วันที่แล้วเสร็จ */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>วันที่แล้วเสร็จ</span>
                <span className="text-[10px] text-[#005B9A] font-bold">ปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("subtask_end", "เลือกวันที่สิ้นสุดงานย่อย", subtaskEnd)}
                className="w-full px-3 py-2 bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-[#005B9A] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-bold text-[#005B9A] truncate">{subtaskEnd || "เลือกวันที่"}</span>
                <CalendarIcon className="w-3.5 h-3.5 text-[#005B9A] group-hover:scale-110 transition-transform shrink-0" />
              </div>
            </div>
          </div>

          {/* ระยะเวลาทำงาน คำนวณอัตโนมัติ */}
          <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-500">ระยะเวลาทำงาน:</span>
            <span className="font-mono font-bold text-[#005B9A]">
              {calculateDayDifference(subtaskStart, subtaskEnd)} วัน (คำนวณอัตโนมัติ)
            </span>
          </div>

          {/* ความคืบหน้า & สถานะ */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">
                ความคืบหน้า (Progress %)
              </label>
              <span className="font-mono font-bold text-sm text-[#005B9A]">
                {editProgress}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={editProgress}
              onChange={(e) => {
                const val = Number(e.target.value)
                setEditProgress(val)
                setEditStatus(getDerivedStatus(val))
              }}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#005B9A]"
            />

            {/* Quick Status Pill Bar */}
            <div className="flex items-center gap-1.5 pt-1">
              {[
                { label: "0% รอดำเนินการ", val: 0 },
                { label: "50% กำลังทำ", val: 50 },
                { label: "100% เสร็จ", val: 100 },
              ].map((pill) => (
                <button
                  key={pill.val}
                  type="button"
                  onClick={() => {
                    setEditProgress(pill.val)
                    setEditStatus(getDerivedStatus(pill.val))
                  }}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                    editProgress === pill.val
                      ? "bg-[#005B9A] text-white border-[#005B9A] shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSavingSubtask}
              className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingSubtask ? "กำลังบันทึก..." : "บันทึกงานย่อย"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
