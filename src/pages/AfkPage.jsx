import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying';
import SpotifyTopTracks from '../components/SpotifyTopTracks';

const AfkPage = () => {
    const [games, setGames] = useState([]);
    const [steamUser, setSteamUser] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const steamRes = await fetch('/.netlify/functions/steam');
                const steamData = await steamRes.json();

                if (steamData.games) setGames(steamData.games);
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 50 }
        }
    };

    const groupMoviesByYear = (movieList) => {
        const grouped = {};

        movieList.forEach(movie => {
            if (!movie.release_date) return;
            const year = movie.release_date.split('-')[0];

            if (!grouped[year]) {
                grouped[year] = [];
            }
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

    return (
        <div className="bg-white dark:bg-dark min-h-screen pt-24 pb-20 transition-colors duration-300">

            <SEO
                title="AFK (Away From Keyboard) | Rafie Rojagat"
                description="My life outside of coding: Music, Games, and Movies."
                url="https://rafie-dev.netlify.app/afk"
            />

            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16" data-aos="fade-down">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-block p-4 rounded-3xl bg-gray-100 dark:bg-slate-800 mb-6 border border-gray-200 dark:border-slate-700 shadow-sm"
                    >
                        <span className="text-4xl">🎮</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-bold text-dark dark:text-white mb-6 tracking-tight">
                        /afk <span className="text-primary text-2xl md:text-4xl font-normal ml-2">(Away From Keyboard)</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        When I'm not pushing pixels or fixing bugs, this is what I'm up to.
                    </p>
                </div>

                <motion.div
                    className="space-y-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >

                    <motion.div variants={itemVariants} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-gray-100 dark:border-slate-700 rounded-3xl p-8 md:p-10 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-3">
                                <i className="fab fa-spotify text-[#1DB954] text-3xl"></i>
                                On Repeat
                            </h2>
                            <div className="text-xs font-bold text-[#1DB954] bg-[#1DB954]/10 px-3 py-1 rounded-full w-fit">
                                Live from Spotify
                            </div>
                        </div>

                        <div className="mb-8">
                            <SpotifyNowPlaying />
                        </div>

                        <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Top Tracks This Month</h3>
                            <SpotifyTopTracks />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.section variants={itemVariants} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-gray-100 dark:border-slate-700 rounded-3xl p-6 md:p-8 h-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                <div className="flex items-center gap-4">
                                    {steamUser && (
                                        <a href={steamUser.profileurl} target="_blank" rel="noreferrer" className="relative">
                                            <img src={steamUser.avatar} alt="Steam Avatar" className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-slate-600" />
                                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white dark:border-slate-800 rounded-full ${statusInfo.color}`}></div>
                                        </a>
                                    )}

                                    <div>
                                        <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2">
                                            <i className="fab fa-steam text-[#1b2838] dark:text-white"></i>
                                            Steam Library
                                        </h2>
                                        <p className={`text-xs font-bold ${steamUser?.gameextrainfo ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                            {statusInfo.text}
                                        </p>
                                    </div>
                                </div>

                                {steamUser && (
                                    <a href={steamUser.profileurl} target="_blank" rel="noreferrer" className="px-4 py-2 text-xs font-bold bg-[#1b2838] text-white rounded-lg hover:bg-[#2a475e] transition-colors">
                                        View Profile
                                    </a>
                                )}
                            </div>
                            <div className="fl ex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-3">
                                    <i className="fab text-[#1b2838] dark:text-white text-3xl"></i>
                                    Most Played
                                </h2>
                                <span className={`w-2 h-2 rounded-full animate-pulse ${loading ? 'bg-gray-400' : 'bg-green-500'}`} title="Steam Status"></span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {loading ? (
                                    [1, 2, 3, 4].map((i) => (
                                        <div key={i} className="aspect-[16/9] bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse"></div>
                                    ))
                                ) : games.length > 0 ? (
                                    games.map((game) => (
                                        <div key={game.appid} className="group relative aspect-[16/9] bg-gray-900 rounded-2xl overflow-hidden shadow-md border border-gray-800 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
                                            <img
                                                src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`}
                                                alt={game.name}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                            />

                                            <div className="absolute bottom-0 left-0 p-3 w-full bg-gradient-to-t from-black via-black/80 to-transparent">
                                                <h3 className="text-white font-bold text-sm leading-tight mb-0.5 line-clamp-1" title={game.name}>{game.name}</h3>
                                                <p className="text-[10px] text-gray-300 flex items-center gap-1">
                                                    <i className="fas fa-gamepad text-[9px]"></i>
                                                    {Math.floor(game.playtime_forever / 60)} hrs total played
                                                </p>
                                            </div>

                                            <a
                                                href={`https://store.steampowered.com/app/${game.appid}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute inset-0 z-10"
                                            ></a>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-10 text-gray-400">
                                        <p className="text-sm">No games found in library.</p>
                                    </div>
                                )}
                            </div>
                        </motion.section>

                        <motion.section variants={itemVariants} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-gray-100 dark:border-slate-700 rounded-3xl p-6 md:p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-3">
                                    <span className="text-3xl">🍿</span> Cinema Log
                                </h2>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-3 gap-3">
                                    {[1, 2, 3].map(i => <div key={i} className="aspect-[2/3] bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>)}
                                </div>
                            ) : movies.length > 0 ? (

                                <div className="space-y-10">
                                    {moviesByYear.map(([year, yearMovies]) => {
                                        const favoriteMovie = yearMovies.find(m => m.isFavorite);
                                        const otherMovies = yearMovies.filter(m => !m.isFavorite);

                                        return (
                                            <div key={year} className="relative">
                                                <h3 className="text-5xl font-black text-primary/20 dark:text-primary/20 absolute -top-10 -left-2 z-0 select-none pointer-events-none">
                                                    {year}
                                                </h3>
                                                <div className="relative z-10 pt-2">
                                                    {favoriteMovie && (
                                                        <a
                                                            href={`https://www.themoviedb.org/movie/${favoriteMovie.id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="block mb-4 group relative rounded-2xl overflow-hidden shadow-lg border-2 border-yellow-500/50 hover:border-yellow-400 transition-all cursor-pointer"
                                                        >
                                                            <div className="flex h-32 md:h-40 bg-gray-900">
                                                                <div className="w-24 md:w-28 flex-shrink-0">
                                                                    <img
                                                                        src={`https://image.tmdb.org/t/p/w500${favoriteMovie.poster_path}`}
                                                                        alt={favoriteMovie.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 p-4 flex flex-col justify-center relative overflow-hidden">
                                                                    <div className="absolute inset-0 bg-cover bg-center blur-sm opacity-30" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${favoriteMovie.backdrop_path})` }}></div>
                                                                    <div className="relative z-10">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="text-[10px] font-bold bg-yellow-500 text-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                                <i className="fas fa-trophy"></i> Best of {year}
                                                                            </span>
                                                                            <span className="text-yellow-400 text-xs">⭐ {favoriteMovie.myRating || favoriteMovie.vote_average.toFixed(1)}</span>
                                                                        </div>
                                                                        <h4 className="text-white font-bold text-lg md:text-xl leading-tight line-clamp-1 group-hover:text-yellow-300 transition-colors">{favoriteMovie.title}</h4>
                                                                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{favoriteMovie.overview}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    )}

                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                        {otherMovies.map((movie) => (
                                                            <a
                                                                key={movie.id}
                                                                href={`https://www.themoviedb.org/movie/${movie.id}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="group relative aspect-[2/3] bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
                                                                title={movie.title}
                                                            >
                                                                <img
                                                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                                                    alt={movie.title}
                                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                                                                    loading="lazy"
                                                                />
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                                                                    <span className="text-white text-xs font-bold mb-1">{movie.title}</span>
                                                                    <span className="text-yellow-400 text-[10px]">⭐ {movie.myRating ? movie.myRating : movie.vote_average.toFixed(1)}</span>
                                                                </div>
                                                            </a>
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