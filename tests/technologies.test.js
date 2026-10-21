import test from 'node:test';
import assert from 'node:assert/strict';
import { technologyDetails, toTechnologyEntry } from '../src/utils/technologies.js';
import { mergeProjectCatalog } from '../src/utils/projectCatalog.js';
import { projects } from '../src/data/projects.js';
import { technologyIcons } from '../src/utils/orbitIcons.js';

test('technology aliases ignore case, whitespace and punctuation', () => {
  for (const [input, canonical] of [[' react.js ', 'React'], ['NODE JS', 'Node.js'], ['tailwind', 'Tailwind CSS'], ['html', 'HTML5'], ['css', 'CSS3'], ['sklearn', 'Scikit-Learn'], ['C Sharp', 'C#']]) {
    assert.equal(technologyDetails(input).icon, technologyDetails(canonical).icon);
  }
  assert.notEqual(technologyDetails('C++').icon, technologyDetails('C#').icon);
});

test('legacy generic or incorrect CMS icons are resolved by technology name', () => {
  assert.equal(technologyDetails({ name: 'HTML5', icon: 'fas fa-code' }).icon, 'devicon-html5-plain');
  assert.equal(technologyDetails({ name: 'Scikit-Learn', icon: 'devicon-python-plain' }).icon, 'devicon-scikitlearn-plain');
});

test('admin entries retain automatic logos through the published catalog', () => {
  const names = ['React.js', 'Firebase', 'Tailwind', 'My custom engine'];
  const [published] = mergeProjectCatalog([], [{ id: 'admin-preview', isPublished: true, title: 'Preview', techStack: names.map(toTechnologyEntry) }]);
  assert.deepEqual(published.techStack.map(technologyDetails).map(tech => tech.icon), ['devicon-react-plain', 'devicon-firebase-plain', 'devicon-tailwindcss-plain', 'fas fa-code']);
  assert.deepEqual(published.techStack.map(tech => tech.name), names);
});

test('unrecognized and malformed entries have a safe local fallback', () => {
  for (const value of [null, undefined, {}, { name: 42 }, 'New technology', { name: 'Unknown', icon: 'https://example.com/tracker.svg' }]) {
    assert.equal(technologyDetails(value).icon, 'fas fa-code');
    assert.equal(typeof technologyDetails(value).name, 'string');
  }
});

test('every existing portfolio technology has a registered logo or semantic icon', () => {
  for (const project of projects) {
    for (const technology of project.techStack || []) {
      assert.notEqual(technologyDetails(technology).icon, 'fas fa-code', `${project.id}: ${technology.name}`);
    }
  }
});

test('every 3D tech orbit technology has a registered SVG path', () => {
  const expectedKeys = ['kotlin', 'react', 'python', 'threejs', 'tailwind', 'firebase'];
  for (const key of expectedKeys) {
    assert.equal(typeof technologyIcons[key], 'string', `Missing SVG path for ${key}`);
    assert.ok(technologyIcons[key].length > 10, `SVG path for ${key} is too short`);
  }
});

