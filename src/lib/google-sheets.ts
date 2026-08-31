import { google } from "googleapis"
import { Task, parseWCodes, deriveTaskStatus, DisciplineCode } from "@/types"
import { INITIAL_TASKS, getTasksStore, getTaskById, addTaskToStore, updateTaskInStore, updateTaskDetailsInStore, updateSubtaskInStore, insertSubtaskInStore, deleteSubtaskInStore, recordHandoverInStore, generateDefaultSubtasks, generateDefaultGantt } from "./tasks-data"

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
      
      let val6 = String(row[6] || "").trim()
      let val7 = String(row[7] || "").trim()
      
      let equip = ""
      let link = ""

      // Smart URL detection for Column G & H
      const isUrl = (s: string) => s.startsWith("http://") || s.startsWith("https://") || s.includes("docs.google.com") || s.includes("gid=")
      
      if (isUrl(val6)) {
        link = val6
        equip = val7
      } else if (isUrl(val7)) {
        equip = val6
        link = val7
      } else {
        equip = val6
        link = val7
      }

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
        current_discipline: wCodes[0] || "W11",
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
  const existing = getTaskById(id)
  const auth = await getAuth()

  if (auth && SPREADSHEET_ID) {
    try {
      const sheets = google.sheets({ version: "v4", auth })
      const numId = id.replace("งานที่", "").trim()
      const tabName = `งานที่${numId}`

      const tabRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${tabName}'!A1:G50`,
      })
      const tabData = tabRes.data.values || []

      if (tabData.length >= 8) {
        const title = (tabData[1] && tabData[1][1]) || existing?.title || ""
        const wo = (tabData[2] && tabData[2][5]) || (tabData[2] && tabData[2][1]) || existing?.wo || ""
        const reportDate = (tabData[2] && tabData[2][1]) || existing?.report_date || ""
        const totalDays = parseInt(tabData[3] && tabData[3][1]) || existing?.total_days || 0
        const equip = (tabData[3] && tabData[3][5]) || existing?.equip || ""
        const completionDate = (tabData[4] && tabData[4][1]) || existing?.completion_date || ""
        const displayDate = (tabData[5] && tabData[5][1]) || reportDate

        const subtasks: any[] = []
        const wCodesSet = new Set<DisciplineCode>()
        let activeDiscipline: DisciplineCode = "W11"
        let currentDiscipline: DisciplineCode = existing?.current_discipline || "W11"
        let subtaskIdCounter = 1

        for (let r = 8; r < tabData.length; r++) {
          const subRow = tabData[r]
          if (!subRow || subRow.length === 0) continue
          const category = (subRow[0] || "").trim()
          const start = (subRow[1] || "").trim()
          const days = parseInt(subRow[2]) || 1
          const end = (subRow[3] || "").trim()
          const progressStr = (subRow[4] || "").replace("%", "").trim()
          const progress = progressStr !== "" && !isNaN(parseInt(progressStr)) ? parseInt(progressStr) : (subRow[6] === "เสร็จ" ? 100 : 0)
          let status = (subRow[6] || "").trim()
          if (!status) {
            if (progress === 100) status = "เสร็จ"
            else if (progress > 0) status = "ดำเนินการ"
            else status = "รอดำเนินการ"
          }

          const isDisciplineHeader = /^(W1[1-4]|แผนก)/i.test(category)
          if (isDisciplineHeader) {
            const match = category.match(/W(1[1-4])/i)
            if (match) {
              activeDiscipline = `W${match[1]}` as DisciplineCode
              wCodesSet.add(activeDiscipline)
            }
          }

          if (category || start || end) {
            subtasks.push({
              id: `${numId}-${subtaskIdCounter++}`,
              category: category || "งานย่อย",
              discipline: activeDiscipline,
              start: start || reportDate,
              days,
              end: end || completionDate,
              progress,
              status,
              isHeader: isDisciplineHeader,
            })
          }
        }

        const wCodes = Array.from(wCodesSet)
        if (wCodes.length === 0) {
          if (existing?.w_codes) wCodes.push(...existing.w_codes)
        }

        const nonHeaders = subtasks.filter((s) => !s.isHeader)
        const avgProgress = nonHeaders.length > 0
          ? Math.round(nonHeaders.reduce((acc, s) => acc + (s.progress || 0), 0) / nonHeaders.length)
          : (completionDate ? 100 : 0)

        const activeHeader = subtasks.find((s) => s.isHeader && s.status === "ดำเนินการ")
        if (activeHeader && activeHeader.discipline) {
          currentDiscipline = activeHeader.discipline
        } else if (wCodes.length > 0) {
          currentDiscipline = wCodes[0]
        }

        let taskStatus = "รอดำเนินการ"
        if (completionDate && completionDate.trim() && avgProgress === 100) taskStatus = "เสร็จ"
        else if (avgProgress > 0 || subtasks.some((s) => s.status === "ดำเนินการ")) taskStatus = "ดำเนินการ"

        const liveDetailTask: Task = {
          ...existing,
          id: numId,
          taskNo: tabName,
          title,
          wo,
          report_date: reportDate,
          display_date: displayDate,
          completion_codes: wCodes.map((w) => w.replace("W", "")).join(","),
          w_codes: wCodes,
          completion_date: completionDate,
          total_days: totalDays,
          progress: avgProgress,
          status: taskStatus as any,
          current_discipline: currentDiscipline,
          equip,
          imageUrl: existing?.imageUrl || "",
          link: existing?.link || "",
          subtasks: subtasks.length > 0 ? subtasks : (existing?.subtasks || generateDefaultSubtasks(existing || {} as Task)),
          handovers: existing?.handovers || [],
        }

        updateTaskInStore(liveDetailTask.id, liveDetailTask)
        return liveDetailTask
      }
    } catch (err) {
      console.warn(`Could not fetch dynamic tab for task ${id} from Google Sheets:`, err)
    }
  }

  const allTasks = await fetchAllTasks()
  const liveTask = allTasks.find(t => t.id === id || t.taskNo === id || t.taskNo === `งานที่${id}`)

  if (liveTask) {
    const rawCompletion = (liveTask.completion_date && liveTask.completion_date.trim()) || existing?.completion_date || ""
    const rawTotalDays = (liveTask.total_days && liveTask.total_days > 0) ? liveTask.total_days : (existing?.total_days || 0)
    const rawProgress = (existing?.subtasks && existing.subtasks.length > 0)
      ? Math.round(existing.subtasks.filter(s => !s.isHeader).reduce((a, b) => a + (b.progress || 0), 0) / (existing.subtasks.filter(s => !s.isHeader).length || 1))
      : (existing?.progress || liveTask.progress || 0)

    const combined: Task = {
      ...existing,
      ...liveTask,
      title: (liveTask.title && liveTask.title.trim()) || existing?.title || "",
      wo: (liveTask.wo && liveTask.wo.trim()) || existing?.wo || "",
      report_date: (liveTask.report_date && liveTask.report_date.trim()) || existing?.report_date || "",
      display_date: existing?.display_date || (liveTask.report_date && liveTask.report_date.trim()) || "",
      completion_date: rawCompletion,
      total_days: rawTotalDays,
      progress: rawProgress,
      imageUrl: existing?.imageUrl || liveTask.imageUrl || "",
      subtasks: existing?.subtasks,
      gantt: existing?.gantt,
      handovers: existing?.handovers,
    }
    if (!combined.subtasks || combined.subtasks.length === 0) {
      combined.subtasks = generateDefaultSubtasks(combined)
    }
    if (!combined.gantt) {
      combined.gantt = generateDefaultGantt(combined)
    }
    return combined
  }

  return existing || null
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

