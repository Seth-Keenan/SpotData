export type SpotifyProfile = {
  id: string;
  display_name: string;
  email?: string;
  images?: { url: string }[];
};

export type SpotifyPlaylist = {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: { total: number };
};

export type SpotifyPlaylistResponse = {
  href: string;
  limit: number;
  offset: number;
  total: number;
  items: SpotifyPlaylist[];
};

export type SpotifyArtist = {
  id: string;
  name: string;
  genres: string[];
  images: { url: string; width: number; height: number }[];
  popularity: number;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  album: {
    id: string;
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  artists: { id: string; name: string }[];
  duration_ms: number;
  popularity: number;
};