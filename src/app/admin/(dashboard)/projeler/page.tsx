import Link from "next/link";
import { getAllProjectsAdmin } from "@/lib/cms/projects";
import { isCmsConfigured } from "@/lib/cms/supabase";

export default async function AdminProjectsPage() {
  const configured = isCmsConfigured();
  const projects = configured ? await getAllProjectsAdmin() : [];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-retim-navy">Projeler</h1>
          <p className="mt-1 text-sm text-gray-600">
            Proje detay sayfalarını düzenleyin — açıklama, kapsam, süre ve görsel.
          </p>
        </div>
      </div>

      {!configured && <SetupAlert />}

      <div className="admin-card overflow-hidden p-0">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Proje</th>
              <th>Semt</th>
              <th>Yıl</th>
              <th>Ref No</th>
              <th>Durum</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td className="font-medium text-retim-navy">{p.name}</td>
                <td>{p.district}</td>
                <td>{p.year}</td>
                <td>{p.ref_no}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {p.published && <span className="admin-badge admin-badge-green">Yayında</span>}
                    {p.featured && <span className="admin-badge admin-badge-orange">Öne çıkan</span>}
                    {p.duration !== "—" && <span className="admin-badge">Süre dolu</span>}
                  </div>
                </td>
                <td className="text-right">
                  <Link href={`/admin/projeler/${p.slug}`} className="text-sm font-semibold text-retim-orange hover:underline">
                    Düzenle →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <p className="p-8 text-center text-sm text-gray-500">
            Proje bulunamadı. Önce <code>npm run seed</code> çalıştırın veya referans ekleyin.
          </p>
        )}
      </div>
    </div>
  );
}

function SetupAlert() {
  return (
    <div className="admin-alert mb-6">
      Supabase bağlantısı gerekli. <code>ADMIN_SETUP.md</code> dosyasındaki adımları izleyin.
    </div>
  );
}
