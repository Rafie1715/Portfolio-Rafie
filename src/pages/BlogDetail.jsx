import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { blogs } from '../data/blogs';
import { trackEvent } from '../utils/analytics';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const foundBlog = blogs.find(b => b.slug === slug);
    if (foundBlog) {
      setBlog(foundBlog);
      // Track blog view
      trackEvent('Blog', 'View', foundBlog.title.en);
    } else {
      navigate('/blog');
    }
  }, [slug, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title[currentLang],
        text: blog.excerpt[currentLang],
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(currentLang === 'id' ? 'Link disalin!' : 'Link copied!');
    }
    trackEvent('Blog', 'Share', blog.title.en);
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {currentLang === 'id' ? 'Memuat...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Format content markdown-style to HTML-like structure
  const formatContent = (content) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-3xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-2xl font-bold mt-5 mb-2 text-gray-900 dark:text-white">{line.substring(4)}</h3>;
        }
        
        // Code blocks
        if (line.startsWith('```')) {
          return null; // Handle code blocks separately
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-6 text-gray-700 dark:text-gray-300 mb-2">{line.substring(2)}</li>;
        }
        
        // Regular paragraphs
        if (line.trim()) {
          return <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{line}</p>;
        }
        
        return <br key={index} />;
      });
  };

  return (
    <PageTransition>
      <Helmet>
        <title>{blog.title[currentLang]} - Rafie's Blog</title>
        <meta name="description" content={blog.excerpt[currentLang]} />
        <meta property="og:title" content={blog.title[currentLang]} />
        <meta property="og:description" content={blog.excerpt[currentLang]} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={blog.publishedAt} />
        <meta property="article:author" content={blog.author} />
        {blog.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        <link rel="canonical" href={`${window.location.origin}/blog/${blog.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{currentLang === 'id' ? 'Kembali ke Blog' : 'Back to Blog'}</span>
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
          >
            {/* Hero Image */}
            <div className="relative h-64 md:h-96 bg-gradient-to-br from-blue-500 to-purple-600">
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title[currentLang]}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Category Badge */}
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-sm font-semibold rounded-full text-gray-800 dark:text-gray-200">
                  {blog.category[currentLang]}
                </span>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="absolute top-6 right-6 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {blog.title[currentLang]}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {blog.author[0]}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{blog.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Excerpt */}
              <div className="text-lg text-gray-600 dark:text-gray-300 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700 italic">
                {blog.excerpt[currentLang]}
              </div>

              {/* YouTube Video Embed */}
              {blog.videoUrl && (
                <div className="mb-8">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900">
                    <iframe
                      src={`https://www.youtube.com/embed/${blog.videoUrl}?rel=0`}
                      title={blog.title[currentLang]}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                    {currentLang === 'id' ? '🎥 Video Tutorial CodeVox' : '🎥 CodeVox Tutorial Video'}
                  </p>
                </div>
              )}

              {/* Main Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                  {formatContent(blog.content[currentLang])}
                </div>
              </div>

              {/* Share Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentLang === 'id' ? 'Bagikan artikel ini:' : 'Share this article:'}
                  </p>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{currentLang === 'id' ? 'Bagikan' : 'Share'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Related Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {currentLang === 'id' ? 'Artikel Lainnya' : 'Other Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs
                .filter(b => b.id !== blog.id)
                .slice(0, 2)
                .map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id}
                    to={`/blog/${relatedBlog.slug}`}
                    className="group p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                  >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {relatedBlog.title[currentLang]}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {relatedBlog.excerpt[currentLang]}
                    </p>
                  </Link>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BlogDetail;
