#!/bin/bash

# Exit immediately if any command fails
set -e

# Navigate to the directory where your Nest.js project resides
cd ~/techstack/dev/trader_matrix_api

git stash
# Pull the latest changes from the GitHub repository
git pull 

pnpm install

echo "Building the react app"
cd client

npm install
npm run start:prod

cd ..
echo "Building and starting the nest app"

pm2 start ecosystem.config.cjs