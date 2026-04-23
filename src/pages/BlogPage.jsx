import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Search, Filter } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import PageTransition from '../components/PageTransition';
import { blogs } from '../data/blogs';

const BlogPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);

  // Get unique categories
  const categories = ['all', ...new Set(blogs.map(blog => blog.category.en))];

  useEffect(() => {
    let result = blogs;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(blog => blog.category.en === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(blog => {
        const title = blog.title[currentLang].toLowerCase();
        const excerpt = blog.excerpt[currentLang].toLowerCase();
        const tags = blog.tags.join(' ').toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return title.includes(query) || excerpt.includes(query) || tags.includes(query);
      });
    }

    setFilteredBlogs(result);
  }, [searchQuery, selectedCategory, currentLang]);

  const pageTitle = currentLang === 'id' ? 'Blog' : 'Blog';
  const pageDescription = currentLang === 'id' 
    ? 'Artikel dan tulisan tentang web development, performance optimization, dan teknologi terkini'
    : 'Articles and writings about web development, performance optimization, and latest technologies';
  const blogTitlePrefix = t('pages.blog.title_prefix');
  const blogTitleHighlight = t('pages.blog.title_highlight');
  const blogSubtitle = t('pages.blog.subtitle');

  return (
    <PageTransition>
      <Helmet>
        <title>{pageTitle} - Rafie Portfolio</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={`${pageTitle} - Rafie Portfolio`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
      </Helmet>

      <div className="bg-white dark:bg-dark min-h-screen pt-20 md:pt-24 pb-12 md:pb-20 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white dark:from-dark dark:via-transparent dark:to-dark" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10 mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-20"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block relative"
            >
              <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl relative z-10">
                <i className="fas fa-book-open text-3xl md:text-5xl text-dark dark:text-white bg-clip-text bg-gradient-to-r from-primary to-secondary"></i>
              </div>
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full transform scale-150 z-0 animate-pulse" />
            </motion.div>

            <h1 className="mt-6 md:mt-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-dark dark:text-white mb-4 md:mb-6 tracking-tight px-4">
              {blogTitlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{blogTitleHighlight}</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
              {blogSubtitle}
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentLang === 'id' ? 'Cari artikel...' : 'Search articles...'}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {category === 'all' 
                    ? (currentLang === 'id' ? 'Semua' : 'All')
                    : category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Blog Grid */}
          {filteredBlogs.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center py-20"
            >
              <p className="text-xl text-gray-500 dark:text-gray-400">
                {currentLang === 'id' 
                  ? '📭 Tidak ada artikel yang ditemukan'
                  : '📭 No articles found'}
              </p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                {currentLang === 'id' 
                  ? 'Coba kata kunci atau kategori lain'
                  : 'Try different keywords or categories'}
              </p>
            </motion.div>
          )}

          {/* Blog Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-8 text-gray-500 dark:text-gray-400"
          >
            {currentLang === 'id' 
              ? `Menampilkan ${filteredBlogs.length} dari ${blogs.length} artikel`
              : `Showing ${filteredBlogs.length} of ${blogs.length} articles`}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BlogPage;
