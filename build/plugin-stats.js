// Writes stars and last commit dates of the plugin repos to build/plugin-stats.json, keyed by the `repo` URL of each
// plugin, for the plugins page. Fetches only the repos missing from the existing file, or all of them with --refresh.
// Needs GITHUB_TOKEN, or falls back to `gh auth token`.

import {readFileSync, writeFileSync, existsSync, readdirSync} from 'node:fs';
import {execSync} from 'node:child_process';
import {join} from 'node:path';
import {parse as parseYaml} from '@mourner/yeahml';

const OUT = 'build/plugin-stats.json';
const DIR = 'docs/_plugins';
const FRONT_MATTER = /^---\r?\n([\s\S]*?\r?\n)?---\r?\n/;
const GITHUB_RE = /^https?:\/\/(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/#?]|$)/i;
const GITLAB_RE = /^https?:\/\/(?:www\.)?gitlab\.com\/(.+?)\/?$/i;
const BATCH = 50;

const refresh = process.argv.includes('--refresh');
const old = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};

const repos = new Set();
// files in the root of the directory, like the template, aren't plugins
for (const file of readdirSync(DIR, {recursive: true}).filter(f => f.endsWith('.md') && f.includes('/'))) {
	const data = parseYaml(readFileSync(join(DIR, file), 'utf8').match(FRONT_MATTER)?.[1] ?? '');
	if (data?.repo) { repos.add(data.repo); }
}

// drops the repos no plugin links to anymore
const stats = {};
if (!refresh) {
	for (const repo of repos) { if (old[repo]) { stats[repo] = old[repo]; } }
}
const todo = [...repos].filter(repo => !stats[repo]);
const github = todo.map(url => ({url, m: url.match(GITHUB_RE)})).filter(r => r.m);
const gitlab = todo.map(url => ({url, m: url.match(GITLAB_RE)})).filter(r => r.m);

if (github.length) {
	const token = process.env.GITHUB_TOKEN || execSync('gh auth token').toString().trim();

	// each query of up to 50 repos costs 1 point of the GraphQL rate limit; sent one at a time to go easy on the API
	for (let i = 0; i < github.length; i += BATCH) {
		const batch = github.slice(i, i + BATCH);
		const query = `{${batch.map(({m}, j) => `r${j}: repository(owner: ${JSON.stringify(m[1])}, name: ${JSON.stringify(m[2])}) {
			stargazerCount pushedAt defaultBranchRef { target { ... on Commit { committedDate } } }
		}`).join('\n')}}`;
		// eslint-disable-next-line no-await-in-loop
		const data = await queryGitHub(query, token);
		batch.forEach(({url}, j) => {
			const r = data?.[`r${j}`];
			// pushedAt also counts pushes to other branches (Dependabot, gh-pages), so it's only a fallback
			if (r) { stats[url] = {stars: r.stargazerCount, updated: r.defaultBranchRef?.target?.committedDate ?? r.pushedAt}; }
		});
	}
}

// unauthenticated, so sent one at a time to stay clear of the GitLab rate limits
for (const {url, m} of gitlab) {
	const api = `https://gitlab.com/api/v4/projects/${encodeURIComponent(m[1])}`;
	// eslint-disable-next-line no-await-in-loop
	const [project, commits] = [await fetchJson(api), await fetchJson(`${api}/repository/commits?per_page=1`)];
	if (project) { stats[url] = {stars: project.star_count, updated: commits?.[0]?.committed_date ?? project.last_activity_at}; }
}

// keeps the last known stats of the repos that failed to fetch this time
for (const repo of todo) { if (!stats[repo] && old[repo]) { stats[repo] = old[repo]; } }

const sorted = Object.fromEntries(Object.keys(stats).sort().map(k => [k, stats[k]]));
writeFileSync(OUT, `${JSON.stringify(sorted, null, '\t')}\n`);
console.log(`Fetched ${github.length + gitlab.length} repos; stats for ${Object.keys(stats).length} of ${repos.size} plugins in ${OUT}`);

async function fetchJson(url) {
	const res = await fetch(url);
	return res.ok ? res.json() : null;
}

async function queryGitHub(query, token) {
	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST', headers: {authorization: `bearer ${token}`}, body: JSON.stringify({query})
	});
	if (!res.ok) { throw new Error(`GitHub API: ${res.status} ${await res.text()}`); }
	return (await res.json()).data;
}
