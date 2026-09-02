"use client"

import { useState } from "react"
import { DisciplineCode, DISCIPLINE_CONFIG } from "@/types"
import { X, Plus, Calendar as CalendarIcon } from "lucide-react"
import ThaiCalendarPickerModal from "@/components/task/ThaiCalendarPickerModal"

const THAI_MONTHS: Record<string, number> = {
  "ม.ค.": 0, "ก.พ.": 1, "มี.ค.": 2, "เม.ย.": 3, "พ.ค.": 4, "มิ.ย.": 5,
  "ก.ค.": 6, "ส.ค.": 7, "ก.ย.": 8, "ต.ค.": 9, "พ.ย.": 10, "ธ.ค.": 11,
}
const THAI_MONTH_NAMES = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]

function parseThaiDate(str?: string): Date {
  if (!str) return new Date()
  const clean = str.trim()
  const parts = clean.split(/\s+/)
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10)
    const monthKey = parts[1].endsWith(".") ? parts[1] : parts[1] + "."
    const month = THAI_MONTHS[monthKey] !== undefined ? THAI_MONTHS[monthKey] : THAI_MONTHS[parts[1]]
    let year = parseInt(parts[2], 10)
    if (year > 2500) year -= 543
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return new Date(year, month, day)
    }
  }
  return new Date()
}

function formatThaiDate(d: Date): string {
  const day = d.getDate()
  const month = THAI_MONTH_NAMES[d.getMonth()]
  const year = d.getFullYear() + (d.getFullYear() < 2500 ? 543 : 0)
  return `${day} ${month} ${year}`
}

function calculateDayDifference(startStr?: string, endStr?: string): number {
  const s = parseThaiDate(startStr)
  const e = parseThaiDate(endStr)
  if (!s || !e) return 1
  const diffTime = e.getTime() - s.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays > 0 ? diffDays : 1
}

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (task: any) => void
}

