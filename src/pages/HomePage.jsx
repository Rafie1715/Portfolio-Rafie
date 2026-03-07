import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { projects } from '../data/projects';
import { blogs } from '../data/blogs';
import BlogCard from '../components/BlogCard';
import SpotlightCard from '../components/SpotlightCard';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const featuredProjects = projects.slice(0, 3);
  const featuredBlogs = blogs.slice(0, 2);

  const getData = (data) => {
    if (!data) return "";

    if (typeof data === 'object' && !Array.isArray(data)) {
      return data[currentLang] || data.en || data.id || "";
    }

    return String(data);
  };

  return (
    <PageTransition>
      <div className="bg-white dark:bg-dark min-h-screen">
        <SEO
          title="Rafie Rojagat | Software Engineer Portfolio"
          description="Welcome to my digital playground. Informatics Student at UPN Veteran Jakarta specializing in Mobile & Web Development with React, Flutter, and modern frameworks. Explore my projects, skills, and experience."
          url="https://rafie-dev.netlify.app/"
          keywords="Rafie Rojagat, Software Engineer Portfolio, Mobile Developer, Web Developer, React, Flutter, Full Stack Developer, UPN Veteran Jakarta"
          type="website"
        />

        <Hero />

        <section className="px-4 container mx-auto mt-10">
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5" data-aos="fade-up">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">{t('home.afk_teaser.eyebrow')}</p>
              <h3 className="text-xl md:text-2xl font-bold text-dark dark:text-white mb-2">{t('home.afk_teaser.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                {t('home.afk_teaser.desc')}
              </p>
            </div>

            <Link
              to="/afk"
              className="inline-flex items-center justify-center whitespace-nowrap px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('home.afk_teaser.cta')}
            </Link>
          </div>
        </section>

        <section className="py-20 px-4 container mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">{t('home.featured_work')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.glimpse')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project, index) => {
              const title = getData(project.title);
              const shortDesc = getData(project.shortDesc);

              return (
                <SpotlightCard key={project.id} className="group p-0 overflow-hidden h-full flex flex-col" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-dark dark:text-white mb-2">{title}</h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                      {shortDesc}
                    </p>

                    <Link to={`/project/${project.id}`} className="text-primary font-medium hover:underline mt-auto">
                      {t('home.view_details')}
                    </Link>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/projects" className="inline-block px-8 py-3 rounded-full border border-gray-300 dark:border-slate-700 text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              {t('home.view_all')}
            </Link>
          </div>
        </section>

        <section className="py-20 px-4 container mx-auto bg-gray-50 dark:bg-darkLight my-12 rounded-2xl">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">{t('home.latest_blog') || 'Latest from Blog'}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.blog_glimpse') || 'Thoughts on web development, mobile apps, and learning'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {featuredBlogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} data-aos="fade-up" data-aos-delay={index * 100} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/blog" className="inline-block px-8 py-3 rounded-full border border-gray-300 dark:border-slate-700 text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              {t('home.view_all_blogs') || 'View All Blogs'}
            </Link>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default HomePage;