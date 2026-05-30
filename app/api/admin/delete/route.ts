import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
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

    await prisma.donation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete donation:", error);
    return NextResponse.json(
      { error: "Failed to delete donation" },
      { status: 404 }
    );
  }
}
