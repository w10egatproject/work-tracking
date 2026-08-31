import { google } from "googleapis"
import { Task, parseWCodes, deriveTaskStatus, DisciplineCode } from "@/types"
import { INITIAL_TASKS, getTasksStore, getTaskById, addTaskToStore, updateTaskInStore, updateTaskDetailsInStore, updateSubtaskInStore, insertSubtaskInStore, deleteSubtaskInStore, recordHandoverInStore, generateDefaultSubtasks, generateDefaultGantt, deleteTaskFromStore } from "./tasks-data"

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

    tasks.sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, "") || (a.taskNo || "").replace(/\D/g, "") || "0", 10)
      const numB = parseInt(b.id.replace(/\D/g, "") || (b.taskNo || "").replace(/\D/g, "") || "0", 10)
      return numB - numA
    })

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

      // Step 1: Scan master sheet to find current MAX task number
      let maxNum = 0
      try {
        const masterRes = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${MASTER_SHEET_NAME}!A:H`,
        })
        const rows = masterRes.data.values || []
        for (let i = 1; i < rows.length; i++) {
          const cellA = String(rows[i]?.[0] || "")
          const match = cellA.match(/\d+/)
          if (match) {
            const n = parseInt(match[0], 10)
            if (n > maxNum) maxNum = n
          }
        }
      } catch (err) {
        console.warn("Could not read master sheet rows for max task number:", err)
      }

      // Also consider store max
      const storeMax = getTasksStore().reduce((max, t) => {
        const num = parseInt(t.id.replace(/\D/g, "") || (t.taskNo || "").replace(/\D/g, "") || "0", 10)
        return !isNaN(num) && num > max ? num : max
      }, 0)
      maxNum = Math.max(maxNum, storeMax)
      const nextNum = maxNum + 1
      const newTabName = `งานที่${nextNum}`
      const taskNo = newTabName

      // Step 2: Find template sheet to copy from
      const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID })
      const allSheets = meta.data.sheets || []

      // Look for latest task tab (งานที่{maxNum}) or any existing งานที่... tab or fallback to งานที่1
      let templateSheet = allSheets.find((s) => s.properties?.title === `งานที่${maxNum}`)
      if (!templateSheet) {
        const taskSheets = allSheets
          .filter((s) => s.properties?.title?.startsWith("งานที่"))
          .sort((a, b) => {
            const numA = parseInt((a.properties?.title || "").replace(/\D/g, "") || "0", 10)
            const numB = parseInt((b.properties?.title || "").replace(/\D/g, "") || "0", 10)
            return numB - numA
          })
        templateSheet = taskSheets[0] || allSheets.find((s) => s.properties?.title === "งานที่1")
      }

      let createdSheetId: number | null = null

      const masterSheet = allSheets.find((s) => s.properties?.title === MASTER_SHEET_NAME)

      if (templateSheet && templateSheet.properties?.sheetId !== undefined) {
        const sourceSheetId = templateSheet.properties.sheetId
        const requests: any[] = [
          {
            duplicateSheet: {
              sourceSheetId,
              newSheetName: newTabName,
              insertSheetIndex: allSheets.length,
            },
          },
        ]
        if (masterSheet?.properties?.sheetId !== undefined) {
          requests.push({
            updateSheetProperties: {
              properties: {
                sheetId: masterSheet.properties.sheetId,
                index: 0,
              },
              fields: "index",
            },
          })
        }

        const duplicateRes = await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: { requests },
        })
        createdSheetId = duplicateRes.data.replies?.[0]?.duplicateSheet?.properties?.sheetId ?? null
      } else {
        // Fallback: create empty sheet tab at the end
        const requests: any[] = [
          {
            addSheet: {
              properties: {
                title: newTabName,
                index: allSheets.length,
              },
            },
          },
        ]
        if (masterSheet?.properties?.sheetId !== undefined) {
          requests.push({
            updateSheetProperties: {
              properties: {
                sheetId: masterSheet.properties.sheetId,
                index: 0,
              },
              fields: "index",
            },
          })
        }

        const addRes = await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: { requests },
        })
        createdSheetId = addRes.data.replies?.[0]?.addSheet?.properties?.sheetId ?? null
      }

      // Step 3: Direct Link with gid
      let directLink = data.link || ""
      if (createdSheetId !== null) {
        directLink = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=${createdSheetId}#gid=${createdSheetId}`
      }

      // Step 4: Write header info to the newly created tab
      const displayDate = data.display_date || data.report_date || ""
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          valueInputOption: "USER_ENTERED",
          data: [
            { range: `'${newTabName}'!B2`, values: [[data.title || ""]] },
            { range: `'${newTabName}'!B3`, values: [[data.report_date || ""]] },
            { range: `'${newTabName}'!F3`, values: [[data.wo || ""]] },
            { range: `'${newTabName}'!B4`, values: [[data.total_days || 30]] },
            { range: `'${newTabName}'!F4`, values: [[data.equip || ""]] },
            { range: `'${newTabName}'!B5`, values: [[data.completion_date || ""]] },
            { range: `'${newTabName}'!B6`, values: [[displayDate]] },
          ],
        },
      })

      // Step 5: Initialize subtasks with 0% progress
      const initialTask: Task = {
        id: String(nextNum),
        taskNo: newTabName,
        title: data.title || "",
        wo: data.wo || "",
        report_date: data.report_date || "",
        completion_date: data.completion_date || "",
        completion_codes: data.completion_codes || "",
        w_codes: parseWCodes(data.completion_codes || ""),
        total_days: Number(data.total_days) || 30,
        progress: 0,
        status: "รอดำเนินการ",
        current_discipline: parseWCodes(data.completion_codes || "")[0] || "W11",
        equip: data.equip || "",
        link: directLink,
      }
      const initialSubtasks = generateDefaultSubtasks(initialTask)
      await syncTaskSubtasksToGoogleSheet(newTabName, initialSubtasks)

      // Step 6: Append to Master Sheet (ลำดับงาน)
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
            directLink,
            data.equip || "",
          ]],
        },
      })

      // Step 7: Add to local store and return
      return addTaskToStore({
        ...data,
        id: String(nextNum),
        taskNo,
        link: directLink,
        subtasks: initialSubtasks,
      })
    } catch (e) {
      console.error("Error creating new task in Google Sheets:", e)
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

      // Get sheetId for this tab
      const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID })
      const sheetObj = sheetMeta.data.sheets?.find((s) => s.properties?.title === tabName)
      const sheetId = sheetObj?.properties?.sheetId

      if (sheetId !== undefined) {
        const requests: any[] = []

        for (let i = 0; i < subtasks.length; i++) {
          const rowIndex = 8 + i
          const st = subtasks[i]
          const isHeader = st.isHeader || /^(W1[1-4]|แผนก)/i.test(st.category || "")
          const status = st.status || "รอดำเนินการ"

          if (isHeader) {
            // Header row: light blue background
            requests.push({
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: rowIndex,
                  endRowIndex: rowIndex + 1,
                  startColumnIndex: 0,
                  endColumnIndex: 5,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.8117647, green: 0.8862745, blue: 0.9529412 },
                    textFormat: { bold: true, fontSize: 10 },
                    horizontalAlignment: "CENTER",
                    borders: {
                      top: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      bottom: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      left: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      right: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                    },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,borders)",
              },
            })
            requests.push({
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: rowIndex,
                  endRowIndex: rowIndex + 1,
                  startColumnIndex: 0,
                  endColumnIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    horizontalAlignment: "LEFT",
                  },
                },
                fields: "userEnteredFormat(horizontalAlignment)",
              },
            })
            requests.push({
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: rowIndex,
                  endRowIndex: rowIndex + 1,
                  startColumnIndex: 6,
                  endColumnIndex: 7,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.62352943, green: 0.77254903, blue: 0.9098039 },
                    textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 0, green: 0, blue: 0.8 } },
                    horizontalAlignment: "CENTER",
                    borders: {
                      top: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      bottom: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      left: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      right: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                    },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,borders)",
              },
            })
          } else {
            // Regular subtask row
            // Col A: White, Left
            requests.push({
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: rowIndex,
                  endRowIndex: rowIndex + 1,
                  startColumnIndex: 0,
                  endColumnIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 1 },
                    textFormat: { fontSize: 10 },
                    horizontalAlignment: "LEFT",
                    borders: {
                      top: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      bottom: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      left: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      right: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                    },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,borders)",
              },
            })

            // Col B: Pure Yellow (Start Date)
            requests.push({
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: rowIndex,
                  endRowIndex: rowIndex + 1,
                  startColumnIndex: 1,
                  endColumnIndex: 2,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 0 },
                    textFormat: { fontSize: 10 },
                    horizontalAlignment: "CENTER",
                    borders: {
                      top: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      bottom: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      left: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      right: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                    },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,borders)",
              },
            })

            // Col C: Light Grey (Days)
            requests.push({
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: rowIndex,
                  endRowIndex: rowIndex + 1,
                  startColumnIndex: 2,
                  endColumnIndex: 3,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.9529412, green: 0.9529412, blue: 0.9529412 },
                    textFormat: { fontSize: 10 },
                    horizontalAlignment: "CENTER",
                    borders: {
                      top: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      bottom: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      left: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      right: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                    },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,borders)",
              },
            })

            // Col D: Pure Yellow (End Date)
            requests.push({
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: rowIndex,
                  endRowIndex: rowIndex + 1,
                  startColumnIndex: 3,
                  endColumnIndex: 4,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 0 },
                    textFormat: { fontSize: 10 },
                    horizontalAlignment: "CENTER",
                    borders: {
                      top: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      bottom: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      left: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      right: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                    },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,borders)",
              },
            })

            // Col E: Pure Yellow (% Progress)
            requests.push({
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: rowIndex,
                  endRowIndex: rowIndex + 1,
                  startColumnIndex: 4,
                  endColumnIndex: 5,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 1, blue: 0 },
                    textFormat: { fontSize: 10 },
                    horizontalAlignment: "CENTER",
                    borders: {
                      top: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      bottom: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      left: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      right: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                    },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,borders)",
              },
            })

            // Col G: Status styling
            let statusBg = { red: 1, green: 0.6, blue: 0 }
            let statusFg = { red: 0, green: 0, blue: 0.8 }
            if (status === "เสร็จ") {
              statusBg = { red: 0.41568628, green: 0.65882355, blue: 0.30980393 }
              statusFg = { red: 1, green: 0.8980392, blue: 0.6 }
            } else if (status === "ดำเนินการ") {
              statusBg = { red: 0.62352943, green: 0.77254903, blue: 0.9098039 }
              statusFg = { red: 0, green: 0, blue: 0.8 }
            } else if (status === "ยังไม่ดำเนินการ") {
              statusBg = { red: 1, green: 0, blue: 0 }
              statusFg = { red: 1, green: 1, blue: 1 }
            }

            requests.push({
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: rowIndex,
                  endRowIndex: rowIndex + 1,
                  startColumnIndex: 6,
                  endColumnIndex: 7,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: statusBg,
                    textFormat: { bold: true, fontSize: 10, foregroundColor: statusFg },
                    horizontalAlignment: "CENTER",
                    borders: {
                      top: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      bottom: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      left: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                      right: { style: "SOLID", color: { red: 0, green: 0, blue: 0 } },
                    },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,borders)",
              },
            })
          }
        }

        // Reset trailing rows formatting to restore native Google Sheets gridlines
        requests.push({
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 8 + subtasks.length,
              endRowIndex: 60,
              startColumnIndex: 0,
              endColumnIndex: 10,
            },
            cell: {},
            fields: "userEnteredFormat",
          },
        })

        if (requests.length > 0) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: { requests },
          })
        }
      }
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
    await syncTaskSubtasksToGoogleSheet(taskId, updated.subtasks)
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
    await syncTaskSubtasksToGoogleSheet(taskId, updated.subtasks)
  }
  return updated
}

