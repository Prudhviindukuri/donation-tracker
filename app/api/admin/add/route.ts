import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseDonationPayload } from "@/lib/donation";
import { prisma } from "@/lib/prisma";
import { buildDonationData } from "@/lib/transliterate";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = parseDonationPayload(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const donation = await prisma.donation.create({
      data: await buildDonationData(parsed.data),
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error("Failed to add donation:", error);
    return NextResponse.json(
      { error: "Failed to add donation" },
      { status: 500 }
    );
  }
}
