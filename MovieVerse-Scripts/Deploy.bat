@echo off
echo Deploying MovieVerse application...
cd /d C:\path\to\MovieVerse
git pull origin main
npm install
npm run build
echo Deployment completed successfully.
