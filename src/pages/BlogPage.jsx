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

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {currentLang === 'id' ? '📝 Blog' : '📝 Blog'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {currentLang === 'id' 
                ? 'Berbagi pengalaman dan pembelajaran dalam web development'
                : 'Sharing experiences and learnings in web development'}
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
