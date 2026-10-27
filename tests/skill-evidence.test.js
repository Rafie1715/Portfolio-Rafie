import test from 'node:test';
import assert from 'node:assert/strict';
import { projectsForSkill, skillSources } from '../src/utils/skillEvidence.js';
import { projects } from '../src/data/projects.js';
import { certifications } from '../src/data/certifications.js';

test('skill selection resolves React aliases and only returns projects in the supplied catalog', () => {
  const catalog = [{ id: 'react', techStack: [{name: 'React'}] }, { id: 'next', techStack: ['Next.js'] }];
  assert.deepEqual(projectsForSkill(catalog, 'React.js').map(p => p.id), ['react']);
  assert.deepEqual(projectsForSkill([], 'React.js'), []);
  assert.deepEqual(projectsForSkill([{ id: 'missing' }], 'Kotlin'), []);
});

test('featured skills lead to actual portfolio evidence without inventing Next.js experience', () => {
  for (const skill of ['Kotlin', 'React.js', 'Python', 'Firebase', 'Figma']) {
    assert.ok(projectsForSkill(projects, skill).length > 0, skill);
  }
  assert.ok(projectsForSkill(projects, 'Kotlin').some(p => p.slug === 'restup'));
  assert.ok(projectsForSkill(projects, 'Kotlin').some(p => p.id === 'mandiri-news'));
  assert.deepEqual(projectsForSkill(projects, 'Next.js'), []);
  assert.deepEqual(projectsForSkill(projects, 'Java'), projects.filter(p => p.id === 'library-system'));
  assert.deepEqual(projectsForSkill(projects, 'IntelliJ IDEA'), projects.filter(p => p.id === 'library-system'));
  assert.deepEqual(projectsForSkill(projects, 'SQL'), projects.filter(p => p.id === 'computer-crafter'));
  assert.deepEqual(projectsForSkill(projects, 'C#'), projects.filter(p => p.id === 'green-sort-unity'));
  assert.deepEqual(projectsForSkill(projects, 'Unity'), projects.filter(p => p.id === 'green-sort-unity'));
  assert.deepEqual(projectsForSkill(projects, 'C++'), []);
  assert.deepEqual(projectsForSkill(projects, 'Linux'), []);
});

test('previously verified XML and Compose source evidence remains available', () => {
  assert.ok(skillSources['XML layouts'][0].href.includes('MandiriNewsApp/tree/main/app/src/main/res/layout'));
  assert.ok(skillSources['Jetpack Compose'][0].href.includes('RupiahVision/blob/main/'));
});

test('confirmed workflow tools include all public projects for Git and only websites for VS Code', () => {
  assert.deepEqual(projectsForSkill(projects, 'Git'), projects);
  assert.deepEqual(projectsForSkill(projects, 'GitHub'), projects);
  const web = projectsForSkill(projects, 'VS Code');
  assert.ok(web.some(project => project.id === 'portfolio-website'));
  assert.ok(web.some(project => project.id === 'computer-crafter'));
  assert.ok(web.every(project => project.category === 'web'));
});

test('AI workflow evidence is limited to the portfolio and uses the existing Google credential', () => {
  const certificate = certifications.find(item => item.title === 'Google AI Professional Certificate');
  for (const name of ['Prompt Engineering', 'Generative AI']) {
    assert.deepEqual(projectsForSkill(projects, name).map(project => project.id), ['portfolio-website']);
    assert.equal(skillSources[name][0].href, certificate.link);
    assert.equal(skillSources[name][0].label, certificate.title);
  }
  for (const name of ['Git', 'GitHub', 'VS Code', 'Prompt Engineering', 'Generative AI']) {
    assert.deepEqual(projectsForSkill([], name), []);
    assert.ok(projectsForSkill(projects.filter(project => project.id !== 'portfolio-website'), name).every(project => project.id !== 'portfolio-website'));
  }
});
