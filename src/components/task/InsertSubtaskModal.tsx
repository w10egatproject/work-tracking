"use client"

import React from "react"
import { Subtask } from "@/types"
import { X, ArrowUpToLine, ArrowDownToLine, Calendar as CalendarIcon, Plus } from "lucide-react"

interface InsertSubtaskModalProps {
  isOpen: boolean
  targetSubtask: Subtask | null
  insertPosition: "above" | "below"
  setInsertPosition: (pos: "above" | "below") => void
  insertCategory: string
  setInsertCategory: (val: string) => void
  insertStart: string
  insertEnd: string
  isInsertingSubtask: boolean
  calculateDayDifference: (startStr?: string, endStr?: string) => number
  onOpenCalendarPicker: (field: "insert_start" | "insert_end", title: string, currentVal?: string) => void
  onSave: (e: React.FormEvent) => void
  onClose: () => void
}

export default function InsertSubtaskModal({
  isOpen,
  targetSubtask,
  insertPosition,
  setInsertPosition,
  insertCategory,
  setInsertCategory,
  insertStart,
  insertEnd,
  isInsertingSubtask,
  calculateDayDifference,
  onOpenCalendarPicker,
  onSave,
  onClose,
}: InsertSubtaskModalProps) {
  if (!isOpen || !targetSubtask) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 animate-in zoom-in-95 duration-150 text-[#0F172A]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <h3 className="font-bold text-xs text-[#0F172A]">
              {targetSubtask.isHeader
                ? `เพิ่มงานย่อยในหมวด`
                : `แทรกแถวงานย่อย (${insertPosition === "above" ? "ด้านบน" : "ด้านล่าง"})`}
            </h3>
            <p className="text-[11px] text-[#005B9A] font-bold mt-0.5 line-clamp-1">
              หมวดงาน: <span className="text-[#0F172A]">{targetSubtask.category}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3.5 text-xs text-[#0F172A]">
          {!targetSubtask.isHeader && (
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">ตำแหน่งการแทรกแถว:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInsertPosition("above")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    insertPosition === "above"
                      ? "bg-sky-50 text-[#005B9A] border-[#005B9A] shadow-2xs"
                      : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  <ArrowUpToLine className="w-4 h-4 text-[#005B9A]" />
                  <span>แทรกด้านบน</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInsertPosition("below")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    insertPosition === "below"
                      ? "bg-sky-50 text-[#005B9A] border-[#005B9A] shadow-2xs"
                      : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  <ArrowDownToLine className="w-4 h-4 text-[#005B9A]" />
                  <span>แทรกด้านล่าง</span>
                </button>
              </div>
            </div>
          )}

          {/* รายการงานย่อย */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              ชื่องานย่อย (Subtask Name) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={insertCategory}
              onChange={(e) => setInsertCategory(e.target.value)}
              placeholder="เช่น งานประกอบและเชื่อมชิ้นงาน..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-medium"
            />
          </div>

          {/* วันที่เริ่ม & วันที่เสร็จ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>วันที่เริ่มงาน <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-[#005B9A] font-bold">ปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("insert_start", "เลือกวันที่เริ่มงานย่อย", insertStart)}
                className="w-full px-3 py-2 bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-[#005B9A] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-bold text-[#005B9A] truncate">{insertStart || "เลือกวันที่"}</span>
                <CalendarIcon className="w-3.5 h-3.5 text-[#005B9A] group-hover:scale-110 transition-transform shrink-0" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>วันที่แล้วเสร็จ</span>
                <span className="text-[10px] text-[#005B9A] font-bold">ปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("insert_end", "เลือกวันที่สิ้นสุดงานย่อย", insertEnd)}
                className="w-full px-3 py-2 bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-[#005B9A] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-bold text-[#005B9A] truncate">{insertEnd || "เลือกวันที่"}</span>
                <CalendarIcon className="w-3.5 h-3.5 text-[#005B9A] group-hover:scale-110 transition-transform shrink-0" />
              </div>
            </div>
          </div>

          {/* คำนวณวัน */}
          <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-500">ระยะเวลาทำงาน:</span>
            <span className="font-mono font-bold text-[#005B9A]">
              {calculateDayDifference(insertStart, insertEnd)} วัน (คำนวณอัตโนมัติ)
            </span>
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
              disabled={isInsertingSubtask}
              className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isInsertingSubtask ? "กำลังบันทึก..." : "แทรกแถวงานย่อย"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
