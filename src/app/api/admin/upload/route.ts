import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getSupabaseAdmin } from "@/lib/cms/supabase";

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ error: "Supabase yapılandırılmamış." }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "general");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Dosya gerekli." }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await client.storage.from("cms-uploads").upload(safeName, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

    if (error) {
      return NextResponse.json(
        {
          error:
            error.message +
            " — Supabase Storage'da 'cms-uploads' bucket'ı oluşturulmuş ve public olmalı.",
        },
        { status: 500 }
      );
    }

    const { data } = client.storage.from("cms-uploads").getPublicUrl(safeName);
    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yükleme başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
