#!/bin/bash
echo 'Updating latest...'
apt-get update
apt-get upgrade -y

echo 'Installing system tools...'
apt-get install bmon nmon git curl wget fish htop -y

echo 'Creating /var/www'
mkdir /var/www
cd /var/www

sudo apt-get update -y
echo "Adding repositories"
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" >> /etc/apt/sources.list.d/postgresql.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update -y
sudo apt-get upgrade -y

echo "Installing: dependencies..."
sudo apt-get install software-properties-common python-software-properties -y

echo "Installing: postgresql..."
sudo apt-get install postgresql-9.4 postgresql-client-9.4 postgresql-contrib-9.4 libpq-dev postgresql-server-dev-9.4
sudo apt-get install binutils libproj-dev libgeoip1 libgtk2.0 xsltproc docbook-xsl docbook-mathml
sudo apt-get install build-essential python-all-dev git vim python-dev python-pip\
 python-software-properties g++ gcc make libssl-dev libreadline6-dev libaio-dev libbz2-dev\
 zlib1g-dev libjpeg62-dev libpcre3-dev libexpat1-dev libxml2 libxml2-dev libjson0\
 libjson0-dev liblzma-dev libevent-dev wget zip unzip -y


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


echo "Installing Mapnik"
sudo add-apt-repository ppa:mapnik/boost -y
sudo apt-get update -y
sudo apt-get install libboost-dev libboost-filesystem-dev libboost-program-options-dev libboost-python-dev libboost-regex-dev libboost-system-dev libboost-thread-dev -y
apt-get update
apt-get upgrade -y

echo "Installing Mapnik dependencies"
apt-get install libtiff5 libtiff5-dev -y
sudo apt-get install \
    libboost-filesystem-dev \
    libboost-program-options-dev \
    libboost-python-dev libboost-regex-dev \
    libboost-system-dev libboost-thread-dev -y

sudo apt-get install \
    libicu-dev \
    python-dev libxml2 libxml2-dev \
    libfreetype6 libfreetype6-dev \
    libjpeg-dev \
    libpng-dev \
    libproj-dev \
    libtiff-dev \
    libcairo2 libcairo2-dev python-cairo python-cairo-dev \
    libcairomm-1.0-1 libcairomm-1.0-dev \
    ttf-unifont ttf-dejavu ttf-dejavu-core ttf-dejavu-extra \
    git build-essential python-nose \
    libgdal1-dev python-gdal libsqlite3-dev -y


echo "Installing more Mapnik dependencies"
wget http://www.freedesktop.org/software/harfbuzz/release/harfbuzz-0.9.37.tar.bz2
tar xf harfbuzz-0.9.37.tar.bz2
cd harfbuzz-0.9.37
./configure
make
sudo make install
sudo ldconfig
cd ..

echo "Installing Mapnik"
git clone https://github.com/mapnik/mapnik 
cd mapnik
./configure
JOBS=8 make
sudo make install
cd ..


echo 'Install done.'