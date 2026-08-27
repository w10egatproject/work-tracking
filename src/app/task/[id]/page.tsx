"use client"

import { useParams } from "next/navigation"

const TASK_DETAILS: Record<string, any> = {
  "1": {
    id: "1",
    title: "ซ่อมงาน สร้างบูชลูกกลิ้ง Bearing จักรวาล 1 SE",
    wo: "3816627",
    report_date: "1 ต.ค. 2024",
    completion_date: "30 มี.ค. 2026",
    equip: "",
    completion_codes: "12,13",
    total_days: 756,
    subtasks: [
      { category: "W12: หมวดเครื่องกล", start: "1 ต.ค. 2024", days: 548, end: "30 มี.ค. 2026", progress: 20, status: "เสร็จบางส่วน", bg: "bg-orange-100", barColor: "bg-orange-400" },
      { category: "ทีมงานเครื่องจักรกลและทีมงาน", start: "1 ต.ค. 2024", days: 1, end: "1 ต.ค. 2024", progress: 100, status: "เสร็จ", bg: "bg-blue-100", barColor: "bg-blue-500" },
      { category: "", start: "", days: 0, end: "", progress: 0, status: "รอติดตามงาน", bg: "bg-orange-100", barColor: "bg-orange-400" },
      { category: "", start: "", days: 0, end: "", progress: 0, status: "รอติดตามงาน", bg: "bg-orange-100", barColor: "bg-orange-400" },
      { category: "", start: "", days: 0, end: "", progress: 0, status: "รอติดตามงาน", bg: "bg-orange-100", barColor: "bg-orange-400" },
      { category: "W13: เชื่อมเครื่องจักรกล", start: "1 มี.ค. 2026", days: 30, end: "30 มี.ค. 2026", progress: 0, status: "รอติดตามงาน", bg: "bg-orange-100", barColor: "bg-orange-400" },
      { category: "", start: "30", days: 0, end: "30 มี.ค. 2026", progress: 0, status: "รอติดตามงาน", bg: "bg-orange-100", barColor: "bg-orange-400" },
      { category: "", start: "", days: 0, end: "", progress: 0, status: "รอติดตามงาน", bg: "bg-orange-100", barColor: "bg-orange-400" },
      { category: "", start: "", days: 0, end: "", progress: 0, status: "รอติดตามงาน", bg: "bg-orange-100", barColor: "bg-orange-400" },
      { category: "", start: "", days: 0, end: "", progress: 0, status: "รอติดตามงาน", bg: "bg-orange-100", barColor: "bg-orange-400" },
    ],
    gantt: {
      months: ["ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย."],
      bars: [
        { label: "W12: หมวดเครื่องกล", startIdx: 0, width: 6, color: "bg-orange-400", progress: 20 },
        { label: "", startIdx: 0, width: 0.1, color: "bg-blue-500", progress: 100 },
      ]
    }
  },
}

