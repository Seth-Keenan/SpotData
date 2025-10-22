import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const error = searchParams.get("error");
  if (error === "access_denied") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const creds = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://spot-data-ray3.vercel.app"
      : "http://127.0.0.1:3000";

  // Exchange code for tokens
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
    return NextResponse.json(
      { error: `Spotify token exchange failed`, details: text },
      { status: tokenRes.status }
    );
  }

  const tokens = await tokenRes.json();

  const redirectUrl = new URL("/dashboard", new URL(req.url).origin);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set("spotify_access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: tokens.expires_in,
    path: "/",
  });

  console.log("Setting token cookie:", tokens.access_token?.slice(0,10));

  if (tokens.refresh_token) {
    response.cookies.set("spotify_refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  return response;
}
