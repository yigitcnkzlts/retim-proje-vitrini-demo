import PartnersAdminClient from "@/components/admin/PartnersAdminClient";
import { partners as staticPartners } from "@/data/partners";
import { getAllPartnersAdminSafe, getSitePartnerCount } from "@/lib/cms/partners";
import { isCmsConfigured } from "@/lib/cms/supabase";
import type { DbPartner } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

function sitePartnersFallback(): DbPartner[] {
  return staticPartners.map((p, i) => ({
    id: `static-partner-${i}`,
    name: p.name,
    logo_url: p.logo,
    sort_order: i,
    active: true,
    created_at: "2020-01-01T00:00:00.000Z",
    updated_at: "2020-01-01T00:00:00.000Z",
  }));
}

export default async function AdminPartnersPage() {
  let partners: DbPartner[] = [];
  try {
    partners = await getAllPartnersAdminSafe();
  } catch {
    partners = [];
  }
  if (partners.length === 0) partners = sitePartnersFallback();

  return (
    <PartnersAdminClient
      initialPartners={partners}
      configured={isCmsConfigured()}
      siteCount={getSitePartnerCount()}
    />
  );
}
