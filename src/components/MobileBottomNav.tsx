"use client"

import React, { useState } from "react"
import { Table as TableIcon, LayoutGrid, Filter, Plus, RefreshCw, X, Check, Layers } from "lucide-react"
import { DisciplineCode } from "@/types"

interface Props {
  viewMode: "table" | "kanban"
  onViewModeChange: (mode: "table" | "kanban") => void
  selectedDiscipline: string
  onSelectDiscipline: (code: string) => void
  selectedStatus: string
  onSelectStatus: (status: string) => void
  counts: {
    all: number
    w11: number
    w12: number
    w13: number
    w14: number
  }
  refreshing: boolean
  onRefresh: () => void
  onAddTask: () => void
}

export default function MobileBottomNav({
  viewMode,
  onViewModeChange,
  selectedDiscipline,
  onSelectDiscipline,
  selectedStatus,
  onSelectStatus,
  counts,
  refreshing,
  onRefresh,
  onAddTask,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isFilterActive = selectedDiscipline !== "ALL" || selectedStatus !== "ALL"

  return (
    <>
      {/* 📱 Sticky Bottom Navigation Bar (Mobile Viewports) */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#DDD6C8] shadow-[0_-4px_20px_rgba(25,33,30,0.06)] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
          {/* 1. Table View */}
          <button
            onClick={() => onViewModeChange("table")}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
              viewMode === "table"
                ? "text-[#19211E] font-bold bg-[#ECE7DC]"
                : "text-[#6B7771] hover:text-[#19211E]"
            }`}
          >
            <TableIcon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">ตาราง</span>
          </button>

          {/* 2. Kanban Board View */}
          <button
            onClick={() => onViewModeChange("kanban")}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
              viewMode === "kanban"
                ? "text-[#19211E] font-bold bg-[#ECE7DC]"
                : "text-[#6B7771] hover:text-[#19211E]"
            }`}
          >
            <LayoutGrid className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">บอร์ด</span>
          </button>

          {/* 3. Primary Add Task Action Button */}
          <button
            onClick={onAddTask}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-[#19211E] text-[#F5F2EB] shadow-md hover:bg-[#2C3732] active:scale-95 transition-transform shrink-0 -mt-3 border-2 border-[#FAF8F5]"
            title="เพิ่มงานใหม่"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* 4. Filter Drawer Trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
              isFilterActive
                ? "text-[#C05621] font-bold bg-[#FDF2EC]"
                : "text-[#6B7771] hover:text-[#19211E]"
            }`}
          >
            <Filter className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">ตัวกรอง</span>
            {isFilterActive && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#C05621] ring-2 ring-[#FAF8F5]" />
            )}
          </button>

          {/* 5. Refresh */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[#6B7771] hover:text-[#19211E] active:scale-95 transition-all"
          >
            <RefreshCw className={`w-4 h-4 mb-0.5 ${refreshing ? "animate-spin text-[#19211E]" : ""}`} />
            <span className="text-[10px] tracking-tight">รีเฟรช</span>
          </button>
        </div>
      </nav>

      {/* 📑 Slide-Up Filter Drawer (Bottom Sheet) */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-[#19211E]/50 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Sheet Container */}
          <div className="relative w-full max-h-[85vh] bg-[#FAF8F5] border-t border-[#DDD6C8] rounded-t-3xl shadow-[0_-10px_40px_rgba(25,33,30,0.2)] p-5 overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] z-10 animate-in slide-in-from-bottom duration-200">
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-[#DDD6C8] rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD6C8]">
              <div>
                <h3 className="text-base font-bold text-[#19211E] tracking-tight">ตัวกรองงานซ่อมบำรุง</h3>
                <p className="text-xs text-[#6B7771]">เลือกหมวดงานและสถานะที่ต้องการแสดง</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#ECE7DC] text-[#19211E] flex items-center justify-center hover:bg-[#DDD6C8] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 1: Disciplines (หมวดงาน W11 - W14) */}
            <div className="mt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B7771] block mb-2.5">
                หมวดงาน (Discipline)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { code: "ALL", label: "ทุกหมวดงาน", desc: "รวมทุกหมวด W11-W14", count: counts.all },
                  { code: "W11", label: "W11 วิศวกรรม", desc: "Engineering", count: counts.w11 },
                  { code: "W12", label: "W12 เครื่องกล", desc: "Mechanical", count: counts.w12 },
                  { code: "W13", label: "W13 ซ่อมเครื่องจักรกล", desc: "Machinery Repair", count: counts.w13 },
                  { code: "W14", label: "W14 ซ่อมอุปกรณ์เครื่องจักรกล", desc: "Equipment Repair", count: counts.w14 },
                ].map((item) => {
                  const isSelected = selectedDiscipline === item.code
                  return (
                    <button
                      key={item.code}
                      onClick={() => onSelectDiscipline(item.code)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-[#ECE7DC] border-[#19211E] text-[#19211E] font-bold shadow-2xs"
                          : "bg-white border-[#DDD6C8] text-[#434E49] hover:bg-[#F5F2EB]"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold">{item.label}</div>
                        <div className="text-[11px] text-[#6B7771]">{item.desc}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#DDD6C8]">
                          {item.count}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#19211E]" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Section 2: Progress Status (สถานะการดำเนินงาน) */}
            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B7771] block mb-2.5">
                สถานะการดำเนินงาน (Progress Status)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: "ALL", label: "ทุกสถานะ" },
                  { code: "ดำเนินการ", label: "ดำเนินการ", color: "text-[#C05621] bg-[#FDF2EC] border-[#F7CEB9]" },
                  { code: "เสร็จ", label: "เสร็จ", color: "text-[#1B5E3B] bg-[#E8F4EC] border-[#B8DCBD]" },
                  { code: "รอดำเนินการ", label: "รอดำเนินการ", color: "text-[#B45309] bg-[#FEF3C7] border-[#FDE68A]" },
                ].map((item) => {
                  const isSelected = selectedStatus === item.code
                  return (
                    <button
                      key={item.code}
                      onClick={() => onSelectStatus(item.code)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-[#19211E] text-[#FAF8F5] border-[#19211E]"
                          : "bg-white border-[#DDD6C8] text-[#434E49] hover:bg-[#F5F2EB]"
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  onSelectDiscipline("ALL")
                  onSelectStatus("ALL")
                }}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#DDD6C8] bg-white text-xs font-bold text-[#434E49] hover:bg-[#F5F2EB]"
              >
                ล้างตัวกรอง
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#19211E] text-xs font-bold text-[#FAF8F5] hover:bg-[#2C3732] shadow-sm"
              >
                นำไปใช้ ({counts.all} รายการ)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
