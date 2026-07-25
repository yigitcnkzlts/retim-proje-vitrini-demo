import FaqAdminClient from "@/components/admin/FaqAdminClient";
import { flattenFaqCategories, faqCategories } from "@/data/faq";
import { getAllFaqAdmin, getSiteFaqCount } from "@/lib/cms/faq";
import { isCmsConfigured } from "@/lib/cms/supabase";
import type { DbFaqItem } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

function siteFaqFallback(): DbFaqItem[] {
  return flattenFaqCategories(faqCategories).map((r, i) => ({
    id: `static-faq-${i}`,
    category_slug: r.category_slug,
    category_title: r.category_title,
    question: r.question,
    answer: r.answer,
    sort_order: r.sort_order,
    active: true,
    created_at: "2020-01-01T00:00:00.000Z",
    updated_at: "2020-01-01T00:00:00.000Z",
  }));
}

export default async function AdminFaqPage() {
  let items: DbFaqItem[] = [];
  try {
    items = await getAllFaqAdmin();
  } catch {
    items = [];
  }
  if (items.length === 0) items = siteFaqFallback();

  return (
    <FaqAdminClient
      initialItems={items}
      configured={isCmsConfigured()}
      siteCount={getSiteFaqCount()}
    />
  );
}
