import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRight,
  BookOpenText,
  CalendarDays,
  Clock3,
  Search,
  X,
} from 'lucide-react';
import BlogCard from '../components/BlogCard';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import { blogs } from '../data/blogs';
import {
  getBlogLanguage,
  getBlogReadingMinutes,
  getBlogSearchText,
  getLocalizedBlogValue,
  sortBlogsByDate,
} from '../utils/blog';

const categoryIds = ['all', 'case-study', 'android', 'web', 'learning'];

const BlogPage = () => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const language = getBlogLanguage(i18n);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const archiveSectionRef = useRef(null);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    window.requestAnimationFrame(() => {
      archiveSectionRef.current?.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  };

  const sortedBlogs = useMemo(() => sortBlogsByDate(blogs), []);
  const featuredBlog = sortedBlogs.find((blog) => blog.featured) || sortedBlogs[0];
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const showFeatured = !normalizedQuery && selectedCategory === 'all';

  const filteredBlogs = useMemo(() => sortedBlogs.filter((blog) => {
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    const matchesSearch = !normalizedQuery || getBlogSearchText(blog, language).includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  }), [language, normalizedQuery, selectedCategory, sortedBlogs]);

  const gridBlogs = showFeatured
    ? filteredBlogs.filter((blog) => blog.id !== featuredBlog.id)
    : filteredBlogs;

  const featuredTitle = getLocalizedBlogValue(featuredBlog.title, language);
  const featuredExcerpt = getLocalizedBlogValue(featuredBlog.excerpt, language);
  const featuredDate = new Date(featuredBlog.publishedAt).toLocaleDateString(
    language === 'id' ? 'id-ID' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
  const featuredReadingMinutes = getBlogReadingMinutes(featuredBlog, language);

  const revealProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.45, ease: 'easeOut' },
      };

  return (
    <PageTransition>
      <SEO
        title={t('pages.blog.seo_title')}
        description={t('pages.blog.seo_desc')}
        url="https://rafierb.me/blog"
        image={`https://rafierb.me${featuredBlog.image}`}
      />

      <main className="relative min-h-screen overflow-hidden bg-white pt-20 text-dark transition-colors duration-300 dark:bg-dark dark:text-white md:pt-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:24px_24px]"
          aria-hidden="true"
        />

        <header className="relative z-10 border-b border-gray-200 py-14 dark:border-slate-700 md:py-20">
          <motion.div {...revealProps} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-primary">
              <BookOpenText className="h-4 w-4" aria-hidden="true" />
              {t('pages.blog.eyebrow')}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              {t('pages.blog.title_prefix')}{' '}
              <span className="text-primary">{t('pages.blog.title_highlight')}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg">
              {t('pages.blog.subtitle')}
            </p>
          </motion.div>
        </header>

        {showFeatured && (
          <section className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8" aria-labelledby="featured-article-title">
            <motion.p {...revealProps} className="text-sm font-bold uppercase text-primary">
              {t('pages.blog.featured_eyebrow')}
            </motion.p>

            <motion.article {...revealProps} className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <Link
                to={`/blog/${featuredBlog.slug}`}
                className="group grid lg:grid-cols-[1.2fr_0.8fr]"
                aria-label={`${t('pages.blog.read_article')}: ${featuredTitle}`}
              >
                <div className="min-h-64 overflow-hidden bg-gray-100 lg:min-h-[420px] dark:bg-slate-800">
                  <img
                    src={featuredBlog.image}
                    alt={featuredTitle}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
                  />
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase">
                    <span className="rounded bg-primary px-2.5 py-1 text-white">
                      {t('pages.blog.featured_badge')}
                    </span>
                    <span className="text-primary">
                      {t(`pages.blog.categories.${featuredBlog.category}`)}
                    </span>
                  </div>

                  <h2 id="featured-article-title" className="mt-4 text-2xl font-black leading-tight transition-colors group-hover:text-primary sm:text-3xl lg:text-4xl">
                    {featuredTitle}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                    {featuredExcerpt}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      {featuredDate}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                      {t('pages.blog.read_time', { count: featuredReadingMinutes })}
                    </span>
                  </div>

                  <span className="mt-7 inline-flex items-center gap-2 self-start font-bold text-primary">
                    {t('pages.blog.read_article')}
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </motion.article>
          </section>
        )}

        <section
          ref={archiveSectionRef}
          className="relative z-10 scroll-mt-16 border-t border-gray-200 bg-gray-50/80 py-14 dark:border-slate-700 dark:bg-slate-900/40 md:scroll-mt-20 md:py-20"
          aria-labelledby="blog-archive-title"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div {...revealProps} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase text-primary">{t('pages.blog.recent_eyebrow')}</p>
                <h2 id="blog-archive-title" className="mt-2 text-3xl font-black sm:text-4xl">
                  {t('pages.blog.recent_title')}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                  {t('pages.blog.recent_subtitle')}
                </p>
              </div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400" aria-live="polite">
                {t('pages.blog.article_count', { count: filteredBlogs.length })}
              </p>
            </motion.div>

            <motion.div {...revealProps} className="mt-8">
              <label htmlFor="blog-search" className="sr-only">{t('pages.blog.search_label')}</label>
              <div className="relative max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  id="blog-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t('pages.blog.search_placeholder')}
                  className="w-full rounded-lg border border-gray-300 bg-white py-3.5 pl-12 pr-12 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:hover:bg-slate-800 dark:hover:text-white"
                    aria-label={t('pages.blog.clear_search')}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
                <div className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap" role="group" aria-label={t('pages.blog.filter_label')}>
                  {categoryIds.map((categoryId) => {
                    const isActive = selectedCategory === categoryId;
                    return (
                      <button
                        key={categoryId}
                        type="button"
                        onClick={() => handleCategoryChange(categoryId)}
                        aria-pressed={isActive}
                        className={`relative isolate overflow-hidden rounded-lg border px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark ${
                          isActive
                            ? 'border-primary text-white'
                            : 'border-gray-300 bg-white text-gray-600 hover:border-primary/50 hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId={shouldReduceMotion ? undefined : 'blog-active-category'}
                            className="absolute inset-0 bg-primary"
                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                            aria-hidden="true"
                          />
                        )}
                        <span className="relative z-10">{t(`pages.blog.categories.${categoryId}`)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait" initial={false}>
              {gridBlogs.length > 0 ? (
                <motion.div
                  key="blog-grid"
                  layout={!shouldReduceMotion}
                  className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {gridBlogs.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} animateLayout />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="blog-empty"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="py-20 text-center"
                  role="status"
                >
                  <BookOpenText className="mx-auto h-9 w-9 text-gray-400" aria-hidden="true" />
                  <h3 className="mt-4 text-xl font-black">{t('pages.blog.empty_title')}</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">{t('pages.blog.empty_desc')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </PageTransition>
  );
};

export default BlogPage;