/**
 * Two-Way Writeback: Synchronizes subtask rows back to Google Sheets tab ('งานที่' + id)
 */
async function syncTaskSubtasksToGoogleSheet(taskId: string, subtasks: any[]) {
  const auth = await getAuth()
  if (!auth || !SPREADSHEET_ID) return

  try {
    const sheets = google.sheets({ version: "v4", auth })
    const numId = taskId.replace("งานที่", "").trim()
    const tabName = `งานที่${numId}`

    const rows = subtasks.map((st) => [
      st.category || "",
      st.start || "",
      st.days || 1,
      st.end || "",
      st.progress !== undefined ? `${st.progress}%` : "0%",
      "",
      st.status || "รอดำเนินการ",
    ])

    // Clear old subtasks range (e.g. A9:G60)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${tabName}'!A9:G60`,
    })

    // Write updated subtasks starting at A9
    if (rows.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${tabName}'!A9:G${8 + rows.length}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: rows },
      })
    }
  } catch (err) {
    console.error(`Error syncing subtasks to Google Sheet tab ${taskId}:`, err)
  }
}

/**
 * Two-Way Writeback: Synchronizes task header metadata back to Google Sheets
 */
async function syncTaskHeaderToGoogleSheet(taskId: string, task: Task) {
  const auth = await getAuth()
  if (!auth || !SPREADSHEET_ID) return

  try {
    const sheets = google.sheets({ version: "v4", auth })
    const numId = taskId.replace("งานที่", "").trim()
    const tabName = `งานที่${numId}`

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: [
          { range: `'${tabName}'!B2`, values: [[task.title || ""]] },
          { range: `'${tabName}'!B3`, values: [[task.report_date || ""]] },
          { range: `'${tabName}'!F3`, values: [[task.wo || ""]] },
          { range: `'${tabName}'!B4`, values: [[task.total_days || ""]] },
          { range: `'${tabName}'!F4`, values: [[task.equip || ""]] },
          { range: `'${tabName}'!B5`, values: [[task.completion_date || ""]] },
          { range: `'${tabName}'!B6`, values: [[task.display_date || task.report_date || ""]] },
        ],
      },
    })
  } catch (err) {
    console.error(`Error syncing header to Google Sheet tab ${taskId}:`, err)
  }
}

