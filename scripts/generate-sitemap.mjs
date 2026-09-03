import { writeFile } from 'node:fs/promises'
import { blogs } from '../src/data/blogs.js'
import { projects } from '../src/data/projects.js'

const origin = 'https://rafierb.me'

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

const alternates = (path) => [
  ['en', `${origin}${path}`],
  ['id', `${origin}${path}${path.includes('?') ? '&' : '?'}lang=id`],
  ['x-default', `${origin}${path}`],
]

const sitemapEntry = ({ path, lastmod, changefreq, priority, localized = true }) => {
  const links = localized
    ? alternates(path)
      .map(([language, href]) => `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(href)}"/>`)
      .join('\n')
    : ''

  return [
    '  <url>',
    `    <loc>${escapeXml(`${origin}${path}`)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    links,
    '  </url>',
  ].filter(Boolean).join('\n')
}

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.9' },
  { path: '/projects', changefreq: 'weekly', priority: '0.9' },
  { path: '/workspace', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/afk', changefreq: 'monthly', priority: '0.3' },
  { path: '/blog', changefreq: 'monthly', priority: '0.8' },
]

const projectRoutes = projects.map((project) => ({
  path: `/project/${project.id}`,
  changefreq: 'yearly',
  priority: project.featuredOrder ? '0.8' : '0.7',
}))

const blogRoutes = blogs.map((blog) => ({
  path: `/blog/${blog.slug}`,
  lastmod: blog.updatedAt || blog.publishedAt,
  changefreq: 'yearly',
  priority: blog.featured ? '0.8' : '0.6',
}))

const entries = [...staticRoutes, ...projectRoutes, ...blogRoutes]
  .map(sitemapEntry)
  .join('\n\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`

await writeFile(new URL('../public/sitemap.xml', import.meta.url), sitemap, 'utf8')
console.log(`Generated sitemap with ${staticRoutes.length + projectRoutes.length + blogRoutes.length} URLs.`)
