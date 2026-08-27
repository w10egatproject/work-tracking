import { google } from "googleapis"

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || ""
const SHEET_NAMES = ["งานที่1", "งานที่2", "งานที่3", "งานที่4", "งานที่5", "งานที่6"]

async function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}")
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  })
  return auth
}

export async function fetchAllSheets() {
  const auth = await getAuth()
  const sheets = google.sheets({ version: "v4", auth })

  const allTasks: any[] = []

  for (const sheetName of SHEET_NAMES) {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: sheetName + "!A:H",
      })

      const rows = res.data.values || []
      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        if (!row || !row[0]) continue
        allTasks.push({
          id: sheetName + "-" + i,
          title: row[0] || "",
          wo: row[1] || "",
          report_date: row[2] || "",
          completion_codes: row[3] || "",
          completion_date: row[4] || "",
          progress: 0,
          equip: row[5] || "",
          link: row[6] || "",
          sheet: sheetName,
        })
      }
    } catch (e) {
      console.error("Error fetching " + sheetName + ":", e)
    }
  }

  return allTasks
}
