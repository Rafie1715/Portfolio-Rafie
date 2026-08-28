import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function SpotifyTopTracks() {
  const { t } = useTranslation();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('short_term');
  const [selectedTrack, setSelectedTrack] = useState(null);

  const timeRanges = [
    { id: 'short_term', label: t('afk.spotify_ranges.four_weeks') },
    { id: 'medium_term', label: t('afk.spotify_ranges.six_months') },
    { id: 'long_term', label: t('afk.spotify_ranges.all_time') },
  ];

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/.netlify/functions/spotify-top?time_range=${timeRange}`);
        const data = await response.json();

        if (data.error || !data.items) {
          setError(true);
          setTracks([]);
          return;
        }

        setTracks(data.items.slice(0, 5));
        setError(null);
      } catch (err) {
        setError(true);
        console.error('Spotify error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, [timeRange]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
          staggerChildren: 0.06,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">{t('afk.top_tracks')}</h3>
        <div className="inline-flex max-w-full gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-1 overflow-x-auto">
          {timeRanges.map((range) => (
            <button
              type="button"
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                timeRange === range.id
                  ? 'bg-green-500 text-slate-950'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-green-500/10 rounded p-3 animate-pulse h-12"
            />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded p-4">
          <p className="text-red-400 text-sm">{t('afk.spotify_status.unavailable')}</p>
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">
          {t('afk.spotify_status.no_tracks')}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {tracks.map((track, idx) => (
            <motion.div
              key={track.id}
              variants={item}
              className="group block"
            >
              <div className="bg-green-50 dark:bg-green-900/20 text-slate-900 dark:text-white border border-green-200 dark:border-green-700 hover:shadow-lg rounded p-3 transition-all duration-300 flex items-center gap-3">
                <span className="text-sm font-bold text-slate-600 dark:text-green-300 w-6 text-center">{idx + 1}</span>
                {track.album?.images[0]?.url && (
                  <img src={track.album.images[0].url} alt={track.album?.name} className="w-10 h-10 rounded object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">{track.name}</p>
                  <p className="text-xs text-slate-600 dark:text-gray-400 truncate">{track.artists[0]?.name || 'Unknown Artist'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTrack(track)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-slate-950 hover:bg-green-400 transition-colors"
                    aria-label={`${t('afk.play_track')} ${track.name}`}
                    title={`${t('afk.play_track')} ${track.name}`}
                  >
                    <i className="fas fa-play text-xs" aria-hidden="true" />
                  </button>
                  <a href={track.external_urls?.spotify} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors" aria-label={`${t('afk.open_spotify')}: ${track.name}`} title={t('afk.open_spotify')}>
                    <i className="fas fa-arrow-up-right-from-square text-xs" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {selectedTrack && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{selectedTrack.name}</p>
                  <p className="text-xs text-slate-600 dark:text-gray-400 truncate">{selectedTrack.artists[0]?.name}</p>
                </div>
                <button type="button" onClick={() => setSelectedTrack(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label={t('afk.close_player')} title={t('afk.close_player')}>
                  <i className="fas fa-xmark" aria-hidden="true" />
                </button>
              </div>
              <div className="rounded overflow-hidden">
                <iframe
                  title={`spotify-player-${selectedTrack.id}`}
                  src={`https://open.spotify.com/embed/track/${selectedTrack.id}`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allowTransparency="true"
                  allow="encrypted-media"
                ></iframe>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
