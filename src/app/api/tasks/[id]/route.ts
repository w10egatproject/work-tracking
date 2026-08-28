import { NextResponse } from "next/server"
import { fetchTaskDetail, updateSubtask, insertSubtask, deleteSubtask, executeHandover } from "@/lib/google-sheets"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const task = await fetchTaskDetail(id)
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }
  return NextResponse.json(task)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  if (body.action === "handover") {
    const { fromDiscipline, toDiscipline, handoverDate, notes } = body
    const updated = await executeHandover(id, fromDiscipline, toDiscipline, handoverDate, notes)
    if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    return NextResponse.json(updated)
  }

  if (body.action === "updateSubtask") {
    const { subtaskId, updates } = body
    const updated = await updateSubtask(id, subtaskId, updates)
    if (!updated) return NextResponse.json({ error: "Task or Subtask not found" }, { status: 404 })
    return NextResponse.json(updated)
  }

  if (body.action === "insertSubtask") {
    const { discipline, newSubtask, targetSubtaskId, afterSubtaskId, position } = body
    const targetId = targetSubtaskId || afterSubtaskId
    const updated = await insertSubtask(id, discipline, newSubtask, targetId, position || "below")
    if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    return NextResponse.json(updated)
  }

  if (body.action === "deleteSubtask") {
    const { subtaskId } = body
    const updated = await deleteSubtask(id, subtaskId)
    if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
