import { NextResponse } from "next/server";
import { getGoogleDriveAuthorizeUrl } from "@/lib/google-drive";

export async function GET() {
  try {
    return NextResponse.redirect(getGoogleDriveAuthorizeUrl());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not start Google Drive connection.",
      },
      { status: 500 },
    );
  }
}
