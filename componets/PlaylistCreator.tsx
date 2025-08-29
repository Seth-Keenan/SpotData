"use client";

import { useState } from "react";
import { getTopItems } from "@/services/spotify.utils";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function PlaylistCreator({ token }: Readonly<{ token: string }>) {
  const [timeRange, setTimeRange] = useState<"short_term" | "medium_term" | "long_term">("short_term");
  const [limit, setLimit] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setSuccess(null);

    try {
      const topTracks = await getTopItems(token, "tracks", timeRange);
      const trackUris = (topTracks as any[]).slice(0, limit).map((t) => t.uri);

      const profileRes = await fetch("/api/spotify/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = await profileRes.json();

      const createRes = await fetch(
        `https://api.spotify.com/v1/users/${profile.id}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `DataSpot Top ${limit} – ${timeRange.replace("_", " ")}`,
            description: "Playlist created with your top songs via DataSpot",
            public: false,
          }),
        }
      );

      const playlist = await createRes.json();

      await fetch(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ uris: trackUris }),
        }
      );

      setSuccess(playlist.external_urls.spotify);
    } catch (err) {
      console.error("Error creating playlist:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Create a Custom Playlist</h2>
      <p className="text-gray-400 text-sm mb-6">
        Generate a playlist from your top tracks over a selected time period.
      </p>

      {/* Time range */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Time Range
        </label>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="short_term">Last Month</option>
          <option value="medium_term">Last 6 Months</option>
          <option value="long_term">Last Year</option>
        </select>
      </div>

      {/* Number of songs */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Number of Songs
        </label>
        <input
          type="number"
          min={1}
          max={50}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* Button */}
      <button
        onClick={handleCreate}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-green-500 text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-green-400 hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Creating...
          </>
        ) : (
          "Create Playlist"
        )}
      </button>

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-2 text-green-400 mt-4 animate-fadeIn">
          <CheckCircle2 size={20} />
          <span>
            🎉 Playlist created!{" "}
            <a href={success} target="_blank" className="underline hover:text-green-300">
              Open in Spotify
            </a>
          </span>
        </div>
      )}
    </div>
  );
}
