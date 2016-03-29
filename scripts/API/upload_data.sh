#!/bin/bash

# enter your details here
# ------------------------------------------

# access details
USERNAME=email@address.com
PASSWORD=mysecretpassword

# file
FILEPATH=/home/tsx_tiny.tar.gz


# no need to change anything below this line
# ------------------------------------------

# API 
API_SERVER="https://maps.globesar.com"
API_IMPORT="v2/data/import"
API_TOKEN="v2/users/token"
API_USERINFO="v2/users/info"

# get access token
ACCESS_TOKEN=$(curl -s -X GET "$API_SERVER/$API_TOKEN/?grant_type=password&username=$USERNAME&password=$PASSWORD" | jq -r ".access_token")

# upload
curl -s --form "data=@$FILEPATH" --form "access_token=$ACCESS_TOKEN" $API_SERVER/$API_IMPORT

# works! :)