import Playlist from "./Playlist";
import { getProfilePlaylists, getSpotifyProfile } from "@/services/spotify.utils";
import { SpotifyPlaylist } from "@/types/spotify.models";
import { cookies } from "next/headers";

export default async function PlaylistsServerPage() {
  const token = (await cookies()).get("spotify_access_token")?.value;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800">
        <p className="text-gray-400 text-lg">No Spotify session</p>
      </div>
    );
  }

  const profile = await getSpotifyProfile(token);

  let playlists: SpotifyPlaylist[] | undefined = [];
  if (profile) {
    try {
      playlists = await getProfilePlaylists(profile.id, token);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-white mb-8">
          Playlists
        </h1>
        <Playlist playlists={playlists} token={token ?? ""} />
      </div>
    </div>
  );
}
