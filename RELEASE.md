## Releasing a new version of Leaflet

- [ ] Update [the changelog](https://github.com/Leaflet/Leaflet/blob/master/CHANGELOG.md) since last release and commit
- [ ] Run `npm version <patch | minor | major>`
- [ ] Run `npm publish`
- [ ] Verify that the release was correctly published to NPM by checking:
  - [ ] [Leaflet NPM package page](https://www.npmjs.com/package/leaflet)
  - [ ] files on [Leaflet unpkg page](https://unpkg.com/leaflet@latest/)
- [ ] Make a new release on [Leaflet's GitHub release page](https://github.com/Leaflet/Leaflet/releases/) with the most important parts of the changelog

### Updating docs after the release

- [ ] Make a new branch for the update
- [ ] Write a blog post about the new release and put in `/docs/_posts`
- [ ] Update API docs:
  - [ ] run `npm run docs`
  - [ ] Copy the built docs from `dist/reference-X.Y.Z.html` to `docs/reference-X.Y.Z.html`, remove content before first and after second "CUT HERE" comment
  - [ ] Insert YAML front matter, see old `docs/reference-X.Y.Z.html` for reference
- [ ] Update `docs/reference.html` to redirect to the new version
- [ ] Run `npm run integrity` and make sure `docs/_config.yml` is updated with new hashes
- [ ] Update link to latest release in `docs/download.md`
- [ ] Add link to new version reference in `docs/reference-versions.html`
- [ ] Update `latest_leaflet_version` (and possibly `latest_leaflet_reference`) in `docs/_config.yml`
- [ ] Update the announcement section in `docs/index.html`
- [ ] Commit all the changes and submit a PR for someone to review
