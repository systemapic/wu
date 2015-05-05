#!/bin/bash

if [ "$1" == "prod" ];then
	PRODMODE=true
else 
	PRODMODE=false	
fi;

cd server

if $PRODMODE; then
	echo 'Production mode'
	grunt prod 
	echo 'Running in production mode...'
	forever server.js prod
else
	echo 'Debug mode'
	grunt dev 
	echo 'Running in development mode...'
	nodemon --watch ../api --watch ../config --watch server.js --watch ../routes server.js
fi

cd ..
