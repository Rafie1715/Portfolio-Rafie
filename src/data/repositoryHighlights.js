// Summaries checked against public READMEs on 2026-10-06.
// Lifecycle labels describe documented artifacts, not inferred completion dates.
const highlights = {
  'phishing-and-spam-detection-website': {
    description: { en: 'React interface for checking suspicious URLs, messages, and screenshots through a detection API.', id: 'Antarmuka React untuk memeriksa URL, pesan, dan screenshot mencurigakan melalui API deteksi.' },
    status: 'prototype',
  },
  'portfolio-rafie': {
    description: { en: 'My React portfolio with bilingual case studies, a project catalog, and an admin workspace.', id: 'Portfolio React saya dengan studi kasus dua bahasa, katalog proyek, dan workspace admin.' },
    status: 'live',
  },
  rupiahvision: {
    description: { en: 'Android app for recognizing Rupiah banknotes using a camera, Jetpack Compose, and TensorFlow Lite.', id: 'Aplikasi Android untuk mengenali uang Rupiah dengan kamera, Jetpack Compose, dan TensorFlow Lite.' },
    status: 'source',
  },
  planetkuapp: {
    description: { en: 'Android capstone combining waste classification, carbon tracking, and map-based waste locations.', id: 'Capstone Android yang menggabungkan klasifikasi sampah, pencatatan karbon, dan lokasi sampah berbasis peta.' },
    status: 'capstone',
  },
  'sleep-quality-monitoring-app-using-random-forest': {
    description: { en: 'Kotlin sleep-tracking app with a Random Forest research notebook and three-class sleep assessment.', id: 'Aplikasi pelacakan tidur Kotlin dengan notebook riset Random Forest dan penilaian tidur tiga kelas.' },
    status: 'thesis',
  },
  'learning-with-us-website-company-profile': {
    description: { en: 'Responsive React company profile with service pages, a testimonial carousel, and theme switching.', id: 'Company profile React responsif dengan halaman layanan, carousel testimoni, dan pergantian tema.' },
    status: 'source',
  },
};
const labels = {
  en: { prototype: 'Prototype', live: 'Live website', source: 'Source available', capstone: 'Capstone project', thesis: 'Undergraduate thesis', archived: 'Archived' },
  id: { prototype: 'Prototipe', live: 'Website aktif', source: 'Kode tersedia', capstone: 'Proyek capstone', thesis: 'Skripsi S1', archived: 'Diarsipkan' },
};
const normalizeUrl = value => String(value || '').replace(/\.git\/?$/, '').replace(/\/$/, '').toLowerCase();
export function repositoryDetails(repo, projects, language = 'en') {
  const lang = language === 'id' ? 'id' : 'en';
  const curated = highlights[repo.name?.toLowerCase()];
  const local = projects.find(project => project.github && normalizeUrl(project.github) === normalizeUrl(repo.html_url));
  const description = curated?.description[lang] || (typeof local?.shortDesc === 'string' ? local.shortDesc : local?.shortDesc?.[lang]) || repo.description?.trim() || '';
  return { description, status: labels[lang][repo.archived ? 'archived' : curated?.status || 'source'] };
}