for (let i = 2; i <= 24; i++) {
  if (!TASK_DETAILS[i]) {
    TASK_DETAILS[i] = { id: String(i), title: "งานซ่อมบำรุง #" + i, wo: "", report_date: "", completion_date: "", equip: "", completion_codes: "", total_days: 0, subtasks: [], gantt: { months: ["ต.ค.", "พ.ย."], bars: [] } };
  }
}
export default function TaskDetail() {
  const params = useParams()
  const taskId = params.id as string
  const task = TASK_DETAILS[taskId]

  if (!task) return <div className="flex items-center justify-center py-20 text-gray-400 text-sm">ไม่พบงาน</div>

  const subtasks = task.subtasks || []

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4 sticky top-0 z-10">
        <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← กลับ</a>
        <h1 className="text-lg font-semibold">📋 รายละเอียดงาน</h1>
      </div>

      <div className="px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
            <div className="text-xs text-gray-400">งานที่</div>
            <div className="text-sm font-bold bg-amber-100 px-3 py-1 rounded">{task.id}</div>
          </div>
          <div className="mb-4"><div className="text-base font-bold text-gray-800">{task.title}</div></div>
          <div className="grid grid-cols-4 gap-4">
            <div><div className="text-xs text-gray-400 mb-1">วันที่แจ้งงาน</div><div className="text-sm font-medium bg-amber-100 px-2 py-0.5 rounded inline-block">{task.report_date}</div></div>
            <div><div className="text-xs text-gray-400 mb-1">W/O</div><div className="text-sm font-medium bg-amber-100 px-2 py-0.5 rounded inline-block">{task.wo}</div></div>
            <div><div className="text-xs text-gray-400 mb-1">วันที่เสร็จงาน</div><div className="text-sm font-medium">{task.completion_date || "-"}</div></div>
            <div><div className="text-xs text-gray-400 mb-1">Equip</div><div className="text-sm font-medium">{task.equip || "-"}</div></div>
            <div><div className="text-xs text-gray-400 mb-1">วันเดือนปีที่คาดว่าจะแล้วเสร็จ</div><div className="text-sm font-medium">{task.completion_date || "-"}</div></div>
            <div><div className="text-xs text-gray-400 mb-1">W</div><div className="text-sm font-medium">{task.completion_codes}</div></div>
            <div><div className="text-xs text-gray-400 mb-1">ระยะเวลาทั้งหมด(วัน)</div><div className="text-sm font-medium">{task.total_days || "-"}</div></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 overflow-x-auto">
          <h2 className="text-sm font-semibold mb-4">📅 Timeline</h2>
          <div className="min-w-[800px]">
            <div className="flex border-b border-gray-200 pb-2 mb-2">
              <div className="w-48 flex-shrink-0 text-xs font-medium text-gray-500">ชื่องาน</div>
              {task.gantt.months.map((m: string, i: number) => (
                <div key={i} className="flex-1 text-center text-xs text-gray-400">{m}</div>
              ))}
            </div>
            {task.gantt.bars.length > 0 ? task.gantt.bars.map((bar: any, i: number) => (
              <div key={i} className="flex items-center py-2 border-b border-gray-100">
                <div className="w-48 flex-shrink-0 text-xs font-medium text-gray-600 truncate pr-2">{bar.label}</div>
                <div className="flex-1 relative h-6">
                  <div
                    className={"absolute h-5 rounded " + bar.color}
                    style={{ left: (bar.startIdx / task.gantt.months.length * 100) + "%", width: Math.max(bar.width / task.gantt.months.length * 100, 4) + "%" }}
                  ></div>
                </div>
              </div>
            )) : (
              <div className="text-xs text-gray-400 py-4 text-center">ยังไม่มีข้อมูล timeline</div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600">📋 รายละเอียดงานย่อย ({subtasks.length} รายการ)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500">#</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500">หมวดงาน</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500">วันที่เริ่มงาน</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500">ระยะเวลา(วัน)</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500">วันที่เสร็จงาน</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500">ระยะเวลาทั้งหมด%</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {subtasks.length > 0 ? subtasks.map((st: any, i: number) => (
                  <tr key={i} className={"border-b border-gray-100 hover:bg-gray-50 " + (st.category ? "bg-gray-50/50" : "")}>
                    <td className="py-2 px-4 text-xs text-gray-400">{i + 1}</td>
                    <td className="py-2 px-4 text-sm font-medium">{st.category}</td>
                    <td className="py-2 px-4 text-xs text-gray-500">{st.start || "-"}</td>
                    <td className="py-2 px-4 text-xs">{st.days || "-"}</td>
                    <td className="py-2 px-4 text-xs text-gray-500">{st.end || "-"}</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={"h-full rounded-full " + st.barColor} style={{ width: st.progress + "%" }}></div>
                        </div>
                        <span className="text-xs font-semibold">{st.progress}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + st.bg}>{st.status}</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="py-8 text-center text-sm text-gray-400">ยังไม่มีข้อมูลงานย่อย</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
