import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "My Studio | โรงเรียนสอนดนตรี",
  description: "My Studio เรียนดนตรีทุกเครื่องมือ ทุกวัย หลายสาขาทั่วกรุงเทพฯ",
};

export default async function RootLayout({ children }: LayoutProps) {
  const session = await getSession();
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <SiteHeader session={session} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
