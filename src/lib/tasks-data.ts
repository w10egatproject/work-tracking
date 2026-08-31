import { Task, Subtask, TaskStatus, parseWCodes, deriveTaskStatus, DisciplineCode, DisciplineHandover } from "@/types"

export const INITIAL_TASKS: Task[] = [
  {
    "id": "1",
    "taskNo": "งานที่1",
    "title": "งานถอด Bearing Coupling Clutch Ball Mill 10",
    "wo": "4132222",
    "report_date": "27 พ.ค. 2026",
    "display_date": "27 พ.ค. 2026",
    "completion_codes": "11,12,13",
    "w_codes": [
      "W12",
      "W13",
      "W11"
    ],
    "completion_date": "31 ส.ค. 2026",
    "total_days": 96,
    "progress": 86,
    "status": "ดำเนินการ",
    "current_discipline": "W12",
    "equip": "",
    "imageUrl": "",
    "link": "https://docs.google.com/spreadsheets/d/1ZZ1iQTKzplo_VClDPZcOaKErtnqv3oVN9ocszZuR5pc/edit?gid=0#gid=0",
    "subtasks": [
      {
        "id": "1-1",
        "category": "W12 : เครื่องกล",
        "discipline": "W12",
        "start": "27 พ.ค. 2026",
        "days": 97,
        "end": "31 ส.ค. 2026",
        "progress": 90,
        "status": "ดำเนินการ",
        "isHeader": true
      },
      {
        "id": "1-2",
        "category": "ประสานงานกับหน่วยงาน",
        "discipline": "W12",
        "start": "27 พ.ค. 2026",
        "days": 2,
        "end": "28 พ.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-3",
        "category": "การกลึงล้างก่อนเชื่อม1",
        "discipline": "W12",
        "start": "4 มิ.ย. 2026",
        "days": 7,
        "end": "10 มิ.ย. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-4",
        "category": "การกลึงล้างเก็บขนาดหลังเชื่อม",
        "discipline": "W12",
        "start": "22 มิ.ย. 2026",
        "days": 5,
        "end": "26 มิ.ย. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-5",
        "category": "การกลึงล้างเก็บขนาดหลังเชื่อม2",
        "discipline": "W12",
        "start": "8 ก.ค. 2026",
        "days": 7,
        "end": "14 ก.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-6",
        "category": "ทำร่องคีย์เก็บงาน",
        "discipline": "W12",
        "start": "3 ส.ค. 2026",
        "days": 29,
        "end": "31 ส.ค. 2026",
        "progress": 50,
        "status": "ดำเนินการ",
        "isHeader": false
      },
      {
        "id": "1-7",
        "category": "W13 : เชื่อมเครื่องกล",
        "discipline": "W13",
        "start": "1 มิ.ย. 2026",
        "days": 92,
        "end": "31 ส.ค. 2026",
        "progress": 75,
        "status": "ดำเนินการ",
        "isHeader": true
      },
      {
        "id": "1-8",
        "category": "ถอดอุปกรณ์",
        "discipline": "W13",
        "start": "1 มิ.ย. 2026",
        "days": 2,
        "end": "2 มิ.ย. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-9",
        "category": "เชื่อมพอก1",
        "discipline": "W13",
        "start": "11 มิ.ย. 2026",
        "days": 7,
        "end": "17 มิ.ย. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-10",
        "category": "เชื่อมพอก2",
        "discipline": "W13",
        "start": "29 มิ.ย. 2026",
        "days": 5,
        "end": "3 ก.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-11",
        "category": "ประกอบชิ้นงาน",
        "discipline": "W13",
        "start": "31 ส.ค. 2026",
        "days": 1,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "1-12",
        "category": "ส่งมอบ",
        "discipline": "W13",
        "start": "31 ส.ค. 2026",
        "days": 1,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "ยังไม่ดำเนินการ",
        "isHeader": false
      },
      {
        "id": "1-13",
        "category": "W11 : วิศวกรรม",
        "discipline": "W11",
        "start": "11 มิ.ย. 2026",
        "days": 72,
        "end": "21 ส.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": true
      },
      {
        "id": "1-14",
        "category": "กำหนดงานเชื่อม",
        "discipline": "W11",
        "start": "11 มิ.ย. 2026",
        "days": 7,
        "end": "17 มิ.ย. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-15",
        "category": "Preheat-PostHeet",
        "discipline": "W11",
        "start": "29 มิ.ย. 2026",
        "days": 5,
        "end": "3 ก.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-16",
        "category": "ตรวจสอบรอยร้าว1",
        "discipline": "W11",
        "start": "18 มิ.ย. 2026",
        "days": 2,
        "end": "19 มิ.ย. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-17",
        "category": "ตรวจสอบรอยร้าว2",
        "discipline": "W11",
        "start": "6 ก.ค. 2026",
        "days": 2,
        "end": "7 ก.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-18",
        "category": "เขียนแบบทำเครื่องมือกัดร่องคีย์",
        "discipline": "W11",
        "start": "3 ส.ค. 2026",
        "days": 2,
        "end": "4 ส.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-19",
        "category": "เชื่อมประกอบเครื่องมือกัดร่องคีย์",
        "discipline": "W11",
        "start": "6 ส.ค. 2026",
        "days": 6,
        "end": "11 ส.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-20",
        "category": "เขียนแบบทำ Support",
        "discipline": "W11",
        "start": "10 ส.ค. 2026",
        "days": 2,
        "end": "11 ส.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "1-21",
        "category": "เชื่อมประกอบSupport",
        "discipline": "W11",
        "start": "17 ส.ค. 2026",
        "days": 5,
        "end": "21 ส.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      }
    ]
  },
  {
    "id": "2",
    "taskNo": "งานที่2",
    "title": "ถอดแยกชิ้นเร่งโซ่",
    "wo": "4149308",
    "report_date": "7 ก.ค. 2026",
    "display_date": "7 ก.ค. 2026",
    "completion_codes": "11,12,13",
    "w_codes": [
      "W13",
      "W12",
      "W11"
    ],
    "completion_date": "31 ส.ค. 2026",
    "total_days": 55,
    "progress": 40,
    "status": "ดำเนินการ",
    "current_discipline": "W13",
    "equip": "340117 รถขุดไฮดรอลิค",
    "imageUrl": "",
    "link": "https://docs.google.com/spreadsheets/d/1ZZ1iQTKzplo_VClDPZcOaKErtnqv3oVN9ocszZuR5pc/edit?gid=1644386592#gid=1644386592",
    "subtasks": [
      {
        "id": "2-1",
        "category": "W13 : เชื่อมเครื่องกล",
        "discipline": "W13",
        "start": "7 ก.ค. 2026",
        "days": 56,
        "end": "31 ส.ค. 2026",
        "progress": 67,
        "status": "ดำเนินการ",
        "isHeader": true
      },
      {
        "id": "2-2",
        "category": "ประสานงานกับหน่วยงาน",
        "discipline": "W13",
        "start": "7 ก.ค. 2026",
        "days": 1,
        "end": "7 ก.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "2-3",
        "category": "ถอดอุปกรณ์",
        "discipline": "W13",
        "start": "8 ก.ค. 2026",
        "days": 3,
        "end": "10 ก.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "2-4",
        "category": "ประกอบชิ้นงานส่งมอบ",
        "discipline": "W13",
        "start": "31 ส.ค. 2026",
        "days": 1,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "2-5",
        "category": "W12 : เครื่องกล",
        "discipline": "W12",
        "start": "31 ส.ค. 2026",
        "days": 1,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": true
      },
      {
        "id": "2-6",
        "category": "งานย่อย",
        "discipline": "W12",
        "start": "31 ส.ค. 2026",
        "days": 1,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "2-7",
        "category": "งานย่อย",
        "discipline": "W12",
        "start": "31 ส.ค. 2026",
        "days": 1,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "2-8",
        "category": "W11 : วิศวกรรม",
        "discipline": "W11",
        "start": "15 ก.ค. 2026",
        "days": 48,
        "end": "31 ส.ค. 2026",
        "progress": 40,
        "status": "ดำเนินการ",
        "isHeader": true
      },
      {
        "id": "2-9",
        "category": "Dwg ทุกอุปกรณ์",
        "discipline": "W11",
        "start": "15 ก.ค. 2026",
        "days": 8,
        "end": "22 ก.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "2-10",
        "category": "Mat ตรวจสอบ",
        "discipline": "W11",
        "start": "16 ก.ค. 2026",
        "days": 2,
        "end": "17 ก.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "2-11",
        "category": "ออกเรื่องจ้าง รอข้อกำหนดจาก หสบ-ช.",
        "discipline": "W11",
        "start": "31 ส.ค. 2026",
        "days": 1,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "2-12",
        "category": "อยู่ระหว่างงานจ้าง",
        "discipline": "W11",
        "start": "31 ส.ค. 2026",
        "days": 1,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "2-13",
        "category": "ตรวจรับงานจ้าง",
        "discipline": "W11",
        "start": "31 ส.ค. 2026",
        "days": 1,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      }
    ]
  },
  {
    "id": "3",
    "taskNo": "งานที่3",
    "title": "ทำ Hand Wheel Gate Valve จำนวน 15 EA",
    "wo": "4141026",
    "report_date": "18 มิ.ย. 2026",
    "display_date": "18 มิ.ย. 2026",
    "completion_codes": "11,12,13",
    "w_codes": [
      "W13",
      "W12",
      "W11"
    ],
    "completion_date": "31 ส.ค. 2026",
    "total_days": 74,
    "progress": 22,
    "status": "ดำเนินการ",
    "current_discipline": "W13",
    "equip": "",
    "imageUrl": "",
    "link": "https://docs.google.com/spreadsheets/d/1ZZ1iQTKzplo_VClDPZcOaKErtnqv3oVN9ocszZuR5pc/edit?gid=1826908641#gid=1826908641",
    "subtasks": [
      {
        "id": "3-1",
        "category": "W13 : เชื่อมเครื่องกล",
        "discipline": "W13",
        "start": "18 มิ.ย. 2026",
        "days": 75,
        "end": "31 ส.ค. 2026",
        "progress": 20,
        "status": "ดำเนินการ",
        "isHeader": true
      },
      {
        "id": "3-2",
        "category": "ประสานงานกับหน่วยงาน",
        "discipline": "W13",
        "start": "18 มิ.ย. 2026",
        "days": 1,
        "end": "18 มิ.ย. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "3-3",
        "category": "เตรียมวัสดุ",
        "discipline": "W13",
        "start": "19 มิ.ย. 2026",
        "days": 74,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "3-4",
        "category": "ขึ้นรูป",
        "discipline": "W13",
        "start": "19 มิ.ย. 2026",
        "days": 74,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "3-5",
        "category": "เชื่อมประกอบชิ้นงาน",
        "discipline": "W13",
        "start": "19 มิ.ย. 2026",
        "days": 74,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "3-6",
        "category": "ส่งงาน",
        "discipline": "W13",
        "start": "19 มิ.ย. 2026",
        "days": 74,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "3-7",
        "category": "W12 : เครื่องกล",
        "discipline": "W12",
        "start": "19 มิ.ย. 2026",
        "days": 74,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": true
      },
      {
        "id": "3-8",
        "category": "เตรียมวัสดุ",
        "discipline": "W12",
        "start": "19 มิ.ย. 2026",
        "days": 74,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "3-9",
        "category": "ขึ้นรูปส่วนประกอบ",
        "discipline": "W12",
        "start": "19 มิ.ย. 2026",
        "days": 74,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "3-10",
        "category": "W11 : วิศวกรรม",
        "discipline": "W11",
        "start": "13 ส.ค. 2026",
        "days": 19,
        "end": "31 ส.ค. 2026",
        "progress": 50,
        "status": "ดำเนินการ",
        "isHeader": true
      },
      {
        "id": "3-11",
        "category": "เขียนแบบส่วนประกอบ",
        "discipline": "W11",
        "start": "13 ส.ค. 2026",
        "days": 2,
        "end": "14 ส.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "3-12",
        "category": "ตรวจสอบการประกอบ",
        "discipline": "W11",
        "start": "31 ส.ค. 2026",
        "days": 1,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      }
    ]
  },
  {
    "id": "4",
    "taskNo": "งานที่4",
    "title": "ซ่อม Final Drive",
    "wo": "4153669",
    "report_date": "21 ก.ค. 2026",
    "display_date": "21 ก.ค. 2026",
    "completion_codes": "11,12,13",
    "w_codes": [
      "W12",
      "W13",
      "W11"
    ],
    "completion_date": "31 ส.ค. 2026",
    "total_days": 41,
    "progress": 50,
    "status": "ดำเนินการ",
    "current_discipline": "W12",
    "equip": "640148 รถแทรคเตอร์ดันดินตีนตะขาบ",
    "imageUrl": "",
    "link": "",
    "subtasks": [
      {
        "id": "4-1",
        "category": "W12 : เครื่องกล",
        "discipline": "W12",
        "start": "21 ก.ค. 2026",
        "days": 42,
        "end": "31 ส.ค. 2026",
        "progress": 33,
        "status": "ดำเนินการ",
        "isHeader": true
      },
      {
        "id": "4-2",
        "category": "ประสานงานกับหน่วยงาน",
        "discipline": "W12",
        "start": "21 ก.ค. 2026",
        "days": 1,
        "end": "21 ก.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "4-3",
        "category": "ฺBore Center",
        "discipline": "W12",
        "start": "22 ก.ค. 2026",
        "days": 41,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "4-4",
        "category": "ทำรูที่ซ่อมรอยร้าว",
        "discipline": "W12",
        "start": "22 ก.ค. 2026",
        "days": 41,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "4-5",
        "category": "W13 : เชื่อมเครื่องกล",
        "discipline": "W13",
        "start": "22 ก.ค. 2026",
        "days": 41,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": true
      },
      {
        "id": "4-6",
        "category": "เชื่อมซ่อมรอยร้าว",
        "discipline": "W13",
        "start": "22 ก.ค. 2026",
        "days": 41,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "4-7",
        "category": "W11 : วิศวกรรม",
        "discipline": "W11",
        "start": "4 ส.ค. 2026",
        "days": 28,
        "end": "31 ส.ค. 2026",
        "progress": 75,
        "status": "ดำเนินการ",
        "isHeader": true
      },
      {
        "id": "4-8",
        "category": "ตรวจสอบรอยร้าวก่อนซ่อม",
        "discipline": "W11",
        "start": "4 ส.ค. 2026",
        "days": 2,
        "end": "5 ส.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "4-9",
        "category": "Mat ตรวจสอบ",
        "discipline": "W11",
        "start": "6 ส.ค. 2026",
        "days": 2,
        "end": "7 ส.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "4-10",
        "category": "Dwg ทำ Jig แบบตัด",
        "discipline": "W11",
        "start": "13 ส.ค. 2026",
        "days": 1,
        "end": "13 ส.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "4-11",
        "category": "ตรวจสอบรอยร้าวหลังซ่อม",
        "discipline": "W11",
        "start": "31 ส.ค. 2026",
        "days": 1,
        "end": "31 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      }
    ]
  },
  {
    "id": "5",
    "taskNo": "งานที่5",
    "title": "ตัดเหล็กสร้าง Base Plate ชุดรางเดินเครื่องจักร Bay7(ST.5)  จำนวน 753 EA",
    "wo": "4161472",
    "report_date": "1 ก.ค. 2026",
    "display_date": "24 ส.ค. 2026",
    "completion_codes": "11,12,14",
    "w_codes": [
      "W13",
      "W12",
      "W11"
    ],
    "completion_date": "22 ก.ย. 2026",
    "total_days": 29,
    "progress": 17,
    "status": "ดำเนินการ",
    "current_discipline": "W13",
    "equip": "",
    "imageUrl": "",
    "link": "https://docs.google.com/spreadsheets/d/1ZZ1iQTKzplo_VClDPZcOaKErtnqv3oVN9ocszZuR5pc/edit?gid=1677863492#gid=1677863492",
    "subtasks": [
      {
        "id": "5-1",
        "category": "แผนกวางแผนและประเมินผลบํารุงรักษา",
        "discipline": "W11",
        "start": "1 ก.ย. 2026",
        "days": 22,
        "end": "22 ก.ย. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": true
      },
      {
        "id": "5-2",
        "category": "W13 : เชื่อมเครื่องกล",
        "discipline": "W13",
        "start": "24 ส.ค. 2026",
        "days": 10,
        "end": "2 ก.ย. 2026",
        "progress": 25,
        "status": "ดำเนินการ",
        "isHeader": true
      },
      {
        "id": "5-3",
        "category": "ประสานงานกับหน่วยงาน",
        "discipline": "W13",
        "start": "24 ส.ค. 2026",
        "days": 1,
        "end": "24 ส.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "5-4",
        "category": "เตรียมวัสดุ",
        "discipline": "W13",
        "start": "26 ส.ค. 2026",
        "days": 1,
        "end": "26 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "5-5",
        "category": "ตัดตามแบบกำหนด",
        "discipline": "W13",
        "start": "27 ส.ค. 2026",
        "days": 2,
        "end": "28 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "5-6",
        "category": "ส่งงาน",
        "discipline": "W13",
        "start": "2 ก.ย. 2026",
        "days": 1,
        "end": "2 ก.ย. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "5-7",
        "category": "W12 : เครื่องกล",
        "discipline": "W12",
        "start": "31 ส.ค. 2026",
        "days": 2,
        "end": "1 ก.ย. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": true
      },
      {
        "id": "5-8",
        "category": "เจาะตามแบบ",
        "discipline": "W12",
        "start": "31 ส.ค. 2026",
        "days": 2,
        "end": "1 ก.ย. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "5-9",
        "category": "W11 : วิศวกรรม",
        "discipline": "W11",
        "start": "25 ส.ค. 2026",
        "days": 1,
        "end": "25 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": true
      },
      {
        "id": "5-10",
        "category": "เขียนแบบตัด",
        "discipline": "W11",
        "start": "25 ส.ค. 2026",
        "days": 1,
        "end": "25 ส.ค. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      }
    ]
  },
  {
    "id": "6",
    "taskNo": "งานที่6",
    "title": "ปรับปรุงPontoonนสำรวจสภาพพื้นผิวSump 2SW \nซื้อแผ่นเหล็กตีนไก่ ขนาด 4x8ฟุต PR.1500240230",
    "wo": "4161863",
    "report_date": "27 ส.ค. 2026",
    "display_date": "27 ส.ค. 2026",
    "completion_codes": "11,13",
    "w_codes": [
      "W13",
      "W11"
    ],
    "completion_date": "7 ก.ย. 2026",
    "total_days": 11,
    "progress": 30,
    "status": "ดำเนินการ",
    "current_discipline": "W13",
    "equip": "",
    "imageUrl": "",
    "link": "https://docs.google.com/spreadsheets/d/1ZZ1iQTKzplo_VClDPZcOaKErtnqv3oVN9ocszZuR5pc/edit?gid=80428362#gid=80428362",
    "subtasks": [
      {
        "id": "6-1",
        "category": "W13 : เชื่อมเครื่องกล",
        "discipline": "W13",
        "start": "27 ส.ค. 2026",
        "days": 12,
        "end": "7 ก.ย. 2026",
        "progress": 40,
        "status": "ดำเนินการ",
        "isHeader": true
      },
      {
        "id": "6-2",
        "category": "ประสานงานกับหน่วยงาน",
        "discipline": "W13",
        "start": "27 ส.ค. 2026",
        "days": 1,
        "end": "27 ส.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "6-3",
        "category": "งานพ่นทราย (หวขบ-ช)",
        "discipline": "W13",
        "start": "28 ส.ค. 2026",
        "days": 5,
        "end": "1 ก.ย. 2026",
        "progress": 20,
        "status": "ดำเนินการ",
        "isHeader": false
      },
      {
        "id": "6-4",
        "category": "เชื่อมซ่อม",
        "discipline": "W13",
        "start": "1 ก.ย. 2026",
        "days": 7,
        "end": "7 ก.ย. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "6-5",
        "category": "W11 : วิศวกรรม",
        "discipline": "W11",
        "start": "27 ส.ค. 2026",
        "days": 12,
        "end": "7 ก.ย. 2026",
        "progress": 30,
        "status": "ดำเนินการ",
        "isHeader": true
      },
      {
        "id": "6-6",
        "category": "ประสานงานกับหน่วยงานพ่นทราย",
        "discipline": "W11",
        "start": "27 ส.ค. 2026",
        "days": 1,
        "end": "27 ส.ค. 2026",
        "progress": 100,
        "status": "เสร็จ",
        "isHeader": false
      },
      {
        "id": "6-7",
        "category": "NDT แนวเชื่อม ก่อน",
        "discipline": "W11",
        "start": "1 ก.ย. 2026",
        "days": 2,
        "end": "2 ก.ย. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "6-8",
        "category": "งานติดตามแผ่นเหล็กตีนไก่",
        "discipline": "W11",
        "start": "2 ก.ย. 2026",
        "days": 2,
        "end": "3 ก.ย. 2026",
        "progress": 20,
        "status": "ดำเนินการ",
        "isHeader": false
      },
      {
        "id": "6-9",
        "category": "NDT แนวเชื่อม หลัง",
        "discipline": "W11",
        "start": "7 ก.ย. 2026",
        "days": 1,
        "end": "7 ก.ย. 2026",
        "progress": 0,
        "status": "รอดำเนินการ",
        "isHeader": false
      },
      {
        "id": "6-10",
        "category": "ส่งมอบงาน",
        "discipline": "W11",
        "start": "7 ก.ย. 2026",
        "days": 1,
        "end": "7 ก.ย. 2026",
        "progress": 0,
        "status": "ยังไม่ดำเนินการ",
        "isHeader": false
      }
    ]
  }
]

// In-memory runtime state for tasks & subtasks so updates persist during server lifecycle
let tasksStore = [...INITIAL_TASKS].sort((a, b) => {
  const numA = parseInt(a.id.replace(/\D/g, "") || (a.taskNo || "").replace(/\D/g, "") || "0", 10)
  const numB = parseInt(b.id.replace(/\D/g, "") || (b.taskNo || "").replace(/\D/g, "") || "0", 10)
  return numB - numA
})

export function getTasksStore(): Task[] {
  return tasksStore.sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, "") || (a.taskNo || "").replace(/\D/g, "") || "0", 10)
    const numB = parseInt(b.id.replace(/\D/g, "") || (b.taskNo || "").replace(/\D/g, "") || "0", 10)
    return numB - numA
  })
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
  const maxNum = tasksStore.reduce((max, t) => {
    const num = parseInt(t.id.replace(/\D/g, "") || (t.taskNo || "").replace(/\D/g, "") || "0", 10)
    return !isNaN(num) && num > max ? num : max
  }, 0)
  const nextNum = maxNum + 1
  const explicitId = newTask.id || (newTask.taskNo ? newTask.taskNo.replace(/\D/g, "") : "")
  const finalId = explicitId || String(nextNum)
  const taskNo = newTask.taskNo || `งานที่${finalId}`

  const wCodes = parseWCodes(newTask.completion_codes || "")
  const status = deriveTaskStatus(newTask.completion_date, newTask.link)
  const created: Task = {
    id: finalId,
    taskNo,
    title: newTask.title || `งานซ่อมบำรุง #${finalId}`,
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
    handovers: newTask.handovers || [],
  }
  created.subtasks = newTask.subtasks || generateDefaultSubtasks(created)
  created.gantt = newTask.gantt || generateDefaultGantt(created)
  tasksStore.unshift(created)
  tasksStore.sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, "") || (a.taskNo || "").replace(/\D/g, "") || "0", 10)
    const numB = parseInt(b.id.replace(/\D/g, "") || (b.taskNo || "").replace(/\D/g, "") || "0", 10)
    return numB - numA
  })
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

export function recordHandoverInStore(
  taskId: string,
  fromDiscipline: DisciplineCode,
  toDiscipline: DisciplineCode,
  handoverDate: string,
  notes: string,
  byUser?: string
): Task | null {
  const task = getTaskById(taskId)
  if (!task) return null
  if (!task.handovers) task.handovers = []
  
  const handoverRecord: DisciplineHandover = {
    id: `ho-${Date.now()}`,
    taskId: task.id,
    fromDiscipline,
    toDiscipline,
    handoverDate,
    notes,
    byUser: byUser || "",
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

export function deleteTaskFromStore(id: string): boolean {
  const index = tasksStore.findIndex(
    (t) => t.id === id || t.taskNo === id || t.taskNo === `งานที่${id}` || t.id.replace(/\D/g, "") === id.replace(/\D/g, "")
  )
  if (index === -1) return false
  tasksStore.splice(index, 1)
  return true
}
