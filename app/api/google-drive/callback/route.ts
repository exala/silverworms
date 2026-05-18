import { NextRequest, NextResponse } from "next/server";
import { exchangeGoogleDriveCode } from "@/lib/google-drive";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const authError = request.nextUrl.searchParams.get("error");

  if (authError) {
    return NextResponse.json({ error: authError }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json(
      { error: "Google did not return an authorization code." },
      { status: 400 },
    );
  }

  try {
    const tokens = await exchangeGoogleDriveCode(code);

    return new NextResponse(
      [
        "Google Drive connected successfully.",
        "",
        "Add this value to your .env file, then restart the app:",
        "",
        `GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`,
      ].join("\n"),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not finish Google Drive connection.",
      },
      { status: 500 },
    );
  }
}
