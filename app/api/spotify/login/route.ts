import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const scopes = [
    "user-read-email",
    "user-read-private",
    "playlist-read-private",
    "user-top-read",
    "playlist-modify-public",
    "playlist-modify-private",
  ].join(" ");

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://spot-data-ray3.vercel.app"
      : "http://127.0.0.1:3000";

  const redirectUri = `${baseUrl}/api/spotify/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
    show_dialog: "true",
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
