// src/components/SpotifyTopTracks.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

const SpotifyTopTracks = () => {
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState([]);
  const [activeTrackId, setActiveTrackId] = useState(null); // Melacak lagu mana yang sedang dibuka playernya

  useEffect(() => {
    fetch('/.netlify/functions/spotify-top')
      .then((res) => res.json())
      .then((data) => {
        setTracks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Fungsi saat kartu diklik
  const handleTogglePlayer = (id) => {
    if (activeTrackId === id) {
        setActiveTrackId(null); // Tutup jika diklik lagi
    } else {
        setActiveTrackId(id); // Buka player untuk lagu ini
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tracks.map((track, index) => {
          const isActive = activeTrackId === track.id;

          return (
            <div key={track.id} className="relative">
                {/* Jika Aktif: Tampilkan Iframe Spotify ASLI 
                   (Ini yang bisa memutar lagu full)
                */}
                <AnimatePresence>
                    {isActive && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 overflow-hidden"
                        >
                            <iframe 
                                style={{ borderRadius: '12px' }} 
                                src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`} 
                                width="100%" 
                                height="152" 
                                frameBorder="0" 
                                allowFullScreen="" 
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                loading="lazy"
                                className="shadow-xl"
                            ></iframe>
                            
                            {/* Tombol Tutup Player */}
                            <button 
                                onClick={() => setActiveTrackId(null)}
                                className="w-full text-center text-xs text-red-400 mt-2 hover:text-red-500 transition-colors"
                            >
                                <i className="fas fa-times mr-1"></i> Close Player
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tampilan Kartu Custom Kita (Hanya muncul jika player TIDAK aktif)
                   Agar desain tetap estetik saat tidak diputar.
                */}
                {!isActive && (
                    <Tilt 
                        tiltMaxAngleX={5}
                        tiltMaxAngleY={5}
                        scale={1.02}
                        transitionSpeed={2000}
                        className="h-full"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative overflow-hidden p-4 rounded-2xl border bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border-white/20 dark:border-white/10 hover:bg-white hover:dark:bg-slate-800 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-4 group h-full"
                            onClick={() => handleTogglePlayer(track.id)}
                        >
                            {/* Nomor Urut */}
                            <div className="absolute top-2 right-3 text-[10px] font-bold text-gray-300 dark:text-gray-600 font-mono">
                                #{String(index + 1).padStart(2, '0')}
                            </div>

                            {/* Album Art */}
                            <div className="relative w-16 h-16 flex-shrink-0 shadow-lg rounded-lg overflow-hidden group-hover:shadow-primary/40 transition-shadow duration-300">
                                <img 
                                    src={track.albumArt} 
                                    alt={track.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <i className="fab fa-spotify text-white text-2xl drop-shadow-md"></i>
                                </div>
                            </div>

                            {/* Info Lagu */}
                            <div className="flex-1 min-w-0 z-10">
                                <h4 className="text-sm font-bold truncate pr-6 text-gray-800 dark:text-white group-hover:text-[#1DB954] transition-colors">
                                    {track.title}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                    {track.artist}
                                </p>
                                <span className="text-[10px] text-primary mt-2 block">
                                    Click to play full song
                                </span>
                            </div>
                        </motion.div>
                    </Tilt>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpotifyTopTracks;