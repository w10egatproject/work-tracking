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
      className="fixed inset-0 bg-[#19211E]/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#DDD6C8] animate-in zoom-in-95 duration-150 text-[#19211E]">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#DDD6C8] mb-4">
          <div>
            <h3 className="font-bold text-sm text-[#19211E]">
              แก้ไขข้อมูลและช่วงเวลางาน (Task Details)
            </h3>
            <p className="text-[11px] text-[#6B7771]">
              ปรับปรุงชื่องาน, วันที่เริ่ม-เสร็จ, อุปกรณ์ และรูปภาพประกอบงาน
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6B7771] hover:text-[#19211E] p-1.5 rounded-full hover:bg-[#ECE7DC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3.5 text-xs text-[#19211E]">
          {/* ชื่องาน */}
          <div>
            <label className="block font-bold text-[#19211E] mb-1">
              ชื่องาน / รายละเอียดใบสั่งงาน <span className="text-[#C05621]">*</span>
            </label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="ระบุชื่องาน..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6C8] rounded-xl text-xs outline-none focus:bg-white focus:border-[#19211E] font-medium"
            />
          </div>

          {/* 1. วันที่เริ่มงาน & 2. แสดงข้อมูลตั้งแต่วันที่ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-[#19211E] mb-1 flex items-center justify-between">
                <span>วันที่เริ่มงาน <span className="text-[#C05621]">*</span></span>
                <span className="text-[10px] text-[#C05621] font-medium">เลือกปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("report_date", "เลือกวันที่เริ่มงาน", editReportDate)}
                className="w-full px-3.5 py-2.5 bg-white hover:bg-[#ECE7DC]/60 border border-[#DDD6C8] hover:border-[#19211E] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-semibold text-[#19211E]">{editReportDate || "เลือกวันที่"}</span>
                <CalendarIcon className="w-4 h-4 text-[#19211E] group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#19211E] mb-1 flex items-center justify-between">
                <span>แสดงข้อมูลตั้งแต่วันที่ <span className="text-[#C05621]">*</span></span>
                <span className="text-[10px] text-[#C05621] font-medium">เลือกปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("display_date", "เลือกวันที่เริ่มต้นแสดงผลไทม์ไลน์", editDisplayDate)}
                className="w-full px-3.5 py-2.5 bg-white hover:bg-[#ECE7DC]/60 border border-[#DDD6C8] hover:border-[#19211E] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-semibold text-[#19211E]">{editDisplayDate || "เลือกวันที่"}</span>
                <CalendarIcon className="w-4 h-4 text-[#19211E] group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>

          {/* 3. วันที่แล้วเสร็จ & 4. ระยะเวลา */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-[#19211E] mb-1 flex items-center justify-between">
                <span>วันที่แล้วเสร็จ <span className="text-[#C05621]">*</span></span>
                <span className="text-[10px] text-[#C05621] font-medium">เลือกปฏิทิน</span>
              </label>
              <div
                onClick={() => onOpenCalendarPicker("completion_date", "เลือกวันที่แล้วเสร็จ", editCompletionDate)}
                className="w-full px-3.5 py-2.5 bg-white hover:bg-[#ECE7DC]/60 border border-[#DDD6C8] hover:border-[#19211E] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
              >
                <span className="font-mono font-semibold text-[#19211E]">{editCompletionDate || "เลือกวันที่"}</span>
                <CalendarIcon className="w-4 h-4 text-[#19211E] group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#19211E] mb-1 flex items-center justify-between">
                <span>ระยะเวลาการทำงาน (วัน)</span>
                <span className="text-[10px] text-[#1B5E3B] font-medium">🔒 คำนวณอัตโนมัติ</span>
              </label>
              <div className="w-full px-3.5 py-2.5 bg-[#ECE7DC] border border-[#DDD6C8] rounded-xl text-xs font-mono font-bold text-[#19211E] cursor-not-allowed flex items-center justify-between">
                <span>{editTotalDays} วัน</span>
                <span className="text-[10px] text-[#6B7771] font-normal font-sans">(จากช่วงวันที่)</span>
              </div>
            </div>
          </div>

          {/* เลข W/O และ อุปกรณ์ (Equip) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-[#19211E] mb-1">
                เลข Work Order (W/O)
              </label>
              <input
                type="text"
                value={editWo}
                onChange={(e) => setEditWo(e.target.value)}
                placeholder="เช่น 4132222"
                className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6C8] rounded-xl text-xs outline-none focus:bg-white focus:border-[#19211E] font-mono font-bold text-[#19211E]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#19211E] mb-1">
                อุปกรณ์ / เครื่องจักร (Equip)
              </label>
              <input
                type="text"
                value={editEquip}
                onChange={(e) => setEditEquip(e.target.value)}
                placeholder="เช่น Sump 2SW"
                className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6C8] rounded-xl text-xs outline-none focus:bg-white focus:border-[#19211E]"
              />
            </div>
          </div>

          {/* รูปภาพประกอบงาน (Task Photo) - Upload + URL */}
          <div className="space-y-2">
            <label className="block font-bold text-[#19211E] flex items-center justify-between">
              <span>รูปภาพประกอบงาน (Task Photo)</span>
              <span className="text-[10px] text-[#C05621]">อัปโหลดไฟล์หรือใส่ URL</span>
            </label>

            {editImageUrl ? (
              <div className="relative rounded-2xl border border-[#DDD6C8] overflow-hidden bg-[#ECE7DC] p-2.5 flex items-center gap-3">
                <img
                  src={editImageUrl}
                  alt="Task Photo Preview"
                  className="w-20 h-16 object-cover rounded-xl border border-[#DDD6C8] shadow-2xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#19211E] truncate">มีรูปภาพประกอบงานแล้ว</div>
                  <div className="text-[10px] text-[#6B7771] truncate">คลิกด้านล่างเพื่อเปลี่ยนหรือลบรูป</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <label className="text-[11px] font-semibold text-[#19211E] hover:underline cursor-pointer flex items-center gap-1">
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
                    <span className="text-[#DDD6C8]">•</span>
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
                className="w-full py-4 px-3 rounded-2xl border-2 border-dashed border-[#DDD6C8] hover:border-[#19211E] bg-white hover:bg-[#ECE7DC]/50 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group text-center shadow-2xs"
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
                <div className="w-8 h-8 rounded-full bg-[#ECE7DC] border border-[#DDD6C8] flex items-center justify-center text-[#6B7771] group-hover:text-[#19211E] group-hover:scale-110 transition-all shadow-2xs mb-1">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#19211E] group-hover:text-[#C05621]">
                  รอใส่รูปภาพ (คลิกเพื่ออัปโหลด)
                </span>
                <span className="text-[10px] text-[#6B7771] mt-0.5">
                  รองรับไฟล์ .JPG, .PNG, .WEBP หรือลากไฟล์มาวาง
                </span>
              </label>
            )}

            <div className="pt-1">
              <div className="text-[10px] font-semibold text-[#6B7771] mb-1">
                หรือระบุลิงก์รูปภาพโดยตรง (Image URL):
              </div>
              <input
                type="text"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3.5 py-2 bg-white border border-[#DDD6C8] rounded-xl text-xs outline-none focus:bg-white focus:border-[#19211E]"
              />
            </div>
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
              disabled={isSavingTaskDetails}
              className="px-5 py-2 bg-[#19211E] hover:bg-[#2C3732] text-[#FAF8F5] rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer border border-[#19211E]"
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
