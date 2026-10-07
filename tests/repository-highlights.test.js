import test from 'node:test';
import assert from 'node:assert/strict';
import { repositoryDetails } from '../src/data/repositoryHighlights.js';

test('repository descriptions are localized and publication status is not inferred from recent commits', () => {
  const repo = { name: 'RupiahVision', html_url: 'https://github.com/Rafie1715/RupiahVision', pushed_at: new Date().toISOString() };
  assert.match(repositoryDetails(repo, [], 'en').description, /Jetpack Compose/);
  assert.equal(repositoryDetails(repo, [], 'en').status, 'Source available');
  assert.equal(repositoryDetails(repo, [], 'id').status, 'Kode tersedia');
  assert.equal(repositoryDetails({ ...repo, archived: true }, [], 'id').status, 'Diarsipkan');
});

test('unlisted repositories use matching case study content or their provider description', () => {
  const repo = { name: 'News', html_url: 'https://github.com/example/News.git', description: 'Provider summary' };
  const projects = [{ github: 'https://github.com/example/news/', shortDesc: { en: 'News reader', id: 'Pembaca berita' } }];
  assert.equal(repositoryDetails(repo, projects, 'id').description, 'Pembaca berita');
  assert.equal(repositoryDetails(repo, [], 'en').description, 'Provider summary');
  assert.equal(repositoryDetails({ ...repo, description: null }, [], 'en').description, '');
});
