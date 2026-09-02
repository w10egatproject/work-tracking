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
  const year = d.getFullYear() + 543
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
      className="fixed inset-0 bg-black/40 z-60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200/80 animate-in zoom-in-95 duration-150 text-[#0F172A]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#005B9A] flex items-center justify-center font-bold border border-sky-100">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-[#0F172A]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Month Navigation Header */}
        <div className="flex items-center justify-between py-2 px-1 mb-2 bg-slate-50 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-xl hover:bg-white text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="font-bold text-xs text-[#0F172A] flex items-center gap-1">
            <span>{THAI_MONTH_FULL[currentMonth]}</span>
            <span className="font-mono text-[11px] text-[#005B9A] font-bold">{thaiYear}</span>
          </div>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-xl hover:bg-white text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {THAI_DAYS.map((day, idx) => (
            <div
              key={day}
              className={`text-[10px] font-bold py-1 ${
                idx === 0 || idx === 6 ? "text-rose-600" : "text-slate-500"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((cell, idx) => {
            const isSelected = isSameDay(cell.date, selectedDay)
            const isToday = isSameDay(cell.date, new Date())

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDay(cell.date)}
                className={`h-8 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                  isSelected
                    ? "bg-[#005B9A] text-white shadow-xs scale-105"
                    : isToday
                    ? "border border-[#005B9A] text-[#005B9A] bg-sky-50"
                    : cell.isCurrentMonth
                    ? "text-[#0F172A] hover:bg-slate-100"
                    : "text-slate-300 opacity-50 hover:opacity-100"
                }`}
              >
                <span>{cell.dayNum}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Date Summary & Confirm Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="text-[11px] font-mono text-[#005B9A] font-bold bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
            {formatThaiDate(selectedDay)}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectDate(selectedDay)
                onClose()
              }}
              className="px-4 py-1.5 bg-[#005B9A] hover:bg-[#004A7D] text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              เลือกวันนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
