#!/bin/bash

npm update

VERSION=$(node --eval "console.log(require('./package.json').version);")

npm test || exit 1

echo "Ready to publish Leaflet version $VERSION."
echo "Has the version number been bumped?"
read -n1 -r -p "Press Ctrl+C to cancel, or any other key to continue." key

git checkout -b build

export NODE_ENV=release

npm run-script build

echo "Creating git tag v$VERSION..."

git add dist/leaflet-src.js dist/leaflet.js dist/leaflet-src.esm.js dist/leaflet-src.js.map dist/leaflet.js.map dist/leaflet-src.esm.js.map -f

git commit -m "v$VERSION"

git tag v$VERSION -f
git push --tags -f

echo "Uploading to NPM..."

npm publish

git checkout master
git branch -D build

echo "All done."
echo "Remember to run 'npm run-script integrity' and then commit the changes to the master branch, in order to update the website."
