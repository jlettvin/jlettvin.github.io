#!/bin/bash

if [[ $# -eq 0 ]] ; then
	echo "Single argument (project name) must be provided"
	exit 1
else
	git submodule add https://github.com/jlettvin/$1 $1
	git add $1
	git push
fi
