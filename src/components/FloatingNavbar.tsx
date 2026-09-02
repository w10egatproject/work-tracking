"use client"

import React from "react"
import { ArrowLeft, Edit2, ExternalLink, RefreshCw, Plus, Calendar, Table as TableIcon, LayoutGrid, Trash2 } from "lucide-react"

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
  onDeleteTask?: () => void
}

type FloatingNavbarProps = DashboardNavProps | TaskDetailNavProps

export default function FloatingNavbar(props: FloatingNavbarProps) {
  if (props.type === "dashboard") {
    return (
      <header className="sticky top-3.5 z-40 mx-auto w-full max-w-[1600px] px-3 sm:px-6 transition-all">
        <div className="backdrop-blur-xl bg-white/90 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] rounded-2xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-[#0F172A] transition-all">
          {/* Left: Branding & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#005B9A] to-[#0284C7] text-white flex items-center justify-center text-sm font-bold shadow-xs shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
                  <span>W10 Operations</span>
                  <span className="text-slate-400 text-xs font-normal hidden lg:inline">
                    | ระบบติดตามงานซ่อมบำรุงประจำแผนก
                  </span>
                </h1>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live Sync</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal hidden sm:block mt-0.5">
                กฟผ. แม่เมาะ • W11 วิศวกรรม • W12 เครื่องกล • W13 ซ่อมเครื่องจักร • W14 ซ่อมอุปกรณ์
              </p>
            </div>
          </div>

          {/* Right: View Switcher, Date, Refresh & Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* View Mode Segmented Controls */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
              <button
                onClick={() => props.onViewModeChange("table")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                  props.viewMode === "table"
                    ? "bg-white text-[#005B9A] shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="มุมมองตารางรายการ"
              >
                <TableIcon className="w-3.5 h-3.5 text-[#005B9A]" />
                <span className="hidden md:inline">ตาราง</span>
              </button>

              <button
                onClick={() => props.onViewModeChange("kanban")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                  props.viewMode === "kanban"
                    ? "bg-white text-[#005B9A] shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="มุมมองบอร์ด Kanban"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#005B9A]" />
                <span className="hidden md:inline">บอร์ด</span>
              </button>
            </div>

            {/* Date */}
            <div className="text-xs text-slate-500 hidden xl:flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl font-medium border border-slate-200/80">
              <Calendar className="w-3.5 h-3.5 text-[#005B9A]" />
              <span className="text-[11px]">{props.todayStr}</span>
            </div>

            {/* Refresh */}
            <button
              onClick={props.onRefresh}
              disabled={props.refreshing}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95 cursor-pointer border border-slate-200/80"
              title="รีเฟรชข้อมูลจาก Master Sheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#005B9A] ${props.refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">รีเฟรช</span>
            </button>

            {/* Add Task Primary Action */}
            <button
              onClick={props.onAddTask}
              className="px-3.5 py-1.5 rounded-xl bg-[#005B9A] hover:bg-[#004A7D] text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer border border-transparent"
              title="เพิ่มใบสั่งงานใหม่"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>สร้างงานใหม่</span>
            </button>
          </div>
        </div>
      </header>
    )
  }

  // Task Detail Navbar
  return (
    <header className="sticky top-3.5 z-40 mx-auto w-full max-w-[1600px] px-3 sm:px-6 transition-all">
      <div className="backdrop-blur-xl bg-white/90 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] rounded-2xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-[#0F172A] transition-all">
        {/* Left: Back & Breadcrumb */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-[#0F172A] flex items-center justify-center transition-all active:scale-95 shrink-0"
            title="กลับสู่หน้าภาพรวมแดชบอร์ด"
          >
            <ArrowLeft className="w-4 h-4 text-[#005B9A]" />
          </a>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#005B9A] bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200/80 font-mono">
                {props.taskNo}
              </span>
              <h1 className="text-sm sm:text-base font-bold text-[#0F172A] tracking-tight line-clamp-1 max-w-[280px] sm:max-w-md md:max-w-lg">
                {props.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {props.sheetLink && (
            <a
              href={props.sheetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] text-xs font-medium flex items-center gap-1.5 border border-slate-200/80 transition-all"
              title="เปิดดูใน Google Sheets"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#005B9A]" />
              <span className="hidden sm:inline">Google Sheets</span>
            </a>
          )}

          <button
            onClick={props.onEditTask}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] text-xs font-medium flex items-center gap-1.5 border border-slate-200/80 transition-all cursor-pointer"
            title="แก้ไขข้อมูลงาน"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#005B9A]" />
            <span className="hidden sm:inline">แก้ไข</span>
          </button>

          <button
            onClick={props.onHandover}
            className="px-3.5 py-1.5 rounded-xl bg-[#005B9A] hover:bg-[#004A7D] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="ส่งมอบงานระหว่างหมวด"
          >
            <span>ส่งมอบงาน</span>
          </button>

          {props.onDeleteTask && (
            <button
              onClick={props.onDeleteTask}
              className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-xs font-medium flex items-center gap-1 border border-slate-200/80 hover:border-rose-200 transition-all cursor-pointer"
              title="ลบงานนี้"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