export async function deleteSubtask(taskId: string, subtaskId: string): Promise<Task | null> {
  const updated = deleteSubtaskInStore(taskId, subtaskId)
  if (updated && updated.subtasks) {
    await syncTaskSubtasksToGoogleSheet(taskId, updated.subtasks)
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
    await syncTaskSubtasksToGoogleSheet(taskId, updated.subtasks)
  }
  return updated
}

export async function updateTaskDetails(
  taskId: string,
  updates: Partial<Task>
): Promise<Task | null> {
  const updated = updateTaskDetailsInStore(taskId, updates)
  if (updated) {
    await syncTaskHeaderToGoogleSheet(taskId, updated)
  }
  return updated
}

const THAI_MONTHS_SHORT = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
const THAI_DAYS_WEEK = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"]

function columnIndexToLetter(colIndex: number): string {
  let temp = 0
  let letter = ""
  while (colIndex > 0) {
    temp = (colIndex - 1) % 26
    letter = String.fromCharCode(65 + temp) + letter
    colIndex = Math.floor((colIndex - temp) / 26)
  }
  return letter
}

export async function expandTimelineMonthInGoogleSheet(taskId: string): Promise<boolean> {
  const auth = await getAuth()
  if (!auth || !SPREADSHEET_ID) return false

  try {
    const sheets = google.sheets({ version: "v4", auth })
    const numId = taskId.replace("งานที่", "").trim()
    const tabName = `งานที่${numId}`

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${tabName}'!H6:ZZ8`,
    })
    const rows = res.data.values || []
    const currentMonths = rows[0] || []
    const count = currentMonths.length

    const lastMonthName = currentMonths[count - 1] || "ส.ค."
    let lastMonthIdx = THAI_MONTHS_SHORT.indexOf(lastMonthName)
    if (lastMonthIdx === -1) lastMonthIdx = 7
    const nextMonthIdx = (lastMonthIdx + 1) % 12
    const nextYear = 2026
    const daysInNextMonth = new Date(nextYear, nextMonthIdx + 1, 0).getDate()

    const nextMonthRow: string[] = []
    const nextDayRow: string[] = []
    const nextWeekdayRow: string[] = []

    for (let d = 1; d <= daysInNextMonth; d++) {
      const dateObj = new Date(nextYear, nextMonthIdx, d)
      nextMonthRow.push(THAI_MONTHS_SHORT[nextMonthIdx])
      nextDayRow.push(String(d))
      nextWeekdayRow.push(THAI_DAYS_WEEK[dateObj.getDay()])
    }

    const startColIdx = 8 + count
    const endColIdx = startColIdx + daysInNextMonth - 1
    const startLetter = columnIndexToLetter(startColIdx)
    const endLetter = columnIndexToLetter(endColIdx)

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${tabName}'!${startLetter}6:${endLetter}8`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [nextMonthRow, nextDayRow, nextWeekdayRow],
      },
    })
    return true
  } catch (err) {
    console.error(`Error expanding month in Google Sheet tab ${taskId}:`, err)
    return false
  }
}

