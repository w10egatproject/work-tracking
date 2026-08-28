"use client"

import { Task, DISCIPLINE_CONFIG } from "@/types"
import { CheckCircle2, Clock, PlayCircle, Layers, Wrench, Activity } from "lucide-react"

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
      {/* Top row stats: EGAT Operations Console KPI Cards (Section 6.3) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">งานซ่อมสะสมทั้งหมด</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#005B9A] flex items-center justify-center font-bold">
              <Layers className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#0F2747] tracking-tight font-mono">
              {total} <span className="text-xs font-normal text-slate-500">รายการ</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Google Sheets Master</span>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">กำลังดำเนินการ</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#005B9A] flex items-center justify-center font-bold">
              <PlayCircle className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#005B9A] tracking-tight font-mono">
              {inProgress} <span className="text-xs font-normal text-slate-500">งาน</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#005B9A] font-semibold">
              <span>{total > 0 ? Math.round((inProgress / total) * 100) : 0}% ของงานทั้งหมด</span>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">เสร็จสมบูรณ์</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#1F7A4D] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#1F7A4D] tracking-tight font-mono">
              {done} <span className="text-xs font-normal text-slate-500">งาน</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <span>{total > 0 ? Math.round((done / total) * 100) : 0}% สำเร็จเรียบร้อย</span>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">รอดำเนินการ</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center font-bold">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#D97706] tracking-tight font-mono">
              {pending} <span className="text-xs font-normal text-slate-500">งาน</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
              <span>เตรียมส่งมอบ / วางแผน</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discipline Filter Chips Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0F2747]">หมวดงานที่รับผิดชอบ (Disciplines):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectDiscipline("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeDiscipline === "ALL"
                ? "bg-[#005B9A] text-white shadow-xs border border-[#005B9A]"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
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
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            W11 วิศวกรรม ({countW11})
          </button>

          <button
            onClick={() => onSelectDiscipline("W12")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              activeDiscipline === "W12"
                ? "bg-[#005B9A] text-white border-[#005B9A] shadow-xs"
                : "bg-blue-50 text-[#005B9A] border-blue-200 hover:bg-blue-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#005B9A]"></span>
            W12 เครื่องกล ({countW12})
          </button>

          <button
            onClick={() => onSelectDiscipline("W13")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              activeDiscipline === "W13"
                ? "bg-[#D97706] text-white border-[#D97706] shadow-xs"
                : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F0B323]"></span>
            W13 ซ่อมเครื่องจักรกล ({countW13})
          </button>

          <button
            onClick={() => onSelectDiscipline("W14")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              activeDiscipline === "W14"
                ? "bg-[#1F7A4D] text-white border-[#1F7A4D] shadow-xs"
                : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#1F7A4D]"></span>
            W14 ซ่อมอุปกรณ์ ({countW14})
          </button>
        </div>
      </div>
    </div>
  )
}
