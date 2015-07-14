#!/bin/bash


if [ "$1" == "" ]; then
	echo "Must provide upload_id as first argument,"
	echo "eg. get_upload_status.sh ijotqnslmnnjjiac"
	echo ""
	exit 1 # missing args
fi

# access token
USERNAME=foudroyant4@gmail.com
PASSWORD=lokapassord99
ACCESSTOKEN=$(curl --header "Authorization: Basic YWJjMTIzOnNzaC1zZWNyZXQ=" --data "grant_type=password&username=$USERNAME&password=$PASSWORD&scope=offline_access" https://dev.systemapic.com/oauth/token -s | jq -r '.access_token')

# api endpoint 
UPLOAD_ID=$1
ENDPOINT="https://dev.systemapic.com/api/data/uploadStatus?upload_id=$UPLOAD_ID&access_token=$ACCESSTOKEN"

curl -s -X GET $ENDPOINT | python -mjson.tool