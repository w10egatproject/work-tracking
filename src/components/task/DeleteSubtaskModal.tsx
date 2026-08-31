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
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose()
      }}
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-black/[0.08] text-center space-y-4 animate-in zoom-in-95 duration-150 relative">
        {/* Close Button */}
        <button
          type="button"
          disabled={isDeleting}
          onClick={onClose}
          className="absolute top-4 right-4 text-[#86868B] hover:text-[#1D1D1F] p-1.5 rounded-full hover:bg-[#F5F5F7] cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-13 h-13 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto shadow-2xs">
          <Trash2 className="w-6 h-6" />
        </div>

        {/* Modal Header & Title */}
        <div className="space-y-1.5">
          <h3 className="font-semibold text-sm text-[#1D1D1F]">
            ยืนยันการลบแถวงานย่อย
          </h3>
          <p className="text-xs text-[#6E6E73] leading-relaxed">
            คุณต้องการลบงานย่อยนี้ใช่หรือไม่?
          </p>
        </div>

        {/* Subtask Info Box */}
        <div className="bg-[#FAFAFC] border border-black/[0.06] rounded-2xl p-3 text-left space-y-1 text-xs">
          <div className="font-semibold text-[#1D1D1F] line-clamp-2">
            {subtask.category}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#86868B]">
            <span>ช่วงเวลา: {subtask.start || "-"} ถึง {subtask.end || "-"}</span>
            <span>•</span>
            <span>{subtask.days || 1} วัน</span>
          </div>
        </div>

        {/* Sync Notice */}
        <p className="text-[11px] text-amber-700 bg-amber-50/80 border border-amber-200/60 rounded-xl px-3 py-1.5 flex items-center justify-center gap-1.5 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>แถวนี้จะถูกลบออกจาก Google Sheets ด้วย</span>
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#1D1D1F] font-semibold rounded-2xl text-xs flex-1 transition-all cursor-pointer disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold rounded-2xl text-xs flex-1 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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
