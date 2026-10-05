import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/data/projects.js';
import { blogs } from '../src/data/blogs.js';
import { mergeProjectCatalog } from '../src/utils/projectCatalog.js';
import { findProjectByRoute, projectPath, projectRedirects, projectSlug } from '../src/utils/projectRoutes.js';

test('every public project has a unique lowercase path and still resolves by legacy ID', () => {
  const catalog = mergeProjectCatalog(projects, []);
  assert.equal(catalog.length, 17);
  assert.equal(new Set(catalog.map(projectPath)).size, catalog.length);
  for (const project of catalog) {
    assert.equal(projectPath(project), projectPath(project).toLowerCase());
    assert.equal(findProjectByRoute(catalog, projectSlug(project))?.id, project.id);
    assert.equal(findProjectByRoute(catalog, project.id.toLowerCase())?.id, project.id);
  }
  assert.equal(projectPath('OD60ttuTSwZW62TRJFm6'), '/project/restup');
  assert.equal(findProjectByRoute(catalog, 'not-a-project'), undefined);
});

test('RestUP redirect covers old mixed-case and normalized links, including trailing slash', () => {
  const redirects = projectRedirects(mergeProjectCatalog(projects, []));
  for (const id of ['OD60ttuTSwZW62TRJFm6', 'od60ttutswzw62trjfm6']) {
    for (const suffix of ['', '/']) assert.ok(redirects.includes(`/project/${id}${suffix} /project/restup 301!`));
  }
  assert.equal(redirects.some(line => line.startsWith('/project/restup ')), false);
});

test('CMS document aliases resolve without changing database IDs, and unpublishing removes routes', () => {
  const source = [{ id: 'project-one', slug: 'readable-slug', title: 'One' }];
  const cms = { id: 'NewDatabaseId', localId: 'project-one', slug: 'changed', isPublished: true };
  const catalog = mergeProjectCatalog(source, [cms]);
  assert.equal(catalog[0].id, 'project-one');
  assert.equal(projectPath(catalog[0]), '/project/readable-slug');
  assert.equal(findProjectByRoute(catalog, 'newdatabaseid')?.id, 'project-one');
  assert.equal(projectRedirects(catalog).length, 6);
  assert.deepEqual(mergeProjectCatalog(source, [{ ...cms, isPublished: false }]), []);
});

test('ambiguous routes fail instead of silently pointing to the wrong case study', () => {
  const catalog = [{ id: 'CaseId' }, { id: 'caseid' }];
  assert.equal(findProjectByRoute(catalog, 'caseid'), undefined);
  assert.throws(() => projectRedirects(catalog), /Duplicate/);
});

test('reviewed claims and source links stay consistent across case studies and engineering notes', () => {
  assert.ok(projects.find(p => p.id === 'mandiri-news').github.endsWith('/MandiriNewsApp'));
  assert.equal(projects.find(p => p.id === 'planetku').impactDetails.role.en, 'Android Developer');
  assert.doesNotMatch(JSON.stringify(projects.find(p => p.id === 'computer-crafter')), /100%/);
  assert.match(projects.find(p => p.id === 'cinemazone').lessonLearned.en, /simultaneous booking requests is an area for further development/);
  assert.doesNotMatch(JSON.stringify(blogs.find(b => b.projectId === 'planetku')), /Mobile Development Lead|reward and point|optimize the TensorFlow/);
  for (const project of projects) {
    if (project.galleryCaptions) assert.equal(project.galleryCaptions.length, project.gallery.length);
  }
});
