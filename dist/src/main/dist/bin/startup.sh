#!/usr/bin/env bash

NOTO_HOME=..

# set MaxDirectMemorySize for orientdb
# see http://orientdb.com/docs/2.1/Release-2.2.0.html
java -classpath "$NOTO_HOME/lib/*" \
     -Dlogback.configurationFile="$NOTO_HOME/conf/logback.xml" \
     -XX:MaxDirectMemorySize=512g \
     com.notononoto.Notononoto "$NOTO_HOME"