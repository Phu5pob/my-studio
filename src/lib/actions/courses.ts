export async function updateScheduleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "ไม่พบรอบเรียนที่ต้องการแก้ไข" };
  }

  const parsed = scheduleSchema.safeParse({
    courseId: formData.get("courseId"),
    teacherId: formData.get("teacherId") || undefined,
    roomId: formData.get("roomId") || undefined,
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    maxStudents: formData.get("maxStudents"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
    };
  }

  if (parsed.data.startTime >= parsed.data.endTime) {
    return { error: "เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม" };
  }

  const existing = await db.query.schedules.findFirst({
    where: eq(schema.schedules.id, id),
  });

  if (!existing || existing.courseId !== parsed.data.courseId) {
    return { error: "ไม่พบรอบเรียนที่ต้องการแก้ไข" };
  }

  await db
    .update(schema.schedules)
    .set({
      teacherId: parsed.data.teacherId ?? null,
      roomId: parsed.data.roomId ?? null,
      dayOfWeek: parsed.data.dayOfWeek,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      maxStudents: parsed.data.maxStudents,
    })
    .where(eq(schema.schedules.id, id));

  revalidatePath("/admin/courses");
  revalidatePath("/courses");

  return null;
}
