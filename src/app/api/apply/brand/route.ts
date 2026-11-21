import { handleApply } from "@/lib/server/apply";

export async function POST(request: Request): Promise<Response> {
  return handleApply(request, "brand");
}
