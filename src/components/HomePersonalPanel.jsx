import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Headphones,
  MapPin,
  Play,
  RefreshCw,
  X,
} from 'lucide-react';
import { currentRotationFallback } from '../data/currentRotation';

const normalizeTracks = (items) => items
  .slice(0, 3)
  .map((track, index) => ({
    id: track.id,
    title: track.name,
    artist: track.artists?.map((artist) => artist.name).join(', '),
    album: track.album?.name,
    image: track.album?.images?.[0]?.url || currentRotationFallback[index]?.image,
    url: track.external_urls?.spotify,
  }))
  .filter((track) => track.id && track.title && track.artist && track.url);

const HomePersonalPanel = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const hasRequestedTracks = useRef(false);
  const [tracks, setTracks] = useState(currentRotationFallback);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const refreshTracks = useCallback(async (signal) => {
    setIsRefreshing(true);

    if (import.meta.env.DEV) {
      setTracks(currentRotationFallback);
      setIsRefreshing(false);
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/spotify-top?time_range=medium_term', { signal });
      const contentType = response.headers.get('content-type') || '';

      if (!response.ok || !contentType.includes('application/json')) {
        throw new Error('Spotify data is unavailable');
      }

      const data = await response.json();
      const nextTracks = Array.isArray(data.items) ? normalizeTracks(data.items) : [];

      if (nextTracks.length !== 3) {
        throw new Error('Spotify returned incomplete track data');
      }

      setTracks(nextTracks);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setTracks(currentRotationFallback);
      }
    } finally {
      if (!signal?.aborted) {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const controller = new AbortController();

    const requestTracks = () => {
      if (hasRequestedTracks.current) return;
      hasRequestedTracks.current = true;
      refreshTracks(controller.signal);
    };

    if (!section || !('IntersectionObserver' in window)) {
      requestTracks();
      return () => controller.abort();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestTracks();
          observer.disconnect();
        }
      },
      { rootMargin: '320px 0px' },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      controller.abort();
    };
  }, [refreshTracks]);

  return (
    <section ref={sectionRef} data-home-personal-panel className="container mx-auto px-4 py-14 md:py-20">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            {t('home.beyond.eyebrow')}
          </p>
          <h2 className="mb-3 text-3xl font-bold text-dark dark:text-white">
            {t('home.beyond.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('home.beyond.subtitle')}
          </p>
        </div>

        <Link
          to="/afk"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t('home.beyond.view_afk')}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
        <article className="flex min-h-[390px] flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-950 p-5 text-white shadow-sm md:p-7">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-400 text-slate-950">
                <Headphones className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {t('home.beyond.music_label')}
                </p>
                <p className="text-sm leading-5 text-slate-400">{t('home.beyond.music_period')}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => refreshTracks()}
              disabled={isRefreshing}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-700 text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/50 disabled:cursor-wait disabled:opacity-60"
              aria-label={t('home.beyond.refresh')}
              title={t('home.beyond.refresh')}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin motion-reduce:animate-none' : ''}`} aria-hidden="true" />
            </button>
          </div>

          <div className="mb-7 flex items-center">
            {tracks.map((track, index) => (
              <a
                key={track.id}
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative block h-24 w-24 overflow-hidden rounded-md border-2 border-slate-950 shadow-lg transition-transform duration-200 hover:-translate-y-1 focus:z-10 focus:outline-none focus:ring-2 focus:ring-emerald-300 sm:h-28 sm:w-28 ${index > 0 ? '-ml-5' : ''}`}
                aria-label={`${t('home.beyond.open_spotify')}: ${track.title}`}
                title={`${track.title} - ${track.artist}`}
                style={{ zIndex: tracks.length - index }}
              >
                <img
                  src={track.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  width="112"
                  height="112"
                />
              </a>
            ))}
          </div>

          <div className="mt-auto divide-y divide-slate-800 border-y border-slate-800">
            {tracks.map((track, index) => (
              <div
                key={`${track.id}-details`}
                className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-3 py-3"
              >
                <span className="text-xs font-semibold text-slate-500">0{index + 1}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{track.title}</span>
                  <span className="block truncate text-xs text-slate-400">{track.artist}</span>
                </span>
                <span className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTrack(track)}
                    aria-pressed={selectedTrack?.id === track.id}
                    aria-label={t('home.beyond.play_track', { title: track.title })}
                    title={t('home.beyond.play_track', { title: track.title })}
                    className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300/50 ${
                      selectedTrack?.id === track.id
                        ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                        : 'border-slate-700 text-slate-300 hover:border-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  </button>
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-900 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
                    aria-label={`${t('home.beyond.open_spotify')}: ${track.title}`}
                    title={t('home.beyond.open_spotify')}
                  >
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </span>
              </div>
            ))}
          </div>

          {selectedTrack && (
            <div className="mt-5 border-t border-slate-800 pt-5">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    {t('home.beyond.player_ready')}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-white">
                    {selectedTrack.title} <span className="font-normal text-slate-400">- {selectedTrack.artist}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTrack(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
                  aria-label={t('home.beyond.close_player')}
                  title={t('home.beyond.close_player')}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <iframe
                key={selectedTrack.id}
                title={`${t('home.beyond.player_title')}: ${selectedTrack.title}`}
                src={`https://open.spotify.com/embed/track/${encodeURIComponent(selectedTrack.id)}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                className="block w-full rounded-md border-0 bg-slate-900"
              />
            </div>
          )}

          <p className="sr-only" aria-live="polite">
            {isRefreshing ? t('home.beyond.refreshing') : t('home.beyond.loaded')}
          </p>
        </article>

        <Link
          to="/contact"
          className="group relative min-h-[390px] overflow-hidden rounded-lg border border-gray-200 bg-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900"
          aria-label={`${t('home.beyond.location')}. ${t('home.beyond.contact')}`}
        >
          <img
            src="/images/home/jakarta-map.jpg"
            alt=""
            loading="lazy"
            decoding="async"
            width="1200"
            height="800"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
          />

          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-md border border-white/80 bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-700 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-200">
            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            {t('home.beyond.location_label')}
          </span>

          <span className="absolute inset-x-0 bottom-0 border-t border-white/70 bg-white/95 p-5 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/95 md:p-6">
            <span className="mb-2 flex items-start justify-between gap-5">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{t('home.beyond.location')}</span>
              <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-blue-600 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-blue-400" aria-hidden="true" />
            </span>
            <span className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
              <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {t('home.beyond.availability')}
            </span>
            <span className="mt-4 block text-sm font-semibold text-blue-600 dark:text-blue-400">
              {t('home.beyond.contact')}
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
};

export default HomePersonalPanel;
