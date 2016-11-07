#!/usr/bin/env bash

get_proc_info() {
    echo "$(ps aux | grep -v grep | grep Notononoto)"
}

proc_info=$(get_proc_info)
if [ -z "$proc_info" ]; then
    echo "No active server instance found"
    exit 0
fi

set $proc_info
proc_pid=$2
echo "Proc pid is $proc_pid"

# Shutdown application. This algorithm works only when one
# instance on Notononoto server running. For now it's ok
kill $proc_pid

proc_info=$(get_proc_info)
i=0
while [ -n "$proc_info" ] && [ $i -lt 30 ]; do
    echo "Wait for server shutdown..."
    sleep 2
    i=$[$i+1]
    proc_info=$(get_proc_info)
done

if [ -n "$proc_info" ]; then
    echo "Force kill server..."
    kill -9 $proc_pid
fi

echo "Notononoto stopped"