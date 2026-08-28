import { google } from "googleapis"
import { Task, parseWCodes, deriveTaskStatus, DisciplineCode } from "@/types"
import { INITIAL_TASKS, getTasksStore, getTaskById, addTaskToStore, updateTaskInStore, updateSubtaskInStore, insertSubtaskInStore, deleteSubtaskInStore, recordHandoverInStore } from "./tasks-data"

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || ""
const MASTER_SHEET_NAME = "ลำดับงาน"

async function getAuth() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) return null
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
    return auth
  } catch (err) {
    console.warn("Could not parse GOOGLE_SERVICE_ACCOUNT_KEY:", err)
    return null
  }
}

export async function fetchAllTasks(): Promise<Task[]> {
  const auth = await getAuth()
  if (!auth || !SPREADSHEET_ID) {
    // Return high-fidelity fallback store
    return getTasksStore()
  }

  try {
    const sheets = google.sheets({ version: "v4", auth })
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${MASTER_SHEET_NAME}!A:H`,
    })

    const rows = res.data.values || []
    if (rows.length <= 1) return getTasksStore()

    const tasks: Task[] = []
    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (!row || !row[0]) continue

      const taskNo = String(row[0] || `งานที่${i}`)
      const id = String(i)
      const title = String(row[1] || "")
      const wo = String(row[2] || "")
      const reportDate = String(row[3] || "")
      const completionDate = String(row[4] || "")
      const rawCodes = String(row[5] || "")
      const equip = String(row[6] || "")
      const link = String(row[7] || "")
      const wCodes = parseWCodes(rawCodes)
      const status = deriveTaskStatus(completionDate, link)
      const isDone = status === "เสร็จ"

      tasks.push({
        id,
        taskNo,
        title,
        wo,
        report_date: reportDate,
        completion_date: completionDate,
        completion_codes: rawCodes,
        w_codes: wCodes,
        total_days: 0,
        progress: isDone ? 100 : (status === "ดำเนินการ" ? 25 : 0),
        status,
        current_discipline: wCodes[0] || "W12",
        equip,
        link,
      })
    }

    return tasks.length > 0 ? tasks : getTasksStore()
  } catch (error) {
    console.error("Error fetching Google Sheets:", error)
    return getTasksStore()
  }
}

export async function fetchTaskDetail(id: string): Promise<Task | null> {
  const task = getTaskById(id)
  return task || null
}

export async function createNewTask(data: Partial<Task>): Promise<Task> {
  const auth = await getAuth()
  if (auth && SPREADSHEET_ID) {
    try {
      const sheets = google.sheets({ version: "v4", auth })
      const nextNum = getTasksStore().length + 1
      const taskNo = `งานที่${nextNum}`
      
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${MASTER_SHEET_NAME}!A:H`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            taskNo,
            data.title || "",
            data.wo || "",
            data.report_date || "",
            data.completion_date || "",
            data.completion_codes || "",
            data.equip || "",
            data.link || "",
          ]],
        },
      })
    } catch (e) {
      console.error("Error appending to Google Sheet:", e)
    }
  }

  return addTaskToStore(data)
}

export async function updateSubtask(taskId: string, subtaskId: string, updates: any): Promise<Task | null> {
  return updateSubtaskInStore(taskId, subtaskId, updates)
}

export async function insertSubtask(
  taskId: string,
  discipline: DisciplineCode,
  newSubtask: { category: string; start?: string; days?: number; end?: string; progress?: number },
  targetSubtaskId?: string,
  position: "above" | "below" = "below"
): Promise<Task | null> {
  return insertSubtaskInStore(taskId, discipline, newSubtask, targetSubtaskId, position)
}

export async function deleteSubtask(taskId: string, subtaskId: string): Promise<Task | null> {
  return deleteSubtaskInStore(taskId, subtaskId)
}

export async function executeHandover(
  taskId: string,
  fromDiscipline: DisciplineCode,
  toDiscipline: DisciplineCode,
  handoverDate: string,
  notes: string
): Promise<Task | null> {
  return recordHandoverInStore(taskId, fromDiscipline, toDiscipline, handoverDate, notes)
}
