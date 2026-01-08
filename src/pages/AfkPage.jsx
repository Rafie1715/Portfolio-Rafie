import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying';
import SpotifyTopTracks from '../components/SpotifyTopTracks';

const AfkPage = () => {
    // --- STATE ---
    const [games, setGames] = useState([]);
    const [recentGames, setRecentGames] = useState([]); // State Baru: Recently Played
    const [steamUser, setSteamUser] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Steam
                const steamRes = await fetch('/.netlify/functions/steam');
                const steamData = await steamRes.json();

                if (steamData.games) setGames(steamData.games);
                if (steamData.recent) setRecentGames(steamData.recent); // Set Data Recent
                if (steamData.user) setSteamUser(steamData.user);

                // Fetch Movies
                const moviesRes = await fetch('/.netlify/functions/movies');
                const moviesData = await moviesRes.json();
                if (Array.isArray(moviesData)) setMovies(moviesData);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- HELPER FUNCTIONS ---
    const groupMoviesByYear = (movieList) => {
        const grouped = {};
        movieList.forEach(movie => {
            if (!movie.release_date) return;
            const year = movie.release_date.split('-')[0];
            if (!grouped[year]) grouped[year] = [];
            grouped[year].push(movie);
        });
        return Object.entries(grouped).sort((a, b) => b[0] - a[0]);
    };

    const moviesByYear = groupMoviesByYear(movies);

    const getSteamStatus = () => {
        if (!steamUser) return { text: 'Loading...', color: 'bg-gray-400' };
        if (steamUser.gameextrainfo) return { text: `Playing ${steamUser.gameextrainfo}`, color: 'bg-green-500 animate-pulse' };
        if (steamUser.status === 1) return { text: 'Online', color: 'bg-blue-500' };
        return { text: 'Offline', color: 'bg-gray-500' };
    };

    const statusInfo = getSteamStatus();

    // --- ANIMATION VARIANTS ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 20 }
        }
    };

    // Komponen Visualizer Musik
    const MusicBars = () => (
        <div className="flex gap-1 items-end h-4">
            {[1, 2, 3, 4].map((bar) => (
                <motion.div
                    key={bar}
                    className="w-1 bg-[#1DB954]"
                    animate={{ height: [4, 16, 8, 12, 4] }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: bar * 0.1
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="bg-gray-50 dark:bg-dark min-h-screen pt-24 pb-20 transition-colors duration-300 relative overflow-hidden">
            
            <SEO 
                title="AFK (Away From Keyboard) | Rafie Rojagat" 
                description="My life outside of coding: Music, Games, and Movies."
                url="https://rafie-dev.netlify.app/afk" 
            />

            {/* --- BACKGROUND AMBIANCE --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <motion.div 
                    animate={{ x: [-100, 100, -100], y: [-50, 50, -50], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"
                />
                <motion.div 
                    animate={{ x: [100, -100, 100], y: [50, -50, 50], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]"
                />
            </div>

            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                
                {/* --- HEADER --- */}
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 1.5 }}
                        className="inline-block relative"
                    >
                        <motion.div 
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="p-4 rounded-3xl bg-white dark:bg-slate-800 mb-6 border border-gray-100 dark:border-slate-700 shadow-xl relative z-10"
                        >
                            <span className="text-4xl">🎮</span>
                        </motion.div>
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full transform scale-150 z-0"></div>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-6xl font-black text-dark dark:text-white mb-6 tracking-tight"
                    >
                        /afk <span className="text-primary text-2xl md:text-4xl font-medium ml-2 font-mono">(Away From Keyboard)</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        When I'm not pushing pixels or fixing bugs, this is what I'm up to.
                    </motion.p>
                </div>

                <motion.div 
                    className="space-y-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    
                    {/* --- SECTION 1: MUSIC --- */}
                    <motion.div 
                        variants={itemVariants} 
                        whileHover={{ y: -5 }}
                        className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-[2rem] p-8 md:p-10 shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-3">
                                <i className="fab fa-spotify text-[#1DB954] text-3xl"></i>
                                On Repeat
                                <MusicBars />
                            </h2>
                            <div className="text-xs font-bold text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/20 px-4 py-1.5 rounded-full w-fit flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Live from Spotify
                            </div>
                        </div>

                        <div className="mb-8 transform transition-all duration-300">
                            <SpotifyNowPlaying />
                        </div>

                        <div className="pt-6 border-t border-gray-200 dark:border-slate-700/50">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Top Tracks This Month</h3>
                            <SpotifyTopTracks />
                        </div>
                    </motion.div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* --- SECTION 2: GAMING (Updated with Recently Played) --- */}
                        <motion.section 
                            variants={itemVariants} 
                            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-[2rem] p-6 md:p-8 h-full shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                        >
                            {/* Profile Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                                <div className="flex items-center gap-4">
                                    {steamUser && (
                                        <a href={steamUser.profileurl} target="_blank" rel="noreferrer" className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                                            <img src={steamUser.avatar} alt="Steam Avatar" className="relative w-14 h-14 rounded-full border-2 border-white dark:border-slate-800 object-cover" />
                                            <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white dark:border-slate-800 rounded-full ${statusInfo.color} z-10`}></div>
                                        </a>
                                    )}
                                    
                                    <div>
                                        <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2">
                                            <i className="fab fa-steam text-[#1b2838] dark:text-white"></i>
                                            Steam Library
                                        </h2>
                                        <p className={`text-xs font-bold mt-1 ${steamUser?.gameextrainfo ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                            {statusInfo.text}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* A. RECENTLY PLAYED (FITUR BARU) */}
                            {recentGames.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <i className="fas fa-history"></i> Recently Played (2 Weeks)
                                    </h3>
                                    {/* Horizontal Scroll */}
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                        {recentGames.map((game) => (
                                            <a 
                                                key={game.appid} 
                                                href={`https://store.steampowered.com/app/${game.appid}`}
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex-shrink-0 w-32 group relative rounded-xl overflow-hidden shadow-md cursor-pointer border border-gray-200 dark:border-slate-700/50"
                                            >
                                                <img src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`} alt={game.name} className="w-full h-40 object-cover object-center transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                                    <span className="text-[10px] text-white font-bold line-clamp-2 leading-tight mb-1">{game.name}</span>
                                                    <span className="text-[9px] text-green-400 font-mono">{(game.playtime_2weeks / 60).toFixed(1)} hrs</span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* B. MOST PLAYED */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                   <i className="fas fa-trophy"></i> Most Played
                                </h3>
                                <span className={`w-2 h-2 rounded-full animate-pulse ${loading ? 'bg-gray-400' : 'bg-green-500'}`} title="API Status"></span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {loading ? (
                                    [1, 2, 3, 4].map((i) => <div key={i} className="aspect-[16/9] bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse"></div>)
                                ) : games.length > 0 ? (
                                    games.map((game) => (
                                        <motion.div 
                                            key={game.appid} 
                                            whileHover={{ scale: 1.03, y: -2 }}
                                            className="group relative aspect-[16/9] bg-gray-900 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-slate-700 cursor-pointer"
                                        >
                                            <img src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`} alt={game.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                            
                                            <div className="absolute bottom-0 left-0 p-4 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-1 text-shadow">{game.name}</h3>
                                                <p className="text-[10px] text-gray-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                                    <i className="fas fa-clock text-[9px]"></i> {Math.floor(game.playtime_forever / 60)} hrs total
                                                </p>
                                            </div>
                                            <a href={`https://store.steampowered.com/app/${game.appid}`} target="_blank" rel="noreferrer" className="absolute inset-0 z-10"></a>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-10 text-gray-400 text-sm">No games found.</div>
                                )}
                            </div>
                        </motion.section>

                        {/* --- SECTION 3: MOVIES --- */}
                        <motion.section 
                            variants={itemVariants} 
                            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-[2rem] p-6 md:p-8 shadow-lg hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-3">
                                    <span className="text-3xl filter drop-shadow-md">🍿</span> Cinema Log
                                </h2>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-3 gap-3">
                                     {[1, 2, 3].map(i => <div key={i} className="aspect-[2/3] bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>)}
                                </div>
                            ) : movies.length > 0 ? (
                                
                                <div className="space-y-12">
                                    {moviesByYear.map(([year, yearMovies]) => {
                                        const favoriteMovie = yearMovies.find(m => m.isFavorite);
                                        const otherMovies = yearMovies.filter(m => !m.isFavorite);

                                        return (
                                            <div key={year} className="relative">
                                                {/* Year Watermark */}
                                                <h3 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-primary/10 to-transparent absolute -top-12 -left-4 z-0 select-none pointer-events-none font-outline-2">
                                                    {year}
                                                </h3>
                                                
                                                <div className="relative z-10 pt-2">
                                                    
                                                    {/* Best of Year Card */}
                                                    {favoriteMovie && (
                                                        <motion.a 
                                                            whileHover={{ scale: 1.02 }}
                                                            href={`https://www.themoviedb.org/movie/${favoriteMovie.id}`} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="block mb-6 group relative rounded-2xl overflow-hidden shadow-lg border border-yellow-500/30 hover:border-yellow-400 transition-all cursor-pointer bg-dark"
                                                        >
                                                            <div className="flex h-32 md:h-40 relative">
                                                                {/* Backdrop Image Blur */}
                                                                <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm group-hover:opacity-50 transition-opacity duration-500" style={{backgroundImage: `url(https://image.tmdb.org/t/p/w500${favoriteMovie.backdrop_path})`}}></div>
                                                                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>

                                                                <div className="relative z-10 flex w-full">
                                                                     <div className="w-24 md:w-28 flex-shrink-0 relative shadow-2xl">
                                                                        <img src={`https://image.tmdb.org/t/p/w500${favoriteMovie.poster_path}`} alt={favoriteMovie.title} className="w-full h-full object-cover" />
                                                                     </div>
                                                                     <div className="flex-1 p-4 flex flex-col justify-center">
                                                                         <div className="flex items-center gap-2 mb-2">
                                                                             <span className="text-[10px] font-black bg-yellow-400 text-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-lg shadow-yellow-400/20">
                                                                                 <i className="fas fa-trophy"></i> BEST OF {year}
                                                                             </span>
                                                                             <span className="text-yellow-400 text-xs font-bold drop-shadow-md">⭐ {favoriteMovie.myRating || favoriteMovie.vote_average.toFixed(1)}</span>
                                                                         </div>
                                                                         <h4 className="text-white font-bold text-lg md:text-xl leading-tight line-clamp-1 group-hover:text-yellow-300 transition-colors drop-shadow-md">{favoriteMovie.title}</h4>
                                                                         <p className="text-gray-300 text-xs mt-1 line-clamp-2 opacity-80 group-hover:opacity-100">{favoriteMovie.overview}</p>
                                                                     </div>
                                                                </div>
                                                            </div>
                                                        </motion.a>
                                                    )}

                                                    {/* Other Movies Grid */}
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                        {otherMovies.map((movie) => (
                                                            <motion.a 
                                                                key={movie.id} 
                                                                whileHover={{ y: -5, scale: 1.05, zIndex: 10 }}
                                                                href={`https://www.themoviedb.org/movie/${movie.id}`} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="group relative aspect-[2/3] bg-gray-900 rounded-xl overflow-hidden shadow-md cursor-pointer block" 
                                                                title={movie.title}
                                                            >
                                                                <img 
                                                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                                                    alt={movie.title}
                                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                                                                    loading="lazy"
                                                                />
                                                                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 text-center">
                                                                    <span className="text-white text-[10px] font-bold leading-tight mb-1 line-clamp-2">{movie.title}</span>
                                                                    <span className="text-yellow-400 text-[9px] font-bold">⭐ {movie.myRating ? movie.myRating : movie.vote_average.toFixed(1)}</span>
                                                                </div>
                                                            </motion.a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                            ) : (
                                 <div className="col-span-3 text-center py-10 text-gray-400 text-sm">No movies added.</div>
                            )}
                        </motion.section>

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AfkPage;