"use client"

import React, { useState } from "react"
import { Table as TableIcon, LayoutGrid, Filter, Plus, X } from "lucide-react"
import { DISCIPLINE_CONFIG, DisciplineCode } from "@/types"

interface MobileBottomNavProps {
  viewMode: "table" | "kanban"
  onViewModeChange: (mode: "table" | "kanban") => void
  selectedDiscipline: DisciplineCode | "ALL"
  onSelectDiscipline: (code: DisciplineCode | "ALL") => void
  disciplineCounts: Record<string, number>
  totalCount: number
  onAddTask: () => void
}

export default function MobileBottomNav({
  viewMode,
  onViewModeChange,
  selectedDiscipline,
  onSelectDiscipline,
  disciplineCounts,
  totalCount,
  onAddTask,
}: MobileBottomNavProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const activeDisciplineLabel =
    selectedDiscipline === "ALL"
      ? "ทุกหมวดงาน"
      : DISCIPLINE_CONFIG[selectedDiscipline]?.shortName || selectedDiscipline

  return (
    <>
      {/* 📱 Mobile Floating Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-4 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
          {/* Table View Tab */}
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              viewMode === "table"
                ? "text-[#005B9A] font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <TableIcon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">ตาราง</span>
          </button>

          {/* Kanban Board Tab */}
          <button
            type="button"
            onClick={() => onViewModeChange("kanban")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              viewMode === "kanban"
                ? "text-[#005B9A] font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">บอร์ด</span>
          </button>

          {/* Quick Add FAB in Center */}
          <button
            type="button"
            onClick={onAddTask}
            className="w-10 h-10 rounded-full bg-[#005B9A] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform shrink-0 -mt-3 border-2 border-white"
            title="เพิ่มงานใหม่"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Discipline Filter Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              selectedDiscipline !== "ALL"
                ? "text-[#005B9A] font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Filter className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] truncate max-w-[60px]">{activeDisciplineLabel}</span>
            {selectedDiscipline !== "ALL" && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#005B9A]"></span>
            )}
          </button>
        </div>
      </div>

      {/* 📂 Slide-Up Bottom Drawer for Discipline Filtering */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsDrawerOpen(false)
          }}
        >
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200 text-[#0F172A]">
            {/* Drawer Handle */}
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto"></div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">กรองตามหมวดงาน (Disciplines)</h3>
                <p className="text-xs text-slate-500">เลือกหมวดงานที่ต้องการดูข้อมูล</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Discipline Selection List */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onSelectDiscipline("ALL")
                  setIsDrawerOpen(false)
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                  selectedDiscipline === "ALL"
                    ? "bg-[#005B9A] text-white border-[#005B9A] shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>ทั้งหมด (ทุกหมวดงาน)</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  selectedDiscipline === "ALL" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {totalCount}
                </span>
              </button>

              {(["W11", "W12", "W13", "W14"] as DisciplineCode[]).map((code) => {
                const conf = DISCIPLINE_CONFIG[code]
                const count = disciplineCounts[code] || 0
                const isSelected = selectedDiscipline === code

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      onSelectDiscipline(code)
                      setIsDrawerOpen(false)
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                      isSelected
                        ? "bg-[#005B9A] text-white border-[#005B9A] shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${conf.dotColor}`}></span>
                      <span>{conf.fullName}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
