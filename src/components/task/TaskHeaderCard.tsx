"use client"

import React from "react"
import { Task, DISCIPLINE_CONFIG } from "@/types"
import { Edit2, Calendar as CalendarIcon, Wrench, Image as ImageIcon, Maximize2, Camera, Upload } from "lucide-react"

interface TaskHeaderCardProps {
  task: Task
  currentTaskNum: string
  calculateDayDifference: (startStr?: string, endStr?: string) => number
  onOpenEditModal: () => void
  onOpenImagePreview: () => void
  onFileUpload: (file?: File) => void
  onRemoveImage: (e?: React.MouseEvent) => void
}

export default function TaskHeaderCard({
  task,
  currentTaskNum,
  calculateDayDifference,
  onOpenEditModal,
  onOpenImagePreview,
  onFileUpload,
  onRemoveImage,
}: TaskHeaderCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Job Title & W/O Details */}
        <div className="lg:col-span-6 space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <span className="text-xs font-semibold text-[#86868B]">งานที่</span>
              <span className="bg-[#F5F5F7] text-[#1D1D1F] font-bold px-2.5 py-0.5 rounded-lg font-mono text-xs border border-black/[0.05]">
                {currentTaskNum}
              </span>
              <span className="text-[#D2D2D7]">|</span>
              <span className="text-xs font-semibold text-[#86868B]">เลข W/O:</span>
              <button
                onClick={onOpenEditModal}
                className="bg-sky-50 hover:bg-sky-100 text-[#005B9A] font-bold px-2.5 py-0.5 rounded-lg font-mono text-xs border border-sky-200/80 transition-colors flex items-center gap-1 group cursor-pointer"
                title="คลิกเพื่อแก้ไข W/O"
              >
                <span>{task.wo || "4132222"}</span>
                <Edit2 className="w-3 h-3 text-[#005B9A] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <span className="text-[#D2D2D7]">|</span>
              <span className="text-xs font-semibold text-[#86868B]">หมวดร่วมงาน:</span>
              <span className="bg-amber-50 text-amber-900 font-bold px-2.5 py-0.5 rounded-lg font-mono text-xs border border-amber-200/80">
                {task.completion_codes || task.w_codes?.map((w) => w.replace("W", "")).join(",") || "11,12,13"}
              </span>
            </div>

            {/* Title Box (Clickable to Edit) */}
            <div
              onClick={onOpenEditModal}
              className="bg-[#FAFAFC] hover:bg-[#F2F2F7] border border-black/[0.06] rounded-2xl p-3.5 cursor-pointer transition-all group"
              title="คลิกเพื่อแก้ไขชื่องานและวันที่"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#86868B] flex items-center gap-1.5">
                  <span>ชื่องาน / รายละเอียดใบสั่งงาน:</span>
                  <span className="text-[10px] text-[#005B9A] font-normal">(คลิกเพื่อแก้ไข)</span>
                </span>
                <Edit2 className="w-3.5 h-3.5 text-[#005B9A] opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <h2 className="text-sm font-semibold text-[#1D1D1F] leading-snug group-hover:text-[#005B9A] transition-colors">
                {task.title}
              </h2>
            </div>
          </div>

          {/* Meta Grid Pills - 5 Clear Interactive Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {/* 1. วันที่เริ่มงาน */}
            <button
              type="button"
              onClick={onOpenEditModal}
              className="bg-[#FAFAFC] hover:bg-sky-50/50 border border-black/[0.06] hover:border-sky-300/80 p-2.5 rounded-2xl text-left transition-all group cursor-pointer"
              title="คลิกเพื่อแก้ไขวันที่เริ่มงาน"
            >
              <div className="flex items-center justify-between text-[10px] font-semibold text-[#86868B] group-hover:text-[#005B9A]">
                <span>เริ่มงาน</span>
                <CalendarIcon className="w-3 h-3 text-[#005B9A]" />
              </div>
              <div className="font-semibold text-[#1D1D1F] mt-1 font-mono text-[11px] group-hover:text-[#005B9A]">
                {task.report_date || "27 พ.ค. 2026"}
              </div>
            </button>

            {/* 2. แสดงข้อมูลตั้งแต่วันที่ */}
            <button
              type="button"
              onClick={onOpenEditModal}
              className="bg-[#FAFAFC] hover:bg-sky-50/50 border border-black/[0.06] hover:border-sky-300/80 p-2.5 rounded-2xl text-left transition-all group cursor-pointer"
              title="คลิกเพื่อแก้ไขวันที่เริ่มแสดงผลไทม์ไลน์"
            >
              <div className="flex items-center justify-between text-[10px] font-semibold text-[#86868B] group-hover:text-[#005B9A]">
                <span>แสดงตั้งแต่</span>
                <CalendarIcon className="w-3 h-3 text-[#005B9A]" />
              </div>
              <div className="font-semibold text-[#005B9A] mt-1 font-mono text-[11px]">
                {task.display_date || task.report_date || "27 พ.ค. 2026"}
              </div>
            </button>

            {/* 3. ระยะเวลาการทำงาน (คำนวณอัตโนมัติ) */}
            <div
              className="bg-[#F5F5F7] border border-black/[0.04] p-2.5 rounded-2xl text-left"
              title="ระยะเวลาคำนวณอัตโนมัติจากวันที่เริ่มงานและวันที่แล้วเสร็จ"
            >
              <div className="text-[10px] font-semibold text-[#86868B]">
                ระยะเวลา
              </div>
              <div className="font-semibold text-[#1D1D1F] mt-1 font-mono text-[11px]">
                {task.total_days || calculateDayDifference(task.report_date, task.completion_date || "31 ส.ค. 2026")} วัน
              </div>
            </div>

            {/* 4. วันที่แล้วเสร็จ */}
            <button
              type="button"
              onClick={onOpenEditModal}
              className="bg-[#FAFAFC] hover:bg-sky-50/50 border border-black/[0.06] hover:border-sky-300/80 p-2.5 rounded-2xl text-left transition-all group cursor-pointer"
              title="คลิกเพื่อแก้ไขวันที่แล้วเสร็จ"
            >
              <div className="flex items-center justify-between text-[10px] font-semibold text-[#86868B] group-hover:text-[#005B9A]">
                <span>แล้วเสร็จ</span>
                <CalendarIcon className="w-3 h-3 text-[#005B9A]" />
              </div>
              <div className="font-semibold text-[#1D1D1F] mt-1 font-mono text-[11px] group-hover:text-[#005B9A]">
                {task.completion_date || "31 ส.ค. 2026"}
              </div>
            </button>

            {/* 5. อุปกรณ์ (Equip) */}
            <button
              type="button"
              onClick={onOpenEditModal}
              className="bg-[#FAFAFC] hover:bg-sky-50/50 border border-black/[0.06] hover:border-sky-300/80 p-2.5 rounded-2xl text-left transition-all truncate group cursor-pointer"
              title="คลิกเพื่อแก้ไขอุปกรณ์"
            >
              <div className="flex items-center justify-between text-[10px] font-semibold text-[#86868B] group-hover:text-[#005B9A]">
                <span>อุปกรณ์</span>
                <Wrench className="w-3 h-3 opacity-60" />
              </div>
              <div className="font-semibold text-[#1D1D1F] mt-1 truncate text-[11px] group-hover:text-[#005B9A]">
                {task.equip || "-"}
              </div>
            </button>
          </div>
        </div>

        {/* Center: Task Photo Card / Upload Placeholder */}
        <div className="lg:col-span-3 bg-[#FAFAFC] border border-black/[0.06] rounded-2xl p-3 flex flex-col justify-between h-full group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-[#86868B] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#005B9A]" />
              <span>รูปภาพประกอบงาน (Task Photo)</span>
            </span>
            {task.imageUrl ? (
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-[#005B9A] hover:underline font-semibold cursor-pointer flex items-center gap-0.5">
                  <Upload className="w-2.5 h-2.5" />
                  <span>เปลี่ยนรูป</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        onFileUpload(e.target.files[0])
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="text-[10px] text-rose-500 hover:text-rose-700 hover:underline font-medium cursor-pointer"
                  title="ลบรูปภาพ"
                >
                  ลบรูป
                </button>
              </div>
            ) : (
              <label className="text-[10px] text-[#005B9A] hover:underline font-semibold cursor-pointer flex items-center gap-0.5">
                <Upload className="w-2.5 h-2.5" />
                <span>อัปโหลด</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onFileUpload(e.target.files[0])
                    }
                  }}
                />
              </label>
            )}
          </div>

          {task.imageUrl ? (
            <div
              onClick={onOpenImagePreview}
              className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 border border-black/[0.08] cursor-pointer group shadow-2xs"
              title="คลิกเพื่อดูรูปขยายใหญ่"
            >
              <img
                src={task.imageUrl}
                alt={task.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[1px]">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>ดูรูปขยาย</span>
              </div>
            </div>
          ) : (
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  onFileUpload(e.dataTransfer.files[0])
                }
              }}
              className="relative w-full h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#005B9A] bg-white hover:bg-sky-50/50 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group shadow-2xs text-center p-2"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onFileUpload(e.target.files[0])
                  }
                }}
              />
              <div className="w-9 h-9 rounded-full bg-[#F5F5F7] border border-black/[0.05] flex items-center justify-center text-[#86868B] group-hover:text-[#005B9A] group-hover:scale-110 group-hover:bg-white transition-all shadow-2xs mb-1">
                <Camera className="w-4.5 h-4.5" />
              </div>
              <span className="text-xs font-semibold text-[#1D1D1F] group-hover:text-[#005B9A] transition-colors">
                รอใส่รูปภาพ
              </span>
              <span className="text-[9.5px] text-[#86868B] group-hover:text-[#005B9A] transition-colors mt-0.5">
                คลิกหรือลากรูปมาวางที่นี่
              </span>
            </label>
          )}
        </div>

        {/* Right: Progress & Stepper */}
        <div className="lg:col-span-3 bg-[#FAFAFC] border border-black/[0.06] rounded-2xl p-4 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#86868B]">ความคืบหน้ารวม</span>
              <div className="text-2xl font-bold text-[#1D1D1F] font-mono tracking-tight mt-0.5">
                {task.progress}%
              </div>
            </div>
            <div className="relative w-13 h-13 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#E5E5EA]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={task.progress === 100 ? "text-emerald-500" : "text-[#005B9A]"}
                  strokeDasharray={`${task.progress}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-[#1D1D1F] font-mono">
                {task.progress}%
              </span>
            </div>
          </div>

          {/* Handover Stepper Pipeline */}
          <div className="pt-2.5 border-t border-black/[0.05]">
            <div className="text-[10px] font-semibold text-[#86868B] mb-1.5">
              ลำดับหมวดงาน (Discipline Pipeline):
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {task.w_codes &&
                task.w_codes.map((w, idx) => {
                  const isCurrent = task.current_discipline === w
                  const conf = DISCIPLINE_CONFIG[w]
                  return (
                    <div key={w} className="flex items-center gap-1">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all ${
                          isCurrent
                            ? "bg-sky-50 text-[#005B9A] border-sky-300 shadow-2xs font-bold"
                            : "bg-white text-[#6E6E73] border-black/[0.06]"
                        }`}
                      >
                        {conf?.num || w} {isCurrent && "📍"}
                      </span>
                      {idx < task.w_codes.length - 1 && (
                        <span className="text-[#D2D2D7] text-[9px]">➔</span>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
