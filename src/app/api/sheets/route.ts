import { NextResponse } from "next/server"
import { fetchAllSheets } from "@/lib/google-sheets"

export async function GET() {
  try {
    const tasks = await fetchAllSheets()
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
