@echo off
echo Deploying MovieVerse application...
cd /d C:\Webstorm-Projects\MovieVerse
git pull origin main
npm install
npm run build
echo Deployment completed successfully.
