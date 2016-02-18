#!/bin/bash

set -o pipefail

if [ -z "$3" ]; then
	echo "Usage: $0 <shapefile> <table> <database> [<srid>] [<encoding_switches>]" >&2
	exit 1 # missing args
fi
SHAPEFILE=$1
TABLE=$2
export PGDATABASE=$3
SRID="-s $4"
if [ "$4" == "" ]; then SRID=""; fi
ENCODING=$5

# get config
. /systemapic/config/env.sh || exit 1


# env
export PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD 
export PGUSER=$SYSTEMAPIC_PGSQL_USERNAME
export PGHOST=postgis

# error file
TIMESTAMP=$(date +"%s")

function import_latin_encoding() {

	# import with LATIN1 encoding
	echo "Importing with LATIN1 encoding..."
	ENCODING="-W 'LATIN1'"

	# import again
	import
}

function import() {

	# import shapefile
	shp2pgsql -t 2D -D $SRID $ENCODING "$SHAPEFILE" $TABLE | psql -q --set ON_ERROR_STOP=1
	if [ "$?" != 0 ]; then
		echo "Import failed with encoding $ENCODING"
		if ! expr "$ENCODING" : '.*LATIN1' > /dev/null; then
			echo "Will try with latin encoding"
	    		# import with LATIN1 encoding
	    		import_latin_encoding
		else
			return 1
		fi
	else
		echo "Import succeeded with encoding $ENCODING"
	fi
}


function clean_up() {
	echo "Cleaning up"
}


echo "    Importing SHAPFILE DEBUG!"
echo "    Shapfile: $SHAPEFILE"
echo "    DATABASE: $DATABASE"
echo "    TABLE: $TABLE"

trap 'clean_up' EXIT

# import shapefile to postgis
import
