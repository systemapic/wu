#!/bin/bash

if [ "$1" == "prod" ];then
	PRODUCTIONMODE=true
else 
	PRODUCTIONMODE=false	
fi;

cd server

if $PRODUCTIONMODE; then
	echo 'Production mode'
	grunt prod 
	echo 'Running in production mode...'
	forever server.js production
	
else
	echo 'Debug mode'
	grunt dev 
	echo 'Running in development mode...'
	nodemon --watch ../api --watch ../config --watch server.js --watch ../routes server.js
fi
cd ..
