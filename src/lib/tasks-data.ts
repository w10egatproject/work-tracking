import { Task, Subtask, TaskStatus, parseWCodes, deriveTaskStatus, DisciplineCode } from "@/types"

export const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    taskNo: "งานที่1",
    title: "งานถอด Bearing Coupling Clutch Ball Mill 10",
    wo: "4132222",
    report_date: "27 พ.ค. 2026",
    display_date: "27 พ.ค. 2026",
    completion_codes: "11,12,13",
    w_codes: ["W12", "W13", "W11"],
    completion_date: "31 ส.ค. 2026",
    total_days: 97,
    progress: 88,
    status: "ดำเนินการ",
    current_discipline: "W12",
    equip: "",
    imageUrl: "",
    link: "https://docs.google.com/spreadsheets/d/1ZhMhL76i8n5qaRIRGsWe6tYCi1k53v8yOiX7w8pg/edit?gid=0#gid=0",
    subtasks: [
      // 1. W12 : เครื่องกล
      { id: "1-1", category: "W12 : เครื่องกล", discipline: "W12", start: "27 พ.ค. 2026", days: 97, end: "31 ส.ค. 2026", progress: 90, status: "ดำเนินการ", isHeader: true },
      { id: "1-2", category: "ประสานงานกับหน่วยงาน", discipline: "W12", start: "27 พ.ค. 2026", days: 2, end: "28 พ.ค. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-3", category: "การกลึงล้างก่อนเชื่อม1", discipline: "W12", start: "4 มิ.ย. 2026", days: 7, end: "10 มิ.ย. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-4", category: "การกลึงล้างเก็บขนาดหลังเชื่อม", discipline: "W12", start: "22 มิ.ย. 2026", days: 5, end: "26 มิ.ย. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-5", category: "การกลึงล้างเก็บขนาดหลังเชื่อม2", discipline: "W12", start: "8 ก.ค. 2026", days: 7, end: "14 ก.ค. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-6", category: "ทำร่องคีย์เก็บงาน", discipline: "W12", start: "3 ส.ค. 2026", days: 29, end: "31 ส.ค. 2026", progress: 50, status: "ดำเนินการ" },

      // 2. W13 : เชื่อมเครื่องกล
      { id: "1-7", category: "W13 : เชื่อมเครื่องกล", discipline: "W13", start: "1 มิ.ย. 2026", days: 92, end: "31 ส.ค. 2026", progress: 75, status: "ดำเนินการ", isHeader: true },
      { id: "1-8", category: "ถอดอุปกรณ์", discipline: "W13", start: "1 มิ.ย. 2026", days: 2, end: "2 มิ.ย. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-9", category: "เชื่อมพอก1", discipline: "W13", start: "11 มิ.ย. 2026", days: 7, end: "17 มิ.ย. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-10", category: "เชื่อมพอก2", discipline: "W13", start: "29 มิ.ย. 2026", days: 5, end: "3 ก.ค. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-11", category: "ประกอบชิ้นงาน", discipline: "W13", start: "31 ส.ค. 2026", days: 1, end: "31 ส.ค. 2026", progress: 0, status: "รอดำเนินการ" },
      { id: "1-12", category: "ส่งมอบ", discipline: "W13", start: "31 ส.ค. 2026", days: 1, end: "31 ส.ค. 2026", progress: 0, status: "ยังไม่ดำเนินการ" },

      // 3. W11 : วิศวกรรม
      { id: "1-13", category: "W11 : วิศวกรรม", discipline: "W11", start: "11 มิ.ย. 2026", days: 72, end: "21 ส.ค. 2026", progress: 100, status: "เสร็จ", isHeader: true },
      { id: "1-14", category: "กำหนดงานเชื่อม", discipline: "W11", start: "11 มิ.ย. 2026", days: 7, end: "17 มิ.ย. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-15", category: "Preheat-PostHeet", discipline: "W11", start: "29 มิ.ย. 2026", days: 5, end: "3 ก.ค. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-16", category: "ตรวจสอบรอยร้าว1", discipline: "W11", start: "18 มิ.ย. 2026", days: 2, end: "19 มิ.ย. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-17", category: "ตรวจสอบรอยร้าว2", discipline: "W11", start: "6 ก.ค. 2026", days: 2, end: "7 ก.ค. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-18", category: "เขียนแบบทำเครื่องมือกัดร่องคีย์", discipline: "W11", start: "3 ส.ค. 2026", days: 2, end: "4 ส.ค. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-19", category: "เชื่อมประกอบเครื่องมือกัดร่องคีย์", discipline: "W11", start: "6 ส.ค. 2026", days: 6, end: "11 ส.ค. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-20", category: "เขียนแบบทำ Support", discipline: "W11", start: "10 ส.ค. 2026", days: 2, end: "11 ส.ค. 2026", progress: 100, status: "เสร็จ" },
      { id: "1-21", category: "เชื่อมประกอบSupport", discipline: "W11", start: "17 ส.ค. 2026", days: 5, end: "21 ส.ค. 2026", progress: 100, status: "เสร็จ" },
    ],
    gantt: {
      months: ["พ.ค. 26", "มิ.ย. 26", "ก.ค. 26", "ส.ค. 26"],
      bars: [
        { label: "W12: เครื่องกล", startIdx: 0, width: 97, color: "bg-sky-400", progress: 90, discipline: "W12" },
        { label: "W13: เชื่อมเครื่องกล", startIdx: 5, width: 92, color: "bg-sky-400", progress: 75, discipline: "W13" },
        { label: "W11: วิศวกรรม", startIdx: 15, width: 72, color: "bg-sky-400", progress: 100, discipline: "W11" },
      ]
    },
    handovers: []
  },
  {
    id: "2",
    taskNo: "งานที่2",
    title: "ตรวจเช็คซ่อมรูบอร์ pulley type D5",
    wo: "3831775",
    report_date: "26 ส.ค. 2024",
    completion_codes: "11,12,13",
    w_codes: ["W11", "W12", "W13"],
    completion_date: "",
    total_days: 476,
    progress: 45,
    status: "ดำเนินการ",
    current_discipline: "W12",
    equip: "",
    link: "https://docs.google.com/spreadsheets/d/1ZhMhL76i8n5qaRIRGsWe6tYCi1k53v8yOiX7w8pg/edit?gid=1383172123#gid=1383172123",
  },
  {
    id: "3",
    taskNo: "งานที่3",
    title: "ซ่อม bore pulley 630x1400 และ slot bolt",
    wo: "3856203",
    report_date: "17 ต.ค. 2024",
    completion_codes: "12,13",
    w_codes: ["W12", "W13"],
    completion_date: "",
    total_days: 450,
    progress: 30,
    status: "ดำเนินการ",
    current_discipline: "W12",
    equip: "",
    link: "https://docs.google.com/spreadsheets/d/1ZhMhL76i8n5qaRIRGsWe6tYCi1k53v8yOiX7w8pg/edit?gid=1490539448#gid=1490539448",
  },
  {
    id: "4",
    taskNo: "งานที่4",
    title: "เช็ครอยร้าว เช็คศูนย์ shift ELECON D1",
    wo: "3874681",
    report_date: "25 พ.ย. 2024",
    completion_codes: "11,12,13",
    w_codes: ["W11", "W12", "W13"],
    completion_date: "",
    total_days: 480,
    progress: 10,
    status: "ดำเนินการ",
    current_discipline: "W11",
    equip: "",
    link: "https://docs.google.com/spreadsheets/d/1ZhMhL76i8n5qaRIRGsWe6tYCi1k53v8yOiX7w8pg/edit?gid=878609441#gid=878609441",
  },
  {
    id: "5",
    taskNo: "งานที่5",
    title: "ซ่อม pulley NDB2 ขนาด 1000x1400",
    wo: "3902889",
    report_date: "21 ม.ค. 2025",
    completion_codes: "11,12,13",
    w_codes: ["W11", "W12", "W13"],
    completion_date: "",
    total_days: 450,
    progress: 0,
    status: "รอดำเนินการ",
    current_discipline: "W11",
    equip: "",
    link: "",
  },
  {
    id: "6",
    taskNo: "งานที่6",
    title: "ปรับปรุงPontoonนสำรวจสภาพพื้นผิวSump 2SW \nซื้อแผ่นเหล็กตีนไก่ ขนาด 4x8ฟุต PR.1500240230",
    wo: "4161863",
    report_date: "27 ส.ค. 2026",
    completion_codes: "11,13",
    w_codes: ["W13", "W11"],
    completion_date: "7 ก.ย. 2026",
    total_days: 11,
    progress: 35,
    status: "ดำเนินการ",
    current_discipline: "W13",
    equip: "",
    link: "https://docs.google.com/spreadsheets/d/1ZZ1iQTKzplo_VClDPZcOaKErtnqv3oVN9ocszZuR5pc/edit?gid=80428362#gid=80428362",
    subtasks: [
      { id: "6-1", category: "W13 : เชื่อมเครื่องกล", discipline: "W13", start: "27 ส.ค. 2026", days: 12, end: "7 ก.ย. 2026", progress: 40, status: "ดำเนินการ", isHeader: true },
      { id: "6-2", category: "ประสานงานกับหน่วยงาน", discipline: "W13", start: "27 ส.ค. 2026", days: 1, end: "27 ส.ค. 2026", progress: 100, status: "เสร็จ", highlightStart: true, highlightEnd: true },
      { id: "6-3", category: "งานพ่นทราย (พวอน-ช)", discipline: "W13", start: "28 ส.ค. 2026", days: 5, end: "1 ก.ย. 2026", progress: 20, status: "ดำเนินการ" },
      { id: "6-4", category: "เชื่อมซ่อม", discipline: "W13", start: "1 ก.ย. 2026", days: 7, end: "7 ก.ย. 2026", progress: 0, status: "รอดำเนินการ" },
      { id: "6-5", category: "W11 : วิศวกรรม", discipline: "W11", start: "27 ส.ค. 2026", days: 12, end: "7 ก.ย. 2026", progress: 30, status: "ดำเนินการ", isHeader: true },
      { id: "6-6", category: "ประสานงานกับหน่วยงานพ่นทราย", discipline: "W11", start: "27 ส.ค. 2026", days: 1, end: "27 ส.ค. 2026", progress: 100, status: "เสร็จ", highlightStart: true, highlightEnd: true },
      { id: "6-7", category: "NDT แนวเชื่อม ก่อน", discipline: "W11", start: "1 ก.ย. 2026", days: 2, end: "2 ก.ย. 2026", progress: 0, status: "รอดำเนินการ" },
      { id: "6-8", category: "งานเปิดความแน่นเหล็กตีนไก่", discipline: "W11", start: "2 ก.ย. 2026", days: 2, end: "3 ก.ย. 2026", progress: 20, status: "ดำเนินการ" },
      { id: "6-9", category: "NDT แนวเชื่อม หลัง", discipline: "W11", start: "7 ก.ย. 2026", days: 1, end: "7 ก.ย. 2026", progress: 0, status: "รอดำเนินการ" },
      { id: "6-10", category: "ส่งมอบงาน", discipline: "W11", start: "7 ก.ย. 2026", days: 1, end: "7 ก.ย. 2026", progress: 0, status: "ยังไม่ดำเนินการ", highlightStart: true, highlightEnd: true },
    ],
  },
  {
    id: "7",
    taskNo: "งานที่7",
    title: "ตรวจเช็คซ่อม เพลา EGLO 305",
    wo: "3918451",
    report_date: "20 ก.พ. 2025",
    completion_codes: "11,12,13",
    w_codes: ["W11", "W12", "W13"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
  {
    id: "8",
    taskNo: "งานที่8",
    title: "ซ่อม bore 320 pulley 800x1400 1EA",
    wo: "3985951",
    report_date: "17 ก.ค. 2025",
    completion_codes: "12,13",
    w_codes: ["W12", "W13"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
  {
    id: "9",
    taskNo: "งานที่9",
    title: "สร้างเพลา NC NDB4 1EA",
    wo: "3985958",
    report_date: "17 ก.ค. 2025",
    completion_codes: "12",
    w_codes: ["W12"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
  {
    id: "10",
    taskNo: "งานที่10",
    title: "ซ่อม bore 320 pulley 800x1400 1EA",
    wo: "4034067",
    report_date: "17 ก.ค. 2025",
    completion_codes: "11,12,13",
    w_codes: ["W11", "W12", "W13"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
  {
    id: "11",
    taskNo: "งานที่11",
    title: "งานซ่อมปรับปรุงแก้ไข โครงเบรค 250",
    wo: "4013367",
    report_date: "3 ก.ย. 2025",
    completion_codes: "11,12,13,14",
    w_codes: ["W11", "W12", "W13", "W14"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "270006 Reclaimer 6",
    link: "",
  },
  {
    id: "12",
    taskNo: "งานที่12",
    title: "ดัดShaft G/B KEA450ติดตั้งbackstop= 2 SE",
    wo: "4027209",
    report_date: "1 ต.ค. 2025",
    completion_codes: "11,12,13",
    w_codes: ["W11", "W12", "W13"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
  {
    id: "13",
    taskNo: "งานที่13",
    title: "ซ่อม bore 355 pulley 1000x1400",
    wo: "4034067",
    report_date: "17 ต.ค. 2025",
    completion_codes: "12,13",
    w_codes: ["W12", "W13"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
  {
    id: "14",
    taskNo: "งานที่14",
    title: "เช็ครอยร้าว เช็คศูนย์ shift ELECON D2",
    wo: "4034065",
    report_date: "17 ต.ค. 2025",
    completion_codes: "11,12",
    w_codes: ["W11", "W12"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
  {
    id: "15",
    taskNo: "งานที่15",
    title: "เช็ครอยร้าว เช็คศูนย์ shift ELECON D8",
    wo: "4034066",
    report_date: "17 ต.ค. 2025",
    completion_codes: "11,12",
    w_codes: ["W11", "W12"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
  {
    id: "16",
    taskNo: "งานที่16",
    title: "สร้างอุปกรณ์เครื่อง Induction",
    wo: "4041721",
    report_date: "3 พ.ย. 2025",
    completion_codes: "12",
    w_codes: ["W12"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
  {
    id: "17",
    taskNo: "งานที่17",
    title: "สร้างอุปกรณ์เครื่องเจียร์ บ. เครื่องกล",
    wo: "4064152",
    report_date: "19 ธ.ค. 2025",
    completion_codes: "11,12,13",
    w_codes: ["W11", "W12", "W13"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
  {
    id: "18",
    taskNo: "งานที่18",
    title: "เซาะร่อง pulley เอาเพลาออก",
    wo: "4064890",
    report_date: "23 ธ.ค. 2025",
    completion_codes: "11,12,13",
    w_codes: ["W11", "W12", "W13"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
  {
    id: "19",
    taskNo: "งานที่19",
    title: "เชื่อมถังบรรจุน้ำรถน้ำ 43-0262 พร้อมทำฐาน",
    wo: "3998654",
    report_date: "4 มี.ค. 2025",
    completion_codes: "11,13",
    w_codes: ["W11", "W13"],
    completion_date: "20/06/2025",
    total_days: 108,
    progress: 100,
    status: "เสร็จ",
    current_discipline: "W13",
    equip: "430262 รถบรรทุกน้ำแบบรถ 10 ล้อ",
    link: "",
  },
  {
    id: "20",
    taskNo: "งานที่20",
    title: "เปลี่ยนชุดขับปั๊มใต้ห้อง",
    wo: "3927273",
    report_date: "11 มี.ค. 2025",
    completion_codes: "11,12,13",
    w_codes: ["W11", "W12", "W13"],
    completion_date: "30/08/2025",
    total_days: 172,
    progress: 100,
    status: "เสร็จ",
    current_discipline: "W13",
    equip: "",
    link: "",
  },
  {
    id: "21",
    taskNo: "งานที่21",
    title: "ตรวจเช็ครอยร้าว Cover F/C 760CDR-XR-R",
    wo: "4000726",
    report_date: "7 ส.ค. 2025",
    completion_codes: "11,13",
    w_codes: ["W11", "W13"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
  {
    id: "22",
    taskNo: "งานที่22",
    title: "ทำเครื่องล้างล้อรถ",
    wo: "3631878",
    report_date: "21 ส.ค. 2023",
    completion_codes: "11,12,13",
    w_codes: ["W11", "W12", "W13"],
    completion_date: "10/01/2024",
    total_days: 142,
    progress: 100,
    status: "เสร็จ",
    current_discipline: "W13",
    equip: "",
    link: "",
  },
  {
    id: "23",
    taskNo: "งานที่23",
    title: "กลึงสร้างสลักโซ่ Apron Conveyor ตามแบบ",
    wo: "4039061",
    report_date: "27 ต.ค. 2025",
    completion_codes: "11,12",
    w_codes: ["W11", "W12"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "240007 Crusher 3",
    link: "",
  },
  {
    id: "24",
    taskNo: "งานที่24",
    title: "ตรวจเช็คตรวจรอยเพลา เช็คคด",
    wo: "4055566",
    report_date: "4 ธ.ค. 2025",
    completion_codes: "11",
    w_codes: ["W11"],
    completion_date: "",
    total_days: 0,
    progress: 0,
    status: "รอดำเนินการ",
    equip: "",
    link: "",
  },
]

// In-memory runtime state for tasks & subtasks so updates persist during server lifecycle
let tasksStore = [...INITIAL_TASKS]

export function getTasksStore(): Task[] {
  return tasksStore
}

export function getTaskById(id: string): Task | undefined {
  const task = tasksStore.find(t => t.id === id || t.taskNo === id || t.taskNo === `งานที่${id}`)
  if (!task) return undefined
  
  // If subtasks are missing, generate structured starter subtasks according to w_codes
  if (!task.subtasks || task.subtasks.length === 0) {
    task.subtasks = generateDefaultSubtasks(task)
  }
  if (!task.gantt) {
    task.gantt = generateDefaultGantt(task)
  }
  return task
}

export function addTaskToStore(newTask: Partial<Task>): Task {
  const nextId = String(tasksStore.length + 1)
  const wCodes = parseWCodes(newTask.completion_codes || "")
  const status = deriveTaskStatus(newTask.completion_date, newTask.link)
  const created: Task = {
    id: nextId,
    taskNo: `งานที่${nextId}`,
    title: newTask.title || `งานซ่อมบำรุง #${nextId}`,
    wo: newTask.wo || "",
    report_date: newTask.report_date || new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }),
    completion_codes: newTask.completion_codes || (wCodes.map(w => w.replace("W", "")).join(",") || "11,12"),
    w_codes: wCodes.length > 0 ? wCodes : ["W11", "W12"],
    completion_date: newTask.completion_date || "",
    total_days: newTask.total_days || 30,
    progress: status === "เสร็จ" ? 100 : (status === "ดำเนินการ" ? (newTask.progress || 10) : 0),
    status,
    current_discipline: wCodes[0] || "W11",
    equip: newTask.equip || "",
    link: newTask.link || "",
    handovers: [],
  }
  created.subtasks = generateDefaultSubtasks(created)
  created.gantt = generateDefaultGantt(created)
  tasksStore.unshift(created)
  return created
}

export function updateTaskInStore(id: string, updates: Partial<Task>): Task | null {
  const index = tasksStore.findIndex(t => t.id === id || t.taskNo === id || t.taskNo === `งานที่${id}`)
  if (index === -1) return null
  const merged = { ...tasksStore[index], ...updates }
  merged.status = deriveTaskStatus(merged.completion_date, merged.link)
  if (merged.status === "เสร็จ" && merged.progress < 100) {
    merged.progress = 100
  }
  tasksStore[index] = merged
  return tasksStore[index]
}

export function updateSubtaskInStore(taskId: string, subtaskId: string, updates: any): Task | null {
  const task = getTaskById(taskId)
  if (!task || !task.subtasks) return null
  const subIndex = task.subtasks.findIndex(st => st.id === subtaskId)
  if (subIndex !== -1) {
    if (typeof updates.progress === "number") {
      const p = updates.progress
      updates.status = p === 100 ? "เสร็จ" : (p > 0 ? "ดำเนินการ" : "รอดำเนินการ")
    }
    task.subtasks[subIndex] = { ...task.subtasks[subIndex], ...updates }
    // Recalculate task overall progress from non-header subtasks
    const nonHeaders = task.subtasks.filter(st => !st.isHeader)
    if (nonHeaders.length > 0) {
      const avg = Math.round(nonHeaders.reduce((sum, st) => sum + (st.progress || 0), 0) / nonHeaders.length)
      task.progress = avg
      if (avg === 100) task.status = "เสร็จ"
      else if (avg > 0) task.status = "ดำเนินการ"
      else task.status = "รอดำเนินการ"
    }
  }
  return task
}

export function insertSubtaskInStore(
  taskId: string,
  discipline: DisciplineCode,
  newSubtask: { category: string; start?: string; days?: number; end?: string; progress?: number },
  targetSubtaskId?: string,
  position: "above" | "below" = "below"
): Task | null {
  const task = getTaskById(taskId)
  if (!task || !task.subtasks) return null

  const p = newSubtask.progress || 0
  const status: TaskStatus = p === 100 ? "เสร็จ" : (p > 0 ? "ดำเนินการ" : "รอดำเนินการ")
  const createdSubtask: Subtask = {
    id: `${task.id}-${Date.now()}`,
    category: newSubtask.category || "งานย่อยใหม่",
    discipline,
    start: newSubtask.start || task.report_date || "",
    days: Number(newSubtask.days) || 1,
    end: newSubtask.end || "",
    progress: p,
    status,
  }

  // Find insert position
  let insertIndex = -1
  if (targetSubtaskId) {
    insertIndex = task.subtasks.findIndex(st => st.id === targetSubtaskId)
  }

  if (insertIndex !== -1) {
    if (position === "above") {
      task.subtasks.splice(insertIndex, 0, createdSubtask)
    } else {
      task.subtasks.splice(insertIndex + 1, 0, createdSubtask)
    }
  } else {
    // Find the last subtask of this discipline
    for (let i = task.subtasks.length - 1; i >= 0; i--) {
      if (task.subtasks[i].discipline === discipline) {
        insertIndex = i
        break
      }
    }
    if (insertIndex !== -1) {
      task.subtasks.splice(insertIndex + 1, 0, createdSubtask)
    } else {
      task.subtasks.push(createdSubtask)
    }
  }

  // Recalculate progress
  const nonHeaders = task.subtasks.filter(st => !st.isHeader)
  if (nonHeaders.length > 0) {
    const avg = Math.round(nonHeaders.reduce((sum, st) => sum + (st.progress || 0), 0) / nonHeaders.length)
    task.progress = avg
    if (avg === 100) task.status = "เสร็จ"
    else if (avg > 0) task.status = "ดำเนินการ"
    else task.status = "รอดำเนินการ"
  }

  return task
}

export function deleteSubtaskInStore(taskId: string, subtaskId: string): Task | null {
  const task = getTaskById(taskId)
  if (!task || !task.subtasks) return null

  task.subtasks = task.subtasks.filter(st => st.id !== subtaskId)

  // Recalculate progress
  const nonHeaders = task.subtasks.filter(st => !st.isHeader)
  if (nonHeaders.length > 0) {
    const avg = Math.round(nonHeaders.reduce((sum, st) => sum + (st.progress || 0), 0) / nonHeaders.length)
    task.progress = avg
    if (avg === 100) task.status = "เสร็จ"
    else if (avg > 0) task.status = "ดำเนินการ"
    else task.status = "รอดำเนินการ"
  }

  return task
}

export function updateTaskDetailsInStore(taskId: string, updates: Partial<Task>): Task | null {
  const task = getTaskById(taskId)
  if (!task) return null

  if (updates.title !== undefined) task.title = updates.title
  if (updates.report_date !== undefined) task.report_date = updates.report_date
  if (updates.display_date !== undefined) task.display_date = updates.display_date
  if (updates.completion_date !== undefined) task.completion_date = updates.completion_date
  if (updates.total_days !== undefined) task.total_days = updates.total_days
  if (updates.wo !== undefined) task.wo = updates.wo
  if (updates.equip !== undefined) task.equip = updates.equip
  if (updates.completion_codes !== undefined) task.completion_codes = updates.completion_codes
  if (updates.imageUrl !== undefined) task.imageUrl = updates.imageUrl

  return task
}

export function recordHandoverInStore(taskId: string, fromDiscipline: DisciplineCode, toDiscipline: DisciplineCode, handoverDate: string, notes: string): Task | null {
  const task = getTaskById(taskId)
  if (!task) return null
  if (!task.handovers) task.handovers = []
  
  const handoverRecord = {
    id: `ho-${Date.now()}`,
    taskId: task.id,
    fromDiscipline,
    toDiscipline,
    handoverDate,
    notes,
    timestamp: new Date().toISOString(),
  }
  task.handovers.push(handoverRecord)
  task.current_discipline = toDiscipline
  task.status = "ดำเนินการ"

  // Update previous discipline subtasks to completed
  if (task.subtasks) {
    task.subtasks.forEach(st => {
      if (st.discipline === fromDiscipline) {
        st.progress = 100
        st.status = "เสร็จ"
      } else if (st.discipline === toDiscipline && st.status === "รอดำเนินการ") {
        st.status = "ดำเนินการ"
      }
    })
  }
  return task
}

export function generateDefaultSubtasks(task: Task): Subtask[] {
  const subtasks: Subtask[] = []
  const wCodes = task.w_codes && task.w_codes.length > 0 ? task.w_codes : ["W11", "W12", "W13"]
  
  const disciplineNames: Record<string, string> = {
    W11: "W11 : วิศวกรรม",
    W12: "W12 : เครื่องกล",
    W13: "W13 : ซ่อมเครื่องจักรกล",
    W14: "W14 : ซ่อมอุปกรณ์เครื่องจักรกล",
  }

  const disciplineSteps: Record<string, string[]> = {
    W11: ["ศึกษาแบบและสเปกทางวิศวกรรม", "คำนวณและตรวจสอบความแข็งแรง", "จัดทำแบบสั่งทำงาน"],
    W12: ["ประสานงานกับหน่วยงาน", "จัดเตรียมวัสดุและอุปกรณ์", "กลึงขึ้นรูปชิ้นงานตามแบบ", "ตรวจสอบขนาดและพิกัดความเผื่อ"],
    W13: ["เชื่อมประกอบโครงสร้าง", "ตรวจสอบแนวเชื่อม NDT", "ทดสอบการรับน้ำหนัก Load Test", "ทำสีและเก็บรายละเอียด"],
    W14: ["ตรวจเช็คระบบส่งกำลัง", "ติดตั้งอุปกรณ์และทดสอบเดินเครื่อง"],
  }

  let idCounter = 1
  for (const w of wCodes) {
    const isCurrent = task.current_discipline === w
    const isDone = task.status === "เสร็จ"
    const headerStatus: TaskStatus = isDone ? "เสร็จ" : (isCurrent ? (task.progress > 0 ? "ดำเนินการ" : "รอดำเนินการ") : "รอดำเนินการ")
    
    subtasks.push({
      id: `${task.id}-${idCounter++}`,
      category: disciplineNames[w] || `${w} : ปฏิบัติการ`,
      discipline: w as DisciplineCode,
      start: task.report_date || "1 ส.ค. 2024",
      days: 30,
      end: task.completion_date || "30 ม.ค. 2026",
      progress: isDone ? 100 : (isCurrent ? task.progress : 0),
      status: headerStatus,
      isHeader: true,
    })

    const steps = disciplineSteps[w] || ["ดำเนินการตามขั้นตอนมาตรฐาน", "ตรวจสอบและส่งมอบงาน"]
    for (const step of steps) {
      const stepStatus: TaskStatus = isDone ? "เสร็จ" : (isCurrent && task.progress >= 50 ? "เสร็จ" : (isCurrent ? "ดำเนินการ" : "รอดำเนินการ"))
      subtasks.push({
        id: `${task.id}-${idCounter++}`,
        category: step,
        discipline: w as DisciplineCode,
        start: task.report_date || "",
        days: 5,
        end: "",
        progress: isDone ? 100 : (isCurrent && task.progress >= 50 ? 100 : 0),
        status: stepStatus,
      })
    }
  }
  return subtasks
}

export function generateDefaultGantt(task: Task) {
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
  const bars = []
  const wCodes = task.w_codes || ["W11", "W12"]
  const colors: Record<string, string> = {
    W11: "bg-purple-500",
    W12: "bg-blue-500",
    W13: "bg-orange-500",
    W14: "bg-emerald-500",
  }

  let offset = 0
  for (const w of wCodes) {
    bars.push({
      label: `${w}: หมวดงาน`,
      startIdx: offset,
      width: 3,
      color: colors[w] || "bg-blue-500",
      progress: task.current_discipline === w ? task.progress : (task.status === "เสร็จ" ? 100 : 0),
      discipline: w as DisciplineCode,
    })
    offset = (offset + 3) % 9
  }

  return { months, bars }
}
