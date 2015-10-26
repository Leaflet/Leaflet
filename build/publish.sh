#!/bin/bash

npm update

VERSION=$(node --eval "console.log(require('./package.json').version);")

npm test || exit 1

git checkout -b build

npm run build
git add dist/leaflet-src.js dist/leaflet.js dist/leaflet-src.map -f

git commit -m "v$VERSION"

git tag v$VERSION -f
git push --tags -f

npm publish --tag beta

git checkout master
git branch -D build
