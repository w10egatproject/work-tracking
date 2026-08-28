import { NextResponse } from "next/server"
import { fetchAllTasks } from "@/lib/google-sheets"

export async function GET() {
  try {
    const tasks = await fetchAllTasks()
    return NextResponse.json(tasks)
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch sheets" }, { status: 500 })
  }
}