export default function AddTaskDialog({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = useState("")
  const [wo, setWo] = useState("")
  const [reportDate, setReportDate] = useState(
    formatThaiDate(new Date())
  )
  const [completionDate, setCompletionDate] = useState("")
  const [totalDays, setTotalDays] = useState(60)
  const [equip, setEquip] = useState("")
  const [link, setLink] = useState("")
  const [selectedDisciplines, setSelectedDisciplines] = useState<DisciplineCode[]>(["W11", "W12", "W13", "W14"])
  const [submitting, setSubmitting] = useState(false)

  // Modern Calendar Picker State
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarTarget, setCalendarTarget] = useState<"reportDate" | "completionDate">("reportDate")
  const [calendarTitle, setCalendarTitle] = useState("")

  const handleOpenCalendar = (target: "reportDate" | "completionDate", modalTitle: string) => {
    setCalendarTarget(target)
    setCalendarTitle(modalTitle)
    setCalendarOpen(true)
  }

  const handleSelectDate = (date: Date) => {
    const formatted = formatThaiDate(date)
    if (calendarTarget === "reportDate") {
      setReportDate(formatted)
      if (completionDate) {
        setTotalDays(calculateDayDifference(formatted, completionDate))
      }
    } else {
      setCompletionDate(formatted)
      if (reportDate) {
        setTotalDays(calculateDayDifference(reportDate, formatted))
      }
    }
  }

  if (!open) return null

  const toggleDiscipline = (code: DisciplineCode) => {
    if (selectedDisciplines.includes(code)) {
      if (selectedDisciplines.length > 1) {
        setSelectedDisciplines(selectedDisciplines.filter((d) => d !== code))
      }
    } else {
      setSelectedDisciplines([...selectedDisciplines, code])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    const completionCodesStr = selectedDisciplines.map((d) => DISCIPLINE_CONFIG[d].num).join(",")

    const taskPayload = {
      title: title.trim(),
      wo: wo.trim(),
      report_date: reportDate,
      completion_date: completionDate,
      completion_codes: completionCodesStr,
      total_days: Number(totalDays) || 30,
      equip: equip.trim(),
      link: link.trim(),
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskPayload),
      })
      if (res.ok) {
        const created = await res.json()
        onAdd(created)
      } else {
        onAdd({ ...taskPayload, id: String(Date.now()), taskNo: `งานที่-ใหม่` })
      }
    } catch (err) {
      onAdd({ ...taskPayload, id: String(Date.now()), taskNo: `งานที่-ใหม่` })
    } finally {
      setSubmitting(false)
      setTitle("")
      setWo("")
      setEquip("")
      setLink("")
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-[#19211E]/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-[#FAF8F5] rounded-2xl w-full max-w-xl shadow-2xl border border-[#DDD6C8] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#19211E] text-[#FAF8F5] px-6 py-4 flex items-center justify-between border-b border-[#2C3732]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2C3732] border border-[#DDD6C8]/30 flex items-center justify-center text-lg shadow-xs">
              📝
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight">เพิ่มใบสั่งงานซ่อมบำรุงใหม่</h2>
              <p className="text-xs text-[#98A39E]">บันทึกลงแผ่นงาน &quot;ลำดับงาน&quot; พร้อมสร้างแผนงานย่อยอัตโนมัติ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#98A39E] hover:text-[#FAF8F5] p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-[#19211E]">
          <div>
            <label className="block font-bold text-[#19211E] mb-1">
              รายการ / ชื่องานซ่อมบำรุง <span className="text-[#C05621]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น สร้างอุปกรณ์จับยก Bearing จำนวน 1 SE"
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6C8] rounded-xl text-xs focus:bg-white focus:border-[#19211E] focus:ring-1 focus:ring-[#19211E] outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-[#19211E] mb-1">
                เลข Work Order (W/O)
              </label>
              <input
                type="text"
                value={wo}
                onChange={(e) => setWo(e.target.value)}
                placeholder="เช่น 3816627"
                className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6C8] rounded-xl text-xs font-mono font-bold text-[#19211E] focus:bg-white focus:border-[#19211E] outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#19211E] mb-1 flex items-center justify-between">
                <span>วันที่เริ่มงาน <span className="text-[#C05621]">*</span></span>
                <span className="text-[10px] text-[#C05621] font-normal">(คลิกเลือกปฏิทิน)</span>
              </label>
              <button
                type="button"
                onClick={() => handleOpenCalendar("reportDate", "เลือกวันที่เริ่มงาน")}
                className="w-full px-3.5 py-2.5 bg-white hover:bg-[#ECE7DC]/60 border border-[#DDD6C8] hover:border-[#19211E] rounded-xl text-xs font-semibold text-[#19211E] flex items-center justify-between transition-all cursor-pointer text-left focus:ring-1 focus:ring-[#19211E]"
              >
                <span>{reportDate || "เลือกวันที่เริ่มงาน"}</span>
                <CalendarIcon className="w-4 h-4 text-[#19211E]" />
              </button>
            </div>
          </div>

          {/* Disciplines Selection (W11-W14) */}
          <div>
            <label className="block font-bold text-[#19211E] mb-1.5 flex items-center justify-between">
              <span>หมวดงานที่ร่วมงาน (W Codes) <span className="text-[#C05621]">*</span></span>
              <span className="text-[11px] text-[#6B7771] font-normal">เลือกลำดับหมวดที่เกี่ยวข้อง</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["W11", "W12", "W13", "W14"] as DisciplineCode[]).map((code) => {
                const conf = DISCIPLINE_CONFIG[code]
                const isSelected = selectedDisciplines.includes(code)
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => toggleDiscipline(code)}
                    className={`px-3 py-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? `${conf.lightBg} ${conf.borderClass} ring-1 ring-[#19211E]/30 shadow-2xs font-bold`
                        : "bg-white border-[#DDD6C8] text-[#98A39E] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] text-white font-bold ${conf.barClass}`}
                      >
                        ✓
                      </span>
                      <span className="text-xs font-bold text-[#19211E]">{conf.fullName}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#DDD6C8] text-[#19211E]">
                      {conf.num}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-[#19211E] mb-1 flex items-center justify-between">
                <span>วันที่คาดว่าจะแล้วเสร็จ</span>
                <span className="text-[10px] text-[#C05621] font-normal">(คลิกเลือกปฏิทิน)</span>
              </label>
              <button
                type="button"
                onClick={() => handleOpenCalendar("completionDate", "เลือกวันที่คาดว่าจะแล้วเสร็จ")}
                className="w-full px-3.5 py-2.5 bg-white hover:bg-[#ECE7DC]/60 border border-[#DDD6C8] hover:border-[#19211E] rounded-xl text-xs font-semibold text-[#19211E] flex items-center justify-between transition-all cursor-pointer text-left focus:ring-1 focus:ring-[#19211E]"
              >
                <span className={completionDate ? "text-[#19211E]" : "text-[#98A39E] font-normal"}>
                  {completionDate || "เช่น 30 มี.ค. 2026"}
                </span>
                <CalendarIcon className="w-4 h-4 text-[#19211E]" />
              </button>
            </div>
            <div>
              <label className="block font-bold text-[#19211E] mb-1">
                ระยะเวลาทั้งหมด (วัน)
              </label>
              <input
                type="number"
                min={1}
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6C8] rounded-xl text-xs font-mono focus:bg-white focus:border-[#19211E] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#19211E] mb-1">
              อุปกรณ์ / เครื่องจักร (Equip)
            </label>
            <input
              type="text"
              value={equip}
              onChange={(e) => setEquip(e.target.value)}
              placeholder="เช่น 270006 Reclaimer 6 หรือ 240007 Crusher 3"
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6C8] rounded-xl text-xs focus:bg-white focus:border-[#19211E] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#19211E] mb-1">
              ลิ้งค์ Google Sheets
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6C8] rounded-xl text-xs focus:bg-white focus:border-[#19211E] outline-none"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DDD6C8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ECE7DC] text-[#19211E] border border-[#DDD6C8] rounded-xl text-xs font-bold hover:bg-[#DDD6C8] transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-[#19211E] hover:bg-[#2C3732] text-[#FAF8F5] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer border border-[#19211E]"
            >
              {submitting ? "กำลังบันทึก..." : "✓ บันทึกงานใหม่"}
            </button>
          </div>
        </form>
      </div>

      {/* Modern Thai Calendar Picker Modal */}
      {calendarOpen && (
        <ThaiCalendarPickerModal
          title={calendarTitle}
          initialDate={parseThaiDate(calendarTarget === "reportDate" ? reportDate : completionDate)}
          onSelectDate={handleSelectDate}
          onClose={() => setCalendarOpen(false)}
        />
      )}
    </div>
  )
}
