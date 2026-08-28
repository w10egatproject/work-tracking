"use client"

import { Task, DISCIPLINE_CONFIG } from "@/types"
import { CheckCircle2, Clock, PlayCircle, Layers, TrendingUp, Sparkles, Filter } from "lucide-react"

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

  const percentDone = total > 0 ? Math.round((done / total) * 100) : 0
  const percentInProgress = total > 0 ? Math.round((inProgress / total) * 100) : 0
  const percentPending = total > 0 ? Math.round((pending / total) * 100) : 0

  const countW11 = tasks.filter((t) => t.completion_codes.includes("11") || t.w_codes.includes("W11")).length
  const countW12 = tasks.filter((t) => t.completion_codes.includes("12") || t.w_codes.includes("W12")).length
  const countW13 = tasks.filter((t) => t.completion_codes.includes("13") || t.w_codes.includes("W13")).length
  const countW14 = tasks.filter((t) => t.completion_codes.includes("14") || t.w_codes.includes("W14")).length

  return (
    <div className="px-6 space-y-3.5">
      {/* Interactive Bento Grid Cards (Linear + Apple Minimalist) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Tasks Bento Card */}
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_20px_rgba(0,91,154,0.08)] hover:border-sky-300/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-sky-50/80 via-transparent to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 text-[#005B9A] flex items-center justify-center shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">งานทั้งหมด</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold text-[#0F172A] tracking-tight font-mono">
                {total}
                <span className="text-xs font-normal text-slate-400 ml-1.5">รายการ</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#005B9A]" />
                อัปเดตจาก Google Sheets
              </p>
            </div>
          </div>
        </div>

        {/* In Progress Bento Card */}
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_20px_rgba(0,91,154,0.08)] hover:border-sky-300/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-blue-50/80 via-transparent to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 text-[#005B9A] flex items-center justify-center shadow-xs">
                <PlayCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">กำลังดำเนินการ</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-[#005B9A] border border-sky-200/80 font-mono">
              {percentInProgress}%
            </span>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[#005B9A] tracking-tight font-mono">
              {inProgress}
              <span className="text-xs font-normal text-slate-400 ml-1.5">งาน</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#005B9A] to-sky-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentInProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Completed Bento Card */}
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.08)] hover:border-emerald-300/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-emerald-50/80 via-transparent to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">เสร็จสมบูรณ์</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-mono">
              {percentDone}%
            </span>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-600 tracking-tight font-mono">
              {done}
              <span className="text-xs font-normal text-slate-400 ml-1.5">งาน</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentDone}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pending Bento Card */}
        <div className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_20px_rgba(245,158,11,0.08)] hover:border-amber-300/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-50/80 via-transparent to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">รอดำเนินการ</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 font-mono">
              {percentPending}%
            </span>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold text-amber-600 tracking-tight font-mono">
              {pending}
              <span className="text-xs font-normal text-slate-400 ml-1.5">งาน</span>
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

      {/* Modern Segmented Discipline Filter Pills */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.02)] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 px-2">
          <Filter className="w-3.5 h-3.5 text-[#005B9A]" />
          <span className="text-xs font-bold text-[#0F172A]">หมวดงานที่รับผิดชอบ:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onSelectDiscipline("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
              activeDiscipline === "ALL"
                ? "bg-[#005B9A] text-white shadow-[0_2px_8px_rgba(0,91,154,0.25)]"
                : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
            }`}
          >
            <span>ทั้งหมด</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeDiscipline === "ALL" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
              }`}
            >
              {total}
            </span>
          </button>

          {/* W11 */}
          <button
            onClick={() => onSelectDiscipline("W11")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
              activeDiscipline === "W11"
                ? "bg-purple-700 text-white shadow-[0_2px_8px_rgba(126,34,206,0.25)]"
                : "bg-purple-50/70 text-purple-700 hover:bg-purple-100/80 border border-purple-200/50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>W11 วิศวกรรม</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeDiscipline === "W11" ? "bg-white/20 text-white" : "bg-purple-200/80 text-purple-800"
              }`}
            >
              {countW11}
            </span>
          </button>

          {/* W12 */}
          <button
            onClick={() => onSelectDiscipline("W12")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
              activeDiscipline === "W12"
                ? "bg-[#005B9A] text-white shadow-[0_2px_8px_rgba(0,91,154,0.25)]"
                : "bg-sky-50/70 text-[#005B9A] hover:bg-sky-100/80 border border-sky-200/50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#005B9A]"></span>
            <span>W12 เครื่องกล</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeDiscipline === "W12" ? "bg-white/20 text-white" : "bg-sky-200/80 text-[#005B9A]"
              }`}
            >
              {countW12}
            </span>
          </button>

          {/* W13 */}
          <button
            onClick={() => onSelectDiscipline("W13")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
              activeDiscipline === "W13"
                ? "bg-[#D97706] text-white shadow-[0_2px_8px_rgba(217,119,6,0.25)]"
                : "bg-amber-50/70 text-amber-800 hover:bg-amber-100/80 border border-amber-200/50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F0B323]"></span>
            <span>W13 ซ่อมเครื่องจักรกล</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeDiscipline === "W13" ? "bg-white/20 text-white" : "bg-amber-200/80 text-amber-900"
              }`}
            >
              {countW13}
            </span>
          </button>

          {/* W14 */}
          <button
            onClick={() => onSelectDiscipline("W14")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
              activeDiscipline === "W14"
                ? "bg-emerald-700 text-white shadow-[0_2px_8px_rgba(4,120,87,0.25)]"
                : "bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200/50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>W14 ซ่อมอุปกรณ์</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeDiscipline === "W14" ? "bg-white/20 text-white" : "bg-emerald-200/80 text-emerald-900"
              }`}
            >
              {countW14}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
