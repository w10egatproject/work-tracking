"use client"

import { useState } from "react"

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (task: any) => void
}

export default function AddTaskDialog({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = useState("")
  const [wo, setWo] = useState("")
  const [reportDate, setReportDate] = useState("")
  const [completionCodes, setCompletionCodes] = useState("")
  const [progress, setProgress] = useState(0)
  const [equip, setEquip] = useState("")
  const [link, setLink] = useState("")

  const handleSubmit = () => {
    if (!title.trim()) return
    onAdd({ id: String(Date.now()), title: title.trim(), wo, report_date: reportDate, completion_codes: completionCodes, completion_date: "", progress, equip, link })
    setTitle(""); setWo(""); setReportDate(""); setCompletionCodes(""); setProgress(0); setEquip(""); setLink("")
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-xl p-6 w-[480px] max-w-[90vw] shadow-lg">
        <h2 className="text-base font-semibold mb-4">เพิ่มงานใหม่</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">ชื่องาน *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="กรอกชื่องาน..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">W/O</label>
              <input type="text" value={wo} onChange={(e) => setWo(e.target.value)} placeholder="เลข Work Order" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">วันที่แจ้งงาน</label>
              <input type="text" value={reportDate} onChange={(e) => setReportDate(e.target.value)} placeholder="เช่น 17 ก.พ. 2025" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">วันที่เสร็จ (รหัส)</label>
              <input type="text" value={completionCodes} onChange={(e) => setCompletionCodes(e.target.value)} placeholder="เช่น 11,12,13" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Progress (%)</label>
              <input type="number" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Equip</label>
            <input type="text" value={equip} onChange={(e) => setEquip(e.target.value)} placeholder="อุปกรณ์ (ถ้ามี)" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">ลิ้งค์</label>
            <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">ยกเลิก</button>
          <button onClick={handleSubmit} className="px-3 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">บันทึก</button>
        </div>
      </div>
    </div>
  )
}
