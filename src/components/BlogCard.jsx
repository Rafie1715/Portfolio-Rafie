import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react';
import {
  getBlogLanguage,
  getBlogReadingMinutes,
  getLocalizedBlogValue,
} from '../utils/blog';

const BlogCard = ({ blog }) => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const language = getBlogLanguage(i18n);
  const title = getLocalizedBlogValue(blog.title, language);
  const excerpt = getLocalizedBlogValue(blog.excerpt, language);
  const readingMinutes = getBlogReadingMinutes(blog, language);
  const formattedDate = new Date(blog.publishedAt).toLocaleDateString(
    language === 'id' ? 'id-ID' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' },
  );

  const revealProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.4, ease: 'easeOut' },
      };

  return (
    <motion.article {...revealProps} className="h-full">
      <Link
        to={`/blog/${blog.slug}`}
        aria-label={`${t('pages.blog.read_article')}: ${title}`}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors hover:border-primary/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary/60"
      >
        <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-slate-800">
          <img
            src={blog.image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-xs font-bold uppercase text-primary">
            {t(`pages.blog.categories.${blog.category}`)}
          </p>

          <h2 className="mt-2 text-xl font-black leading-snug text-dark transition-colors group-hover:text-primary dark:text-white sm:text-2xl">
            {title}
          </h2>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
            {excerpt}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              {t('pages.blog.read_time', { count: readingMinutes })}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2" aria-label="Article tags">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="mt-6 inline-flex items-center gap-2 self-start text-sm font-bold text-primary">
            {t('pages.blog.read_article')}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
