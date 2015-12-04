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
	echo 'Development mode'
	grunt dev 
	grunt watch &
	echo 'Running in development mode...'
	# nodemon --watch ../api --watch ../config --watch server.js --watch ../routes server.js
	
	# cd ..
	# forever -w --watchIgnore '!{server.js,{api,config,routes}/**}' --workingDir server/ server/server.js
	# forever -w --watchIgnore '!{server.js}' server.js

	# prod mode:
	forever server.js
	
fi

cd ..
