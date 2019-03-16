#!/bin/bash

if [[ $@ -eq 0 ]] ; then
	echo "Provide a quoted commit string"
	exit 1
fi
 git commit -am "$1"
 git push
