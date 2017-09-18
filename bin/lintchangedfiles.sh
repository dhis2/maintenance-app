#!/bin/bash

# Run eslint on all js files that have been changed since
# the branch was created, including untracked js files

COMMON_COMMIT=`git merge-base origin/master HEAD`
CHANGED_JS_FILES=`git diff --name-only $COMMON_COMMIT -- '*.js'`
ALL_UNTRACKED_FILES=`git status -s | sed "s/\?\? //g" | sed "s/[M|D|A] //g"`

declare -a LIST=( $ALL_UNTRACKED_FILES )
for f in "${LIST[@]}"
do
    if [[ "$f" =~ \.js$ ]] ; then
        UNTRACKED_JS_FILES="$UNTRACKED_JS_FILES $f"
    fi
done

ALL_LINT_FILES="$CHANGED_JS_FILES $UNTRACKED_JS_FILES"
TRIMMED_LINT_FILES=${ALL_LINT_FILES%% }

if [ "$TRIMMED_LINT_FILES" ];then
    ./node_modules/.bin/eslint $TRIMMED_LINT_FILES
else
    echo "Nothing to lint"
fi
