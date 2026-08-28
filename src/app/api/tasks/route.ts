import { NextResponse } from "next/server"
import { fetchAllTasks, createNewTask } from "@/lib/google-sheets"

export async function GET() {
  try {
    const tasks = await fetchAllTasks()
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const created = await createNewTask(body)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
