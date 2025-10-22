import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const creds = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://spot-data-ray3.vercel.app"
      : "http://127.0.0.1:3000";

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${baseUrl}/api/spotify/callback`,
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text().catch(() => "");
    console.error("Spotify token exchange failed:", text);
    return NextResponse.redirect(new URL("/", req.url));
  }

  const tokens = await tokenRes.json();

  const redirectUrl = new URL("/dashboard", req.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set("spotify_access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: tokens.expires_in,
  });

  if (tokens.refresh_token) {
    response.cookies.set("spotify_refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  console.log("Cookies set successfully!");
  return response;
}
