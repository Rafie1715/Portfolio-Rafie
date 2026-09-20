import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { blogs } from '../src/data/blogs.js';
import { portfolioProfile } from '../src/data/portfolioProfile.js';
const projects = JSON.parse(await readFile('.generated/public-projects.json', 'utf8'));
const template = await readFile('dist/index.html', 'utf8');
const origin = 'https://rafierb.me';
const escape = value => String(value || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const text = value => typeof value === 'object' ? value?.en || value?.id || '' : value || '';
const paragraph = value => '<p class="mt-4 leading-7">' + escape(text(value)) + '</p>';
const links = projects.map(p => '<li class="mb-6"><a class="font-bold text-primary" href="/project/' + encodeURIComponent(p.id) + '">' + escape(text(p.title)) + '</a>' + paragraph(p.shortDesc) + '</li>').join('');
const routes = [
 { path: '/', title: 'Rafie Rojagat Bachri | Android Developer', description: portfolioProfile.headline.en, body: '<h1 class="text-4xl font-bold">Rafie Rojagat Bachri</h1>' + paragraph('Android developer building useful, reliable products.') + '<h2 class="mt-8 text-2xl font-bold">Selected work</h2><ul class="mt-5">' + links + '</ul>' },
 { path: '/projects', title: 'Projects | Rafie Rojagat', description: 'Android, web, and AI case studies: contributions, decisions, and outcomes.', body: '<h1 class="text-4xl font-bold">Projects</h1><ul class="mt-8">' + links + '</ul>' },
 { path: '/about', title: 'About | Rafie Rojagat', description: portfolioProfile.headline.en, body: '<h1 class="text-4xl font-bold">About Rafie</h1>' + paragraph(portfolioProfile.headline) + paragraph(portfolioProfile.education.institution + ' · GPA ' + portfolioProfile.education.gpa) },
 { path: '/contact', title: 'Contact | Rafie Rojagat', description: portfolioProfile.availability.en, body: '<h1 class="text-4xl font-bold">Let’s build something useful.</h1>' + paragraph(portfolioProfile.availability) + '<a href="mailto:' + portfolioProfile.contact.email + '">' + portfolioProfile.contact.email + '</a>' },
 { path: '/blog', title: 'Engineering Notes | Rafie Rojagat', description: 'Practical Android, web, and machine-learning engineering notes.', body: '<h1 class="text-4xl font-bold">Engineering Notes</h1>' + blogs.map(b => '<article class="mt-8"><h2 class="text-2xl font-bold"><a href="/blog/' + b.slug + '">' + escape(text(b.title)) + '</a></h2>' + paragraph(b.excerpt) + '</article>').join('') },
 ...projects.map(p => ({ path: '/project/' + encodeURIComponent(p.id), title: text(p.title) + ' | Rafie Rojagat', description: text(p.shortDesc), image: p.image, body: '<h1 class="text-4xl font-bold">' + escape(text(p.title)) + '</h1>' + paragraph(p.shortDesc) + paragraph(p.fullDesc) + '<h2 class="mt-8 text-2xl font-bold">My contribution</h2>' + paragraph(p.evidence?.contribution || p.impactDetails?.role || p.impact) + '<h2 class="mt-8 text-2xl font-bold">Engineering decisions</h2>' + paragraph(p.challenges) + paragraph(p.solution) + paragraph(p.evidence?.metricContext) })),
 ...blogs.map(b => ({ path: '/blog/' + b.slug, title: text(b.title) + ' | Rafie Rojagat', description: text(b.excerpt), image: b.image, body: '<h1 class="text-4xl font-bold">' + escape(text(b.title)) + '</h1>' + paragraph(b.excerpt) + (b.sections?.en || []).map(section => '<section class="mt-8"><h2 class="text-2xl font-bold">' + escape(section.heading) + '</h2>' + (section.paragraphs || []).map(paragraph).join('') + '<ul>' + (section.bullets || []).map(item => '<li>' + escape(item) + '</li>').join('') + '</ul></section>').join('') })),
];
for (const route of routes) {
  const url = origin + route.path;
  let html = template.replace(/<title>.*?<\/title>/, () => '<title>' + escape(route.title) + '</title>');
  const tags = { title: route.title, description: route.description, 'og:type': route.path.startsWith('/project/') || route.path.startsWith('/blog/') ? 'article' : 'website', 'og:image:alt': route.title, 'twitter:image:alt': route.title, 'og:title': route.title, 'og:description': route.description, 'og:url': url, 'og:image': new URL(route.image || '/og-image.png', origin).href, 'twitter:title': route.title, 'twitter:description': route.description, 'twitter:url': url, 'twitter:image': new URL(route.image || '/og-image.png', origin).href };
  for (const [key, value] of Object.entries(tags)) html = html.replace(new RegExp('(<meta (?:name|property)="' + key + '" content=")[^"]*(")'), (_, before, after) => before + escape(value) + after);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, (_, before, after) => before + url + after);
  html = html.replace(/(<link rel="alternate" hrefLang="(?:en|x-default)" href=")[^"]*(")/g, (_, before, after) => before + url + after);
  html = html.replace(/(<link rel="alternate" hrefLang="id" href=")[^"]*(")/, (_, before, after) => before + url + '?lang=id' + after);
  const schema = { '@context': 'https://schema.org', '@type': 'Person', name: portfolioProfile.name, url: origin, sameAs: [portfolioProfile.contact.github, portfolioProfile.contact.linkedin] };
  html = html.replace('</head>', '<script type="application/ld+json" data-rh="true">' + JSON.stringify(schema).replaceAll('<','\\u003c') + '</script></head>');
  html = html.replace('<div id="root"></div>', () => '<div id="root"></div><noscript><nav class="mx-auto max-w-5xl px-5 py-6"><a href="/">Rafie.</a> · <a href="/projects">Projects</a> · <a href="/contact">Contact</a></nav><main class="mx-auto max-w-5xl px-5 py-12">' + route.body + '</main></noscript>');
  const dir = 'dist' + (route.path === '/' ? '' : route.path);
  await mkdir(dir, { recursive: true }); await writeFile(dir + '/index.html', html);
}
const error = template.replace(/<title>.*?<\/title>/,'<title>Page not found | Rafie Rojagat</title>').replaceAll('content="index, follow"','content="noindex, follow"').replace('<div id="root"></div>','<div id="root"></div><noscript><main><h1>Page not found</h1><a href="/">Back to home</a></main></noscript>');
await writeFile('dist/404.html', error);
console.log('Generated static metadata and no-JavaScript content for ' + routes.length + ' public pages and the 404 response.');
