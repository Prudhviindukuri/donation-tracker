import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toTelugu } from "@/lib/transliterate";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const text = new URL(request.url).searchParams.get("text")?.trim() ?? "";
  if (!text) {
    return NextResponse.json({ telugu: "" });
  }

  const telugu = await toTelugu(text);
  return NextResponse.json({ telugu });
}
