export const getBlogLanguage = (i18n) => {
  const language = String(i18n.resolvedLanguage || i18n.language || 'en');
  return language.startsWith('id') ? 'id' : 'en';
};

export const getLocalizedBlogValue = (value, language) => {
  if (typeof value === 'string') return value;
  return value?.[language] || value?.en || value?.id || '';
};

export const getLocalizedSections = (blog, language) => (
  blog.sections?.[language] || blog.sections?.en || blog.sections?.id || []
);

export const getBlogWordCount = (blog, language) => {
  const sections = getLocalizedSections(blog, language);
  const text = sections.flatMap((section) => [
    section.heading,
    ...(section.paragraphs || []),
    ...(section.bullets || []),
  ]).join(' ');

  return text.match(/\S+/g)?.length || 0;
};

export const getBlogReadingMinutes = (blog, language) => (
  Math.max(1, Math.ceil(getBlogWordCount(blog, language) / 200))
);

export const getBlogSearchText = (blog, language) => {
  const sections = getLocalizedSections(blog, language);
  return [
    getLocalizedBlogValue(blog.title, language),
    getLocalizedBlogValue(blog.excerpt, language),
    ...blog.tags,
    ...sections.flatMap((section) => [
      section.heading,
      ...(section.paragraphs || []),
      ...(section.bullets || []),
    ]),
  ].join(' ').toLowerCase();
};

export const sortBlogsByDate = (items) => [...items].sort((first, second) => (
  new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime()
));
