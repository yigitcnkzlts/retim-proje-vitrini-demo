"use client";

import { useEffect, useMemo, useState } from "react";
import { projects, serviceCategories, districts } from "@/data/projects";
import ProjectCard from "./ProjectCard";

interface ProjectFiltersProps {
  initialCategory?: string;
  initialDistrict?: string;
}

export default function ProjectFilters({
  initialCategory = "",
  initialDistrict = "",
}: ProjectFiltersProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [district, setDistrict] = useState(initialDistrict);

  useEffect(() => {
    setCategory(initialCategory);
    setDistrict(initialDistrict);
  }, [initialCategory, initialDistrict]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.district.toLowerCase().includes(search.toLowerCase()) ||
        p.service.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "" || p.serviceSlug === category;
      const matchesDistrict =
        district === "" || p.district.toLowerCase() === district.toLowerCase();

      return matchesSearch && matchesCategory && matchesDistrict;
    });
  }, [search, category, district]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setDistrict("");
  };

  const hasFilters = Boolean(search || category || district);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Katalogda <span className="font-bold text-retim-navy">{projects.length}</span> proje
          listeleniyor
        </p>
      </div>

      <div className="mb-8 rounded-sm border border-retim-gray-dark bg-retim-gray p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Arama
            </label>
            <input
              id="search"
              type="text"
              placeholder="Proje adı, semt veya hizmet ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="category" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Hizmet Türü
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Tümü</option>
              {serviceCategories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="district" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Semt
            </label>
            <select
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="input-field"
            >
              <option value="">Tümü</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span
              key={filtered.length}
              className="inline-block animate-count-pulse font-bold text-retim-navy"
            >
              {filtered.length}
            </span>{" "}
            proje bulundu
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-retim-orange hover:text-retim-orange-dark"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <div
              key={project.slug}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${Math.min(index * 60, 600)}ms`, animationFillMode: "forwards" }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-retim-gray-dark bg-retim-gray py-12 text-center">
          <p className="text-gray-600">Arama kriterlerinize uygun proje bulunamadı.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-sm font-semibold text-retim-orange hover:text-retim-orange-dark"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
}
