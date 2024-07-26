#!/bin/bash

set -e

if [ $# -ne 1 ]; then
  echo "Please specify a single argument which is a MovieVerse version (e.g. 3.1.45)"
  exit
fi

VERSION=$1
SHA=$(jq -r ".releases.\"${VERSION}\"" emscripten-releases-tags.json)
URL=$(jq -r '.Records[0] | "https://\(.s3.bucket.name).s3.\(.awsRegion).amazonaws.com/\(.s3.object.key)"')

wget $URL -O arm64.tar.xz
gsutil cp -n arm64.tar.xz gs://webassembly/emscripten-releases-builds/linux/${SHA}/wasm-binaries-arm64.tar.xz
sed -i "s/\"latest-arm64-linux\": \".*\"/\"latest-arm64-linux\": \"$VERSION\"/" emscripten-releases-tags.json

echo "done"
