import { NextRequest, NextResponse } from "next/server";
import { uploadCreativeToGoogleDrive } from "@/lib/google-drive";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const companyName = String(formData.get("companyName") || "Unassigned Company");
    const existingFileId = String(formData.get("existingFileId") || "") || null;
    const upload = await uploadCreativeToGoogleDrive(file, {
      companyName,
      existingFileId,
    });

    return NextResponse.json({ url: upload.url, fileId: upload.id });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed.",
      },
      { status: 500 },
    );
  }
}
