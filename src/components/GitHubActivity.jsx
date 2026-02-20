import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const GitHubActivity = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Rafie1715');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('GitHub API Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border-2 border-red-300 dark:border-red-700 overflow-hidden shadow-lg p-8">
          <div className="text-center">
            <div className="mb-4">
              <i className="fas fa-circle-xmark text-red-500 dark:text-red-400 text-6xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-red-900 dark:text-red-200 mb-2">Unable to Load GitHub Stats</h3>
            <p className="text-red-800 dark:text-red-300 mb-6">
              There was an issue fetching from the GitHub API. This might be due to rate limiting or connectivity issues.
            </p>
            <a
              href="https://github.com/Rafie1715"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              <i className="fab fa-github"></i> Visit GitHub Profile
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        {/* GitHub Stats Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-300 dark:border-slate-600 overflow-hidden shadow-2xl">
          <div className="p-6">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gray-200 dark:border-slate-700">
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-slate-700 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-300 dark:bg-slate-700 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
              </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-5 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse">
                  <div className="h-4 bg-gray-400 dark:bg-slate-600 rounded w-20 mb-3"></div>
                  <div className="h-8 bg-gray-400 dark:bg-slate-600 rounded w-12"></div>
                </div>
              ))}
            </div>

            {/* Bio Skeleton */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-slate-600">
              <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-2/3 animate-pulse"></div>
            </div>

            {/* Button Skeleton */}
            <div className="mt-8">
              <div className="h-12 bg-gray-300 dark:bg-slate-700 rounded-xl w-40 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Contribution Section Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-300 dark:border-slate-600 overflow-hidden shadow-2xl">
          <div className="p-6">
            {/* Title Skeleton */}
            <div className="h-7 bg-gray-300 dark:bg-slate-700 rounded w-64 mb-6 animate-pulse"></div>
            
            {/* Content Skeleton */}
            <div className="bg-gray-200 dark:bg-slate-700 rounded-xl p-8">
              <div className="h-5 bg-gray-400 dark:bg-slate-600 rounded w-full mb-6 animate-pulse"></div>
              <div className="h-12 bg-gray-400 dark:bg-slate-600 rounded-xl w-56 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      {/* GitHub Profile Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-300 dark:border-slate-600 overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gray-200 dark:border-slate-700">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <i className="fab fa-github text-4xl text-primary dark:text-blue-300"></i>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">GitHub Stats</h3>
              <p className="text-base text-gray-600 dark:text-gray-300 font-medium">@Rafie1715</p>
            </div>
          </div>

          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Repositories */}
              <motion.div
                whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                className="p-5 bg-blue-50 dark:bg-slate-700 rounded-xl border-2 border-blue-200 dark:border-blue-600 transition-all"
              >
                <p className="text-sm text-gray-700 dark:text-gray-200 uppercase tracking-widest font-bold mb-3">
                  Repositories
                </p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-300">{stats.public_repos}</p>
              </motion.div>

              {/* Followers */}
              <motion.div
                whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                className="p-5 bg-cyan-50 dark:bg-slate-700 rounded-xl border-2 border-cyan-200 dark:border-cyan-600 transition-all"
              >
                <p className="text-sm text-gray-700 dark:text-gray-200 uppercase tracking-widest font-bold mb-3">
                  Followers
                </p>
                <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-300">{stats.followers}</p>
              </motion.div>

              {/* Following */}
              <motion.div
                whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                className="p-5 bg-purple-50 dark:bg-slate-700 rounded-xl border-2 border-purple-200 dark:border-purple-600 transition-all"
              >
                <p className="text-sm text-gray-700 dark:text-gray-200 uppercase tracking-widest font-bold mb-3">
                  Following
                </p>
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-300">{stats.following}</p>
              </motion.div>

              {/* Gists */}
              <motion.div
                whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                className="p-5 bg-pink-50 dark:bg-slate-700 rounded-xl border-2 border-pink-200 dark:border-pink-600 transition-all"
              >
                <p className="text-sm text-gray-700 dark:text-gray-200 uppercase tracking-widest font-bold mb-3">
                  Gists
                </p>
                <p className="text-4xl font-bold text-pink-600 dark:text-pink-300">{stats.public_gists}</p>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <i className="fas fa-exclamation-circle text-red-500 text-5xl"></i>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Unable to load GitHub stats</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Check the API rate limit or try again later</p>
              <a
                href="https://github.com/Rafie1715"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="fab fa-github"></i> Visit GitHub
              </a>
            </div>
          )}

          {/* Bio */}
          {stats?.bio && (
            <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-slate-600">
              <p className="text-gray-800 dark:text-gray-100 italic text-lg">{stats.bio}</p>
            </div>
          )}

          {/* View on GitHub Button */}
          <div className="mt-8">
            <a
              href={`https://github.com/${stats?.login}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-gray-900/30 transition-all text-lg"
            >
              <i className="fab fa-github"></i> View Full Profile
            </a>
          </div>
        </div>
      </div>

      {/* Contribution Graph Embed */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-300 dark:border-slate-600 overflow-hidden shadow-2xl">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <i className="fas fa-chart-line text-primary text-3xl"></i>
            Contribution Activity
          </h3>
          
          <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-8 border-2 border-gray-300 dark:border-slate-600">
            <p className="text-lg text-gray-700 dark:text-gray-200 text-center mb-6 font-semibold">
              📊 Check out my full contribution history on GitHub
            </p>
            <div className="text-center">
              <a
                href="https://github.com/Rafie1715?tab=contributions"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/40 transition-all"
              >
                <i className="fas fa-code"></i> View Full Contributions
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubActivity;
