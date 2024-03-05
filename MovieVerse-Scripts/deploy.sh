#!/bin/bash

echo "Starting deployment..."

echo "Building the application..."
npm run build

# This information is not published to GitHub for security reasons - so be sure to replace with your own values.
REMOTE_USER=username
REMOTE_HOST=hostname
REMOTE_PATH=/path/to/deployment
REMOTE_PATH_BACKUP=/path/to/backup

echo "Copying files to the remote server..."
scp -r ./dist $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH

echo "Deployment complete."
