#!/bin/bash

echo "Install script for PostGIS."
echo "Please make sure you are in a working directory. All dependencies will be installed here."
read -p "Are you ready to continue? <y/N> " prompt
if [[ $prompt == "y" || $prompt == "Y" || $prompt == "yes" || $prompt == "Yes" ]]
then
  # http://stackoverflow.com/questions/1537673/how-do-i-forward-parameters-to-other-command-in-bash-script


sudo apt-get update
echo "Adding repositories"
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt trusty-pgdg main" >> /etc/apt/sources.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get upgrade

echo "Installing: dependencies..."
sudo apt-get install software-properties-common python-software-properties

echo "Installing: postgresql..."
sudo apt-get install postgresql-9.4 postgresql-client-9.4 postgresql-contrib-9.4 libpq-dev postgresql-server-dev-9.4
sudo apt-get install binutils libproj-dev libgeoip1 libgtk2.0 xsltproc docbook-xsl docbook-mathml
sudo apt-get install build-essential python-all-dev git vim python-dev python-pip\
 python-software-properties g++ gcc make libssl-dev libreadline6-dev libaio-dev libbz2-dev\
 zlib1g-dev libjpeg62-dev libpcre3-dev libexpat1-dev libxml2 libxml2-dev libjson0\
 libjson0-dev liblzma-dev libevent-dev wget zip unzip osm2pgsql


echo "Installing: geos..."
wget http://download.osgeo.org/geos/geos-3.4.2.tar.bz2
tar xfj geos-3.4.2.tar.bz2
cd geos-3.4.2
./configure
make
sudo make install
cd ..

echo "Installing: gdal..."
wget http://download.osgeo.org/gdal/1.10.1/gdal-1.10.1.tar.gz
tar xfz gdal-1.10.1.tar.gz
cd gdal-1.10.1
./configure --with-python
make
sudo make install
cd ..

echo "Installing: postgis..."
wget http://postgis.net/stuff/postgis-2.2.0dev.tar.gz
tar xvfz postgis-2.2.0dev.tar.gz
cd postgis-2.2.0dev
./configure
make
make install
cd ..


else
  exit 0
fi



