import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL("/", req.url);

  const res = NextResponse.redirect(url);
  res.cookies.set("spotify_access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  res.cookies.set("spotify_refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return res;
}
