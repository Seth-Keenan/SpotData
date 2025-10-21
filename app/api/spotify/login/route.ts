import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const redirectUri = "http://127.0.0.1:3000/api/spotify/callback";
  const scopes = ["user-read-email", "user-read-private", "playlist-read-private", "user-top-read", "playlist-modify-public", "playlist-modify-private"].join(" ");

  const url =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: scopes,
      show_dialog: "true",
    });

  return NextResponse.redirect(url);
}