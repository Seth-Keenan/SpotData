"use server";

import { SpotifyArtist, SpotifyPlaylistResponse, SpotifyProfile, SpotifyTrack } from "@/types/spotify.models";
import { cookies } from "next/headers";

export const getSpotifyToken = async (): Promise<string | null> => {
  const token = (await cookies()).get("spotify_access_token")?.value;
  return token ?? null;
};

export const getSpotifyProfile = async (token: string) => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Spotify /me request failed: ${response.status} ${text}`);
  }

  return (await response.json()) as SpotifyProfile;
}

export const getProfilePlaylists = async (id: string, token: string) => {
  const response = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Spotify /playlists request failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as SpotifyPlaylistResponse;
  return data.items;
}

export const getTopItems = async (token: string, type: string, time_range: string) => {
  const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=10`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Spotify /top request failed: ${response.status} ${text}`);
  }

  const data = await response.json();

  if (type === "artists") {
    return data.items as SpotifyArtist[];
  }
  
  return data.items as SpotifyTrack[];
}

export const getTopItemsLimit = async (token: string, type: string, time_range: string, limit: string) => {
  const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Spotify /top request failed: ${response.status} ${text}`);
  }

  const data = await response.json();

  if (type === "artists") {
    return data.items as SpotifyArtist[];
  }
  
  return data.items as SpotifyTrack[];
}

export const getTopGenres = async (token: string, type: string, time_range: string) => {
  const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Spotify /top request failed: ${response.status} ${text}`);
  }

  const data = await response.json();

  let genres: string[] = [];

  if (type === "artists") {
    data.items.forEach((artist: any) => {
      genres = genres.concat(artist.genres || []);
    });
  } else {
    const artistIds: string[] = Array.from(
  new Set(
    data.items.flatMap((track: any) =>
      (track.artists?.map((a: any) => a.id) || []) as string[]
    )
   )
  );

    const batched: string[][] = [];
    while (artistIds.length) {
      batched.push(artistIds.splice(0, 50));
    }

    for (const batch of batched) {
      const artistsRes = await fetch(
        `https://api.spotify.com/v1/artists?ids=${batch.join(",")}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (artistsRes.ok) {
        const artistsData = await artistsRes.json();
        artistsData.artists.forEach((artist: any) => {
          genres = genres.concat(artist.genres || []);
        });
      }
    }
  }

  const genreCounts: Record<string, number> = {};
  genres.forEach((g) => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });

  return Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
};

export const getPlaylistDetails = async (playlistId: string, token: string) => {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch playlist details");
  const data = await res.json();

  // calculate duration
  const totalDurationMs = data.tracks.items.reduce(
    (acc: number, t: any) => acc + (t.track?.duration_ms ?? 0),
    0
  );

  // collect artist IDs for genre breakdown
  const artistIds = Array.from(
    new Set(
      data.tracks.items.flatMap(
        (t: any) => t.track?.artists?.map((a: any) => a.id) || []
      )
    )
  );

  // batch fetch artist genres
  let genres: string[] = [];
  for (let i = 0; i < artistIds.length; i += 50) {
    const batch = artistIds.slice(i, i + 50);
    const artistRes = await fetch(
      `https://api.spotify.com/v1/artists?ids=${batch.join(",")}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (artistRes.ok) {
      const artistsData = await artistRes.json();
      artistsData.artists.forEach((artist: any) => {
        genres = genres.concat(artist.genres || []);
      });
    }
  }

  const genreCounts: Record<string, number> = {};
  genres.forEach((g) => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    image: data.images?.[0]?.url ?? null,
    owner: data.owner?.display_name ?? "Unknown",
    followers: data.followers?.total ?? 0,
    totalTracks: data.tracks.total,
    totalDurationMs,
    genres: Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count),
  };
};
