"use client"

import React from "react"
import { Calendar as CalendarIcon, Save, Camera, Upload, Trash2, X } from "lucide-react"

interface TaskEditDetailsModalProps {
  isOpen: boolean
  editTitle: string
  setEditTitle: (val: string) => void
  editReportDate: string
  editDisplayDate: string
  editCompletionDate: string
  editTotalDays: number
  editWo: string
  setEditWo: (val: string) => void
  editEquip: string
  setEditEquip: (val: string) => void
  editImageUrl: string
  setEditImageUrl: (val: string) => void
  isSavingTaskDetails: boolean
  onOpenCalendarPicker: (field: "report_date" | "display_date" | "completion_date", title: string, currentVal?: string) => void
  onSave: (e: React.FormEvent) => void
  onClose: () => void
}

export default function TaskEditDetailsModal({
  isOpen,
  editTitle,
  setEditTitle,
  editReportDate,
  editDisplayDate,
  editCompletionDate,
  editTotalDays,
  editWo,
  setEditWo,
  editEquip,
  setEditEquip,
  editImageUrl,
  setEditImageUrl,
  isSavingTaskDetails,
  onOpenCalendarPicker,
  onSave,
  onClose,
}: TaskEditDetailsModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/80 animate-in zoom-in-95 duration-150 text-[#0F172A]">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">
              แก้ไขข้อมูลและช่วงเวลางาน (Task Details)
            </h3>
            <p className="text-[11px] text-slate-500">
              ปรับปรุงชื่องาน, วันที่เริ่ม-เสร็จ, อุปกรณ์ และรูปภาพประกอบงาน
            </p>
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
          {/* ชื่องาน */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              ชื่องาน / รายละเอียดใบสั่งงาน <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="ระบุชื่องาน..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-medium"
            />
          </div>

          {/* 1. วันที่เริ่มงาน & 2. แสดงข้อมูลตั้งแต่วันที่ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>วันที่เริ่มงาน <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-[#005B9A] font-bold">เลือกปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("report_date", "เลือกวันที่เริ่มงาน", editReportDate)}
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-[#005B9A] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-bold text-[#005B9A]">{editReportDate || "เลือกวันที่"}</span>
                <CalendarIcon className="w-4 h-4 text-[#005B9A] group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>แสดงข้อมูลตั้งแต่วันที่ <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-[#005B9A] font-bold">เลือกปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("display_date", "เลือกวันที่เริ่มต้นแสดงผลไทม์ไลน์", editDisplayDate)}
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-[#005B9A] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-bold text-[#005B9A]">{editDisplayDate || "เลือกวันที่"}</span>
                <CalendarIcon className="w-4 h-4 text-[#005B9A] group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>

          {/* 3. วันที่แล้วเสร็จ & 4. ระยะเวลา */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>วันที่แล้วเสร็จ <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-[#005B9A] font-bold">เลือกปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("completion_date", "เลือกวันที่แล้วเสร็จ", editCompletionDate)}
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-[#005B9A] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-bold text-[#005B9A]">{editCompletionDate || "เลือกวันที่"}</span>
                <CalendarIcon className="w-4 h-4 text-[#005B9A] group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>ระยะเวลาการทำงาน (วัน)</span>
                <span className="text-[10px] text-emerald-600 font-bold">🔒 คำนวณอัตโนมัติ</span>
              </label>
              <div className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-mono font-bold text-[#0F172A] cursor-not-allowed flex items-center justify-between">
                <span>{editTotalDays} วัน</span>
                <span className="text-[10px] text-slate-500 font-normal font-sans">(จากช่วงวันที่)</span>
              </div>
            </div>
          </div>

          {/* เลข W/O และ อุปกรณ์ (Equip) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                เลข Work Order (W/O)
              </label>
              <input
                type="text"
                value={editWo}
                onChange={(e) => setEditWo(e.target.value)}
                placeholder="เช่น 4132222"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A] font-mono font-bold text-[#005B9A]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                อุปกรณ์ / เครื่องจักร (Equip)
              </label>
              <input
                type="text"
                value={editEquip}
                onChange={(e) => setEditEquip(e.target.value)}
                placeholder="เช่น Sump 2SW"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A]"
              />
            </div>
          </div>

          {/* รูปภาพประกอบงาน (Task Photo) - Upload + URL */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700 flex items-center justify-between">
              <span>รูปภาพประกอบงาน (Task Photo)</span>
              <span className="text-[10px] text-[#005B9A] font-semibold">อัปโหลดไฟล์หรือใส่ URL</span>
            </label>

            {editImageUrl ? (
              <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2.5 flex items-center gap-3">
                <img
                  src={editImageUrl}
                  alt="Task Photo Preview"
                  className="w-20 h-16 object-cover rounded-xl border border-slate-200 shadow-2xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#0F172A] truncate">มีรูปภาพประกอบงานแล้ว</div>
                  <div className="text-[10px] text-slate-500 truncate">คลิกด้านล่างเพื่อเปลี่ยนหรือลบรูป</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <label className="text-[11px] font-semibold text-[#005B9A] hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>เปลี่ยนไฟล์รูป</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0]
                            const reader = new FileReader()
                            reader.onload = (ev) => {
                              if (ev.target?.result) setEditImageUrl(ev.target.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => setEditImageUrl("")}
                      className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>ลบรูป</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0]
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                      if (ev.target?.result) setEditImageUrl(ev.target.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                className="w-full py-4 px-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#005B9A] bg-slate-50/50 hover:bg-sky-50/40 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group text-center shadow-2xs"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0]
                      const reader = new FileReader()
                      reader.onload = (ev) => {
                        if (ev.target?.result) setEditImageUrl(ev.target.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#005B9A] group-hover:scale-110 transition-all shadow-2xs mb-1">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#0F172A] group-hover:text-[#005B9A]">
                  รอใส่รูปภาพ (คลิกเพื่ออัปโหลด)
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  รองรับไฟล์ .JPG, .PNG, .WEBP หรือลากไฟล์มาวาง
                </span>
              </label>
            )}

            <div className="pt-1">
              <div className="text-[10px] font-semibold text-slate-500 mb-1">
                หรือระบุลิงก์รูปภาพโดยตรง (Image URL):
              </div>
              <input
                type="text"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:bg-white focus:border-[#005B9A]"
              />
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
              disabled={isSavingTaskDetails}
              className="px-5 py-2 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingTaskDetails ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
