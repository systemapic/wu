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
	forever server.js production >> ../log/server.log
else
	echo 'Debug mode'
	grunt dev
	nodemon server.js
fi
cd ..
