import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import About from "../components/About";
import Education from "../components/Education";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";
import Skills from "../components/Skills";
import Timeline from "../components/Timeline";

const Certifications = lazy(() => import("../components/Certifications"));

const DeferredSection = ({ children, minHeight = 320 }) => {
  const targetRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(
    () => typeof window === "undefined" || !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const target = targetRef.current;
    if (!target || shouldRender) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={targetRef} style={shouldRender ? undefined : { minHeight }}>
      {shouldRender ? children : null}
    </div>
  );
};

const SectionFallback = () => (
  <div className="bg-gray-50 py-16 dark:bg-slate-950" aria-hidden="true">
    <div className="container mx-auto max-w-6xl px-4 sm:px-6">
      <div className="h-8 w-56 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-56 animate-pulse rounded-lg bg-gray-200 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  </div>
);

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <PageTransition>
      <main className="min-h-screen overflow-hidden bg-white pt-20 text-dark transition-colors duration-300 dark:bg-dark dark:text-white">
        <SEO
          title="About Rafie Rojagat Bachri | Mobile, Front-End & AI Developer"
          description="Meet Rafie Rojagat Bachri, a recent Informatics graduate focused on Android, front-end, and AI-integrated product development with Kotlin and React."
          url="https://rafierb.me/about"
          keywords="Rafie Rojagat Bachri, Android Developer, Kotlin Developer, React Developer, Front-End Developer, AI Developer, Informatics Graduate"
          type="profile"
        />

        <header className="border-b border-gray-200 bg-gray-50/80 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-11">
            <div className="mb-3 flex items-center gap-3">
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-gradient-to-r from-primary via-cyan-500 to-emerald-400" />
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {t("about.eyebrow")}
              </p>
            </div>
            <h1 className="text-3xl font-black text-dark dark:text-white md:text-4xl">
              {t("pages.about.title_prefix")} <span className="text-primary">{t("pages.about.title_highlight")}</span>
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300 md:text-base">
              {t("pages.about.subtitle")}
            </p>
          </div>
        </header>

        <About />
        <Skills />

        <section id="experience" className="scroll-mt-24 bg-white py-16 dark:bg-dark sm:py-20">
          <div className="container mx-auto mb-10 max-w-6xl px-4 sm:px-6">
            <div className="mb-3 flex items-center gap-3">
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-gradient-to-r from-primary via-cyan-500 to-emerald-400" />
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {t("experience.eyebrow")}
              </p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-4xl">{t("experience.title")}</h2>
              <p className="max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400 md:text-right">{t("experience.subtitle")}</p>
            </div>
          </div>
          <Timeline />
        </section>

        <Education />

        <DeferredSection minHeight={420}>
          <Suspense fallback={<SectionFallback />}>
            <Certifications />
          </Suspense>
        </DeferredSection>

        <section className="border-t border-gray-200 bg-gray-50/70 py-12 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                {t('about.setup_banner.eyebrow', 'Behind the Code')}
              </p>
              <h2 className="mt-1 text-xl font-bold text-dark dark:text-white sm:text-2xl">
                {t('about.setup_banner.title', 'Curious about my workflow & testing devices?')}
              </h2>
              <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                {t('about.setup_banner.desc', 'Explore the physical testing hardware, software stack, and daily development setup I use to build products.')}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/workspace"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/30 bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-sm hover:bg-primary/5 dark:bg-slate-800 dark:text-blue-300 transition"
              >
                <span>{t('about.setup_banner.cta_workspace', 'Explore Workspace & Gear →')}</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </PageTransition>
  );
};

export default AboutPage;
