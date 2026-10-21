import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRecruiterSummary, recruiterSummaryText } from '../src/data/recruiterSummary.js';
import { projects } from '../src/data/projects.js';

test('summary honors the public catalog and CMS content instead of reviving unpublished projects', () => {
  const sentry = { id: 'stLpQKeX8K2JXu8zGb5r', slug: 'sentry', title: { en: 'Sentry' }, shortDesc: { en: 'Current CMS description' }, github: 'https://github.com/example/sentry' };
  const summary = buildRecruiterSummary([sentry]);
  assert.equal(summary.projects.length, 1);
  assert.equal(summary.projects[0].path, '/project/sentry');
  assert.equal(summary.projects[0].description, sentry.shortDesc.en);
  assert.match(summary.projects[0].evidence, /FastAPI/);
  const updated = buildRecruiterSummary([{ ...sentry, impactDetails: { result: { en: 'Updated evidence' } } }]);
  assert.equal(updated.projects[0].evidence, 'Updated evidence');
  assert.deepEqual(buildRecruiterSummary([]).projects, []);
});

test('copied summary follows the selected focus and language, including canonical links', () => {
  const summary = buildRecruiterSummary(projects, 'frontend', 'id-ID');
  const text = recruiterSummaryText(summary, 'id-ID');
  assert.match(text, /KETERAMPILAN TEKNIS/);
  assert.match(text, /Mei – Juni 2024/);
  assert.match(text, /https:\/\/rafierb.me\/project\/computer-crafter/);
  assert.doesNotMatch(text, /RestUP|\/projects\//);
  for (const project of summary.projects) {
    assert.ok(text.includes(project.description));
    assert.ok(text.includes(project.github));
  }
});

test('summary preserves evaluation context and distinguishes learning from project experience', () => {
  const summary = buildRecruiterSummary(projects, 'android');
  const text = recruiterSummaryText(summary);
  assert.match(text, /92.06% test-set accuracy · 63 samples/);
  assert.match(text, /October 2025 – June 2026/);
  assert.match(text, /MandiriNewsApp/);
  assert.match(text, /Integrated the ML team's waste classifier/);
  assert.match(text, /Mobile Development Cohort/);
  assert.match(text, /Google AI Professional Certificate/);
  assert.match(text, /Pandas, NumPy, Matplotlib/);
  assert.match(text, /Google Colab/);
  assert.match(text, /Currently learning: Next.js, MongoDB, PostgreSQL/);
  for (const name of summary.learning) assert.ok(!summary.skills.some(group => group.items.includes(name)));
  assert.doesNotMatch(text, /apnea|clinical|A\+ Security|100% test|Cum Laude|Relocate|Bangkit Top Capstone/i);
});
