"use client"

import { Task } from "@/types"

interface Props {
  tasks: Task[]
}

export default function TaskTable({ tasks }: Props) {
  return (
    <div className="px-8 pb-8">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase w-10">#</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">ชื่องาน</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase w-24">W/O</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase w-28">วันที่แจ้งงาน</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase w-28">วันที่เสร็จ</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase w-28">Progress</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase w-40">Equip</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase w-16">ลิ้งค์</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase w-16"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-2.5 px-4 text-sm text-gray-400">{i + 1}</td>
                <td className="py-2.5 px-4 text-sm font-medium max-w-xs truncate" title={task.title}>{task.title}</td>
                <td className="py-2.5 px-4 text-xs font-mono text-gray-600">{task.wo}</td>
                <td className="py-2.5 px-4 text-xs text-gray-500">{task.report_date}</td>
                <td className="py-2.5 px-4 text-xs text-gray-500">{task.completion_codes || "-"}</td>
                <td className="py-2.5 px-4">
                  {task.progress > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: task.progress + "%" }}></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-600 w-8 text-right">{task.progress}%</span>
                    </div>
                  ) : <span className="text-xs text-gray-300">-</span>}
                </td>
                <td className="py-2.5 px-4 text-xs text-gray-500">{task.equip || "-"}</td>
                <td className="py-2.5 px-4">
                  {task.link ? (
                    <a href={task.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-700 hover:underline truncate block max-w-[100px]">เปิดลิ้งค์</a>
                  ) : <span className="text-xs text-gray-300">-</span>}
                </td>
                <td className="py-2.5 px-4">
                  <a href={"/task/" + task.id} className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-500 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors inline-block">ดู</a>
                </td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div>
    </div>
  )
}
