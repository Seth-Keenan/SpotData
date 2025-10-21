"use client";

import { useState } from "react";
import { SpotifyPlaylist } from "@/types/spotify.models";
import Modal from "@/componets/Modal";
import { decodeHtml } from "@/services/decodeHTML.utils";
import { getProfilePlaylists, getSpotifyProfile } from "@/services/spotify.utils";

export default function PlaylistGrid({ playlists, token }: Readonly<{ playlists: SpotifyPlaylist[]; token: string }>) {
  const [selected, setSelected] = useState<SpotifyPlaylist | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshedPlaylists, setRefreshedPlaylists] = useState(playlists);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const profile = await getSpotifyProfile(token);
      if (!profile) throw new Error("No profile found");

      const updatedPlaylists = await getProfilePlaylists(profile.id, token);
      setRefreshedPlaylists(updatedPlaylists);
    } catch (err) {
      console.error("Error refreshing playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!refreshedPlaylists.length) {
    return <p className="text-gray-400">No playlists found.</p>;
  }

  return (
    <>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {refreshedPlaylists.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelected(p)}
            className="cursor-pointer group rounded-2xl overflow-hidden shadow-md bg-black hover:shadow-xl transition"
          >
            {p.images?.[0] && (
              <img
                src={p.images[0].url}
                alt={p.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold truncate">{p.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {decodeHtml(p.description) || "No description"}
              </p>
              <div className="mt-2 text-sm text-gray-400">{p.tracks.total} tracks</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh Playlists"}
        </button>
      </div>

      {selected && (
        <Modal playlist={selected} token={token} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
