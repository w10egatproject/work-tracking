"use client"

import { Task } from "@/types"

export default function SummaryCards({ tasks }: { tasks: Task[] }) {
  const total = tasks.length
  const withEquip = tasks.filter(t => t.equip).length
  const withLink = tasks.filter(t => t.link).length
  const done = tasks.filter(t => t.completion_codes).length

  return (
    <div className="grid grid-cols-4 gap-3 px-8 py-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">📊</div>
        <div>
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-xs text-gray-500">งานทั้งหมด</div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-lg">🏭</div>
        <div>
          <div className="text-2xl font-bold">{withEquip}</div>
          <div className="text-xs text-gray-500">มี Equip</div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-lg">🔗</div>
        <div>
          <div className="text-2xl font-bold">{withLink}</div>
          <div className="text-xs text-gray-500">มีลิ้งค์</div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-lg">✅</div>
        <div>
          <div className="text-2xl font-bold">{done}</div>
          <div className="text-xs text-gray-500">มีรหัสเสร็จ</div>
        </div>
      </div>
    </div>
  )
}
