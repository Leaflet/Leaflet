#!/bin/bash

VERSION=$(node --eval "console.log(require('./package.json').version);")

# # create build, zip, bower and component artifacts
npm run build

cd dist && zip -x .DS_Store -r leaflet.zip . && cd ..

# cp build/*.json ./
tin -v $VERSION
