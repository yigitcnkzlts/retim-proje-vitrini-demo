import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getSubmissionsAdmin } from "@/lib/cms/submissions";

function csvEscape(value: string): string {
  if (/[",\n;]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const submissions = await getSubmissionsAdmin();
  const header = ["Tarih", "Ad Soyad", "Telefon", "E-posta", "Bina", "Hizmet", "Durum", "Mesaj", "Not"];
  const rows = submissions.map((s) => [
    new Date(s.created_at).toLocaleString("tr-TR"),
    s.name,
    s.phone,
    s.email || "",
    s.building || "",
    s.service || "",
    s.status,
    s.message || "",
    s.admin_note || "",
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(";")).join("\n");
  const bom = "\uFEFF";

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kesif-talepleri-${Date.now()}.csv"`,
    },
  });
}
