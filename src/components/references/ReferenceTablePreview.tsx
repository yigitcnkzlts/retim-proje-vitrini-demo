import type { Reference } from "@/data/references";

interface ReferenceTablePreviewProps {
  references: Reference[];
}

export default function ReferenceTablePreview({ references }: ReferenceTablePreviewProps) {
  return (
    <div className="overflow-hidden rounded border border-retim-gray-dark">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="table-header">#</th>
              <th className="table-header">Proje Adı</th>
              <th className="table-header">Hizmet Adı</th>
              <th className="table-header">Semt</th>
              <th className="table-header">Yıl</th>
            </tr>
          </thead>
          <tbody>
            {references.map((ref) => (
              <tr key={ref.refNo} className="hover:bg-retim-gray">
                <td className="table-cell font-mono text-xs">{ref.refNo}</td>
                <td className="table-cell font-medium">{ref.projectName}</td>
                <td className="table-cell">{ref.service}</td>
                <td className="table-cell">{ref.district}</td>
                <td className="table-cell">{ref.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
