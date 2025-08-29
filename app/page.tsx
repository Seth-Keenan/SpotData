import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const token = (await cookies()).get("spotify_access_token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-8">
        {/* Logo / Title */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Welcome to <span className="text-green-500">DataSpot</span>
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            Visualize your Spotify stats, discover your top artists, tracks, and genres
          </p>
        </div>

        {/* Illustration / Spotify vibe */}
        <div className="flex justify-center">
          <div className="w-40 h-40 rounded-full bg-green-500 flex items-center justify-center shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-black"
              fill="currentColor"
              viewBox="0 0 496 512"
            >
              <path d="M248 8C111 8 0 119 0 256s111 248 248 248..."/>
            </svg>
          </div>
        </div>

        {/* Login button */}
        <div>
          <Link
            href="/api/spotify/login"
            className="inline-block bg-green-500 text-black font-semibold px-6 py-3 rounded-full shadow-md hover:bg-green-400 hover:scale-105 transform transition"
          >
            Login with Spotify
          </Link>
        </div>

        {/* Footer / subtle text */}
        <p className="text-gray-500 text-xs mt-6">
          Powered by Spotify API · Built with Next.js
        </p>
      </div>
    </div>
  );
}
