import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ 
  title, 
  description, 
  url, 
  image,
  type = 'website',
  author = 'Rafie Rojagat',
  keywords = 'Portfolio, Software Engineer, Mobile Developer, Web Developer, React, Flutter, Rafie Rojagat',
  published,
  modified,
  noindex = false
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  
  const baseUrl = 'https://rafie-dev.netlify.app';
  
  const safeText = (text) => {
    if (!text) return "";
    if (typeof text === 'object') return text.en || text.id || "";
    return String(text);
  };

  const safeTitle = safeText(title);
  const safeDesc = safeText(description);
  const canonicalUrl = url || baseUrl;
  const ogImage = image || `${baseUrl}/og-image.png`;

  // Structured Data - Person Schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Rafie Rojagat",
    "url": baseUrl,
    "jobTitle": "Software Engineer",
    "description": "Informatics Student specializing in Mobile & Web Development",
    "image": `${baseUrl}/images/profile.webp`,
    "sameAs": [
      "https://github.com/rafierojagat",
      "https://www.linkedin.com/in/rafierojagat"
    ],
    "knowsAbout": ["React", "Flutter", "Mobile Development", "Web Development", "Python", "JavaScript"],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "UPN Veteran Jakarta"
    }
  };

  // Structured Data - Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Rafie Rojagat Portfolio",
    "url": baseUrl,
    "description": "Portfolio of Rafie Rojagat, Software Engineer specializing in Mobile & Web Development",
    "author": {
      "@type": "Person",
      "name": "Rafie Rojagat"
    },
    "inLanguage": ["en", "id"]
  };

  // Article Schema (for project details)
  const articleSchema = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": safeTitle,
    "description": safeDesc,
    "image": ogImage,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Person",
      "name": "Rafie Rojagat"
    },
    "datePublished": published,
    "dateModified": modified || published,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  } : null;

  const alternateUrl = currentLang === 'en' 
    ? canonicalUrl.replace(/\?lang=id/, '').replace(/&lang=id/, '')
    : `${canonicalUrl}${canonicalUrl.includes('?') ? '&' : '?'}lang=id`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={currentLang} />
      <title>{safeTitle}</title>
      <meta name="title" content={safeTitle} />
      <meta name="description" content={safeDesc} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en" href={baseUrl + url?.replace(baseUrl, '')} />
      <link rel="alternate" hrefLang="id" href={`${baseUrl}${url?.replace(baseUrl, '')}${url?.includes('?') ? '&' : '?'}lang=id`} />
      <link rel="alternate" hrefLang="x-default" href={baseUrl + url?.replace(baseUrl, '')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={safeTitle} />
      <meta property="og:site_name" content="Rafie Rojagat Portfolio" />
      <meta property="og:locale" content={currentLang === 'id' ? 'id_ID' : 'en_US'} />
      <meta property="og:locale:alternate" content={currentLang === 'id' ? 'en_US' : 'id_ID'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDesc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={safeTitle} />
      <meta name="twitter:creator" content="@rafierojagat" />
      <meta name="twitter:site" content="@rafierojagat" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />

      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;