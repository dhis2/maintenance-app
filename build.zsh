#!/usr/bin/env zsh
[ "${ZSH_VERSION:-}" = "" ] && echo >&2 "Only works with zsh" && exit 1

pushd legacy
yarn install
rm -rd output
yarn rollup -c
popd

rm -rd modern/src/legacy/
cp -r legacy/output modern/src/legacy

pushd modern
yarn install
BROWSER=fx-dhis2 yarn start
popd
