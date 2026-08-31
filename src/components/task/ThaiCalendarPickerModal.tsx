"use client"

import React, { useState, useMemo } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react"

const THAI_MONTH_FULL = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
]
const THAI_MONTH_NAMES = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
const THAI_DAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."]

function formatThaiDate(d: Date): string {
  const day = d.getDate()
  const month = THAI_MONTH_NAMES[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

interface ThaiCalendarPickerModalProps {
  title: string
  initialDate: Date
  onSelectDate: (date: Date) => void
  onClose: () => void
}

export default function ThaiCalendarPickerModal({
  title,
  initialDate,
  onSelectDate,
  onClose,
}: ThaiCalendarPickerModalProps) {
  const [viewDate, setViewDate] = useState<Date>(new Date(initialDate))
  const [selectedDay, setSelectedDay] = useState<Date>(new Date(initialDate))

  const currentYear = viewDate.getFullYear()
  const currentMonth = viewDate.getMonth()
  const thaiYear = currentYear + 543

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Calculate calendar grid (42 cells: 6 weeks)
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

    const cells: { date: Date; isCurrentMonth: boolean; dayNum: number }[] = []

    // Prev month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, daysInPrevMonth - i)
      cells.push({ date: d, isCurrentMonth: false, dayNum: d.getDate() })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth, i)
      cells.push({ date: d, isCurrentMonth: true, dayNum: i })
    }

    // Next month days
    const remaining = 42 - cells.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(currentYear, currentMonth + 1, i)
      cells.push({ date: d, isCurrentMonth: false, dayNum: i })
    }

    return cells
  }, [currentYear, currentMonth])

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-60 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-black/[0.08] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sky-50 text-[#005B9A] flex items-center justify-center font-bold">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-xs text-[#1D1D1F]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#86868B] hover:text-[#1D1D1F] p-1 rounded-full hover:bg-[#F5F5F7] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Month & Year Navigation Bar */}
        <div className="flex items-center justify-between bg-[#F5F5F7] p-2 rounded-2xl border border-black/[0.04] mb-3">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-full text-[#6E6E73] hover:bg-white hover:text-[#005B9A] shadow-2xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="font-bold text-xs text-[#1D1D1F]">
            <span>{THAI_MONTH_FULL[currentMonth]}</span>{" "}
            <span className="font-mono text-[#005B9A]">{currentYear}</span>{" "}
            <span className="text-[10px] text-[#86868B] font-normal">({thaiYear})</span>
          </div>

          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-full text-[#6E6E73] hover:bg-white hover:text-[#005B9A] shadow-2xs transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[10px] text-[#86868B] mb-1">
          {THAI_DAYS.map((day, idx) => (
            <div key={idx} className={idx === 0 || idx === 6 ? "text-amber-600" : ""}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Day Cells Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {calendarCells.map((cell, idx) => {
            const isSelected = isSameDay(cell.date, selectedDay)
            const isToday = isSameDay(cell.date, new Date())

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDay(cell.date)}
                className={`py-2 rounded-xl font-semibold transition-all text-xs flex flex-col items-center justify-center relative cursor-pointer ${
                  isSelected
                    ? "bg-[#005B9A] text-white shadow-xs scale-105"
                    : cell.isCurrentMonth
                    ? "text-[#1D1D1F] hover:bg-sky-50 hover:text-[#005B9A]"
                    : "text-[#D2D2D7] hover:bg-[#FAFAFC]"
                } ${isToday && !isSelected ? "ring-1 ring-[#005B9A]" : ""}`}
              >
                <span>{cell.dayNum}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Date Summary */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-[11px] font-medium text-[#86868B]">
            วันที่เลือก: <span className="font-mono text-[#005B9A] font-bold">{formatThaiDate(selectedDay)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedDay(new Date())}
              className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED] transition-colors cursor-pointer"
            >
              วันนี้
            </button>
            <button
              type="button"
              onClick={() => onSelectDate(selectedDay)}
              className="px-4 py-1 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-full text-xs font-medium transition-all shadow-xs cursor-pointer"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
