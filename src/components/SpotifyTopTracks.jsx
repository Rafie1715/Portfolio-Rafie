import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SpotifyTopTracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('short_term');
  const [selectedTrack, setSelectedTrack] = useState(null);

  const timeRanges = [
    { id: 'short_term', label: '4 weeks' },
    { id: 'medium_term', label: '6 months' },
    { id: 'long_term', label: 'All time' },
  ];

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/.netlify/functions/spotify-top?time_range=${timeRange}`);
        const data = await response.json();

        if (data.error || !data.items) {
          setError('Unable to fetch top tracks');
          setTracks([]);
          return;
        }

        setTracks(data.items.slice(0, 10)); // Top 10 tracks
        setError(null);
      } catch (err) {
        setError('Unable to fetch Spotify data');
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
        staggerChildren: 0.1,
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
        <h3 className="text-lg font-bold text-white mb-3">My Top Tracks</h3>
        <div className="flex gap-2 flex-wrap">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                timeRange === range.id
                  ? 'bg-green-500 text-black'
                  : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
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
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">
          No tracks found
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
                    onClick={async () => {
                      if (window.spotifyPlayerPlay) {
                        const uri = `spotify:track:${track.id}`;
                        const ok = await window.spotifyPlayerPlay(uri);
                        if (!ok) setSelectedTrack(track);
                      } else {
                        setSelectedTrack(track);
                      }
                    }}
                    className="px-3 py-1 rounded-full bg-green-500 text-black text-xs font-semibold hover:scale-105 transition"
                    aria-label={`Play ${track.name}`}
                  >
                    Play
                  </button>
                  <a href={track.external_urls?.spotify} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 dark:text-green-300 hover:underline">Open</a>
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
                <button onClick={() => setSelectedTrack(null)} className="text-xs text-slate-600 dark:text-gray-300 hover:underline">Close</button>
              </div>
              <div className="rounded overflow-hidden">
                <iframe
                  title={`spotify-player-${selectedTrack.id}`}
                  src={`https://open.spotify.com/embed/track/${selectedTrack.id}`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allowtransparency="true"
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
