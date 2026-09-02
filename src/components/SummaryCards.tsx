"use client"

import { Task } from "@/types"
import { CheckCircle2, Clock, PlayCircle, Layers } from "lucide-react"

interface Props {
  tasks: Task[]
}

export default function SummaryCards({ tasks }: Props) {
  const total = tasks.length
  const inProgress = tasks.filter((t) => t.status === "ดำเนินการ").length
  const done = tasks.filter((t) => t.status === "เสร็จ").length
  const pending = tasks.filter((t) => t.status === "รอดำเนินการ").length

  const percentDone = total > 0 ? Math.round((done / total) * 100) : 0
  const percentInProgress = total > 0 ? Math.round((inProgress / total) * 100) : 0
  const percentPending = total > 0 ? Math.round((pending / total) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total Tasks Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] flex flex-col justify-between transition-all hover:border-slate-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-700">งานทั้งหมดในระบบ</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Master Data
          </span>
        </div>

        <div className="mt-3.5">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-mono">
              {total}
              <span className="text-xs font-normal text-slate-400 ml-1.5 font-sans">รายการ</span>
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80 font-mono">
              สำเร็จ {percentDone}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-slate-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentDone}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. In Progress Card (EGAT Blue) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] flex flex-col justify-between transition-all hover:border-sky-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200/80 text-[#005B9A] flex items-center justify-center">
              <PlayCircle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-700">กำลังดำเนินการ</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#005B9A] border border-sky-200/80 font-mono">
            {percentInProgress}%
          </span>
        </div>

        <div className="mt-3.5">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#005B9A] tracking-tight font-mono">
              {inProgress}
              <span className="text-xs font-normal text-slate-400 ml-1.5 font-sans">งาน</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              {inProgress} จาก {total} รายการ
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-[#005B9A] h-full rounded-full transition-all duration-500"
              style={{ width: `${percentInProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3. Completed Card (Emerald) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] flex flex-col justify-between transition-all hover:border-emerald-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-700">เสร็จสิ้นแล้ว</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-mono">
            {percentDone}%
          </span>
        </div>

        <div className="mt-3.5">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight font-mono">
              {done}
              <span className="text-xs font-normal text-slate-400 ml-1.5 font-sans">งาน</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              ปิดงานสมบูรณ์
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentDone}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4. Pending Card (Mae Moh Amber) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] flex flex-col justify-between transition-all hover:border-amber-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-700">รอดำเนินการ</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 font-mono">
            {percentPending}%
          </span>
        </div>

        <div className="mt-3.5">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight font-mono">
              {pending}
              <span className="text-xs font-normal text-slate-400 ml-1.5 font-sans">งาน</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              รอเปิดหมวดงาน
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentPending}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
