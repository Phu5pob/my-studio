import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-3xl mb-2">เข้าสู่ระบบ</h1>
      <p className="text-sm text-ink-soft mb-8">
        เข้าสู่ระบบเพื่อจัดการการจองคอร์สและติดตามผลการเรียนของคุณ
      </p>
      <LoginForm />
      <div className="mt-8 pt-6 border-t border-line text-xs text-ink-soft space-y-1">
        <p>บัญชีทดลอง (สำหรับทดสอบระบบ):</p>
        <p>แอดมิน — admin@mystudio.example / admin1234</p>
        <p>นักเรียน — student@mystudio.example / student1234</p>
      </div>
    </div>
  );
}
