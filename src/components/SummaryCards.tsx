"use client"

import { Task, DISCIPLINE_CONFIG } from "@/types"
import { CheckCircle2, Clock, PlayCircle, Layers, Wrench } from "lucide-react"

interface Props {
  tasks: Task[]
  activeDiscipline: string
  onSelectDiscipline: (d: string) => void
}

export default function SummaryCards({ tasks, activeDiscipline, onSelectDiscipline }: Props) {
  const total = tasks.length
  const inProgress = tasks.filter((t) => t.status === "ดำเนินการ").length
  const done = tasks.filter((t) => t.status === "เสร็จ").length
  const pending = tasks.filter((t) => t.status === "รอดำเนินการ").length

  const countW11 = tasks.filter((t) => t.completion_codes.includes("11") || t.w_codes.includes("W11")).length
  const countW12 = tasks.filter((t) => t.completion_codes.includes("12") || t.w_codes.includes("W12")).length
  const countW13 = tasks.filter((t) => t.completion_codes.includes("13") || t.w_codes.includes("W13")).length
  const countW14 = tasks.filter((t) => t.completion_codes.includes("14") || t.w_codes.includes("W14")).length

  return (
    <div className="px-6 pt-4 pb-2 space-y-3">
      {/* Top row stats: Modern Workspace Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Total Tasks */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100/40 to-transparent rounded-full -mr-6 -mt-6 pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">งานทั้งหมด</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">{total}</span>
            <span className="text-xs font-semibold text-slate-400">รายการ</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Google Sheets Master</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full -mr-6 -mt-6 pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">กำลังดำเนินการ</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-blue-700 tracking-tight font-mono">{inProgress}</span>
            <span className="text-xs font-semibold text-slate-400">งาน</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-600 font-semibold">
            {total > 0 ? Math.round((inProgress / total) * 100) : 0}% ของงานทั้งหมด
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full -mr-6 -mt-6 pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">เสร็จสมบูรณ์</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-emerald-700 tracking-tight font-mono">{done}</span>
            <span className="text-xs font-semibold text-slate-400">งาน</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-semibold">
            {total > 0 ? Math.round((done / total) * 100) : 0}% สำเร็จเรียบร้อย
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full -mr-6 -mt-6 pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">รอดำเนินการ</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-sm">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-amber-700 tracking-tight font-mono">{pending}</span>
            <span className="text-xs font-semibold text-slate-400">งาน</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-semibold">
            เตรียมส่งมอบ / วางแผน
          </div>
        </div>
      </div>

      {/* Discipline Modern Filter Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">หมวดงาน (Disciplines):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectDiscipline("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              activeDiscipline === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ทั้งหมด ({total})
          </button>

          <button
            onClick={() => onSelectDiscipline("W11")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              activeDiscipline === "W11"
                ? "bg-purple-700 text-white border-purple-700 shadow-xs"
                : "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            W11 วิศวกรรม ({countW11})
          </button>

          <button
            onClick={() => onSelectDiscipline("W12")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              activeDiscipline === "W12"
                ? "bg-blue-700 text-white border-blue-700 shadow-xs"
                : "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            W12 เครื่องกล ({countW12})
          </button>

          <button
            onClick={() => onSelectDiscipline("W13")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              activeDiscipline === "W13"
                ? "bg-amber-700 text-white border-amber-700 shadow-xs"
                : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            W13 ซ่อมเครื่องจักรกล ({countW13})
          </button>

          <button
            onClick={() => onSelectDiscipline("W14")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              activeDiscipline === "W14"
                ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            W14 ซ่อมอุปกรณ์ ({countW14})
          </button>
        </div>
      </div>
    </div>
  )
}
