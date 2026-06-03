import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const images = await prisma.progressImage.findMany({
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json(images, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to fetch progress images:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress images" },
      { status: 500 }
    );
  }
}
