"use client"

import React from "react"
import { ArrowLeft, Edit2, ExternalLink, RefreshCw, Plus, Calendar, Sparkles } from "lucide-react"

interface DashboardNavProps {
  type: "dashboard"
  todayStr: string
  refreshing: boolean
  onRefresh: () => void
  onAddTask: () => void
}

interface TaskDetailNavProps {
  type: "task-detail"
  taskNo: string
  title: string
  sheetLink?: string
  onEditTask: () => void
  onHandover: () => void
}

type FloatingNavbarProps = DashboardNavProps | TaskDetailNavProps

export default function FloatingNavbar(props: FloatingNavbarProps) {
  if (props.type === "dashboard") {
    return (
      <header className="sticky top-3.5 z-40 mx-4 sm:mx-6 max-w-[1700px] 2xl:mx-auto">
        <div className="backdrop-blur-xl bg-slate-900/90 border border-slate-700/70 shadow-[0_8px_32px_rgba(0,0,0,0.25),0_1px_2px_rgba(255,255,255,0.05)_inset] rounded-2xl px-4 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-white transition-all">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#005B9A] to-[#004A7D] border border-sky-400/30 flex items-center justify-center text-lg font-bold shadow-[0_2px_10px_rgba(0,91,154,0.4)] ring-1 ring-white/10">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>ระบบจัดการใบสั่งงานซ่อม W10</span>
                  <span className="text-slate-400 text-xs font-normal hidden md:inline">| Operations Console Pro</span>
                </h1>
                <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="hidden sm:inline">Sheets Live Sync</span>
                  <span className="sm:hidden">Live</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal hidden sm:block">
                กฟผ. แม่เมาะ • W11 วิศวกรรม • W12 เครื่องกล • W13 ซ่อมเครื่องจักรกล • W14 ซ่อมอุปกรณ์
              </p>
            </div>
          </div>

          {/* Quick Actions & Date */}
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-300 hidden xl:flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#F0B323]" />
              <span className="text-[11px]">{props.todayStr}</span>
            </div>

            <button
              onClick={props.onRefresh}
              disabled={props.refreshing}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
              title="รีเฟรชข้อมูลจาก Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${props.refreshing ? "animate-spin text-[#F0B323]" : ""}`} />
              <span className="hidden sm:inline">รีเฟรชข้อมูล</span>
            </button>

            <button
              onClick={props.onAddTask}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#005B9A] to-[#004A7D] hover:from-[#004A7D] hover:to-[#003860] text-white rounded-xl text-xs font-bold transition-all shadow-[0_2px_10px_rgba(0,91,154,0.35)] border border-sky-400/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>สร้างรายการใหม่</span>
            </button>
          </div>
        </div>
      </header>
    )
  }

  // Task Detail floating navbar
  return (
    <header className="sticky top-3.5 z-40 mx-4 sm:mx-6 max-w-[1700px] 2xl:mx-auto">
      <div className="backdrop-blur-xl bg-slate-900/90 border border-slate-700/70 shadow-[0_8px_32px_rgba(0,0,0,0.25),0_1px_2px_rgba(255,255,255,0.05)_inset] rounded-2xl px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 text-white transition-all">
        {/* Left: Back & Title info */}
        <div className="flex items-center gap-3 overflow-hidden">
          <a
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700/80 shadow-2xs shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F0B323]" />
            <span>กลับตารางหลัก</span>
          </a>
          <div className="h-4 w-px bg-slate-700 hidden sm:block shrink-0"></div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono font-bold text-[11px] bg-[#005B9A] text-white px-2.5 py-0.5 rounded-lg shadow-2xs shrink-0 border border-sky-400/30">
              {props.taskNo}
            </span>
            <span className="text-xs font-bold text-slate-200 truncate hidden md:block" title={props.title}>
              {props.title}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={props.onEditTask}
            className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            title="แก้ไขวันที่และรายละเอียดใบสั่งงาน"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#F0B323]" />
            <span className="hidden sm:inline">แก้ไขวันที่/ข้อมูลงาน</span>
            <span className="sm:hidden">แก้ไข</span>
          </button>

          <button
            onClick={props.onHandover}
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#F0B323] to-[#D99C12] hover:from-[#D99C12] text-[#0F172A] rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-[0_2px_10px_rgba(240,179,35,0.3)] active:scale-95 cursor-pointer"
          >
            <span>🤝 ส่งมอบงาน</span>
          </button>

          {props.sheetLink && (
            <a
              href={props.sheetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs hidden lg:flex"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>เปิดชีทจริง</span>
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
