"use client";

import { useEffect, useState } from "react";
import { SpotifyArtist, SpotifyTrack } from "@/types/spotify.models";
import { getTopItems } from "@/services/spotify.utils";

type Props = {
  token: string;
  type: "artists" | "tracks";
  timeRange: "short_term" | "medium_term" | "long_term";
  setType: (t: "artists" | "tracks") => void;
  setTimeRange: (tr: "short_term" | "medium_term" | "long_term") => void;
};

export default function TopItems({ token, type, timeRange, setType, setTimeRange }: Readonly<Props>) {
  const [items, setItems] = useState<(SpotifyArtist | SpotifyTrack)[]>([]);

  useEffect(() => {
    if (!token) return;
    async function fetchItems() {
      try {
        const data = await getTopItems(token, type, timeRange);
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch top items:", err);
      }
    }
    fetchItems();
  }, [token, type, timeRange]);

  return (
    <div>
      {/* Type toggle */}
<div className="flex justify-center mb-6">
  <div className="inline-flex rounded-full bg-gray-800 p-1 space-x-1">
    <button
      onClick={() => setType("artists")}
      className={`px-5 py-2 rounded-full text-sm font-medium transition ${
        type === "artists"
          ? "bg-green-500 text-black shadow"
          : "text-gray-300 hover:bg-gray-700"
      }`}
    >
      Artists
    </button>
    <button
      onClick={() => setType("tracks")}
      className={`px-5 py-2 rounded-full text-sm font-medium transition ${
        type === "tracks"
          ? "bg-green-500 text-black shadow"
          : "text-gray-300 hover:bg-gray-700"
      }`}
    >
      Tracks
    </button>
  </div>
</div>

{/* Time range toggle */}
<div className="flex justify-center mb-8">
  <div className="inline-flex rounded-full bg-gray-800 p-1 space-x-1">
    <button
      onClick={() => setTimeRange("short_term")}
      className={`px-5 py-2 rounded-full text-sm font-medium transition ${
        timeRange === "short_term"
          ? "bg-green-500 text-black shadow"
          : "text-gray-300 hover:bg-gray-700"
      }`}
    >
      1 Month
    </button>
    <button
      onClick={() => setTimeRange("medium_term")}
      className={`px-5 py-2 rounded-full text-sm font-medium transition ${
        timeRange === "medium_term"
          ? "bg-green-500 text-black shadow"
          : "text-gray-300 hover:bg-gray-700"
      }`}
    >
      6 Months
    </button>
    <button
      onClick={() => setTimeRange("long_term")}
      className={`px-5 py-2 rounded-full text-sm font-medium transition ${
        timeRange === "long_term"
          ? "bg-green-500 text-black shadow"
          : "text-gray-300 hover:bg-gray-700"
      }`}
    >
      1 Year
    </button>
  </div>
</div>


      {/* Grid as before */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
  {type === "artists"
    ? (items as SpotifyArtist[]).map((artist) => (
        <div
          key={artist.id}
          className="bg-gradient-to-b from-gray-800/60 to-black rounded-xl p-4 shadow hover:shadow-green-500/20 transition group"
        >
          {artist.images?.[0] && (
            <img
              src={artist.images[0].url}
              alt={artist.name}
              className="w-full aspect-square object-cover rounded-full mb-3 group-hover:scale-105 transition-transform"
            />
          )}
          <h3 className="font-semibold text-white truncate text-center">
            {artist.name}
          </h3>
          <p className="text-sm text-gray-400 text-center mt-1">
            {artist.genres?.length
              ? artist.genres.slice(0, 2).join(", ")
              : ""}
          </p>
        </div>
      ))
    : (items as SpotifyTrack[]).map((track) => (
        <div
          key={track.id}
          className="bg-gradient-to-b from-gray-800/60 to-black rounded-xl p-4 shadow hover:shadow-green-500/20 transition group"
        >
          {track.album?.images?.[0]?.url && (
            <img
              src={track.album.images[0].url}
              alt={track.name}
              className="w-full aspect-square object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
            />
          )}
          <h3 className="font-semibold text-white truncate">{track.name}</h3>
          <p className="text-sm text-gray-400 mt-1 truncate">
            {track.artists?.map((a) => a.name).join(", ") ?? ""}
          </p>
        </div>
      ))}
</div>

    </div>
  );
}
