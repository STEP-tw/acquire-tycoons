#!/bin/bash

cp .github/git_precommit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
cp .github/git_precommit.sh .git/hooks/pre-push
chmod +x .git/hooks/pre-push
git config --local commit.template '.github/git_commit_template'
npm install