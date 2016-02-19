#!/bin/bash

# source config
source /systemapic/config/env.sh

# ensure npm modules are installed
echo 'Installing modules...'
npm install

# start prodmode
if $SYSTEMAPIC_PRODMODE; then
	cd server
	echo 'Production mode'
	grunt prod 
	echo 'Running in production mode...'
	forever server.js prod

# start dev mode
else
	cd server
	echo 'Development mode'
	grunt dev 
	grunt watch &
	echo 'Running in development mode...'
	nodemon --watch ../api --watch /systemapic/config --watch server.js --watch ../routes server.js
fi
cd ..