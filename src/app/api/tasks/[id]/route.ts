import { NextResponse } from "next/server"
import { fetchTaskDetail, updateSubtask, insertSubtask, deleteSubtask, executeHandover } from "@/lib/google-sheets"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const task = await fetchTaskDetail(decodedId)
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
  const decodedId = decodeURIComponent(id)
  const body = await req.json()

  if (body.action === "handover") {
    const { fromDiscipline, toDiscipline, handoverDate, notes, byUser } = body
    const updated = await executeHandover(decodedId, fromDiscipline, toDiscipline, handoverDate, notes, byUser)
    if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    return NextResponse.json(updated)
  }

  if (body.action === "updateSubtask") {
    const { subtaskId, updates } = body
    const updated = await updateSubtask(decodedId, subtaskId, updates)
    if (!updated) return NextResponse.json({ error: "Task or Subtask not found" }, { status: 404 })
    return NextResponse.json(updated)
  }

  if (body.action === "insertSubtask") {
    const { discipline, newSubtask, targetSubtaskId, afterSubtaskId, position } = body
    const targetId = targetSubtaskId || afterSubtaskId
    const updated = await insertSubtask(decodedId, discipline, newSubtask, targetId, position || "below")
    if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    return NextResponse.json(updated)
  }

  if (body.action === "deleteSubtask") {
    const { subtaskId } = body
    const updated = await deleteSubtask(decodedId, subtaskId)
    if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    return NextResponse.json(updated)
  }

  if (body.action === "updateTaskDetails") {
    const { updates } = body
    const { updateTaskDetails } = await import("@/lib/google-sheets")
    const updated = await updateTaskDetails(decodedId, updates)
    if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    return NextResponse.json(updated)
  }

  if (body.action === "expandTimelineMonth") {
    const { expandTimelineMonthInGoogleSheet } = await import("@/lib/google-sheets")
    const ok = await expandTimelineMonthInGoogleSheet(decodedId)
    return NextResponse.json({ success: ok })
  }

  if (body.action === "shrinkTimelineMonth") {
    const { shrinkTimelineMonthInGoogleSheet } = await import("@/lib/google-sheets")
    const ok = await shrinkTimelineMonthInGoogleSheet(decodedId)
    return NextResponse.json({ success: ok })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const { deleteTask } = await import("@/lib/google-sheets")
  await deleteTask(decodedId)
  return NextResponse.json({ success: true })
}
