import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const amount = Number(body.amount);

    if (!name) {
      return NextResponse.json(
        { error: "Donor name is required" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    const donation = await prisma.donation.create({
      data: { name, amount },
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
