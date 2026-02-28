import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';

const BlogCard = ({ blog }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group"
    >
      <Link to={`/blog/${blog.slug}`}>
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg dark:shadow-gray-900/50 h-full flex flex-col border border-gray-200 dark:border-gray-700"
          whileHover={{
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3), inset 0 0 1px rgba(59, 130, 246, 0.1)"
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
            {blog.image && (
              <motion.img
                src={blog.image}
                alt={blog.title[currentLang]}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 0.3 }}
              transition={{ duration: 0.3 }}
            />
            
            <motion.div 
              className="absolute top-4 left-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-800 dark:text-gray-200">
                {blog.category[currentLang]}
              </span>
            </motion.div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <motion.div 
              className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime}</span>
              </div>
            </motion.div>

            <motion.h3 
              className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {blog.title[currentLang]}
            </motion.h3>

            <motion.p 
              className="text-gray-600 dark:text-gray-300 mb-4 flex-1 line-clamp-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              {blog.excerpt[currentLang]}
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-2 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {blog.tags.slice(0, 3).map((tag, index) => (
                <motion.span
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded"
                  whileHover={{ scale: 1.05, backgroundColor: "rgb(59, 130, 246)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <span>{currentLang === 'id' ? 'Baca Selengkapnya' : 'Read More'}</span>
              <motion.div
                whileHover={{ x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
