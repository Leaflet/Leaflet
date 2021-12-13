## Releasing a new version of Leaflet

- [ ] Update [the changelog](https://github.com/Leaflet/Leaflet/blob/master/CHANGELOG.md) since last release and commit.
- [ ] Run `npm version <patch | minor | major>` (this will bump the version in `package.json` and create a new tag).
- [ ] Run `git push --follow-tags` to push the commit created by NPM to Github (together with the tag).
- [ ] Wait for the CI to complete and follow the logs to make sure it runs successfully.
- [ ] Verify that the release was correctly published to NPM by checking:
  - [ ] [Leaflet NPM package page](https://www.npmjs.com/package/leaflet)
  - [ ] files on [Leaflet unpkg page](https://unpkg.com/leaflet@latest/)
- [ ] Make a new release on [Leaflet's GitHub release page](https://github.com/Leaflet/Leaflet/releases/) with the most important parts of the changelog

### Updating docs after the release

- [ ] Make a new branch for the update
- [ ] Write a blog post about the new release and put it in `/docs/_posts`
- [ ] If necessary to preserve previous version's docs, rename `dist/reference.html` to `dist/reference-X.Y.Z.html` and add it to the list in `docs/reference-versions.html`
- [ ] Run `npm run docs` to generate the new `docs/reference.html`
- [ ] Run `npm run integrity` and make sure `docs/_config.yml` is updated with new hashes
- [ ] Update link to latest release in `docs/download.md`
- [ ] Update the announcement section in `docs/index.html`
- [ ] Commit all the changes and submit a PR for someone to review
