import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { donationDate: "desc" },
      select: {
        id: true,
        name: true,
        nameTe: true,
        aliasName: true,
        aliasNameTe: true,
        fatherName: true,
        fatherNameTe: true,
        amount: true,
        donationDate: true,
        paymentMode: true,
        createdAt: true,
      },
    });

    return NextResponse.json(donations, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to fetch donations:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}
