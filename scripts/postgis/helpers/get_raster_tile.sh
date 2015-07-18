#!/bin/bash


if [ "$1" == "" ]; then
	echo "Must provide layerUuid;"
	exit 1 # missing args
fi

if [ "$1" == "" ]; then
	echo "Must provide z;"
	exit 1 # missing args
fi

if [ "$1" == "" ]; then
	echo "Must provide x;"
	exit 1 # missing args
fi

if [ "$1" == "" ]; then
	echo "Must provide y;"
	exit 1 # missing args
fi

# access token
USERNAME=foudroyant4@gmail.com
PASSWORD=lokapassord99
ACCESSTOKEN=$(curl --header "Authorization: Basic YWJjMTIzOnNzaC1zZWNyZXQ=" --data "grant_type=password&username=$USERNAME&password=$PASSWORD&scope=offline_access" https://dev.systemapic.com/oauth/token -s | jq -r '.access_token')

# api endpoint 
LAYERUUID=$1
Z=$2
X=$3
Y=$4
ENDPOINT=/tiles
API="https://e.systemapic.com$ENDPOINT/$LAYERUUID/$Z/$X/$Y.png?access_token=$ACCESSTOKEN"

echo $API

curl -s -X GET $API | python -mjson.tool