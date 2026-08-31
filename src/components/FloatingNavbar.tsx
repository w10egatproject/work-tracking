"use client"

import React from "react"
import { ArrowLeft, Edit2, ExternalLink, RefreshCw, Plus, Calendar, Table as TableIcon, LayoutGrid } from "lucide-react"

interface DashboardNavProps {
  type: "dashboard"
  todayStr: string
  refreshing: boolean
  onRefresh: () => void
  onAddTask: () => void
  viewMode: "table" | "kanban"
  onViewModeChange: (mode: "table" | "kanban") => void
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
      <header className="sticky top-3.5 z-40 mx-auto w-full max-w-[1600px] px-4 sm:px-6 transition-all">
        <div className="backdrop-blur-2xl bg-white/90 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] rounded-2xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3.5 text-[#1D1D1F] transition-all">
          {/* Left: Branding & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#005B9A] to-[#0284C7] flex items-center justify-center text-white text-base font-bold shadow-xs shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-[#1D1D1F] flex items-center gap-2">
                  <span>W10 Operations</span>
                  <span className="text-[#86868B] text-xs font-normal hidden lg:inline">| ภาพรวมงานซ่อมบำรุงประจำแผนก</span>
                </h1>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live Sync</span>
                </span>
              </div>
              <p className="text-[11px] text-[#86868B] font-normal hidden sm:block mt-0.5">
                กฟผ. แม่เมาะ • W11 วิศวกรรม • W12 เครื่องกล • W13 ซ่อมเครื่องจักร • W14 ซ่อมอุปกรณ์
              </p>
            </div>
          </div>

          {/* Right: View Switcher, Date, Refresh & Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* View Mode Segmented Controls */}
            <div className="flex items-center bg-[#F5F5F7] p-0.5 rounded-xl border border-black/[0.05]">
              <button
                onClick={() => props.onViewModeChange("table")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                  props.viewMode === "table"
                    ? "bg-white text-[#1D1D1F] shadow-xs font-bold"
                    : "text-[#86868B] hover:text-[#1D1D1F]"
                }`}
                title="มุมมองตาราง"
              >
                <TableIcon className="w-3.5 h-3.5 text-[#005B9A]" />
                <span className="hidden md:inline">ตาราง</span>
              </button>

              <button
                onClick={() => props.onViewModeChange("kanban")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                  props.viewMode === "kanban"
                    ? "bg-white text-[#1D1D1F] shadow-xs font-bold"
                    : "text-[#86868B] hover:text-[#1D1D1F]"
                }`}
                title="มุมมองบอร์ด Kanban"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#005B9A]" />
                <span className="hidden md:inline">บอร์ด</span>
              </button>
            </div>

            {/* Date */}
            <div className="text-xs text-[#6E6E73] hidden xl:flex items-center gap-1.5 bg-[#F5F5F7] px-3 py-1.5 rounded-xl font-medium border border-black/[0.04]">
              <Calendar className="w-3.5 h-3.5 text-[#005B9A]" />
              <span className="text-[11px]">{props.todayStr}</span>
            </div>

            {/* Refresh */}
            <button
              onClick={props.onRefresh}
              disabled={props.refreshing}
              className="px-3 py-1.5 rounded-xl bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95 cursor-pointer border border-black/[0.04]"
              title="รีเฟรชข้อมูลจาก Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#005B9A] ${props.refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">รีเฟรช</span>
            </button>

            {/* Add Task Button */}
            <button
              onClick={props.onAddTask}
              className="px-3.5 py-1.5 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>สร้างงานใหม่</span>
            </button>
          </div>
        </div>
      </header>
    )
  }

  // Task Detail floating navbar (Apple Frosted Glass Style)
  return (
    <header className="sticky top-3.5 z-40 mx-auto w-full max-w-[1600px] px-4 sm:px-6 transition-all">
      <div className="backdrop-blur-2xl bg-white/85 border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-[#1D1D1F] transition-all">
        {/* Left: Back & Title info */}
        <div className="flex items-center gap-3 overflow-hidden">
          <a
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] text-xs font-medium transition-all shadow-2xs shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#005B9A]" />
            <span>กลับตารางหลัก</span>
          </a>
          <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0"></div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono font-semibold text-[11px] bg-sky-50 text-[#005B9A] border border-sky-200/80 px-2.5 py-0.5 rounded-full shadow-2xs shrink-0">
              {props.taskNo}
            </span>
            <span className="text-xs font-semibold text-[#1D1D1F] truncate hidden md:block" title={props.title}>
              {props.title}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={props.onEditTask}
            className="px-3.5 py-1.5 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] rounded-full font-medium text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            title="แก้ไขวันที่และรายละเอียดใบสั่งงาน"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#005B9A]" />
            <span className="hidden sm:inline">แก้ไขข้อมูลงาน</span>
            <span className="sm:hidden">แก้ไข</span>
          </button>

          <button
            onClick={props.onHandover}
            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <span>🤝 ส่งมอบงาน</span>
          </button>

          {props.sheetLink && (
            <a
              href={props.sheetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#6E6E73] hover:text-[#1D1D1F] rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs hidden lg:flex"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>เปิดชีท</span>
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
