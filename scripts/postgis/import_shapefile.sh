#!/bin/bash

if [ "$1" == "" ]; then
	exit 1 # missing args
fi

if [ "$2" == "" ]; then
	exit 1 # missing args
fi

if [ "$3" == "" ]; then
	exit 1 # missing args
fi



# get config
source /systemapic/config/env.sh

# env
SHAPEFILE=$1
TABLE=$2
DATABASE=$3
PGHOST=postgis
ENCODING=$5
SRID="-s $4"
if [ "$4" == "" ]; then SRID=""; fi


function check_errors() {

	# ERROR: encoding
	if grep -q 'LATIN' ./shp2pgsql.error ; then
	    	
	    	# import with LATIN1 encoding
	    	import_latin_encoding

	# ERROR: Geometry has Z dimension but column does not"
	elif grep -q 'We have a Multipolygon' ./shp2pgsql.error ; then
		# See https://github.com/systemapic/wu/issues/342
		echo "TODO: support this"
	fi
}

function import_latin_encoding() {

	# import with LATIN1 encoding
	echo "Importing with LATIN1 encoding..."
	ENCODING="-W 'LATIN1"
	shp2pgsql -D $SRID $ENCODING "$SHAPEFILE" $TABLE 2>./shp2pgsql.error | PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -q --host=$PGHOST --username=$SYSTEMAPIC_PGSQL_USERNAME $DATABASE

	# check for erros
	check_errors
}


function import() {

	# import shapefile
	shp2pgsql -D $SRID $ENCODING "$SHAPEFILE" $TABLE 2>./shp2pgsql.error | PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -q --host=$PGHOST --username=$SYSTEMAPIC_PGSQL_USERNAME $DATABASE

	# check for errors
	check_errors
}



echo "    Importing SHAPFILE DEBUG!"
echo "    Shapfile: $SHAPEFILE"
echo "    DATABSE: $DATABSE"
echo "    TABLE: $TABLE"

# import shapefile to postgis
import
