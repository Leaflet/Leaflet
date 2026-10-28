## Releasing a new version of Leaflet

- [ ] Ensure all https://github.com/Leaflet/Leaflet/labels/blocker issues and pull requests are resolved.
- [ ] Update [the changelog](https://github.com/Leaflet/Leaflet/blob/main/CHANGELOG.md) since last release and commit.
- [ ] Make sure all tests pass on CI before proceeding.
- [ ] Run `npm version <patch | minor | major>` (this will bump the version in `package.json` and create a new tag).
- [ ] Run `git push --follow-tags` to push the commit created by NPM to Github (together with the tag).
- [ ] Wait for the CI to complete and follow the logs to make sure it runs successfully.
- [ ] Verify that the release was correctly published to NPM by checking:
  - [ ] [Leaflet NPM package page](https://www.npmjs.com/package/leaflet)
  - [ ] files on [Leaflet jsDelivr page](https://cdn.jsdelivr.net/npm/leaflet@latest/)
- [ ] Make a new release on [Leaflet's GitHub release page](https://github.com/Leaflet/Leaflet/releases/) with the most important parts of the changelog
- [ ] Run `npm run zip` and upload `dist/leaflet.zip` as an "asset" of the GitHub release (the download page links to it).

### Updating docs after the release

- [ ] Make a new branch for the update
- [ ] Write a blog post about the new release and put it in `/docs/_posts/`
- [ ] Run `npm run pin-release` to update the version, integrity hashes and the API reference commit in `build/site.json`
- [ ] Update the table of contents in `docs/reference-2.0.0.html` if classes were added, removed or renamed
- [ ] Update link to latest release in `docs/download.md` and the announcement section in `docs/index.html`
(until 2.0 is released, the site takes these two pages from the `v1` branch: change them there and update `refs.v1` in `build/site.json` to the new commit)
- [ ] Commit all the changes and submit a PR for someone to review
