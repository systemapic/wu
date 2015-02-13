#!/bin/bash

if [ "$1" = "" ]; then
	echo 'Usage: ./git_goodmorning.sh name_of_new_branch'
	exit
fi

cd /var/www/systemapic.js

echo 'Fetching latest...'
git fetch upstream
git merge upstream/master

echo "Creating branch $1..."
git branch $1
git checkout $1
git branch

echo "Done! You're ready to code!"
