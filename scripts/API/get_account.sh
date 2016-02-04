#!/bin/bash

USERNAME=knutole@systemapic.com
PASSWORD=***REMOVED***
SERVER=dev.systemapic.com

# get access token
ACCESS_TOKEN=$(curl -s --data "grant_type=password&username=$USERNAME&password=$PASSWORD" https://$SERVER/api/token | jq -r ".access_token")

# get account
USER=$(curl -s --data "access_token=$ACCESS_TOKEN" https://$SERVER/api/user/info)

echo $USER