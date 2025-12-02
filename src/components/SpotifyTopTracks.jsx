import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SpotifyTopTracks = () => {
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetch('/.netlify/functions/spotify-top')
      .then((res) => res.json())
      .then((data) => {
        setTracks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching top tracks:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 w-full max-w-2xl mx-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-darkLight border border-gray-100 dark:border-slate-800 animate-pulse">
            <div className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
            <div className="flex-1 space-y-2">
               <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
               <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {tracks.map((track, index) => (
        <motion.a
          key={index}
          href={track.songUrl}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-darkLight border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all hover:scale-[1.02] hover:shadow-md group"
        >
          <span className="text-gray-400 font-mono font-bold w-6 text-center">{index + 1}</span>

          <img 
            src={track.albumArt} 
            alt={track.title} 
            className="w-12 h-12 rounded-md shadow-sm group-hover:shadow-primary/30 transition-shadow" 
          />

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-dark dark:text-white truncate group-hover:text-[#1DB954] transition-colors">
              {track.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {track.artist}
            </p>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
             <i className="fas fa-external-link-alt text-sm"></i>
          </div>
        </motion.a>
      ))}
    </div>
  );
};

export default SpotifyTopTracks;