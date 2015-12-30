#!/bin/bash


# USERNAME=knutole@systemapic.com
# PASSWORD=***REMOVED***
# SERVER=dev.systemapic.com
# FILEPATH=/home/r-1e54eed9-0c0d-480c-88a5-decaa4cd35b8-Sag-2010-2340-53670.ecw
# FILEPATH=$1


USERNAME=jorgen@systemapic.com
PASSWORD=***REMOVED***
SERVER=dev.systemapic.com
FILEPATH=/home/r-1e54eed9-0c0d-480c-88a5-decaa4cd35b8-Sag-2010-2340-53670.ecw

# get access token
ACCESS_TOKEN=$(curl -s --header "Authorization: Basic YWJjMTIzOnNzaC1zZWNyZXQ=" --data "grant_type=password&username=$USERNAME&password=$PASSWORD&scope=offline_access" https://$SERVER/oauth/token | jq -r ".access_token")
USERUUID=$(curl -s --header "Authorization: Bearer $ACCESS_TOKEN" https://$SERVER/api/userinfo | jq -r ".user.uuid")

# upload
curl -s --header "Authorization: Bearer $ACCESS_TOKEN" --form "userUuid=$USERUUID" --form "data=@$FILEPATH"  https://$SERVER/api/import

# works! :)