import { NextResponse } from "next/server";
import { recordVisit } from "@/lib/cms/analytics";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  visitorId: z.string().trim().min(8).max(80),
  path: z.string().trim().max(300).default("/"),
});

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    await recordVisit(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "record_failed";
    console.error("Visit API:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
