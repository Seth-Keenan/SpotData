"use client";

import { useEffect, useState } from "react";
import { getTopGenres } from "@/services/spotify.utils";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ef4444",
  "#a855f7", "#ec4899", "#14b8a6", "#eab308"
];

const TIME_LABELS: Record<string, string> = {
  short_term: "last month",
  medium_term: "last 6 months",
  long_term: "last year",
};

export default function TopGenresChart({
  token,
  type,
  timeRange,
}: Readonly<{
  token: string;
  type: "artists" | "tracks";
  timeRange: "short_term" | "medium_term" | "long_term";
}>) {
  const [data, setData] = useState<{ genre: string; count: number }[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function fetchGenres() {
      const genres = await getTopGenres(token, type, timeRange);
      setData(genres.slice(0, 8));
    }
    fetchGenres();

    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [token, type, timeRange]);

  return (
    <div className="space-y-2" style={{ width: "100%", height: isMobile ? 380 : 480 }}>
      {/* Heading + subtitle */}
      <h2 className="text-xl font-semibold text-white mb-4">Your Top Genres</h2>
      <p className="text-sm text-gray-400">
        Based on your <span className="font-medium">{type}</span> over the{" "}
        <span className="font-medium">{TIME_LABELS[timeRange]}</span>
      </p>

      <ResponsiveContainer>
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={data}
            dataKey="count"
            nameKey="genre"
            cx="50%"
            cy="50%"
            outerRadius={isMobile ? 100 : 140}
            labelLine={false}
            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
          >
            {data.map((entry) => (
              <Cell
                key={entry.genre}
                fill={COLORS[Math.abs(entry.genre.charCodeAt(0)) % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(val, name, props) => [`${val}`, props.payload.genre]} />
          <Legend
            verticalAlign={isMobile ? "top" : "bottom"}
            align="center"
            wrapperStyle={{ fontSize: isMobile ? "0.75rem" : "1rem", flexWrap: "wrap" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
