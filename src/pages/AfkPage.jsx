import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying';
import SpotifyTopTracks from '../components/SpotifyTopTracks';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import { useFirebaseInit } from '../hooks/useFirebaseInit';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, limit } from 'firebase/firestore';

const AfkPage = () => {
    const DISCORD_ID = "717196208996876379";
    const { t } = useTranslation();
    const { dbFirestore } = useFirebaseInit('dbFirestore');

    const [games, setGames] = useState([]);
    const [recentGames, setRecentGames] = useState([]);
    const [steamUser, setSteamUser] = useState(null);
    const [movies, setMovies] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
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
    const reactionStartRef = useRef(null);
    const reactionTimerRef = useRef(null);
    const reactionAudioRef = useRef(null);

    const getReactionInitials = () => {
        const sourceName = steamUser?.personaname || 'Rafie Rojagat';
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
        const fetchSteamData = async () => {
            try {
                setLoading(true);
                const steamRes = await fetch('/.netlify/functions/steam');
                const steamData = await steamRes.json();
                if (steamData.games) setGames(steamData.games);
                else setGames([]);
                if (steamData.recent) setRecentGames(steamData.recent);
                else setRecentGames([]);
                if (steamData.user) setSteamUser(steamData.user);
            } catch (error) {
                console.error("Error fetching steam data:", error);
                setGames([]);
                setRecentGames([]);
                setSteamUser(null);
            } finally {
                setLoading(false);
            }
        };

        const fetchOther = async () => {
            try {
                const moviesRes = await fetch('/.netlify/functions/movies');
                const moviesData = await moviesRes.json();
                if (Array.isArray(moviesData)) setMovies(moviesData);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        fetchSteamData();
        fetchOther();
    }, []);

    const retrySteam = async () => {
        try {
            setLoading(true);
            const steamRes = await fetch('/.netlify/functions/steam');
            const steamData = await steamRes.json();
            if (steamData.games) setGames(steamData.games);
            if (steamData.recent) setRecentGames(steamData.recent);
            if (steamData.user) setSteamUser(steamData.user);
        } catch (error) {
            console.error('Retry steam error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (!dbFirestore) return;

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
    }, [dbFirestore]);

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
        if (!discordData) return { text: t('afk.offline'), color: 'bg-gray-500', isOnline: false, avatar: steamUser?.avatar };

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

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } } };
    const MusicBars = () => (<div className="flex gap-1 items-end h-4"> {[1, 2, 3, 4].map((bar) => (<motion.div key={bar} className="w-1 bg-[#1DB954]" animate={{ height: [4, 16, 8, 12, 4] }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: bar * 0.1 }} />))} </div>);

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
    }, [dbFirestore]);

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

    return (
        <PageTransition>
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
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
                            {t('afk.intro_line1')}
                            {' '}
                            {t('afk.intro_line2')}
                        </p>
                    </div>

                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                        className="mb-12 rounded-[2rem] border border-white/30 dark:border-slate-700/60 bg-white/55 dark:bg-slate-800/55 backdrop-blur-xl shadow-lg p-6 md:p-7"
                    >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-2">{t('afk.afk_snapshot.label')}</p>
                                <h2 className="text-2xl font-bold text-dark dark:text-white">{t('afk.afk_snapshot.title')}</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto md:min-w-[480px]">
                                <div className="rounded-2xl bg-white/70 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 px-4 py-3">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t('afk.afk_snapshot.musik.label')}</p>
                                    <p className="text-sm font-bold text-dark dark:text-white mt-1">{t('afk.afk_snapshot.musik.desc')}</p>
                                </div>
                                <div className="rounded-2xl bg-white/70 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 px-4 py-3">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t('afk.afk_snapshot.game.label')}</p>
                                    <p className="text-sm font-bold text-dark dark:text-white mt-1">{t('afk.afk_snapshot.game.desc')}</p>
                                </div>
                                <div className="rounded-2xl bg-white/70 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 px-4 py-3">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t('afk.afk_snapshot.film.label')}</p>
                                    <p className="text-sm font-bold text-dark dark:text-white mt-1">{t('afk.afk_snapshot.film.desc')}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

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

                        <motion.section variants={itemVariants} className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 rounded-[2.5rem] p-6 md:p-8 shadow-xl hover:shadow-cyan-500/10 transition-all duration-500">
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-3">
                                        <span className="text-3xl filter drop-shadow-md">⚡</span> {t('afk.reaction_game.title')}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('afk.reaction_game.subtitle')}</p>
                                </div>
                                <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                                    {bestReactionTime !== null ? <p>{t('afk.reaction_game.best')}: <span className="font-bold text-dark dark:text-white">{bestReactionTime} ms</span></p> : <p>{t('afk.reaction_game.best')}: belum ada</p>}
                                    {reactionTime !== null && <p className="mt-1">{t('afk.reaction_game.last')}: <span className="font-bold text-dark dark:text-white">{reactionTime} ms</span></p>}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <button
                                    onClick={handleReactionClick}
                                    className={`w-full max-w-md min-h-[150px] rounded-[2rem] border-2 font-black text-xl md:text-2xl transition-all duration-200 ${
                                        reactionPhase === 'go'
                                            ? 'bg-green-500 border-green-400 text-white shadow-2xl shadow-green-500/30'
                                            : reactionPhase === 'waiting'
                                                ? 'bg-red-500 border-red-400 text-white shadow-2xl shadow-red-500/30'
                                                : 'bg-slate-900 dark:bg-slate-700 border-slate-600 text-white hover:scale-[1.01]'
                                    }`}
                                >
                                    {reactionPhase === 'idle' && t('afk.reaction_game.start_btn')}
                                    {reactionPhase === 'waiting' && t('afk.reaction_game.waiting_btn')}
                                    {reactionPhase === 'go' && t('afk.reaction_game.go_btn')}
                                    {reactionPhase === 'result' && t('afk.reaction_game.retry_btn')}
                                </button>

                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={reactionMessage}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        className="text-sm text-gray-600 dark:text-gray-300 text-center max-w-xl"
                                    >
                                        {reactionMessage}
                                    </motion.p>
                                </AnimatePresence>

                                <AnimatePresence>
                                    {reactionSaved && (
                                        <motion.p
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="text-xs font-bold text-green-600 dark:text-green-400"
                                        >
                                            Skor berhasil disimpan.
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center gap-3">
                                    <button onClick={startReactionGame} className="px-5 py-2.5 rounded-full bg-primary text-white font-bold hover:shadow-lg transition-all">{t('afk.reaction_game.restart_btn')}</button>
                                    <button onClick={() => { if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current); setReactionPhase('idle'); setReactionTime(null); setReactionMessage(t('afk.reaction_game.message_ready')); }} className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 text-dark dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">{t('afk.reaction_game.reset_btn')}</button>
                                </div>

                                <div className="w-full max-w-xl mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-700/40 px-4 py-3 text-center">
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500">{t('afk.reaction_game.status')}</p>
                                        <p className="mt-1 text-sm font-bold text-dark dark:text-white">
                                            {reactionPhase === 'go' ? t('afk.reaction_game.status_go') : reactionPhase === 'waiting' ? t('afk.reaction_game.status_wait') : reactionPhase === 'result' ? t('afk.reaction_game.status_result') : t('afk.reaction_game.status_ready')}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-700/40 px-4 py-3 text-center">
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500">{t('afk.reaction_game.best')}</p>
                                        <p className="mt-1 text-sm font-bold text-dark dark:text-white">{bestReactionTime !== null ? `${bestReactionTime} ms` : '-'}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-700/40 px-4 py-3 text-center">
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500">{t('afk.reaction_game.last')}</p>
                                        <p className="mt-1 text-sm font-bold text-dark dark:text-white">{reactionTime !== null ? `${reactionTime} ms` : '-'}</p>
                                    </div>
                                </div>

                                <div className="w-full max-w-xl mt-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/30 px-4 py-4">
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 font-bold">{t('afk.reaction_game.leaderboard.title')}</p>
                                    </div>
                                    {reactionHistory.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">{t('afk.reaction_game.leaderboard.empty')}</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {reactionHistory.map((entry, index) => (
                                                <motion.div
                                                    key={`${entry.id || entry.date || entry.score}-${index}`}
                                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    transition={{ duration: 0.25, delay: index * 0.04 }}
                                                    className={`flex items-center justify-between rounded-xl px-3 py-2 border shadow-sm ${
                                                        index === 0
                                                            ? 'bg-amber-50/90 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
                                                            : index === 1
                                                                ? 'bg-slate-100/80 dark:bg-slate-700/50 border-slate-300 dark:border-slate-500/40'
                                                                : index === 2
                                                                    ? 'bg-orange-50/90 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30'
                                                                    : 'bg-white/70 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                                                            index === 0
                                                                ? 'bg-amber-400 text-black'
                                                                : index === 1
                                                                    ? 'bg-slate-400 text-white'
                                                                    : index === 2
                                                                        ? 'bg-orange-400 text-black'
                                                                        : 'bg-primary/10 text-primary'
                                                        }`}>
                                                            {entry.initials || 'RR'}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-bold text-dark dark:text-white">#{index + 1}</span>
                                                                {index < 3 && (
                                                                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                                                                        {index === 0 ? t('afk.reaction_game.leaderboard.gold') : index === 1 ? t('afk.reaction_game.leaderboard.silver') : t('afk.reaction_game.leaderboard.bronze')}
                                                                    </span>
                                                                )}
                                                                {index === 0 && (
                                                                    <span className="inline-flex items-center justify-center rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-black text-amber-500 dark:text-amber-300">
                                                                        <i className="fas fa-crown mr-1"></i> {t('afk.reaction_game.leaderboard.champion')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{t('afk.reaction_game.leaderboard.desc')}</p>
                                                        </div>
                                                    </div>
                                                    <motion.span
                                                        key={entry.score}
                                                        initial={{ scale: 0.95 }}
                                                        animate={{ scale: [1, 1.06, 1] }}
                                                        transition={{ duration: 0.35 }}
                                                        className="text-sm font-mono text-primary font-bold"
                                                    >
                                                        {entry.score} ms
                                                    </motion.span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.section>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            <motion.section variants={itemVariants} className="bg-white/65 dark:bg-slate-800/55 backdrop-blur-md border border-white/30 dark:border-slate-700/50 rounded-[2.5rem] p-6 md:p-8 h-full shadow-xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col">
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
                                                        <div className="w-24 h-24 rounded-xl bg-blue-500 flex items-center justify-center text-4xl shadow-lg">🎮</div>
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
                                    ) : (<p className="text-sm text-gray-400 italic">{t('afk.no_recent_games')}</p>)}
                                </div>
                            </motion.section>

                            <motion.section variants={itemVariants} className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/25 dark:border-slate-700/50 rounded-[2.5rem] p-5 md:p-7 shadow-lg hover:shadow-yellow-500/10 transition-all duration-500 flex flex-col h-[540px] lg:h-[560px]">
                                <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-3 mb-6 flex-shrink-0">
                                    <span className="text-3xl filter drop-shadow-md">🍿</span> {t('afk.cinema_log')}
                                </h2>
                                {loading ? (<div className="animate-pulse h-full bg-gray-200 dark:bg-slate-700 rounded-xl"></div>) : (
                                    <div className="space-y-10 flex-1 overflow-y-auto scrollbar-hide pr-2 min-h-0">
                                        {moviesByYear.map(([year, yearMovies]) => {
                                            const fav = yearMovies.find(m => m.isFavorite);
                                            const others = yearMovies.filter(m => !m.isFavorite);
                                            return (
                                                <div key={year} className="relative">
                                                    <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm py-2 mb-4 border-b border-gray-100 dark:border-slate-700/50">
                                                        <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{year}</h3>
                                                    </div>
                                                    {fav && (
                                                        <a href={`https://www.themoviedb.org/movie/${fav.id}`} target="_blank" rel="noreferrer" className="block mb-6 relative rounded-2xl overflow-hidden aspect-video group cursor-pointer shadow-lg border border-yellow-500/20">
                                                            <img src={`https://image.tmdb.org/t/p/w500${fav.backdrop_path}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={fav.title} />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                                                            <div className="absolute bottom-0 left-0 p-5 w-full">
                                                                <div className="flex items-center gap-2 mb-2">
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

                        <motion.section variants={itemVariants} className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 rounded-[2.5rem] p-6 md:p-8 shadow-xl hover:shadow-fuchsia-500/10 transition-all duration-500">
                            <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-3 mb-5">
                                <span className="text-3xl filter drop-shadow-md">📌</span> {t('afk.want_to_watch')}
                            </h2>

                            {loadingWatchlist ? (
                                <div className="animate-pulse h-32 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                            ) : watchlist.length === 0 ? (
                                <div className="text-sm text-gray-500 dark:text-gray-400 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 px-4 py-6 text-center">
                                    {t('afk.no_watchlist')}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {watchlist.map((movie, index) => (
                                        <a
                                            key={movie.watchId || movie.id}
                                            href={`https://www.themoviedb.org/movie/${movie.id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex gap-4 p-3 rounded-2xl bg-white/70 dark:bg-slate-700/40 border border-gray-200 dark:border-slate-600/70 hover:border-primary/40 transition"
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                                className="w-20 h-28 rounded-lg object-cover shadow-sm"
                                                loading="lazy"
                                                alt={movie.title}
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs uppercase tracking-wider text-primary font-bold mb-1">
                                                    #{index + 1} Watchlist
                                                </p>
                                                <h4 className="text-base md:text-lg font-extrabold text-dark dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                                                    {movie.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    ⭐ {movie.vote_average?.toFixed?.(1) ?? '-'}
                                                    {movie.release_date ? ` • ${movie.release_date.split('-')[0]}` : ''}
                                                </p>
                                                {movie.note && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{movie.note}</p>
                                                )}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </motion.section>

                        <motion.section variants={itemVariants} className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 rounded-[2.5rem] p-8 md:p-10 shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest flex items-center gap-3">
                                    <i className="fab fa-steam text-2xl"></i> {t('afk.steam_library')}
                                </h3>
                                <div className="h-[2px] flex-grow ml-6 bg-gray-200 dark:bg-slate-700/50 rounded-full"></div>
                            </div>

                            {loading ? (
                                <div className="py-8 text-center text-gray-500">Loading Steam library…</div>
                            ) : games.length === 0 ? (
                                <div className="py-8 text-center text-gray-500">
                                    <p className="mb-3">Tidak ada data Steam yang dapat ditampilkan.</p>
                                    <p className="text-sm mb-4">Kemungkinan penyebab: profil Steam Anda disetel privat, API key tidak aktif, atau fungsi Netlify tidak berjalan secara lokal.</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={retrySteam} className="px-4 py-2 bg-primary text-white rounded-md">Coba lagi</button>
                                        <a href={steamUser?.profileurl || `https://steamcommunity.com/profiles/${import.meta.env.VITE_STEAM_ID || ''}`} target="_blank" rel="noreferrer" className="px-4 py-2 border rounded-md">Lihat profil Steam</a>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {games.slice(0, 18).map((game) => (
                                        <div key={game.appid} className="flex items-center gap-3 p-3 rounded-2xl bg-white/45 dark:bg-slate-700/35 hover:bg-white/70 dark:hover:bg-slate-700/60 border border-transparent hover:border-gray-200 dark:hover:border-slate-600 transition-all cursor-default shadow-sm hover:shadow-md">
                                            <img src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt={game.name} />
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold text-dark dark:text-white truncate">{game.name}</p>
                                                <p className="text-xs text-gray-500 font-mono">{Math.floor(game.playtime_forever / 60)} {t('afk.hours')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

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
        </PageTransition>
    );
};

export default AfkPage;