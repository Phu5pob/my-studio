"use client";

import { useActionState } from "react";
import { createBranchAction, updateBranchAction } from "@/lib/actions/branches";
import { SubmitButton } from "@/components/ui";

type Branch = {
  id: number;
  name: string;
  address: string;
  phone: string;
  description: string | null;
  imageUrl: string | null;
};

export function BranchForm({ branch, onDone }: { branch?: Branch; onDone?: () => void }) {
  const action = branch ? updateBranchAction : createBranchAction;
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      {branch ? <input type="hidden" name="id" value={branch.id} /> : null}
      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="ชื่อสาขา" name="name" defaultValue={branch?.name} required />
        <Field label="เบอร์โทร" name="phone" defaultValue={branch?.phone} required />
      </div>
      <Field label="ที่อยู่" name="address" defaultValue={branch?.address} required />
      <Field
        label="รายละเอียดเพิ่มเติม"
        name="description"
        defaultValue={branch?.description ?? ""}
        textarea
      />
      <Field
        label="ลิงก์รูปภาพ (URL)"
        name="imageUrl"
        defaultValue={branch?.imageUrl ?? ""}
      />

      <SubmitButton pendingText="กำลังบันทึก…">
        {branch ? "บันทึกการแก้ไข" : "เพิ่มสาขา"}
      </SubmitButton>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  textarea,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-ink-soft mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={2}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
        />
      )}
    </div>
  );
}
