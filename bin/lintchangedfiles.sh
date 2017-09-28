#!/bin/bash

COMMIT=`git merge-base origin/master HEAD`
FILE_STRING=`git diff --name-only $COMMIT | grep \.js | grep -v \.json;`

declare -a LIST=( $FILE_STRING )

for f in "${LIST[@]}"
do
    ./node_modules/.bin/eslint $f
done
