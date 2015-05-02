#!/bin/bash
BRANCH=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 5 | head -n 1)
git branch $BRANCH
git checkout $BRANCH
git add .
git commit -m "$1"
git push origin $BRANCH