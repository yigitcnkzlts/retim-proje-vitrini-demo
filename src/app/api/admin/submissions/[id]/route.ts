import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { deleteSubmission, updateSubmissionStatus } from "@/lib/cms/submissions";
import type { SubmissionStatus } from "@/lib/cms/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: SubmissionStatus[] = ["new", "contacted", "in_progress", "closed"];

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      is_read?: boolean;
      status?: string;
      admin_note?: string;
    };

    const update: Partial<{ status: SubmissionStatus; admin_note: string; is_read: boolean }> = {};
    if (typeof body.is_read === "boolean") update.is_read = body.is_read;
    if (typeof body.status === "string" && VALID_STATUSES.includes(body.status as SubmissionStatus)) {
      update.status = body.status as SubmissionStatus;
      if (body.status !== "new") update.is_read = true;
    }
    if (typeof body.admin_note === "string") update.admin_note = body.admin_note;

    await updateSubmissionStatus(id, update);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Güncelleme başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    await deleteSubmission(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Silme başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
