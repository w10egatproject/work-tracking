import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Work Tracker",
  description: "Track tasks by week category",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
