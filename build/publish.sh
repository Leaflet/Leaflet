#!/bin/bash

# get current version
VERSION=$(node --eval "console.log(require('./package.json').version);")

# Build
git checkout -b build
npm test || exit 1
npm run prepublish
git add dist/leaflet-src.js dist/leaflet.js -f

# create the bower and component files
copyfiles -u 1 build/*.json ./
tin -v $VERSION
git add component.json bower.json -f

git commit -m "build v$VERSION"

# Tag and push
echo git tag v$VERSION
git push --tags

# # # Cleanup
# git checkout master
# git branch -D build
