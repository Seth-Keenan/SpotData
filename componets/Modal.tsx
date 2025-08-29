"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SpotifyPlaylist } from "@/types/spotify.models";
import { getPlaylistDetails } from "@/services/spotify.utils";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { decodeHtml } from "@/services/decodeHTML.utils";
import { X } from "lucide-react";

const COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ef4444",
  "#a855f7", "#ec4899", "#14b8a6", "#eab308"
];

function formatDuration(ms: number) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
}

export default function PlaylistModal({
  playlist,
  token,
  onClose,
}: Readonly<{
  playlist: SpotifyPlaylist;
  token: string;
  onClose: () => void;
}>) {
  const [details, setDetails] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    async function fetchDetails() {
      const data = await getPlaylistDetails(playlist.id, token);
      setDetails(data);
    }
    fetchDetails();
  }, [playlist.id, token]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!details || !mounted) return null;

  const modalContent = (
    <div 
      className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          relative bg-gray-900 rounded-2xl shadow-xl 
          w-full max-w-3xl max-h-[85vh] 
          overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 z-10
            bg-gray-800/70 hover:bg-gray-700 
            rounded-full p-2 transition
          "
        >
          <X size={22} className="text-white" />
        </button>

        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Playlist Image */}
          {details.image && (
            <img
              src={details.image}
              alt={details.name}
              className="w-full md:w-48 rounded-lg shadow-md object-cover"
            />
          )}

          {/* Playlist Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2 pr-8">
              {details.name}
            </h2>
            <p className="text-gray-400 mb-4">
              {decodeHtml(details.description) || "No description"}
            </p>

            <ul className="text-sm text-gray-300 space-y-1">
              <li><span className="font-medium">Owner:</span> {details.owner}</li>
              <li><span className="font-medium">Followers:</span> {details.followers.toLocaleString()}</li>
              <li><span className="font-medium">Tracks:</span> {details.totalTracks}</li>
              <li><span className="font-medium">Duration:</span> {formatDuration(details.totalDurationMs)}</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-6 my-4" />

        {/* Genre Pie Chart */}
        <div className="px-6 pb-6" style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={details.genres.slice(0, 8)}
                dataKey="count"
                nameKey="genre"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ percent }) =>
                  `${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {details.genres.map((entry: any) => (
                  <Cell
                    key={entry.genre}
                    fill={COLORS[Math.abs(entry.genre.charCodeAt(0)) % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "0.8rem", color: "#d1d5db" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal at the document body level
  return createPortal(modalContent, document.body);
}