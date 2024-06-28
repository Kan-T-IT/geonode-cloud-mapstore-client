#!/bin/bash

cd geonode_mapstore_client/client
node -v
npm -v

npm install --legacy-peer-deps

npm run compile

npm start

