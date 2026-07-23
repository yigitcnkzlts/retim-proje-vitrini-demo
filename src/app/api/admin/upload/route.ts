import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getSupabaseAdmin } from "@/lib/cms/supabase";
import { deleteMediaByPath, extractStoragePath, recordMedia } from "@/lib/cms/media";

const BUCKET = "cms-uploads";

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase yapılandırılmamış. .env.local dosyasında NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY eksik." },
      { status: 503 }
    );
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

    const { error } = await client.storage.from(BUCKET).upload(safeName, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

    if (error) {
      const hint = error.message.toLowerCase().includes("bucket not found")
        ? " Supabase Storage'da 'cms-uploads' adında bir bucket oluşturmanız gerekiyor (bkz. supabase/migrations/0001_init.sql)."
        : "";
      return NextResponse.json({ error: error.message + hint }, { status: 500 });
    }

    const { data } = client.storage.from(BUCKET).getPublicUrl(safeName);

    await recordMedia({
      path: safeName,
      url: data.publicUrl,
      folder,
      file_name: file.name,
      mime_type: file.type || null,
      size_bytes: buffer.byteLength,
    });

    return NextResponse.json({ url: data.publicUrl, path: safeName });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yükleme başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const client = getSupabaseAdmin();
  if (!client) {
    return NextResponse.json({ error: "Supabase yapılandırılmamış." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { path?: string; url?: string };
    const path = body.path || (body.url ? extractStoragePath(body.url) : null);

    if (!path) {
      return NextResponse.json({ error: "Silinecek dosyanın yolu (path) veya URL'si gerekli." }, { status: 400 });
    }

    await deleteMediaByPath(path);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Görsel silinemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
