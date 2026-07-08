import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectEditForm from "@/components/admin/ProjectEditForm";
import { getProjectBySlugAdmin } from "@/lib/cms/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminProjectEditPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlugAdmin(slug);

  if (!project) notFound();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <Link href="/admin/projeler" className="text-sm font-medium text-retim-orange hover:underline">
          ← Projelere dön
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-retim-navy">{project.name}</h1>
        <p className="mt-1 text-sm text-gray-600">
          Ref: {project.ref_no} · {project.district} · {project.year}
        </p>
        <Link
          href={`/projeler/${project.slug}`}
          target="_blank"
          className="mt-2 inline-block text-sm text-gray-500 hover:text-retim-orange"
        >
          Sitede görüntüle →
        </Link>
      </div>

      <ProjectEditForm project={project} />
    </div>
  );
}
