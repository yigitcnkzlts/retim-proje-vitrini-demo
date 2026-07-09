"use client";

import { useEffect, useMemo, useState } from "react";
import type { Reference } from "@/data/references";
import {
  REFERENCES_PAGE_SIZE,
  references as staticReferences,
  sortReferencesNewestFirst,
  years,
} from "@/data/references";
import NoCopyZone from "@/components/references/NoCopyZone";

interface ReferenceArchiveProps {
  items?: Reference[];
}

export default function ReferenceArchive({ items = staticReferences }: ReferenceArchiveProps) {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const sorted = sortReferencesNewestFirst(items);

    return sorted.filter((ref) => {
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / REFERENCES_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * REFERENCES_PAGE_SIZE;
    return filtered.slice(start, start + REFERENCES_PAGE_SIZE);
  }, [currentPage, filtered]);

  useEffect(() => {
    setPage(1);
  }, [search, year]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

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
          {totalPages > 1 && (
            <>
              {" "}
              · Sayfa <span className="font-medium text-retim-navy">{currentPage}</span> / {totalPages}
            </>
          )}
        </p>
      </div>

      <NoCopyZone>
        {filtered.length === 0 ? (
          <div className="rounded border border-retim-gray-dark bg-retim-gray py-12 text-center">
            <p className="text-gray-600">Arama kriterlerinize uygun referans bulunamadı.</p>
          </div>
        ) : (
          <>
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
                    {pageItems.map((ref) => (
                      <ReferenceRow key={`${ref.refNo}-${ref.projectName}`} ref={ref} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3 md:hidden">
              {pageItems.map((ref) => (
                <ReferenceMobileCard key={`${ref.refNo}-${ref.projectName}`} ref={ref} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </NoCopyZone>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
      aria-label="Referans sayfaları"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-secondary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Önceki
      </button>

      {pages.map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`min-w-10 rounded border px-3 py-2 text-sm transition-colors ${
              item === currentPage
                ? "border-retim-orange bg-retim-orange text-white"
                : "border-retim-gray-dark bg-white text-retim-navy hover:border-retim-orange"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-secondary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Sonraki
      </button>
    </nav>
  );
}

function getPaginationRange(current: number, total: number): Array<number | "..."> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: Array<number | "..."> = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
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
