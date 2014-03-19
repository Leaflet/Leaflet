#!/bin/bash

#make sure deps are up to date
rm -r node_modules
npm install

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

git commit -m "build $VERSION"

# Tag and push
echo git tag $VERSION
# git push --tags git@github.com:leaflet/leaflet.git $VERSION

# # # Publish JS modules
# npm publish

# # # Cleanup
# git checkout master
# git branch -D build