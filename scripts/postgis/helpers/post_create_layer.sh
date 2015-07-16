#!/bin/bash


if [ "$1" == "" ]; then
	echo "Must provide fileUuid as first argument,"
	echo "eg. get_file_object.sh file-b8219271-8caf-4da5-b1d3-47575fac1df1"
	echo ""
	exit 1 # missing args
fi

# access token
USERNAME=foudroyant4@gmail.com
PASSWORD=lokapassord99
ACCESSTOKEN=$(curl --header "Authorization: Basic YWJjMTIzOnNzaC1zZWNyZXQ=" --data "grant_type=password&username=$USERNAME&password=$PASSWORD&scope=offline_access" https://dev.systemapic.com/oauth/token -s | jq -r '.access_token')

# api endpoint 
FILEUUID=$1
ENDPOINT=/api/db/createLayer
API="https://dev.systemapic.com$ENDPOINT"
SQL="SELECT count(*) FROM table"
JSON='{"fileUuid" : "'$1'", "sql" : "SELECT count(*) FROM table", "cartocss" : "#layer {}", "access_token" : "'$ACCESSTOKEN'"}'

echo $JSON
# curl -s -X GET $API | python -mjson.tool

curl -s -H "Content-Type: application/json" -X POST -d "$JSON" $API | python -mjson.tool