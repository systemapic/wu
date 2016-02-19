#!/bin/bash

cat << EOF | `dirname $0`/enter_db.sh
alter system set log_statement to 'all';
select pg_reload_conf();
EOF
