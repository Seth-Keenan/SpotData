import DashboardClient from "@/app/dashboard/DashboardClient";
import { getSpotifyProfile } from "@/services/spotify.utils";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const token = (await cookies()).get("spotify_access_token")?.value;
  if (!token) return <p>No Spotify session</p>;

  const profile = await getSpotifyProfile(token);
  if (!profile) return <p>No profile</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <DashboardClient token={token} profile={profile} />
    </div>
  );
}
