import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SpotifyNowPlaying = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});

  useEffect(() => {
    fetch('/.netlify/functions/spotify')
        .then(res => res.json())
        .then(data => {
            setResult(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching Spotify:", err);
            setLoading(false);
            setResult({ isPlaying: false });
        });
  }, []);

  return (
    <div className="mt-8 p-4 rounded-xl bg-gray-50 dark:bg-darkLight border border-gray-200 dark:border-slate-800 flex items-center gap-4 max-w-sm mx-auto shadow-sm hover:shadow-md transition-shadow">
        
        <div className="relative w-16 h-16 flex-shrink-0">
            {loading ? (
                <div className="w-full h-full bg-gray-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
            ) : (
                result.isPlaying ? (
                    <img 
                        src={result.albumArt} 
                        alt="Album Art" 
                        className="w-full h-full rounded-md shadow-sm animate-[spin_8s_linear_infinite]" 
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-slate-700 rounded-md flex items-center justify-center text-gray-400">
                        <i className="fab fa-spotify text-3xl"></i>
                    </div>
                )
            )}
            
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-darkLight flex items-center justify-center ${result.isPlaying ? 'bg-[#1DB954]' : 'bg-gray-400'}`}>
                {result.isPlaying && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>}
            </div>
        </div>

        <div className="flex-1 min-w-0 text-left">
            <p className="text-[10px] font-bold text-[#1DB954] uppercase tracking-wider mb-0.5">
                {loading ? "Loading..." : (result.isPlaying ? "Now Listening" : "Spotify Offline")}
            </p>
            
            {loading ? (
                <div className="space-y-1 mt-1">
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
                </div>
            ) : result.isPlaying ? (
                <a href={result.url} target="_blank" rel="noreferrer" className="block group">
                    <h4 className="text-sm font-bold text-dark dark:text-white truncate group-hover:text-[#1DB954] transition-colors" title={result.title}>{result.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={result.artist}>{result.artist}</p>
                </a>
            ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">Not playing anything right now.</p>
            )}
        </div>
        
        {result.isPlaying && (
            <div className="flex gap-0.5 items-end h-3">
                <motion.div animate={{ height: [3, 12, 6, 10, 3] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-[#1DB954] rounded-full" />
                <motion.div animate={{ height: [6, 3, 12, 5, 6] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-[#1DB954] rounded-full" />
                <motion.div animate={{ height: [10, 6, 3, 8, 10] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-[#1DB954] rounded-full" />
            </div>
        )}
    </div>
  );
};

export default SpotifyNowPlaying;