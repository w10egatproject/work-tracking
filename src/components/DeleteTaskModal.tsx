"use client"

import React from "react"
import { Task } from "@/types"
import { Trash2, AlertTriangle, X } from "lucide-react"

interface DeleteTaskModalProps {
  isOpen: boolean
  task: Task | null
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function DeleteTaskModal({
  isOpen,
  task,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteTaskModalProps) {
  if (!isOpen || !task) return null

  return (
    <div
      className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose()
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-150 relative">
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
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto shadow-2xs">
          <Trash2 className="w-6 h-6" />
        </div>

        {/* Modal Header & Title */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-base text-[#0F172A]">
            ยืนยันการลบใบสั่งงานซ่อมบำรุง
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้ออกจากระบบ?
          </p>
        </div>

        {/* Task Info Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold bg-white text-[#005B9A] border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
              {task.taskNo || `งานที่${task.id}`}
            </span>
            {task.wo && (
              <span className="font-mono text-[11px] text-slate-500">
                W/O: {task.wo}
              </span>
            )}
          </div>
          <div className="font-bold text-[#0F172A] line-clamp-2">
            {task.title}
          </div>
          {task.equip && (
            <div className="text-[11px] text-slate-500">
              อุปกรณ์: {task.equip}
            </div>
          )}
        </div>

        {/* Sync Notice */}
        <div className="text-[11px] text-rose-700 bg-rose-50/80 border border-rose-200/60 rounded-xl p-2.5 flex items-center justify-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>แถวใน &quot;ลำดับงาน&quot; และแท็บ &quot;{task.taskNo || `งานที่${task.id}`}&quot; ใน Google Sheets จะถูกลบถาวร</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
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
                <span>ยืนยันลบงาน</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
