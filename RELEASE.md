## Releasing a new version of Leaflet

- [ ] Ensure all https://github.com/Leaflet/Leaflet/labels/blocker issues and pull requests are resolved.
- [ ] Update [the changelog](https://github.com/Leaflet/Leaflet/blob/main/CHANGELOG.md) since last release and commit.
- [ ] Make sure all tests pass on CI before proceeding.
- [ ] Run `npm version <patch | minor | major>` (this will bump the version in `package.json` and create a new tag).
- [ ] Run `git push --follow-tags` to push the commit created by NPM to Github (together with the tag).
- [ ] Wait for the CI to complete and follow the logs to make sure it runs successfully.
- [ ] Verify that the release was correctly published to NPM by checking:
  - [ ] [Leaflet NPM package page](https://www.npmjs.com/package/leaflet)
  - [ ] files on [Leaflet unpkg page](https://unpkg.com/leaflet@latest/)
- [ ] Make a new release on [Leaflet's GitHub release page](https://github.com/Leaflet/Leaflet/releases/) with the most important parts of the changelog
- [ ] Download zip archive from https://leafletjs-cdn.s3.amazonaws.com/content/leaflet/vX.X.X/leaflet.zip (where `X.X.X` is the new version number) and upload it as an "asset" of the GitHub release.

### Updating docs after the release

- [ ] Make a new branch for the update
- [ ] Write a blog post about the new release and put it in `/docs/_posts/`
- [ ] [Click here to save a snapshot](https://web.archive.org/save/https://leafletjs.com/reference.html)
of the version of docs prior to this release to the Internet Archive's Wayback Machine
(and optionally, add a link to the snapshot in `docs/reference-versions.html`).
- [ ] Run `npm run docs` to generate the new `docs/reference.html` and update integrity hashes in `docs/_config.yml`
- [ ] Update link to latest release in `docs/download.md`
- [ ] Update the announcement section in `docs/index.html`
- [ ] Commit all the changes and submit a PR for someone to review
