import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const accessKey =
    process.env.WEB3FORMS_ACCESS_KEY?.trim() ||
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ||
    "";

  if (!accessKey) {
    return NextResponse.json(
      {
        error:
          "WEB3FORMS_ACCESS_KEY tanımlı değil. Vercel → Settings → Environment Variables bölümüne ekleyin.",
      },
      {
        status: 503,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  }

  return NextResponse.json(
    { accessKey },
    { headers: { "Content-Type": "application/json; charset=utf-8" } }
  );
}
