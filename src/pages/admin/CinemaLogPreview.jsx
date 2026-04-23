import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import PageTransition from '../../components/PageTransition';

const CinemaLogPreview = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/.netlify/functions/movies');
        const data = await response.json();
        if (Array.isArray(data)) setMovies(data);
      } catch (error) {
        console.error('Error loading cinema log preview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const groupMoviesByYear = (movieList) => {
    const grouped = {};

    movieList.forEach((movie) => {
      if (!movie.release_date) return;
      const year = movie.release_date.split('-')[0];
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(movie);
    });

    return Object.entries(grouped).sort((a, b) => b[0] - a[0]);
  };

  const moviesByYear = groupMoviesByYear(movies);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-dark pt-24 pb-20 transition-colors duration-300 relative overflow-x-hidden">
        <SEO
          title="Cinema Log Preview | Rafie Rojagat"
          description="Preview of the Cinema Log layout used on the AFK page."
          url="https://rafie-dev.netlify.app/admin/cinema-log-preview"
        />

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={{ x: [-100, 100, -100], y: [-50, 50, -50], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block text-6xl mb-4 filter drop-shadow-lg"
            >
              🍿
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-dark dark:text-white mb-2 tracking-tight">
              Cinema Log
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
              A preview of the original AFK cinema log layout, kept close to the live page so you can review styling safely.
            </p>
            <div className="mt-5 flex justify-center">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-slate-600 text-sm font-semibold text-dark dark:text-white hover:border-primary hover:text-primary transition"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          <motion.section
            className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 rounded-[2.5rem] p-6 md:p-8 shadow-xl hover:shadow-yellow-500/10 transition-all duration-500 h-[640px] flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6 flex-shrink-0 gap-4">
              <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-3">
                <span className="text-3xl filter drop-shadow-md">🍿</span> Cinema Log
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full whitespace-nowrap">
                Preview Mode
              </span>
            </div>

            {loading ? (
              <div className="animate-pulse h-full bg-gray-200 dark:bg-slate-700 rounded-xl" />
            ) : (
              <div className="space-y-10 flex-1 overflow-y-auto scrollbar-hide pr-2 min-h-0">
                {moviesByYear.map(([year, yearMovies]) => {
                  const fav = yearMovies.find((movie) => movie.isFavorite);
                  const others = yearMovies.filter((movie) => !movie.isFavorite);

                  return (
                    <div key={year} className="relative">
                      <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm py-2 mb-4 border-b border-gray-100 dark:border-slate-700/50">
                        <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                          {year}
                        </h3>
                      </div>

                      {fav && (
                        <a
                          href={`https://www.themoviedb.org/movie/${fav.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block mb-6 relative rounded-2xl overflow-hidden aspect-video group cursor-pointer shadow-lg border border-yellow-500/20"
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w500${fav.backdrop_path}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={fav.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                          <div className="absolute bottom-0 left-0 p-5 w-full">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg shadow-yellow-500/20 uppercase tracking-wide">
                                Best of Year
                              </span>
                              <span className="text-yellow-400 text-xs font-bold">⭐ {fav.myRating || fav.vote_average.toFixed(1)}</span>
                            </div>
                            <h4 className="text-white font-black text-xl leading-tight line-clamp-1 group-hover:text-yellow-300 transition-colors">
                              {fav.title}
                            </h4>
                          </div>
                        </a>
                      )}

                      <div className="grid grid-cols-3 gap-4">
                        {others.map((movie) => (
                          <a
                            key={movie.id}
                            href={`https://www.themoviedb.org/movie/${movie.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="relative aspect-[2/3] rounded-xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                              alt={movie.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-center">
                              <span className="text-white text-[11px] font-bold line-clamp-2 leading-tight">{movie.title}</span>
                              <span className="text-yellow-400 text-[10px] font-bold mt-1">⭐ {movie.myRating || movie.vote_average.toFixed(1)}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </PageTransition>
  );
};

export default CinemaLogPreview;