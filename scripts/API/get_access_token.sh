#!/bin/bash

USERNAME=knutole@systemapic.com
PASSWORD=***REMOVED***
SERVER=dev.systemapic.com

# get access token
ACCESS_TOKEN=$(curl -s --data "grant_type=password&username=$USERNAME&password=$PASSWORD" https://$SERVER/api/token | jq -r ".access_token")

# print access token
echo $ACCESS_TOKEN