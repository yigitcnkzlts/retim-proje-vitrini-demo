import AdminNav from "@/components/admin/AdminNav";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell min-h-screen bg-[#eef1f5]">
      <div className="flex min-h-screen">
        <AdminNav />
        <main className="admin-main flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
