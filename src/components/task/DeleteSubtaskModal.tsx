"use client"

import React from "react"
import { Subtask } from "@/types"
import { Trash2, AlertTriangle, X } from "lucide-react"

interface DeleteSubtaskModalProps {
  isOpen: boolean
  subtask: Subtask | null
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function DeleteSubtaskModal({
  isOpen,
  subtask,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteSubtaskModalProps) {
  if (!isOpen || !subtask) return null

  return (
    <div
      className="fixed inset-0 bg-[#19211E]/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose()
      }}
    >
      <div className="bg-[#FAF8F5] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#DDD6C8] text-center space-y-4 animate-in zoom-in-95 duration-150 relative text-[#19211E]">
        {/* Close Button */}
        <button
          type="button"
          disabled={isDeleting}
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B7771] hover:text-[#19211E] p-1.5 rounded-full hover:bg-[#ECE7DC] cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-13 h-13 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 mx-auto shadow-2xs">
          <Trash2 className="w-6 h-6" />
        </div>

        {/* Modal Header & Title */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-sm text-[#19211E]">
            ยืนยันการลบแถวงานย่อย
          </h3>
          <p className="text-xs text-[#6B7771] leading-relaxed">
            คุณต้องการลบงานย่อยนี้ใช่หรือไม่?
          </p>
        </div>

        {/* Subtask Info Box */}
        <div className="bg-[#ECE7DC] border border-[#DDD6C8] rounded-2xl p-3 text-left space-y-1 text-xs">
          <div className="font-bold text-[#19211E] line-clamp-2">
            {subtask.category}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#6B7771]">
            <span>ช่วงเวลา: {subtask.start || "-"} ถึง {subtask.end || "-"}</span>
            <span>•</span>
            <span>{subtask.days || 1} วัน</span>
          </div>
        </div>

        {/* Sync Notice */}
        <p className="text-[11px] text-rose-800 bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 flex items-center justify-center gap-1.5 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-700" />
          <span>แถวนี้จะถูกลบออกจาก Google Sheets ด้วย</span>
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2.5 bg-[#ECE7DC] hover:bg-[#DDD6C8] text-[#19211E] font-bold rounded-xl text-xs flex-1 transition-all cursor-pointer disabled:opacity-50 border border-[#DDD6C8]"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 active:scale-95 text-white font-bold rounded-xl text-xs flex-1 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>กำลังลบ...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>ยืนยันลบ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
