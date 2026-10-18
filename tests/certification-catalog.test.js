import test from 'node:test';
import assert from 'node:assert/strict';
import { certifications } from '../src/data/certifications.js';
import { mergeCertificationCatalog, mergeCertificationRecords } from '../src/utils/certificationCatalog.js';

const base = certifications.find(item => item.title === 'Programming Assistant Competency');
const upload = {
  id: 'uploaded-certificate',
  title: { en: 'Programming Assistant', id: 'Asisten Pemrograman' },
  issuer: { en: 'Badan Nasional Sertifikasi Profesi', id: 'Badan Nasional Sertifikasi Profesi' },
  date: '2026',
  img: 'https://res.cloudinary.com/example/image/upload/certificate.jpg',
  link: '',
  isPublished: true,
};

test('BNSP upload appears once with its photo and the local description and issue month', () => {
  const result = mergeCertificationCatalog(certifications, [upload]);
  assert.equal(result.length, certifications.length);
  const certificate = result.find(item => item.id === 'cms-uploaded-certificate');
  assert.equal(certificate.img, upload.img);
  assert.deepEqual(certificate.title, upload.title);
  assert.deepEqual(certificate.summary, base.summary);
  assert.equal(certificate.date, 'February 2026');
  assert.equal(certificate.featured, true);
  assert.equal('titleAliases' in certificate, false);
  assert.equal('source' in certificate, false);
});

test('dashboard keeps the editable CMS ID and unpublished overrides hide the local certificate', () => {
  const hidden = { ...upload, isPublished: false, featured: false };
  const records = mergeCertificationRecords([base], [hidden]);
  assert.equal(records.length, 1);
  assert.equal(records[0].id, upload.id);
  assert.equal(records[0].source, 'cms');
  assert.equal(records[0].isPublished, false);
  assert.equal(records[0].featured, false);
  assert.equal(records[0].img, upload.img);
  assert.deepEqual(mergeCertificationCatalog([base], [hidden]), []);
  assert.equal(mergeCertificationRecords([base], [])[0].source, 'local');
});

test('localized aliases match even when the upload only has an Indonesian title', () => {
  assert.equal(mergeCertificationCatalog([base], [{ ...upload, title: { id: '  ASISTEN PEMROGRAMAN ' } }]).length, 1);
});

test('blank fields and translations retain local content while nonempty edits win', () => {
  const local = { ...base, img: '/certificate.webp', link: 'https://example.com/credentials/123' };
  const [result] = mergeCertificationCatalog([local], [{
    ...upload, img: '', summary: { en: 'Updated summary', id: ' ' },
  }]);
  assert.equal(result.img, local.img);
  assert.equal(result.link, local.link);
  assert.deepEqual(result.summary, { en: 'Updated summary', id: base.summary.id });
});

test('different issuers, renewal years and similar titles remain separate credentials', () => {
  for (const override of [
    { issuer: 'Another provider' },
    { date: '2025' },
    { title: 'Programming Assistant Advanced' },
  ]) {
    assert.equal(mergeCertificationCatalog([base], [{ ...upload, ...override }]).length, 2);
  }
});

test('explicit local ID allows a renamed credential without overwriting other records', () => {
  const [result] = mergeCertificationCatalog([base], [{ ...upload, localId: base.id, title: 'Renamed credential', date: 'March 2026' }]);
  assert.equal(result.title, 'Renamed credential');
  assert.equal(result.date, 'March 2026');
  assert.deepEqual(result.summary, base.summary);
  assert.equal(mergeCertificationCatalog([base], [{ ...upload, localId: 'unknown' }]).length, 2);
});

test('ambiguous matches and colliding CMS/local IDs do not discard unrelated certificates', () => {
  assert.equal(mergeCertificationCatalog([base, { ...base, id: 'another-local' }], [upload]).length, 3);
  assert.equal(mergeCertificationCatalog([base], [{ ...upload, id: base.id, title: 'Different certificate' }]).length, 2);
});
