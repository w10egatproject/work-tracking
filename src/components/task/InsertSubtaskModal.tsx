"use client"

import React from "react"
import { Subtask } from "@/types"
import { X, ArrowUpToLine, ArrowDownToLine, Calendar as CalendarIcon } from "lucide-react"

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
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-black/[0.08] animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <h3 className="font-semibold text-xs text-[#1D1D1F]">
              แทรกแถวงานย่อย ({insertPosition === "above" ? "ด้านบน" : "ด้านล่าง"})
            </h3>
            <p className="text-[11px] text-[#86868B] mt-0.5 line-clamp-1">
              อ้างอิง: <span className="font-semibold text-[#1D1D1F]">{targetSubtask.category}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#86868B] hover:text-[#1D1D1F] p-1 rounded-full hover:bg-[#F5F5F7] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-[#1D1D1F] mb-1.5">ตำแหน่งการแทรกแถว:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInsertPosition("above")}
                className={`py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  insertPosition === "above"
                    ? "bg-sky-50 text-[#005B9A] border-[#005B9A] ring-2 ring-sky-100"
                    : "bg-[#F5F5F7] text-[#6E6E73] border-black/[0.06] hover:bg-[#E8E8ED]"
                }`}
              >
                <ArrowUpToLine className="w-4 h-4 text-[#005B9A]" />
                <span>แทรกด้านบน</span>
              </button>
              <button
                type="button"
                onClick={() => setInsertPosition("below")}
                className={`py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  insertPosition === "below"
                    ? "bg-sky-50 text-[#005B9A] border-[#005B9A] ring-2 ring-sky-100"
                    : "bg-[#F5F5F7] text-[#6E6E73] border-black/[0.06] hover:bg-[#E8E8ED]"
                }`}
              >
                <ArrowDownToLine className="w-4 h-4 text-[#005B9A]" />
                <span>แทรกด้านล่าง</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1D1D1F] mb-1">
              ชื่องานที่ต้องทำ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={insertCategory}
              onChange={(e) => setInsertCategory(e.target.value)}
              placeholder="เช่น ตรวจสอบแนวเชื่อม NDT..."
              className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-2xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                <span>วันที่เริ่ม</span>
                <span className="text-[10px] text-[#005B9A] font-medium">ปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("insert_start", "เลือกวันที่เริ่มงาน", insertStart)}
                className="w-full px-3 py-2 bg-[#F5F5F7] hover:bg-sky-50 border border-black/[0.06] hover:border-[#005B9A] rounded-2xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-semibold text-[#005B9A] truncate">{insertStart || "เลือกวันที่"}</span>
                <CalendarIcon className="w-3.5 h-3.5 text-[#005B9A] group-hover:scale-110 transition-transform shrink-0" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1 flex items-center justify-between">
                <span>วันที่เสร็จ</span>
                <span className="text-[10px] text-[#005B9A] font-medium">ปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("insert_end", "เลือกวันที่แล้วเสร็จ", insertEnd)}
                className="w-full px-3 py-2 bg-[#F5F5F7] hover:bg-sky-50 border border-black/[0.06] hover:border-[#005B9A] rounded-2xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-semibold text-[#005B9A] truncate">{insertEnd || "เลือกวันที่"}</span>
                <CalendarIcon className="w-3.5 h-3.5 text-[#005B9A] group-hover:scale-110 transition-transform shrink-0" />
              </div>
            </div>
          </div>

          <div className="bg-[#FAFAFC] border border-black/[0.05] rounded-2xl p-2.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#1D1D1F]">จำนวนวันที่ใช้:</span>
            <span className="font-mono font-bold text-xs text-[#005B9A] bg-white border border-black/[0.06] px-3 py-0.5 rounded-xl shadow-2xs">
              {calculateDayDifference(insertStart, insertEnd)} วัน
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#F5F5F7] text-[#1D1D1F] rounded-full text-xs font-medium hover:bg-[#E8E8ED] transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isInsertingSubtask}
              className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-full text-xs font-medium shadow-xs cursor-pointer"
            >
              {isInsertingSubtask ? "กำลังเพิ่ม..." : "✓ บันทึกแทรกแถว"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
