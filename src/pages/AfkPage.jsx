import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import { useFirebaseInit } from '../hooks/useFirebaseInit';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, limit } from 'firebase/firestore';

const SpotifyNowPlaying = lazy(() => import('../components/SpotifyNowPlaying'));
const SpotifyTopTracks = lazy(() => import('../components/SpotifyTopTracks'));

const AMBIENT_EQUALIZER_BARS = [42, 78, 58, 112, 72, 132, 88, 54, 104, 68, 122, 48];
const AMBIENT_FILM_FRAMES = Array.from({ length: 9 });

const useNearViewport = (rootMargin = '480px 0px') => {
    const ref = useRef(null);
    const [isNearViewport, setIsNearViewport] = useState(
        () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
    );

    useEffect(() => {
        const element = ref.current;
        if (!element) return undefined;

        if (!('IntersectionObserver' in window)) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setIsNearViewport(true);
                observer.disconnect();
            },
            { rootMargin },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [rootMargin]);

    return [ref, isNearViewport];
};

const AfkPage = () => {
    const DISCORD_ID = "717196208996876379";
    const { t } = useTranslation();
    const { dbFirestore } = useFirebaseInit('dbFirestore');

    const [movies, setMovies] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [loadingWatchlist, setLoadingWatchlist] = useState(true);
    const [discordData, setDiscordData] = useState(null);
    const [reactionPhase, setReactionPhase] = useState('idle');
    const [reactionMessage, setReactionMessage] = useState('');
    const [reactionTime, setReactionTime] = useState(null);
    const [bestReactionTime, setBestReactionTime] = useState(null);
    const [reactionHistory, setReactionHistory] = useState(() => {
        if (typeof window === 'undefined') return [];
        try {
            const stored = localStorage.getItem('afk-reaction-leaderboard');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const [reactionSaved, setReactionSaved] = useState(false);
    const [showMovieArchive, setShowMovieArchive] = useState(false);
    const reactionStartRef = useRef(null);
    const reactionTimerRef = useRef(null);
    const reactionAudioRef = useRef(null);
    const afkHeaderRef = useRef(null);
    const [isAfkHeaderVisible, setIsAfkHeaderVisible] = useState(true);
    const [musicSectionRef, shouldLoadMusic] = useNearViewport();
    const [cinemaSectionRef, shouldLoadCinema] = useNearViewport();
    const [reactionSectionRef, shouldLoadLeaderboard] = useNearViewport('320px 0px');
    const [watchlistSectionRef, shouldLoadWatchlist] = useNearViewport('360px 0px');

    useEffect(() => {
        const element = afkHeaderRef.current;
        if (!element) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => setIsAfkHeaderVisible(entry.isIntersecting),
            { threshold: 0.08 },
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const getReactionInitials = () => {
        const sourceName = 'Rafie Rojagat';
        const initials = sourceName
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => part[0])
            .join('')
            .slice(0, 4)
            .toUpperCase();

        return initials || 'RR';
    };

    const playSuccessTone = () => {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;

            if (!reactionAudioRef.current) {
                reactionAudioRef.current = new AudioContextClass();
            }

            const audioContext = reactionAudioRef.current;
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + 0.14);

            gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.06, audioContext.currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.18);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            console.error('Unable to play success tone:', error);
        }
    };

    useEffect(() => {
        if (!shouldLoadCinema) return undefined;

        const fetchOther = async () => {
            try {
                setLoadingMovies(true);
                const moviesRes = await fetch('/.netlify/functions/movies');
                const moviesText = await moviesRes.text();
                const moviesData = moviesText ? JSON.parse(moviesText) : [];
                const legacyMovies = Array.isArray(moviesData) ? moviesData : [];
                setMovies(legacyMovies);

                if (!dbFirestore) {
                    return;
                }

                const picksSnapshot = await getDocs(collection(dbFirestore, 'moviePicks'));
                const picks = picksSnapshot.docs
                    .map((entry) => ({ id: entry.id, ...entry.data() }))
                    .filter((item) => item.isPublished !== false)
                    .map((item) => ({
                        movieId: Number.parseInt(String(item.movieId), 10),
                        order: Number.isFinite(Number(item.order)) ? Number(item.order) : Number.MAX_SAFE_INTEGER,
                    }))
                    .filter((item) => Number.isFinite(item.movieId) && item.movieId > 0)
                    .sort((a, b) => a.order - b.order);

                if (picks.length === 0) {
                    setMovies(legacyMovies);
                    return;
                }

                const movieIds = picks.map((item) => item.movieId).join(',');
                const detailRes = await fetch(`/.netlify/functions/movies?ids=${movieIds}`);
                const detailText = await detailRes.text();
                const detailData = detailText ? JSON.parse(detailText) : [];
                const adminMovies = Array.isArray(detailData) ? detailData : [];

                if (adminMovies.length === 0) {
                    setMovies(legacyMovies);
                    return;
                }

                const adminIds = new Set(adminMovies.map((movie) => movie?.id).filter(Boolean));
                const mergedMovies = [
                    ...adminMovies,
                    ...legacyMovies.filter((movie) => !adminIds.has(movie?.id)),
                ];

                setMovies(mergedMovies);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoadingMovies(false);
            }
        };

        fetchOther();
        return undefined;
    }, [dbFirestore, shouldLoadCinema]);

    useEffect(() => {
        if (!shouldLoadWatchlist) return undefined;

        const fetchWatchlist = async () => {
            if (!dbFirestore) {
                setLoadingWatchlist(false);
                return;
            }

            try {
                setLoadingWatchlist(true);
                const snapshot = await getDocs(collection(dbFirestore, 'movieWatchlist'));
                const items = snapshot.docs
                    .map((entry) => ({ id: entry.id, ...entry.data() }))
                    .filter((item) => item.isPublished !== false)
                    .map((item) => ({
                        id: item.id,
                        movieId: Number.parseInt(String(item.movieId), 10),
                        note: item.note || '',
                        order: Number.isFinite(Number(item.order)) ? Number(item.order) : Number.MAX_SAFE_INTEGER,
                    }))
                    .filter((item) => Number.isFinite(item.movieId) && item.movieId > 0)
                    .sort((a, b) => a.order - b.order);

                if (items.length === 0) {
                    setWatchlist([]);
                    return;
                }

                const movieIds = items.map((item) => item.movieId).join(',');
                const detailRes = await fetch(`/.netlify/functions/movies?ids=${movieIds}`);
                const detailData = await detailRes.json();

                const movieMap = new Map(
                    (Array.isArray(detailData) ? detailData : [])
                        .filter((movie) => movie?.id)
                        .map((movie) => [movie.id, movie])
                );

                const enrichedWatchlist = items
                    .map((item) => {
                        const movie = movieMap.get(item.movieId);
                        if (!movie) return null;
                        return {
                            ...movie,
                            watchId: item.id,
                            note: item.note,
                            watchOrder: item.order,
                        };
                    })
                    .filter(Boolean);

                setWatchlist(enrichedWatchlist);
            } catch (error) {
                console.error('Error fetching watchlist:', error);
                setWatchlist([]);
            } finally {
                setLoadingWatchlist(false);
            }
        };

        fetchWatchlist();
        return undefined;
    }, [dbFirestore, shouldLoadWatchlist]);

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

    const getDiscordStatus = () => {
        if (!discordData) return { text: t('afk.offline'), color: 'bg-gray-500', isOnline: false, avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' };

        const statusColors = { online: 'bg-green-500', idle: 'bg-yellow-500', dnd: 'bg-red-500', offline: 'bg-gray-500' };
        const gameActivity = discordData.activities?.find(act => act.type === 0);

        if (gameActivity) {
            return {
                text: `${t('afk.playing')} ${gameActivity.name}`,
                color: 'bg-blue-500', isOnline: true,
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

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
    const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } } };

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
    const visibleMovieGroups = showMovieArchive ? moviesByYear : moviesByYear.slice(0, 2);

    useEffect(() => {
        return () => {
            if (reactionTimerRef.current) {
                clearTimeout(reactionTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        setReactionMessage(t('afk.reaction_game.message_ready'));
    }, [t]);

    useEffect(() => {
        try {
            localStorage.setItem('afk-reaction-leaderboard', JSON.stringify(reactionHistory.slice(0, 5)));
        } catch {
            // ignore storage issues
        }
    }, [reactionHistory]);

    useEffect(() => {
        if (!shouldLoadLeaderboard) return undefined;

        const loadReactionLeaderboard = async () => {
            if (!dbFirestore) return;

            try {
                const leaderboardQuery = query(
                    collection(dbFirestore, 'reactionScores'),
                    orderBy('score', 'asc'),
                    limit(5)
                );
                const snapshot = await getDocs(leaderboardQuery);
                const scores = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        score: data.score,
                        initials: typeof data.initials === 'string' ? data.initials : 'RR',
                        createdAtMs: data.createdAt?.toMillis?.() || null,
                    };
                }).filter((item) => Number.isFinite(item.score));

                if (scores.length > 0) {
                    setReactionHistory(scores);
                }
            } catch (error) {
                console.error('Error loading reaction leaderboard:', error);
            }
        };

        loadReactionLeaderboard();
        return undefined;
    }, [dbFirestore, shouldLoadLeaderboard]);

    const startReactionGame = () => {
        if (reactionTimerRef.current) {
            clearTimeout(reactionTimerRef.current);
        }

        setReactionPhase('waiting');
        setReactionTime(null);
        setReactionMessage(t('afk.reaction_game.message_wait'));

        const delay = 1500 + Math.floor(Math.random() * 2500);
        reactionTimerRef.current = setTimeout(() => {
            reactionStartRef.current = performance.now();
            setReactionPhase('go');
            setReactionMessage(t('afk.reaction_game.message_go'));
        }, delay);
    };

    const handleReactionClick = async () => {
        if (reactionPhase === 'waiting') {
            if (reactionTimerRef.current) {
                clearTimeout(reactionTimerRef.current);
            }
            setReactionPhase('idle');
            setReactionMessage(t('afk.reaction_game.message_early'));
            return;
        }

        if (reactionPhase === 'go') {
            const elapsed = Math.round(performance.now() - reactionStartRef.current);
            setReactionTime(elapsed);
            setBestReactionTime((prev) => (prev === null || elapsed < prev ? elapsed : prev));
            setReactionSaved(false);
            setReactionPhase('result');
            setReactionMessage(`${elapsed} ms`);
            playSuccessTone();

            const entry = {
                score: elapsed,
                createdAt: serverTimestamp(),
                source: 'afk-reaction-time',
                initials: getReactionInitials(),
            };

            if (dbFirestore) {
                try {
                    await addDoc(collection(dbFirestore, 'reactionScores'), entry);
                    setReactionSaved(true);

                    const leaderboardQuery = query(
                        collection(dbFirestore, 'reactionScores'),
                        orderBy('score', 'asc'),
                        limit(5)
                    );
                    const snapshot = await getDocs(leaderboardQuery);
                    const scores = snapshot.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            score: data.score,
                            initials: typeof data.initials === 'string' ? data.initials : 'RR',
                            createdAtMs: data.createdAt?.toMillis?.() || null,
                        };
                    }).filter((item) => Number.isFinite(item.score));
                    setReactionHistory(scores);
                } catch (error) {
                    console.error('Error saving reaction score to Firestore:', error);
                }
            } else {
                setReactionHistory((prev) => [
                    ...prev,
                    { score: elapsed, date: new Date().toISOString() }
                ].sort((a, b) => a.score - b.score).slice(0, 5));
                setReactionSaved(true);
            }

            return;
        }

        startReactionGame();
    };

    const getMovieRating = (movie) => {
        const rating = Number(movie?.myRating ?? movie?.vote_average);
        return Number.isFinite(rating) ? rating.toFixed(1) : '-';
    };

    const currentMoments = [
        {
            key: 'music',
            icon: 'fa-headphones',
            label: t('afk.afk_snapshot.musik.label'),
            description: t('afk.afk_snapshot.musik.desc'),
        },
        {
            key: 'game',
            icon: 'fa-gamepad',
            label: t('afk.afk_snapshot.game.label'),
            description: statusInfo.gameDetails?.name || t('afk.afk_snapshot.game.desc'),
        },
        {
            key: 'film',
            icon: 'fa-film',
            label: t('afk.afk_snapshot.film.label'),
            description: t('afk.afk_snapshot.film.desc'),
        },
    ];

    return (
        <PageTransition>
            <main className="bg-gray-50 dark:bg-dark min-h-screen pt-24 pb-20 transition-colors duration-300 relative overflow-hidden">
                <SEO title="AFK | Rafie Rojagat" description={t('afk.seo_desc')} url="https://rafierb.me/afk" />

                <div className="absolute inset-x-0 top-0 h-[500px] overflow-hidden pointer-events-none z-0" aria-hidden="true">
                    <div className={`afk-equalizer hidden md:flex ${isAfkHeaderVisible ? 'is-active' : ''}`}>
                        {AMBIENT_EQUALIZER_BARS.map((height, index) => (
                            <span
                                key={height + index}
                                className="afk-equalizer-bar"
                                style={{
                                    height: `${height}px`,
                                    '--afk-delay': `${index * -0.16}s`,
                                    '--afk-duration': `${1.8 + (index % 4) * 0.22}s`,
                                }}
                            />
                        ))}
                    </div>

                    <div className={`afk-film-strip hidden sm:grid ${isAfkHeaderVisible ? 'is-active' : ''}`}>
                        {AMBIENT_FILM_FRAMES.map((_, index) => (
                            <span key={index} className="afk-film-frame" />
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <header ref={afkHeaderRef} className="text-center max-w-3xl mx-auto pt-2 mb-9">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary mb-4" aria-hidden="true">
                            <i className="fas fa-gamepad text-lg" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-dark dark:text-white mb-2">/afk</h1>
                        <p className="text-gray-600 dark:text-gray-300 font-semibold text-base md:text-lg">{t('afk.subtitle')}</p>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto leading-relaxed">
                            {t('afk.intro_line1')} {t('afk.intro_line2')}
                        </p>
                    </header>

                    <motion.div className="space-y-16" variants={containerVariants} initial="hidden" animate="visible">
                        <motion.section variants={itemVariants} className="border-y border-slate-200 dark:border-slate-700 py-5">
                            <div className="grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.22em] text-primary font-bold">{t('afk.afk_snapshot.label')}</p>
                                    <h2 className="text-lg font-bold text-dark dark:text-white mt-1">{t('afk.afk_snapshot.title')}</h2>
                                </div>
                                <div className="grid sm:grid-cols-3 sm:divide-x divide-slate-200 dark:divide-slate-700">
                                    {currentMoments.map((moment) => (
                                        <div key={moment.key} className="flex items-center gap-3 py-2 sm:px-5 first:sm:pl-0 last:sm:pr-0 min-w-0">
                                            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-primary" aria-hidden="true">
                                                <i className={`fas ${moment.icon} text-sm`} />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{moment.label}</p>
                                                <p className="text-sm font-bold text-dark dark:text-white truncate">{moment.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.section>

                        <motion.section ref={musicSectionRef} variants={itemVariants} className="border-t border-slate-200 dark:border-slate-700 pt-8">
                            <div className="flex items-start gap-4 mb-7">
                                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400" aria-hidden="true">
                                    <i className="fab fa-spotify text-xl" />
                                </span>
                                <div>
                                    <h2 className="text-2xl font-bold text-dark dark:text-white">{t('afk.spotify')}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{t('afk.music_note')}</p>
                                </div>
                            </div>

                            {shouldLoadMusic ? (
                                <Suspense fallback={<div className="h-56 rounded-xl bg-slate-200/70 dark:bg-slate-800 animate-pulse" />}>
                                    <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">{t('afk.now_playing')}</h3>
                                            <SpotifyNowPlaying />
                                        </div>
                                        <SpotifyTopTracks />
                                    </div>
                                </Suspense>
                            ) : (
                                <div className="h-56 rounded-xl bg-slate-200/70 dark:bg-slate-800 animate-pulse" />
                            )}
                        </motion.section>

                        <motion.section ref={cinemaSectionRef} variants={itemVariants} className="border-t border-slate-200 dark:border-slate-700 pt-8">
                            <div className="flex items-start gap-4 mb-8">
                                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400" aria-hidden="true">
                                    <i className="fas fa-film text-lg" />
                                </span>
                                <div>
                                    <h2 className="text-2xl font-bold text-dark dark:text-white">{t('afk.cinema_log')}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{t('afk.cinema_note')}</p>
                                </div>
                            </div>

                            {loadingMovies ? (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {[0, 1].map((item) => <div key={item} className="h-72 rounded-xl bg-slate-200/70 dark:bg-slate-800 animate-pulse" />)}
                                </div>
                            ) : moviesByYear.length === 0 ? (
                                <div className="text-sm text-gray-500 dark:text-gray-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl px-5 py-8 text-center">
                                    {t('afk.no_movies')}
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-10">
                                        {visibleMovieGroups.map(([year, yearMovies]) => {
                                            const favorite = yearMovies.find((movie) => movie.isFavorite);
                                            const otherMovies = yearMovies.filter((movie) => !movie.isFavorite);

                                            return (
                                                <div key={year}>
                                                    <div className="flex items-baseline gap-3 mb-4">
                                                        <h3 className="text-3xl font-black text-dark dark:text-white">{year}</h3>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{yearMovies.length} {t('afk.films')}</span>
                                                    </div>
                                                    <div className={`grid gap-4 ${favorite ? 'lg:grid-cols-[1.35fr_1fr]' : ''}`}>
                                                        {favorite && (
                                                            <a href={`https://www.themoviedb.org/movie/${favorite.id}`} target="_blank" rel="noreferrer" className="relative aspect-video overflow-hidden rounded-xl group bg-slate-200 dark:bg-slate-800">
                                                                {(favorite.backdrop_path || favorite.poster_path) && (
                                                                    <img
                                                                        src={`https://image.tmdb.org/t/p/w780${favorite.backdrop_path || favorite.poster_path}`}
                                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                        loading="lazy"
                                                                        alt={favorite.title}
                                                                    />
                                                                )}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                                                <div className="absolute inset-x-0 bottom-0 p-4">
                                                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                                                                        <i className="fas fa-star" aria-hidden="true" />
                                                                        <span>{t('afk.best_year')} · {getMovieRating(favorite)}</span>
                                                                    </div>
                                                                    <h4 className="text-lg font-black text-white line-clamp-1">{favorite.title}</h4>
                                                                </div>
                                                            </a>
                                                        )}

                                                        {otherMovies.length > 0 && (
                                                            <div className={`grid grid-cols-3 gap-3 ${favorite ? '' : 'sm:grid-cols-4 lg:grid-cols-6'}`}>
                                                                {otherMovies.map((movie) => (
                                                                    <a key={movie.id} href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noreferrer" className="relative aspect-[2/3] overflow-hidden rounded-lg group bg-slate-200 dark:bg-slate-800">
                                                                        {movie.poster_path && (
                                                                            <img
                                                                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                                loading="lazy"
                                                                                alt={movie.title}
                                                                            />
                                                                        )}
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
                                                                        <div className="absolute inset-x-0 bottom-0 p-2 text-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                                            <p className="text-[11px] leading-tight font-bold text-white line-clamp-2">{movie.title}</p>
                                                                            <p className="text-[10px] text-amber-300 mt-1"><i className="fas fa-star mr-1" aria-hidden="true" />{getMovieRating(movie)}</p>
                                                                        </div>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {moviesByYear.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowMovieArchive((current) => !current)}
                                            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-bold text-dark dark:text-white hover:border-primary hover:text-primary transition-colors"
                                            aria-expanded={showMovieArchive}
                                        >
                                            <i className={`fas ${showMovieArchive ? 'fa-chevron-up' : 'fa-box-archive'}`} aria-hidden="true" />
                                            {showMovieArchive ? t('afk.hide_archive') : t('afk.show_archive', { count: moviesByYear.length - 2 })}
                                        </button>
                                    )}
                                </>
                            )}
                        </motion.section>

                        <motion.section variants={itemVariants} className="border-y border-slate-200 dark:border-slate-700 py-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="relative h-12 w-12 flex-none self-start">
                                    <img src={statusInfo.avatar} alt="Discord avatar" className="h-12 w-12 rounded-full object-cover bg-slate-200 dark:bg-slate-800" />
                                    <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-gray-50 dark:border-dark ${statusInfo.color}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-bold">{t('afk.status_check')}</p>
                                    <p className="font-bold text-dark dark:text-white truncate">{statusInfo.text}</p>
                                    {statusInfo.gameDetails && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{statusInfo.gameDetails.details || statusInfo.gameDetails.state}</p>
                                    )}
                                </div>
                                <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 sm:ml-auto">
                                    <i className="fab fa-discord text-indigo-500 text-base" aria-hidden="true" />
                                    <span>{statusInfo.isOnline ? t('afk.currently_live') : t('afk.chilling')}</span>
                                </div>
                            </div>
                        </motion.section>

                        <motion.section ref={reactionSectionRef} variants={itemVariants} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-5 md:p-7 shadow-sm">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
                                <div className="flex items-start gap-4">
                                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" aria-hidden="true">
                                        <i className="fas fa-bolt" />
                                    </span>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 font-bold mb-1">{t('afk.playful_break')}</p>
                                        <h2 className="text-2xl font-bold text-dark dark:text-white">{t('afk.reaction_game.title')}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('afk.reaction_game.subtitle')}</p>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-right">
                                    <p>{t('afk.reaction_game.best')}: <span className="font-bold text-dark dark:text-white">{bestReactionTime !== null ? `${bestReactionTime} ms` : t('afk.no_score')}</span></p>
                                    {reactionTime !== null && <p className="mt-1">{t('afk.reaction_game.last')}: <span className="font-bold text-dark dark:text-white">{reactionTime} ms</span></p>}
                                </div>
                            </div>

                            <div className="grid gap-7 md:grid-cols-[1.1fr_0.9fr] md:items-start">
                                <div className="flex flex-col items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={handleReactionClick}
                                        className={`w-full min-h-[120px] rounded-xl border-2 px-4 font-black text-lg md:text-xl transition-colors duration-200 ${
                                            reactionPhase === 'go'
                                                ? 'bg-green-500 border-green-400 text-white'
                                                : reactionPhase === 'waiting'
                                                    ? 'bg-red-500 border-red-400 text-white'
                                                    : 'bg-slate-900 dark:bg-slate-700 border-slate-700 dark:border-slate-600 text-white hover:bg-slate-800'
                                        }`}
                                    >
                                        {reactionPhase === 'idle' && t('afk.reaction_game.start_btn')}
                                        {reactionPhase === 'waiting' && t('afk.reaction_game.waiting_btn')}
                                        {reactionPhase === 'go' && t('afk.reaction_game.go_btn')}
                                        {reactionPhase === 'result' && t('afk.reaction_game.retry_btn')}
                                    </button>

                                    <AnimatePresence mode="wait">
                                        <motion.p key={reactionMessage} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="min-h-5 text-sm text-gray-600 dark:text-gray-300 text-center">
                                            {reactionMessage}
                                        </motion.p>
                                    </AnimatePresence>

                                    <AnimatePresence>
                                        {reactionSaved && (
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-bold text-green-600 dark:text-green-400">
                                                {t('afk.reaction_game.message_saved')}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex flex-wrap justify-center gap-3">
                                        <button type="button" onClick={startReactionGame} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
                                            <i className="fas fa-rotate-right" aria-hidden="true" />{t('afk.reaction_game.restart_btn')}
                                        </button>
                                        <button type="button" onClick={() => { if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current); setReactionPhase('idle'); setReactionTime(null); setReactionMessage(t('afk.reaction_game.message_ready')); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-bold text-dark dark:text-white hover:border-primary hover:text-primary transition-colors">
                                            <i className="fas fa-eraser" aria-hidden="true" />{t('afk.reaction_game.reset_btn')}
                                        </button>
                                    </div>
                                </div>

                                <div className="md:border-l md:border-slate-200 md:dark:border-slate-700 md:pl-7">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-bold mb-3">{t('afk.reaction_game.leaderboard.title')}</p>
                                    {reactionHistory.length === 0 ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">{t('afk.reaction_game.leaderboard.empty')}</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {reactionHistory.map((entry, index) => (
                                                <motion.div key={`${entry.id || entry.date || entry.score}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: index * 0.03 }} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-black ${index === 0 ? 'bg-amber-400 text-black' : 'bg-slate-100 dark:bg-slate-700 text-dark dark:text-white'}`}>
                                                            {entry.initials || 'RR'}
                                                        </span>
                                                        <span className="text-sm font-bold text-dark dark:text-white">#{index + 1}</span>
                                                        {index === 0 && <i className="fas fa-crown text-amber-500 text-xs" aria-label={t('afk.reaction_game.leaderboard.champion')} />}
                                                    </div>
                                                    <span className="text-sm font-mono text-primary font-bold">{entry.score} ms</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.section>

                        <motion.section ref={watchlistSectionRef} variants={itemVariants} className="border-t border-slate-200 dark:border-slate-700 pt-8">
                            <div className="flex items-start gap-4 mb-7">
                                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400" aria-hidden="true">
                                    <i className="fas fa-bookmark" />
                                </span>
                                <div>
                                    <h2 className="text-2xl font-bold text-dark dark:text-white">{t('afk.want_to_watch')}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{t('afk.watchlist_note')}</p>
                                </div>
                            </div>

                            {loadingWatchlist ? (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {[0, 1].map((item) => <div key={item} className="h-36 rounded-xl bg-slate-200/70 dark:bg-slate-800 animate-pulse" />)}
                                </div>
                            ) : watchlist.length === 0 ? (
                                <div className="text-sm text-gray-500 dark:text-gray-400 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 px-5 py-8 text-center">
                                    {t('afk.no_watchlist')}
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {watchlist.map((movie, index) => (
                                        <a key={movie.watchId || movie.id} href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noreferrer" className="group flex gap-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3 hover:border-primary/50 transition-colors">
                                            {movie.poster_path && (
                                                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} className="w-20 h-28 rounded-lg object-cover" loading="lazy" alt={movie.title} />
                                            )}
                                            <div className="min-w-0 py-1">
                                                <p className="text-xs uppercase tracking-wider text-primary font-bold mb-1">#{index + 1}</p>
                                                <h4 className="text-base md:text-lg font-extrabold text-dark dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    <i className="fas fa-star text-amber-500 mr-1" aria-hidden="true" />{getMovieRating(movie)}
                                                    {movie.release_date ? ` · ${movie.release_date.split('-')[0]}` : ''}
                                                </p>
                                                {movie.note && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{movie.note}</p>}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </motion.section>
                    </motion.div>
                </div>
            </main>
        </PageTransition>
    );
};

export default AfkPage;
