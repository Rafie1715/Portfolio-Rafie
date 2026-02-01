import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url, image }) => {
  const safeText = (text) => {
    if (!text) return "";
    if (typeof text === 'object') return text.en || text.id || "";
    return String(text);
  };

  const safeTitle = safeText(title);
  const safeDesc = safeText(description);

  return (
    <Helmet>
      <title>{safeTitle}</title>
      <meta name="description" content={safeDesc} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDesc} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDesc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;