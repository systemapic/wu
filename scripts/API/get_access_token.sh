#!/bin/bash

USERNAME=knutole@systemapic.com
PASSWORD=92f5422658601ae9f23b4921b4bd6b8e
SERVER=dev.systemapic.com

# get access token
ACCESS_TOKEN=$(curl -s --header "Authorization: Basic YWJjMTIzOnNzaC1zZWNyZXQ=" --data "grant_type=password&username=$USERNAME&password=$PASSWORD" https://$SERVER/oauth/token | jq -r ".access_token")

# print access token
echo $ACCESS_TOKEN