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
      className="fixed inset-0 bg-[#19211E]/50 z-60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-[#FAF8F5] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#DDD6C8] animate-in zoom-in-95 duration-150 text-[#19211E]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DDD6C8] mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ECE7DC] text-[#19211E] flex items-center justify-center font-bold border border-[#DDD6C8]">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-[#19211E]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6B7771] hover:text-[#19211E] p-1.5 rounded-full hover:bg-[#ECE7DC] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Month Navigation Header */}
        <div className="flex items-center justify-between py-2 px-1 mb-2 bg-[#ECE7DC]/60 rounded-2xl border border-[#DDD6C8]">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-xl hover:bg-white text-[#19211E] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="font-bold text-xs text-[#19211E] flex items-center gap-1">
            <span>{THAI_MONTH_FULL[currentMonth]}</span>
            <span className="font-mono text-[11px] text-[#C05621]">{thaiYear}</span>
          </div>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-xl hover:bg-white text-[#19211E] transition-colors cursor-pointer"
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
                idx === 0 || idx === 6 ? "text-[#C05621]" : "text-[#6B7771]"
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
                    ? "bg-[#19211E] text-[#FAF8F5] shadow-xs scale-105"
                    : isToday
                    ? "border border-[#19211E] text-[#19211E] bg-[#ECE7DC]/60"
                    : cell.isCurrentMonth
                    ? "text-[#19211E] hover:bg-[#ECE7DC]"
                    : "text-[#98A39E] opacity-50 hover:opacity-100"
                }`}
              >
                <span>{cell.dayNum}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Date Summary & Confirm Action */}
        <div className="mt-4 pt-3 border-t border-[#DDD6C8] flex items-center justify-between gap-2">
          <div className="text-[11px] font-mono text-[#19211E] font-bold bg-[#ECE7DC] px-2.5 py-1 rounded-lg border border-[#DDD6C8]">
            {formatThaiDate(selectedDay)}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-[#ECE7DC] text-[#19211E] rounded-xl text-xs font-bold hover:bg-[#DDD6C8] transition-colors cursor-pointer border border-[#DDD6C8]"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectDate(selectedDay)
                onClose()
              }}
              className="px-4 py-1.5 bg-[#19211E] hover:bg-[#2C3732] text-[#FAF8F5] rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer border border-[#19211E]"
            >
              เลือกวันนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
