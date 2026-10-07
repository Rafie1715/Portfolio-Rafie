import SpotifyRecord from './SpotifyRecord';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function SpotifyNowPlaying() {
  const { t } = useTranslation();
  const [nowPlaying, setNowPlaying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify', { signal: controller.signal });
        if (!response.ok) throw new Error('Spotify temporarily unavailable');
        const data = await response.json();
        if (disposed) return;

        if (data.error || !data.item) {
          setError('not_playing');
          setNowPlaying(null);
          return;
        }

        setNowPlaying({
          name: data.item.name,
          artist: data.item.artists?.[0]?.name || 'Unknown',
          album: data.item.album?.name || 'Unknown',
          image: data.item.album?.images?.[0]?.url,
          url: data.item.external_urls?.spotify,
          isPlaying: data.is_playing,
        });
        setError(null);
      } catch (err) {
        if (disposed) return;
        setError('unavailable');
        console.error('Spotify error:', err);
      } finally {
        if (!disposed) setLoading(false);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000); // Refresh every 30s

    return () => {
      disposed = true;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 animate-pulse border border-green-100 dark:border-green-800">
          <div className="h-4 bg-green-200 rounded w-1/2 mb-2" />
          <div className="h-3 bg-green-100 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-gray-400 text-sm text-center">{t(`afk.spotify_status.${error}`)}</p>
        </div>
      </div>
    );
  }

  if (!nowPlaying) {
    return null;
  }

  return <SpotifyRecord track={nowPlaying} />;
}
