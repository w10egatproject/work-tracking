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
        <div className="backdrop-blur-xl bg-[#FAF8F5]/90 border border-[#DDD6C8] shadow-[0_4px_24px_rgba(25,33,30,0.06),0_1px_2px_rgba(25,33,30,0.04)] rounded-2xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-[#19211E] transition-all">
          {/* Left: Branding & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#19211E] text-[#F5F2EB] flex items-center justify-center text-sm font-bold shadow-xs shrink-0 border border-[#DDD6C8]">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-[#19211E] flex items-center gap-2">
                  <span className="font-sans">W10 Operations</span>
                  <span className="text-[#6B7771] text-xs font-normal hidden lg:inline font-sans">
                    | ระบบติดตามงานซ่อมบำรุงโรงงาน
                  </span>
                </h1>
                <span className="bg-[#E8F4EC] text-[#1B5E3B] text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-[#B8DCBD] flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E3B] animate-pulse"></span>
                  <span>Live Sync</span>
                </span>
              </div>
              <p className="text-[11px] text-[#6B7771] font-normal hidden sm:block mt-0.5">
                กฟผ. แม่เมาะ • W11 วิศวกรรม • W12 เครื่องกล • W13 ซ่อมเครื่องจักร • W14 ซ่อมอุปกรณ์
              </p>
            </div>
          </div>

          {/* Right: View Switcher, Date, Refresh & Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* View Mode Segmented Controls */}
            <div className="hidden sm:flex items-center bg-[#ECE7DC] p-0.5 rounded-xl border border-[#DDD6C8]">
              <button
                onClick={() => props.onViewModeChange("table")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                  props.viewMode === "table"
                    ? "bg-[#FAF8F5] text-[#19211E] shadow-2xs font-bold"
                    : "text-[#6B7771] hover:text-[#19211E]"
                }`}
                title="มุมมองตารางรายการ"
              >
                <TableIcon className="w-3.5 h-3.5 text-[#19211E]" />
                <span className="hidden md:inline">ตาราง</span>
              </button>

              <button
                onClick={() => props.onViewModeChange("kanban")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                  props.viewMode === "kanban"
                    ? "bg-[#FAF8F5] text-[#19211E] shadow-2xs font-bold"
                    : "text-[#6B7771] hover:text-[#19211E]"
                }`}
                title="มุมมองบอร์ด Kanban"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#19211E]" />
                <span className="hidden md:inline">บอร์ด</span>
              </button>
            </div>

            {/* Date */}
            <div className="text-xs text-[#6B7771] hidden xl:flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl font-medium border border-[#DDD6C8]">
              <Calendar className="w-3.5 h-3.5 text-[#6B7771]" />
              <span className="text-[11px]">{props.todayStr}</span>
            </div>

            {/* Refresh */}
            <button
              onClick={props.onRefresh}
              disabled={props.refreshing}
              className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#ECE7DC] text-[#19211E] transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95 cursor-pointer border border-[#DDD6C8]"
              title="รีเฟรชข้อมูลจาก Master Sheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#19211E] ${props.refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">รีเฟรช</span>
            </button>

            {/* Add Task Primary Action */}
            <button
              onClick={props.onAddTask}
              className="px-3.5 py-1.5 rounded-xl bg-[#19211E] hover:bg-[#2C3732] text-[#FAF8F5] transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer border border-[#19211E]"
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
      <div className="backdrop-blur-xl bg-[#FAF8F5]/90 border border-[#DDD6C8] shadow-[0_4px_24px_rgba(25,33,30,0.06),0_1px_2px_rgba(25,33,30,0.04)] rounded-2xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-[#19211E] transition-all">
        {/* Left: Back & Breadcrumb */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="w-9 h-9 rounded-xl bg-[#FAF8F5] hover:bg-[#ECE7DC] border border-[#DDD6C8] text-[#19211E] flex items-center justify-center transition-all active:scale-95 shrink-0"
            title="กลับสู่หน้าภาพรวมแดชบอร์ด"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#19211E] bg-[#ECE7DC] px-2.5 py-0.5 rounded-md border border-[#DDD6C8] font-mono">
                {props.taskNo}
              </span>
              <h1 className="text-sm sm:text-base font-bold text-[#19211E] tracking-tight line-clamp-1 max-w-[280px] sm:max-w-md md:max-w-lg">
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
              className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#ECE7DC] text-[#19211E] text-xs font-medium flex items-center gap-1.5 border border-[#DDD6C8] transition-all"
              title="เปิดดูใน Google Sheets"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#19211E]" />
              <span className="hidden sm:inline">Google Sheets</span>
            </a>
          )}

          <button
            onClick={props.onEditTask}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#ECE7DC] text-[#19211E] text-xs font-medium flex items-center gap-1.5 border border-[#DDD6C8] transition-all cursor-pointer"
            title="แก้ไขข้อมูลงาน"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#19211E]" />
            <span className="hidden sm:inline">แก้ไข</span>
          </button>

          <button
            onClick={props.onHandover}
            className="px-3.5 py-1.5 rounded-xl bg-[#19211E] hover:bg-[#2C3732] text-[#FAF8F5] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="ส่งมอบงานระหว่างหมวด"
          >
            <span>ส่งมอบงาน</span>
          </button>

          {props.onDeleteTask && (
            <button
              onClick={props.onDeleteTask}
              className="p-1.5 rounded-xl bg-[#FAF8F5] hover:bg-rose-50 text-rose-700 hover:text-rose-800 text-xs font-medium flex items-center gap-1 border border-[#DDD6C8] hover:border-rose-300 transition-all cursor-pointer"
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
