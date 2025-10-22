"use client";

import { useState } from "react";
import TopItems from "@/componets/TopItems";
import Graph from "@/componets/Graph";
import { SpotifyProfile } from "@/types/spotify.models";

export default function DashboardClient({
  token,
  profile,
}: Readonly<{ token: string; profile: SpotifyProfile }>) {
  const [type, setType] = useState<"artists" | "tracks">("artists");
  const [timeRange, setTimeRange] = useState<
    "short_term" | "medium_term" | "long_term"
  >("short_term");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Welcome back,{" "}
          <span className="text-green-500">{profile.display_name}</span>
        </h1>
        <p className="mt-4 text-gray-400 text-lg">
          Here’s what you’ve been listening to lately
        </p>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Top Items */}
        <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-md shadow-lg hover:shadow-green-500/20 transition">
          <h2 className="text-xl font-semibold text-white mb-4">
            Your Top {type === "artists" ? "Artists" : "Tracks"}
          </h2>
          <TopItems
            token={token}
            type={type}
            timeRange={timeRange}
            setType={setType}
            setTimeRange={setTimeRange}
          />
        </div>

        {/* Genre Graph */}
        <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-md shadow-lg hover:shadow-green-500/20 transition">
          <Graph token={token} type={type} timeRange={timeRange} />
        </div>
      </div>
    </div>
  );
}
