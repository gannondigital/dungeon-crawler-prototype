#!/usr/bin/env bash

push to github pages script

# builds app in /dist folder
cp ./src/index.html ./dist/index.html && webpack

# creates backup not tracked in git
mkdir ./dist-backup && cp ./dist/* ./dist-backup/

# switch to gh-pages branch
git checkout gh-pages

# replace root of gh-pages with built app from backup
cp ./dist-backup/* ./

# remove backup
rm -r ./dist-backup

# show changes to be published
git status

echo "you are now on the gh-pages branch. Commit and push to update with published changes."