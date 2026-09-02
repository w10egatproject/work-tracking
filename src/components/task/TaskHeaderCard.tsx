"use client"

import React from "react"
import { Task, DISCIPLINE_STEPS } from "@/types"
import { Calendar, Clock, Wrench, FileText, Camera, Upload, Trash2, Edit2 } from "lucide-react"

interface TaskHeaderCardProps {
  task: Task
  currentTaskNum: string
  calculateDayDifference: (startStr?: string, endStr?: string) => number
  onOpenEditModal: () => void
  onOpenImagePreview: () => void
  onFileUpload: (file?: File) => void
  onRemoveImage: (e: React.MouseEvent) => void
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
  const isDone = task.status === "เสร็จ"
  const isInProgress = task.status === "ดำเนินการ"
  const isPending = task.status === "รอดำเนินการ"

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] p-4 sm:p-6 transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Task Identity & Bento Specs (8/12 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Top Title & W/O Number */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold text-[#005B9A] bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-lg font-mono">
                  {task.taskNo || `งานที่${currentTaskNum}`}
                </span>
                {task.wo && (
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-lg">
                    W/O: {task.wo}
                  </span>
                )}
                {/* Status Badge */}
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border inline-flex items-center gap-1.5 ${
                    isDone
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : isInProgress
                      ? "bg-sky-50 text-[#005B9A] border-sky-200"
                      : isPending
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  <span>{isDone ? "✅" : isInProgress ? "⚙️" : isPending ? "⏳" : "⚪"}</span>
                  <span>{task.status || "รอดำเนินการ"}</span>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
                {task.title}
              </h2>
            </div>

            {/* Quick Edit Button */}
            <button
              type="button"
              onClick={onOpenEditModal}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#005B9A] border border-slate-200/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>แก้ไขข้อมูล</span>
            </button>
          </div>

          {/* 5-Box Bento Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {/* 1. วันที่เริ่มงาน */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#005B9A]" />
                <span>เริ่มงาน</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#0F172A] mt-1 truncate">
                {task.report_date || "-"}
              </span>
            </div>

            {/* 2. แสดงข้อมูลตั้งแต่ */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#005B9A]" />
                <span>แสดงข้อมูลตั้งแต่</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#0F172A] mt-1 truncate">
                {task.display_date || task.report_date || "-"}
              </span>
            </div>

            {/* 3. ระยะเวลา */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>ระยะเวลา</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#005B9A] mt-1">
                {calculateDayDifference(task.report_date, task.completion_date)} วัน
              </span>
            </div>

            {/* 4. วันที่แล้วเสร็จ */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3 text-[#005B9A]" />
                <span>แล้วเสร็จ</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#0F172A] mt-1 truncate">
                {task.completion_date || "-"}
              </span>
            </div>

            {/* 5. อุปกรณ์ */}
            <div className="col-span-2 sm:col-span-1 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Wrench className="w-3 h-3 text-amber-600" />
                <span>อุปกรณ์</span>
              </span>
              <span className="text-xs font-semibold text-[#0F172A] mt-1 truncate" title={task.equip}>
                {task.equip || "-"}
              </span>
            </div>
          </div>

          {/* Discipline Handover Stepper Pipeline */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <span>ลำดับหมวดงาน (Discipline Pipeline):</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {DISCIPLINE_STEPS.map((step, idx) => {
                const isStepIncluded = task.w_codes?.includes(step.code)
                return (
                  <div key={step.code} className="flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                        isStepIncluded
                          ? "bg-[#005B9A] text-white border-[#005B9A] shadow-2xs"
                          : "bg-white text-slate-400 border-slate-200"
                      }`}
                      title={step.fullName}
                    >
                      {step.num}
                    </span>
                    {idx < DISCIPLINE_STEPS.length - 1 && (
                      <span className="text-slate-300 text-xs">➔</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Task Photo Container (4/12 cols) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
          <div className="flex-1 rounded-2xl border border-slate-200/80 overflow-hidden bg-slate-50 relative min-h-[140px] flex items-center justify-center group">
            {task.imageUrl ? (
              <div className="relative w-full h-full min-h-[140px]">
                <img
                  src={task.imageUrl}
                  alt={task.title}
                  onClick={onOpenImagePreview}
                  className="w-full h-full max-h-[160px] object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 flex items-center justify-between text-white text-[11px]">
                  <span className="font-medium cursor-pointer" onClick={onOpenImagePreview}>
                    🔍 ดูภาพขนาดใหญ่
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer hover:underline text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs">
                      เปลี่ยนรูป
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) onFileUpload(e.target.files[0])
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={onRemoveImage}
                      className="text-rose-300 hover:text-rose-100 p-0.5"
                      title="ลบรูป"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-sky-50/50 transition-colors border-2 border-dashed border-slate-200 hover:border-[#005B9A] rounded-2xl group text-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) onFileUpload(e.target.files[0])
                  }}
                />
                <div className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-400 group-hover:text-[#005B9A] group-hover:border-sky-300 flex items-center justify-center mb-1.5 transition-all shadow-2xs">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#005B9A]">
                  คลิกเพื่อเพิ่มรูปภาพงาน
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  รองรับ JPG, PNG, WEBP
                </span>
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
