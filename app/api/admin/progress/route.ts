import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formFieldString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const title = formFieldString(formData.get("title"));
    const titleTe = formFieldString(formData.get("titleTe"));

    if (!title || !titleTe) {
      return NextResponse.json(
        { error: "English and Telugu titles are required" },
        { status: 400 }
      );
    }

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image must be smaller than 10MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { imageUrl, publicId } = await uploadImage(buffer);

    const record = await prisma.progressImage.create({
      data: { title, titleTe, imageUrl, publicId },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Failed to upload progress image:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload image";
    const status = message.includes("Cloudinary is not configured") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
