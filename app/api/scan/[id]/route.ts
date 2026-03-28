import { getScanJob } from "@/lib/scan-store";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const job = getScanJob(id);
  if (!job) {
    return Response.json({ error: "Scan not found" }, { status: 404 });
  }

  return Response.json({
    id: job.id,
    state: job.state,
    progress: job.progress,
    result: job.state === "complete" ? job.result : undefined,
    error: job.error,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  });
}
