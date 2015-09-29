#!/bin/bash

MAINLOG=get_logs.log

# get docker logs
docker ps -q | while read -r container_id ; do

	# get keys
	LOGPATH=$(docker inspect $container_id | jq .[0].LogPath)
	NAME=$(docker inspect $container_id | jq .[0].Name)
	LOGFILE=$(echo "$LOGPATH" | tr -d '"')


	# concat to log
	echo "#######################################################################################" >> $MAINLOG
	echo $NAME >> $MAINLOG
	echo "#######################################################################################" >> $MAINLOG
	echo "#######################################################################################" >> $MAINLOG

	cat $LOGFILE | while read -r log_line ; do

		# echo $log_line

		log_text=$(echo $log_line | jq .log | tr -d '"')
		log_time=$(echo $log_line | jq .time | tr -d '"')

		IFS='.' read -a myarray <<< "$log_time"
		pretty_log_time=${myarray[0]}
		
		# echo $log_text
		echo $pretty_log_time "|    " $log_text >> $MAINLOG

	done

	
	# cat $LOGFILE >> $MAINLOG
	echo  $'\n\n\n\n\n\n\n\n\n\n' >> $MAINLOG

done

# open, remove
rsub $MAINLOG
rm $MAINLOG
