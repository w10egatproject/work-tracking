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
      <div className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_20px_rgba(0,91,154,0.08)] hover:border-sky-300/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-slate-100/60 via-transparent to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-600">งานทั้งหมด</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Sync
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-[#0F172A] tracking-tight font-mono">
              {total}
              <span className="text-xs font-normal text-slate-400 ml-1.5">รายการ</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              สำเร็จ {percentDone}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-slate-400 to-[#005B9A] h-full rounded-full transition-all duration-500"
              style={{ width: `${percentDone}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. In Progress Card */}
      <div className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_20px_rgba(0,91,154,0.08)] hover:border-sky-300/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-sky-50/80 via-transparent to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 text-[#005B9A] flex items-center justify-center shadow-xs">
              <PlayCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-600">กำลังดำเนินการ</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-[#005B9A] border border-sky-200/80 font-mono shadow-2xs">
            {percentInProgress}%
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-[#005B9A] tracking-tight font-mono">
              {inProgress}
              <span className="text-xs font-normal text-slate-400 ml-1.5">งาน</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {inProgress} จาก {total}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#005B9A] to-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentInProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3. Completed Card */}
      <div className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.08)] hover:border-emerald-300/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-emerald-50/80 via-transparent to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-600">เสร็จสมบูรณ์</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-mono shadow-2xs">
            {percentDone}%
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-emerald-600 tracking-tight font-mono">
              {done}
              <span className="text-xs font-normal text-slate-400 ml-1.5">งาน</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {done} จาก {total}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentDone}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4. Pending Card */}
      <div className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_20px_rgba(245,158,11,0.08)] hover:border-amber-300/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-50/80 via-transparent to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-600">รอดำเนินการ</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 font-mono shadow-2xs">
            {percentPending}%
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-amber-600 tracking-tight font-mono">
              {pending}
              <span className="text-xs font-normal text-slate-400 ml-1.5">งาน</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {pending} จาก {total}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-yellow-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentPending}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
