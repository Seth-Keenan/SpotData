"use client";

import { useState } from "react";
import PlaylistGrid from "@/componets/PlaylistGrid";
import PlaylistCreator from "@/componets/PlaylistCreator";
import { SpotifyPlaylist } from "@/types/spotify.models";

export default function PlaylistPage({
  playlists = [],
  token = "",
}: Readonly<{
  playlists?: SpotifyPlaylist[];
  token?: string;
}>) {
  const [activeTab, setActiveTab] = useState<"your" | "create">("your");

  return (
    <div>
      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-full bg-gray-800 p-1 space-x-1">
          <button
            onClick={() => setActiveTab("your")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              activeTab === "your"
                ? "bg-green-500 text-black shadow"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            Your Playlists
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              activeTab === "create"
                ? "bg-green-500 text-black shadow"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            Create Playlist
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        {activeTab === "your" ? (
          <PlaylistGrid playlists={playlists ?? []} token={token ?? ""} />
        ) : (
          <PlaylistCreator token={token} />
        )}
      </div>
    </div>
  );
}
