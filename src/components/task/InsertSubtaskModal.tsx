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
      className="fixed inset-0 bg-[#19211E]/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-[#FAF8F5] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#DDD6C8] animate-in zoom-in-95 duration-150 text-[#19211E]">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDD6C8] mb-3">
          <div>
            <h3 className="font-bold text-xs text-[#19211E]">
              {targetSubtask.isHeader
                ? `เพิ่มงานย่อยในหมวด`
                : `แทรกแถวงานย่อย (${insertPosition === "above" ? "ด้านบน" : "ด้านล่าง"})`}
            </h3>
            <p className="text-[11px] text-[#C05621] font-bold mt-0.5 line-clamp-1">
              หมวดงาน: <span className="text-[#19211E]">{targetSubtask.category}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6B7771] hover:text-[#19211E] p-1 rounded-full hover:bg-[#ECE7DC] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3.5 text-xs text-[#19211E]">
          {!targetSubtask.isHeader && (
            <div>
              <label className="block font-bold text-[#19211E] mb-1.5">ตำแหน่งการแทรกแถว:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInsertPosition("above")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    insertPosition === "above"
                      ? "bg-[#19211E] text-[#FAF8F5] border-[#19211E] shadow-2xs"
                      : "bg-white text-[#434E49] border-[#DDD6C8] hover:bg-[#ECE7DC]"
                  }`}
                >
                  <ArrowUpToLine className="w-4 h-4" />
                  <span>แทรกด้านบน</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInsertPosition("below")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    insertPosition === "below"
                      ? "bg-[#19211E] text-[#FAF8F5] border-[#19211E] shadow-2xs"
                      : "bg-white text-[#434E49] border-[#DDD6C8] hover:bg-[#ECE7DC]"
                  }`}
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>แทรกด้านล่าง</span>
                </button>
              </div>
            </div>
          )}

          {/* รายการงานย่อย */}
          <div>
            <label className="block font-bold text-[#19211E] mb-1">
              ชื่องานย่อย (Subtask Name) <span className="text-[#C05621]">*</span>
            </label>
            <input
              type="text"
              required
              value={insertCategory}
              onChange={(e) => setInsertCategory(e.target.value)}
              placeholder="เช่น งานประกอบและเชื่อมชิ้นงาน..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6C8] rounded-xl text-xs outline-none focus:bg-white focus:border-[#19211E] font-medium"
            />
          </div>

          {/* วันที่เริ่ม & วันที่เสร็จ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#19211E] mb-1 flex items-center justify-between">
                <span>วันที่เริ่มงาน <span className="text-[#C05621]">*</span></span>
                <span className="text-[10px] text-[#C05621] font-medium">ปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("insert_start", "เลือกวันที่เริ่มงานย่อย", insertStart)}
                className="w-full px-3 py-2 bg-white hover:bg-[#ECE7DC]/60 border border-[#DDD6C8] hover:border-[#19211E] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-semibold text-[#19211E] truncate">{insertStart || "เลือกวันที่"}</span>
                <CalendarIcon className="w-3.5 h-3.5 text-[#19211E] group-hover:scale-110 transition-transform shrink-0" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#19211E] mb-1 flex items-center justify-between">
                <span>วันที่แล้วเสร็จ</span>
                <span className="text-[10px] text-[#C05621] font-medium">ปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("insert_end", "เลือกวันที่สิ้นสุดงานย่อย", insertEnd)}
                className="w-full px-3 py-2 bg-white hover:bg-[#ECE7DC]/60 border border-[#DDD6C8] hover:border-[#19211E] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-semibold text-[#19211E] truncate">{insertEnd || "เลือกวันที่"}</span>
                <CalendarIcon className="w-3.5 h-3.5 text-[#19211E] group-hover:scale-110 transition-transform shrink-0" />
              </div>
            </div>
          </div>

          {/* คำนวณวัน */}
          <div className="bg-[#ECE7DC] border border-[#DDD6C8] p-2.5 rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#6B7771]">ระยะเวลาทำงาน:</span>
            <span className="font-mono font-bold text-[#19211E]">
              {calculateDayDifference(insertStart, insertEnd)} วัน (คำนวณอัตโนมัติ)
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DDD6C8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ECE7DC] text-[#19211E] border border-[#DDD6C8] rounded-xl text-xs font-bold hover:bg-[#DDD6C8] transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isInsertingSubtask}
              className="px-5 py-2 bg-[#19211E] hover:bg-[#2C3732] text-[#FAF8F5] rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer border border-[#19211E]"
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
