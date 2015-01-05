#!/bin/bash

echo "Install script for Mapnik."
echo "Please make sure you are in a working directory. All dependencies will be installed here."
read -p "Are you ready to continue? <y/N> " prompt
if [[ $prompt == "y" || $prompt == "Y" || $prompt == "yes" || $prompt == "Yes" ]]
then
  # http://stackoverflow.com/questions/1537673/how-do-i-forward-parameters-to-other-command-in-bash-script

echo "Installing Mapnik"
sudo add-apt-repository ppa:mapnik/boost
sudo apt-get update
sudo apt-get install libboost-dev libboost-filesystem-dev libboost-program-options-dev libboost-python-dev libboost-regex-dev libboost-system-dev libboost-thread-dev 
apt-get update
apt-get upgrade

echo "Installing dependencies"
apt-get install libtiff5 libtiff5-dev
sudo apt-get install \
    libboost-filesystem-dev \
    libboost-program-options-dev \
    libboost-python-dev libboost-regex-dev \
    libboost-system-dev libboost-thread-dev

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
    libgdal1-dev python-gdal libsqlite3-dev


echo "Installing more dependencies"
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



else
  exit 0
fi

