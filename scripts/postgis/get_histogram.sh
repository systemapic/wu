#!/bin/bash

if [ "$1" == "" ]; then
	echo "Must provide database as first argument,"
	echo ""
	echo "Usage: ./get_histogram.sh DATABASE TABLE COLUMN num_buckets [bar] (if you want to show bar in console)"
	exit 1 # missing args
fi

if [ "$2" == "" ]; then
	echo "Must provide table as second argument,"
	echo ""
	exit 1 # missing args
fi

if [ "$3" == "" ]; then
	echo "Must provide column as third argument,"
	echo ""
	exit 1 # missing args
fi

if [ "$4" == "" ]; then
	BUCKETS=50
else 
	BUCKETS=$4
fi

# get config
source /systemapic/config/env.sh
# echo $SYSTEMAPIC_PGSQL_USERNAME
# echo $SYSTEMAPIC_PGSQL_PASSWORD
# echo $SYSTEMAPIC_PGSQL_DBNAME


# set -f
if [ "$5" == "bar" ]; then

	# with bars (for terminal fun)
	PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -U $SYSTEMAPIC_PGSQL_USERNAME -d $1 -h postgis -c 'with column_stats as (
	    select min("'$3'") as min,
	           max("'$3'") as max
	      from '$2'
	),
	     histogram as (
	   select width_bucket("'$3'", min, max, '$BUCKETS') as bucket,
	          int8range(min("'$3'")::int, max("'$3'")::int, '"'"'[]'"'"') as range,
	          min("'$3'") as range_min,
	          max("'$3'") as range_max,
	          count(*) as freq
	     from '$2', column_stats
	 group by bucket
	 order by bucket
	)
	select bucket, range, freq, range_min, range_max, repeat('"'"'*'"'"', (freq::float / max(freq) over() * 30)::int) as bar from histogram;'

else 

	PGPASSWORD=$SYSTEMAPIC_PGSQL_PASSWORD psql -U $SYSTEMAPIC_PGSQL_USERNAME -d $1 -h postgis -c 'select row_to_json(t) from (with column_stats as (
	    select min("'$3'") as min,
	           max("'$3'") as max
	      from '$2'
	),
	     histogram as (
	   select width_bucket("'$3'", min, max, '$BUCKETS') as bucket,
	          int4range(min("'$3'")::int, max("'$3'")::int, '"'"'[]'"'"') as range,
	          min("'$3'") as range_min,
	          max("'$3'") as range_max,
	          count(*) as freq
	     from '$2', column_stats
	 group by bucket
	 order by bucket
	)
	select bucket, range, freq, range_min, range_max from histogram) t;'
fi

