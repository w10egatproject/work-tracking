"use client"

import { Task } from "@/types"
import { CheckCircle2, Clock, PlayCircle, Layers, Activity } from "lucide-react"

interface Props {
  tasks: Task[]
}

export default function SummaryCards({ tasks }: Props) {
  const total = tasks.length
  const inProgress = tasks.filter((t) => t.status === "ดำเนินการ").length
  const done = tasks.filter((t) => t.status === "เสร็จ").length
  const pending = tasks.filter((t) => t.status === "รอดำเนินการ").length

  const percentDone = total > 0 ? Math.round((done / total) * 100) : 0
  const percentInProgress = total > 0 ? Math.round((inProgress / total) * 100) : 0
  const percentPending = total > 0 ? Math.round((pending / total) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total Tasks Card */}
      <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#DDD6C8] shadow-[0_2px_8px_rgba(25,33,30,0.03)] flex flex-col justify-between transition-all hover:border-[#19211E]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ECE7DC] border border-[#DDD6C8] text-[#19211E] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#19211E]">งานทั้งหมดในระบบ</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F4EC] text-[#1B5E3B] border border-[#B8DCBD]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E3B] animate-pulse"></span>
            Master Data
          </span>
        </div>

        <div className="mt-3.5">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#19211E] tracking-tight font-mono">
              {total}
              <span className="text-xs font-normal text-[#6B7771] ml-1.5 font-sans">รายการ</span>
            </div>
            <span className="text-[11px] font-bold text-[#19211E] bg-[#ECE7DC] px-2 py-0.5 rounded-md border border-[#DDD6C8] font-mono">
              สำเร็จ {percentDone}%
            </span>
          </div>
          <div className="w-full bg-[#ECE7DC] h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-[#19211E] h-full rounded-full transition-all duration-500"
              style={{ width: `${percentDone}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. In Progress Card */}
      <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#DDD6C8] shadow-[0_2px_8px_rgba(25,33,30,0.03)] flex flex-col justify-between transition-all hover:border-[#C05621]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FDF2EC] border border-[#F7CEB9] text-[#C05621] flex items-center justify-center">
              <PlayCircle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#19211E]">กำลังดำเนินการ</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF2EC] text-[#C05621] border border-[#F7CEB9] font-mono">
            {percentInProgress}%
          </span>
        </div>

        <div className="mt-3.5">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#C05621] tracking-tight font-mono">
              {inProgress}
              <span className="text-xs font-normal text-[#6B7771] ml-1.5 font-sans">งาน</span>
            </div>
            <span className="text-[11px] font-medium text-[#6B7771]">
              {inProgress} จาก {total} รายการ
            </span>
          </div>
          <div className="w-full bg-[#ECE7DC] h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-[#C05621] h-full rounded-full transition-all duration-500"
              style={{ width: `${percentInProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3. Completed Card */}
      <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#DDD6C8] shadow-[0_2px_8px_rgba(25,33,30,0.03)] flex flex-col justify-between transition-all hover:border-[#1B5E3B]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8F4EC] border border-[#B8DCBD] text-[#1B5E3B] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#19211E]">เสร็จสิ้นแล้ว</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F4EC] text-[#1B5E3B] border border-[#B8DCBD] font-mono">
            {percentDone}%
          </span>
        </div>

        <div className="mt-3.5">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1B5E3B] tracking-tight font-mono">
              {done}
              <span className="text-xs font-normal text-[#6B7771] ml-1.5 font-sans">งาน</span>
            </div>
            <span className="text-[11px] font-medium text-[#6B7771]">
              ปิดงานสมบูรณ์
            </span>
          </div>
          <div className="w-full bg-[#ECE7DC] h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-[#1B5E3B] h-full rounded-full transition-all duration-500"
              style={{ width: `${percentDone}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4. Pending Card */}
      <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#DDD6C8] shadow-[0_2px_8px_rgba(25,33,30,0.03)] flex flex-col justify-between transition-all hover:border-[#B45309]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#19211E]">รอดำเนินการ</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] font-mono">
            {percentPending}%
          </span>
        </div>

        <div className="mt-3.5">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#B45309] tracking-tight font-mono">
              {pending}
              <span className="text-xs font-normal text-[#6B7771] ml-1.5 font-sans">งาน</span>
            </div>
            <span className="text-[11px] font-medium text-[#6B7771]">
              รอเปิดหมวดงาน
            </span>
          </div>
          <div className="w-full bg-[#ECE7DC] h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-[#B45309] h-full rounded-full transition-all duration-500"
              style={{ width: `${percentPending}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
