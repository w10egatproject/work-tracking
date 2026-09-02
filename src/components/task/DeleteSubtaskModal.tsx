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
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose()
      }}
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200/80 text-center space-y-4 animate-in zoom-in-95 duration-150 relative text-[#0F172A]">
        {/* Close Button */}
        <button
          type="button"
          disabled={isDeleting}
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-13 h-13 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto shadow-2xs">
          <Trash2 className="w-6 h-6" />
        </div>

        {/* Modal Header & Title */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-sm text-[#0F172A]">
            ยืนยันการลบแถวงานย่อย
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            คุณต้องการลบงานย่อยนี้ใช่หรือไม่?
          </p>
        </div>

        {/* Subtask Info Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-left space-y-1 text-xs">
          <div className="font-bold text-[#0F172A] line-clamp-2">
            {subtask.category}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>ช่วงเวลา: {subtask.start || "-"} ถึง {subtask.end || "-"}</span>
            <span>•</span>
            <span>{subtask.days || 1} วัน</span>
          </div>
        </div>

        {/* Sync Notice */}
        <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 flex items-center justify-center gap-1.5 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          <span>แถวนี้จะถูกลบออกจาก Google Sheets ด้วย</span>
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex-1 transition-all cursor-pointer disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs flex-1 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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
