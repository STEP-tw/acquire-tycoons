#!/bin/bash

function exit_with_1 () {
  echo $1 
  exit 1
}

npm run test
if [ "$?" -ne 0 ]; then
  exit_with_1 "failing tests"
fi

npm run coverage && nyc check-coverage
if [ "$?" -ne 0 ]; then
  exit_with_1 "Coverage below 90"
fi
npm run lint
if [ "$?" -ne 0 ]; then
  exit_with_1 "Syntax errors"
fi
UNSTAGED_CHANGES=$(git diff)

if [ -n "$UNSTAGED_CHANGES" ]; then
   exit_with_1 "unstaged changes"
fi

exit 0