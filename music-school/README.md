# 🎵 My Studio — ระบบเว็บโรงเรียนสอนดนตรี

Next.js 16 · TypeScript · Drizzle ORM · Neon PostgreSQL · Tailwind CSS v4

---

## วิธี Deploy บน Vercel + Neon (ฟรีทั้งคู่)

### ขั้นตอนที่ 1 — สร้าง Database บน Neon
1. ไปที่ **neon.tech** → Sign up ฟรี
2. กด **New Project** → ตั้งชื่อ เช่น `my-studio`
3. คัดลอก **Connection string** (ขึ้นต้นด้วย `postgresql://...`)

### ขั้นตอนที่ 2 — อัปโหลดขึ้น GitHub
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/my-studio.git
git push -u origin main
```

### ขั้นตอนที่ 3 — Deploy บน Vercel
1. ไปที่ **vercel.com** → Login ด้วย GitHub
2. กด **Add New Project** → เลือก repo `my-studio`
3. ไปที่ **Environment Variables** ใส่:
   ```
   DATABASE_URL  =  postgresql://... (จาก Neon)
   JWT_SECRET    =  สร้าง string ยาวๆ สุ่มได้ เช่น uuid 2 อันต่อกัน
   ```
4. กด **Deploy** รอประมาณ 1-2 นาที

### ขั้นตอนที่ 4 — สร้างตารางและ seed ข้อมูล
หลัง deploy แล้ว รันในเครื่องตัวเองโดยตั้ง DATABASE_URL เป็น URL จาก Neon:
```bash
# Windows CMD
set DATABASE_URL=postgresql://...
npm run db:push
npm run db:seed
```

---

## บัญชีทดลอง (หลัง seed)

| บทบาท | อีเมล | รหัสผ่าน |
|--------|-------|---------|
| แอดมิน | admin@mystudio.example | admin1234 |
| นักเรียน | student@mystudio.example | student1234 |

---

## รันในเครื่องตัวเอง (Local)

```bash
npm install --legacy-peer-deps
# ตั้ง DATABASE_URL ใน .env.local ก่อน
npm run db:push
npm run db:seed
npm run dev
# http://localhost:3000
```
