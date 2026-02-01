import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying';
import SpotifyTopTracks from '../components/SpotifyTopTracks';
import { useTranslation } from 'react-i18next';

const AfkPage = () => {
    const DISCORD_ID = "717196208996876379"; 
    const { t } = useTranslation();

    const [games, setGames] = useState([]);
    const [recentGames, setRecentGames] = useState([]); 
    const [steamUser, setSteamUser] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [discordData, setDiscordData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const steamRes = await fetch('/.netlify/functions/steam');
                const steamData = await steamRes.json();
                if (steamData.games) setGames(steamData.games);
                if (steamData.recent) setRecentGames(steamData.recent); 
                if (steamData.user) setSteamUser(steamData.user);

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

    useEffect(() => {
        if (!DISCORD_ID) return;
        let socket;
        let heartbeatInterval;

        const connectLanyard = () => {
            socket = new WebSocket('wss://api.lanyard.rest/socket');
            socket.onopen = () => {
                socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
            };
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                const { t, d, op } = message;
                if (op === 1) {
                    heartbeatInterval = setInterval(() => {
                        if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ op: 3 })); 
                    }, d.heartbeat_interval);
                }
                if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
                    setDiscordData((prev) => t === 'INIT_STATE' ? d : { ...prev, ...d });
                }
            };
            socket.onclose = () => clearInterval(heartbeatInterval);
        };
        connectLanyard();
        return () => {
            clearInterval(heartbeatInterval);
            if (socket) socket.close();
        };
    }, []); 

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

    const getDiscordStatus = () => {
        if (!discordData) return { text: t('afk.offline'), color: 'bg-gray-500', isOnline: false, avatar: steamUser?.avatar };
        
        const statusColors = { online: 'bg-green-500', idle: 'bg-yellow-500', dnd: 'bg-red-500', offline: 'bg-gray-500' };
        const gameActivity = discordData.activities?.find(act => act.type === 0);

        if (gameActivity) {
            return { 
                text: `${t('afk.playing')} ${gameActivity.name}`, 
                color: 'bg-purple-500', isOnline: true, 
                gameDetails: gameActivity, 
                avatar: `https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${discordData.discord_user.avatar}.png`
            };
        }
        return { 
            text: discordData.discord_status === 'offline' ? t('afk.offline') : (discordData.discord_status.charAt(0).toUpperCase() + discordData.discord_status.slice(1)), 
            color: statusColors[discordData.discord_status] || 'bg-gray-500', 
            isOnline: discordData.discord_status !== 'offline',
            avatar: `https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${discordData.discord_user.avatar}.png`
        };
    };
    const statusInfo = getDiscordStatus();

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } } };
    const MusicBars = () => ( <div className="flex gap-1 items-end h-4"> {[1, 2, 3, 4].map((bar) => ( <motion.div key={bar} className="w-1 bg-[#1DB954]" animate={{ height: [4, 16, 8, 12, 4] }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: bar * 0.1 }} /> ))} </div> );

    return (
        <div className="bg-gray-50 dark:bg-dark min-h-screen pt-24 pb-20 transition-colors duration-300 relative overflow-hidden">
            <SEO title="AFK | Rafie Rojagat" description={t('afk.seo_desc')} url="https://rafierb.me/afk" />

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <motion.div animate={{ x: [-100, 100, -100], y: [-50, 50, -50], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                
                <div className="text-center mb-16">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="inline-block text-6xl mb-4 filter drop-shadow-lg">🎮</motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-dark dark:text-white mb-2 tracking-tight">/afk</h1>
                    <p className="text-gray-500 font-medium text-lg">{t('afk.subtitle')}</p>
                </div>

                <motion.div className="space-y-12" variants={containerVariants} initial="hidden" animate="visible">
                    
                    <motion.div 
                        variants={itemVariants} 
                        whileHover={{ y: -5 }}
                        className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-[2rem] p-8 md:p-10 shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-3">
                                <i className="fab fa-spotify text-[#1DB954] text-3xl"></i>
                                {t('afk.on_repeat')}
                                <MusicBars />
                            </h2>
                            <div className="text-xs font-bold text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/20 px-4 py-1.5 rounded-full w-fit flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                {t('afk.live_spotify')}
                            </div>
                        </div>

                        <div className="mb-8 transform transition-all duration-300">
                            <SpotifyNowPlaying />
                        </div>

                        <div className="pt-6 border-t border-gray-200 dark:border-slate-700/50">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">{t('afk.top_tracks')}</h3>
                            <SpotifyTopTracks />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        <motion.section variants={itemVariants} className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 rounded-[2.5rem] p-6 md:p-8 h-full shadow-xl hover:shadow-purple-500/10 transition-all duration-500 flex flex-col">                            
                            <div className="flex items-center gap-5 mb-8">
                                <div className="relative">
                                    <motion.div className={`absolute -inset-1 rounded-full blur opacity-40 ${statusInfo.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 2, repeat: Infinity }}></motion.div>
                                    <img src={statusInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'} alt="Avatar" className="relative w-16 h-16 rounded-full border-2 border-white dark:border-slate-800 object-cover bg-gray-200" />
                                    <div className={`absolute bottom-0 right-0 w-5 h-5 border-4 border-white dark:border-slate-800 rounded-full ${statusInfo.color} z-10`}></div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-dark dark:text-white">{t('afk.status_check')}</h2>
                                    <p className={`text-sm font-bold mt-0.5 ${statusInfo.isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>{statusInfo.text}</p>
                                </div>
                            </div>

                            <div className="mb-10">
                                <AnimatePresence mode="wait">
                                    {statusInfo.gameDetails ? (
                                        <motion.div key="playing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/5 shadow-2xl group w-full">
                                            <div className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-40 blur-md scale-110 group-hover:scale-100 transition-transform duration-700" style={{ backgroundImage: statusInfo.gameDetails.assets?.large_image ? `url(https://cdn.discordapp.com/app-assets/${statusInfo.gameDetails.application_id}/${statusInfo.gameDetails.assets.large_image}.png)` : 'none' }}></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent dark:from-slate-900/90 dark:via-slate-900/50 dark:to-transparent"></div>
                                            <div className="relative z-10 p-6 flex items-center gap-5">
                                                {statusInfo.gameDetails.assets?.large_image ? (
                                                    <img src={`https://cdn.discordapp.com/app-assets/${statusInfo.gameDetails.application_id}/${statusInfo.gameDetails.assets.large_image}.png`} alt="Game Asset" className="w-24 h-24 rounded-xl shadow-lg object-cover bg-gray-800" />
                                                ) : (
                                                    <div className="w-24 h-24 rounded-xl bg-indigo-500 flex items-center justify-center text-4xl shadow-lg">🎮</div>
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Now Playing</span>
                                                    </div>
                                                    <h3 className="text-2xl font-black text-dark dark:text-white leading-tight">{statusInfo.gameDetails.name}</h3>
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-1">{statusInfo.gameDetails.details}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{statusInfo.gameDetails.state}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="text-center text-gray-400 py-8 w-full bg-gray-50/50 dark:bg-slate-700/30 rounded-2xl border border-dashed border-gray-300 dark:border-slate-600">
                                            <div className="text-3xl mb-2 grayscale opacity-50">💤</div>
                                            <p className="text-xs font-medium">{t('afk.chilling')}</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><i className="fas fa-history"></i> {t('afk.recent_games')}</h3>
                                    <div className="h-[1px] flex-grow ml-4 bg-gray-200 dark:bg-slate-700/50"></div>
                                </div>
                                {recentGames.length > 0 ? (
                                    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-hide">
                                        {recentGames.map((game) => (
                                            <a key={game.appid} href={`https://store.steampowered.com/app/${game.appid}`} target="_blank" rel="noreferrer" className="flex-shrink-0 w-24 group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                                <img src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`} className="w-full h-32 object-cover bg-gray-800" alt={game.name} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                    <p className="text-[9px] text-white font-bold leading-tight line-clamp-2">{game.name}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                ) : ( <p className="text-sm text-gray-400 italic">{t('afk.no_recent_games')}</p> )}
                            </div>
                        </motion.section>

                        <motion.section variants={itemVariants} className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 rounded-[2.5rem] p-6 md:p-8 shadow-xl hover:shadow-yellow-500/10 transition-all duration-500 flex flex-col h-[600px]">
                            <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-3 mb-6 flex-shrink-0">
                                <span className="text-3xl filter drop-shadow-md">🍿</span> {t('afk.cinema_log')}
                            </h2>
                            {loading ? ( <div className="animate-pulse h-full bg-gray-200 dark:bg-slate-700 rounded-xl"></div> ) : (
                                <div className="space-y-10 flex-1 overflow-y-auto scrollbar-hide pr-2 min-h-0">
                                    {moviesByYear.map(([year, yearMovies]) => {
                                        const fav = yearMovies.find(m => m.isFavorite);
                                        const others = yearMovies.filter(m => !m.isFavorite);
                                        return (
                                            <div key={year} className="relative">
                                                <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm py-2 mb-4 border-b border-gray-100 dark:border-slate-700/50">
                                                    <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">{year}</h3>
                                                </div>
                                                {fav && (
                                                    <a href={`https://www.themoviedb.org/movie/${fav.id}`} target="_blank" rel="noreferrer" className="block mb-6 relative rounded-2xl overflow-hidden aspect-video group cursor-pointer shadow-lg border border-yellow-500/20">
                                                        <img src={`https://image.tmdb.org/t/p/w500${fav.backdrop_path}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={fav.title} />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                                                        <div className="absolute bottom-0 left-0 p-5 w-full">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                {t('afk.best_year')}
                                                                <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg shadow-yellow-500/20 uppercase tracking-wide">{t('afk.best_year')}</span>
                                                                <span className="text-yellow-400 text-xs font-bold">⭐ {fav.myRating || fav.vote_average.toFixed(1)}</span>
                                                            </div>
                                                            <h4 className="text-white font-black text-xl leading-tight line-clamp-1 group-hover:text-yellow-300 transition-colors">{fav.title}</h4>
                                                        </div>
                                                    </a>
                                                )}
                                                <div className="grid grid-cols-3 gap-4">
                                                    {others.map(m => (
                                                        <a key={m.id} href={`https://www.themoviedb.org/movie/${m.id}`} target="_blank" rel="noreferrer" className="relative aspect-[2/3] rounded-xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                                            <img src={`https://image.tmdb.org/t/p/w300${m.poster_path}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" alt={m.title} />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-center">
                                                                <span className="text-white text-[11px] font-bold line-clamp-2 leading-tight">{m.title}</span>
                                                                <span className="text-yellow-400 text-[10px] font-bold mt-1">⭐ {m.myRating || m.vote_average.toFixed(1)}</span>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div className="h-4"></div>
                                </div>
                            )}
                        </motion.section>
                    </div>

                    <motion.section variants={itemVariants} className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 rounded-[2.5rem] p-8 md:p-10 shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest flex items-center gap-3">
                                <i className="fab fa-steam text-2xl"></i> {t('afk.steam_library')}
                            </h3>
                            <div className="h-[2px] flex-grow ml-6 bg-gray-200 dark:bg-slate-700/50 rounded-full"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> 
                            {games.slice(0, 16).map((game) => (
                                <div key={game.appid} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-700/40 hover:bg-white dark:hover:bg-slate-700/80 border border-transparent hover:border-gray-200 dark:hover:border-slate-600 transition-all cursor-default shadow-sm hover:shadow-md">
                                    <img src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt={game.name} />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-dark dark:text-white truncate">{game.name}</p>
                                        <p className="text-xs text-gray-500 font-mono">{Math.floor(game.playtime_forever / 60)} {t('afk.hours')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {steamUser && (
                            <div className="mt-10 text-center">
                                <a href={`${steamUser.profileurl}/games/?tab=all`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-dark dark:text-white rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
                                    <i className="fab fa-steam"></i> {t('afk.view_library')} <i className="fas fa-arrow-right ml-1"></i>
                                </a>
                            </div>
                        )}
                    </motion.section>

                </motion.div>
            </div>
        </div>
    );
};

export default AfkPage;