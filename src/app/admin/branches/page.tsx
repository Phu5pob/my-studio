import { db } from "@/db";
import { BranchForm } from "@/components/admin/branch-form";
import { deleteBranchAction } from "@/lib/actions/branches";

export default async function AdminBranchesPage() {
  const branches = await db.query.branches.findMany();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-xl mb-4">เพิ่มสาขาใหม่</h2>
        <div className="border border-line rounded-md p-5 bg-white max-w-2xl">
          <BranchForm />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">สาขาทั้งหมด ({branches.length})</h2>
        <div className="space-y-4">
          {branches.map((branch) => (
            <details key={branch.id} className="border border-line rounded-md bg-white">
              <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{branch.name}</p>
                  <p className="text-xs text-ink-soft mt-1">{branch.address}</p>
                </div>
                <span className="text-xs text-burgundy">แก้ไข / ลบ</span>
              </summary>
              <div className="p-5 pt-0 space-y-4">
                <BranchForm branch={branch} />
                <form action={deleteBranchAction} className="pt-2">
                  <input type="hidden" name="id" value={branch.id} />
                  <button className="text-sm text-danger hover:underline">ลบสาขานี้</button>
                </form>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
