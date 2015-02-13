#!/bin/bash


if [ "$1" == "prod" ];then
	PRODUCTIONMODE=true
	grunt prod
else 
	PRODUCTIONMODE=false
	grunt dev
fi;

cd server

if $PRODUCTIONMODE; then
	echo 'Production mode'
	forever server.js production >> ../log/server.log
else
	echo 'Debug mode'
	nodemon server.js
fi
cd ..
