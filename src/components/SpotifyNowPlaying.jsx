import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function SpotifyNowPlaying() {
  const { t } = useTranslation();
  const [nowPlaying, setNowPlaying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        setLoading(true);
        const response = await fetch('/.netlify/functions/spotify');
        const data = await response.json();

        if (data.error || !data.item) {
          setError('not_playing');
          setNowPlaying(null);
          return;
        }

        setNowPlaying({
          name: data.item.name,
          artist: data.item.artists[0]?.name || 'Unknown',
          album: data.item.album?.name || 'Unknown',
          image: data.item.album?.images[0]?.url,
          url: data.item.external_urls?.spotify,
          isPlaying: data.is_playing,
        });
        setError(null);
      } catch (err) {
        setError('unavailable');
        console.error('Spotify error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000); // Refresh every 30s

    return () => clearInterval(interval);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <a
        href={nowPlaying.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="bg-green-50 dark:bg-green-900/30 hover:dark:bg-green-800/30 hover:bg-green-100 border border-green-100 dark:border-green-700 rounded-xl p-4 transition-colors duration-300 group cursor-pointer">
          <div className="flex items-center gap-3">
            {nowPlaying.image && (
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={nowPlaying.image}
                  alt={nowPlaying.album}
                  className="w-full h-full rounded object-cover"
                />
                {nowPlaying.isPlaying && (
                  <div className="absolute inset-0 rounded bg-white/20 dark:bg-black/20 flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-1 h-2 bg-green-400 rounded-full animate-pulse" />
                      <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse animation-delay-100" />
                      <div className="w-1 h-2 bg-green-400 rounded-full animate-pulse animation-delay-200" />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">
                <i className={`fas ${nowPlaying.isPlaying ? 'fa-volume-high' : 'fa-clock-rotate-left'} mr-1.5`} aria-hidden="true" />
                {nowPlaying.isPlaying ? t('afk.spotify_status.now_playing') : t('afk.spotify_status.last_played')}
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-green-700 transition-colors">
                {nowPlaying.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-gray-400 truncate">
                {nowPlaying.artist}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-gray-400 mt-2 truncate">
            {nowPlaying.album}
          </p>
        </div>
      </a>
    </motion.div>
  );
}
