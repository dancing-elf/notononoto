#!/usr/bin/env bash

NOTO_HOME=..

java -classpath "$NOTO_HOME/lib/*" \
     -Dlogback.configurationFile="$NOTO_HOME/conf/logback.xml" \
     com.notononoto.Notononoto "$NOTO_HOME"