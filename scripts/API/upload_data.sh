#!/bin/bash


USERNAME=your_email
PASSWORD=your_password
SERVER=maps.globesar.com
FILEPATH=/home/tsx_huge.tar.gz

# get access token
ACCESS_TOKEN=$(curl -s --header "Authorization: Basic YWJjMTIzOnNzaC1zZWNyZXQ=" --data "grant_type=password&username=$USERNAME&password=$PASSWORD&scope=offline_access" https://$SERVER/oauth/token | jq -r ".access_token")
USERUUID=$(curl -s --header "Authorization: Bearer $ACCESS_TOKEN" https://$SERVER/api/userinfo | jq -r ".user.uuid")

# upload
curl -s --header "Authorization: Bearer $ACCESS_TOKEN" --form "userUuid=$USERUUID" --form "data=@$FILEPATH"  https://$SERVER/api/import

# works! :)