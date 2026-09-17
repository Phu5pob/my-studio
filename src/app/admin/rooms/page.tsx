import { db } from "@/db";
import { formatThaiDate } from "@/lib/format";
import { createRoomAction, deleteRoomAction } from "@/lib/actions/rooms";

export default async function AdminRoomsPage() {
  const [branches, rooms] = await Promise.all([
    db.query.branches.findMany(),
    db.query.rooms.findMany({ with: { branch: true }, orderBy: (r, { asc }) => [asc(r.branchId), asc(r.name)] }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-xl mb-4">เพิ่มห้องเรียนใหม่</h2>
        <form action={createRoomAction} className="border border-line rounded-md p-5 bg-white max-w-lg space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-ink-soft mb-1.5">สาขา</label>
              <select name="branchId" required className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30">
                <option value="">เลือกสาขา</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-ink-soft mb-1.5">ชื่อห้อง</label>
              <input name="name" required placeholder="เช่น ห้อง A1" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-ink-soft mb-1.5">ความจุ (คน)</label>
              <input type="number" name="capacity" defaultValue={1} min={1} className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
            </div>
            <div>
              <label className="block text-sm text-ink-soft mb-1.5">รายละเอียด</label>
              <input name="description" placeholder="เช่น ห้องเปียโน กันเสียง" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
            </div>
          </div>
          <button type="submit" className="rounded-full bg-burgundy text-white px-5 py-2.5 text-sm hover:bg-burgundy-deep transition-colors">เพิ่มห้อง</button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">ห้องทั้งหมด ({rooms.length})</h2>
        <div className="border border-line rounded-md overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-ivory-deep text-ink-soft text-xs">
              <tr>
                <th className="text-left px-4 py-3 font-normal">ชื่อห้อง</th>
                <th className="text-left px-4 py-3 font-normal">สาขา</th>
                <th className="text-left px-4 py-3 font-normal">ความจุ</th>
                <th className="text-left px-4 py-3 font-normal">รายละเอียด</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{room.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{room.branch?.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{room.capacity} คน</td>
                  <td className="px-4 py-3 text-ink-soft">{room.description || "-"}</td>
                  <td className="px-4 py-3">
                    <form action={deleteRoomAction}>
                      <input type="hidden" name="id" value={room.id} />
                      <button className="text-xs text-danger hover:underline">ลบ</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