export async function updateSubtask(taskId: string, subtaskId: string, updates: any): Promise<Task | null> {
  const updated = updateSubtaskInStore(taskId, subtaskId, updates)
  if (updated && updated.subtasks) {
    syncTaskSubtasksToGoogleSheet(taskId, updated.subtasks)
  }
  return updated
}

export async function insertSubtask(
  taskId: string,
  discipline: DisciplineCode,
  newSubtask: { category: string; start?: string; days?: number; end?: string; progress?: number },
  targetSubtaskId?: string,
  position: "above" | "below" = "below"
): Promise<Task | null> {
  const updated = insertSubtaskInStore(taskId, discipline, newSubtask, targetSubtaskId, position)
  if (updated && updated.subtasks) {
    syncTaskSubtasksToGoogleSheet(taskId, updated.subtasks)
  }
  return updated
}

export async function deleteSubtask(taskId: string, subtaskId: string): Promise<Task | null> {
  const updated = deleteSubtaskInStore(taskId, subtaskId)
  if (updated && updated.subtasks) {
    syncTaskSubtasksToGoogleSheet(taskId, updated.subtasks)
  }
  return updated
}

export async function executeHandover(
  taskId: string,
  fromDiscipline: DisciplineCode,
  toDiscipline: DisciplineCode,
  handoverDate: string,
  notes: string,
  byUser?: string
): Promise<Task | null> {
  const updated = recordHandoverInStore(taskId, fromDiscipline, toDiscipline, handoverDate, notes, byUser)
  if (updated && updated.subtasks) {
    syncTaskSubtasksToGoogleSheet(taskId, updated.subtasks)
  }
  return updated
}

export async function updateTaskDetails(
  taskId: string,
  updates: Partial<Task>
): Promise<Task | null> {
  const updated = updateTaskDetailsInStore(taskId, updates)
  if (updated) {
    syncTaskHeaderToGoogleSheet(taskId, updated)
  }
  return updated
}
