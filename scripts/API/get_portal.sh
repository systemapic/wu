#!/bin/bash

USERNAME=knutole@systemapic.com
PASSWORD=***REMOVED***
SERVER=dev.systemapic.com

# get access token
ACCESS_TOKEN=$(curl -s --header "Authorization: Basic YWJjMTIzOnNzaC1zZWNyZXQ=" --data "grant_type=password&username=$USERNAME&password=$PASSWORD&scope=offline_access" https://$SERVER/oauth/token | jq -r ".access_token")

# get account
curl --header "Authorization: Bearer $ACCESS_TOKEN" --data "gzip=false" https://$SERVER/api/portal
