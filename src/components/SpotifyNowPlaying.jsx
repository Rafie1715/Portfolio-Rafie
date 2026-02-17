// src/components/SpotifyNowPlaying.jsx
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

const SpotifyNowPlaying = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch('/.netlify/functions/spotify')
        .then(res => res.json())
        .then(data => {
            setResult(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
  }, []);

  const toggleAudio = (e) => {
    e.stopPropagation(); // Mencegah event bubbling
    if (!audioRef.current) return;

    if (isPlayingPreview) {
        audioRef.current.pause();
        setIsPlayingPreview(false);
    } else {
        audioRef.current.play();
        setIsPlayingPreview(true);
    }
  };

  const handleAudioEnded = () => {
      setIsPlayingPreview(false);
  };

  if (loading) {
    return (
        <div className="h-20 w-full max-w-sm bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse mx-auto border border-gray-200 dark:border-slate-700"></div>
    );
  }

  // Cek apakah ada lagu yang sedang diputar (Realtime Spotify) atau Preview sedang jalan
  const isActive = result.isPlaying || isPlayingPreview;
  const hasPreview = !!result.previewUrl;

  return (
    <div className="flex justify-center w-full">
        {/* Audio Element Hidden */}
        {result.previewUrl && (
            <audio 
                ref={audioRef} 
                src={result.previewUrl} 
                onEnded={handleAudioEnded}
                volume="0.5" 
            />
        )}

        <Tilt 
            tiltMaxAngleX={5} 
            tiltMaxAngleY={5} 
            scale={1.02} 
            transitionSpeed={2000}
            className="w-full max-w-sm"
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative overflow-hidden p-4 rounded-2xl border transition-all flex items-center gap-4 group cursor-default ${
                    isActive 
                    ? 'bg-primary/10 border-primary/50 dark:bg-primary/20 shadow-[0_0_25px_rgba(37,99,235,0.25)]' 
                    : 'bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border-white/20 dark:border-white/10 shadow-sm hover:shadow-md'
                }`}
            >
                {/* Background Equalizer (Hiasan jika aktif) */}
                {isActive && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                        <div className="flex gap-1 items-end h-10">
                            <motion.div animate={{ height: [8, 24, 12, 32, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1.5 bg-primary rounded-full" />
                            <motion.div animate={{ height: [16, 8, 24, 12, 16] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1.5 bg-primary rounded-full" />
                            <motion.div animate={{ height: [24, 12, 32, 8, 24] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 bg-primary rounded-full" />
                            <motion.div animate={{ height: [10, 30, 15, 10, 10] }} transition={{ repeat: Infinity, duration: 0.55 }} className="w-1.5 bg-primary rounded-full" />
                        </div>
                    </div>
                )}

                {/* Album Art + Play Button */}
                <div 
                    className="relative w-16 h-16 flex-shrink-0 shadow-lg rounded-xl overflow-hidden group-hover:shadow-primary/40 transition-shadow duration-300 cursor-pointer"
                    onClick={hasPreview ? toggleAudio : undefined}
                >
                    {result.albumArt ? (
                        <img 
                            src={result.albumArt} 
                            alt={result.title} 
                            className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${result.isPlaying && !isPlayingPreview ? 'animate-[spin_10s_linear_infinite]' : ''}`} 
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                            <i className="fab fa-spotify text-3xl text-gray-400"></i>
                        </div>
                    )}
                    
                    {/* Overlay Play/Pause Icon */}
                    {hasPreview && (
                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isPlayingPreview ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            <i className={`fas ${isPlayingPreview ? 'fa-pause' : 'fa-play'} text-white text-xl drop-shadow-md`}></i>
                        </div>
                    )}

                    {/* Logo Spotify Kecil */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1DB954] rounded-full border-2 border-white dark:border-darkLight flex items-center justify-center text-white text-[10px] z-10 shadow-sm">
                        <i className="fab fa-spotify"></i>
                    </div>
                </div>

                {/* Info Lagu */}
                <div className="flex-1 min-w-0 z-10 relative">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-[#1DB954]' : 'text-gray-400'}`}>
                        {result.isPlaying ? "Listening on Spotify" : (isPlayingPreview ? "Playing Preview" : "Offline / Idle")}
                    </p>

                    {result.title ? (
                        <a href={result.url} target="_blank" rel="noreferrer" className="block group/link">
                            <h4 className={`text-sm font-bold truncate pr-2 ${isActive ? 'text-primary' : 'text-gray-800 dark:text-white'} group-hover/link:underline`}>
                                {result.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                {result.artist}
                            </p>
                        </a>
                    ) : (
                        <div>
                            <h4 className="text-sm font-bold text-gray-800 dark:text-white">Not Playing</h4>
                            <p className="text-xs text-gray-500">Spotify is currently silent.</p>
                        </div>
                    )}
                </div>

            </motion.div>
        </Tilt>
    </div>
  );
};

export default SpotifyNowPlaying;