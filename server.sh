#!/bin/bash

# if [ "$1" == "prod" ];then
# 	SYSTEMAPIC_PRODMODE=true
# else 
# 	SYSTEMAPIC_PRODMODE=false	
# fi;


# env set in docker-compose.yml
echo 'Prod mode?'
echo $SYSTEMAPIC_PRODMODE 

cd server


if $SYSTEMAPIC_PRODMODE; then

	echo 'Production mode'
	grunt prod 
	echo 'Running in production mode...'
	forever server.js prod

else
	echo 'Development mode'
	grunt dev 
	grunt watch &
	echo 'Running in development mode...'
	nodemon --watch ../api --watch /systemapic/config --watch server.js --watch ../routes server.js
	
fi

cd ..
