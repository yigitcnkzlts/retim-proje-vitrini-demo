"use client";

import { useMemo, useState, type ClipboardEvent, type DragEvent, type MouseEvent } from "react";
import type { Reference } from "@/data/references";
import { references as staticReferences, years } from "@/data/references";

interface ReferenceArchiveProps {
  items?: Reference[];
}

function blockCopyInteraction(event: ClipboardEvent | MouseEvent | DragEvent) {
  event.preventDefault();
}

export default function ReferenceArchive({ items = staticReferences }: ReferenceArchiveProps) {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<number | "">("");

  const filtered = useMemo(() => {
    return items.filter((ref) => {
      const matchesSearch =
        search === "" ||
        ref.projectName.toLowerCase().includes(search.toLowerCase()) ||
        ref.service.toLowerCase().includes(search.toLowerCase()) ||
        ref.district.toLowerCase().includes(search.toLowerCase()) ||
        ref.refNo.toLowerCase().includes(search.toLowerCase());

      const matchesYear = year === "" || ref.year === year;

      return matchesSearch && matchesYear;
    });
  }, [search, year, items]);

  return (
    <div>
      <div className="mb-8 rounded border border-retim-gray-dark bg-retim-gray p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label htmlFor="ref-search" className="mb-1 block text-xs font-medium uppercase text-gray-500">
              Arama
            </label>
            <input
              id="ref-search"
              type="text"
              placeholder="Ref no, proje adı, hizmet veya semt ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-retim-gray-dark bg-white px-4 py-2.5 text-sm focus:border-retim-orange focus:outline-none focus:ring-1 focus:ring-retim-orange"
            />
          </div>
          <div>
            <label htmlFor="ref-year" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Lütfen Yıl Seçiniz
            </label>
            <select
              id="ref-year"
              value={year}
              onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded border border-retim-gray-dark bg-white px-4 py-2.5 text-sm focus:border-retim-orange focus:outline-none focus:ring-1 focus:ring-retim-orange"
            >
              <option value="">Tüm Yıllar</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          <span className="font-medium text-retim-navy">{filtered.length}</span> referans kaydı
          listeleniyor
        </p>
      </div>

      {filtered.length === 0 ? (
        <div
          className="select-none rounded border border-retim-gray-dark bg-retim-gray py-12 text-center [webkit-touch-callout:none]"
          onCopy={blockCopyInteraction}
          onCut={blockCopyInteraction}
          onContextMenu={blockCopyInteraction}
          onDragStart={blockCopyInteraction}
        >
          <p className="text-gray-600">Arama kriterlerinize uygun referans bulunamadı.</p>
        </div>
      ) : (
        <div
          className="select-none [webkit-touch-callout:none]"
          onCopy={blockCopyInteraction}
          onCut={blockCopyInteraction}
          onContextMenu={blockCopyInteraction}
          onDragStart={blockCopyInteraction}
        >
          <div className="hidden overflow-hidden rounded border border-retim-gray-dark md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr>
                    <th className="table-header">NO</th>
                    <th className="table-header">PROJE</th>
                    <th className="table-header">İŞLEM</th>
                    <th className="table-header">KONUM</th>
                    <th className="table-header">YIL</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ref) => (
                    <ReferenceRow key={`${ref.refNo}-${ref.projectName}`} ref={ref} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {filtered.map((ref) => (
              <ReferenceMobileCard key={`${ref.refNo}-${ref.projectName}`} ref={ref} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReferenceRow({ ref }: { ref: Reference }) {
  return (
    <tr className="table-row-interactive">
      <td className="table-cell font-mono text-xs">{ref.refNo}</td>
      <td className="table-cell font-medium">{ref.projectName}</td>
      <td className="table-cell">{ref.service}</td>
      <td className="table-cell">{ref.district}</td>
      <td className="table-cell">{ref.year}</td>
    </tr>
  );
}

function ReferenceMobileCard({ ref }: { ref: Reference }) {
  return (
    <div className="card-base">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs text-gray-500">{ref.refNo}</span>
        <span className="tag">{ref.year}</span>
      </div>
      <h3 className="font-semibold text-retim-navy">{ref.projectName}</h3>
      <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
        <span>{ref.service}</span>
        <span>•</span>
        <span>{ref.district}</span>
      </div>
    </div>
  );
}
