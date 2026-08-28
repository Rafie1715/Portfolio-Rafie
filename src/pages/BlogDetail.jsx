import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Play,
  Share2,
} from 'lucide-react';
import BlogCard from '../components/BlogCard';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import { blogs } from '../data/blogs';
import {
  getBlogLanguage,
  getBlogReadingMinutes,
  getLocalizedBlogValue,
  getLocalizedSections,
  sortBlogsByDate,
} from '../utils/blog';
import { trackEvent } from '../utils/analytics';

const impactKeys = ['role', 'team', 'result', 'scope'];

const BlogDetail = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const language = getBlogLanguage(i18n);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const blog = useMemo(() => blogs.find((item) => item.slug === slug), [slug]);

  useEffect(() => {
    if (!blog) return undefined;
    trackEvent('Blog', 'View', getLocalizedBlogValue(blog.title, 'en'));
    return undefined;
  }, [blog]);

  useEffect(() => {
    if (!linkCopied) return undefined;
    const timeoutId = window.setTimeout(() => setLinkCopied(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [linkCopied]);

  const relatedBlogs = useMemo(() => {
    if (!blog) return [];
    return sortBlogsByDate(blogs.filter((item) => item.id !== blog.id))
      .sort((first, second) => Number(second.category === blog.category) - Number(first.category === blog.category))
      .slice(0, 2);
  }, [blog]);

  if (!blog) return <Navigate to="/blog" replace />;

  const title = getLocalizedBlogValue(blog.title, language);
  const excerpt = getLocalizedBlogValue(blog.excerpt, language);
  const sections = getLocalizedSections(blog, language);
  const readingMinutes = getBlogReadingMinutes(blog, language);
  const formattedDate = new Date(blog.publishedAt).toLocaleDateString(
    language === 'id' ? 'id-ID' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
  const canonicalUrl = `https://rafierb.me/blog/${blog.slug}`;
  const socialImage = blog.image.startsWith('http') ? blog.image : `https://rafierb.me${blog.image}`;

  const revealProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: 'easeOut' },
      };

  const handleShare = async () => {
    const shareData = { title, text: excerpt, url: window.location.href };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setLinkCopied(true);
      }
      trackEvent('Blog', 'Share', getLocalizedBlogValue(blog.title, 'en'));
    } catch (error) {
      if (error?.name !== 'AbortError') {
        await navigator.clipboard?.writeText(window.location.href);
        setLinkCopied(true);
      }
    }
  };

  return (
    <PageTransition>
      <SEO
        title={`${title} | Rafie's Blog`}
        description={excerpt}
        url={canonicalUrl}
        image={socialImage}
        type="article"
        author={blog.author}
        keywords={blog.tags.join(', ')}
        published={blog.publishedAt}
        modified={blog.updatedAt || blog.publishedAt}
      />

      <main className="relative min-h-screen overflow-hidden bg-white pb-20 pt-24 text-dark transition-colors duration-300 dark:bg-dark dark:text-white md:pt-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:24px_24px]"
          aria-hidden="true"
        />

        <article className="relative z-10">
          <motion.header {...revealProps} className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 transition hover:text-primary dark:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t('pages.blog.back')}
            </Link>

            <div className="mt-10 flex flex-wrap items-center gap-3 text-xs font-bold uppercase">
              <span className="text-primary">{t(`pages.blog.categories.${blog.category}`)}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-slate-600" aria-hidden="true" />
              <span className="text-gray-500 dark:text-gray-400">{t('pages.blog.published')} {formattedDate}</span>
            </div>

            <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
              {excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-gray-200 pt-5 dark:border-slate-700">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <span className="font-bold text-dark dark:text-white">{blog.author}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                  {t('pages.blog.read_time', { count: readingMinutes })}
                </span>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold text-gray-600 transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-700 dark:text-gray-300"
                aria-label={t('pages.blog.share')}
                title={t('pages.blog.share')}
              >
                {linkCopied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
                <span>{linkCopied ? t('pages.blog.copied') : t('pages.blog.share')}</span>
              </button>
            </div>
          </motion.header>

          {!blog.videoId && (
            <motion.div {...revealProps} className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-800">
                <img src={blog.image} alt={title} decoding="async" className="h-full w-full object-cover" />
              </div>
            </motion.div>
          )}

          {blog.impact && (
            <section className="mx-auto mt-12 max-w-4xl border-y border-gray-200 px-4 py-8 dark:border-slate-700 sm:px-6 lg:px-8" aria-labelledby="article-impact-title">
              <p id="article-impact-title" className="text-sm font-bold uppercase text-primary">
                {t('pages.blog.impact_eyebrow')}
              </p>
              <dl className="mt-5 grid gap-x-7 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                {impactKeys.map((key) => (
                  <div key={key}>
                    <dt className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{t(`pages.blog.${key}`)}</dt>
                    <dd className="mt-1.5 text-sm font-bold leading-relaxed text-dark dark:text-white">
                      {getLocalizedBlogValue(blog.impact[key], language)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {blog.videoId && (
            <section className="mx-auto mt-12 max-w-4xl px-4 sm:px-6 lg:px-8" aria-labelledby="article-video-title">
              <p id="article-video-title" className="text-sm font-bold uppercase text-primary">
                {t('pages.blog.video_eyebrow')}
              </p>
              <div className="mt-4 aspect-video overflow-hidden rounded-lg bg-slate-950 shadow-sm">
                {videoLoaded ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${blog.videoId}?rel=0&autoplay=1`}
                    title={`${t('pages.blog.video_eyebrow')}: ${title}`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setVideoLoaded(true)}
                    className="group relative h-full w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                    aria-label={`${t('pages.blog.play_video')}: ${title}`}
                  >
                    <img src={blog.image} alt="" className="h-full w-full object-cover opacity-75" />
                    <span className="absolute inset-0 bg-black/25" aria-hidden="true" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-lg transition-transform group-hover:scale-105">
                        <Play className="ml-1 h-7 w-7 fill-current" aria-hidden="true" />
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </section>
          )}

          <div className="mx-auto mt-12 max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2" aria-label={language === 'id' ? 'Tag artikel' : 'Article tags'}>
              {blog.tags.map((tag) => (
                <span key={tag} className="rounded border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-10 space-y-10">
              {sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-black leading-tight sm:text-3xl">{section.heading}</h2>
                  <div className="mt-4 space-y-4 text-base leading-8 text-gray-700 dark:text-gray-300 sm:text-lg">
                    {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {section.bullets && (
                      <ul className="space-y-3 pl-1">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <Check className="mt-1.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>

            {blog.projectId && (
              <div className="mt-12 border-y border-gray-200 py-7 dark:border-slate-700">
                <Link
                  to={`/project/${blog.projectId}`}
                  className="inline-flex items-center gap-2 font-bold text-primary transition hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {t('pages.blog.open_project')}
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-7 dark:border-slate-700">
              <p className="font-bold">{t('pages.blog.share')}</p>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark"
              >
                {linkCopied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
                {linkCopied ? t('pages.blog.copied') : t('pages.blog.share')}
              </button>
            </div>
          </div>
        </article>

        <section className="relative z-10 mx-auto mt-20 max-w-6xl border-t border-gray-200 px-4 pt-12 dark:border-slate-700 sm:px-6 lg:px-8" aria-labelledby="related-articles-title">
          <p className="text-sm font-bold uppercase text-primary">{t('pages.blog.related_eyebrow')}</p>
          <h2 id="related-articles-title" className="mt-2 text-3xl font-black">{t('pages.blog.related_title')}</h2>
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {relatedBlogs.map((relatedBlog) => <BlogCard key={relatedBlog.id} blog={relatedBlog} />)}
          </div>
        </section>
      </main>
    </PageTransition>
  );
};

export default BlogDetail;
