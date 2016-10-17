#!/bin/bash

# enter your details here
# ------------------------------------------

# access details
USERNAME=knutole@systemapic.com
PASSWORD=REDACTED

# file
FILEPATH=/home/rasters/SCF_MOD_2014_008.tif


# no need to change anything below this line
# ------------------------------------------

# API 
API_SERVER="https://dev.systemapic.com"
API_IMPORT="v2/data/import"
API_TOKEN="v2/users/token"
API_USERINFO="v2/users/info"

# get access token
ACCESS_TOKEN=$(curl -s -X GET "$API_SERVER/$API_TOKEN/?grant_type=password&username=$USERNAME&password=$PASSWORD" | jq -r ".access_token")

# upload
curl -s --form "data=@$FILEPATH" --form "access_token=$ACCESS_TOKEN" $API_SERVER/$API_IMPORT

# works! :)