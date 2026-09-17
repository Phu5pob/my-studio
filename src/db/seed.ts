import { db, schema } from "./index";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  await db.delete(schema.progressRecords);
  await db.delete(schema.payments);
  await db.delete(schema.enrollments);
  await db.delete(schema.schedules);
  await db.delete(schema.articles);
  await db.delete(schema.courses);
  await db.delete(schema.rooms);
  await db.delete(schema.users);
  await db.delete(schema.branches);

  // ---------- Branches ----------
  const [phatthalung, trang, nakhon] = await db.insert(schema.branches).values([
    { name: "สาขาพัทลุง", address: "123 ถ.ราเมศวร์ อ.เมือง จ.พัทลุง 93000", phone: "074-111-222", description: "สาขาหลักกลางเมืองพัทลุง ห้องซ้อมกันเสียง 4 ห้อง", imageUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1200" },
    { name: "สาขาตรัง", address: "456 ถ.พระราม 6 อ.เมือง จ.ตรัง 92000", phone: "075-333-444", description: "บรรยากาศอบอุ่น เหมาะสำหรับเด็กและครอบครัว", imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200" },
    { name: "สาขานครศรีธรรมราช", address: "789 ถ.ราชดำเนิน อ.เมือง จ.นครศรีธรรมราช 80000", phone: "075-555-666", description: "สาขาใหม่ล่าสุด ห้องเรียนทันสมัย", imageUrl: "https://images.unsplash.com/photo-1571327073757-af4d0c3c8c3e?q=80&w=1200" },
  ]).returning();

  // ---------- Rooms ----------
  const [roomA1, roomA2, roomB1, roomB2, roomC1] = await db.insert(schema.rooms).values([
    { branchId: phatthalung.id, name: "ห้อง A1", capacity: 1, description: "ห้องเปียโน กันเสียง" },
    { branchId: phatthalung.id, name: "ห้อง A2", capacity: 1, description: "ห้องกีตาร์ กันเสียง" },
    { branchId: trang.id, name: "ห้อง B1", capacity: 1, description: "ห้องร้องเพลง" },
    { branchId: trang.id, name: "ห้อง B2", capacity: 1, description: "ห้องไวโอลิน" },
    { branchId: nakhon.id, name: "ห้อง C1", capacity: 2, description: "ห้องกลองชุด กันเสียงพิเศษ" },
  ]).returning();

  // ---------- Users ----------
  const adminHash = await bcrypt.hash("admin1234", 10);
  const teacherHash = await bcrypt.hash("teacher1234", 10);
  const studentHash = await bcrypt.hash("student1234", 10);

  const [admin] = await db.insert(schema.users).values({
    name: "ผู้ดูแลระบบ", email: "admin@mystudio.example",
    passwordHash: adminHash, role: "admin", phone: "0802354146", branchId: phatthalung.id,
  }).returning();

  const [teacher1] = await db.insert(schema.users).values({
    name: "ครูแนน", email: "teacher1@mystudio.example",
    passwordHash: teacherHash, role: "teacher", phone: "081-111-1111", branchId: phatthalung.id,
  }).returning();

  const [teacher2] = await db.insert(schema.users).values({
    name: "ครูบอล", email: "teacher2@mystudio.example",
    passwordHash: teacherHash, role: "teacher", phone: "081-222-2222", branchId: trang.id,
  }).returning();

  const [demoStudent] = await db.insert(schema.users).values({
    name: "น้องมิว ทดสอบระบบ", email: "student@mystudio.example",
    passwordHash: studentHash, role: "student", phone: "081-234-5678", branchId: phatthalung.id,
  }).returning();

  // ---------- Courses ----------
  const [c1, c2, c3, c4, c5] = await db.insert(schema.courses).values([
    { branchId: phatthalung.id, title: "เปียโนพื้นฐาน", slug: "piano-beginner-phatthalung", instrument: "เปียโน", level: "beginner" as const, description: "ปูพื้นฐานการอ่านโน้ต จังหวะ เทคนิคการวางนิ้ว", price: 3200, durationWeeks: 12, imageUrl: "https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=1200" },
    { branchId: phatthalung.id, title: "กีตาร์โปร่งเริ่มต้น", slug: "guitar-beginner-phatthalung", instrument: "กีตาร์", level: "beginner" as const, description: "เรียนคอร์ดพื้นฐาน การตีคอร์ด เพลงยอดนิยม", price: 2800, durationWeeks: 10, imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1200" },
    { branchId: trang.id, title: "ร้องเพลงและฝึกหายใจ", slug: "vocal-trang", instrument: "ร้องเพลง", level: "beginner" as const, description: "ฝึกเทคนิคการหายใจ ควบคุมเสียง ตีความเพลง", price: 3500, durationWeeks: 12, imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200" },
    { branchId: trang.id, title: "ไวโอลินระดับกลาง", slug: "violin-intermediate-trang", instrument: "ไวโอลิน", level: "intermediate" as const, description: "เทคนิคการโยกคันชัก บทเพลงคลาสสิกระดับกลาง", price: 4200, durationWeeks: 14, imageUrl: "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?q=80&w=1200" },
    { branchId: nakhon.id, title: "กลองชุดเริ่มต้น", slug: "drums-nakhon", instrument: "กลอง", level: "beginner" as const, description: "จังหวะพื้นฐาน การตีกลองชุด ในห้องกันเสียง", price: 3800, durationWeeks: 12, imageUrl: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=1200" },
  ]).returning();

  // ---------- Schedules (ครูจับห้อง) ----------
  const [sched1] = await db.insert(schema.schedules).values([
    { courseId: c1.id, teacherId: teacher1.id, roomId: roomA1.id, dayOfWeek: 6, startTime: "10:00", endTime: "11:00", maxStudents: 6 },
    { courseId: c2.id, teacherId: teacher1.id, roomId: roomA2.id, dayOfWeek: 6, startTime: "13:00", endTime: "14:00", maxStudents: 6 },
    { courseId: c3.id, teacherId: teacher2.id, roomId: roomB1.id, dayOfWeek: 0, startTime: "14:00", endTime: "15:00", maxStudents: 6 },
    { courseId: c4.id, teacherId: teacher2.id, roomId: roomB2.id, dayOfWeek: 3, startTime: "17:00", endTime: "18:00", maxStudents: 4 },
    { courseId: c5.id, teacherId: null, roomId: roomC1.id, dayOfWeek: 5, startTime: "10:30", endTime: "11:30", maxStudents: 2 },
  ]).returning();

  // ---------- Enrollment + Payment + Progress ----------
  const [enrollment] = await db.insert(schema.enrollments).values({
    userId: demoStudent.id, courseId: c1.id, scheduleId: sched1.id,
    status: "confirmed", note: "ลงทะเบียนทดสอบ",
  }).returning();

  await db.insert(schema.payments).values({
    userId: demoStudent.id, enrollmentId: enrollment.id,
    invoiceNo: "INV-2569-0001", amount: c1.price,
    method: "bank_transfer", status: "paid", paidAt: new Date(),
  });

  await db.insert(schema.progressRecords).values({
    userId: demoStudent.id, courseId: c1.id, teacherId: teacher1.id,
    term: "เทอม 1/2569", score: 88, skillLevel: "เกรด 1 (พื้นฐาน)",
    teacherComment: "อ่านโน้ตได้คล่องขึ้นมาก ฝึกจังหวะเพิ่มอีกนิดจะดีมาก",
  });

  // ---------- Articles ----------
  await db.insert(schema.articles).values([
    { title: "เปิดรับสมัครคอร์สฤดูร้อน 2569", slug: "summer-2569", excerpt: "คอร์สเข้มข้น 4 สัปดาห์ ทุกเครื่องดนตรี", content: "My Studio เปิดรับสมัครคอร์สฤดูร้อน 2569 ทุกสาขา สมัครก่อนสิ้นเดือนนี้ รับส่วนลด 10%", coverImage: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=1200", branchId: null, authorId: admin.id, published: true },
    { title: "คอนเสิร์ตนักเรียนประจำปี สาขาพัทลุง", slug: "recital-phatthalung", excerpt: "วันเสาร์ที่ 4 ตุลาคม เข้าชมฟรี", content: "ขอเชิญร่วมชมคอนเสิร์ตนักเรียน สาขาพัทลุง วันเสาร์ที่ 4 ตุลาคม เวลา 18:00 น.", coverImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200", branchId: phatthalung.id, authorId: admin.id, published: true },
  ]);

  console.log("✅ Seed complete.");
  console.log("   Admin:   admin@mystudio.example / admin1234");
  console.log("   ครู:     teacher1@mystudio.example / teacher1234");
  console.log("   Student: student@mystudio.example / student1234");
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