export async function shrinkTimelineMonthInGoogleSheet(taskId: string): Promise<boolean> {
  const auth = await getAuth()
  if (!auth || !SPREADSHEET_ID) return false

  try {
    const sheets = google.sheets({ version: "v4", auth })
    const numId = taskId.replace("งานที่", "").trim()
    const tabName = `งานที่${numId}`

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${tabName}'!H6:ZZ8`,
    })
    const rows = res.data.values || []
    const currentMonths = rows[0] || []
    const count = currentMonths.length
    if (count <= 31) return false // Do not shrink base schedule

    const lastMonthName = currentMonths[count - 1]
    let lastMonthCount = 0
    for (let i = count - 1; i >= 0; i--) {
      if (currentMonths[i] === lastMonthName) {
        lastMonthCount++
      } else {
        break
      }
    }

    if (lastMonthCount === 0) return false

    const startColIdx = 8 + count - lastMonthCount
    const endColIdx = 8 + count - 1
    const startLetter = columnIndexToLetter(startColIdx)
    const endLetter = columnIndexToLetter(endColIdx)

    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${tabName}'!${startLetter}6:${endLetter}60`,
    })
    return true
  } catch (err) {
    console.error(`Error shrinking month in Google Sheet tab ${taskId}:`, err)
    return false
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  const auth = await getAuth()
  const numId = id.replace("งานที่", "").trim()
  const targetTabName = `งานที่${numId}`

  if (auth && SPREADSHEET_ID) {
    try {
      const sheets = google.sheets({ version: "v4", auth })

      // 1. Find row in Master Sheet (ลำดับงาน)
      const masterRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${MASTER_SHEET_NAME}!A:A`,
      })
      const rows = masterRes.data.values || []
      let rowIndexToDelete = -1
      for (let i = 1; i < rows.length; i++) {
        const val = String(rows[i]?.[0] || "").trim()
        if (val === `งานที่${numId}` || val === id || val.replace(/\D/g, "") === numId) {
          rowIndexToDelete = i
          break
        }
      }

      // Get metadata to find sheetIds
      const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID })
      const allSheets = meta.data.sheets || []
      const masterSheet = allSheets.find((s) => s.properties?.title === MASTER_SHEET_NAME)
      const taskSheet = allSheets.find(
        (s) => s.properties?.title === targetTabName || s.properties?.title?.replace(/\D/g, "") === numId
      )

      const requests: any[] = []

      // Delete the Task Detail Sheet tab
      if (taskSheet?.properties?.sheetId !== undefined) {
        requests.push({
          deleteSheet: {
            sheetId: taskSheet.properties.sheetId,
          },
        })
      }

      // Delete the row in Master Sheet
      if (rowIndexToDelete !== -1 && masterSheet?.properties?.sheetId !== undefined) {
        requests.push({
          deleteDimension: {
            range: {
              sheetId: masterSheet.properties.sheetId,
              dimension: "ROWS",
              startIndex: rowIndexToDelete,
              endIndex: rowIndexToDelete + 1,
            },
          },
        })
      }

      if (requests.length > 0) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: { requests },
        })
      }
    } catch (err) {
      console.error(`Error deleting task ${id} from Google Sheets:`, err)
    }
  }

  return deleteTaskFromStore(id)
}
