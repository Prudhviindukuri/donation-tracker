import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseDonationPayload } from "@/lib/donation";
import { prisma } from "@/lib/prisma";
import { withTeluguNames } from "@/lib/transliterate";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid donation id" }, { status: 400 });
    }

    const parsed = parseDonationPayload(body);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const donation = await prisma.donation.update({
      where: { id },
      data: withTeluguNames(parsed.data),
    });

    return NextResponse.json(donation);
  } catch (error) {
    console.error("Failed to update donation:", error);
    return NextResponse.json(
      { error: "Failed to update donation" },
      { status: 404 }
    );
  }
}
