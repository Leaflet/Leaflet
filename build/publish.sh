#!/bin/bash

# get current version
VERSION=$(node --eval "console.log(require('./package.json').version);")

# Build
git checkout -b build
npm test || exit 1
npm run prepublish
git add dist/leaflet-src.js dist/leaflet.js -f

# create the bower and component files
node_modules/copyfiles/copyfiles -u 1 build/*.json ./
node_modules/tin/bin/tin -v $VERSION
git add component.json bower.json -f

git commit -m "build v$VERSION"

# Tag and push
git tag v$VERSION
git push --tags --force

# # # Cleanup
git checkout stable
git branch -D build
