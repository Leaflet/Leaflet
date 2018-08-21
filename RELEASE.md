Documentation for the release process of Leaflet.

**Please note that you will need to have a git remote called `origin` that points to Leaflet's GitHub repo, since the publish script assumes it**
- [ ] Make a new release branch (for example named `prepare-X.Y.Z`)
- [ ] Make sure you do not have any `package.lock.json` or `yarn.lock` locally, since they can potentially make you build with the wrong package versions
- [ ] Update [the changelog](https://github.com/Leaflet/Leaflet/blob/master/CHANGELOG.md) since last release and commit to the release branch
- [ ] Write a blog post about the new release and put in `/docs/_posts` and commit to the release branch
- [ ] Bump version number in `package.json` and commit to `master`
- [ ] Run `npm run release`
- [ ] Verify that the release was correctly published to NPM by checking:
  - [ ] [Leaflet NPM package page](https://www.npmjs.com/package/leaflet)
  - [ ] files on [Leaflet unpkg page](https://unpkg.com/leaflet@latest/)
- [ ] Update API docs:
  - [ ] run `npm run docs`
  - [ ] Copy the built docs from `dist/reference-X.Y.Z.html` to `docs/reference-X.Y.Z.html`
  - [ ] Update the built docs header to use Jekyll style; see commit [11d716f0964d8bc0d058ca09e9ba8003451b4b8d](https://github.com/Leaflet/Leaflet/commit/11d716f0964d8bc0d058ca09e9ba8003451b4b8d) as reference for the needed changes
  - [ ] Commit the new docs to the release branch
- [ ] Update `docs/reference.html` to redirect to the new version and commit the change to the release branch
- [ ] Update integrity hashes:
  - [ ] Checkout the release tag (`git checkout vX.Y.Z`)
  - [ ] Run `npm run integrity` or simply `node ./build/integrity.js` if you're not on Debian
  - [ ] Copy the hashes and update `integrity_hash_css`, `integrity_hash_source` and `integrity_hash_uglified` in `docs/_config.yml`; commit changes to the release branch
- [ ] Update link to latest release in `docs/download.html`, and commit to the release branch
- [ ] Add link to new version reference in `docs/reference-versions.html`, and commit to the release branch
- [ ] Update `latest_leaflet_version` in `docs/_config.yml` and commit to the release branch
- [ ] Update the announcement section in `docs/index.html` and commit to the release branch
- [ ] If it looks like everything is good at this point, merge the release branch into `master`
- [ ] Make a new release on [Leaflet's GitHub release page](https://github.com/Leaflet/Leaflet/releases/) with the most important parts of the changelog
- [ ] Post an announcement comment in [thread #6295](https://github.com/Leaflet/Leaflet/issues/6295)
